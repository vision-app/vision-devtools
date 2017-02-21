// This is the devtools script, which is called when the user opens the
// Chrome devtool on a page. We check to see if we global hook has detected
// Vue presence on the page. If yes, create the Vue panel; otherwise poll
// for 10 seconds.

let checkCount = 0;

const createPanelIfHasVue = function () {
    chrome.devtools.inspectedWindow.eval(
        '!!(window.__VISION_DEVTOOLS_GLOBAL_HOOK__.Vue)',
        (hasVue) => {
            if (!hasVue) {
                checkCount++;
                return checkCount < 10 && setTimeout(createPanelIfHasVue, 1000);
            }

            chrome.devtools.panels.create('Vision', 'assets/logo-256.png', 'src/devtools/index.html', (panel) => { /* panel loaded */ });
        }
    );
};

// chrome.devtools.network.onNavigated.addListener(createPanelIfHasVue);
createPanelIfHasVue();
