import { PI_OVER_TWO } from "./Constant.js";
import clamp from "./clamp.js";

/**
 * 将一个纬度值约束在纬度范围内
 * @param {Number} latitude 需要约束的纬度值
 * @param {Boolean} degrees 单位，true表示角度单位，false表示弧度单位，默认true
 * @returns {Number} 约束后的纬度
 */
function clampLatitude(latitude, degrees = true) {
    if (degrees)
        return clamp(latitude, -90, 90);
    else
        return clamp(latitude, -PI_OVER_TWO, PI_OVER_TWO);
};

export default clampLatitude;