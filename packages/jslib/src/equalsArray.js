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
        const leftValue = left[i];
        const rightValue = right[i];
        if (Array.isArray(leftValue) && !equalsArray(leftValue, rightValue))
            return false;
        else if (typeof leftValue === 'object' && !equalsObject(leftValue, rightValue))
            return false;
        else if (leftValue !== rightValue)
            return false;
    }
    return true;
};

export default equalsArray;
export { equalsArray };