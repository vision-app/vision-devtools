import * as _ from '../util';

let bridge;
const rootInstances = [];

export const init = (_bridge) => {
    bridge = _bridge;
    scan();
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
    Array.prototype.forEach.call(node.children, (node) =>
        !fn(node) && walk(node, fn));
};

/**
 * Scan the page for root level Vue instances.
 * @QUESTION: What is fragment instance
 */
export const scan = () => {
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
    flush();
};

/**
 * Called on every Vue.js batcher flush cycle.
 * Capture current component tree structure and the state
 * of the current inspected instance (if present) and
 * send it to the devtools.
 */
export const flush = () => {
    const payload = _.stringify({
        instances: findQualifiedChildrenFromList(rootInstances),
        // inspectedInstance: getInstanceDetails(currentIns)
    });
    bridge.send('flush', payload);
};

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
        inactive: !!instance._inactive,
        isFragment: !!instance._isFragment,
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

const getInstanceName = (instance) => {
    const name = instance.$options.name || instance.$options._componentTag;
    if (name)
        return name;

    const file = instance.$options.__file; // injected by vue-loader
    if (file)
        return _.basename(file, '.vue');

    return instance.$root === instance ? 'root' : 'anonymous';
};
