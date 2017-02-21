// This is the backend that is injected into the page that a Vue app lives in
// when the Vision Devtools panel is activated.

import Bridge from '../bridge';
import _ from '../util';

let bridge;
// hook should have been injected before this executes.
const hook = window.__VISION_DEVTOOLS_GLOBAL_HOOK__;

const backend = {
    start() {
        const handshake = (e) => {
            if (!(e.data.source === 'vision-devtools-proxy' && e.data.payload === 'init'))
                return;

            window.removeEventListener('message', handshake);

            let listener;
            bridge = new Bridge({
                listen(fn) {
                    listener = (evt) => {
                        if (evt.data.source === 'vision-devtools-proxy' && evt.data.payload)
                            fn(evt.data.payload);
                    };
                    window.addEventListener('message', listener);
                },
                send(data) {
                    window.postMessage({
                        source: 'vision-devtools-backend',
                        payload: data,
                    }, '*');
                },
            });
            bridge.on('shutdown', () => window.removeEventListener('message', listener));

            this.init();
        };
        window.addEventListener('message', handshake);
    },
    init() {
        if (hook.Vue)
            this.connect();
        else
            alert('!!hook.Vue === false');
        // hook.once('init', connect);
    },
    connect() {
        bridge.log('backend ready.');
        bridge.send('ready', hook.Vue.version);
        console.info('[vision-devtools] Ready. Detected Vue v' + hook.Vue.version);
        this.scan();
    },
    rootInstances: [],
    /**
     * DOM walk helper
     * @QUESTION: Why not use element
     * @param {NodeList} nodes
     * @param {Function} fn
     */
    walk(node, fn) {
        if (!node.children)
            return;
        Array.prototype.forEach.call(node.children, (node) =>
            !fn(node) && this.walk(node, fn));
    },
    /**
     * Scan the page for root level Vue instances.
     * @QUESTION: What is fragment instance
     */
    scan() {
        this.rootInstances.length = 0;
        let fragment = null;
        this.walk(document, (node) => {
            if (fragment) {
                if (node === fragment._fragmentEnd)
                    fragment = null;
                else
                    return true;
            }

            const instance = node.__vue__;
            if (instance) {
                if (instance._isFragment)
                    fragment = instance;
                this.rootInstances.push(instance);
                return true;
            }
        });
        this.flush();
    },
    /**
     * Called on every Vue.js batcher flush cycle.
     * Capture current component tree structure and the state
     * of the current inspected instance (if present) and
     * send it to the devtools.
     */
    flush() {
        // const payload = stringify({
        //
        // })
        bridge.send('flush', 'flushed');
    },
};
backend.start();
