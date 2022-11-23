import Check, { isDefined, isValid, getValidValue } from "@lijuhong1981/jscheck";
import { lerp } from "@lijuhong1981/jsmath";
import byteToFloat from "./byteToFloat.js";
import floatToByte from "./floatToByte.js";
import hue2rgb from "./hue2rgb.js";
import Color3 from "./Color3.js";

/**
 * A color, specified using red, green, blue, and alpha values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 * @param {Number} [red=1.0] The red component.
 * @param {Number} [green=1.0] The green component.
 * @param {Number} [blue=1.0] The blue component.
 * @param {Number} [alpha=1.0] The alpha component.
 *
 * @constructor
 * @alias Color4
 *
 * @see Packable
 */
function Color4(red = 1.0, green = 1.0, blue = 1.0, alpha = 1.0) {
    /**
     * The red component.
     * @type {Number}
     * @default 1.0
     */
    this.red = red;
    /**
     * The green component.
     * @type {Number}
     * @default 1.0
     */
    this.green = green;
    /**
     * The blue component.
     * @type {Number}
     * @default 1.0
     */
    this.blue = blue;
    /**
     * The alpha component.
     * @type {Number}
     * @default 1.0
     */
    this.alpha = alpha;
}

/**
 * Creates a new Color4 specified using red, green, blue, and alpha values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 *
 * @param {Number} [red=1.0] The red component.
 * @param {Number} [green=1.0] The green component.
 * @param {Number} [blue=1.0] The blue component.
 * @param {Number} [alpha=1.0] The alpha component.
 * @param {Color4} [result] The object onto which to store the result.
 * @returns {Color4} The modified result parameter or a new Color4 instance if one was not provided.
 */
Color4.fromValues = function (red = 1.0, green = 1.0, blue = 1.0, alpha = 1.0, result = new Color4()) {
    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;

    return result;
};

Color4.prototype.setValues = function (red = 1.0, green = 1.0, blue = 1.0, alpha = 1.0) {
    return Color4.fromValues(red, green, blue, alpha, this);
};

/**
 * set color's red value.
 * 
 * @param {Number} red The new red component.
 * @returns {Color4} The modified color.
 */
Color4.prototype.setRed = function (red) {
    Check.typeOf.number("red", red);

    this.red = red;

    return this;
};

/**
 * set color's green value.
 * 
 * @param {Number} green The new green component.
 * @returns {Color4} The modified color.
 */
Color4.prototype.setGreen = function (green) {
    Check.typeOf.number("green", green);

    this.green = green;

    return this;
};

/**
 * set color's blue value.
 * 
 * @param {Number} blue The new blue component.
 * @returns {Color4} The modified color.
 */
Color4.prototype.setBlue = function (blue) {
    Check.typeOf.number("blue", blue);

    this.blue = blue;

    return this;
};

/**
 * set color's alpha value.
 * 
 * @param {Number} alpha The new alpha component.
 * @returns {Color4} The modified color.
 */
Color4.prototype.setAlpha = function (alpha) {
    Check.typeOf.number("alpha", alpha);

    this.alpha = alpha;

    return this;
};

/**
 * Creates a new Color4 that has the same red, green, and blue components
 * of the specified color, but with the specified alpha value.
 *
 * @param {Color3|Color4} color The base color
 * @param {Number} alpha The new alpha component.
 * @param {Color4} [result] The object onto which to store the result.
 * @returns {Color4} The modified result parameter or a new Color4 instance if one was not provided.
 *
 * @example const translucentRed = Color4.fromAlpha(Color4.RED, 0.9);
 */
Color4.fromAlpha = function (color, alpha, result = new Color4()) {
    Check.typeOf.object("color", color);
    Check.typeOf.number("alpha", alpha);

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    result.alpha = alpha;

    return result;
};

/**
 * Creates a new Color4 that has the same red, green, and blue components
 * as this Color4, but with the specified alpha value.
 *
 * @param {Number} alpha The new alpha component.
 * @param {Color4} [result] The object onto which to store the result.
 * @returns {Color4} The modified result parameter or a new Color4 instance if one was not provided.
 *
 * @example const translucentRed = Color4.RED.withAlpha(0.9);
 */
Color4.prototype.withAlpha = function (alpha, result) {
    return Color4.fromAlpha(this, alpha, result);
};

