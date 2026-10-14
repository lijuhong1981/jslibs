import Check from "@lijuhong1981/jscheck/src/Check.js";
import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import lerp from "@lijuhong1981/jsmath/src/lerp.js";
import byteToFloat from "./byteToFloat.js";
import ColorRGB from "./ColorRGB.js";
import floatToByte from "./floatToByte.js";
import hue2rgb from "./hue2rgb.js";

/**
 * 一种颜色，通过红色、绿色、蓝色和 alpha 分量指定，
 * 取值范围从 <code>0</code>（无强度）到 <code>1.0</code>（满强度）。
 * @param {number} [red=1.0] 红色分量。
 * @param {number} [green=1.0] 绿色分量。
 * @param {number} [blue=1.0] 蓝色分量。
 * @param {number} [alpha=1.0] alpha 分量。
 *
 * @constructor
 * @alias Color4
 *
 * @see Packable
 */
function ColorRGBA(red = 1.0, green = 1.0, blue = 1.0, alpha = 1.0) {
    let _red = red;
    let _green = green;
    let _blue = blue;
    let _alpha = alpha;

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
        /**
         * alpha 分量。
         * @type {number}
         * @default 1.0
         */
        alpha: {
            set: function (value) {
                Check.typeOf.number("alpha", value);
                _alpha = value;
            },
            get: function () {
                return _alpha;
            }
        },
    });
};

/**
 * 创建新的 Color，通过红色、绿色、蓝色和 alpha 分量指定，
 * 取值范围从 <code>0</code>（无强度）到 <code>1.0</code>（满强度）。
 *
 * @param {number} [red=1.0] 红色分量。
 * @param {number} [green=1.0] 绿色分量。
 * @param {number} [blue=1.0] 蓝色分量。
 * @param {number} [alpha=1.0] alpha 分量。
 * @param {ColorRGBA} [result] 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数；若未提供则返回新的 Color 实例。
 */
ColorRGBA.fromValues = function (red = 1.0, green = 1.0, blue = 1.0, alpha = 1.0, result = new ColorRGBA()) {
    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;
    return result;
};

/**
 * 通过指定的红色、绿色、蓝色和 alpha 分量设置此 Color 的值，
 * 取值范围从 <code>0</code>（无强度）到 <code>1.0</code>（满强度）。
 * 
 * @see ColorRGBA.fromValues
*/
ColorRGBA.prototype.setFromValues = function (red = 1.0, green = 1.0, blue = 1.0, alpha = 1.0) {
    return ColorRGBA.fromValues(red, green, blue, alpha, this);
};

/**
 * 创建新的 Color，通过红色、绿色、蓝色和 alpha 分量指定，
 * 取值范围为 0 到 255，内部会将其转换为 0.0 到 1.0 的范围。
 *
 * @param {number} [red=255] 红色分量。
 * @param {number} [green=255] 绿色分量。
 * @param {number} [blue=255] 蓝色分量。
 * @param {number} [alpha=255] alpha 分量。
 * @param {ColorRGBA} [result] 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数；若未提供则返回新的 Color 实例。
 * 
 * @see ColorRGBA#toBytes
 */
ColorRGBA.fromBytes = function (red = 255.0, green = 255.0, blue = 255.0, alpha = 255.0, result = new ColorRGBA()) {
    red = byteToFloat(red);
    green = byteToFloat(green);
    blue = byteToFloat(blue);
    alpha = byteToFloat(alpha);

    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;
    return result;
};

/**
 * 通过指定的红色、绿色、蓝色和 alpha 分量设置此 Color 的值，
 * 取值范围为 0 到 255，内部会将其转换为 0.0 到 1.0 的范围。
 * 
 * @see ColorRGBA.fromBytes
*/
ColorRGBA.prototype.setFromBytes = function (red = 255, green = 255, blue = 255, alpha = 255) {
    return ColorRGBA.fromBytes(red, green, blue, alpha, this);
};

/**
 * 创建新的 Color，其红色、绿色和蓝色分量与
 * 与指定颜色相同，但使用指定的 alpha 值。
 *
 * @param {ColorRGBA} color 基础颜色
 * @param {number} alpha 新的 alpha 分量。
 * @param {ColorRGBA} [result] 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数；若未提供则返回新的 Color 实例。
 *
 * @example 
 * const translucentRed = ColorRGBA.fromAlpha(ColorRGBA.RED, 0.9);
 */
ColorRGBA.fromAlpha = function (color, alpha, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("color", color);
    Check.typeOf.number("alpha", alpha);
    //>>includeEnd('debug');

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    result.alpha = alpha;
    return result;
};

const scratchArrayBuffer = new ArrayBuffer(4);
const scratchUint32Array = new Uint32Array(scratchArrayBuffer);
const scratchUint8Array = new Uint8Array(scratchArrayBuffer);

/**
 * 从单个无符号 32 位 RGBA 数值创建新的 Color，使用系统的
 * 字节序。
 *
 * @param {number} rgba 单个无符号 32 位 RGBA 数值。
 * @param {ColorRGBA} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGBA} 颜色对象。
 *
 * @example
 * const color = ColorRGBA.fromHexNumber(0x67ADDFFF);
 *
 * @see ColorRGBA#toHexNumber
 */
ColorRGBA.fromHexNumber = function (rgba, result) {
    Check.typeOf.integer('rgba', rgba);
    // scratchUint32Array 与 scratchUint8Array 共享同一个底层 ArrayBuffer
    scratchUint32Array[0] = rgba;
    return ColorRGBA.fromBytes(
        scratchUint8Array[3],
        scratchUint8Array[2],
        scratchUint8Array[1],
        scratchUint8Array[0],
        result,
    );
};

/**
 * 从单个无符号 32 位 RGBA 数值设置此 Color 的值，使用系统的
 * 字节序。
 *
 * @see ColorRGBA.fromHexNumber
 */
ColorRGBA.prototype.setFromHexNumber = function (rgba) {
    return ColorRGBA.fromHexNumber(rgba);
};

/**
 * 从色相、饱和度和亮度创建 Color 实例。
 *
 * @param {number} [hue=0] 色相角，范围 0...1
 * @param {number} [saturation=0] 饱和度值，范围 0...1
 * @param {number} [lightness=0] 亮度值，范围 0...1
 * @param {number} [alpha=1.0] alpha 分量，范围 0...1
 * @param {ColorRGBA} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGBA} 颜色对象。
 *
 * @see {@link http://www.w3.org/TR/css3-color/#hsl-color|CSS 颜色值}
 */
ColorRGBA.fromHsl = function (hue = 0, saturation = 0, lightness = 0, alpha = 1.0, result = new ColorRGBA()) {
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
    result.alpha = alpha;
    return result;
};

