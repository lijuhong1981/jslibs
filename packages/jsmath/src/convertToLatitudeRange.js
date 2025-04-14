import { PI_OVER_TWO } from "./Constant.js";

/**
 * 转换一个纬度值至纬度范围内
 * @param {Number} latitude 需要转换的纬度值
 * @param {Boolean} degrees 单位，true表示角度单位，false表示弧度单位，默认true
 * @returns {Number} 转换后的纬度
 */
function convertToLatitudeRange(latitude, degrees = true) {
    if (degrees) {
        while (latitude > 90 || latitude < -90) {
            if (latitude > 90) {
                latitude = 180 - latitude;
            } else if (latitude < -90) {
                latitude = -180 - latitude;
            }
        }
    } else {
        while (latitude > PI_OVER_TWO || latitude < -PI_OVER_TWO) {
            if (latitude > PI_OVER_TWO) {
                latitude = Math.PI - latitude;
            } else if (latitude < -PI_OVER_TWO) {
                latitude = -Math.PI - latitude;
            }
        }
    }
    return latitude;
};

export default convertToLatitudeRange;
export { convertToLatitudeRange };