/**
 * Converts a 'byte' color component in the range of 0 to 255 into
 * a 'float' color component in the range of 0 to 1.0.
 *
 * @param {Number} number The number to be converted.
 * @returns {Number} The converted number.
 */
Color4.byteToFloat = byteToFloat;

/**
 * Converts a 'float' color component in the range of 0 to 1.0 into
 * a 'byte' color component in the range of 0 to 255.
 *
 * @param {Number} number The number to be converted.
 * @returns {Number} The converted number.
 */
Color4.floatToByte = floatToByte;

/**
 * Creates a new Color4 specified using red, green, blue, and alpha values
 * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
 *
 * @param {Number} [red=255] The red component.
 * @param {Number} [green=255] The green component.
 * @param {Number} [blue=255] The blue component.
 * @param {Number} [alpha=255] The alpha component.
 * @param {Color4} [result] The object onto which to store the result.
 * @returns {Color4} The modified result parameter or a new Color4 instance if one was not provided.
 */
Color4.fromBytes = function (red = 255.0, green = 255.0, blue = 255.0, alpha = 255.0, result = new Color4()) {
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

Color4.prototype.setFromBytes = function (red = 255.0, green = 255.0, blue = 255.0, alpha = 255.0) {
    return Color4.fromBytes(red, green, blue, alpha, this);
};

/**
 * Converts this color to an array of red, green, blue, and alpha values
 * that are in the range of 0 to 255.
 *
 * @param {Number[]} [result] The array to store the result in, if undefined a new instance will be created.
 * @returns {Number[]} The modified result parameter or a new instance if result was undefined.
 */
Color4.prototype.toBytes = function (result = []) {
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

const scratchArrayBuffer = new ArrayBuffer(4);
const scratchUint32Array = new Uint32Array(scratchArrayBuffer);
const scratchUint8Array = new Uint8Array(scratchArrayBuffer);

/**
 * Creates a new Color4 from a single numeric unsigned 32-bit RGBA value, using the endianness
 * of the system.
 *
 * @param {Number} rgbaNumber A single numeric unsigned 32-bit RGBA value.
 * @param {Color4} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color4} The color object.
 *
 * @example
 * const color = Color4.fromRgbaNumber(0x67ADDFFF);
 *
 * @see Color4#toRgbaNumber
 */
Color4.fromRgbaNumber = function (rgbaNumber, result) {
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint32Array[0] = rgbaNumber;
    return Color4.fromBytes(
        scratchUint8Array[3],
        scratchUint8Array[2],
        scratchUint8Array[1],
        scratchUint8Array[0],
        result
    );
};

Color4.prototype.setFromRgbaNumber = function (rgbaNumber) {
    return Color4.fromRgbaNumber(rgbaNumber, this);
};

/**
 * Converts this color to a single numeric unsigned 32-bit RGBA value, using the endianness
 * of the system.
 *
 * @returns {Number} A single numeric unsigned 32-bit RGBA value.
 *
 *
 * @example
 * const rgba = Color4.BLUE.toRgbaNumber();
 *
 * @see Color4.fromRgbaNumber
 */
Color4.prototype.toRgbaNumber = function () {
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint8Array[3] = floatToByte(this.red);
    scratchUint8Array[2] = floatToByte(this.green);
    scratchUint8Array[1] = floatToByte(this.blue);
    scratchUint8Array[0] = floatToByte(this.alpha);
    return scratchUint32Array[0];
};

/**
 * Creates a Color4 instance from hue, saturation, and lightness.
 *
 * @param {Number} [hue=0] The hue angle 0...1
 * @param {Number} [saturation=0] The saturation value 0...1
 * @param {Number} [lightness=0] The lightness value 0...1
 * @param {Number} [alpha=1.0] The alpha component 0...1
 * @param {Color4} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color4} The color object.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#hsl-color CSS color values}
 */
Color4.fromHsl = function (hue = 0, saturation = 0, lightness = 0, alpha = 1.0, result = new Color4()) {
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

Color4.prototype.setFromHsl = function (hue = 0, saturation = 0, lightness = 0, alpha = 1.0) {
    return Color4.fromHsl(hue, saturation, lightness, alpha, this);
};

/**
 * Creates a random color using the provided options. 
 *
 * @param {Object} [options] Object with the following properties:
 * @param {Number} [options.red] If specified, the red component to use instead of a randomized value.
 * @param {Number} [options.minimumRed=0.0] The maximum red value to generate if none was specified.
 * @param {Number} [options.maximumRed=1.0] The minimum red value to generate if none was specified.
 * @param {Number} [options.green] If specified, the green component to use instead of a randomized value.
 * @param {Number} [options.minimumGreen=0.0] The maximum green value to generate if none was specified.
 * @param {Number} [options.maximumGreen=1.0] The minimum green value to generate if none was specified.
 * @param {Number} [options.blue] If specified, the blue component to use instead of a randomized value.
 * @param {Number} [options.minimumBlue=0.0] The maximum blue value to generate if none was specified.
 * @param {Number} [options.maximumBlue=1.0] The minimum blue value to generate if none was specified.
 * @param {Number} [options.alpha] If specified, the alpha component to use instead of a randomized value.
 * @param {Number} [options.minimumAlpha=0.0] The maximum alpha value to generate if none was specified.
 * @param {Number} [options.maximumAlpha=1.0] The minimum alpha value to generate if none was specified.
 * @param {Color4} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color4} The modified result parameter or a new instance if result was undefined.
 *
 * @exception {Error} minimumRed must be less than or equal to maximumRed.
 * @exception {Error} minimumGreen must be less than or equal to maximumGreen.
 * @exception {Error} minimumBlue must be less than or equal to maximumBlue.
 * @exception {Error} minimumAlpha must be less than or equal to maximumAlpha.
 *
 * @example
 * //Create a completely random color
 * const color = Color4.fromRandom();
 *
 * //Create a random shade of yellow.
 * const color1 = Color4.fromRandom({
 *     red : 1.0,
 *     green : 1.0,
 *     alpha : 1.0
 * });
 *
 * //Create a random bright color.
 * const color2 = Color4.fromRandom({
 *     minimumRed : 0.75,
 *     minimumGreen : 0.75,
 *     minimumBlue : 0.75,
 *     alpha : 1.0
 * });
 */
Color4.fromRandom = function (options = {}, result = new Color4()) {
    let red = options.red;
    if (!isValid(red)) {
        const minimumRed = getValidValue(options.minimumRed, 0);
        const maximumRed = getValidValue(options.maximumRed, 1.0);

        Check.typeOf.number.lessThanOrEquals("minimumRed", minimumRed, maximumRed);

        red = minimumRed + Math.random() * (maximumRed - minimumRed);
    }

    let green = options.green;
    if (!isValid(green)) {
        const minimumGreen = getValidValue(options.minimumGreen, 0);
        const maximumGreen = getValidValue(options.maximumGreen, 1.0);

        Check.typeOf.number.lessThanOrEquals("minimumGreen", minimumGreen, maximumGreen);

        green = minimumGreen + Math.random() * (maximumGreen - minimumGreen);
    }

    let blue = options.blue;
    if (!isValid(blue)) {
        const minimumBlue = getValidValue(options.minimumBlue, 0);
        const maximumBlue = getValidValue(options.maximumBlue, 1.0);

        Check.typeOf.number.lessThanOrEquals("minimumBlue", minimumBlue, maximumBlue);

        blue = minimumBlue + Math.random() * (maximumBlue - minimumBlue);
    }

    let alpha = options.alpha;
    if (!isValid(alpha)) {
        const minimumAlpha = getValidValue(options.minimumAlpha, 0);
        const maximumAlpha = getValidValue(options.maximumAlpha, 1.0);

        Check.typeOf.number.lessThanOrEquals("minumumAlpha", minimumAlpha, maximumAlpha);

        alpha = minimumAlpha + Math.random() * (maximumAlpha - minimumAlpha);
    }

    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;

    return result;
};

Color4.prototype.setFromRandom = function (options = {}) {
    return Color4.fromRandom(options, this);
};

//#rgba
const rgbaMatcher = /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i;
//#rrggbbaa
const rrggbbaaMatcher = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i;
//rgb(), rgba(), or rgb%()
const rgbParenthesesMatcher = /^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i;
//hsl() or hsla()
const hslParenthesesMatcher = /^hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+%)\s*,\s*([0-9.]+%)(?:\s*,\s*([0-9.]+))?\s*\)$/i;

/**
 * Creates a Color4 instance from a CSS color value.
 *
 * @param {String} colorString The CSS color value in #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), or hsla() format.
 * @param {Color4} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color4} The color object, or undefined if the string was not a valid CSS color.
 *
 *
 * @example
 * const color = Color4.fromCssColorString('#67ADDFF0');
 * const green = Color4.fromCssColorString('green');
 *
 * @see {@link http://www.w3.org/TR/css3-color CSS color values}
 */
Color4.fromCssColorString = function (colorString, result = new Color4()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("colorString", colorString);
    //>>includeEnd('debug');

    // Remove all whitespaces from the color string
    let color = colorString.replace(/\s/g, "");

    let namedColor = Color3[color.toUpperCase()];
    if (isDefined(namedColor)) {
        return Color4.fromColor3(namedColor, 1.0, result);
    }

    namedColor = Color4[color.toUpperCase()];
    if (isDefined(namedColor)) {
        return Color4.clone(namedColor, result);
    }

    let matches = rgbaMatcher.exec(color);
    if (matches !== null) {
        result.red = parseInt(matches[1], 16) / 15;
        result.green = parseInt(matches[2], 16) / 15.0;
        result.blue = parseInt(matches[3], 16) / 15.0;
        result.alpha = parseInt(getValidValue(matches[4], "f"), 16) / 15.0;
        return result;
    }

    matches = rrggbbaaMatcher.exec(color);
    if (matches !== null) {
        result.red = parseInt(matches[1], 16) / 255.0;
        result.green = parseInt(matches[2], 16) / 255.0;
        result.blue = parseInt(matches[3], 16) / 255.0;
        result.alpha = parseInt(getValidValue(matches[4], "ff"), 16) / 255.0;
        return result;
    }

    matches = rgbParenthesesMatcher.exec(color);
    if (matches !== null) {
        result.red = parseFloat(matches[1]) / ("%" === matches[1].substr(-1) ? 100.0 : 255.0);
        result.green = parseFloat(matches[2]) / ("%" === matches[2].substr(-1) ? 100.0 : 255.0);
        result.blue = parseFloat(matches[3]) / ("%" === matches[3].substr(-1) ? 100.0 : 255.0);
        result.alpha = parseFloat(getValidValue(matches[4], "1.0"));
        return result;
    }

    matches = hslParenthesesMatcher.exec(color);
    if (matches !== null) {
        return Color4.fromHsl(
            parseFloat(matches[1]) / 360.0,
            parseFloat(matches[2]) / 100.0,
            parseFloat(matches[3]) / 100.0,
            parseFloat(getValidValue(matches[4], "1.0")),
            result
        );
    }
};

Color4.prototype.setFromCssColorString = function (colorString) {
    return Color4.fromCssColorString(colorString, this);
};

/**
 * Creates a string containing the CSS color value for this color.
 *
 * @returns {String} The CSS equivalent of this color.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#rgba-color CSS RGB or RGBA color values}
 */
Color4.prototype.toCssColorString = function () {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);
    // if (this.alpha === 1) {
    //     return `rgb(${red},${green},${blue})`;
    // }
    return `rgba(${red},${green},${blue},${this.alpha})`;
};

