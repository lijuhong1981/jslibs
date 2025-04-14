/**
 * 自动判断传入的数值类型并转换为数字
 * @param {Number|String} value
 * @returns {Number}
 */
function parseNumber(value) {
    if (typeof value === 'string') {
        return parseFloat(value);
    } else if (typeof value === 'number') {
        return value;
    } else {
        throw new Error('unable parse the ' + value + ' to number.');
    }
}

export default parseNumber;
export { parseNumber };