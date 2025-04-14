/**
 * 产生一个随机数，可指定随机范围
 * @param {Number} rangeMinimum 最小数，默认0
 * @param {Number} rangeMaximum 最大数，默认Number.MAX_SAFE_INTEGER
 * @returns {Number} 生成的随机数
 */
function randomNumber(rangeMinimum = 0, rangeMaximum = Number.MAX_SAFE_INTEGER) {
    return Math.random() * (rangeMaximum - rangeMinimum) + rangeMinimum;
};

export default randomNumber;
export { randomNumber };