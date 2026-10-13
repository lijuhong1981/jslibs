import cloneArray from "./cloneArray.js";
import cloneObject from "./cloneObject.js";

function clone(source, config) {
    if (Array.isArray(source))
        return cloneArray(source, config);
    else if (typeof source === 'object' && source !== null)
        return cloneObject(source, config);
    return source;
};

export default clone;
export { clone };
