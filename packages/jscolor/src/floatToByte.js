/**
 * 将范围为 0 到 1.0 的 'float' 颜色分量转换为范围为 0 到 255 的 'byte' 颜色分量。
 *
 * @param {Number} number 需要转换的数值。
 * @returns {Number} 转换后的数值。
 */
function floatToByte(number) {
    return number === 1.0 ? 255.0 : (number * 256.0) | 0;
};

export default floatToByte;
export { floatToByte };