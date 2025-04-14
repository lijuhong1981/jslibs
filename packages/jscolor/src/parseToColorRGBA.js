import ColorRGB from "./ColorRGB.js";
import ColorRGBA from "./ColorRGBA.js";

/**
 * 解析为ColorRGBA对象
 * @param {ColorRGB|ColorRGBA|String|Number|Number[]} value 需要解析的值
 * @param {ColorRGBA} result 输入的结果对象，可不传
 * @returns {ColorRGBA} 输出的结果对象
 */
function parseToColorRGBA(value, result) {
    if (value instanceof ColorRGBA) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof ColorRGB) {
        return value.toColorRGBA(1.0, result);
    } else if (typeof value === 'string') {
        return ColorRGBA.fromCssColorString(value, result);
    } else if (typeof value === 'number') {
        return ColorRGBA.fromHexNumber(value, result);
    } else if (Array.isArray(value)) {
        return ColorRGBA.fromArray(value, 0, result);
    } else {
        console.error('unsupported color value:', value);
        throw new Error('unsupported color value:' + value);
    }
};

export default parseToColorRGBA;
export { parseToColorRGBA }