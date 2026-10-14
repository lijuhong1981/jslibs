import Check from "@lijuhong1981/jscheck/src/Check.js";
import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import lerp from "@lijuhong1981/jsmath/src/lerp.js";
import byteToFloat from "./byteToFloat.js";
import ColorRGBA from "./ColorRGBA.js";
import floatToByte from "./floatToByte.js";
import hue2rgb from "./hue2rgb.js";

/**
 * 一种颜色，通过红、绿、蓝分量指定，
 * 其取值范围为 <code>0</code>（无强度）到 <code>1.0</code>（满强度）。
 * @param {number} [red=1.0] 红色分量。
 * @param {number} [green=1.0] 绿色分量。
 * @param {number} [blue=1.0] 蓝色分量。
 *
 * @constructor
 * @alias Color3
 *
 * @see Packable
 */
function ColorRGB(red = 1.0, green = 1.0, blue = 1.0) {
    let _red = red;
    let _green = green;
    let _blue = blue;

    Object.defineProperties(this, {
        /**
         * 红色分量。
         * @type {number}
         * @default 1.0
         */
        red: {
            set: function (value) {
                Check.typeOf.number("red", value);
                _red = value;
            },
            get: function () {
                return _red;
            }
        },
        /**
         * 绿色分量。
         * @type {number}
         * @default 1.0
         */
        green: {
            set: function (value) {
                Check.typeOf.number("green", value);
                _green = value;
            },
            get: function () {
                return _green;
            }
        },
        /**
         * 蓝色分量。
         * @type {number}
         * @default 1.0
         */
        blue: {
            set: function (value) {
                Check.typeOf.number("blue", value);
                _blue = value;
            },
            get: function () {
                return _blue;
            }
        },
    });
};

/**
 * 创建一个通过红、绿、蓝分量指定的新 Color，
 * 其取值范围为 <code>0</code>（无强度）到 <code>1.0</code>（满强度）。
 *
 * @param {number} [red=1.0] 红色分量。
 * @param {number} [green=1.0] 绿色分量。
 * @param {number} [blue=1.0] 蓝色分量。
 * @param {ColorRGB} [result] 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数；如果未提供则返回新的 Color 实例。
 */