/**
 * 从色相、饱和度和亮度设置此 Color 的值。
 * 
 * @see ColorRGBA.fromHsl
 */
ColorRGBA.prototype.setFromHsl = function (hue, saturation, lightness, alpha) {
    return ColorRGBA.fromHsl(hue, saturation, lightness, alpha, this);
};

/**
 * 使用给定选项创建随机颜色。
 *
 * @param {Object} [options] 具有以下属性的对象：
 * @param {number} [options.red] 若指定，则使用该红色分量代替随机值。
 * @param {number} [options.minimumRed=0.0] 未指定 red 时生成的最大 red 值。
 * @param {number} [options.maximumRed=1.0] 未指定 red 时生成的最小 red 值。
 * @param {number} [options.green] 若指定，则使用该绿色分量代替随机值。
 * @param {number} [options.minimumGreen=0.0] 未指定 green 时生成的最大 green 值。
 * @param {number} [options.maximumGreen=1.0] 未指定 green 时生成的最小 green 值。
 * @param {number} [options.blue] 若指定，则使用该蓝色分量代替随机值。
 * @param {number} [options.minimumBlue=0.0] 未指定 blue 时生成的最大 blue 值。
 * @param {number} [options.maximumBlue=1.0] 未指定 blue 时生成的最小 blue 值。
 * @param {number} [options.alpha] 若指定，则使用该 alpha 分量代替随机值。
 * @param {number} [options.minimumAlpha=0.0] 未指定 alpha 时生成的最大 alpha 值。
 * @param {number} [options.maximumAlpha=1.0] 未指定 alpha 时生成的最小 alpha 值。
 * @param {ColorRGBA} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGBA} 修改后的 result 参数；若 result 未定义则返回新实例。
 *
 * @exception {Error} minimumRed 必须小于或等于 maximumRed。
 * @exception {Error} minimumGreen 必须小于或等于 maximumGreen。
 * @exception {Error} minimumBlue 必须小于或等于 maximumBlue。
 * @exception {Error} minimumAlpha 必须小于或等于 maximumAlpha。
 *
 * @example
 * //创建一个完全随机的颜色
 * const color = ColorRGBA.fromRandom();
 *
 * //创建一个随机的黄色调。
 * const color1 = ColorRGBA.fromRandom({
 *     red : 1.0,
 *     green : 1.0,
 *     alpha : 1.0
 * });
 *
 * //创建一个随机的亮色。
 * const color2 = ColorRGBA.fromRandom({
 *     minimumRed : 0.75,
 *     minimumGreen : 0.75,
 *     minimumBlue : 0.75,
 *     alpha : 1.0
 * });
 */
ColorRGBA.fromRandom = function (options = {}, result = new ColorRGBA()) {
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

    let alpha = options.alpha;
    if (!defined(alpha)) {
        const minimumAlpha = options.minimumAlpha ?? 0;
        const maximumAlpha = options.maximumAlpha ?? 1.0;

        //>>includeStart('debug', pragmas.debug);
        Check.typeOf.number.lessThanOrEquals(
            "minimumAlpha",
            minimumAlpha,
            maximumAlpha,
        );
        //>>includeEnd('debug');

        alpha =
            minimumAlpha +
            Math.random() * (maximumAlpha - minimumAlpha);
    }

    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;
    return result;
};

/**
 * 使用给定选项设置此 Color 的随机值。
 * 
 * @see ColorRGBA.fromRandom
*/
ColorRGBA.prototype.setFromRandom = function (options) {
    return ColorRGBA.fromRandom(options, this);
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
 * 从 CSS 颜色值创建 Color 实例。
 *
 * @param {string} colorString 采用 #rgb、#rgba、#rrggbb、#rrggbbaa、rgb()、rgba()、hsl() 或 hsla() 格式的 CSS 颜色值。
 * @param {ColorRGBA} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGBA} 颜色对象；若字符串不是有效的 CSS 颜色则为 undefined。
 *
 *
 * @example
 * const color = ColorRGBA.fromCssColorString('#67ADDF');
 * const green = ColorRGBA.fromCssColorString('green');
 *
 * @see {@link http://www.w3.org/TR/css3-color|CSS 颜色值}
 * @see ColorRGBA#toCssColorString
 * @see ColorRGBA#toCssHexString
 */
ColorRGBA.fromCssColorString = function (colorString, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("colorString", colorString);
    //>>includeEnd('debug');

    // 移除颜色字符串两端的所有空白字符
    let color = colorString.trim();

    const namedColor = ColorRGBA[color.toUpperCase()];
    if (defined(namedColor)) {
        ColorRGBA.clone(namedColor, result);
        return result;
    }

    let matches = rgbaMatcher.exec(color);
    if (matches !== null) {
        result.red = parseInt(matches[1], 16) / 15;
        result.green = parseInt(matches[2], 16) / 15.0;
        result.blue = parseInt(matches[3], 16) / 15.0;
        result.alpha = parseInt(matches[4] ?? "f", 16) / 15.0;
        return result;
    }

    matches = rrggbbaaMatcher.exec(color);
    if (matches !== null) {
        result.red = parseInt(matches[1], 16) / 255.0;
        result.green = parseInt(matches[2], 16) / 255.0;
        result.blue = parseInt(matches[3], 16) / 255.0;
        result.alpha = parseInt(matches[4] ?? "ff", 16) / 255.0;
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
        result.alpha = parseFloat(matches[4] ?? "1.0");
        return result;
    }

    matches = hslParenthesesMatcher.exec(color);
    if (matches !== null) {
        return ColorRGBA.fromHsl(
            parseFloat(matches[1]) / 360.0,
            parseFloat(matches[2]) / 100.0,
            parseFloat(matches[3]) / 100.0,
            parseFloat(matches[4] ?? "1.0"),
            result,
        );
    }
};

/**
 * 从 CSS 颜色值设置此 Color 的值。
 * 
 * @see ColorRGBA.fromCssColorString
*/
ColorRGBA.prototype.setFromCssColorString = function (colorString) {
    return ColorRGBA.fromCssColorString(colorString, this);
};

/**
 * 将对象打包到数组中所需的元素个数。
 * @type {number}
 */
ColorRGBA.packedLength = 4;

/**
 * 将给定实例存储到给定数组中。
 *
 * @param {ColorRGBA} value 要打包的值。
 * @param {number[]} array 要打包到的数组。
 * @param {number} [startingIndex=0] 数组中开始打包元素的索引。
 *
 * @returns {number[]} 已打包到的数组
 */
ColorRGBA.pack = function (value, array = [], startingIndex = 0) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("value", value);
    //>>includeEnd('debug');

    array[startingIndex] = value.red;
    array[startingIndex + 1] = value.green;
    array[startingIndex + 2] = value.blue;
    array[startingIndex + 3] = value.alpha;

    return array;
};

