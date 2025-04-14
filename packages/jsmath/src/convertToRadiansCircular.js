import convertToRange from "./convertToRange.js";
import { TWO_PI } from "./Constant.js";

/**
 * 转换一个弧度至一个圆周范围内
 * @param {Number} radians 需要转换的弧度
 * @param {Number} minValue 圆周起始弧度，默认0
 * @returns {Number} 转换后的弧度
 */
function convertToRadiansCircular(radians, minValue = 0) {
    return convertToRange(radians, minValue, minValue + TWO_PI);
};

export default convertToRadiansCircular;
export { convertToRadiansCircular };