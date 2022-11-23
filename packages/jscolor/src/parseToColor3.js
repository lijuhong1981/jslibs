import Color3 from "./Color3.js";
import Color4 from "./Color4.js";

/**
 * 解析为Color3对象
 * @param {Color3|Color4|String|Number|Number[]} value 需要解析的值
 * @param {Color3} result 输入的结果对象，可不传
 * @returns {Color3} 输出的结果对象
 */
function parseToColor3(value, result) {
    if (value instanceof Color3) {
        if (result && value !== result)
            return value.clone(result);
        else
            return value;
    } else if (value instanceof Color4) {
        return value.toColor3(result);
    } else if (typeof value === 'string') {
        return Color3.fromCssColorString(value, result);
    } else if (typeof value === 'number') {
        return Color3.fromRgbNumber(value, result);
    } else if (Array.isArray(value)) {
        return Color3.fromArray(value, 0, result);
    } else {
        console.error('unsupported color value:', value);
        throw new Error('unsupported color value:' + value);
    }
};

export default parseToColor3;