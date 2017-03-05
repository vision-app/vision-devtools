const overlay = document.createElement('div');
overlay.style.backgroundColor = 'rgba(104, 182, 255, 0.35)';
overlay.style.position = 'fixed';
overlay.style.zIndex = '99999999999999';
overlay.style.pointerEvents = 'none';

export const inDoc = (node) => {
    if (!node)
        return false;

    const doc = node.ownerDocument.documentElement;
    return doc.contains(node);
    // const parent = node.parentNode;
    // return doc === node ||
    //     doc === parent ||
    //     !!(parent && parent.nodeType === 1 && (doc.contains(parent)));
};

export const getInstanceRect = (instance) => {
    if (!inDoc(instance.$el))
        return;

    if (instance.$el.nodeType === 1)
        return instance.$el.getBoundingClientRect();
};

const showOverlay = ({ width = 0, height = 0, left = 0, top = 0 }) => {
    overlay.style.width = +width + 'px';
    overlay.style.height = +height + 'px';
    overlay.style.left = +left + 'px';
    overlay.style.top = +top + 'px';
    document.body.appendChild(overlay);
};

export const highlight = (instance) => {
    if (!instance)
        return;

    const rect = getInstanceRect(instance);
    rect && showOverlay(rect);
};

export const unhighlight = () => overlay.parentElement && document.body.removeChild(overlay);
