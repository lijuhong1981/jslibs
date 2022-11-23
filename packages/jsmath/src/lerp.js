import clamp from "./clamp.js";

/**
 * 在两个数值之间线性插值
 * @param {Number} start 开始数值
 * @param {Number} end 结束数值
 * @param {Number} scalar 插值标量，needClamp为true时约束在[0,1]区间内，为false时可超出[0,1]区间
 * @param {Boolean} needClamp 是否需要约束插值，默认true
 * @returns {Number} 插值结果
 */
function lerp(start, end, scalar, needClamp = true) {
    if (needClamp)
        scalar = clamp(scalar, 0, 1);
    return start + (end - start) * scalar;
};

export default lerp;