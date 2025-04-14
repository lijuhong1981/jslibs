import Check from "@lijuhong1981/jscheck/src/Check.js";
import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import isValid from "@lijuhong1981/jscheck/src/isValid.js";
import lerp from "@lijuhong1981/jsmath/src/lerp.js";
import byteToFloat from "./byteToFloat.js";
import ColorRGBA from "./ColorRGBA.js";
import floatToByte from "./floatToByte.js";
import hue2rgb from "./hue2rgb.js";

/**
 * A color, specified using red, green, blue values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 * @param {number} [red=1.0] The red component.
 * @param {number} [green=1.0] The green component.
 * @param {number} [blue=1.0] The blue component.
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
    });
};

/**
 * Creates a new Color specified using red, green, blue values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 *
 * @param {number} [red=1.0] The red component.
 * @param {number} [green=1.0] The green component.
 * @param {number} [blue=1.0] The blue component.
 * @param {ColorRGB} [result] The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter or a new Color instance if one was not provided.
 */
ColorRGB.fromValues = function (red = 1.0, green = 1.0, blue = 1.0, result = new ColorRGB()) {
    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

/**
 * Sets this Color values from specified using red, green, blue values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 * 
 * @see ColorRGB.fromValues
*/
ColorRGB.prototype.setFromValues = function (red = 1.0, green = 1.0, blue = 1.0) {
    return ColorRGB.fromValues(red, green, blue, this);
};

/**
 * Creates a new Color specified using red, green, blue values,
 * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
 *
 * @param {number} [red=255] The red component.
 * @param {number} [green=255] The green component.
 * @param {number} [blue=255] The blue component.
 * @param {ColorRGB} [result] The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter or a new Color instance if one was not provided.
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
 * Sets this Color values from specified using red, green, blue values,
 * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
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
 * Creates a new Color from a single numeric unsigned 24-bit RGB value, using the endianness
 * of the system.
 *
 * @param {number} rgb A single numeric unsigned 24-bit RGB value.
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The color object.
 *
 * @example
 * const color = ColorRGB.fromHexNumber(0x67ADDF);
 *
 * @see ColorRGB#toHexNumber
 */
ColorRGB.fromHexNumber = function (rgb, result) {
    Check.typeOf.integer('rgb', rgb);
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint32Array[0] = rgb;
    return ColorRGB.fromBytes(
        scratchUint8Array[0],
        scratchUint8Array[1],
        scratchUint8Array[2],
        result,
    );
};

/**
 * Sets this Color values from a single numeric unsigned 24-bit RGB value, using the endianness
 * of the system.
 *
 * @see ColorRGB.fromHexNumber
 */
ColorRGB.prototype.setFromRgb = function (rgb) {
    return ColorRGB.fromHexNumber(rgb);
};

/**
 * Creates a Color instance from hue, saturation, and lightness.
 *
 * @param {number} [hue=0] The hue angle 0...1
 * @param {number} [saturation=0] The saturation value 0...1
 * @param {number} [lightness=0] The lightness value 0...1
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The color object.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#hsl-color|CSS color values}
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
 * Sets this Color values from hue, saturation, and lightness.
 * 
 * @see ColorRGB.fromHsl
 */
ColorRGB.prototype.setFromHsl = function (hue, saturation, lightness) {
    return ColorRGB.fromHsl(hue, saturation, lightness, this);
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
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The modified result parameter or a new instance if result was undefined.
 *
 * @exception {Error} minimumRed must be less than or equal to maximumRed.
 * @exception {Error} minimumGreen must be less than or equal to maximumGreen.
 * @exception {Error} minimumBlue must be less than or equal to maximumBlue.
 *
 * @example
 * //Create a completely random color
 * const color = ColorRGB.fromRandom();
 *
 * //Create a random shade of yellow.
 * const color1 = ColorRGB.fromRandom({
 *     red : 1.0,
 *     green : 1.0,
 * });
 *
 * //Create a random bright color.
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
 * Set this Color random values using the provided options.
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
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The color object, or undefined if the string was not a valid CSS color.
 *
 *
 * @example
 * const color = ColorRGB.fromCssColorString('#67ADDF');
 * const green = ColorRGB.fromCssColorString('green');
 *
 * @see {@link http://www.w3.org/TR/css3-color|CSS color values}
 * @see ColorRGB#toCssColorString
 * @see ColorRGB#toCssHexString
 */
ColorRGB.fromCssColorString = function (colorString, result = new ColorRGB()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("colorString", colorString);
    //>>includeEnd('debug');

    // Remove all surrounding whitespaces from the color string
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
            parseFloat(matches[1]) / ("%" === matches[1].substring(-1) ? 100.0 : 255.0);
        result.green =
            parseFloat(matches[2]) / ("%" === matches[2].substring(-1) ? 100.0 : 255.0);
        result.blue =
            parseFloat(matches[3]) / ("%" === matches[3].substring(-1) ? 100.0 : 255.0);
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
 * Set this Color values from a CSS color value.
 * 
 * @see ColorRGB.fromCssColorString
*/
ColorRGB.prototype.setFromCssColorString = function (colorString) {
    return ColorRGB.fromCssColorString(colorString, this);
};

/**
 * The number of elements used to pack the object into an array.
 * @type {number}
 */
ColorRGB.packedLength = 3;

/**
 * Stores the provided instance into the provided array.
 *
 * @param {ColorRGB} value The value to pack.
 * @param {number[]} array The array to pack into.
 * @param {number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {number[]} The array that was packed into
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
 * Retrieves an instance from a packed array.
 *
 * @param {number[]} array The packed array.
 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {ColorRGB} [result] The object into which to store the result.
 * @returns {ColorRGB} The modified result parameter or a new Color instance if one was not provided.
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
 * Creates an instance from a array, equals unpack.
 *
 * @param {number[]} array The packed array.
 * @param {number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {ColorRGB} [result] The object into which to store the result.
 * @returns {ColorRGB} The modified result parameter or a new Color instance if one was not provided.
 * 
 * @see ColorRGB.unpack
 * @see ColorRGB#toArray
*/
ColorRGB.fromArray = ColorRGB.unpack;

/**
 * Sets this Color values from a array.
 * 
 * @see ColorRGB.fromArray
*/
ColorRGB.prototype.setFromArray = function (array, startingIndex) {
    return ColorRGB.unpack(array, startingIndex, this);
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
 * 
 * @see ColorRGB.fromArray
*/
ColorRGB.prototype.toArray = function (array, startingIndex) {
    return ColorRGB.pack(this, array, startingIndex);
};

/**
 * Duplicates a Color.
 *
 * @param {ColorRGB} color The Color to duplicate.
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
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
 * Returns true if the first Color equals the second Color.
 *
 * @param {ColorRGB} [left] The first Color to compare for equality.
 * @param {ColorRGB} [right] The second Color to compare for equality.
 * @returns {boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
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
 * Returns true if the Color values equals the Array values.
 *
 * @param {ColorRGB} [color] The Color to compare for equality.
 * @param {number[]} [array] The Array to compare for equality.
 * @param {startingIndex} [startingIndex = 0] The starting index of the Array.
 * @returns {boolean} <code>true</code> if the values are equal; otherwise, <code>false</code>.
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
 * Returns <code>true</code> if the first Color equals the second Color componentwise within the specified epsilon.
 *
 * @param {ColorRGB} [left] The first Color to compare for equality.
 * @param {ColorRGB} [right] The second Color to compare for equality.
 * @param {number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
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
 * Returns a duplicate of a Color instance.
 *
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The modified result parameter or a new instance if result was undefined.
 */
ColorRGB.prototype.clone = function (result) {
    return ColorRGB.clone(this, result);
};

/**
 * Returns true if this Color equals other.
 *
 * @param {ColorRGB} [other] The Color to compare for equality.
 * @returns {boolean} <code>true</code> if the Colors are equal; otherwise, <code>false</code>.
 */
ColorRGB.prototype.equals = function (other) {
    return ColorRGB.equals(this, other);
};

/**
 * Returns true if this Color values equals the Array values.
 *
 * @param {number[]} [array] The Array to compare for equality.
 * @param {startingIndex} [startingIndex = 0] The starting index of the Array.
 * @returns {boolean} <code>true</code> if the values are equal; otherwise, <code>false</code>.
 */
ColorRGB.prototype.equalsArray = function (array, startingIndex) {
    return ColorRGB.equalsArray(this, array, startingIndex);
}

/**
 * Returns <code>true</code> if this Color equals other componentwise within the specified epsilon.
 *
 * @param {ColorRGB} other The Color to compare for equality.
 * @param {number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {boolean} <code>true</code> if the Colors are equal within the specified epsilon; otherwise, <code>false</code>.
 */
ColorRGB.prototype.equalsEpsilon = function (other, epsilon) {
    return ColorRGB.equalsEpsilon(this, other, epsilon);
};

/**
 * Creates a string representing this Color in the format 'Color(red, green, blue)'.
 *
 * @returns {string} A string representing this Color in the format 'Color(red, green, blue)'.
 */
ColorRGB.prototype.toString = function () {
    return `Color(${this.red}, ${this.green}, ${this.blue})`;
};

/**
 * Creates a string containing the CSS color value for this color.
 *
 * @returns {string} The CSS equivalent of this color.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#rgba-color|CSS RGB or RGBA color values}
 * @see ColorRGB.fromCssColorString
 */
ColorRGB.prototype.toCssColorString = function () {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);
    return `rgb(${red},${green},${blue})`;
};

/**
 * Creates a string containing CSS hex string color value for this color.
 *
 * @returns {string} The CSS hex string equivalent of this color.
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
 * Converts this color to an array of red, green, blue values
 * that are in the range of 0 to 255.
 *
 * @param {number[]} [result] The array to store the result in, if undefined a new instance will be created.
 * @returns {number[]} The modified result parameter or a new instance if result was undefined.
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
 * Converts this color to a single numeric unsigned 24-bit RGB value, using the endianness
 * of the system.
 *
 * @returns {number} A single numeric unsigned 24-bit RGB value.
 *
 *
 * @example
 * const rgb = ColorRGB.BLUE.toHexNumber();
 *
 * @see ColorRGB.fromHexNumber
 */
ColorRGB.prototype.toHexNumber = function () {
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint8Array[0] = floatToByte(this.red);
    scratchUint8Array[1] = floatToByte(this.green);
    scratchUint8Array[2] = floatToByte(this.blue);
    return scratchUint32Array[0];
};

/**
 * Creates a new Color that Brightens by the provided magnitude.
 *
 * @param {ColorRGB} color The base color
 * @param {number} magnitude A positive number indicating the amount to brighten.
 * @param {ColorRGB} [result] The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter or a new ColorRGB instance if one was not provided.
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
 * Brightens this Color by the provided magnitude.
 *
 * @param {number} magnitude A positive number indicating the amount to brighten.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result.
 *
 * @see ColorRGB.brighten
 */
ColorRGB.prototype.brighten = function (magnitude, result) {
    return ColorRGB.brighten(this, magnitude, result || this);
};

/**
 * Creates a new Color that Darkens by the provided magnitude.
 *
 * @param {ColorRGB} color The base color
 * @param {number} magnitude A positive number indicating the amount to darken.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Darkens this Color by the provided magnitude.
 *
 * @param {number} magnitude A positive number indicating the amount to darken.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 *
 * @see ColorRGB.darken
 */
ColorRGB.prototype.darken = function (magnitude, result) {
    return ColorRGB.darken(this, magnitude, result || this);
};

/**
 * Computes the componentwise sum of two Colors.
 *
 * @param {ColorRGB} left The first Color.
 * @param {ColorRGB} right The second Color.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Adds this Color componentwise by other Color.
 *
 * @param {ColorRGB} other The other Color.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 * 
 * @see ColorRGB.add
 */
ColorRGB.prototype.add = function (other, result) {
    return ColorRGB.add(this, other, result || this);
};

/**
 * Computes the componentwise difference of two Colors.
 *
 * @param {ColorRGB} left The first Color.
 * @param {ColorRGB} right The second Color.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Subtracts this Color componentwise by other Color.
 *
 * @param {ColorRGB} other The other Color.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 * 
 * @see ColorRGB.subtract
 */
ColorRGB.prototype.subtract = function (other, result) {
    return ColorRGB.subtract(this, other, result || this);
};

/**
 * Computes the componentwise product of two Colors.
 *
 * @param {ColorRGB} left The first Color.
 * @param {ColorRGB} right The second Color.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Multiplies this Color componentwise by other Color.
 *
 * @param {ColorRGB} other The other Color.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 * 
 * @see ColorRGB.multiply
 */
ColorRGB.prototype.multiply = function (other, result) {
    return ColorRGB.multiply(this, other, result || this);
};

/**
 * Computes the componentwise quotient of two Colors.
 *
 * @param {ColorRGB} left The first Color.
 * @param {ColorRGB} right The second Color.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Divides this Color componentwise by other Color.
 *
 * @param {ColorRGB} other The other Color.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 * 
 * @see ColorRGB.divide
 */
ColorRGB.prototype.divide = function (other, result) {
    return ColorRGB.divide(this, other, result || this);
};

/**
 * Computes the componentwise modulus of two Colors.
 *
 * @param {ColorRGB} left The first Color.
 * @param {ColorRGB} right The second Color.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Modulus this Color componentwise by other Color.
 *
 * @param {ColorRGB} other The other Color.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 * 
 * @see ColorRGB.mod
 */
ColorRGB.prototype.mod = function (other, result) {
    return ColorRGB.mod(this, other, result || this);
};

/**
 * Computes the linear interpolation or extrapolation at t between the provided colors.
 *
 * @param {ColorRGB} start The color corresponding to t at 0.0.
 * @param {ColorRGB} end The color corresponding to t at 1.0.
 * @param {number} t The point along t at which to interpolate.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Multiplies the provided Color componentwise by the provided scalar.
 *
 * @param {ColorRGB} color The Color to be scaled.
 * @param {number} scalar The scalar to multiply with.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Multiplies this Color componentwise by the provided scalar.
 *
 * @param {number} scalar The scalar to multiply with.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 * 
 * @see ColorRGB.multiplyByScalar
 */
ColorRGB.prototype.multiplyByScalar = function (scalar, result) {
    return ColorRGB.multiplyByScalar(this, scalar, result || this);
};

/**
 * Divides the provided Color componentwise by the provided scalar.
 *
 * @param {ColorRGB} color The Color to be divided.
 * @param {number} scalar The scalar to divide with.
 * @param {ColorRGB} result The object onto which to store the result.
 * @returns {ColorRGB} The modified result parameter.
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
 * Divides this Color componentwise by the provided scalar.
 *
 * @param {number} scalar The scalar to divide with.
 * @param {ColorRGB} result The object onto which to store the result, if not defined, it will use self.
 * @returns {ColorRGB} The modified result parameter.
 * 
 * @see ColorRGB.divideByScalar
 */
ColorRGB.prototype.divideByScalar = function (scalar, result) {
    return ColorRGB.divideByScalar(this, scalar, result || this);
};

/**
 * Creates a new Color from a ColorRGBA instance.
 *
 * @param {ColorRGBA} color The ColorRGBA instance.
 * @param {ColorRGB} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGB} The modified result parameter or a new instance if result was undefined.
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
 * Sets this Color values from an ColorRGBA instance.
 * 
 * @see ColorRGB.fromColorRGBA
*/
ColorRGB.prototype.setFromColorRGBA = function (color) {
    return ColorRGB.fromColorRGBA(color, this);
};

/**
 * Converts this Color to an ColorRGBA instance.
 * 
 * @param {number} [alpha=1.0] The alpha component.
 * @param {ColorRGBA} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {ColorRGBA} The modified result parameter or a new instance if result was undefined.
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
 * An immutable Color instance initialized to CSS color #F0F8FF
 * <span class="colorSwath" style="background: #F0F8FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ALICEBLUE = Object.freeze(ColorRGB.fromCssColorString("#F0F8FF"));

/**
 * An immutable Color instance initialized to CSS color #FAEBD7
 * <span class="colorSwath" style="background: #FAEBD7;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ANTIQUEWHITE = Object.freeze(ColorRGB.fromCssColorString("#FAEBD7"));

/**
 * An immutable Color instance initialized to CSS color #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.AQUA = Object.freeze(ColorRGB.fromCssColorString("#00FFFF"));

/**
 * An immutable Color instance initialized to CSS color #7FFFD4
 * <span class="colorSwath" style="background: #7FFFD4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.AQUAMARINE = Object.freeze(ColorRGB.fromCssColorString("#7FFFD4"));

/**
 * An immutable Color instance initialized to CSS color #F0FFFF
 * <span class="colorSwath" style="background: #F0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.AZURE = Object.freeze(ColorRGB.fromCssColorString("#F0FFFF"));

/**
 * An immutable Color instance initialized to CSS color #F5F5DC
 * <span class="colorSwath" style="background: #F5F5DC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BEIGE = Object.freeze(ColorRGB.fromCssColorString("#F5F5DC"));

/**
 * An immutable Color instance initialized to CSS color #FFE4C4
 * <span class="colorSwath" style="background: #FFE4C4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BISQUE = Object.freeze(ColorRGB.fromCssColorString("#FFE4C4"));

/**
 * An immutable Color instance initialized to CSS color #000000
 * <span class="colorSwath" style="background: #000000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLACK = Object.freeze(ColorRGB.fromCssColorString("#000000"));

/**
 * An immutable Color instance initialized to CSS color #FFEBCD
 * <span class="colorSwath" style="background: #FFEBCD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLANCHEDALMOND = Object.freeze(ColorRGB.fromCssColorString("#FFEBCD"));

/**
 * An immutable Color instance initialized to CSS color #0000FF
 * <span class="colorSwath" style="background: #0000FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLUE = Object.freeze(ColorRGB.fromCssColorString("#0000FF"));

/**
 * An immutable Color instance initialized to CSS color #8A2BE2
 * <span class="colorSwath" style="background: #8A2BE2;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BLUEVIOLET = Object.freeze(ColorRGB.fromCssColorString("#8A2BE2"));

/**
 * An immutable Color instance initialized to CSS color #A52A2A
 * <span class="colorSwath" style="background: #A52A2A;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BROWN = Object.freeze(ColorRGB.fromCssColorString("#A52A2A"));

/**
 * An immutable Color instance initialized to CSS color #DEB887
 * <span class="colorSwath" style="background: #DEB887;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.BURLYWOOD = Object.freeze(ColorRGB.fromCssColorString("#DEB887"));

/**
 * An immutable Color instance initialized to CSS color #5F9EA0
 * <span class="colorSwath" style="background: #5F9EA0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CADETBLUE = Object.freeze(ColorRGB.fromCssColorString("#5F9EA0"));
/**
 * An immutable Color instance initialized to CSS color #7FFF00
 * <span class="colorSwath" style="background: #7FFF00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CHARTREUSE = Object.freeze(ColorRGB.fromCssColorString("#7FFF00"));

/**
 * An immutable Color instance initialized to CSS color #D2691E
 * <span class="colorSwath" style="background: #D2691E;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CHOCOLATE = Object.freeze(ColorRGB.fromCssColorString("#D2691E"));

/**
 * An immutable Color instance initialized to CSS color #FF7F50
 * <span class="colorSwath" style="background: #FF7F50;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CORAL = Object.freeze(ColorRGB.fromCssColorString("#FF7F50"));

/**
 * An immutable Color instance initialized to CSS color #6495ED
 * <span class="colorSwath" style="background: #6495ED;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CORNFLOWERBLUE = Object.freeze(ColorRGB.fromCssColorString("#6495ED"));

/**
 * An immutable Color instance initialized to CSS color #FFF8DC
 * <span class="colorSwath" style="background: #FFF8DC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CORNSILK = Object.freeze(ColorRGB.fromCssColorString("#FFF8DC"));

/**
 * An immutable Color instance initialized to CSS color #DC143C
 * <span class="colorSwath" style="background: #DC143C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CRIMSON = Object.freeze(ColorRGB.fromCssColorString("#DC143C"));

/**
 * An immutable Color instance initialized to CSS color #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.CYAN = Object.freeze(ColorRGB.fromCssColorString("#00FFFF"));

/**
 * An immutable Color instance initialized to CSS color #00008B
 * <span class="colorSwath" style="background: #00008B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKBLUE = Object.freeze(ColorRGB.fromCssColorString("#00008B"));

/**
 * An immutable Color instance initialized to CSS color #008B8B
 * <span class="colorSwath" style="background: #008B8B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKCYAN = Object.freeze(ColorRGB.fromCssColorString("#008B8B"));

/**
 * An immutable Color instance initialized to CSS color #B8860B
 * <span class="colorSwath" style="background: #B8860B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGOLDENROD = Object.freeze(ColorRGB.fromCssColorString("#B8860B"));

/**
 * An immutable Color instance initialized to CSS color #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGRAY = Object.freeze(ColorRGB.fromCssColorString("#A9A9A9"));

/**
 * An immutable Color instance initialized to CSS color #006400
 * <span class="colorSwath" style="background: #006400;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGREEN = Object.freeze(ColorRGB.fromCssColorString("#006400"));

/**
 * An immutable Color instance initialized to CSS color #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKGREY = ColorRGB.DARKGRAY;

/**
 * An immutable Color instance initialized to CSS color #BDB76B
 * <span class="colorSwath" style="background: #BDB76B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKKHAKI = Object.freeze(ColorRGB.fromCssColorString("#BDB76B"));

/**
 * An immutable Color instance initialized to CSS color #8B008B
 * <span class="colorSwath" style="background: #8B008B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKMAGENTA = Object.freeze(ColorRGB.fromCssColorString("#8B008B"));

/**
 * An immutable Color instance initialized to CSS color #556B2F
 * <span class="colorSwath" style="background: #556B2F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKOLIVEGREEN = Object.freeze(ColorRGB.fromCssColorString("#556B2F"));

/**
 * An immutable Color instance initialized to CSS color #FF8C00
 * <span class="colorSwath" style="background: #FF8C00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKORANGE = Object.freeze(ColorRGB.fromCssColorString("#FF8C00"));

/**
 * An immutable Color instance initialized to CSS color #9932CC
 * <span class="colorSwath" style="background: #9932CC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKORCHID = Object.freeze(ColorRGB.fromCssColorString("#9932CC"));

/**
 * An immutable Color instance initialized to CSS color #8B0000
 * <span class="colorSwath" style="background: #8B0000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKRED = Object.freeze(ColorRGB.fromCssColorString("#8B0000"));

/**
 * An immutable Color instance initialized to CSS color #E9967A
 * <span class="colorSwath" style="background: #E9967A;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSALMON = Object.freeze(ColorRGB.fromCssColorString("#E9967A"));

/**
 * An immutable Color instance initialized to CSS color #8FBC8F
 * <span class="colorSwath" style="background: #8FBC8F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#8FBC8F"));

/**
 * An immutable Color instance initialized to CSS color #483D8B
 * <span class="colorSwath" style="background: #483D8B;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSLATEBLUE = Object.freeze(ColorRGB.fromCssColorString("#483D8B"));

/**
 * An immutable Color instance initialized to CSS color #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSLATEGRAY = Object.freeze(ColorRGB.fromCssColorString("#2F4F4F"));

/**
 * An immutable Color instance initialized to CSS color #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKSLATEGREY = ColorRGB.DARKSLATEGRAY;

/**
 * An immutable Color instance initialized to CSS color #00CED1
 * <span class="colorSwath" style="background: #00CED1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKTURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#00CED1"));

/**
 * An immutable Color instance initialized to CSS color #9400D3
 * <span class="colorSwath" style="background: #9400D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DARKVIOLET = Object.freeze(ColorRGB.fromCssColorString("#9400D3"));

/**
 * An immutable Color instance initialized to CSS color #FF1493
 * <span class="colorSwath" style="background: #FF1493;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DEEPPINK = Object.freeze(ColorRGB.fromCssColorString("#FF1493"));

/**
 * An immutable Color instance initialized to CSS color #00BFFF
 * <span class="colorSwath" style="background: #00BFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DEEPSKYBLUE = Object.freeze(ColorRGB.fromCssColorString("#00BFFF"));

/**
 * An immutable Color instance initialized to CSS color #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DIMGRAY = Object.freeze(ColorRGB.fromCssColorString("#696969"));

/**
 * An immutable Color instance initialized to CSS color #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DIMGREY = ColorRGB.DIMGRAY;

/**
 * An immutable Color instance initialized to CSS color #1E90FF
 * <span class="colorSwath" style="background: #1E90FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.DODGERBLUE = Object.freeze(ColorRGB.fromCssColorString("#1E90FF"));

/**
 * An immutable Color instance initialized to CSS color #B22222
 * <span class="colorSwath" style="background: #B22222;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FIREBRICK = Object.freeze(ColorRGB.fromCssColorString("#B22222"));

/**
 * An immutable Color instance initialized to CSS color #FFFAF0
 * <span class="colorSwath" style="background: #FFFAF0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FLORALWHITE = Object.freeze(ColorRGB.fromCssColorString("#FFFAF0"));

/**
 * An immutable Color instance initialized to CSS color #228B22
 * <span class="colorSwath" style="background: #228B22;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FORESTGREEN = Object.freeze(ColorRGB.fromCssColorString("#228B22"));

/**
 * An immutable Color instance initialized to CSS color #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.FUCHSIA = Object.freeze(ColorRGB.fromCssColorString("#FF00FF"));

/**
 * An immutable Color instance initialized to CSS color #DCDCDC
 * <span class="colorSwath" style="background: #DCDCDC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GAINSBORO = Object.freeze(ColorRGB.fromCssColorString("#DCDCDC"));

/**
 * An immutable Color instance initialized to CSS color #F8F8FF
 * <span class="colorSwath" style="background: #F8F8FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GHOSTWHITE = Object.freeze(ColorRGB.fromCssColorString("#F8F8FF"));

/**
 * An immutable Color instance initialized to CSS color #FFD700
 * <span class="colorSwath" style="background: #FFD700;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GOLD = Object.freeze(ColorRGB.fromCssColorString("#FFD700"));

/**
 * An immutable Color instance initialized to CSS color #DAA520
 * <span class="colorSwath" style="background: #DAA520;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GOLDENROD = Object.freeze(ColorRGB.fromCssColorString("#DAA520"));

/**
 * An immutable Color instance initialized to CSS color #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GRAY = Object.freeze(ColorRGB.fromCssColorString("#808080"));

/**
 * An immutable Color instance initialized to CSS color #008000
 * <span class="colorSwath" style="background: #008000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GREEN = Object.freeze(ColorRGB.fromCssColorString("#008000"));

/**
 * An immutable Color instance initialized to CSS color #ADFF2F
 * <span class="colorSwath" style="background: #ADFF2F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GREENYELLOW = Object.freeze(ColorRGB.fromCssColorString("#ADFF2F"));

/**
 * An immutable Color instance initialized to CSS color #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.GREY = ColorRGB.GRAY;

/**
 * An immutable Color instance initialized to CSS color #F0FFF0
 * <span class="colorSwath" style="background: #F0FFF0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.HONEYDEW = Object.freeze(ColorRGB.fromCssColorString("#F0FFF0"));

/**
 * An immutable Color instance initialized to CSS color #FF69B4
 * <span class="colorSwath" style="background: #FF69B4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.HOTPINK = Object.freeze(ColorRGB.fromCssColorString("#FF69B4"));

/**
 * An immutable Color instance initialized to CSS color #CD5C5C
 * <span class="colorSwath" style="background: #CD5C5C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.INDIANRED = Object.freeze(ColorRGB.fromCssColorString("#CD5C5C"));

/**
 * An immutable Color instance initialized to CSS color #4B0082
 * <span class="colorSwath" style="background: #4B0082;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.INDIGO = Object.freeze(ColorRGB.fromCssColorString("#4B0082"));

/**
 * An immutable Color instance initialized to CSS color #FFFFF0
 * <span class="colorSwath" style="background: #FFFFF0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.IVORY = Object.freeze(ColorRGB.fromCssColorString("#FFFFF0"));

/**
 * An immutable Color instance initialized to CSS color #F0E68C
 * <span class="colorSwath" style="background: #F0E68C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.KHAKI = Object.freeze(ColorRGB.fromCssColorString("#F0E68C"));

/**
 * An immutable Color instance initialized to CSS color #E6E6FA
 * <span class="colorSwath" style="background: #E6E6FA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LAVENDER = Object.freeze(ColorRGB.fromCssColorString("#E6E6FA"));

/**
 * An immutable Color instance initialized to CSS color #FFF0F5
 * <span class="colorSwath" style="background: #FFF0F5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LAVENDAR_BLUSH = Object.freeze(ColorRGB.fromCssColorString("#FFF0F5"));

/**
 * An immutable Color instance initialized to CSS color #7CFC00
 * <span class="colorSwath" style="background: #7CFC00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LAWNGREEN = Object.freeze(ColorRGB.fromCssColorString("#7CFC00"));

/**
 * An immutable Color instance initialized to CSS color #FFFACD
 * <span class="colorSwath" style="background: #FFFACD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LEMONCHIFFON = Object.freeze(ColorRGB.fromCssColorString("#FFFACD"));

/**
 * An immutable Color instance initialized to CSS color #ADD8E6
 * <span class="colorSwath" style="background: #ADD8E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTBLUE = Object.freeze(ColorRGB.fromCssColorString("#ADD8E6"));

/**
 * An immutable Color instance initialized to CSS color #F08080
 * <span class="colorSwath" style="background: #F08080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTCORAL = Object.freeze(ColorRGB.fromCssColorString("#F08080"));

/**
 * An immutable Color instance initialized to CSS color #E0FFFF
 * <span class="colorSwath" style="background: #E0FFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTCYAN = Object.freeze(ColorRGB.fromCssColorString("#E0FFFF"));

/**
 * An immutable Color instance initialized to CSS color #FAFAD2
 * <span class="colorSwath" style="background: #FAFAD2;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGOLDENRODYELLOW = Object.freeze(ColorRGB.fromCssColorString("#FAFAD2"));

/**
 * An immutable Color instance initialized to CSS color #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGRAY = Object.freeze(ColorRGB.fromCssColorString("#D3D3D3"));

/**
 * An immutable Color instance initialized to CSS color #90EE90
 * <span class="colorSwath" style="background: #90EE90;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGREEN = Object.freeze(ColorRGB.fromCssColorString("#90EE90"));

/**
 * An immutable Color instance initialized to CSS color #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTGREY = ColorRGB.LIGHTGRAY;

/**
 * An immutable Color instance initialized to CSS color #FFB6C1
 * <span class="colorSwath" style="background: #FFB6C1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTPINK = Object.freeze(ColorRGB.fromCssColorString("#FFB6C1"));

/**
 * An immutable Color instance initialized to CSS color #20B2AA
 * <span class="colorSwath" style="background: #20B2AA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#20B2AA"));

/**
 * An immutable Color instance initialized to CSS color #87CEFA
 * <span class="colorSwath" style="background: #87CEFA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSKYBLUE = Object.freeze(ColorRGB.fromCssColorString("#87CEFA"));

/**
 * An immutable Color instance initialized to CSS color #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSLATEGRAY = Object.freeze(ColorRGB.fromCssColorString("#778899"));

/**
 * An immutable Color instance initialized to CSS color #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSLATEGREY = ColorRGB.LIGHTSLATEGRAY;

/**
 * An immutable Color instance initialized to CSS color #B0C4DE
 * <span class="colorSwath" style="background: #B0C4DE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTSTEELBLUE = Object.freeze(ColorRGB.fromCssColorString("#B0C4DE"));

/**
 * An immutable Color instance initialized to CSS color #FFFFE0
 * <span class="colorSwath" style="background: #FFFFE0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIGHTYELLOW = Object.freeze(ColorRGB.fromCssColorString("#FFFFE0"));

/**
 * An immutable Color instance initialized to CSS color #00FF00
 * <span class="colorSwath" style="background: #00FF00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIME = Object.freeze(ColorRGB.fromCssColorString("#00FF00"));

/**
 * An immutable Color instance initialized to CSS color #32CD32
 * <span class="colorSwath" style="background: #32CD32;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LIMEGREEN = Object.freeze(ColorRGB.fromCssColorString("#32CD32"));

/**
 * An immutable Color instance initialized to CSS color #FAF0E6
 * <span class="colorSwath" style="background: #FAF0E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.LINEN = Object.freeze(ColorRGB.fromCssColorString("#FAF0E6"));

/**
 * An immutable Color instance initialized to CSS color #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MAGENTA = Object.freeze(ColorRGB.fromCssColorString("#FF00FF"));

/**
 * An immutable Color instance initialized to CSS color #800000
 * <span class="colorSwath" style="background: #800000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MAROON = Object.freeze(ColorRGB.fromCssColorString("#800000"));

/**
 * An immutable Color instance initialized to CSS color #66CDAA
 * <span class="colorSwath" style="background: #66CDAA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMAQUAMARINE = Object.freeze(ColorRGB.fromCssColorString("#66CDAA"));

/**
 * An immutable Color instance initialized to CSS color #0000CD
 * <span class="colorSwath" style="background: #0000CD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMBLUE = Object.freeze(ColorRGB.fromCssColorString("#0000CD"));

/**
 * An immutable Color instance initialized to CSS color #BA55D3
 * <span class="colorSwath" style="background: #BA55D3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMORCHID = Object.freeze(ColorRGB.fromCssColorString("#BA55D3"));

/**
 * An immutable Color instance initialized to CSS color #9370DB
 * <span class="colorSwath" style="background: #9370DB;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMPURPLE = Object.freeze(ColorRGB.fromCssColorString("#9370DB"));

/**
 * An immutable Color instance initialized to CSS color #3CB371
 * <span class="colorSwath" style="background: #3CB371;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMSEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#3CB371"));

/**
 * An immutable Color instance initialized to CSS color #7B68EE
 * <span class="colorSwath" style="background: #7B68EE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMSLATEBLUE = Object.freeze(ColorRGB.fromCssColorString("#7B68EE"));

/**
 * An immutable Color instance initialized to CSS color #00FA9A
 * <span class="colorSwath" style="background: #00FA9A;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMSPRINGGREEN = Object.freeze(ColorRGB.fromCssColorString("#00FA9A"));

/**
 * An immutable Color instance initialized to CSS color #48D1CC
 * <span class="colorSwath" style="background: #48D1CC;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMTURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#48D1CC"));

/**
 * An immutable Color instance initialized to CSS color #C71585
 * <span class="colorSwath" style="background: #C71585;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MEDIUMVIOLETRED = Object.freeze(ColorRGB.fromCssColorString("#C71585"));

/**
 * An immutable Color instance initialized to CSS color #191970
 * <span class="colorSwath" style="background: #191970;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MIDNIGHTBLUE = Object.freeze(ColorRGB.fromCssColorString("#191970"));

/**
 * An immutable Color instance initialized to CSS color #F5FFFA
 * <span class="colorSwath" style="background: #F5FFFA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MINTCREAM = Object.freeze(ColorRGB.fromCssColorString("#F5FFFA"));

/**
 * An immutable Color instance initialized to CSS color #FFE4E1
 * <span class="colorSwath" style="background: #FFE4E1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MISTYROSE = Object.freeze(ColorRGB.fromCssColorString("#FFE4E1"));

/**
 * An immutable Color instance initialized to CSS color #FFE4B5
 * <span class="colorSwath" style="background: #FFE4B5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.MOCCASIN = Object.freeze(ColorRGB.fromCssColorString("#FFE4B5"));

/**
 * An immutable Color instance initialized to CSS color #FFDEAD
 * <span class="colorSwath" style="background: #FFDEAD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.NAVAJOWHITE = Object.freeze(ColorRGB.fromCssColorString("#FFDEAD"));

/**
 * An immutable Color instance initialized to CSS color #000080
 * <span class="colorSwath" style="background: #000080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.NAVY = Object.freeze(ColorRGB.fromCssColorString("#000080"));

/**
 * An immutable Color instance initialized to CSS color #FDF5E6
 * <span class="colorSwath" style="background: #FDF5E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.OLDLACE = Object.freeze(ColorRGB.fromCssColorString("#FDF5E6"));

/**
 * An immutable Color instance initialized to CSS color #808000
 * <span class="colorSwath" style="background: #808000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.OLIVE = Object.freeze(ColorRGB.fromCssColorString("#808000"));

/**
 * An immutable Color instance initialized to CSS color #6B8E23
 * <span class="colorSwath" style="background: #6B8E23;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.OLIVEDRAB = Object.freeze(ColorRGB.fromCssColorString("#6B8E23"));

/**
 * An immutable Color instance initialized to CSS color #FFA500
 * <span class="colorSwath" style="background: #FFA500;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ORANGE = Object.freeze(ColorRGB.fromCssColorString("#FFA500"));

/**
 * An immutable Color instance initialized to CSS color #FF4500
 * <span class="colorSwath" style="background: #FF4500;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ORANGERED = Object.freeze(ColorRGB.fromCssColorString("#FF4500"));

/**
 * An immutable Color instance initialized to CSS color #DA70D6
 * <span class="colorSwath" style="background: #DA70D6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ORCHID = Object.freeze(ColorRGB.fromCssColorString("#DA70D6"));

/**
 * An immutable Color instance initialized to CSS color #EEE8AA
 * <span class="colorSwath" style="background: #EEE8AA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALEGOLDENROD = Object.freeze(ColorRGB.fromCssColorString("#EEE8AA"));

/**
 * An immutable Color instance initialized to CSS color #98FB98
 * <span class="colorSwath" style="background: #98FB98;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALEGREEN = Object.freeze(ColorRGB.fromCssColorString("#98FB98"));

/**
 * An immutable Color instance initialized to CSS color #AFEEEE
 * <span class="colorSwath" style="background: #AFEEEE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALETURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#AFEEEE"));

/**
 * An immutable Color instance initialized to CSS color #DB7093
 * <span class="colorSwath" style="background: #DB7093;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PALEVIOLETRED = Object.freeze(ColorRGB.fromCssColorString("#DB7093"));

/**
 * An immutable Color instance initialized to CSS color #FFEFD5
 * <span class="colorSwath" style="background: #FFEFD5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PAPAYAWHIP = Object.freeze(ColorRGB.fromCssColorString("#FFEFD5"));

/**
 * An immutable Color instance initialized to CSS color #FFDAB9
 * <span class="colorSwath" style="background: #FFDAB9;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PEACHPUFF = Object.freeze(ColorRGB.fromCssColorString("#FFDAB9"));

/**
 * An immutable Color instance initialized to CSS color #CD853F
 * <span class="colorSwath" style="background: #CD853F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PERU = Object.freeze(ColorRGB.fromCssColorString("#CD853F"));

/**
 * An immutable Color instance initialized to CSS color #FFC0CB
 * <span class="colorSwath" style="background: #FFC0CB;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PINK = Object.freeze(ColorRGB.fromCssColorString("#FFC0CB"));

/**
 * An immutable Color instance initialized to CSS color #DDA0DD
 * <span class="colorSwath" style="background: #DDA0DD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PLUM = Object.freeze(ColorRGB.fromCssColorString("#DDA0DD"));

/**
 * An immutable Color instance initialized to CSS color #B0E0E6
 * <span class="colorSwath" style="background: #B0E0E6;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.POWDERBLUE = Object.freeze(ColorRGB.fromCssColorString("#B0E0E6"));

/**
 * An immutable Color instance initialized to CSS color #800080
 * <span class="colorSwath" style="background: #800080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.PURPLE = Object.freeze(ColorRGB.fromCssColorString("#800080"));

/**
 * An immutable Color instance initialized to CSS color #FF0000
 * <span class="colorSwath" style="background: #FF0000;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.RED = Object.freeze(ColorRGB.fromCssColorString("#FF0000"));

/**
 * An immutable Color instance initialized to CSS color #BC8F8F
 * <span class="colorSwath" style="background: #BC8F8F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ROSYBROWN = Object.freeze(ColorRGB.fromCssColorString("#BC8F8F"));

/**
 * An immutable Color instance initialized to CSS color #4169E1
 * <span class="colorSwath" style="background: #4169E1;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.ROYALBLUE = Object.freeze(ColorRGB.fromCssColorString("#4169E1"));

/**
 * An immutable Color instance initialized to CSS color #8B4513
 * <span class="colorSwath" style="background: #8B4513;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SADDLEBROWN = Object.freeze(ColorRGB.fromCssColorString("#8B4513"));

/**
 * An immutable Color instance initialized to CSS color #FA8072
 * <span class="colorSwath" style="background: #FA8072;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SALMON = Object.freeze(ColorRGB.fromCssColorString("#FA8072"));

/**
 * An immutable Color instance initialized to CSS color #F4A460
 * <span class="colorSwath" style="background: #F4A460;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SANDYBROWN = Object.freeze(ColorRGB.fromCssColorString("#F4A460"));

/**
 * An immutable Color instance initialized to CSS color #2E8B57
 * <span class="colorSwath" style="background: #2E8B57;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SEAGREEN = Object.freeze(ColorRGB.fromCssColorString("#2E8B57"));

/**
 * An immutable Color instance initialized to CSS color #FFF5EE
 * <span class="colorSwath" style="background: #FFF5EE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SEASHELL = Object.freeze(ColorRGB.fromCssColorString("#FFF5EE"));

/**
 * An immutable Color instance initialized to CSS color #A0522D
 * <span class="colorSwath" style="background: #A0522D;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SIENNA = Object.freeze(ColorRGB.fromCssColorString("#A0522D"));

/**
 * An immutable Color instance initialized to CSS color #C0C0C0
 * <span class="colorSwath" style="background: #C0C0C0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SILVER = Object.freeze(ColorRGB.fromCssColorString("#C0C0C0"));

/**
 * An immutable Color instance initialized to CSS color #87CEEB
 * <span class="colorSwath" style="background: #87CEEB;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SKYBLUE = Object.freeze(ColorRGB.fromCssColorString("#87CEEB"));

/**
 * An immutable Color instance initialized to CSS color #6A5ACD
 * <span class="colorSwath" style="background: #6A5ACD;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SLATEBLUE = Object.freeze(ColorRGB.fromCssColorString("#6A5ACD"));

/**
 * An immutable Color instance initialized to CSS color #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SLATEGRAY = Object.freeze(ColorRGB.fromCssColorString("#708090"));

/**
 * An immutable Color instance initialized to CSS color #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SLATEGREY = ColorRGB.SLATEGRAY;

/**
 * An immutable Color instance initialized to CSS color #FFFAFA
 * <span class="colorSwath" style="background: #FFFAFA;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SNOW = Object.freeze(ColorRGB.fromCssColorString("#FFFAFA"));

/**
 * An immutable Color instance initialized to CSS color #00FF7F
 * <span class="colorSwath" style="background: #00FF7F;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.SPRINGGREEN = Object.freeze(ColorRGB.fromCssColorString("#00FF7F"));

/**
 * An immutable Color instance initialized to CSS color #4682B4
 * <span class="colorSwath" style="background: #4682B4;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.STEELBLUE = Object.freeze(ColorRGB.fromCssColorString("#4682B4"));

/**
 * An immutable Color instance initialized to CSS color #D2B48C
 * <span class="colorSwath" style="background: #D2B48C;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TAN = Object.freeze(ColorRGB.fromCssColorString("#D2B48C"));

/**
 * An immutable Color instance initialized to CSS color #008080
 * <span class="colorSwath" style="background: #008080;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TEAL = Object.freeze(ColorRGB.fromCssColorString("#008080"));

/**
 * An immutable Color instance initialized to CSS color #D8BFD8
 * <span class="colorSwath" style="background: #D8BFD8;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.THISTLE = Object.freeze(ColorRGB.fromCssColorString("#D8BFD8"));

/**
 * An immutable Color instance initialized to CSS color #FF6347
 * <span class="colorSwath" style="background: #FF6347;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TOMATO = Object.freeze(ColorRGB.fromCssColorString("#FF6347"));

/**
 * An immutable Color instance initialized to CSS color #40E0D0
 * <span class="colorSwath" style="background: #40E0D0;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.TURQUOISE = Object.freeze(ColorRGB.fromCssColorString("#40E0D0"));

/**
 * An immutable Color instance initialized to CSS color #EE82EE
 * <span class="colorSwath" style="background: #EE82EE;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.VIOLET = Object.freeze(ColorRGB.fromCssColorString("#EE82EE"));

/**
 * An immutable Color instance initialized to CSS color #F5DEB3
 * <span class="colorSwath" style="background: #F5DEB3;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.WHEAT = Object.freeze(ColorRGB.fromCssColorString("#F5DEB3"));

/**
 * An immutable Color instance initialized to CSS color #FFFFFF
 * <span class="colorSwath" style="background: #FFFFFF;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.WHITE = Object.freeze(ColorRGB.fromCssColorString("#FFFFFF"));

/**
 * An immutable Color instance initialized to CSS color #F5F5F5
 * <span class="colorSwath" style="background: #F5F5F5;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.WHITESMOKE = Object.freeze(ColorRGB.fromCssColorString("#F5F5F5"));

/**
 * An immutable Color instance initialized to CSS color #FFFF00
 * <span class="colorSwath" style="background: #FFFF00;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.YELLOW = Object.freeze(ColorRGB.fromCssColorString("#FFFF00"));

/**
 * An immutable Color instance initialized to CSS color #9ACD32
 * <span class="colorSwath" style="background: #9ACD32;"></span>
 *
 * @constant
 * @type {ColorRGB}
 */
ColorRGB.YELLOWGREEN = Object.freeze(ColorRGB.fromCssColorString("#9ACD32"));

export default ColorRGB;
export { ColorRGB, ColorRGB as Color3 };
