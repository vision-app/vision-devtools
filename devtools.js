// create new panel for devtools
chrome.devtools.panels.create('Vision', 'assets/logo.png', 'panel.html', (panel) => {

});

chrome.devtools.panels.elements.createSidebarPane('Vision', (sidebar) => {
    sidebar.setExpression('var a = {"a": "test"};a', 'dataa', () => console.log('results'));
});
