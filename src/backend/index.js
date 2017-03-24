// This is the backend that is injected into the page that a Vue app lives in
// when the Vision Devtools panel is activated.

import Bridge from '../bridge';
import * as inst from './inst';
import * as ctor from './ctor';

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
            hook.once('init', this.connect);
    },
    connect() {
        bridge.log('backend ready.');
        bridge.send('ready', hook.Vue.version);
        console.info('[vision-devtools] Ready. Detected Vue v' + hook.Vue.version);
        ctor.init(bridge);
        inst.init(bridge);
    },
};
backend.start();
