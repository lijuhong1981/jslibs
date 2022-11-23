/**
 * 将一个数值约束在两个数值之间
 * @param {Number} value 需要约束的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @returns {Number} 约束后的数值
 */
function clamp(value, rangeMinimum, rangeMaximum) {
    return value < rangeMinimum ? rangeMinimum : value > rangeMaximum ? rangeMaximum : value;
};

export default clamp;