/**
 * Creates a string containing CSS hex string color value for this color.
 *
 * @returns {String} The CSS hex string equivalent of this color.
 */
Color4.prototype.toCssHexString = function () {
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
    // if (this.alpha < 1) {
    let hexAlpha = floatToByte(this.alpha).toString(16);
    if (hexAlpha.length < 2) {
        hexAlpha = `0${hexAlpha}`;
    }
    return `#${r}${g}${b}${hexAlpha}`;
    // }
    // return `#${r}${g}${b}`;
};

/**
 * @see Color4.fromAlpha
*/
Color4.fromColor3 = Color4.fromAlpha;

Color4.prototype.toColor3 = function (result = new Color3()) {
    result.red = this.red;
    result.green = this.green;
    result.blue = this.blue;

    return result;
};

/**
 * The number of elements used to pack the object into an array.
 * @type {Number}
 */
Color4.packedLength = 4;

/**
 * Stores the provided Color4 into the provided array.
 *
 * @param {Color4} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
Color4.pack = function (value, array = [], startingIndex = 0) {
    Check.typeOf.object("value", value);

    array[startingIndex++] = value.red;
    array[startingIndex++] = value.green;
    array[startingIndex++] = value.blue;
    array[startingIndex] = value.alpha;

    return array;
};

/**
 * Retrieves an Color4 from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {Color4} [result] The object into which to store the result.
 * @returns {Color4} The modified result parameter or a new Color4 instance if one was not provided.
 */
