/**
 * 四舍五入一个数值至指定的小数位数
 * @param {Number} value 传入的数值 
 * @param {Number} decimalNumber 小数位数
 * @returns {Number}
 */
function toFixed(value, decimalNumber = 2) {
    return parseFloat(value.toFixed(decimalNumber));
}

export default toFixed;