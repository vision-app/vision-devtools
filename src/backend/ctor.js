const vueHotMap = window.__VUE_HOT_MAP__;
const ctors = {};
let bridge;

const scan = () => {
    Object.keys(vueHotMap).forEach((key) => {
        const Ctor = vueHotMap[key].Ctor;
        ctors[key] = {
            id: key,
            name: Ctor.options.name,
            file: Ctor.options.__file,
        };
    });
};

export const init = (_bridge) => {
    bridge = _bridge;

    scan();
    bridge.send('scan-ctors', ctors);
};