/**
 * 从已打包的数组中取回实例。
 *
 * @param {number[]} array 已打包的数组。
 * @param {number} [startingIndex=0] 要解包元素的起始索引。
 * @param {ColorRGBA} [result] 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数；若未提供则返回新的 Color 实例。
 */
ColorRGBA.unpack = function (array, startingIndex = 0, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.defined("array", array);
    //>>includeEnd('debug');

    result.red = array[startingIndex];
    result.green = array[startingIndex + 1];
    result.blue = array[startingIndex + 2];
    result.alpha = array[startingIndex + 3];

    return result;
};

/**
 * 从数组创建实例，等同于 unpack。
 *
 * @param {number[]} array 已打包的数组。
 * @param {number} [startingIndex=0] 要解包元素的起始索引。
 * @param {ColorRGBA} [result] 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数；若未提供则返回新的 Color 实例。
 * 
 * @see ColorRGBA.unpack
 * @see ColorRGBA#toArray
*/
ColorRGBA.fromArray = ColorRGBA.unpack;

/**
 * 从数组设置此 Color 的值。
 * 
 * @see ColorRGBA.fromArray
*/
ColorRGBA.prototype.setFromArray = function (array, startingIndex) {
    return ColorRGBA.unpack(array, startingIndex, this);
};

/**
 * 将此实例存储到给定数组中。
 * 
 * @param {number[]} array 要打包到的数组。
 * @param {number} [startingIndex=0] 数组中开始打包元素的索引。
 *
 * @returns {number[]} 已打包到的数组
 * 
 * @example
 * const array = ColorRGB.BLUE.toArray();
 * const red = array[0];
 * const green = array[1];
 * const blue = array[2];
 * const alpha = array[3];
 * 
 * @see ColorRGBA.fromArray
*/
ColorRGBA.prototype.toArray = function (array, startingIndex) {
    return ColorRGBA.pack(this, array, startingIndex);
};

/**
 * 复制一个 Color。
 *
 * @param {ColorRGBA} color 要复制的 Color。
 * @param {ColorRGBA} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGBA} 修改后的 result 参数；若 result 未定义则返回新实例。（若 color 为 undefined 则返回 undefined）
 */
ColorRGBA.clone = function (color, result = new ColorRGBA()) {
    if (!color) {
        return undefined;
    }

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    result.alpha = color.alpha;
    return result;
};

/**
 * 若第一个 Color 与第二个 Color 相等，则返回 true。
 *
 * @param {ColorRGBA} [left] 要比较是否相等的第一个 Color。
 * @param {ColorRGBA} [right] 要比较是否相等的第二个 Color。
 * @returns {boolean} 若 Colors 相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGBA.equals = function (left, right) {
    return (
        left === right ||
        (defined(left) &&
            defined(right) &&
            left.red === right.red &&
            left.green === right.green &&
            left.blue === right.blue &&
            left.alpha === right.alpha)
    );
};

/**
 * 若 Color 的值与数组的值相等，则返回 true。
 *
 * @param {ColorRGBA} [color] 要比较是否相等的 Color。
 * @param {number[]} [array] 要比较是否相等的数组。
 * @param {startingIndex} [startingIndex = 0] 数组的起始索引。
 * @returns {boolean} 若值相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGBA.equalsArray = function (color, array, startingIndex = 0) {
    return (
        defined(color) &&
        defined(array) &&
        color.red === array[startingIndex] &&
        color.green === array[startingIndex + 1] &&
        color.blue === array[startingIndex + 2] &&
        color.alpha === array[startingIndex + 3]
    );
};

/**
 * 若第一个 Color 与第二个 Color 在给定 epsilon 内逐分量相等，则返回 <code>true</code>。
 *
 * @param {ColorRGBA} [left] 要比较是否相等的第一个 Color。
 * @param {ColorRGBA} [right] 要比较是否相等的第二个 Color。
 * @param {number} [epsilon=0.0] 用于相等性测试的 epsilon。
 * @returns {boolean} 若 Colors 在给定 epsilon 内相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGBA.equalsEpsilon = function (left, right, epsilon = 0.0) {
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
 * @param {ColorRGBA} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGBA} 修改后的 result 参数；若 result 未定义则返回新实例。
 */
ColorRGBA.prototype.clone = function (result) {
    return ColorRGBA.clone(this, result);
};

/**
 * 若此 Color 与 other 相等，则返回 true。
 *
 * @param {ColorRGBA} [other] 要比较是否相等的 Color。
 * @returns {boolean} 若 Colors 相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGBA.prototype.equals = function (other) {
    return ColorRGBA.equals(this, other);
};

/**
 * 若此 Color 的值与数组的值相等，则返回 true。
 *
 * @param {number[]} [array] 要比较是否相等的数组。
 * @param {startingIndex} [startingIndex = 0] 数组的起始索引。
 * @returns {boolean} 若值相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGBA.prototype.equalsArray = function (array, startingIndex) {
    return ColorRGBA.equalsArray(this, array, startingIndex);
}

/**
 * 若此 Color 与 other 在给定 epsilon 内逐分量相等，则返回 <code>true</code>。
 *
 * @param {ColorRGBA} other 要比较是否相等的 Color。
 * @param {number} [epsilon=0.0] 用于相等性测试的 epsilon。
 * @returns {boolean} 若 Colors 在给定 epsilon 内相等则返回 <code>true</code>；否则返回 <code>false</code>。
 */
ColorRGBA.prototype.equalsEpsilon = function (other, epsilon) {
    return ColorRGBA.equalsEpsilon(this, other, epsilon);
};

/**
 * 创建以 'Color(red, green, blue, alpha)' 格式表示此 Color 的字符串。
 *
 * @returns {string} 以 'Color(red, green, blue, alpha)' 格式表示此 Color 的字符串。
 */
ColorRGBA.prototype.toString = function () {
    return `Color(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
};

/**
 * 创建包含此颜色的 CSS 颜色值的字符串。
 *
 * @returns {string} 此颜色对应的 CSS 值。
 *
 * @see {@link http://www.w3.org/TR/css3-color/#rgba-color|CSS RGB 或 RGBA 颜色值}
 * @see ColorRGBA.fromCssColorString
 */
ColorRGBA.prototype.toCssColorString = function () {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);
    return `rgba(${red},${green},${blue},${this.alpha})`;
};

/**
 * 创建包含此颜色的 CSS 十六进制字符串颜色值的字符串。
 *
 * @returns {string} 此颜色对应的 CSS 十六进制字符串。
 */
ColorRGBA.prototype.toCssHexString = function () {
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
    let hexAlpha = floatToByte(this.alpha).toString(16);
    if (hexAlpha.length < 2) {
        hexAlpha = `0${hexAlpha}`;
    }
    return `#${r}${g}${b}${hexAlpha}`;
};

