// the background script runs all the time and serves as a central message
// hub for each vision devtools (panel + proxy + backend) instance.

const ports = {};

const isNumeric = (str) => str === +str + '';

chrome.runtime.onConnect.addListener((port) => {
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
});
