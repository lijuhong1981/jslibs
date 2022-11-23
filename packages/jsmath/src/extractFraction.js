/**
 * 从一个数值中提取小数部分
 * @param {Number} value 传入的数值
 * @returns {Number} 提取的小数
 */
function extractFraction(value) {
    value = value.toString();
    const arr = value.split('.');
    if (arr.length === 2)
        return parseFloat('0.' + arr[1]);
    else
        return 0.0;
};

export default extractFraction;