Color4.unpack = function (array, startingIndex = 0, result = new Color4()) {
    Check.typeOf.array("array", array);

    result.red = array[startingIndex++];
    result.green = array[startingIndex++];
    result.blue = array[startingIndex++];
    result.alpha = array[startingIndex];

    return result;
};

/**
 * @see Color4.unpack
 */
Color4.fromArray = Color4.unpack;

Color4.prototype.setFromArray = function (array, startingIndex = 0) {
    return Color4.fromArray(array, startingIndex, this);
};

/**
 * Stores the provided Color4's array into the provided array.
 *
 * @param {Color4[]} colors The Color4's Array to pack.
 * @param {Number[]} array The array to pack into.
 *
 * @returns {Number[]} The array that was packed into
 */
Color4.packArray = function (colors, array = []) {
    Check.typeOf.array('colors', colors);

    let startingIndex = 0;
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        Color4.pack(color, array, startingIndex);
        startingIndex += Color4.packedLength;
    }

    return array;
};

/**
 * Retrieves an Color4's array from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Color4[]} [result] The object into which to store the result.
 * @returns {Color4[]} The modified result parameter or a new Color4's array if one was not provided.
 */
Color4.unpackArray = function (array, result = []) {
    Check.typeOf.array('array', array);

    let startingIndex = 0, i = 0;
    while (array.length - startingIndex >= Color4.packedLength) {
        result[i] = Color4.unpack(array, startingIndex, result[i]);
        startingIndex += Color4.packedLength;
        i++;
    }

    return result;
};

