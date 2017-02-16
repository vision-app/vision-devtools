// the background script runs all the time and serves as a central message
// hub for each vision devtools (panel + proxy + backend) instance.

const ports = {};

const isNumeric = (str) => str === +str + '';

const installProxy = function (tabId) {
    chrome.tabs.executeScript(tabId, { file: 'entry/proxy.js' }, (res) => {
        if (!res)
            ports[tabId].devtools.postMessage('proxy-fail');
        else
            console.info('injected proxy to tab', tabId);
    });
};

chrome.runtime.onConnect.addListener((port) => {
    console.log('port', port);

    let tab;
    let name;
    if (isNumeric(port.name)) {
        tab = port.name;
        name = 'devtools';
        installProxy(+port.name);
    } else {
        tab = port.sender.tab.id;
        name = 'backend';
    }

    if (!ports[tab]) {
        ports[tab] = {
            devtools: null,
            backend: null,
        };
    }

    ports[tab][name] = port;

    // if (ports[tab].devtools && ports[tab].backend)
    //     doublePipe(tab, ports[tab].devtools, ports[tab].backend);
});

chrome.runtime.onMessage.addListener((req, sender) => {
    if (sender.tab && req.vueDetected) {
        chrome.browserAction.setIcon({
            tabId: sender.tab.id,
            path: 'assets/logo-32.png',
        });
    }
});
