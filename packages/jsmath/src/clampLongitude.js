import clamp from "./clamp.js";

/**
 * 将一个经度值约束在经度范围内
 * @param {Number} longitude 需要约束的经度值
 * @param {Boolean} degrees 单位，true表示角度单位，false表示弧度单位，默认true
 * @returns {Number} 约束后的经度
 */
function clampLongitude(longitude, degrees = true) {
    if (degrees)
        return clamp(longitude, -180, 180);
    else
        return clamp(longitude, -Math.PI, Math.PI);
};

export default clampLongitude;