/**
 * Stores the provided Color4's bytes value into the provided array.
 *
 * @param {Color4} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
Color4.packBytes = function (value, array = [], startingIndex = 0) {
    Check.typeOf.object("value", value);

    const red = floatToByte(value.red);
    const green = floatToByte(value.green);
    const blue = floatToByte(value.blue);
    const alpha = floatToByte(value.alpha);

    array[startingIndex++] = red;
    array[startingIndex++] = green;
    array[startingIndex++] = blue;
    array[startingIndex] = alpha;

    return result;
};

/**
 * Retrieves an Color4's bytes value from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {Color4} [result] The object into which to store the result.
 * @returns {Color4} The modified result parameter or a new Color4 instance if one was not provided.
 */
Color4.unpackBytes = function (array, startingIndex = 0, result = new Color4()) {
    Check.typeOf.array("array", array);

    const red = byteToFloat(array[startingIndex++]);
    const green = byteToFloat(array[startingIndex++]);
    const blue = byteToFloat(array[startingIndex++]);
    const alpha = byteToFloat(array[startingIndex]);

    result.red = red;
    result.green = green;
    result.blue = blue;
    result.alpha = alpha;

    return result;
};

/**
 * @see Color4.unpackBytes
 */
Color4.fromBytesArray = Color4.unpackBytes;

Color4.prototype.setFromBytesArray = function (array, startingIndex = 0) {
    return Color4.fromBytesArray(array, startingIndex, this);
};

/**
 * Duplicates a Color4.
 *
 * @param {Color4} color The Color4 to duplicate.
 * @param {Color4} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color4} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
 */
Color4.clone = function (color, result = new Color4()) {
    Check.typeOf.object('color', color);

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;
    result.alpha = color.alpha;

    return result;
};

/**
 * Returns a duplicate of a Color4 instance.
 *
 * @param {Color4} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color4} The modified result parameter or a new instance if result was undefined.
 */
Color4.prototype.clone = function (result) {
    return Color4.clone(this, result);
};

/**
 * Returns true if the first Color4 equals the second color.
 *
 * @param {Color4} left The first Color4 to compare for equality.
 * @param {Color4} right The second Color4 to compare for equality.
 * @returns {Boolean} <code>true</code> if the Color4's are equal; otherwise, <code>false</code>.
 */
Color4.equals = function (left, right) {
    return (
        left === right || //
        (isDefined(left) && //
            isDefined(right) && //
            left.red === right.red && //
            left.green === right.green && //
            left.blue === right.blue && //
            left.alpha === right.alpha)
    );
};

