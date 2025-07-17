import equalsObject from "./equalsObject.js";

/**
 * 判断两个数组内部值是否相等
 * @param {Array} left
 * @param {Array} right
 * @returns {boolean}
 */
function equalsArray(left, right) {
    if (!Array.isArray(left)) {
        console.warn('The left value is not Array.', left);
        return false;
    }
    if (!Array.isArray(right)) {
        console.warn('The right value is not Array.', right);
        return false;
    }
    if (left === right)
        return true;
    if (left.length !== right.length)
        return false;
    for (let i = 0; i < left.length; i++) {
        if (Array.isArray(left[i]) && !equalsArray(left[i], right[i]))
            return false;
        else if (typeof left[i] === 'object' && !equalsObject(left[i], right[i]))
            return false;
        else if (left[i] !== right[i])
            return false;
    }
    return true;
};

export default equalsArray;
export { equalsArray };