// This is the backend that is injected into the page that a Vue app lives in
// when the Vue Devtools panel is activated.

const rootInstances = [];

/**
 * DOM walk helper
 * @QUESTION: Why not use element
 * @param {NodeList} nodes
 * @param {Function} fn
 */
const walk = function (node, fn) {
    if (!node.children)
        return;
    Array.prototype.forEach.call(node.children, (node) =>
        !fn(node) && walk(node, fn));
};

/**
 * Scan the page for root level Vue instances.
 * @QUESTION: What is fragment instance
 */
const scan = function () {
    rootInstances.length = 0;
    let fragment = null;
    walk(document, (node) => {
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
            rootInstances.push(instance);
            return true;
        }
    });
};

// create new panel for devtools
chrome.devtools.panels.create('Vision', 'assets/logo.png', 'panel.html', (panel) => {
    //
});

chrome.devtools.panels.elements.createSidebarPane('Vision', (sidebar) => {
    sidebar.setExpression('var a = {"a": "test"};a', 'dataa', () => console.log('results'));
});

(function initBackend() {
    connect();
})();