/**
 * Returns true if this Color4 equals other.
 *
 * @param {Color4} other The Color4 to compare for equality.
 * @returns {Boolean} <code>true</code> if the Color4's are equal; otherwise, <code>false</code>.
 */
Color4.prototype.equals = function (other) {
    return Color4.equals(this, other);
};

/**
 * @private
 */
// Color4.equalsArray = function (color, array, offset) {
//     return (
//         color.red === array[offset] &&
//         color.green === array[offset + 1] &&
//         color.blue === array[offset + 2] &&
//         color.alpha === array[offset + 3]
//     );
// };

/**
 * Returns <code>true</code> if the first Color4 equals the second Color4 componentwise within the specified epsilon.
 *
 * @param {Color4} left The first Color4 to compare for equality.
 * @param {Color4} right The second Color4 to compare for equality.
 * @param {Number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {Boolean} <code>true</code> if the Color4's are equal within the specified epsilon; otherwise, <code>false</code>.
 */
Color4.equalsEpsilon = function (left, right, epsilon = 0.0) {
    return (
        left === right || //
        (isDefined(left) && //
            isDefined(right) && //
            Math.abs(left.red - right.red) <= epsilon && //
            Math.abs(left.green - right.green) <= epsilon && //
            Math.abs(left.blue - right.blue) <= epsilon && //
            Math.abs(left.alpha - right.alpha) <= epsilon)
    );
};

/**
 * Returns <code>true</code> if this Color4 equals other componentwise within the specified epsilon.
 *
 * @param {Color4} other The Color4 to compare for equality.
 * @param {Number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {Boolean} <code>true</code> if the Color4's are equal within the specified epsilon; otherwise, <code>false</code>.
 */
Color4.prototype.equalsEpsilon = function (other, epsilon) {
    return Color4.equalsEpsilon(this, other, epsilon);
};

/**
 * Creates a new Color4 that Brightens by the provided magnitude.
 *
 * @param {Color4} color The base color
 * @param {Number} magnitude A positive number indicating the amount to brighten.
 * @param {Color4} [result] The object onto which to store the result.
 * @returns {Color4} The modified result parameter or a new Color4 instance if one was not provided.
 *
 * @example 
 * const brightBlue = Color4.brighten(Color4.BLUE, 0.5);
 */
