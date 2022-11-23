import convertToRange from "./convertToRange.js";

/**
 * 转换一个经度值至经度范围内
 * @param {Number} longitude 需要转换的经度值
 * @param {Boolean} degrees 单位，true表示角度单位，false表示弧度单位，默认true
 * @returns {Number} 转换后的经度
 */
function convertToLongitudeRange(longitude, degrees = true) {
    if (degrees)
        return convertToRange(longitude, -180, 180);
    else
        return convertToRange(longitude, -Math.PI, Math.PI);
};

export default convertToLongitudeRange;