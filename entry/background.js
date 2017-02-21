// the background script runs all the time and serves as a central message
// hub for each vision devtools (panel + proxy + backend) instance.

const ports = {};

const isNumeric = (str) => str === +str + '';

const installProxy = function (id) {
    chrome.tabs.executeScript(id, { file: 'entry/proxy.js' }, (res) => {
        if (!res)
            ports[id].devtools.postMessage('proxy-fail');
        else
            console.info('injected proxy to tab', id);
    });
};

const doublePipe = function (id, a, b) {
    const onAMessage = function (message) {
        if (message.event === 'log')
            return console.info('tab ' + id, message.payload);
        console.info('devtools -> backend', message);
        b.postMessage(message);
    };
    a.onMessage.addListener(onAMessage);

    const onBMessage = function (message) {
        if (message.event === 'log')
            return console.info('tab ' + id, message.payload);
        console.info('backend -> devtools', message);
        a.postMessage(message);
    };
    b.onMessage.addListener(onBMessage);

    const shutdown = function () {
        console.info('tab ' + id, 'disconnected.');
        a.onMessage.removeListener(onAMessage);
        b.onMessage.removeListener(onBMessage);
        a.disconnect();
        b.disconnect();
        ports[id] = null;
    };
    a.onDisconnect.addListener(shutdown);
    b.onDisconnect.addListener(shutdown);
    console.info('tab ' + id, 'connected.');
};

chrome.runtime.onConnect.addListener((port) => {
    let id, type;
    if (isNumeric(port.name)) {
        id = port.name;
        type = 'devtools';
        installProxy(+id);
    } else {
        id = port.sender.tab.id;
        type = 'backend';
    }

    if (!ports[id]) {
        ports[id] = {
            devtools: null,
            backend: null,
        };
    }

    ports[id][type] = port;

    if (ports[id].devtools && ports[id].backend)
        doublePipe(id, ports[id].devtools, ports[id].backend);
});

chrome.runtime.onMessage.addListener((req, sender) => {
    if (sender.tab && req.vueDetected) {
        chrome.browserAction.setIcon({
            tabId: sender.tab.id,
            path: 'assets/logo-32.png',
        });
    }
});