ColorRGB.fromValues = function (red = 1.0, green = 1.0, blue = 1.0, result = new ColorRGB()) {
    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

/**
 * 从指定的红、绿、蓝分量设置此 Color 的值，
 * 其取值范围为 <code>0</code>（无强度）到 <code>1.0</code>（满强度）。
 * 
 * @see ColorRGB.fromValues
*/
ColorRGB.prototype.setFromValues = function (red = 1.0, green = 1.0, blue = 1.0) {
    return ColorRGB.fromValues(red, green, blue, this);
};

/**
 * 创建一个通过红、绿、蓝分量指定的新 Color，
 * 其范围为 0 到 255，并在内部将其转换为 0.0 到 1.0 的范围。
 *
 * @param {number} [red=255] 红色分量。
 * @param {number} [green=255] 绿色分量。
 * @param {number} [blue=255] 蓝色分量。
 * @param {ColorRGB} [result] 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数；如果未提供则返回新的 Color 实例。
 * 
 * @see ColorRGB#toBytes
 */
ColorRGB.fromBytes = function (red = 255.0, green = 255.0, blue = 255.0, result = new ColorRGB()) {
    red = byteToFloat(red);
    green = byteToFloat(green);
    blue = byteToFloat(blue);

    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

/**
 * 从指定的红、绿、蓝分量设置此 Color 的值，
 * 其范围为 0 到 255，并在内部将其转换为 0.0 到 1.0 的范围。
 * 
 * @see ColorRGB.fromBytes
*/
ColorRGB.prototype.setFromBytes = function (red, green, blue) {
    return ColorRGB.fromBytes(red, green, blue, this);
};

const scratchArrayBuffer = new ArrayBuffer(4);
const scratchUint32Array = new Uint32Array(scratchArrayBuffer);
const scratchUint8Array = new Uint8Array(scratchArrayBuffer);

/**
 * 从单个数值型无符号 24 位 RGB 值创建一个新的 Color，
 * 使用系统的字节序。
 *
 * @param {number} rgb 单个数值型无符号 24 位 RGB 值。
 * @param {ColorRGB} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGB} 颜色对象。
 *
 * @example
 * const color = ColorRGB.fromHexNumber(0x67ADDF);
 *
 * @see ColorRGB#toHexNumber
 */
ColorRGB.fromHexNumber = function (rgb, result) {
    Check.typeOf.integer('rgb', rgb);
    // scratchUint32Array 与 scratchUint8Array 共享同一个底层缓冲区
    scratchUint32Array[0] = rgb;
    return ColorRGB.fromBytes(
        scratchUint8Array[2],
        scratchUint8Array[1],
        scratchUint8Array[0],
        result,
    );
};

/**
 * 从单个数值型无符号 24 位 RGB 值设置此 Color 的值，
 * 使用系统的字节序。
 *
 * @see ColorRGB.fromHexNumber
 */
ColorRGB.prototype.setFromRgb = function (rgb) {
    return ColorRGB.fromHexNumber(rgb, this);
};

/**
 * 根据色相、饱和度和明度创建 Color 实例。
 *
 * @param {number} [hue=0] 色相角度 0...1
 * @param {number} [saturation=0] 饱和度值 0...1
 * @param {number} [lightness=0] 明度值 0...1
 * @param {ColorRGB} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGB} 颜色对象。
 *
 * @see {@link http://www.w3.org/TR/css3-color/#hsl-color|CSS 颜色值}
 */
ColorRGB.fromHsl = function (hue = 0, saturation = 0, lightness = 0, result = new ColorRGB()) {
    hue = hue % 1.0;

    let red = lightness;
    let green = lightness;
    let blue = lightness;

    if (saturation !== 0) {
        let m2;
        if (lightness < 0.5) {
            m2 = lightness * (1 + saturation);
        } else {
            m2 = lightness + saturation - lightness * saturation;
        }

        const m1 = 2.0 * lightness - m2;
        red = hue2rgb(m1, m2, hue + 1 / 3);
        green = hue2rgb(m1, m2, hue);
        blue = hue2rgb(m1, m2, hue - 1 / 3);
    }

    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

/**
 * 从色相、饱和度和明度设置此 Color 的值。
 * 
 * @see ColorRGB.fromHsl
 */
ColorRGB.prototype.setFromHsl = function (hue, saturation, lightness) {
    return ColorRGB.fromHsl(hue, saturation, lightness, this);
};

/**
 * 使用所提供的选项创建一个随机颜色。
 *
 * @param {Object} [options] 具有以下属性的对象：
 * @param {number} [options.red] 若指定，则使用该红色分量而不使用随机值。
 * @param {number} [options.minimumRed=0.0] 未指定红色分量时要生成的红色最大值。
 * @param {number} [options.maximumRed=1.0] 未指定红色分量时要生成的红色最小值。
 * @param {number} [options.green] 若指定，则使用该绿色分量而不使用随机值。
 * @param {number} [options.minimumGreen=0.0] 未指定绿色分量时要生成的绿色最大值。
 * @param {number} [options.maximumGreen=1.0] 未指定绿色分量时要生成的绿色最小值。
 * @param {number} [options.blue] 若指定，则使用该蓝色分量而不使用随机值。
 * @param {number} [options.minimumBlue=0.0] 未指定蓝色分量时要生成的蓝色最大值。
 * @param {number} [options.maximumBlue=1.0] 未指定蓝色分量时要生成的蓝色最小值。
 * @param {ColorRGB} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGB} 修改后的 result 参数；如果 result 未定义则返回新实例。
 *
 * @exception {Error} minimumRed 必须小于或等于 maximumRed。
 * @exception {Error} minimumGreen 必须小于或等于 maximumGreen。
 * @exception {Error} minimumBlue 必须小于或等于 maximumBlue。
 *
 * @example
 * //创建一个完全随机的颜色
 * const color = ColorRGB.fromRandom();
 *
 * //创建一个随机的黄色色调。
 * const color1 = ColorRGB.fromRandom({
 *     red : 1.0,
 *     green : 1.0,
 * });
 *
 * //创建一个随机的明亮颜色。
 * const color2 = ColorRGB.fromRandom({
 *     minimumRed : 0.75,
 *     minimumGreen : 0.75,
 *     minimumBlue : 0.75,
 * });
 */
ColorRGB.fromRandom = function (options = {}, result = new ColorRGB()) {
    let red = options.red;
    if (!defined(red)) {
        const minimumRed = options.minimumRed ?? 0;
        const maximumRed = options.maximumRed ?? 1.0;

        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.number.lessThanOrEquals("minimumRed", minimumRed, maximumRed);
        //>>includeEnd('debug');

        red =
            minimumRed + Math.random() * (maximumRed - minimumRed);
    }

    let green = options.green;
    if (!defined(green)) {
        const minimumGreen = options.minimumGreen ?? 0;
        const maximumGreen = options.maximumGreen ?? 1.0;

        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.number.lessThanOrEquals(
            "minimumGreen",
            minimumGreen,
            maximumGreen,
        );
        //>>includeEnd('debug');
        green =
            minimumGreen +
            Math.random() * (maximumGreen - minimumGreen);
    }

    let blue = options.blue;
    if (!defined(blue)) {
        const minimumBlue = options.minimumBlue ?? 0;
        const maximumBlue = options.maximumBlue ?? 1.0;

        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.number.lessThanOrEquals(
            "minimumBlue",
            minimumBlue,
            maximumBlue,
        );
        //>>includeEnd('debug');

        blue =
            minimumBlue + Math.random() * (maximumBlue - minimumBlue);
    }

    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

/**
 * 使用所提供的选项为此 Color 设置随机值。
 * 
 * @see ColorRGB.fromRandom
*/
ColorRGB.prototype.setFromRandom = function (options) {
    return ColorRGB.fromRandom(options, this);
};

//#rgba
const rgbaMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i;
//#rrggbbaa
const rrggbbaaMatcher =
    /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
//rgb()、rgba() 或 rgb%()
const rgbParenthesesMatcher =
    /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
//hsl() 或 hsla()
const hslParenthesesMatcher =
    /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;

/**
 * 根据 CSS 颜色值创建 Color 实例。
 *
 * @param {string} colorString 采用 #rgb、#rgba、#rrggbb、#rrggbbaa、rgb()、rgba()、hsl() 或 hsla() 格式的 CSS 颜色值。
 * @param {ColorRGB} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGB} 颜色对象；如果字符串不是有效的 CSS 颜色则返回 undefined。
 *
 *
 * @example
 * const color = ColorRGB.fromCssColorString('#67ADDF');
 * const green = ColorRGB.fromCssColorString('green');
 *
 * @see {@link http://www.w3.org/TR/css3-color|CSS 颜色值}
 * @see ColorRGB#toCssColorString
 * @see ColorRGB#toCssHexString
 */
ColorRGB.fromCssColorString = function (colorString, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("colorString", colorString);
    //>>includeEnd('debug');

    // 移除颜色字符串两端的所有空白字符
    let color = colorString.trim();

    const namedColor = ColorRGB[color.toUpperCase()];
    if (defined(namedColor)) {
        ColorRGB.clone(namedColor, result);
        return result;
    }

    let matches = rgbaMatcher.exec(color);
    if (matches !== null) {
        result.red = parseInt(matches[1], 16) / 15;
        result.green = parseInt(matches[2], 16) / 15.0;
        result.blue = parseInt(matches[3], 16) / 15.0;
        return result;
    }

    matches = rrggbbaaMatcher.exec(color);
    if (matches !== null) {
        result.red = parseInt(matches[1], 16) / 255.0;
        result.green = parseInt(matches[2], 16) / 255.0;
        result.blue = parseInt(matches[3], 16) / 255.0;
        return result;
    }

    matches = rgbParenthesesMatcher.exec(color);
    if (matches !== null) {
        result.red =
            parseFloat(matches[1]) / (matches[1].endsWith("%") ? 100.0 : 255.0);
        result.green =
            parseFloat(matches[2]) / (matches[2].endsWith("%") ? 100.0 : 255.0);
        result.blue =
            parseFloat(matches[3]) / (matches[3].endsWith("%") ? 100.0 : 255.0);
        return result;
    }

    matches = hslParenthesesMatcher.exec(color);
    if (matches !== null) {
        return ColorRGB.fromHsl(
            parseFloat(matches[1]) / 360.0,
            parseFloat(matches[2]) / 100.0,
            parseFloat(matches[3]) / 100.0,
            result,
        );
    }
};

/**
 * 根据 CSS 颜色值设置此 Color 的值。
 * 
 * @see ColorRGB.fromCssColorString
*/
ColorRGB.prototype.setFromCssColorString = function (colorString) {
    return ColorRGB.fromCssColorString(colorString, this);
};

/**
 * 将对象打包进数组所使用的元素个数。
 * @type {number}
 */
ColorRGB.packedLength = 3;

/**
 * 将提供的实例存储到提供的数组中。
 *
 * @param {ColorRGB} value 要打包的值。
 * @param {number[]} array 要打包到的数组。
 * @param {number} [startingIndex=0] 数组中开始打包元素的索引。
 *
 * @returns {number[]} 打包后的数组
 */
ColorRGB.pack = function (value, array = [], startingIndex = 0) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("value", value);
    //>>includeEnd('debug');

    array[startingIndex] = value.red;
    array[startingIndex + 1] = value.green;
    array[startingIndex + 2] = value.blue;

    return array;
};

/**
 * 从打包数组中检索实例。
 *
 * @param {number[]} array 打包后的数组。
 * @param {number} [startingIndex=0] 要解包的元素的起始索引。
 * @param {ColorRGB} [result] 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数；如果未提供则返回新的 Color 实例。
 */
ColorRGB.unpack = function (array, startingIndex = 0, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("array", array);
    //>>includeEnd('debug');

    result.red = array[startingIndex];
    result.green = array[startingIndex + 1];
    result.blue = array[startingIndex + 2];

    return result;
};

/**
 * 从数组创建实例，等同于 unpack。
 *
 * @param {number[]} array 打包后的数组。
 * @param {number} [startingIndex=0] 要解包的元素的起始索引。
 * @param {ColorRGB} [result] 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数；如果未提供则返回新的 Color 实例。
 * 
 * @see ColorRGB.unpack
 * @see ColorRGB#toArray
*/
ColorRGB.fromArray = ColorRGB.unpack;

/**
 * 从数组设置此 Color 的值。
 * 
 * @see ColorRGB.fromArray
*/
ColorRGB.prototype.setFromArray = function (array, startingIndex) {
    return ColorRGB.unpack(array, startingIndex, this);
};

/**
 * 将此实例存储到提供的数组中。
 * 
 * @param {number[]} array 要打包到的数组。
 * @param {number} [startingIndex=0] 数组中开始打包元素的索引。
 *
 * @returns {number[]} 打包后的数组
 * 
 * @example
 * const array = ColorRGB.BLUE.toArray();
 * const red = array[0];
 * const green = array[1];
 * const blue = array[2];
 * 
 * @see ColorRGB.fromArray
*/
ColorRGB.prototype.toArray = function (array, startingIndex) {
    return ColorRGB.pack(this, array, startingIndex);
};

/**
 * 复制一个 Color。
 *
 * @param {ColorRGB} color 要复制的 Color。
 * @param {ColorRGB} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGB} 修改后的 result 参数；如果 result 未定义则返回新实例。（如果 color 未定义则返回 undefined）
 */
ColorRGB.clone = function (color, result = new ColorRGB()) {
    if (!color) {
        return undefined;
    }

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;

    return result;
};

/**
 * 如果第一个 Color 等于第二个 Color，则返回 true。
 *
 * @param {ColorRGB} [left] 要比较相等性的第一个 Color。
 * @param {ColorRGB} [right] 要比较相等性的第二个 Color。
 * @returns {boolean} 如果两个 Color 相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGB.equals = function (left, right) {
    return (
        left === right ||
        (defined(left) &&
            defined(right) &&
            left.red === right.red &&
            left.green === right.green &&
            left.blue === right.blue)
    );
};

/**
 * 如果 Color 的值等于数组的值，则返回 true。
 *
 * @param {ColorRGB} [color] 要比较相等性的 Color。
 * @param {number[]} [array] 要比较相等性的数组。
 * @param {startingIndex} [startingIndex = 0] 数组的起始索引。
 * @returns {boolean} 如果值相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGB.equalsArray = function (color, array, startingIndex = 0) {
    return (
        defined(color) &&
        defined(array) &&
        color.red === array[startingIndex] &&
        color.green === array[startingIndex + 1] &&
        color.blue === array[startingIndex + 2]
    );
};

/**
 * 如果第一个 Color 在指定 epsilon 内按分量等于第二个 Color，则返回 <code>true</code>。
 *
 * @param {ColorRGB} [left] 要比较相等性的第一个 Color。
 * @param {ColorRGB} [right] 要比较相等性的第二个 Color。
 * @param {number} [epsilon=0.0] 用于相等性测试的 epsilon。
 * @returns {boolean} 如果两个 Color 在指定 epsilon 内相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGB.equalsEpsilon = function (left, right, epsilon = 0.0) {
    return (
        left === right ||
        (defined(right) &&
            defined(right) &&
            Math.abs(left.red - right.red) <= epsilon &&
            Math.abs(left.green - right.green) <= epsilon &&
            Math.abs(left.blue - right.blue) <= epsilon)
    );
};

/**
 * 返回 Color 实例的副本。
 *
 * @param {ColorRGB} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGB} 修改后的 result 参数；如果 result 未定义则返回新实例。
 */
ColorRGB.prototype.clone = function (result) {
    return ColorRGB.clone(this, result);
};

/**
 * 如果此 Color 等于 other，则返回 true。
 *
 * @param {ColorRGB} [other] 要比较相等性的 Color。
 * @returns {boolean} 如果两个 Color 相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGB.prototype.equals = function (other) {
    return ColorRGB.equals(this, other);
};

/**
 * 如果此 Color 的值等于数组的值，则返回 true。
 *
 * @param {number[]} [array] 要比较相等性的数组。
 * @param {startingIndex} [startingIndex = 0] 数组的起始索引。
 * @returns {boolean} 如果值相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGB.prototype.equalsArray = function (array, startingIndex) {
    return ColorRGB.equalsArray(this, array, startingIndex);
}

/**
 * 如果此 Color 在指定 epsilon 内按分量等于 other，则返回 <code>true</code>。
 *
 * @param {ColorRGB} other 要比较相等性的 Color。
 * @param {number} [epsilon=0.0] 用于相等性测试的 epsilon。
 * @returns {boolean} 如果两个 Color 在指定 epsilon 内相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGB.prototype.equalsEpsilon = function (other, epsilon) {
    return ColorRGB.equalsEpsilon(this, other, epsilon);
};

/**
 * 创建表示此 Color 的字符串，格式为 'Color(red, green, blue)'。
 *
 * @returns {string} 表示此 Color 的字符串，格式为 'Color(red, green, blue)'。
 */
ColorRGB.prototype.toString = function () {
    return `Color(${this.red}, ${this.green}, ${this.blue})`;
};

/**
 * 创建包含此颜色的 CSS 颜色值的字符串。
 *
 * @returns {string} 此颜色对应的 CSS 值。
 *
 * @see {@link http://www.w3.org/TR/css3-color/#rgba-color|CSS RGB 或 RGBA 颜色值}
 * @see ColorRGB.fromCssColorString
 */
ColorRGB.prototype.toCssColorString = function () {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);
    return `rgb(${red},${green},${blue})`;
};

/**
 * 创建包含此颜色的 CSS 十六进制字符串颜色值的字符串。
 *
 * @returns {string} 此颜色对应的 CSS 十六进制字符串。
 */
ColorRGB.prototype.toCssHexString = function () {
    let r = floatToByte(this.red).toString(16);
    if (r.length < 2) {
        r = `0${r}`;
    }
    let g = floatToByte(this.green).toString(16);
    if (g.length < 2) {
        g = `0${g}`;
    }
    let b = floatToByte(this.blue).toString(16);
    if (b.length < 2) {
        b = `0${b}`;
    }
    return `#${r}${g}${b}`;
};

/**
 * 将此颜色转换为红、绿、蓝值数组，
 * 这些值的范围为 0 到 255。
 *
 * @param {number[]} [result] 用于存储结果的数组，如果未定义则创建新实例。
 * @returns {number[]} 修改后的 result 参数；如果 result 未定义则返回新实例。
 * 
 * @see ColorRGB.fromBytes
 */
ColorRGB.prototype.toBytes = function (result = []) {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);

    result[0] = red;
    result[1] = green;
    result[2] = blue;

    return result;
};

/**
 * 将此颜色转换为单个数值型无符号 24 位 RGB 值，
 * 使用系统的字节序。
 *
 * @returns {number} 单个数值型无符号 24 位 RGB 值。
 *
 *
 * @example
 * const rgb = ColorRGB.BLUE.toHexNumber();
 *
 * @see ColorRGB.fromHexNumber
 */
ColorRGB.prototype.toHexNumber = function () {
    // scratchUint32Array 与 scratchUint8Array 共享同一个底层缓冲区
    scratchUint8Array[2] = floatToByte(this.red);
    scratchUint8Array[1] = floatToByte(this.green);
    scratchUint8Array[0] = floatToByte(this.blue);
    return scratchUint32Array[0];
};

/**
 * 创建一个按指定幅度提亮的新 Color。
 *
 * @param {ColorRGB} color 基础颜色
 * @param {number} magnitude 表示提亮幅度的正数。
 * @param {ColorRGB} [result] 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数；如果未提供则返回新的 ColorRGB 实例。
 *
 * @example 
 * const brightBlue = ColorRGB.brighten(ColorRGB.BLUE, 0.5);
 */
ColorRGB.brighten = function (color, magnitude, result = new ColorRGB()) {
    Check.typeOf.object('color', color);
    Check.typeOf.number("magnitude", magnitude);
    Check.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0.0);

    magnitude = 1.0 - magnitude;
    result.red = 1.0 - (1.0 - color.red) * magnitude;
    result.green = 1.0 - (1.0 - color.green) * magnitude;
    result.blue = 1.0 - (1.0 - color.blue) * magnitude;

    return result;
};

