import CircularJSON from 'circular-json-es6';
import path from 'path';

/**
 * Stringify/parse data using CircularJSON.
 */

export const UNDEFINED = '__vision_devtools_undefined__';
export const INFINITY = '__vision_devtools_infinity__';

export const stringify = function (data) {
    return CircularJSON.stringify(data);
    // return CircularJSON.stringify(data, (key, val) => {
    //     if (var === undefined)
    //         return UNDEFINED;
    //     else
    // });
};

export const parse = function (data) {
    return CircularJSON.parse(data);
};

// Use a custom basename functions instead of the shimed version
// because it doesn't work on Windows
export const basename = (filename, ext) => path.basename(
    filename.replace(/^[a-zA-Z]:/, '').replace(/\\/g, '/'),
    ext
);

export const mapComponents = (components) => {
    const result = {};
    components.forEach((component) => result[component.name] = component);
    return result;
};
