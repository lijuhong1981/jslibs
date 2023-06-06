/**
 * 判断两个数组内部值是否相等
 * @param {Array} left
 * @param {Array} right
 * @returns {Boolean}
 */
function equalsArray(left, right) {
    if (left === right)
        return true;
    if (!Array.isArray(left)) {
        console.warn('The left value is not Array.', left);
        return false;
    }
    if (!Array.isArray(right)) {
        console.warn('The right value is not Array.', right);
        return false;
    }
    if (left.length !== right.length)
        return false;
    for (let i = 0; i < left.length; i++) {
        if (Array.isArray(left[i])) {
            if (!equalsArray(left[i], right[i]))
                return false;
        } else if (left[i] !== right[i])
            return false;
    }
    return true;
};

export default equalsArray;