/**
 * 按指定幅度提亮此 Color。
 *
 * @param {number} magnitude 表示提亮幅度的正数。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result。
 *
 * @see ColorRGB.brighten
 */
ColorRGB.prototype.brighten = function (magnitude, result) {
    return ColorRGB.brighten(this, magnitude, result || this);
};

/**
 * 创建一个按指定幅度变暗的新 Color。
 *
 * @param {ColorRGB} color 基础颜色
 * @param {number} magnitude 表示变暗幅度的正数。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 *
 * @example
 * const darkBlue = ColorRGB.darken(ColorRGB.BLUE, 0.5);
 */
ColorRGB.darken = function (color, magnitude, result = new ColorRGB()) {
    Check.typeOf.object('color', color);
    Check.typeOf.number("magnitude", magnitude);
    Check.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0.0);

    magnitude = 1.0 - magnitude;
    result.red = color.red * magnitude;
    result.green = color.green * magnitude;
    result.blue = color.blue * magnitude;

    return result;
};

/**
 * 按指定幅度变暗此 Color。
 *
 * @param {number} magnitude 表示变暗幅度的正数。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 *
 * @see ColorRGB.darken
 */
ColorRGB.prototype.darken = function (magnitude, result) {
    return ColorRGB.darken(this, magnitude, result || this);
};

