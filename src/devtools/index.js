import Vue from 'vue';
import App from './app.vue';
import store from './store';
import Bridge from '../bridge';
import * as _ from '../util';

/**
 * Inject a globally evaluated script, in the same context with the actual user app.
 * @param {string} scriptName
 * @param {Function} callback
 */
const injectScript = function (scriptName, callback) {
    const src = `
var script = document.constructor.prototype.createElement.call(document, 'script');
script.src = "${scriptName}";
document.documentElement.appendChild(script);
script.parentNode.removeChild(script);
  `;
    chrome.devtools.inspectedWindow.eval(src, (res, err) => {
        if (err)
            console.error(err);

        callback();
    });
};

const mock = {
    listener: undefined,
    addListener(fn) {
        this.listener = fn;
    },
    post(payload) {
        this.listener({
            event: 'post',
            payload,
        });
    },
};

window.bridge = new Bridge({
    listen(fn) {
        mock.addListener(fn);
    },
    send(data) {
        console.info('bridge send:', data);
    },
});

let app;
const devtools = {
    start() {
        if (process.env.NODE_ENV === 'production')
            this.connect();

        app = new App({
            store,
        }).$mount('#container');

        if (process.env.NODE_ENV !== 'production') {
            store.commit('SCAN_CTORS', {
                'data-v-61eddd13': {
                    file: 'ewwewge',
                    id: 'data-v-61eddd13',
                    name: 'v-circular-progress',
                },
                'data-v-14467426': {
                    file: 'aff',
                    id: 'data-v-14467426',
                    name: 'v-linear-progress',
                },
            });
            store.commit('FLUSH', {
                rootInstance: { id: 2, name: 'node2', children: [
                        { id: 123, name: 'node21' },
                        { id: 234, name: 'node22' },
                ] },
            });

            store.commit('SELECT_CONTEXT', {
                type: 'component',
                content: '<root>',
                children: [{
                    type: 'text',
                    text: 'abcde',
                    content: '"abcde"',
                }, {
                    type: 'element',
                    content: '<div>',
                }, {
                    type: 'component',
                    content: '<com>',
                }],
            });
        }
    },
    /**
     * Inject backend, connect to background, and send back the bridge.
     */
    connect() {
        // 1. inject backend code into page
        injectScript(chrome.runtime.getURL('build/backend.js'), () => {
            // 2. connect to background to setup proxy
            const port = chrome.runtime.connect({
                name: '' + chrome.devtools.inspectedWindow.tabId,
            });
            let disconnected = false;
            port.onDisconnect.addListener(() => disconnected = true);

            window.bridge = new Bridge({
                listen(fn) {
                    port.onMessage.addListener(fn);
                },
                send(data) {
                    if (!disconnected)
                        port.postMessage(data);
                },
            });

            // 3. send a proxy API to the panel
            this.init();
        });
    },
    init() {
        bridge.on('scan-ctors', (ctors) => {
            store.commit('SCAN_CTORS', ctors);
        });

        bridge.on('flush', (payload) => {
            payload = _.parse(payload);
            store.commit('FLUSH', payload);
            // @DEBUG
            const vnode = payload.rootInstanceVNode.children.find((vnode) => vnode.type === 'component');
            store.commit('SELECT_CONTEXT', vnode.vnode);
        });
    },
};

if (process.env.NODE_ENV === 'production') {
    // onReload
    chrome.devtools.network.onNavigated.addListener(() => {
        app && app.$destroy();
        bridge.removeAllListeners();
        devtools.start();
    });
}
devtools.start();