/**
 * 将此颜色转换为由红色、绿色、蓝色和 alpha 值组成的数组，
 * 取值范围为 0 到 255。
 *
 * @param {number[]} [result] 用于存储结果的数组，若未定义将创建一个新实例。
 * @returns {number[]} 修改后的 result 参数；若 result 未定义则返回新实例。
 * 
 * @see ColorRGBA.fromBytes
 */
ColorRGBA.prototype.toBytes = function (result = []) {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);
    const alpha = floatToByte(this.alpha);

    result[0] = red;
    result[1] = green;
    result[2] = blue;
    result[3] = alpha;
    return result;
};

/**
 * 将此颜色转换为单个无符号 32 位 RGBA 数值，使用系统的
 * 字节序。
 *
 * @returns {number} 单个无符号 32 位 RGBA 数值。
 *
 *
 * @example
 * const rgba = ColorRGBA.BLUE.toHexNumber();
 *
 * @see ColorRGBA.fromHexNumber
 */
ColorRGBA.prototype.toHexNumber = function () {
    // scratchUint32Array 与 scratchUint8Array 共享同一个底层 ArrayBuffer
    scratchUint8Array[3] = floatToByte(this.red);
    scratchUint8Array[2] = floatToByte(this.green);
    scratchUint8Array[1] = floatToByte(this.blue);
    scratchUint8Array[0] = floatToByte(this.alpha);
    return scratchUint32Array[0];
};

/**
 * 创建按给定幅度提亮后的新 Color。
 *
 * @param {ColorRGBA} color 基础颜色
 * @param {number} magnitude 表示提亮量的正数。
 * @param {ColorRGBA} [result] 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数；若未提供则返回新的 ColorRGB 实例。
 *
 * @example 
 * const brightBlue = ColorRGB.brighten(ColorRGB.BLUE, 0.5);
 */
ColorRGBA.brighten = function (color, magnitude, result = new ColorRGBA()) {
    Check.typeOf.object('color', color);
    Check.typeOf.number("magnitude", magnitude);
    Check.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0.0);

    magnitude = 1.0 - magnitude;
    result.red = 1.0 - (1.0 - color.red) * magnitude;
    result.green = 1.0 - (1.0 - color.green) * magnitude;
    result.blue = 1.0 - (1.0 - color.blue) * magnitude;
    result.alpha = color.alpha;
    return result;
};

/**
 * 将 this Color 按给定幅度提亮。
 *
 * @param {number} magnitude 表示提亮量的正数。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的结果。
 *
 * @see ColorRGBA.brighten
 */
ColorRGBA.prototype.brighten = function (magnitude, result) {
    return ColorRGBA.brighten(this, magnitude, result || this);
};

/**
 * 创建按给定幅度变暗后的新 Color。
 *
 * @param {ColorRGBA} color 基础颜色
 * @param {number} magnitude 表示变暗量的正数。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 *
 * @example
 * const darkBlue = ColorRGBA.darken(ColorRGB.BLUE, 0.5);
 */
ColorRGBA.darken = function (color, magnitude, result = new ColorRGBA()) {
    Check.typeOf.object('color', color);
    Check.typeOf.number("magnitude", magnitude);
    Check.typeOf.number.greaterThanOrEquals("magnitude", magnitude, 0.0);

    magnitude = 1.0 - magnitude;
    result.red = color.red * magnitude;
    result.green = color.green * magnitude;
    result.blue = color.blue * magnitude;
    result.alpha = color.alpha;
    return result;
};

/**
 * 将 this Color 按给定幅度变暗。
 *
 * @param {number} magnitude 表示变暗量的正数。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 *
 * @see ColorRGBA.darken
 */
ColorRGBA.prototype.darken = function (magnitude, result) {
    return ColorRGBA.darken(this, magnitude, result || this);
};

/**
 * 计算两个 Color 的逐分量和。
 *
 * @param {ColorRGBA} left 第一个 Color。
 * @param {ColorRGBA} right 第二个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.add = function (left, right, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red + right.red;
    result.green = left.green + right.green;
    result.blue = left.blue + right.blue;
    result.alpha = left.alpha + right.alpha;
    return result;
};

/**
 * 将此 Color 按分量加上 other Color。
 *
 * @param {ColorRGBA} other 另一个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 * 
 * @see ColorRGBA.add
 */
