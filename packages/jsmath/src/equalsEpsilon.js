/**
 * 比较两个数值是否近似相等
 * @param {Number} left 
 * @param {Number} right
 * @param {Number} epsilon 近似精度，Math.abs(left - right)小于或等于该值时返回true
 * @returns {Boolean}
 */
function equalsEpsilon(left, right, epsilon = 0) {
    return Math.abs(left - right) <= epsilon;
};

export default equalsEpsilon;
export { equalsEpsilon };