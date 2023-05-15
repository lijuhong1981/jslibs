import { DEGREES_PER_RADIAN } from "./Constant.js";

/**
 * 弧度转角度
 * @param {Number} radians 弧度
 * @returns {Number} 角度
 */
function radiansToDegrees(radians) {
    return radians * DEGREES_PER_RADIAN;
}

export default radiansToDegrees;