/**
 * 从字符串中提取数字
 * @param {String} value
 * @returns {String}
 */
function extractNumber(value) {
    const arr = value.match(/\d+(.\d+)?/g);
    if (arr) {
        if (arr.length === 1)
            return arr[0];
        else
            return arr;
    };
};

export default extractNumber;
export { extractNumber };