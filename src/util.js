import CircularJSON from 'circular-json-es6';

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
