import scalarInRange from "./scalarInRange.js";

/**
 * 计算一个数值在两个数值范围内的线性插值标准量
 * 结果范围为[0, 1]区间
 * @param {Number} value 需要计算的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @returns {Number} 插值标量
 */
function normalize(value, rangeMinimum, rangeMaximum) {
    return scalarInRange(value, rangeMinimum, rangeMaximum, true);
};

export default normalize;
export { normalize };