Color4.brighten = function (color, magnitude, result = new Color4()) {
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
 * Brightens this color by the provided magnitude.
 *
 * @param {Number} magnitude A positive number indicating the amount to brighten.
 * @param {Color4} result The object onto which to store the result, if not defined, it will use self.
 * @returns {Color4} The modified result.
 *
 * @example
 * const brightBlue = Color4.BLUE.brighten(0.5, new Color4());
 * const brightGreen = Color4.GREEN.clone().brighten(0.5);
 */
Color4.prototype.brighten = function (magnitude, result) {
    return Color4.brighten(this, magnitude, result || this);
};

/**
 * Creates a new Color4 that Darkens by the provided magnitude.
 *
 * @param {Color4} color The base color
 * @param {Number} magnitude A positive number indicating the amount to darken.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 *
 * @example
 * const darkBlue = Color4.darken(Color4.BLUE, 0.5);
 */
Color4.darken = function (color, magnitude, result = new Color4()) {
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
 * Darkens this color by the provided magnitude.
 *
 * @param {Number} magnitude A positive number indicating the amount to darken.
 * @param {Color4} result The object onto which to store the result, if not defined, it will use self.
 * @returns {Color4} The modified result parameter.
 *
 * @example
 * const darkBlue = Color4.BLUE.darken(0.5, new Color4());
 * const darkGreen = Color4.GREEN.clone().darken(0.5);
 */
Color4.prototype.darken = function (magnitude, result) {
    return Color4.darken(this, magnitude, result || this);
};

/**
 * Computes the componentwise sum of two Color4's.
 *
 * @param {Color4} left The first Color4.
 * @param {Color4} right The second Color4.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.add = function (left, right, result = new Color4()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red + right.red;
    result.green = left.green + right.green;
    result.blue = left.blue + right.blue;
    result.alpha = left.alpha + right.alpha;

    return result;
};

Color4.prototype.add = function (other, result) {
    return Color4.add(this, other, result || this);
};

/**
 * Computes the componentwise difference of two Color4's.
 *
 * @param {Color4} left The first Color4.
 * @param {Color4} right The second Color4.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.subtract = function (left, right, result = new Color4()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red - right.red;
    result.green = left.green - right.green;
    result.blue = left.blue - right.blue;
    result.alpha = left.alpha - right.alpha;

    return result;
};

Color4.prototype.subtract = function (other, result) {
    return Color4.subtract(this, other, result || this);
};

/**
 * Computes the componentwise product of two Color4's.
 *
 * @param {Color4} left The first Color4.
 * @param {Color4} right The second Color4.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.multiply = function (left, right, result = new Color4()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red * right.red;
    result.green = left.green * right.green;
    result.blue = left.blue * right.blue;
    result.alpha = left.alpha * right.alpha;

    return result;
};

Color4.prototype.multiply = function (other, result) {
    return Color4.multiply(this, other, result || this);
};

/**
 * Computes the componentwise quotient of two Color4's.
 *
 * @param {Color4} left The first Color4.
 * @param {Color4} right The second Color4.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.divide = function (left, right, result = new Color4()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red / right.red;
    result.green = left.green / right.green;
    result.blue = left.blue / right.blue;
    result.alpha = left.alpha / right.alpha;

    return result;
};

Color4.prototype.divide = function (other, result) {
    return Color4.divide(this, other, result || this);
};

/**
 * Computes the componentwise modulus of two Color4's.
 *
 * @param {Color4} left The first Color4.
 * @param {Color4} right The second Color4.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.mod = function (left, right, result = new Color4()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red % right.red;
    result.green = left.green % right.green;
    result.blue = left.blue % right.blue;
    result.alpha = left.alpha % right.alpha;

    return result;
};

Color4.prototype.mod = function (other, result) {
    return Color4.mod(this, other, result || this);
};

/**
 * Computes the linear interpolation or extrapolation at t between the provided colors.
 *
 * @param {Color4} start The color corresponding to t at 0.0.
 * @param {Color4} end The color corresponding to t at 1.0.
 * @param {Number} t The point along t at which to interpolate.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.lerp = function (start, end, t, result = new Color4()) {
    Check.typeOf.object("start", start);
    Check.typeOf.object("end", end);
    Check.typeOf.number("t", t);

    result.red = lerp(start.red, end.red, t);
    result.green = lerp(start.green, end.green, t);
    result.blue = lerp(start.blue, end.blue, t);
    result.alpha = lerp(start.alpha, end.alpha, t);

    return result;
};

/**
 * Multiplies the provided Color4 componentwise by the provided scalar.
 *
 * @param {Color4} color The Color4 to be scaled.
 * @param {Number} scalar The scalar to multiply with.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.multiplyByScalar = function (color, scalar, result = new Color4()) {
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);

    result.red = color.red * scalar;
    result.green = color.green * scalar;
    result.blue = color.blue * scalar;
    result.alpha = color.alpha * scalar;

    return result;
};

Color4.prototype.multiplyByScalar = function (scalar, result) {
    return Color4.multiplyByScalar(this, scalar, result || this);
};

/**
 * Divides the provided Color4 componentwise by the provided scalar.
 *
 * @param {Color4} color The Color4 to be divided.
 * @param {Number} scalar The scalar to divide with.
 * @param {Color4} result The object onto which to store the result.
 * @returns {Color4} The modified result parameter.
 */
Color4.divideByScalar = function (color, scalar, result = new Color4()) {
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);

    result.red = color.red / scalar;
    result.green = color.green / scalar;
    result.blue = color.blue / scalar;
    result.alpha = color.alpha / scalar;

    return result;
};

Color4.prototype.divideByScalar = function (scalar, result) {
    return Color4.divideByScalar(this, scalar, result || this);
};

/**
 * Creates a string representing this Color4 in the format '(red, green, blue, alpha)'.
 *
 * @returns {String} A string representing this Color4 in the format '(red, green, blue, alpha)'.
 */
Color4.prototype.toString = function () {
    return `Color4(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`;
};

/**
 * An immutable Color4 instance initialized to CSS transparent.
 * <span class="colorSwath" style="background: transparent;"></span>
 *
 * @constant
 * @type {Color4}
 */
Color4.TRANSPARENT = Object.freeze(new Color4(0, 0, 0, 0));

export default Color4;