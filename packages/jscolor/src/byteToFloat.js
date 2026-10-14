/**
 * 将范围为 0 到 255 的 'byte' 颜色分量转换为范围为 0 到 1.0 的 'float' 颜色分量。
 *
 * @param {Number} number 需要转换的数值。
 * @returns {Number} 转换后的数值。
 */
function byteToFloat(number) {
    return number / 255.0;
};

export default byteToFloat;
export { byteToFloat };