ColorRGBA.prototype.add = function (other, result) {
    return ColorRGBA.add(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量差值。
 *
 * @param {ColorRGBA} left 第一个 Color。
 * @param {ColorRGBA} right 第二个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.subtract = function (left, right, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red - right.red;
    result.green = left.green - right.green;
    result.blue = left.blue - right.blue;
    result.alpha = left.alpha - right.alpha;
    return result;
};

/**
 * 将此 Color 按分量减去 other Color。
 *
 * @param {ColorRGBA} other 另一个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 * 
 * @see ColorRGBA.subtract
 */
ColorRGBA.prototype.subtract = function (other, result) {
    return ColorRGBA.subtract(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量乘积。
 *
 * @param {ColorRGBA} left 第一个 Color。
 * @param {ColorRGBA} right 第二个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.multiply = function (left, right, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red * right.red;
    result.green = left.green * right.green;
    result.blue = left.blue * right.blue;
    result.alpha = left.alpha * right.alpha;
    return result;
};

/**
 * 将此 Color 按分量乘以 other Color。
 *
 * @param {ColorRGBA} other 另一个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 * 
 * @see ColorRGBA.multiply
 */
ColorRGBA.prototype.multiply = function (other, result) {
    return ColorRGBA.multiply(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量商。
 *
 * @param {ColorRGBA} left 第一个 Color。
 * @param {ColorRGBA} right 第二个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.divide = function (left, right, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red / right.red;
    result.green = left.green / right.green;
    result.blue = left.blue / right.blue;
    result.alpha = left.alpha / right.alpha;
    return result;
};

/**
 * 将此 Color 按分量除以 other Color。
 *
 * @param {ColorRGBA} other 另一个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 * 
 * @see ColorRGBA.divide
 */
ColorRGBA.prototype.divide = function (other, result) {
    return ColorRGBA.divide(this, other, result || this);
};

/**
 * 计算两个 Color 的逐分量取模。
 *
 * @param {ColorRGBA} left 第一个 Color。
 * @param {ColorRGBA} right 第二个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.mod = function (left, right, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);
    //>>includeEnd('debug');

    result.red = left.red % right.red;
    result.green = left.green % right.green;
    result.blue = left.blue % right.blue;
    result.alpha = left.alpha % right.alpha;
    return result;
};

/**
 * 将此 Color 按分量对 other Color 取模。
 *
 * @param {ColorRGBA} other 另一个 Color。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 * 
 * @see ColorRGBA.mod
 */
ColorRGBA.prototype.mod = function (other, result) {
    return ColorRGBA.mod(this, other, result || this);
};

/**
 * 计算给定两个颜色之间在 t 处的线性插值或外插。
 *
 * @param {ColorRGBA} start t 为 0.0 时对应的颜色。
 * @param {ColorRGBA} end t 为 1.0 时对应的颜色。
 * @param {number} t 进行插值的 t 位置。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.lerp = function (start, end, t, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("start", start);
    Check.typeOf.object("end", end);
    Check.typeOf.number("t", t);
    //>>includeEnd('debug');

    result.red = lerp(start.red, end.red, t);
    result.green = lerp(start.green, end.green, t);
    result.blue = lerp(start.blue, end.blue, t);
    result.alpha = lerp(start.alpha, end.alpha, t);
    return result;
};

/**
 * 将给定 Color 按分量乘以给定标量。
 *
 * @param {ColorRGBA} color 要被缩放的 Color。
 * @param {number} scalar 用于相乘的标量。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.multiplyByScalar = function (color, scalar, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);
    //>>includeEnd('debug');

    result.red = color.red * scalar;
    result.green = color.green * scalar;
    result.blue = color.blue * scalar;
    result.alpha = color.alpha * scalar;
    return result;
};

/**
 * 将此 Color 按分量乘以给定标量。
 *
 * @param {number} scalar 用于相乘的标量。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 * 
 * @see ColorRGBA.multiplyByScalar
 */
ColorRGBA.prototype.multiplyByScalar = function (scalar, result) {
    return ColorRGBA.multiplyByScalar(this, scalar, result || this);
};

/**
 * 将给定 Color 按分量除以给定标量。
 *
 * @param {ColorRGBA} color 要被除的 Color。
 * @param {number} scalar 用于相除的标量。
 * @param {ColorRGBA} result 用于存储结果的对象。
 * @returns {ColorRGBA} 修改后的 result 参数。
 */
ColorRGBA.divideByScalar = function (color, scalar, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);
    //>>includeEnd('debug');

    result.red = color.red / scalar;
    result.green = color.green / scalar;
    result.blue = color.blue / scalar;
    result.alpha = color.alpha / scalar;
    return result;
};

/**
 * 将此 Color 按分量除以给定标量。
 *
 * @param {number} scalar 用于相除的标量。
 * @param {ColorRGBA} result 用于存储结果的对象，若未定义则使用自身。
 * @returns {ColorRGBA} 修改后的 result 参数。
 * 
 * @see ColorRGBA.divideByScalar
 */
ColorRGBA.prototype.divideByScalar = function (scalar, result) {
    return ColorRGBA.divideByScalar(this, scalar, result || this);
};

/**
 * 从 ColorRGB 实例创建新的 Color。
 *
 * @param {ColorRGB} color ColorRGB 实例。
 * @param {number} [alpha=1.0] alpha 分量。
 * @param {ColorRGBA} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGBA} 修改后的 result 参数；若 result 未定义则返回新实例。
 * 
 * @see ColorRGBA#toColorRGB
*/
ColorRGBA.fromColorRGB = function (color, alpha = 1.0, result = new ColorRGBA()) {
    Check.typeOf.object('color', color);

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    result.alpha = alpha;
    return result;
};

/**
 * @see ColorRGBA.fromColorRGB
 * @deprecated
*/
ColorRGBA.fromColor3 = ColorRGBA.fromColorRGB;

/**
 * 从 ColorRGB 实例设置此 Color 的值。
 * 
 * @see ColorRGBA.fromColorRGB
*/
ColorRGBA.prototype.setFromColorRGB = function (color, alpha = 1.0) {
    return ColorRGBA.fromColorRGB(color, alpha, this);
};

/**
 * 将此 Color 转换为 ColorRGB 实例。
 * 
 * @param {ColorRGB} [result] 用于存储结果的对象，若未定义将创建一个新实例。
 * @returns {ColorRGB} 修改后的 result 参数；若 result 未定义则返回新实例。
 * 
 * @see ColorRGBA.fromColorRGB
*/
ColorRGBA.prototype.toColorRGB = function (result = new ColorRGBA()) {
    result.red = this.red;
    result.green = this.green;
    result.blue = this.blue;

    return result;
};

/**
 * @see ColorRGBA#toColorRGB
 * @deprecated
*/
ColorRGBA.prototype.toColor3 = ColorRGBA.prototype.toColorRGB;

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F0F8FF
 * <span class="colorSwath" style="background: #F0F8FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'ALICEBLUE', {
    get: function () {
        return _namedColor('ALICEBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FAEBD7
 * <span class="colorSwath" style="background: #FAEBD7;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'ANTIQUEWHITE', {
    get: function () {
        return _namedColor('ANTIQUEWHITE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'AQUA', {
    get: function () {
        return _namedColor('AQUA');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #7FFFD4
 * <span class="colorSwath" style="background: #7FFFD4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'AQUAMARINE', {
    get: function () {
        return _namedColor('AQUAMARINE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F0FFFF
 * <span class="colorSwath" style="background: #F0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'AZURE', {
    get: function () {
        return _namedColor('AZURE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F5F5DC
 * <span class="colorSwath" style="background: #F5F5DC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BEIGE', {
    get: function () {
        return _namedColor('BEIGE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFE4C4
 * <span class="colorSwath" style="background: #FFE4C4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BISQUE', {
    get: function () {
        return _namedColor('BISQUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #000000
 * <span class="colorSwath" style="background: #000000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BLACK', {
    get: function () {
        return _namedColor('BLACK');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFEBCD
 * <span class="colorSwath" style="background: #FFEBCD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BLANCHEDALMOND', {
    get: function () {
        return _namedColor('BLANCHEDALMOND');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #0000FF
 * <span class="colorSwath" style="background: #0000FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BLUE', {
    get: function () {
        return _namedColor('BLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #8A2BE2
 * <span class="colorSwath" style="background: #8A2BE2;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BLUEVIOLET', {
    get: function () {
        return _namedColor('BLUEVIOLET');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #A52A2A
 * <span class="colorSwath" style="background: #A52A2A;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BROWN', {
    get: function () {
        return _namedColor('BROWN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #DEB887
 * <span class="colorSwath" style="background: #DEB887;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'BURLYWOOD', {
    get: function () {
        return _namedColor('BURLYWOOD');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #5F9EA0
 * <span class="colorSwath" style="background: #5F9EA0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CADETBLUE', {
    get: function () {
        return _namedColor('CADETBLUE');
    },
    enumerable: true,
    configurable: false,
});
/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #7FFF00
 * <span class="colorSwath" style="background: #7FFF00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CHARTREUSE', {
    get: function () {
        return _namedColor('CHARTREUSE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #D2691E
 * <span class="colorSwath" style="background: #D2691E;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CHOCOLATE', {
    get: function () {
        return _namedColor('CHOCOLATE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF7F50
 * <span class="colorSwath" style="background: #FF7F50;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CORAL', {
    get: function () {
        return _namedColor('CORAL');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #6495ED
 * <span class="colorSwath" style="background: #6495ED;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CORNFLOWERBLUE', {
    get: function () {
        return _namedColor('CORNFLOWERBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFF8DC
 * <span class="colorSwath" style="background: #FFF8DC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CORNSILK', {
    get: function () {
        return _namedColor('CORNSILK');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #DC143C
 * <span class="colorSwath" style="background: #DC143C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CRIMSON', {
    get: function () {
        return _namedColor('CRIMSON');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'CYAN', {
    get: function () {
        return _namedColor('CYAN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00008B
 * <span class="colorSwath" style="background: #00008B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKBLUE', {
    get: function () {
        return _namedColor('DARKBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #008B8B
 * <span class="colorSwath" style="background: #008B8B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKCYAN', {
    get: function () {
        return _namedColor('DARKCYAN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #B8860B
 * <span class="colorSwath" style="background: #B8860B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKGOLDENROD', {
    get: function () {
        return _namedColor('DARKGOLDENROD');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKGRAY', {
    get: function () {
        return _namedColor('DARKGRAY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #006400
 * <span class="colorSwath" style="background: #006400;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKGREEN', {
    get: function () {
        return _namedColor('DARKGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKGREY', {
    get: function () {
        return ColorRGBA.DARKGRAY;
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #BDB76B
 * <span class="colorSwath" style="background: #BDB76B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKKHAKI', {
    get: function () {
        return _namedColor('DARKKHAKI');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #8B008B
 * <span class="colorSwath" style="background: #8B008B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKMAGENTA', {
    get: function () {
        return _namedColor('DARKMAGENTA');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #556B2F
 * <span class="colorSwath" style="background: #556B2F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKOLIVEGREEN', {
    get: function () {
        return _namedColor('DARKOLIVEGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF8C00
 * <span class="colorSwath" style="background: #FF8C00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKORANGE', {
    get: function () {
        return _namedColor('DARKORANGE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #9932CC
 * <span class="colorSwath" style="background: #9932CC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKORCHID', {
    get: function () {
        return _namedColor('DARKORCHID');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #8B0000
 * <span class="colorSwath" style="background: #8B0000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKRED', {
    get: function () {
        return _namedColor('DARKRED');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #E9967A
 * <span class="colorSwath" style="background: #E9967A;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKSALMON', {
    get: function () {
        return _namedColor('DARKSALMON');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #8FBC8F
 * <span class="colorSwath" style="background: #8FBC8F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKSEAGREEN', {
    get: function () {
        return _namedColor('DARKSEAGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #483D8B
 * <span class="colorSwath" style="background: #483D8B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKSLATEBLUE', {
    get: function () {
        return _namedColor('DARKSLATEBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKSLATEGRAY', {
    get: function () {
        return _namedColor('DARKSLATEGRAY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKSLATEGREY', {
    get: function () {
        return ColorRGBA.DARKSLATEGRAY;
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00CED1
 * <span class="colorSwath" style="background: #00CED1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKTURQUOISE', {
    get: function () {
        return _namedColor('DARKTURQUOISE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #9400D3
 * <span class="colorSwath" style="background: #9400D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DARKVIOLET', {
    get: function () {
        return _namedColor('DARKVIOLET');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF1493
 * <span class="colorSwath" style="background: #FF1493;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DEEPPINK', {
    get: function () {
        return _namedColor('DEEPPINK');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00BFFF
 * <span class="colorSwath" style="background: #00BFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DEEPSKYBLUE', {
    get: function () {
        return _namedColor('DEEPSKYBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DIMGRAY', {
    get: function () {
        return _namedColor('DIMGRAY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DIMGREY', {
    get: function () {
        return ColorRGBA.DIMGRAY;
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #1E90FF
 * <span class="colorSwath" style="background: #1E90FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'DODGERBLUE', {
    get: function () {
        return _namedColor('DODGERBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #B22222
 * <span class="colorSwath" style="background: #B22222;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'FIREBRICK', {
    get: function () {
        return _namedColor('FIREBRICK');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFFAF0
 * <span class="colorSwath" style="background: #FFFAF0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'FLORALWHITE', {
    get: function () {
        return _namedColor('FLORALWHITE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #228B22
 * <span class="colorSwath" style="background: #228B22;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'FORESTGREEN', {
    get: function () {
        return _namedColor('FORESTGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'FUCHSIA', {
    get: function () {
        return _namedColor('FUCHSIA');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #DCDCDC
 * <span class="colorSwath" style="background: #DCDCDC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GAINSBORO', {
    get: function () {
        return _namedColor('GAINSBORO');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F8F8FF
 * <span class="colorSwath" style="background: #F8F8FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GHOSTWHITE', {
    get: function () {
        return _namedColor('GHOSTWHITE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFD700
 * <span class="colorSwath" style="background: #FFD700;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GOLD', {
    get: function () {
        return _namedColor('GOLD');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #DAA520
 * <span class="colorSwath" style="background: #DAA520;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GOLDENROD', {
    get: function () {
        return _namedColor('GOLDENROD');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GRAY', {
    get: function () {
        return _namedColor('GRAY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #008000
 * <span class="colorSwath" style="background: #008000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GREEN', {
    get: function () {
        return _namedColor('GREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #ADFF2F
 * <span class="colorSwath" style="background: #ADFF2F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GREENYELLOW', {
    get: function () {
        return _namedColor('GREENYELLOW');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'GREY', {
    get: function () {
        return ColorRGBA.GRAY;
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F0FFF0
 * <span class="colorSwath" style="background: #F0FFF0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'HONEYDEW', {
    get: function () {
        return _namedColor('HONEYDEW');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF69B4
 * <span class="colorSwath" style="background: #FF69B4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'HOTPINK', {
    get: function () {
        return _namedColor('HOTPINK');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #CD5C5C
 * <span class="colorSwath" style="background: #CD5C5C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'INDIANRED', {
    get: function () {
        return _namedColor('INDIANRED');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #4B0082
 * <span class="colorSwath" style="background: #4B0082;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'INDIGO', {
    get: function () {
        return _namedColor('INDIGO');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFFFF0
 * <span class="colorSwath" style="background: #FFFFF0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'IVORY', {
    get: function () {
        return _namedColor('IVORY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F0E68C
 * <span class="colorSwath" style="background: #F0E68C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'KHAKI', {
    get: function () {
        return _namedColor('KHAKI');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #E6E6FA
 * <span class="colorSwath" style="background: #E6E6FA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LAVENDER', {
    get: function () {
        return _namedColor('LAVENDER');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFF0F5
 * <span class="colorSwath" style="background: #FFF0F5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LAVENDAR_BLUSH', {
    get: function () {
        return _namedColor('LAVENDAR_BLUSH');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #7CFC00
 * <span class="colorSwath" style="background: #7CFC00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LAWNGREEN', {
    get: function () {
        return _namedColor('LAWNGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFFACD
 * <span class="colorSwath" style="background: #FFFACD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LEMONCHIFFON', {
    get: function () {
        return _namedColor('LEMONCHIFFON');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #ADD8E6
 * <span class="colorSwath" style="background: #ADD8E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTBLUE', {
    get: function () {
        return _namedColor('LIGHTBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F08080
 * <span class="colorSwath" style="background: #F08080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTCORAL', {
    get: function () {
        return _namedColor('LIGHTCORAL');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #E0FFFF
 * <span class="colorSwath" style="background: #E0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTCYAN', {
    get: function () {
        return _namedColor('LIGHTCYAN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FAFAD2
 * <span class="colorSwath" style="background: #FAFAD2;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTGOLDENRODYELLOW', {
    get: function () {
        return _namedColor('LIGHTGOLDENRODYELLOW');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTGRAY', {
    get: function () {
        return _namedColor('LIGHTGRAY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #90EE90
 * <span class="colorSwath" style="background: #90EE90;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTGREEN', {
    get: function () {
        return _namedColor('LIGHTGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTGREY', {
    get: function () {
        return ColorRGBA.LIGHTGRAY;
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFB6C1
 * <span class="colorSwath" style="background: #FFB6C1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTPINK', {
    get: function () {
        return _namedColor('LIGHTPINK');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #20B2AA
 * <span class="colorSwath" style="background: #20B2AA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTSEAGREEN', {
    get: function () {
        return _namedColor('LIGHTSEAGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #87CEFA
 * <span class="colorSwath" style="background: #87CEFA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTSKYBLUE', {
    get: function () {
        return _namedColor('LIGHTSKYBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTSLATEGRAY', {
    get: function () {
        return _namedColor('LIGHTSLATEGRAY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTSLATEGREY', {
    get: function () {
        return ColorRGBA.LIGHTSLATEGRAY;
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #B0C4DE
 * <span class="colorSwath" style="background: #B0C4DE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTSTEELBLUE', {
    get: function () {
        return _namedColor('LIGHTSTEELBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFFFE0
 * <span class="colorSwath" style="background: #FFFFE0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIGHTYELLOW', {
    get: function () {
        return _namedColor('LIGHTYELLOW');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00FF00
 * <span class="colorSwath" style="background: #00FF00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIME', {
    get: function () {
        return _namedColor('LIME');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #32CD32
 * <span class="colorSwath" style="background: #32CD32;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LIMEGREEN', {
    get: function () {
        return _namedColor('LIMEGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FAF0E6
 * <span class="colorSwath" style="background: #FAF0E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'LINEN', {
    get: function () {
        return _namedColor('LINEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MAGENTA', {
    get: function () {
        return _namedColor('MAGENTA');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #800000
 * <span class="colorSwath" style="background: #800000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MAROON', {
    get: function () {
        return _namedColor('MAROON');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #66CDAA
 * <span class="colorSwath" style="background: #66CDAA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMAQUAMARINE', {
    get: function () {
        return _namedColor('MEDIUMAQUAMARINE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #0000CD
 * <span class="colorSwath" style="background: #0000CD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMBLUE', {
    get: function () {
        return _namedColor('MEDIUMBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #BA55D3
 * <span class="colorSwath" style="background: #BA55D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMORCHID', {
    get: function () {
        return _namedColor('MEDIUMORCHID');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #9370DB
 * <span class="colorSwath" style="background: #9370DB;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMPURPLE', {
    get: function () {
        return _namedColor('MEDIUMPURPLE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #3CB371
 * <span class="colorSwath" style="background: #3CB371;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMSEAGREEN', {
    get: function () {
        return _namedColor('MEDIUMSEAGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #7B68EE
 * <span class="colorSwath" style="background: #7B68EE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMSLATEBLUE', {
    get: function () {
        return _namedColor('MEDIUMSLATEBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00FA9A
 * <span class="colorSwath" style="background: #00FA9A;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMSPRINGGREEN', {
    get: function () {
        return _namedColor('MEDIUMSPRINGGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #48D1CC
 * <span class="colorSwath" style="background: #48D1CC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMTURQUOISE', {
    get: function () {
        return _namedColor('MEDIUMTURQUOISE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #C71585
 * <span class="colorSwath" style="background: #C71585;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MEDIUMVIOLETRED', {
    get: function () {
        return _namedColor('MEDIUMVIOLETRED');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #191970
 * <span class="colorSwath" style="background: #191970;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MIDNIGHTBLUE', {
    get: function () {
        return _namedColor('MIDNIGHTBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F5FFFA
 * <span class="colorSwath" style="background: #F5FFFA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MINTCREAM', {
    get: function () {
        return _namedColor('MINTCREAM');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFE4E1
 * <span class="colorSwath" style="background: #FFE4E1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MISTYROSE', {
    get: function () {
        return _namedColor('MISTYROSE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFE4B5
 * <span class="colorSwath" style="background: #FFE4B5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'MOCCASIN', {
    get: function () {
        return _namedColor('MOCCASIN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFDEAD
 * <span class="colorSwath" style="background: #FFDEAD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'NAVAJOWHITE', {
    get: function () {
        return _namedColor('NAVAJOWHITE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #000080
 * <span class="colorSwath" style="background: #000080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'NAVY', {
    get: function () {
        return _namedColor('NAVY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FDF5E6
 * <span class="colorSwath" style="background: #FDF5E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'OLDLACE', {
    get: function () {
        return _namedColor('OLDLACE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #808000
 * <span class="colorSwath" style="background: #808000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'OLIVE', {
    get: function () {
        return _namedColor('OLIVE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #6B8E23
 * <span class="colorSwath" style="background: #6B8E23;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'OLIVEDRAB', {
    get: function () {
        return _namedColor('OLIVEDRAB');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFA500
 * <span class="colorSwath" style="background: #FFA500;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'ORANGE', {
    get: function () {
        return _namedColor('ORANGE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF4500
 * <span class="colorSwath" style="background: #FF4500;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'ORANGERED', {
    get: function () {
        return _namedColor('ORANGERED');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #DA70D6
 * <span class="colorSwath" style="background: #DA70D6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'ORCHID', {
    get: function () {
        return _namedColor('ORCHID');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #EEE8AA
 * <span class="colorSwath" style="background: #EEE8AA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PALEGOLDENROD', {
    get: function () {
        return _namedColor('PALEGOLDENROD');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #98FB98
 * <span class="colorSwath" style="background: #98FB98;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PALEGREEN', {
    get: function () {
        return _namedColor('PALEGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #AFEEEE
 * <span class="colorSwath" style="background: #AFEEEE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PALETURQUOISE', {
    get: function () {
        return _namedColor('PALETURQUOISE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #DB7093
 * <span class="colorSwath" style="background: #DB7093;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PALEVIOLETRED', {
    get: function () {
        return _namedColor('PALEVIOLETRED');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFEFD5
 * <span class="colorSwath" style="background: #FFEFD5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PAPAYAWHIP', {
    get: function () {
        return _namedColor('PAPAYAWHIP');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFDAB9
 * <span class="colorSwath" style="background: #FFDAB9;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PEACHPUFF', {
    get: function () {
        return _namedColor('PEACHPUFF');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #CD853F
 * <span class="colorSwath" style="background: #CD853F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PERU', {
    get: function () {
        return _namedColor('PERU');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFC0CB
 * <span class="colorSwath" style="background: #FFC0CB;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PINK', {
    get: function () {
        return _namedColor('PINK');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #DDA0DD
 * <span class="colorSwath" style="background: #DDA0DD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PLUM', {
    get: function () {
        return _namedColor('PLUM');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #B0E0E6
 * <span class="colorSwath" style="background: #B0E0E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'POWDERBLUE', {
    get: function () {
        return _namedColor('POWDERBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #800080
 * <span class="colorSwath" style="background: #800080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'PURPLE', {
    get: function () {
        return _namedColor('PURPLE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF0000
 * <span class="colorSwath" style="background: #FF0000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'RED', {
    get: function () {
        return _namedColor('RED');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #BC8F8F
 * <span class="colorSwath" style="background: #BC8F8F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'ROSYBROWN', {
    get: function () {
        return _namedColor('ROSYBROWN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #4169E1
 * <span class="colorSwath" style="background: #4169E1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'ROYALBLUE', {
    get: function () {
        return _namedColor('ROYALBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #8B4513
 * <span class="colorSwath" style="background: #8B4513;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SADDLEBROWN', {
    get: function () {
        return _namedColor('SADDLEBROWN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FA8072
 * <span class="colorSwath" style="background: #FA8072;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SALMON', {
    get: function () {
        return _namedColor('SALMON');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F4A460
 * <span class="colorSwath" style="background: #F4A460;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SANDYBROWN', {
    get: function () {
        return _namedColor('SANDYBROWN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #2E8B57
 * <span class="colorSwath" style="background: #2E8B57;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SEAGREEN', {
    get: function () {
        return _namedColor('SEAGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFF5EE
 * <span class="colorSwath" style="background: #FFF5EE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SEASHELL', {
    get: function () {
        return _namedColor('SEASHELL');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #A0522D
 * <span class="colorSwath" style="background: #A0522D;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SIENNA', {
    get: function () {
        return _namedColor('SIENNA');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #C0C0C0
 * <span class="colorSwath" style="background: #C0C0C0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SILVER', {
    get: function () {
        return _namedColor('SILVER');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #87CEEB
 * <span class="colorSwath" style="background: #87CEEB;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SKYBLUE', {
    get: function () {
        return _namedColor('SKYBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #6A5ACD
 * <span class="colorSwath" style="background: #6A5ACD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SLATEBLUE', {
    get: function () {
        return _namedColor('SLATEBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SLATEGRAY', {
    get: function () {
        return _namedColor('SLATEGRAY');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SLATEGREY', {
    get: function () {
        return ColorRGBA.SLATEGRAY;
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFFAFA
 * <span class="colorSwath" style="background: #FFFAFA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SNOW', {
    get: function () {
        return _namedColor('SNOW');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #00FF7F
 * <span class="colorSwath" style="background: #00FF7F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'SPRINGGREEN', {
    get: function () {
        return _namedColor('SPRINGGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #4682B4
 * <span class="colorSwath" style="background: #4682B4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'STEELBLUE', {
    get: function () {
        return _namedColor('STEELBLUE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #D2B48C
 * <span class="colorSwath" style="background: #D2B48C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'TAN', {
    get: function () {
        return _namedColor('TAN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #008080
 * <span class="colorSwath" style="background: #008080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'TEAL', {
    get: function () {
        return _namedColor('TEAL');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #D8BFD8
 * <span class="colorSwath" style="background: #D8BFD8;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'THISTLE', {
    get: function () {
        return _namedColor('THISTLE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FF6347
 * <span class="colorSwath" style="background: #FF6347;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'TOMATO', {
    get: function () {
        return _namedColor('TOMATO');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #40E0D0
 * <span class="colorSwath" style="background: #40E0D0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'TURQUOISE', {
    get: function () {
        return _namedColor('TURQUOISE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #EE82EE
 * <span class="colorSwath" style="background: #EE82EE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'VIOLET', {
    get: function () {
        return _namedColor('VIOLET');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F5DEB3
 * <span class="colorSwath" style="background: #F5DEB3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'WHEAT', {
    get: function () {
        return _namedColor('WHEAT');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFFFFF
 * <span class="colorSwath" style="background: #FFFFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'WHITE', {
    get: function () {
        return _namedColor('WHITE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #F5F5F5
 * <span class="colorSwath" style="background: #F5F5F5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'WHITESMOKE', {
    get: function () {
        return _namedColor('WHITESMOKE');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #FFFF00
 * <span class="colorSwath" style="background: #FFFF00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'YELLOW', {
    get: function () {
        return _namedColor('YELLOW');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 #9ACD32
 * <span class="colorSwath" style="background: #9ACD32;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
Object.defineProperty(ColorRGBA, 'YELLOWGREEN', {
    get: function () {
        return _namedColor('YELLOWGREEN');
    },
    enumerable: true,
    configurable: false,
});

/**
 * 一个不可变的 Color 实例，初始化为 CSS 颜色 transparent。
 * <span class="colorSwath" style="background: transparent;"></span>
 *
 * @constant
 * @type {Color}
 */
ColorRGBA.TRANSPARENT = Object.freeze(new ColorRGBA(0, 0, 0, 0));

const _namedColorCache = {};
function _namedColor(name) {
    if (!(name in _namedColorCache)) {
        _namedColorCache[name] = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB[name]));
    }
    return _namedColorCache[name];
}

export default ColorRGBA;
export { ColorRGBA as Color4, ColorRGBA };
