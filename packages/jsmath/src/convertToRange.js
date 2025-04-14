/**
 * 将一个数值转换至两个数值范围内
 * 如不在范围内则累加或累减范围长度，直至落在范围内
 * @param {Number} value 需要转换的数值
 * @param {Number} rangeMinimum 较小数
 * @param {Number} rangeMaximum 较大数
 * @returns {Number} 转换后的数值
 */
function convertToRange(value, rangeMinimum, rangeMaximum) {
    const length = rangeMaximum - rangeMinimum;
    if (value < rangeMinimum) {
        value += length;
        while (value < rangeMinimum)
            value += length;
    } else if (value > rangeMaximum) {
        value -= length;
        while (value > rangeMaximum)
            value -= length;
    }
    return value;
};

export default convertToRange;
export { convertToRange };