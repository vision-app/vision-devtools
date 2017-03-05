import * as _ from '../util';
import { highlight, unhighlight } from './highlighter';
import { getInstanceVNode } from './vnode';

let bridge;
// Vision supports only one rootInstance;
// const rootInstances = [];
let rootInstance;
let inspectedInstanceId;

const filter = '';
const instanceMap = new Map();

/**
 * Mark an instance as captured and store it in the instance map.
 * @param {Vue} instance
 */
const mark = (instance) => {
    if (instanceMap.has(instance._uid))
        return;

    instanceMap.set(instance._uid, instance);
    instance.$on('hook:beforeDestroy', () => instanceMap.delete(instance._uid));
};

const getInstanceName = (instance) => {
    const name = instance.$options.name || instance.$options._componentTag;
    if (name)
        return name;

    const file = instance.$options.__file; // injected by vue-loader
    if (file)
        return _.basename(file, '.vue');

    return instance.$root === instance ? 'root' : 'anonymous';
};

/**
 * Capture the meta information of an instance. (recursive)
 * @param {Vue} instance
 * @return {Object}
 */
const capture = (instance, index, list) => {
    mark(instance);

    const result = {
        id: instance._uid,
        name: getInstanceName(instance),
        children: instance.$children
            .filter((child) => !child._isBeingDestroyed)
            .map(capture),
    };

    // record screen position to ensure correct ordering
    // if ((!list || list.length > 1) && !instance._inactive) {
    //     const rect = getInstanceReact(instance);
    //     result.top = rect ? rect.top : Infinity;
    // } else
    //     result.top = Infinity;

    // check if instance is available in console
    // const consoleId = consoleBoundInstances.indexOf(instance._uid);

    return result;
};

/**
 * Iterate through an array of instances and flatten it into
 * an array of qualified instances. This is a depth-first
 * traversal - e.g. if an instance is not matched, we will
 * recursively go deeper until a qualified child is found.
 * @param {Array} instances
 * @return {Array}
 */
const findQualifiedChildrenFromList = (instances) => {
    instances = instances.filter((child) => !child._isBeingDestroyed);
    return instances.map(capture); // !.filter ? instances.map(capture)
};

/**
 * @param {number} id
 */
const getInstanceDetails = (id) => {
    const instance = instanceMap.get(id);
    if (!instance)
        return null;
    else {
        return {
            id,
            name: getInstanceName(instance),
        };
    }
};

/**
 * Called on every Vue.js batcher flush cycle.
 * Capture current component tree structure and the state
 * of the current inspected instance (if present) and
 * send it to the devtools.
 */
export const flush = () => {
    const payload = _.stringify({
        rootInstance: findQualifiedChildrenFromList([rootInstance])[0],
        // inspectedInstance: getInstanceDetails(inspectedInstanceId),
        rootInstanceVNode: getInstanceVNode(rootInstance),
    });
    bridge.send('flush', payload);
};

/**
 * DOM walk helper
 * @QUESTION: Why not use element
 * @param {NodeList} nodes
 * @param {Function} fn
 */
const walk = (node, fn) => {
    if (!node.children)
        return;
    Array.from(node.children).forEach((node) =>
        !fn(node) && walk(node, fn)
    );
};

/**
 * Scan the page for root level Vue instance.
 * @QUESTION: What is fragment instance
 */
export const scan = () => {
    walk(document, (node) => {
        const instance = node.__vue__;
        if (instance)
            return rootInstance = instance;
    });
    flush();
};

export const init = (_bridge) => {
    bridge = _bridge;
    // bridge.on('inspect-instance', (id) => {
    //     inspectedInstanceId = id;
    //     const instance = instanceMap.get(id);
    //     if (instance)
    //         highlight(instance);
    // });
    bridge.on('enter-instance', (id) => highlight(instanceMap.get(id)));
    bridge.on('leave-instance', unhighlight);

    scan();
};
