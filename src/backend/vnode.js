const capture = (vnode) => {
    const result = {
        type: 'empty',
        tag: vnode.tag,
        text: vnode.text,
        isCloned: vnode.isCloned,
        isComment: vnode.isComment,
        isOnce: vnode.isOnce,
        isRootInsert: vnode.isRootInsert,
        isStatic: vnode.isStatic,
    };

    if (vnode.text) {
        if (vnode.text.trim()) {
            result.type = 'text';
            result.content = `"${result.text}"`;
        } else
            result.type = 'empty';
    } else if (vnode.componentInstance) {
        result.type = 'component';
        result.id = vnode.componentInstance._uid;
        result.tag = vnode.componentOptions.tag;
        result.vnode = capture(vnode.componentInstance._vnode);
        result.propsData = vnode.componentOptions.propsData;
        result.content = `<${result.tag}>`;
    } else {
        result.type = 'element';
        result.content = `<${result.tag}>`;
    }

    result.children = vnode.children && vnode.children.map(capture)
        .filter((vnode) => vnode.type !== 'empty');

    return result;
};

export const getInstanceVNode = function (instance) {
    return capture(instance._vnode);
};
