/**
 * 判断一个数值是否在两个数值之间
 * @param {Number} value 需要判断的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @param {Boolean} equalsMinimum 可否等于较小数，默认true
 * @param {Boolean} equalsMaximum 可否等于较大数，默认true
 * @returns {Boolean} 判断结果
 */
function isBetween(value, rangeMinimum, rangeMaximum, equalsMinimum = true, equalsMaximum = true) {
    if (equalsMinimum ? value < rangeMinimum : value <= rangeMinimum)
        return false;
    if (equalsMaximum ? value > rangeMaximum : value >= rangeMaximum)
        return false;
    return true;
};

export default isBetween;
export { isBetween };