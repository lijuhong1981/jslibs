import Check from "@lijuhong1981/jscheck/src/Check.js";
import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import isValid from "@lijuhong1981/jscheck/src/isValid.js";
import lerp from "@lijuhong1981/jsmath/src/lerp.js";
import byteToFloat from "./byteToFloat.js";
import ColorRGB from "./ColorRGB.js";
import floatToByte from "./floatToByte.js";
import hue2rgb from "./hue2rgb.js";

/**
 * A color, specified using red, green, blue, and alpha values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 * @param {number} [red=1.0] The red component.
 * @param {number} [green=1.0] The green component.
 * @param {number} [blue=1.0] The blue component.
 * @param {number} [alpha=1.0] The alpha component.
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
         * The red component.
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
         * The green component.
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
         * The blue component.
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
         * The alpha component.
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
 * Creates a new Color specified using red, green, blue, and alpha values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 *
 * @param {number} [red=1.0] The red component.
 * @param {number} [green=1.0] The green component.
 * @param {number} [blue=1.0] The blue component.
 * @param {number} [alpha=1.0] The alpha component.
 * @param {ColorRGBA} [result] The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter or a new Color instance if one was not provided.
 */
ColorRGBA.fromValues = function (red = 1.0, green = 1.0, blue = 1.0, alpha = 1.0, result = new ColorRGBA()) {
    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;
    return result;
};

/**
 * Sets this Color values from specified using red, green, blue, and alpha values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 * 
 * @see ColorRGBA.fromValues
*/
ColorRGBA.prototype.setFromValues = function (red = 1.0, green = 1.0, blue = 1.0) {
    return ColorRGBA.fromValues(red, green, blue, this);
};

/**
 * Creates a new Color specified using red, green, blue, and alpha values,
 * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
 *
 * @param {number} [red=255] The red component.
 * @param {number} [green=255] The green component.
 * @param {number} [blue=255] The blue component.
 * @param {number} [alpha=255] The alpha component.
 * @param {ColorRGBA} [result] The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter or a new Color instance if one was not provided.
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
 * Sets this Color values from specified using red, green, blue, and alpha values,
 * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
 * 
 * @see ColorRGBA.fromBytes
*/
ColorRGBA.prototype.setFromBytes = function (red, green, blue) {
    return ColorRGBA.fromBytes(red, green, blue, this);
};

/**
 * Creates a new Color that has the same red, green, and blue components
 * of the specified color, but with the specified alpha value.
 *
 * @param {ColorRGBA} color The base color
 * @param {number} alpha The new alpha component.
 * @param {ColorRGBA} [result] The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter or a new Color instance if one was not provided.
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
 * Creates a new Color from a single numeric unsigned 32-bit RGBA value, using the endianness
 * of the system.
 *
 * @param {number} rgba A single numeric unsigned 32-bit RGBA value.
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The color object.
 *
 * @example
 * const color = ColorRGBA.fromHexNumber(0x67ADDFFF);
 *
 * @see ColorRGBA#toHexNumber
 */
ColorRGBA.fromHexNumber = function (rgba, result) {
    Check.typeOf.integer('rgba', rgba);
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint32Array[0] = rgba;
    return ColorRGBA.fromBytes(
        scratchUint8Array[0],
        scratchUint8Array[1],
        scratchUint8Array[2],
        scratchUint8Array[3],
        result,
    );
};

/**
 * Sets this Color values from a single numeric unsigned 32-bit RGBA value, using the endianness
 * of the system.
 *
 * @see ColorRGBA.fromHexNumber
 */
ColorRGBA.prototype.setFromHexNumber = function (rgba) {
    return ColorRGBA.fromHexNumber(rgba);
};

/**
 * Creates a Color instance from hue, saturation, and lightness.
 *
 * @param {number} [hue=0] The hue angle 0...1
 * @param {number} [saturation=0] The saturation value 0...1
 * @param {number} [lightness=0] The lightness value 0...1
 * @param {number} [alpha=1.0] The alpha component 0...1
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The color object.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#hsl-color|CSS color values}
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
 * Sets this Color values from hue, saturation, and lightness.
 * 
 * @see ColorRGBA.fromHsl
 */
ColorRGBA.prototype.setFromHsl = function (hue, saturation, lightness, alpha) {
    return ColorRGBA.fromHsl(hue, saturation, lightness, alpha, this);
};

