import { RADIANS_PER_DEGREE } from "./Constant.js";

/**
 * 角度转弧度
 * @param {Number} degrees 角度
 * @returns {Number} 弧度
 */
function degreesToRadians(degrees) {
    return degrees * RADIANS_PER_DEGREE;
};

export default degreesToRadians;
export { degreesToRadians };