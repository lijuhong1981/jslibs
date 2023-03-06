import convertToRange from "./convertToRange.js";

/**
 * 转换一个角度至一个圆周范围内
 * @param {Number} degrees 需要换行的角度
 * @param {Number} minValue 起始角度，默认0
 * @returns {Number} 转换后的角度
 */
function convertToDegreesCircular(degrees, minValue = 0) {
    return convertToRange(degrees, minValue, minValue + 360);
};

export default convertToDegreesCircular;