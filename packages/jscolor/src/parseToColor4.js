import Color3 from "./Color3.js";
import Color4 from "./Color4.js";

/**
 * 解析为Color4对象
 * @param {Color3|Color4|String|Number|Number[]} value 需要解析的值
 * @param {Color4} result 输入的结果对象，可不传
 * @returns {Color4} 输出的结果对象
 */
function parseToColor4(value, result) {
    if (value instanceof Color4) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof Color3) {
        return value.toColor4(result);
    } else if (typeof value === 'string') {
        return Color4.fromCssColorString(value, result);
    } else if (typeof value === 'number') {
        return Color4.fromRgbaNumber(value, result);
    } else if (Array.isArray(value)) {
        return Color4.fromArray(value, 0, result);
    } else {
        console.error('unsupported color value:', value);
        throw new Error('unsupported color value:' + value);
    }
};

export default parseToColor4;