/**
 * 计算两个 Color 的逐分量和。
 *
 * @param {ColorRGB} left 第一个 Color。
 * @param {ColorRGB} right 第二个 Color。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.add = function (left, right, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red + right.red;
    result.green = left.green + right.green;
    result.blue = left.blue + right.blue;

    return result;
};

/**
 * 将此 Color 与 other Color 逐分量相加。
 *
 * @param {ColorRGB} other 另一个 Color。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 * 
 * @see ColorRGB.add
 */
ColorRGB.prototype.add = function (other, result) {
    return ColorRGB.add(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量差。
 *
 * @param {ColorRGB} left 第一个 Color。
 * @param {ColorRGB} right 第二个 Color。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.subtract = function (left, right, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red - right.red;
    result.green = left.green - right.green;
    result.blue = left.blue - right.blue;

    return result;
};

/**
 * 将此 Color 与 other Color 逐分量相减。
 *
 * @param {ColorRGB} other 另一个 Color。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 * 
 * @see ColorRGB.subtract
 */
ColorRGB.prototype.subtract = function (other, result) {
    return ColorRGB.subtract(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量积。
 *
 * @param {ColorRGB} left 第一个 Color。
 * @param {ColorRGB} right 第二个 Color。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.multiply = function (left, right, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red * right.red;
    result.green = left.green * right.green;
    result.blue = left.blue * right.blue;

    return result;
};

/**
 * 将此 Color 与 other Color 逐分量相乘。
 *
 * @param {ColorRGB} other 另一个 Color。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 * 
 * @see ColorRGB.multiply
 */
ColorRGB.prototype.multiply = function (other, result) {
    return ColorRGB.multiply(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量商。
 *
 * @param {ColorRGB} left 第一个 Color。
 * @param {ColorRGB} right 第二个 Color。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.divide = function (left, right, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red / right.red;
    result.green = left.green / right.green;
    result.blue = left.blue / right.blue;

    return result;
};

/**
 * 将此 Color 与 other Color 逐分量相除。
 *
 * @param {ColorRGB} other 另一个 Color。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 * 
 * @see ColorRGB.divide
 */
ColorRGB.prototype.divide = function (other, result) {
    return ColorRGB.divide(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量取模。
 *
 * @param {ColorRGB} left 第一个 Color。
 * @param {ColorRGB} right 第二个 Color。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.mod = function (left, right, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red % right.red;
    result.green = left.green % right.green;
    result.blue = left.blue % right.blue;

    return result;
};

/**
 * 将此 Color 与 other Color 逐分量取模。
 *
 * @param {ColorRGB} other 另一个 Color。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 * 
 * @see ColorRGB.mod
 */
ColorRGB.prototype.mod = function (other, result) {
    return ColorRGB.mod(this, other, result || this);
};

/**
 * 计算提供的两个颜色之间在 t 处的线性插值或外推。
 *
 * @param {ColorRGB} start t 为 0.0 时对应的颜色。
 * @param {ColorRGB} end t 为 1.0 时对应的颜色。
 * @param {number} t 进行插值的位置 t。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.lerp = function (start, end, t, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("start", start);
    Check.typeOf.object("end", end);
    Check.typeOf.number("t", t);
    //>>includeEnd('debug');

    result.red = lerp(start.red, end.red, t);
    result.green = lerp(start.green, end.green, t);
    result.blue = lerp(start.blue, end.blue, t);

    return result;
};

/**
 * 将提供的 Color 按分量乘以提供的标量。
 *
 * @param {ColorRGB} color 要缩放的 Color。
 * @param {number} scalar 要乘以的标量。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.multiplyByScalar = function (color, scalar, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);
    //>>includeEnd('debug');

    result.red = color.red * scalar;
    result.green = color.green * scalar;
    result.blue = color.blue * scalar;

    return result;
};

/**
 * 将此 Color 按分量乘以提供的标量。
 *
 * @param {number} scalar 要乘以的标量。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 * 
 * @see ColorRGB.multiplyByScalar
 */
ColorRGB.prototype.multiplyByScalar = function (scalar, result) {
    return ColorRGB.multiplyByScalar(this, scalar, result || this);
};

/**
 * 将提供的 Color 按分量除以提供的标量。
 *
 * @param {ColorRGB} color 要被除的 Color。
 * @param {number} scalar 要除以的标量。
 * @param {ColorRGB} result 用于存储结果的对象。
 * @returns {ColorRGB} 修改后的 result 参数。
 */
ColorRGB.divideByScalar = function (color, scalar, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);
    //>>includeEnd('debug');

    result.red = color.red / scalar;
    result.green = color.green / scalar;
    result.blue = color.blue / scalar;

    return result;
};

/**
 * 将此 Color 按分量除以提供的标量。
 *
 * @param {number} scalar 要除以的标量。
 * @param {ColorRGB} result 用于存储结果的对象，如果未定义则使用自身。
 * @returns {ColorRGB} 修改后的 result 参数。
 * 
 * @see ColorRGB.divideByScalar
 */
ColorRGB.prototype.divideByScalar = function (scalar, result) {
    return ColorRGB.divideByScalar(this, scalar, result || this);
};

/**
 * 根据 ColorRGBA 实例创建一个新的 Color。
 *
 * @param {ColorRGBA} color ColorRGBA 实例。
 * @param {ColorRGB} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGB} 修改后的 result 参数；如果 result 未定义则返回新实例。
 * 
 * @see ColorRGB#toColorRGBA
*/
ColorRGB.fromColorRGBA = function (color, result = new ColorRGB()) {
    Check.typeOf.object('color', color);

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;

    return result;
};

/**
 * @see ColorRGB.fromColorRGBA
 * @deprecated
*/
ColorRGB.fromColor4 = ColorRGB.fromColorRGBA;

/**
 * 根据 ColorRGBA 实例设置此 Color 的值。
 * 
 * @see ColorRGB.fromColorRGBA
*/
ColorRGB.prototype.setFromColorRGBA = function (color) {
    return ColorRGB.fromColorRGBA(color, this);
};

/**
 * 将此 Color 转换为 ColorRGBA 实例。
 * 
 * @param {number} [alpha=1.0] alpha 分量。
 * @param {ColorRGBA} [result] 用于存储结果的对象，如果未定义则创建新实例。
 * @returns {ColorRGBA} 修改后的 result 参数；如果 result 未定义则返回新实例。
 * 
 * @see ColorRGB.fromColorRGBA
*/
ColorRGB.prototype.toColorRGBA = function (alpha = 1.0, result = new ColorRGBA()) {
    result.red = this.red;
    result.green = this.green;
    result.blue = this.blue;
    result.alpha = alpha;
    return result;
};

/**
 * @see ColorRGB#toColorRGBA
 * @deprecated
*/
ColorRGB.prototype.toColor4 = ColorRGB.prototype.toColorRGBA;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F0F8FF
 * <span class="colorSwath" style="background: #F0F8FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ALICEBLUE = Object.freeze(ColorRGB.fromCssColorString("#F0F8FF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FAEBD7
 * <span class="colorSwath" style="background: #FAEBD7;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ANTIQUEWHITE = Object.freeze(ColorRGB.fromCssColorString("#FAEBD7"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.AQUA = Object.freeze(ColorRGB.fromCssColorString("#00FFFF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#7FFFD4
 * <span class="colorSwath" style="background: #7FFFD4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.AQUAMARINE = Object.freeze(ColorRGB.fromCssColorString("#7FFFD4"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F0FFFF
 * <span class="colorSwath" style="background: #F0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.AZURE = Object.freeze(ColorRGB.fromCssColorString("#F0FFFF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F5F5DC
 * <span class="colorSwath" style="background: #F5F5DC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BEIGE = Object.freeze(ColorRGB.fromCssColorString("#F5F5DC"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFE4C4
 * <span class="colorSwath" style="background: #FFE4C4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BISQUE = Object.freeze(ColorRGB.fromCssColorString("#FFE4C4"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#000000
 * <span class="colorSwath" style="background: #000000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLACK = Object.freeze(ColorRGB.fromCssColorString("#000000"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFEBCD
 * <span class="colorSwath" style="background: #FFEBCD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLANCHEDALMOND = Object.freeze(ColorRGB.fromCssColorString("#FFEBCD"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#0000FF
 * <span class="colorSwath" style="background: #0000FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLUE = Object.freeze(ColorRGB.fromCssColorString("#0000FF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#8A2BE2
 * <span class="colorSwath" style="background: #8A2BE2;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLUEVIOLET = Object.freeze(ColorRGB.fromCssColorString("#8A2BE2"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#A52A2A
 * <span class="colorSwath" style="background: #A52A2A;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BROWN = Object.freeze(ColorRGB.fromCssColorString("#A52A2A"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#DEB887
 * <span class="colorSwath" style="background: #DEB887;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BURLYWOOD = Object.freeze(ColorRGB.fromCssColorString("#DEB887"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#5F9EA0
 * <span class="colorSwath" style="background: #5F9EA0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CADETBLUE = Object.freeze(ColorRGB.fromCssColorString("#5F9EA0"));
/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#7FFF00
 * <span class="colorSwath" style="background: #7FFF00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CHARTREUSE = Object.freeze(ColorRGB.fromCssColorString("#7FFF00"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#D2691E
 * <span class="colorSwath" style="background: #D2691E;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CHOCOLATE = Object.freeze(ColorRGB.fromCssColorString("#D2691E"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF7F50
 * <span class="colorSwath" style="background: #FF7F50;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CORAL = Object.freeze(ColorRGB.fromCssColorString("#FF7F50"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#6495ED
 * <span class="colorSwath" style="background: #6495ED;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CORNFLOWERBLUE = Object.freeze(ColorRGB.fromCssColorString("#6495ED"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFF8DC
 * <span class="colorSwath" style="background: #FFF8DC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CORNSILK = Object.freeze(ColorRGB.fromCssColorString("#FFF8DC"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#DC143C
 * <span class="colorSwath" style="background: #DC143C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CRIMSON = Object.freeze(ColorRGB.fromCssColorString("#DC143C"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CYAN = Object.freeze(ColorRGB.fromCssColorString("#00FFFF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00008B
 * <span class="colorSwath" style="background: #00008B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKBLUE = Object.freeze(ColorRGB.fromCssColorString("#00008B"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#008B8B
 * <span class="colorSwath" style="background: #008B8B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKCYAN = Object.freeze(ColorRGB.fromCssColorString("#008B8B"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#B8860B
 * <span class="colorSwath" style="background: #B8860B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGOLDENROD = Object.freeze(ColorRGB.fromCssColorString("#B8860B"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGRAY = Object.freeze(ColorRGB.fromCssColorString("#A9A9A9"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#006400
 * <span class="colorSwath" style="background: #006400;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGREEN = Object.freeze(ColorRGB.fromCssColorString("#006400"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGREY = ColorRGB.DARKGRAY;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#BDB76B
 * <span class="colorSwath" style="background: #BDB76B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKKHAKI = Object.freeze(ColorRGB.fromCssColorString("#BDB76B"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#8B008B
 * <span class="colorSwath" style="background: #8B008B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKMAGENTA = Object.freeze(ColorRGB.fromCssColorString("#8B008B"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#556B2F
 * <span class="colorSwath" style="background: #556B2F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKOLIVEGREEN = Object.freeze(ColorRGB.fromCssColorString("#556B2F"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF8C00
 * <span class="colorSwath" style="background: #FF8C00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKORANGE = Object.freeze(ColorRGB.fromCssColorString("#FF8C00"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#9932CC
 * <span class="colorSwath" style="background: #9932CC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKORCHID = Object.freeze(ColorRGB.fromCssColorString("#9932CC"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#8B0000
 * <span class="colorSwath" style="background: #8B0000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKRED = Object.freeze(ColorRGB.fromCssColorString("#8B0000"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#E9967A
 * <span class="colorSwath" style="background: #E9967A;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSALMON = Object.freeze(ColorRGB.fromCssColorString("#E9967A"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#8FBC8F
 * <span class="colorSwath" style="background: #8FBC8F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#8FBC8F"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#483D8B
 * <span class="colorSwath" style="background: #483D8B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSLATEBLUE = Object.freeze(ColorRGB.fromCssColorString("#483D8B"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSLATEGRAY = Object.freeze(ColorRGB.fromCssColorString("#2F4F4F"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSLATEGREY = ColorRGB.DARKSLATEGRAY;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00CED1
 * <span class="colorSwath" style="background: #00CED1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKTURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#00CED1"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#9400D3
 * <span class="colorSwath" style="background: #9400D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKVIOLET = Object.freeze(ColorRGB.fromCssColorString("#9400D3"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF1493
 * <span class="colorSwath" style="background: #FF1493;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DEEPPINK = Object.freeze(ColorRGB.fromCssColorString("#FF1493"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00BFFF
 * <span class="colorSwath" style="background: #00BFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DEEPSKYBLUE = Object.freeze(ColorRGB.fromCssColorString("#00BFFF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DIMGRAY = Object.freeze(ColorRGB.fromCssColorString("#696969"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DIMGREY = ColorRGB.DIMGRAY;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#1E90FF
 * <span class="colorSwath" style="background: #1E90FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DODGERBLUE = Object.freeze(ColorRGB.fromCssColorString("#1E90FF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#B22222
 * <span class="colorSwath" style="background: #B22222;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FIREBRICK = Object.freeze(ColorRGB.fromCssColorString("#B22222"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFFAF0
 * <span class="colorSwath" style="background: #FFFAF0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FLORALWHITE = Object.freeze(ColorRGB.fromCssColorString("#FFFAF0"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#228B22
 * <span class="colorSwath" style="background: #228B22;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FORESTGREEN = Object.freeze(ColorRGB.fromCssColorString("#228B22"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FUCHSIA = Object.freeze(ColorRGB.fromCssColorString("#FF00FF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#DCDCDC
 * <span class="colorSwath" style="background: #DCDCDC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GAINSBORO = Object.freeze(ColorRGB.fromCssColorString("#DCDCDC"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F8F8FF
 * <span class="colorSwath" style="background: #F8F8FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GHOSTWHITE = Object.freeze(ColorRGB.fromCssColorString("#F8F8FF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFD700
 * <span class="colorSwath" style="background: #FFD700;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GOLD = Object.freeze(ColorRGB.fromCssColorString("#FFD700"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#DAA520
 * <span class="colorSwath" style="background: #DAA520;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GOLDENROD = Object.freeze(ColorRGB.fromCssColorString("#DAA520"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GRAY = Object.freeze(ColorRGB.fromCssColorString("#808080"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#008000
 * <span class="colorSwath" style="background: #008000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GREEN = Object.freeze(ColorRGB.fromCssColorString("#008000"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#ADFF2F
 * <span class="colorSwath" style="background: #ADFF2F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GREENYELLOW = Object.freeze(ColorRGB.fromCssColorString("#ADFF2F"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GREY = ColorRGB.GRAY;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F0FFF0
 * <span class="colorSwath" style="background: #F0FFF0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.HONEYDEW = Object.freeze(ColorRGB.fromCssColorString("#F0FFF0"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF69B4
 * <span class="colorSwath" style="background: #FF69B4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.HOTPINK = Object.freeze(ColorRGB.fromCssColorString("#FF69B4"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#CD5C5C
 * <span class="colorSwath" style="background: #CD5C5C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.INDIANRED = Object.freeze(ColorRGB.fromCssColorString("#CD5C5C"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#4B0082
 * <span class="colorSwath" style="background: #4B0082;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.INDIGO = Object.freeze(ColorRGB.fromCssColorString("#4B0082"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFFFF0
 * <span class="colorSwath" style="background: #FFFFF0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.IVORY = Object.freeze(ColorRGB.fromCssColorString("#FFFFF0"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F0E68C
 * <span class="colorSwath" style="background: #F0E68C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.KHAKI = Object.freeze(ColorRGB.fromCssColorString("#F0E68C"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#E6E6FA
 * <span class="colorSwath" style="background: #E6E6FA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LAVENDER = Object.freeze(ColorRGB.fromCssColorString("#E6E6FA"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFF0F5
 * <span class="colorSwath" style="background: #FFF0F5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LAVENDAR_BLUSH = Object.freeze(ColorRGB.fromCssColorString("#FFF0F5"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#7CFC00
 * <span class="colorSwath" style="background: #7CFC00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LAWNGREEN = Object.freeze(ColorRGB.fromCssColorString("#7CFC00"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFFACD
 * <span class="colorSwath" style="background: #FFFACD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LEMONCHIFFON = Object.freeze(ColorRGB.fromCssColorString("#FFFACD"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#ADD8E6
 * <span class="colorSwath" style="background: #ADD8E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTBLUE = Object.freeze(ColorRGB.fromCssColorString("#ADD8E6"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F08080
 * <span class="colorSwath" style="background: #F08080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTCORAL = Object.freeze(ColorRGB.fromCssColorString("#F08080"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#E0FFFF
 * <span class="colorSwath" style="background: #E0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTCYAN = Object.freeze(ColorRGB.fromCssColorString("#E0FFFF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FAFAD2
 * <span class="colorSwath" style="background: #FAFAD2;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGOLDENRODYELLOW = Object.freeze(ColorRGB.fromCssColorString("#FAFAD2"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGRAY = Object.freeze(ColorRGB.fromCssColorString("#D3D3D3"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#90EE90
 * <span class="colorSwath" style="background: #90EE90;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGREEN = Object.freeze(ColorRGB.fromCssColorString("#90EE90"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGREY = ColorRGB.LIGHTGRAY;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFB6C1
 * <span class="colorSwath" style="background: #FFB6C1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTPINK = Object.freeze(ColorRGB.fromCssColorString("#FFB6C1"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#20B2AA
 * <span class="colorSwath" style="background: #20B2AA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#20B2AA"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#87CEFA
 * <span class="colorSwath" style="background: #87CEFA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSKYBLUE = Object.freeze(ColorRGB.fromCssColorString("#87CEFA"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSLATEGRAY = Object.freeze(ColorRGB.fromCssColorString("#778899"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSLATEGREY = ColorRGB.LIGHTSLATEGRAY;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#B0C4DE
 * <span class="colorSwath" style="background: #B0C4DE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSTEELBLUE = Object.freeze(ColorRGB.fromCssColorString("#B0C4DE"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFFFE0
 * <span class="colorSwath" style="background: #FFFFE0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTYELLOW = Object.freeze(ColorRGB.fromCssColorString("#FFFFE0"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00FF00
 * <span class="colorSwath" style="background: #00FF00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIME = Object.freeze(ColorRGB.fromCssColorString("#00FF00"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#32CD32
 * <span class="colorSwath" style="background: #32CD32;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIMEGREEN = Object.freeze(ColorRGB.fromCssColorString("#32CD32"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FAF0E6
 * <span class="colorSwath" style="background: #FAF0E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LINEN = Object.freeze(ColorRGB.fromCssColorString("#FAF0E6"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MAGENTA = Object.freeze(ColorRGB.fromCssColorString("#FF00FF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#800000
 * <span class="colorSwath" style="background: #800000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MAROON = Object.freeze(ColorRGB.fromCssColorString("#800000"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#66CDAA
 * <span class="colorSwath" style="background: #66CDAA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMAQUAMARINE = Object.freeze(ColorRGB.fromCssColorString("#66CDAA"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#0000CD
 * <span class="colorSwath" style="background: #0000CD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMBLUE = Object.freeze(ColorRGB.fromCssColorString("#0000CD"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#BA55D3
 * <span class="colorSwath" style="background: #BA55D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMORCHID = Object.freeze(ColorRGB.fromCssColorString("#BA55D3"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#9370DB
 * <span class="colorSwath" style="background: #9370DB;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMPURPLE = Object.freeze(ColorRGB.fromCssColorString("#9370DB"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#3CB371
 * <span class="colorSwath" style="background: #3CB371;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMSEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#3CB371"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#7B68EE
 * <span class="colorSwath" style="background: #7B68EE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMSLATEBLUE = Object.freeze(ColorRGB.fromCssColorString("#7B68EE"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00FA9A
 * <span class="colorSwath" style="background: #00FA9A;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMSPRINGGREEN = Object.freeze(ColorRGB.fromCssColorString("#00FA9A"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#48D1CC
 * <span class="colorSwath" style="background: #48D1CC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMTURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#48D1CC"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#C71585
 * <span class="colorSwath" style="background: #C71585;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMVIOLETRED = Object.freeze(ColorRGB.fromCssColorString("#C71585"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#191970
 * <span class="colorSwath" style="background: #191970;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MIDNIGHTBLUE = Object.freeze(ColorRGB.fromCssColorString("#191970"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F5FFFA
 * <span class="colorSwath" style="background: #F5FFFA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MINTCREAM = Object.freeze(ColorRGB.fromCssColorString("#F5FFFA"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFE4E1
 * <span class="colorSwath" style="background: #FFE4E1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MISTYROSE = Object.freeze(ColorRGB.fromCssColorString("#FFE4E1"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFE4B5
 * <span class="colorSwath" style="background: #FFE4B5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MOCCASIN = Object.freeze(ColorRGB.fromCssColorString("#FFE4B5"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFDEAD
 * <span class="colorSwath" style="background: #FFDEAD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.NAVAJOWHITE = Object.freeze(ColorRGB.fromCssColorString("#FFDEAD"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#000080
 * <span class="colorSwath" style="background: #000080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.NAVY = Object.freeze(ColorRGB.fromCssColorString("#000080"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FDF5E6
 * <span class="colorSwath" style="background: #FDF5E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.OLDLACE = Object.freeze(ColorRGB.fromCssColorString("#FDF5E6"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#808000
 * <span class="colorSwath" style="background: #808000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.OLIVE = Object.freeze(ColorRGB.fromCssColorString("#808000"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#6B8E23
 * <span class="colorSwath" style="background: #6B8E23;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.OLIVEDRAB = Object.freeze(ColorRGB.fromCssColorString("#6B8E23"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFA500
 * <span class="colorSwath" style="background: #FFA500;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ORANGE = Object.freeze(ColorRGB.fromCssColorString("#FFA500"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF4500
 * <span class="colorSwath" style="background: #FF4500;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ORANGERED = Object.freeze(ColorRGB.fromCssColorString("#FF4500"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#DA70D6
 * <span class="colorSwath" style="background: #DA70D6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ORCHID = Object.freeze(ColorRGB.fromCssColorString("#DA70D6"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#EEE8AA
 * <span class="colorSwath" style="background: #EEE8AA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALEGOLDENROD = Object.freeze(ColorRGB.fromCssColorString("#EEE8AA"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#98FB98
 * <span class="colorSwath" style="background: #98FB98;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALEGREEN = Object.freeze(ColorRGB.fromCssColorString("#98FB98"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#AFEEEE
 * <span class="colorSwath" style="background: #AFEEEE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALETURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#AFEEEE"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#DB7093
 * <span class="colorSwath" style="background: #DB7093;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALEVIOLETRED = Object.freeze(ColorRGB.fromCssColorString("#DB7093"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFEFD5
 * <span class="colorSwath" style="background: #FFEFD5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PAPAYAWHIP = Object.freeze(ColorRGB.fromCssColorString("#FFEFD5"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFDAB9
 * <span class="colorSwath" style="background: #FFDAB9;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PEACHPUFF = Object.freeze(ColorRGB.fromCssColorString("#FFDAB9"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#CD853F
 * <span class="colorSwath" style="background: #CD853F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PERU = Object.freeze(ColorRGB.fromCssColorString("#CD853F"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFC0CB
 * <span class="colorSwath" style="background: #FFC0CB;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PINK = Object.freeze(ColorRGB.fromCssColorString("#FFC0CB"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#DDA0DD
 * <span class="colorSwath" style="background: #DDA0DD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PLUM = Object.freeze(ColorRGB.fromCssColorString("#DDA0DD"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#B0E0E6
 * <span class="colorSwath" style="background: #B0E0E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.POWDERBLUE = Object.freeze(ColorRGB.fromCssColorString("#B0E0E6"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#800080
 * <span class="colorSwath" style="background: #800080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PURPLE = Object.freeze(ColorRGB.fromCssColorString("#800080"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF0000
 * <span class="colorSwath" style="background: #FF0000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.RED = Object.freeze(ColorRGB.fromCssColorString("#FF0000"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#BC8F8F
 * <span class="colorSwath" style="background: #BC8F8F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ROSYBROWN = Object.freeze(ColorRGB.fromCssColorString("#BC8F8F"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#4169E1
 * <span class="colorSwath" style="background: #4169E1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ROYALBLUE = Object.freeze(ColorRGB.fromCssColorString("#4169E1"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#8B4513
 * <span class="colorSwath" style="background: #8B4513;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SADDLEBROWN = Object.freeze(ColorRGB.fromCssColorString("#8B4513"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FA8072
 * <span class="colorSwath" style="background: #FA8072;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SALMON = Object.freeze(ColorRGB.fromCssColorString("#FA8072"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F4A460
 * <span class="colorSwath" style="background: #F4A460;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SANDYBROWN = Object.freeze(ColorRGB.fromCssColorString("#F4A460"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#2E8B57
 * <span class="colorSwath" style="background: #2E8B57;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#2E8B57"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFF5EE
 * <span class="colorSwath" style="background: #FFF5EE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SEASHELL = Object.freeze(ColorRGB.fromCssColorString("#FFF5EE"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#A0522D
 * <span class="colorSwath" style="background: #A0522D;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SIENNA = Object.freeze(ColorRGB.fromCssColorString("#A0522D"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#C0C0C0
 * <span class="colorSwath" style="background: #C0C0C0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SILVER = Object.freeze(ColorRGB.fromCssColorString("#C0C0C0"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#87CEEB
 * <span class="colorSwath" style="background: #87CEEB;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SKYBLUE = Object.freeze(ColorRGB.fromCssColorString("#87CEEB"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#6A5ACD
 * <span class="colorSwath" style="background: #6A5ACD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SLATEBLUE = Object.freeze(ColorRGB.fromCssColorString("#6A5ACD"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SLATEGRAY = Object.freeze(ColorRGB.fromCssColorString("#708090"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SLATEGREY = ColorRGB.SLATEGRAY;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFFAFA
 * <span class="colorSwath" style="background: #FFFAFA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SNOW = Object.freeze(ColorRGB.fromCssColorString("#FFFAFA"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#00FF7F
 * <span class="colorSwath" style="background: #00FF7F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SPRINGGREEN = Object.freeze(ColorRGB.fromCssColorString("#00FF7F"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#4682B4
 * <span class="colorSwath" style="background: #4682B4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.STEELBLUE = Object.freeze(ColorRGB.fromCssColorString("#4682B4"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#D2B48C
 * <span class="colorSwath" style="background: #D2B48C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TAN = Object.freeze(ColorRGB.fromCssColorString("#D2B48C"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#008080
 * <span class="colorSwath" style="background: #008080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TEAL = Object.freeze(ColorRGB.fromCssColorString("#008080"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#D8BFD8
 * <span class="colorSwath" style="background: #D8BFD8;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.THISTLE = Object.freeze(ColorRGB.fromCssColorString("#D8BFD8"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FF6347
 * <span class="colorSwath" style="background: #FF6347;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TOMATO = Object.freeze(ColorRGB.fromCssColorString("#FF6347"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#40E0D0
 * <span class="colorSwath" style="background: #40E0D0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#40E0D0"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#EE82EE
 * <span class="colorSwath" style="background: #EE82EE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.VIOLET = Object.freeze(ColorRGB.fromCssColorString("#EE82EE"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F5DEB3
 * <span class="colorSwath" style="background: #F5DEB3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.WHEAT = Object.freeze(ColorRGB.fromCssColorString("#F5DEB3"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFFFFF
 * <span class="colorSwath" style="background: #FFFFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.WHITE = Object.freeze(ColorRGB.fromCssColorString("#FFFFFF"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#F5F5F5
 * <span class="colorSwath" style="background: #F5F5F5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.WHITESMOKE = Object.freeze(ColorRGB.fromCssColorString("#F5F5F5"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#FFFF00
 * <span class="colorSwath" style="background: #FFFF00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.YELLOW = Object.freeze(ColorRGB.fromCssColorString("#FFFF00"));

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色#9ACD32
 * <span class="colorSwath" style="background: #9ACD32;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.YELLOWGREEN = Object.freeze(ColorRGB.fromCssColorString("#9ACD32"));

export default ColorRGB;
export { ColorRGB as Color3, ColorRGB };
