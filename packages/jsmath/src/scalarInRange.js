import clamp from "./clamp.js";

/**
 * 计算一个数值在两个数值范围内的线性插值标量
 * @param {Number} value 需要计算的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @param {Boolean} needClamp 是否需要约束至0到1之间，默认false
 * @returns {Number} 插值标量
 */
function scalarInRange(value, rangeMinimum, rangeMaximum, needClamp = false) {
    let scalar = (value - rangeMinimum) / (rangeMaximum - rangeMinimum);
    if (needClamp)
        scalar = clamp(scalar, 0, 1);
    return scalar;
};

export default scalarInRange;
export { scalarInRange };