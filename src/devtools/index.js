import Vue from 'vue';
import App from './app.vue';
import store from './store';
import Bridge from '../bridge';

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

let app;
const devtools = {
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
    start() {
        this.connect();
        app = new App({
            store,
        }).$mount('#container');

        // onReload
        // chrome.devtools.network.onNavigated.addListener(() => app && app.$destroy());
    },
    init() {
        bridge.on('flush', () =>
            console.log('flushed!!!'));
    },
};
devtools.start();
