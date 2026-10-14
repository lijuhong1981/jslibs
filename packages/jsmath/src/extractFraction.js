/**
 * 从一个数值中提取小数部分
 * @param {Number} value 传入的数值
 * @returns {Number} 提取的小数
 */
function extractFraction(value) {
    return value - Math.trunc(value);
};

export default extractFraction;
export { extractFraction };