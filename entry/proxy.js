// This is a content-script that is injected only when the devtools are
// activated. Because it is not injected using eval, it has full privilege
// to the chrome runtime API. It serves as a proxy between the injected
// backend and the Vision devtools panel.

const port = chrome.runtime.connect({
    name: 'content-script',
});

const sendMessageToBackend = function (payload) {
    window.postMessage({
        source: 'vision-devtools-proxy',
        payload,
    }, '*');
};

const sendMessageToDevtools = function (e) {
    if (e.data && e.data.source === 'vision-devtools-backend')
        port.postMessage(e.data.payload);
};

port.onMessage.addListener(sendMessageToBackend);
window.addEventListener('message', sendMessageToDevtools);

port.onDisconnect.addListener(() => {
    window.removeEventListener('message', sendMessageToDevtools);
    sendMessageToBackend('shutdown');
});

sendMessageToBackend('init');
