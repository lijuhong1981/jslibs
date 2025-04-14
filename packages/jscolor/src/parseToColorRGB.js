import ColorRGB from "./ColorRGB.js";
import ColorRGBA from "./ColorRGBA.js";

/**
 * 解析为ColorRGB对象
 * @param {ColorRGB|ColorRGBA|String|Number|Number[]} value 需要解析的值
 * @param {ColorRGB} result 输入的结果对象，可不传
 * @returns {ColorRGB} 输出的结果对象
 */
function parseToColorRGB(value, result) {
    if (value instanceof ColorRGB) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof ColorRGBA) {
        return value.toColorRGB(result);
    } else if (typeof value === 'string') {
        return ColorRGB.fromCssColorString(value, result);
    } else if (typeof value === 'number') {
        return ColorRGB.fromHexNumber(value, result);
    } else if (Array.isArray(value)) {
        return ColorRGB.fromArray(value, 0, result);
    } else {
        console.error('unsupported color value:', value);
        throw new Error('unsupported color value:' + value);
    }
};

export default parseToColorRGB;
export { parseToColorRGB }