/**
 * Creates a random color using the provided options. 
 *
 * @param {Object} [options] Object with the following properties:
 * @param {number} [options.red] If specified, the red component to use instead of a randomized value.
 * @param {number} [options.minimumRed=0.0] The maximum red value to generate if none was specified.
 * @param {number} [options.maximumRed=1.0] The minimum red value to generate if none was specified.
 * @param {number} [options.green] If specified, the green component to use instead of a randomized value.
 * @param {number} [options.minimumGreen=0.0] The maximum green value to generate if none was specified.
 * @param {number} [options.maximumGreen=1.0] The minimum green value to generate if none was specified.
 * @param {number} [options.blue] If specified, the blue component to use instead of a randomized value.
 * @param {number} [options.minimumBlue=0.0] The maximum blue value to generate if none was specified.
 * @param {number} [options.maximumBlue=1.0] The minimum blue value to generate if none was specified.
 * @param {number} [options.alpha] If specified, the alpha component to use instead of a randomized value.
 * @param {number} [options.minimumAlpha=0.0] The maximum alpha value to generate if none was specified.
 * @param {number} [options.maximumAlpha=1.0] The minimum alpha value to generate if none was specified.
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The modified result parameter or a new instance if result was undefined.
 *
 * @exception {Error} minimumRed must be less than or equal to maximumRed.
 * @exception {Error} minimumGreen must be less than or equal to maximumGreen.
 * @exception {Error} minimumBlue must be less than or equal to maximumBlue.
 * @exception {Error} minimumAlpha must be less than or equal to maximumAlpha.
 *
 * @example
 * //Create a completely random color
 * const color = ColorRGBA.fromRandom();
 *
 * //Create a random shade of yellow.
 * const color1 = ColorRGBA.fromRandom({
 *     red : 1.0,
 *     green : 1.0,
 *     alpha : 1.0
 * });
 *
 * //Create a random bright color.
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
 * Set this Color random values using the provided options.
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
//rgb(), rgba(), or rgb%()
const rgbParenthesesMatcher =
    /^rgba?\s*\(\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)\s*[,\s]+\s*([0-9.]+%?)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;
//hsl() or hsla()
const hslParenthesesMatcher =
    /^hsla?\s*\(\s*([0-9.]+)\s*[,\s]+\s*([0-9.]+%)\s*[,\s]+\s*([0-9.]+%)(?:\s*[,\s/]+\s*([0-9.]+))?\s*\)$/i;

/**
 * Creates a Color instance from a CSS color value.
 *
 * @param {string} colorString The CSS color value in #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), or hsla() format.
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The color object, or undefined if the string was not a valid CSS color.
 *
 *
 * @example
 * const color = ColorRGBA.fromCssColorString('#67ADDF');
 * const green = ColorRGBA.fromCssColorString('green');
 *
 * @see {@link http://www.w3.org/TR/css3-color|CSS color values}
 * @see ColorRGBA#toCssColorString
 * @see ColorRGBA#toCssHexString
 */
