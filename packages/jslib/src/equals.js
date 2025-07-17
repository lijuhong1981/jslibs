import equalsArray from "./equalsArray.js";
import equalsObject from "./equalsObject.js";

function equals(left, right) {
    if (left === right) return true;
    if (Array.isArray(left))
        return equalsArray(left, right);
    else if (typeof left === 'object')
        return equalsObject(left, right);
};

export default equals;
export { equals };