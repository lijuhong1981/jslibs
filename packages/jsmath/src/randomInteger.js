import randomNumber from "./randomNumber.js";

/**
 * 产生一个随机整数，可指定随机范围
 * @param {Number} rangeMinimum 最小整数，默认0
 * @param {Number} rangeMaximum 最大整数，默认Number.MAX_SAFE_INTEGER
 * @returns {Integer} 生成的随机整数
 */
function randomInteger(rangeMinimum = 0, rangeMaximum = Number.MAX_SAFE_INTEGER - 1) {
    return Math.floor(randomNumber(rangeMinimum, rangeMaximum + 1));
};

export default randomInteger;
export { randomInteger };