ColorRGBA.fromCssColorString = function (colorString, result = new ColorRGBA()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("colorString", colorString);
    //>>includeEnd('debug');

    // Remove all surrounding whitespaces from the color string
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
        return result;
    }

    matches = rgbParenthesesMatcher.exec(color);
    if (matches !== null) {
        result.red =
            parseFloat(matches[1]) / ("%" === matches[1].substring(-1) ? 100.0 : 255.0);
        result.green =
            parseFloat(matches[2]) / ("%" === matches[2].substring(-1) ? 100.0 : 255.0);
        result.blue =
            parseFloat(matches[3]) / ("%" === matches[3].substring(-1) ? 100.0 : 255.0);
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
 * Set this Color values from a CSS color value.
 * 
 * @see ColorRGBA.fromCssColorString
*/
ColorRGBA.prototype.setFromCssColorString = function (colorString) {
    return ColorRGBA.fromCssColorString(colorString, this);
};

/**
 * The number of elements used to pack the object into an array.
 * @type {number}
 */
ColorRGBA.packedLength = 4;

/**
 * Stores the provided instance into the provided array.
 *
 * @param {ColorRGBA} value The value to pack.
 * @param {number[]} array The array to pack into.
 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {number[]} The array that was packed into
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
 * Retrieves an instance from a packed array.
 *
 * @param {number[]} array The packed array.
 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {ColorRGBA} [result] The object into which to store the result.
 * @returns {ColorRGBA} The modified result parameter or a new Color instance if one was not provided.
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
 * Creates an instance from a array, equals unpack.
 *
 * @param {number[]} array The packed array.
 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {ColorRGBA} [result] The object into which to store the result.
 * @returns {ColorRGBA} The modified result parameter or a new Color instance if one was not provided.
 * 
 * @see ColorRGBA.unpack
 * @see ColorRGBA#toArray
*/
ColorRGBA.fromArray = ColorRGBA.unpack;

/**
 * Sets this Color values from a array.
 * 
 * @see ColorRGBA.fromArray
*/
ColorRGBA.prototype.setFromArray = function (array, startingIndex) {
    return ColorRGBA.unpack(array, startingIndex, this);
};

/**
 * Stores this instance into the provided array.
 * 
 * @param {number[]} array The array to pack into.
 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {number[]} The array that was packed into
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
 * Duplicates a Color.
 *
 * @param {ColorRGBA} color The Color to duplicate.
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
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
 * Returns true if the first Color equals the second Color.
 *
 * @param {ColorRGBA} [left] The first Color to compare for equality.
 * @param {ColorRGBA} [right] The second Color to compare for equality.
 * @returns {boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
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
 * Returns true if the Color values equals the Array values.
 *
 * @param {ColorRGBA} [color] The Color to compare for equality.
 * @param {number[]} [array] The Array to compare for equality.
 * @param {startingIndex} [startingIndex = 0] The starting index of the Array.
 * @returns {boolean} <code>true</code> if the values are equal; otherwise, <code>false</code>.
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
 * Returns <code>true</code> if the first Color equals the second Color componentwise within the specified epsilon.
 *
 * @param {ColorRGBA} [left] The first Color to compare for equality.
 * @param {ColorRGBA} [right] The second Color to compare for equality.
 * @param {number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
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
 * Returns a duplicate of a Color instance.
 *
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The modified result parameter or a new instance if result was undefined.
 */
ColorRGBA.prototype.clone = function (result) {
    return ColorRGBA.clone(this, result);
};

/**
 * Returns true if this Color equals other.
 *
 * @param {ColorRGBA} [other] The Color to compare for equality.
 * @returns {boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
 */
ColorRGBA.prototype.equals = function (other) {
    return ColorRGBA.equals(this, other);
};

/**
 * Returns true if this Color values equals the Array values.
 *
 * @param {number[]} [array] The Array to compare for equality.
 * @param {startingIndex} [startingIndex = 0] The starting index of the Array.
 * @returns {boolean} <code>true</code> if the values are equal; otherwise, <code>false</code>.
 */
ColorRGBA.prototype.equalsArray = function (array, startingIndex) {
    return ColorRGBA.equalsArray(this, array, startingIndex);
}

/**
 * Returns <code>true</code> if this Color equals other componentwise within the specified epsilon.
 *
 * @param {ColorRGBA} other The Color to compare for equality.
 * @param {number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
 */
ColorRGBA.prototype.equalsEpsilon = function (other, epsilon) {
    return ColorRGBA.equalsEpsilon(this, other, epsilon);
};

/**
 * Creates a string representing this Color in the format 'Color(red, green, blue, alpha)'.
 *
 * @returns {string} A string representing this Color in the format 'Color(red, green, blue, alpha)'.
 */
ColorRGBA.prototype.toString = function () {
    return `Color(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
};

/**
 * Creates a string containing the CSS color value for this color.
 *
 * @returns {string} The CSS equivalent of this color.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#rgba-color|CSS RGB or RGBA color values}
 * @see ColorRGBA.fromCssColorString
 */
ColorRGBA.prototype.toCssColorString = function () {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);
    return `rgba(${red},${green},${blue},${this.alpha})`;
};

/**
 * Creates a string containing CSS hex string color value for this color.
 *
 * @returns {string} The CSS hex string equivalent of this color.
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
 * Converts this color to an array of red, green, blue, and alpha values
 * that are in the range of 0 to 255.
 *
 * @param {number[]} [result] The array to store the result in, if undefined a new instance will be created.
 * @returns {number[]} The modified result parameter or a new instance if result was undefined.
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
 * Converts this color to a single numeric unsigned 32-bit RGBA value, using the endianness
 * of the system.
 *
 * @returns {number} A single numeric unsigned 32-bit RGBA value.
 *
 *
 * @example
 * const rgba = ColorRGBA.BLUE.toHexNumber();
 *
 * @see ColorRGBA.fromHexNumber
 */
ColorRGBA.prototype.toHexNumber = function () {
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint8Array[0] = floatToByte(this.red);
    scratchUint8Array[1] = floatToByte(this.green);
    scratchUint8Array[2] = floatToByte(this.blue);
    scratchUint8Array[3] = floatToByte(this.alpha);
    return scratchUint32Array[0];
};

/**
 * Creates a new Color that Brightens by the provided magnitude.
 *
 * @param {ColorRGBA} color The base color
 * @param {number} magnitude A positive number indicating the amount to brighten.
 * @param {ColorRGBA} [result] The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter or a new ColorRGB instance if one was not provided.
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
 * Brightens this Color by the provided magnitude.
 *
 * @param {number} magnitude A positive number indicating the amount to brighten.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result.
 *
 * @see ColorRGBA.brighten
 */
ColorRGBA.prototype.brighten = function (magnitude, result) {
    return ColorRGBA.brighten(this, magnitude, result || this);
};

/**
 * Creates a new Color that Darkens by the provided magnitude.
 *
 * @param {ColorRGBA} color The base color
 * @param {number} magnitude A positive number indicating the amount to darken.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Darkens this Color by the provided magnitude.
 *
 * @param {number} magnitude A positive number indicating the amount to darken.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 *
 * @see ColorRGBA.darken
 */
ColorRGBA.prototype.darken = function (magnitude, result) {
    return ColorRGBA.darken(this, magnitude, result || this);
};

/**
 * Computes the componentwise sum of two Colors.
 *
 * @param {ColorRGBA} left The first Color.
 * @param {ColorRGBA} right The second Color.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Adds this Color componentwise by other Color.
 *
 * @param {ColorRGBA} other The other Color.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 * 
 * @see ColorRGBA.add
 */
ColorRGBA.prototype.add = function (other, result) {
    return ColorRGBA.add(this, other, result || this);
};

/**
 * Computes the componentwise difference of two Colors.
 *
 * @param {ColorRGBA} left The first Color.
 * @param {ColorRGBA} right The second Color.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Subtracts this Color componentwise by other Color.
 *
 * @param {ColorRGBA} other The other Color.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 * 
 * @see ColorRGBA.subtract
 */
ColorRGBA.prototype.subtract = function (other, result) {
    return ColorRGBA.subtract(this, other, result || this);
};

/**
 * Computes the componentwise product of two Colors.
 *
 * @param {ColorRGBA} left The first Color.
 * @param {ColorRGBA} right The second Color.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Multiplies this Color componentwise by other Color.
 *
 * @param {ColorRGBA} other The other Color.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 * 
 * @see ColorRGBA.multiply
 */
ColorRGBA.prototype.multiply = function (other, result) {
    return ColorRGBA.multiply(this, other, result || this);
};

/**
 * Computes the componentwise quotient of two Colors.
 *
 * @param {ColorRGBA} left The first Color.
 * @param {ColorRGBA} right The second Color.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Divides this Color componentwise by other Color.
 *
 * @param {ColorRGBA} other The other Color.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 * 
 * @see ColorRGBA.divide
 */
ColorRGBA.prototype.divide = function (other, result) {
    return ColorRGBA.divide(this, other, result || this);
};

/**
 * Computes the componentwise modulus of two Colors.
 *
 * @param {ColorRGBA} left The first Color.
 * @param {ColorRGBA} right The second Color.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Modulus this Color componentwise by other Color.
 *
 * @param {ColorRGBA} other The other Color.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 * 
 * @see ColorRGBA.mod
 */
ColorRGBA.prototype.mod = function (other, result) {
    return ColorRGBA.mod(this, other, result || this);
};

/**
 * Computes the linear interpolation or extrapolation at t between the provided colors.
 *
 * @param {ColorRGBA} start The color corresponding to t at 0.0.
 * @param {ColorRGBA} end The color corresponding to t at 1.0.
 * @param {number} t The point along t at which to interpolate.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
    result.alpha = CesiumMath.lerp(start.alpha, end.alpha, t);
    return result;
};

/**
 * Multiplies the provided Color componentwise by the provided scalar.
 *
 * @param {ColorRGBA} color The Color to be scaled.
 * @param {number} scalar The scalar to multiply with.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Multiplies this Color componentwise by the provided scalar.
 *
 * @param {number} scalar The scalar to multiply with.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 * 
 * @see ColorRGBA.multiplyByScalar
 */
ColorRGBA.prototype.multiplyByScalar = function (scalar, result) {
    return ColorRGBA.multiplyByScalar(this, scalar, result || this);
};

/**
 * Divides the provided Color componentwise by the provided scalar.
 *
 * @param {ColorRGBA} color The Color to be divided.
 * @param {number} scalar The scalar to divide with.
 * @param {ColorRGBA} result The object onto which to store the result.
 * @returns {ColorRGBA} The modified result parameter.
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
 * Divides this Color componentwise by the provided scalar.
 *
 * @param {number} scalar The scalar to divide with.
 * @param {ColorRGBA} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGBA} The modified result parameter.
 * 
 * @see ColorRGBA.divideByScalar
 */
ColorRGBA.prototype.divideByScalar = function (scalar, result) {
    return ColorRGBA.divideByScalar(this, scalar, result || this);
};

/**
 * Creates a new Color from a ColorRGB instance.
 *
 * @param {ColorRGB} color The ColorRGB instance.
 * @param {number} [alpha=1.0] The alpha component.
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The modified result parameter or a new instance if result was undefined.
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
 * Sets this Color values from an ColorRGB instance.
 * 
 * @see ColorRGBA.fromColorRGB
*/
ColorRGBA.prototype.setFromColorRGB = function (color, alpha = 1.0) {
    return ColorRGBA.fromColorRGB(color, alpha, this);
};

/**
 * Converts this Color to an ColorRGB instance.
 * 
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The modified result parameter or a new instance if result was undefined.
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
 * An immutable Color instance initialized to CSS color #F0F8FF
 * <span class="colorSwath" style="background: #F0F8FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.ALICEBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.ALICEBLUE));

/**
 * An immutable Color instance initialized to CSS color #FAEBD7
 * <span class="colorSwath" style="background: #FAEBD7;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.ANTIQUEWHITE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.ANTIQUEWHITE));

/**
 * An immutable Color instance initialized to CSS color #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.AQUA = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.AQUA));

/**
 * An immutable Color instance initialized to CSS color #7FFFD4
 * <span class="colorSwath" style="background: #7FFFD4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.AQUAMARINE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.AQUAMARINE));

/**
 * An immutable Color instance initialized to CSS color #F0FFFF
 * <span class="colorSwath" style="background: #F0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.AZURE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.AZURE));

/**
 * An immutable Color instance initialized to CSS color #F5F5DC
 * <span class="colorSwath" style="background: #F5F5DC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BEIGE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BEIGE));

/**
 * An immutable Color instance initialized to CSS color #FFE4C4
 * <span class="colorSwath" style="background: #FFE4C4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BISQUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BISQUE));

/**
 * An immutable Color instance initialized to CSS color #000000
 * <span class="colorSwath" style="background: #000000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BLACK = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BLACK));

/**
 * An immutable Color instance initialized to CSS color #FFEBCD
 * <span class="colorSwath" style="background: #FFEBCD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BLANCHEDALMOND = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BLANCHEDALMOND));

/**
 * An immutable Color instance initialized to CSS color #0000FF
 * <span class="colorSwath" style="background: #0000FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BLUE));

/**
 * An immutable Color instance initialized to CSS color #8A2BE2
 * <span class="colorSwath" style="background: #8A2BE2;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BLUEVIOLET = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BLUEVIOLET));

/**
 * An immutable Color instance initialized to CSS color #A52A2A
 * <span class="colorSwath" style="background: #A52A2A;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BROWN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BROWN));

/**
 * An immutable Color instance initialized to CSS color #DEB887
 * <span class="colorSwath" style="background: #DEB887;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.BURLYWOOD = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.BURLYWOOD));

/**
 * An immutable Color instance initialized to CSS color #5F9EA0
 * <span class="colorSwath" style="background: #5F9EA0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CADETBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CADETBLUE));
/**
 * An immutable Color instance initialized to CSS color #7FFF00
 * <span class="colorSwath" style="background: #7FFF00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CHARTREUSE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CHARTREUSE));

/**
 * An immutable Color instance initialized to CSS color #D2691E
 * <span class="colorSwath" style="background: #D2691E;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CHOCOLATE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CHOCOLATE));

/**
 * An immutable Color instance initialized to CSS color #FF7F50
 * <span class="colorSwath" style="background: #FF7F50;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CORAL = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CORAL));

/**
 * An immutable Color instance initialized to CSS color #6495ED
 * <span class="colorSwath" style="background: #6495ED;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CORNFLOWERBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CORNFLOWERBLUE));

/**
 * An immutable Color instance initialized to CSS color #FFF8DC
 * <span class="colorSwath" style="background: #FFF8DC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CORNSILK = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CORNSILK));

/**
 * An immutable Color instance initialized to CSS color #DC143C
 * <span class="colorSwath" style="background: #DC143C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CRIMSON = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CRIMSON));

/**
 * An immutable Color instance initialized to CSS color #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.CYAN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.CYAN));

/**
 * An immutable Color instance initialized to CSS color #00008B
 * <span class="colorSwath" style="background: #00008B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKBLUE));

/**
 * An immutable Color instance initialized to CSS color #008B8B
 * <span class="colorSwath" style="background: #008B8B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKCYAN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKCYAN));

/**
 * An immutable Color instance initialized to CSS color #B8860B
 * <span class="colorSwath" style="background: #B8860B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKGOLDENROD = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKGOLDENROD));

/**
 * An immutable Color instance initialized to CSS color #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKGRAY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKGRAY));

/**
 * An immutable Color instance initialized to CSS color #006400
 * <span class="colorSwath" style="background: #006400;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKGREEN));

/**
 * An immutable Color instance initialized to CSS color #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKGREY = ColorRGBA.DARKGRAY;

/**
 * An immutable Color instance initialized to CSS color #BDB76B
 * <span class="colorSwath" style="background: #BDB76B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKKHAKI = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKKHAKI));

/**
 * An immutable Color instance initialized to CSS color #8B008B
 * <span class="colorSwath" style="background: #8B008B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKMAGENTA = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKMAGENTA));

/**
 * An immutable Color instance initialized to CSS color #556B2F
 * <span class="colorSwath" style="background: #556B2F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKOLIVEGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKOLIVEGREEN));

/**
 * An immutable Color instance initialized to CSS color #FF8C00
 * <span class="colorSwath" style="background: #FF8C00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKORANGE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKORANGE));

/**
 * An immutable Color instance initialized to CSS color #9932CC
 * <span class="colorSwath" style="background: #9932CC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKORCHID = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKORCHID));

/**
 * An immutable Color instance initialized to CSS color #8B0000
 * <span class="colorSwath" style="background: #8B0000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKRED = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKRED));

/**
 * An immutable Color instance initialized to CSS color #E9967A
 * <span class="colorSwath" style="background: #E9967A;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKSALMON = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKSALMON));

/**
 * An immutable Color instance initialized to CSS color #8FBC8F
 * <span class="colorSwath" style="background: #8FBC8F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKSEAGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKSEAGREEN));

/**
 * An immutable Color instance initialized to CSS color #483D8B
 * <span class="colorSwath" style="background: #483D8B;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKSLATEBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKSLATEBLUE));

/**
 * An immutable Color instance initialized to CSS color #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKSLATEGRAY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKSLATEGRAY));

/**
 * An immutable Color instance initialized to CSS color #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKSLATEGREY = ColorRGBA.DARKSLATEGRAY;

/**
 * An immutable Color instance initialized to CSS color #00CED1
 * <span class="colorSwath" style="background: #00CED1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKTURQUOISE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKTURQUOISE));

/**
 * An immutable Color instance initialized to CSS color #9400D3
 * <span class="colorSwath" style="background: #9400D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DARKVIOLET = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DARKVIOLET));

/**
 * An immutable Color instance initialized to CSS color #FF1493
 * <span class="colorSwath" style="background: #FF1493;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DEEPPINK = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DEEPPINK));

/**
 * An immutable Color instance initialized to CSS color #00BFFF
 * <span class="colorSwath" style="background: #00BFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DEEPSKYBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DEEPSKYBLUE));

/**
 * An immutable Color instance initialized to CSS color #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DIMGRAY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DIMGRAY));

/**
 * An immutable Color instance initialized to CSS color #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DIMGREY = ColorRGBA.DIMGRAY;

/**
 * An immutable Color instance initialized to CSS color #1E90FF
 * <span class="colorSwath" style="background: #1E90FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.DODGERBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.DODGERBLUE));

/**
 * An immutable Color instance initialized to CSS color #B22222
 * <span class="colorSwath" style="background: #B22222;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.FIREBRICK = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.FIREBRICK));

/**
 * An immutable Color instance initialized to CSS color #FFFAF0
 * <span class="colorSwath" style="background: #FFFAF0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.FLORALWHITE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.FLORALWHITE));

/**
 * An immutable Color instance initialized to CSS color #228B22
 * <span class="colorSwath" style="background: #228B22;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.FORESTGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.FORESTGREEN));

/**
 * An immutable Color instance initialized to CSS color #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.FUCHSIA = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.FUCHSIA));

/**
 * An immutable Color instance initialized to CSS color #DCDCDC
 * <span class="colorSwath" style="background: #DCDCDC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GAINSBORO = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.GAINSBORO));

/**
 * An immutable Color instance initialized to CSS color #F8F8FF
 * <span class="colorSwath" style="background: #F8F8FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GHOSTWHITE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.GHOSTWHITE));

/**
 * An immutable Color instance initialized to CSS color #FFD700
 * <span class="colorSwath" style="background: #FFD700;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GOLD = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.GOLD));

/**
 * An immutable Color instance initialized to CSS color #DAA520
 * <span class="colorSwath" style="background: #DAA520;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GOLDENROD = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.GOLDENROD));

/**
 * An immutable Color instance initialized to CSS color #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GRAY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.GRAY));

/**
 * An immutable Color instance initialized to CSS color #008000
 * <span class="colorSwath" style="background: #008000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.GREEN));

/**
 * An immutable Color instance initialized to CSS color #ADFF2F
 * <span class="colorSwath" style="background: #ADFF2F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GREENYELLOW = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.GREENYELLOW));

/**
 * An immutable Color instance initialized to CSS color #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.GREY = ColorRGBA.GRAY;

/**
 * An immutable Color instance initialized to CSS color #F0FFF0
 * <span class="colorSwath" style="background: #F0FFF0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.HONEYDEW = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.HONEYDEW));

/**
 * An immutable Color instance initialized to CSS color #FF69B4
 * <span class="colorSwath" style="background: #FF69B4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.HOTPINK = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.HOTPINK));

/**
 * An immutable Color instance initialized to CSS color #CD5C5C
 * <span class="colorSwath" style="background: #CD5C5C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.INDIANRED = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.INDIANRED));

/**
 * An immutable Color instance initialized to CSS color #4B0082
 * <span class="colorSwath" style="background: #4B0082;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.INDIGO = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.INDIGO));

/**
 * An immutable Color instance initialized to CSS color #FFFFF0
 * <span class="colorSwath" style="background: #FFFFF0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.IVORY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.IVORY));

/**
 * An immutable Color instance initialized to CSS color #F0E68C
 * <span class="colorSwath" style="background: #F0E68C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.KHAKI = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.KHAKI));

/**
 * An immutable Color instance initialized to CSS color #E6E6FA
 * <span class="colorSwath" style="background: #E6E6FA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LAVENDER = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LAVENDER));

/**
 * An immutable Color instance initialized to CSS color #FFF0F5
 * <span class="colorSwath" style="background: #FFF0F5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LAVENDAR_BLUSH = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LAVENDAR_BLUSH));

/**
 * An immutable Color instance initialized to CSS color #7CFC00
 * <span class="colorSwath" style="background: #7CFC00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LAWNGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LAWNGREEN));

/**
 * An immutable Color instance initialized to CSS color #FFFACD
 * <span class="colorSwath" style="background: #FFFACD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LEMONCHIFFON = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LEMONCHIFFON));

/**
 * An immutable Color instance initialized to CSS color #ADD8E6
 * <span class="colorSwath" style="background: #ADD8E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTBLUE));

/**
 * An immutable Color instance initialized to CSS color #F08080
 * <span class="colorSwath" style="background: #F08080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTCORAL = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTCORAL));

/**
 * An immutable Color instance initialized to CSS color #E0FFFF
 * <span class="colorSwath" style="background: #E0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTCYAN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTCYAN));

/**
 * An immutable Color instance initialized to CSS color #FAFAD2
 * <span class="colorSwath" style="background: #FAFAD2;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTGOLDENRODYELLOW = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTGOLDENRODYELLOW));

/**
 * An immutable Color instance initialized to CSS color #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTGRAY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTGRAY));

/**
 * An immutable Color instance initialized to CSS color #90EE90
 * <span class="colorSwath" style="background: #90EE90;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTGREEN));

/**
 * An immutable Color instance initialized to CSS color #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTGREY = ColorRGBA.LIGHTGRAY;

/**
 * An immutable Color instance initialized to CSS color #FFB6C1
 * <span class="colorSwath" style="background: #FFB6C1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTPINK = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTPINK));

/**
 * An immutable Color instance initialized to CSS color #20B2AA
 * <span class="colorSwath" style="background: #20B2AA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTSEAGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTSEAGREEN));

/**
 * An immutable Color instance initialized to CSS color #87CEFA
 * <span class="colorSwath" style="background: #87CEFA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTSKYBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTSKYBLUE));

/**
 * An immutable Color instance initialized to CSS color #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTSLATEGRAY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTSLATEGRAY));

/**
 * An immutable Color instance initialized to CSS color #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTSLATEGREY = ColorRGBA.LIGHTSLATEGRAY;

/**
 * An immutable Color instance initialized to CSS color #B0C4DE
 * <span class="colorSwath" style="background: #B0C4DE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTSTEELBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTSTEELBLUE));

/**
 * An immutable Color instance initialized to CSS color #FFFFE0
 * <span class="colorSwath" style="background: #FFFFE0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIGHTYELLOW = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIGHTYELLOW));

/**
 * An immutable Color instance initialized to CSS color #00FF00
 * <span class="colorSwath" style="background: #00FF00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIME = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIME));

/**
 * An immutable Color instance initialized to CSS color #32CD32
 * <span class="colorSwath" style="background: #32CD32;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LIMEGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LIMEGREEN));

/**
 * An immutable Color instance initialized to CSS color #FAF0E6
 * <span class="colorSwath" style="background: #FAF0E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.LINEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.LINEN));

/**
 * An immutable Color instance initialized to CSS color #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MAGENTA = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MAGENTA));

/**
 * An immutable Color instance initialized to CSS color #800000
 * <span class="colorSwath" style="background: #800000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MAROON = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MAROON));

/**
 * An immutable Color instance initialized to CSS color #66CDAA
 * <span class="colorSwath" style="background: #66CDAA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMAQUAMARINE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMAQUAMARINE));

/**
 * An immutable Color instance initialized to CSS color #0000CD
 * <span class="colorSwath" style="background: #0000CD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMBLUE));

/**
 * An immutable Color instance initialized to CSS color #BA55D3
 * <span class="colorSwath" style="background: #BA55D3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMORCHID = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMORCHID));

/**
 * An immutable Color instance initialized to CSS color #9370DB
 * <span class="colorSwath" style="background: #9370DB;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMPURPLE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMPURPLE));

/**
 * An immutable Color instance initialized to CSS color #3CB371
 * <span class="colorSwath" style="background: #3CB371;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMSEAGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMSEAGREEN));

/**
 * An immutable Color instance initialized to CSS color #7B68EE
 * <span class="colorSwath" style="background: #7B68EE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMSLATEBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMSLATEBLUE));

/**
 * An immutable Color instance initialized to CSS color #00FA9A
 * <span class="colorSwath" style="background: #00FA9A;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMSPRINGGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMSPRINGGREEN));

/**
 * An immutable Color instance initialized to CSS color #48D1CC
 * <span class="colorSwath" style="background: #48D1CC;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMTURQUOISE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMTURQUOISE));

/**
 * An immutable Color instance initialized to CSS color #C71585
 * <span class="colorSwath" style="background: #C71585;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MEDIUMVIOLETRED = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MEDIUMVIOLETRED));

/**
 * An immutable Color instance initialized to CSS color #191970
 * <span class="colorSwath" style="background: #191970;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MIDNIGHTBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MIDNIGHTBLUE));

/**
 * An immutable Color instance initialized to CSS color #F5FFFA
 * <span class="colorSwath" style="background: #F5FFFA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MINTCREAM = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MINTCREAM));

/**
 * An immutable Color instance initialized to CSS color #FFE4E1
 * <span class="colorSwath" style="background: #FFE4E1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MISTYROSE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MISTYROSE));

/**
 * An immutable Color instance initialized to CSS color #FFE4B5
 * <span class="colorSwath" style="background: #FFE4B5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.MOCCASIN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.MOCCASIN));

/**
 * An immutable Color instance initialized to CSS color #FFDEAD
 * <span class="colorSwath" style="background: #FFDEAD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.NAVAJOWHITE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.NAVAJOWHITE));

/**
 * An immutable Color instance initialized to CSS color #000080
 * <span class="colorSwath" style="background: #000080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.NAVY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.NAVY));

/**
 * An immutable Color instance initialized to CSS color #FDF5E6
 * <span class="colorSwath" style="background: #FDF5E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.OLDLACE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.OLDLACE));

/**
 * An immutable Color instance initialized to CSS color #808000
 * <span class="colorSwath" style="background: #808000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.OLIVE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.OLIVE));

/**
 * An immutable Color instance initialized to CSS color #6B8E23
 * <span class="colorSwath" style="background: #6B8E23;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.OLIVEDRAB = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.OLIVEDRAB));

/**
 * An immutable Color instance initialized to CSS color #FFA500
 * <span class="colorSwath" style="background: #FFA500;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.ORANGE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.ORANGE));

/**
 * An immutable Color instance initialized to CSS color #FF4500
 * <span class="colorSwath" style="background: #FF4500;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.ORANGERED = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.ORANGERED));

/**
 * An immutable Color instance initialized to CSS color #DA70D6
 * <span class="colorSwath" style="background: #DA70D6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.ORCHID = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.ORCHID));

/**
 * An immutable Color instance initialized to CSS color #EEE8AA
 * <span class="colorSwath" style="background: #EEE8AA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PALEGOLDENROD = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PALEGOLDENROD));

/**
 * An immutable Color instance initialized to CSS color #98FB98
 * <span class="colorSwath" style="background: #98FB98;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PALEGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PALEGREEN));

/**
 * An immutable Color instance initialized to CSS color #AFEEEE
 * <span class="colorSwath" style="background: #AFEEEE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PALETURQUOISE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PALETURQUOISE));

/**
 * An immutable Color instance initialized to CSS color #DB7093
 * <span class="colorSwath" style="background: #DB7093;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PALEVIOLETRED = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PALEVIOLETRED));

/**
 * An immutable Color instance initialized to CSS color #FFEFD5
 * <span class="colorSwath" style="background: #FFEFD5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PAPAYAWHIP = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PAPAYAWHIP));

/**
 * An immutable Color instance initialized to CSS color #FFDAB9
 * <span class="colorSwath" style="background: #FFDAB9;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PEACHPUFF = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PEACHPUFF));

/**
 * An immutable Color instance initialized to CSS color #CD853F
 * <span class="colorSwath" style="background: #CD853F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PERU = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PERU));

/**
 * An immutable Color instance initialized to CSS color #FFC0CB
 * <span class="colorSwath" style="background: #FFC0CB;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PINK = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PINK));

/**
 * An immutable Color instance initialized to CSS color #DDA0DD
 * <span class="colorSwath" style="background: #DDA0DD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PLUM = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PLUM));

/**
 * An immutable Color instance initialized to CSS color #B0E0E6
 * <span class="colorSwath" style="background: #B0E0E6;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.POWDERBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.POWDERBLUE));

/**
 * An immutable Color instance initialized to CSS color #800080
 * <span class="colorSwath" style="background: #800080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.PURPLE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.PURPLE));

/**
 * An immutable Color instance initialized to CSS color #FF0000
 * <span class="colorSwath" style="background: #FF0000;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.RED = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.RED));

/**
 * An immutable Color instance initialized to CSS color #BC8F8F
 * <span class="colorSwath" style="background: #BC8F8F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.ROSYBROWN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.ROSYBROWN));

/**
 * An immutable Color instance initialized to CSS color #4169E1
 * <span class="colorSwath" style="background: #4169E1;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.ROYALBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.ROYALBLUE));

/**
 * An immutable Color instance initialized to CSS color #8B4513
 * <span class="colorSwath" style="background: #8B4513;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SADDLEBROWN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SADDLEBROWN));

/**
 * An immutable Color instance initialized to CSS color #FA8072
 * <span class="colorSwath" style="background: #FA8072;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SALMON = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SALMON));

/**
 * An immutable Color instance initialized to CSS color #F4A460
 * <span class="colorSwath" style="background: #F4A460;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SANDYBROWN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SANDYBROWN));

/**
 * An immutable Color instance initialized to CSS color #2E8B57
 * <span class="colorSwath" style="background: #2E8B57;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SEAGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SEAGREEN));

/**
 * An immutable Color instance initialized to CSS color #FFF5EE
 * <span class="colorSwath" style="background: #FFF5EE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SEASHELL = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SEASHELL));

/**
 * An immutable Color instance initialized to CSS color #A0522D
 * <span class="colorSwath" style="background: #A0522D;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SIENNA = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SIENNA));

/**
 * An immutable Color instance initialized to CSS color #C0C0C0
 * <span class="colorSwath" style="background: #C0C0C0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SILVER = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SILVER));

/**
 * An immutable Color instance initialized to CSS color #87CEEB
 * <span class="colorSwath" style="background: #87CEEB;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SKYBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SKYBLUE));

/**
 * An immutable Color instance initialized to CSS color #6A5ACD
 * <span class="colorSwath" style="background: #6A5ACD;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SLATEBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SLATEBLUE));

/**
 * An immutable Color instance initialized to CSS color #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SLATEGRAY = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SLATEGRAY));

/**
 * An immutable Color instance initialized to CSS color #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SLATEGREY = ColorRGBA.SLATEGRAY;

/**
 * An immutable Color instance initialized to CSS color #FFFAFA
 * <span class="colorSwath" style="background: #FFFAFA;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SNOW = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SNOW));

/**
 * An immutable Color instance initialized to CSS color #00FF7F
 * <span class="colorSwath" style="background: #00FF7F;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.SPRINGGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.SPRINGGREEN));

/**
 * An immutable Color instance initialized to CSS color #4682B4
 * <span class="colorSwath" style="background: #4682B4;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.STEELBLUE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.STEELBLUE));

/**
 * An immutable Color instance initialized to CSS color #D2B48C
 * <span class="colorSwath" style="background: #D2B48C;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.TAN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.TAN));

/**
 * An immutable Color instance initialized to CSS color #008080
 * <span class="colorSwath" style="background: #008080;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.TEAL = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.TEAL));

/**
 * An immutable Color instance initialized to CSS color #D8BFD8
 * <span class="colorSwath" style="background: #D8BFD8;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.THISTLE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.THISTLE));

/**
 * An immutable Color instance initialized to CSS color #FF6347
 * <span class="colorSwath" style="background: #FF6347;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.TOMATO = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.TOMATO));

/**
 * An immutable Color instance initialized to CSS color #40E0D0
 * <span class="colorSwath" style="background: #40E0D0;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.TURQUOISE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.TURQUOISE));

/**
 * An immutable Color instance initialized to CSS color #EE82EE
 * <span class="colorSwath" style="background: #EE82EE;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.VIOLET = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.VIOLET));

/**
 * An immutable Color instance initialized to CSS color #F5DEB3
 * <span class="colorSwath" style="background: #F5DEB3;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.WHEAT = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.WHEAT));

/**
 * An immutable Color instance initialized to CSS color #FFFFFF
 * <span class="colorSwath" style="background: #FFFFFF;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.WHITE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.WHITE));

/**
 * An immutable Color instance initialized to CSS color #F5F5F5
 * <span class="colorSwath" style="background: #F5F5F5;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.WHITESMOKE = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.WHITESMOKE));

/**
 * An immutable Color instance initialized to CSS color #FFFF00
 * <span class="colorSwath" style="background: #FFFF00;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.YELLOW = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.YELLOW));

/**
 * An immutable Color instance initialized to CSS color #9ACD32
 * <span class="colorSwath" style="background: #9ACD32;"></span>
 *
 * @constant
 * @type {ColorRGBA}
 */
ColorRGBA.YELLOWGREEN = Object.freeze(ColorRGBA.fromColorRGB(ColorRGB.YELLOWGREEN));

/**
 * An immutable Color instance initialized to CSS transparent.
 * <span class="colorSwath" style="background: transparent;"></span>
 *
 * @constant
 * @type {Color}
 */
ColorRGBA.TRANSPARENT = Object.freeze(new ColorRGBA(0, 0, 0, 0));
export default ColorRGBA;
export { ColorRGBA, ColorRGBA as Color4 };
