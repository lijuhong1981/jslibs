/**
 * 将一个数值约束在两个数值之间
 * @param {Number} value 需要约束的数值
 * @param {Number} min 较小数
 * @param {Number} max 较大数
 * @returns {Number} 约束后的数值
 */
function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
};

export default clamp;
export { clamp };