// this script is injected into every page.
(() => {
    const injectFunction = function (func) {
        const script = document.createElement('script');
        script.textContent = ';(' + func.toString() + ')(window)';
        document.documentElement.appendChild(script);
        script.parentNode.removeChild(script);
    };

    const detact = function (win) {
        setTimeout(() => {
            const hook = window.__VISION_DEVTOOLS_GLOBAL_HOOK__;

            const all = document.querySelectorAll('*');
            const el = Array.prototype.find.call(all, (e) => e.__vue__);
            if (el) {
                let Vue = el.__vue__.constructor;
                while (Vue.super)
                    Vue = Vue.super;

                hook.emit('init', Vue);

                win.postMessage({
                    devtoolsEnabled: Vue.config.devtools,
                    vueDetected: true,
                }, '*');
            }
        }, 100);
    };

    window.addEventListener('message', (e) => {
        if (e.source === window && e.data.vueDetected)
            chrome.runtime.sendMessage(e.data);
    });

    injectFunction(detact);
})();
