import Check from "@lijuhong1981/jscheck/src/Check.js";
import isDefined from "@lijuhong1981/jscheck/src/isDefined.js";
import isValid from "@lijuhong1981/jscheck/src/isValid.js";
import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import lerp from "@lijuhong1981/jsmath/src/lerp.js";
import byteToFloat from "./byteToFloat.js";
import floatToByte from "./floatToByte.js";
import hue2rgb from "./hue2rgb.js";
import Color4 from "./Color4.js";

/**
 * A color, specified using red, green, blue values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 * @param {Number} [red=1.0] The red component.
 * @param {Number} [green=1.0] The green component.
 * @param {Number} [blue=1.0] The blue component.
 *
 * @constructor
 * @alias Color3
 *
 * @see Packable
 */
function Color3(red = 1.0, green = 1.0, blue = 1.0) {
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
}

/**
 * Creates a new Color3 specified using red, green, blue values,
 * which range from <code>0</code> (no intensity) to <code>1.0</code> (full intensity).
 *
 * @param {Number} [red=1.0] The red component.
 * @param {Number} [green=1.0] The green component.
 * @param {Number} [blue=1.0] The blue component.
 * @param {Color3} [result] The object onto which to store the result.
 * @returns {Color3} The modified result parameter or a new Color3 instance if one was not provided.
 */
Color3.fromValues = function (red = 1.0, green = 1.0, blue = 1.0, result = new Color3()) {
    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

Color3.prototype.setValues = function (red, green, blue) {
    return Color3.fromValues(red, green, blue, this);
};

/**
 * set color's red value.
 * 
 * @param {Number} red The new red component.
 * @returns {Color3} The modified color.
 */
Color3.prototype.setRed = function (red) {
    Check.typeOf.number("red", red);

    this.red = red;

    return this;
};

/**
 * set color's green value.
 * 
 * @param {Number} green The new green component.
 * @returns {Color3} The modified color.
 */
Color3.prototype.setGreen = function (green) {
    Check.typeOf.number("green", green);

    this.green = green;

    return this;
};

/**
 * set color's blue value.
 * 
 * @param {Number} blue The new blue component.
 * @returns {Color3} The modified color.
 */
Color3.prototype.setBlue = function (blue) {
    Check.typeOf.number("blue", blue);

    this.blue = blue;

    return this;
};

/**
 * Converts a 'byte' color component in the range of 0 to 255 into
 * a 'float' color component in the range of 0 to 1.0.
 *
 * @param {Number} number The number to be converted.
 * @returns {Number} The converted number.
 */
Color3.byteToFloat = byteToFloat;

/**
 * Converts a 'float' color component in the range of 0 to 1.0 into
 * a 'byte' color component in the range of 0 to 255.
 *
 * @param {Number} number The number to be converted.
 * @returns {Number} The converted number.
 */
Color3.floatToByte = floatToByte;

/**
 * Creates a new Color3 specified using red, green, blue values
 * that are in the range of 0 to 255, converting them internally to a range of 0.0 to 1.0.
 *
 * @param {Number} [red=255] The red component.
 * @param {Number} [green=255] The green component.
 * @param {Number} [blue=255] The blue component.
 * @param {Color3} [result] The object onto which to store the result.
 * @returns {Color3} The modified result parameter or a new Color3 instance if one was not provided.
 */
Color3.fromBytes = function (red = 255.0, green = 255.0, blue = 255.0, result = new Color3()) {
    red = byteToFloat(red);
    green = byteToFloat(green);
    blue = byteToFloat(blue);

    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

Color3.prototype.setFromBytes = function (red = 255.0, green = 255.0, blue = 255.0) {
    return Color3.fromBytes(red, green, blue, this);
};

/**
 * Converts this color to an array of red, green, blue values
 * that are in the range of 0 to 255.
 *
 * @param {Number[]} [result] The array to store the result in, if undefined a new instance will be created.
 * @returns {Number[]} The modified result parameter or a new instance if result was undefined.
 */
Color3.prototype.toBytes = function (result = []) {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);

    result[0] = red;
    result[1] = green;
    result[2] = blue;

    return result;
};

const scratchArrayBuffer = new ArrayBuffer(4);
const scratchUint32Array = new Uint32Array(scratchArrayBuffer);
const scratchUint8Array = new Uint8Array(scratchArrayBuffer);

/**
 * Creates a new Color3 from a single numeric unsigned 24-bit RGB value, using the endianness
 * of the system.
 *
 * @param {Number} rgbNumber A single numeric unsigned 24-bit RGB value.
 * @param {Color3} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color3} The color object.
 *
 * @example
 * const color = Color3.fromRgbNumber(0x67ADDF);
 *
 * @see Color3#toRgbNumber
 */
Color3.fromRgbNumber = function (rgbNumber, result) {
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint32Array[0] = rgbNumber;
    return Color3.fromBytes(
        scratchUint8Array[2],
        scratchUint8Array[1],
        scratchUint8Array[0],
        result
    );
};

Color3.prototype.setFromRgbNumber = function (rgbNumber) {
    return Color3.fromRgbNumber(rgbNumber, this);
};

/**
 * Converts this color to a single numeric unsigned 24-bit RGBA value, using the endianness
 * of the system.
 *
 * @returns {Number} A single numeric unsigned 24-bit RGBA value.
 *
 *
 * @example
 * const rgb = Color3.BLUE.toRgbNumber();
 *
 * @see Color3.fromRgbNumber
 */
Color3.prototype.toRgbNumber = function () {
    // scratchUint32Array and scratchUint8Array share an underlying array buffer
    scratchUint8Array[2] = floatToByte(this.red);
    scratchUint8Array[1] = floatToByte(this.green);
    scratchUint8Array[0] = floatToByte(this.blue);
    return scratchUint32Array[0];
};

/**
 * Creates a Color3 instance from hue, saturation, and lightness.
 *
 * @param {Number} [hue=0] The hue angle 0...1
 * @param {Number} [saturation=0] The saturation value 0...1
 * @param {Number} [lightness=0] The lightness value 0...1
 * @param {Color3} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color3} The color object.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#hsl-color CSS color values}
 */
Color3.fromHsl = function (hue = 0, saturation = 0, lightness = 0, result = new Color3()) {
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

Color3.prototype.setFromHsl = function (hue = 0, saturation = 0, lightness = 0) {
    return Color3.fromHsl(hue, saturation, lightness, this);
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
 * @param {Color3} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color3} The modified result parameter or a new instance if result was undefined.
 *
 * @exception {Error} minimumRed must be less than or equal to maximumRed.
 * @exception {Error} minimumGreen must be less than or equal to maximumGreen.
 * @exception {Error} minimumBlue must be less than or equal to maximumBlue.
 *
 * @example
 * //Create a completely random color
 * const color = Color3.fromRandom();
 *
 * //Create a random shade of yellow.
 * const color1 = Color3.fromRandom({
 *     red : 1.0,
 *     green : 1.0,
 * });
 *
 * //Create a random bright color.
 * const color2 = Color3.fromRandom({
 *     minimumRed : 0.75,
 *     minimumGreen : 0.75,
 *     minimumBlue : 0.75,
 * });
 */
Color3.fromRandom = function (options = {}, result = new Color3()) {
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

    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

Color3.prototype.setFromRandom = function (options = {}) {
    return Color3.fromRandom(options, this);
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
 * Creates a Color3 instance from a CSS color value.
 *
 * @param {String} colorString The CSS color value in #rgb, #rgba, #rrggbb, #rrggbbaa, rgb(), rgba(), hsl(), or hsla() format.
 * @param {Color3} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color3} The color object, or undefined if the string was not a valid CSS color.
 *
 *
 * @example
 * const color = Color3.fromCssColorString('#67ADDF');
 * const green = Color3.fromCssColorString('green');
 *
 * @see {@link http://www.w3.org/TR/css3-color CSS color values}
 */
Color3.fromCssColorString = function (colorString, result = new Color3()) {
    //>>includeStart('debug', pragmas.debug);
    Check.typeOf.string("colorString", colorString);
    //>>includeEnd('debug');

    // Remove all whitespaces from the color string
    let color = colorString.replace(/\s/g, "");

    const namedColor = Color3[color.toUpperCase()];
    if (isDefined(namedColor)) {
        Color3.clone(namedColor, result);
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
        result.red = parseFloat(matches[1]) / ("%" === matches[1].substr(-1) ? 100.0 : 255.0);
        result.green = parseFloat(matches[2]) / ("%" === matches[2].substr(-1) ? 100.0 : 255.0);
        result.blue = parseFloat(matches[3]) / ("%" === matches[3].substr(-1) ? 100.0 : 255.0);
        return result;
    }

    matches = hslParenthesesMatcher.exec(color);
    if (matches !== null) {
        return Color3.fromHsl(
            parseFloat(matches[1]) / 360.0,
            parseFloat(matches[2]) / 100.0,
            parseFloat(matches[3]) / 100.0,
            result
        );
    }
};

Color3.prototype.setFromCssColorString = function (colorString) {
    return Color3.fromCssColorString(colorString, this);
};

/**
 * Creates a string containing the CSS color value for this color.
 *
 * @returns {String} The CSS equivalent of this color.
 *
 * @see {@link http://www.w3.org/TR/css3-color/#rgb-color CSS RGB color values}
 */
Color3.prototype.toCssColorString = function () {
    const red = floatToByte(this.red);
    const green = floatToByte(this.green);
    const blue = floatToByte(this.blue);
    return `rgb(${red},${green},${blue})`;
};

/**
 * Creates a string containing CSS hex string color value for this color.
 *
 * @returns {String} The CSS hex string equivalent of this color.
 */
Color3.prototype.toCssHexString = function () {
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
 * The number of elements used to pack the object into an array.
 * @type {Number}
 */
Color3.packedLength = 3;

/**
 * Stores the provided Color3 into the provided array.
 *
 * @param {Color3} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
Color3.pack = function (value, array = [], startingIndex = 0) {
    Check.typeOf.object("value", value);

    array[startingIndex++] = value.red;
    array[startingIndex++] = value.green;
    array[startingIndex++] = value.blue;

    return array;
};

/**
 * Retrieves an Color3 from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {Color3} [result] The object into which to store the result.
 * @returns {Color3} The modified result parameter or a new Color3 instance if one was not provided.
 */
Color3.unpack = function (array, startingIndex = 0, result = new Color3()) {
    Check.typeOf.array("array", array);

    result.red = array[startingIndex++];
    result.green = array[startingIndex++];
    result.blue = array[startingIndex++];

    return result;
};

/**
 * @see Color3.unpack
 */
Color3.fromArray = Color3.unpack;

Color3.prototype.setFromArray = function (array, startingIndex = 0) {
    return Color3.fromArray(array, startingIndex, this);
};

/**
 * Stores the provided Color3's array into the provided array.
 *
 * @param {Color3[]} colors The Color3's Array to pack.
 * @param {Number[]} array The array to pack into.
 *
 * @returns {Number[]} The array that was packed into
 */
Color3.packArray = function (colors, array = []) {
    Check.typeOf.array('colors', colors);

    let startingIndex = 0;
    for (let i = 0; i < colors.length; i++) {
        const color = colors[i];
        Color3.pack(color, array, startingIndex);
        startingIndex += Color3.packedLength;
    }

    return array;
};

/**
 * Retrieves an Color3's array from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Color3[]} [result] The object into which to store the result.
 * @returns {Color3[]} The modified result parameter or a new Color3's array if one was not provided.
 */
Color3.unpackArray = function (array, result = []) {
    Check.typeOf.array('array', array);

    let startingIndex = 0, i = 0;
    while (array.length - startingIndex >= Color3.packedLength) {
        result[i] = Color3.unpack(array, startingIndex, result[i]);
        startingIndex += Color3.packedLength;
        i++;
    }

    return result;
};

/**
 * Stores the provided Color3's bytes value into the provided array.
 *
 * @param {Color3} value The value to pack.
 * @param {Number[]} array The array to pack into.
 * @param {Number} [startingIndex=0] The index into the array at which to start packing the elements.
 *
 * @returns {Number[]} The array that was packed into
 */
Color3.packBytes = function (value, array = [], startingIndex = 0) {
    Check.typeOf.object("value", value);

    const red = floatToByte(value.red);
    const green = floatToByte(value.green);
    const blue = floatToByte(value.blue);

    array[startingIndex++] = red;
    array[startingIndex++] = green;
    array[startingIndex++] = blue;

    return result;
};

/**
 * Retrieves an Color3's bytes value from a packed array.
 *
 * @param {Number[]} array The packed array.
 * @param {Number} [startingIndex=0] The starting index of the element to be unpacked.
 * @param {Color3} [result] The object into which to store the result.
 * @returns {Color3} The modified result parameter or a new Color3 instance if one was not provided.
 */
Color3.unpackBytes = function (array, startingIndex = 0, result = new Color3()) {
    Check.typeOf.array("array", array);

    const red = byteToFloat(array[startingIndex++]);
    const green = byteToFloat(array[startingIndex++]);
    const blue = byteToFloat(array[startingIndex++]);

    result.red = red;
    result.green = green;
    result.blue = blue;

    return result;
};

/**
 * @see Color3.unpackBytes
 */
Color3.fromBytesArray = Color3.unpackBytes;

Color3.prototype.setFromBytesArray = function (array, startingIndex = 0) {
    return Color3.fromBytesArray(array, startingIndex, this);
};

/**
 * Duplicates a Color3.
 *
 * @param {Color3} color The Color3 to duplicate.
 * @param {Color3} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color3} The modified result parameter or a new instance if result was undefined. (Returns undefined if color is undefined)
 */
Color3.clone = function (color, result = new Color3()) {
    Check.typeOf.object('color', color);

    result.red = color.red;
    result.green = color.green;
    result.blue = color.blue;

    return result;
};

/**
 * Returns a duplicate of a Color3 instance.
 *
 * @param {Color3} [result] The object to store the result in, if undefined a new instance will be created.
 * @returns {Color3} The modified result parameter or a new instance if result was undefined.
 */
Color3.prototype.clone = function (result) {
    return Color3.clone(this, result);
};

/**
 * @see Color3.clone
 */
Color3.fromColor4 = Color3.clone;

Color3.prototype.toColor4 = function (result = new Color4()) {
    result.red = this.red;
    result.green = this.green;
    result.blue = this.blue;

    return result;
};

/**
 * Returns true if the first Color3 equals the second color.
 *
 * @param {Color3} left The first Color3 to compare for equality.
 * @param {Color3} right The second Color3 to compare for equality.
 * @returns {Boolean} <code>true</code> if the Color3's are equal; otherwise, <code>false</code>.
 */
Color3.equals = function (left, right) {
    return (
        left === right || //
        (isDefined(left) && //
            isDefined(right) && //
            left.red === right.red && //
            left.green === right.green && //
            left.blue === right.blue)
    );
};

/**
 * Returns true if this Color3 equals other.
 *
 * @param {Color3} other The Color3 to compare for equality.
 * @returns {Boolean} <code>true</code> if the Color3's are equal; otherwise, <code>false</code>.
 */
Color3.prototype.equals = function (other) {
    return Color3.equals(this, other);
};

/**
 * Returns <code>true</code> if the first Color3 equals the second Color3 componentwise within the specified epsilon.
 *
 * @param {Color3} left The first Color3 to compare for equality.
 * @param {Color3} right The second Color3 to compare for equality.
 * @param {Number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {Boolean} <code>true</code> if the Color3's are equal within the specified epsilon; otherwise, <code>false</code>.
 */
Color3.equalsEpsilon = function (left, right, epsilon = 0.0) {
    return (
        left === right || //
        (isDefined(left) && //
            isDefined(right) && //
            Math.abs(left.red - right.red) <= epsilon && //
            Math.abs(left.green - right.green) <= epsilon && //
            Math.abs(left.blue - right.blue) <= epsilon)
    );
};

/**
 * Returns <code>true</code> if this Color3 equals other componentwise within the specified epsilon.
 *
 * @param {Color3} other The Color3 to compare for equality.
 * @param {Number} [epsilon=0.0] The epsilon to use for equality testing.
 * @returns {Boolean} <code>true</code> if the Color3's are equal within the specified epsilon; otherwise, <code>false</code>.
 */
Color3.prototype.equalsEpsilon = function (other, epsilon) {
    return Color3.equalsEpsilon(this, other, epsilon);
};

/**
 * Creates a new Color3 that Brightens by the provided magnitude.
 *
 * @param {Color3} color The base color
 * @param {Number} magnitude A positive number indicating the amount to brighten.
 * @param {Color3} [result] The object onto which to store the result.
 * @returns {Color3} The modified result parameter or a new Color3 instance if one was not provided.
 *
 * @example 
 * const brightBlue = Color3.brighten(Color3.BLUE, 0.5);
 */
Color3.brighten = function (color, magnitude, result = new Color3()) {
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
 * Brightens this color by the provided magnitude.
 *
 * @param {Number} magnitude A positive number indicating the amount to brighten.
 * @param {Color3} result The object onto which to store the result, if not defined, it will use self.
 * @returns {Color3} The modified result.
 *
 * @example
 * const brightBlue = Color3.BLUE.brighten(0.5, new Color3());
 * const brightGreen = Color3.GREEN.clone().brighten(0.5);
 */
Color3.prototype.brighten = function (magnitude, result) {
    return Color3.brighten(this, magnitude, result || this);
};

/**
 * Creates a new Color3 that Darkens by the provided magnitude.
 *
 * @param {Color3} color The base color
 * @param {Number} magnitude A positive number indicating the amount to darken.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 *
 * @example
 * const darkBlue = Color3.darken(Color3.BLUE, 0.5);
 */
Color3.darken = function (color, magnitude, result = new Color3()) {
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
 * Darkens this color by the provided magnitude.
 *
 * @param {Number} magnitude A positive number indicating the amount to darken.
 * @param {Color3} result The object onto which to store the result, if not defined, it will use self.
 * @returns {Color3} The modified result parameter.
 *
 * @example
 * const darkBlue = Color3.BLUE.darken(0.5, new Color3());
 * const darkGreen = Color3.GREEN.clone().darken(0.5);
 */
Color3.prototype.darken = function (magnitude, result) {
    return Color3.darken(this, magnitude, result || this);
};

/**
 * Computes the componentwise sum of two Color3's.
 *
 * @param {Color3} left The first Color3.
 * @param {Color3} right The second Color3.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.add = function (left, right, result = new Color3()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red + right.red;
    result.green = left.green + right.green;
    result.blue = left.blue + right.blue;

    return result;
};

Color3.prototype.add = function (other, result) {
    return Color3.add(this, other, result || this);
};

/**
 * Computes the componentwise difference of two Color3's.
 *
 * @param {Color3} left The first Color3.
 * @param {Color3} right The second Color3.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.subtract = function (left, right, result = new Color3()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red - right.red;
    result.green = left.green - right.green;
    result.blue = left.blue - right.blue;

    return result;
};

Color3.prototype.subtract = function (other, result) {
    return Color3.subtract(this, other, result || this);
};

/**
 * Computes the componentwise product of two Color3's.
 *
 * @param {Color3} left The first Color3.
 * @param {Color3} right The second Color3.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.multiply = function (left, right, result = new Color3()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red * right.red;
    result.green = left.green * right.green;
    result.blue = left.blue * right.blue;

    return result;
};

Color3.prototype.multiply = function (other, result) {
    return Color3.multiply(this, other, result || this);
};

/**
 * Computes the componentwise quotient of two Color3's.
 *
 * @param {Color3} left The first Color3.
 * @param {Color3} right The second Color3.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.divide = function (left, right, result = new Color3()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red / right.red;
    result.green = left.green / right.green;
    result.blue = left.blue / right.blue;

    return result;
};

Color3.prototype.divide = function (other, result) {
    return Color3.divide(this, other, result || this);
};

/**
 * Computes the componentwise modulus of two Color3's.
 *
 * @param {Color3} left The first Color3.
 * @param {Color3} right The second Color3.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.mod = function (left, right, result = new Color3()) {
    Check.typeOf.object("left", left);
    Check.typeOf.object("right", right);

    result.red = left.red % right.red;
    result.green = left.green % right.green;
    result.blue = left.blue % right.blue;

    return result;
};

Color3.prototype.mod = function (other, result) {
    return Color3.mod(this, other, result || this);
};

/**
 * Computes the linear interpolation or extrapolation at t between the provided colors.
 *
 * @param {Color3} start The color corresponding to t at 0.0.
 * @param {Color3} end The color corresponding to t at 1.0.
 * @param {Number} t The point along t at which to interpolate.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.lerp = function (start, end, t, result = new Color3()) {
    Check.typeOf.object("start", start);
    Check.typeOf.object("end", end);
    Check.typeOf.number("t", t);

    result.red = lerp(start.red, end.red, t);
    result.green = lerp(start.green, end.green, t);
    result.blue = lerp(start.blue, end.blue, t);

    return result;
};

/**
 * Multiplies the provided Color3 componentwise by the provided scalar.
 *
 * @param {Color3} color The Color3 to be scaled.
 * @param {Number} scalar The scalar to multiply with.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.multiplyByScalar = function (color, scalar, result = new Color3()) {
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);

    result.red = color.red * scalar;
    result.green = color.green * scalar;
    result.blue = color.blue * scalar;

    return result;
};

Color3.prototype.multiplyByScalar = function (scalar, result) {
    return Color3.multiplyByScalar(this, scalar, result || this);
};

/**
 * Divides the provided Color3 componentwise by the provided scalar.
 *
 * @param {Color3} color The Color3 to be divided.
 * @param {Number} scalar The scalar to divide with.
 * @param {Color3} result The object onto which to store the result.
 * @returns {Color3} The modified result parameter.
 */
Color3.divideByScalar = function (color, scalar, result = new Color3()) {
    Check.typeOf.object("color", color);
    Check.typeOf.number("scalar", scalar);

    result.red = color.red / scalar;
    result.green = color.green / scalar;
    result.blue = color.blue / scalar;

    return result;
};

Color3.prototype.divideByScalar = function (scalar, result) {
    return Color3.divideByScalar(this, scalar, result || this);
};

/**
 * Creates a string representing this Color3 in the format '(red, green, blue)'.
 *
 * @returns {String} A string representing this Color3 in the format '(red, green, blue)'.
 */
Color3.prototype.toString = function () {
    return `Color3(${this.red}, ${this.green}, ${this.blue})`;
};

/**
 * An immutable Color3 instance initialized to CSS color #F0F8FF
 * <span class="colorSwath" style="background: #F0F8FF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.ALICEBLUE = Object.freeze(Color3.fromCssColorString("#F0F8FF"));

/**
 * An immutable Color3 instance initialized to CSS color #FAEBD7
 * <span class="colorSwath" style="background: #FAEBD7;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.ANTIQUEWHITE = Object.freeze(Color3.fromCssColorString("#FAEBD7"));

/**
 * An immutable Color3 instance initialized to CSS color #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.AQUA = Object.freeze(Color3.fromCssColorString("#00FFFF"));

/**
 * An immutable Color3 instance initialized to CSS color #7FFFD4
 * <span class="colorSwath" style="background: #7FFFD4;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.AQUAMARINE = Object.freeze(Color3.fromCssColorString("#7FFFD4"));

/**
 * An immutable Color3 instance initialized to CSS color #F0FFFF
 * <span class="colorSwath" style="background: #F0FFFF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.AZURE = Object.freeze(Color3.fromCssColorString("#F0FFFF"));

/**
 * An immutable Color3 instance initialized to CSS color #F5F5DC
 * <span class="colorSwath" style="background: #F5F5DC;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BEIGE = Object.freeze(Color3.fromCssColorString("#F5F5DC"));

/**
 * An immutable Color3 instance initialized to CSS color #FFE4C4
 * <span class="colorSwath" style="background: #FFE4C4;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BISQUE = Object.freeze(Color3.fromCssColorString("#FFE4C4"));

/**
 * An immutable Color3 instance initialized to CSS color #000000
 * <span class="colorSwath" style="background: #000000;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BLACK = Object.freeze(Color3.fromCssColorString("#000000"));

/**
 * An immutable Color3 instance initialized to CSS color #FFEBCD
 * <span class="colorSwath" style="background: #FFEBCD;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BLANCHEDALMOND = Object.freeze(Color3.fromCssColorString("#FFEBCD"));

/**
 * An immutable Color3 instance initialized to CSS color #0000FF
 * <span class="colorSwath" style="background: #0000FF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BLUE = Object.freeze(Color3.fromCssColorString("#0000FF"));

/**
 * An immutable Color3 instance initialized to CSS color #8A2BE2
 * <span class="colorSwath" style="background: #8A2BE2;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BLUEVIOLET = Object.freeze(Color3.fromCssColorString("#8A2BE2"));

/**
 * An immutable Color3 instance initialized to CSS color #A52A2A
 * <span class="colorSwath" style="background: #A52A2A;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BROWN = Object.freeze(Color3.fromCssColorString("#A52A2A"));

/**
 * An immutable Color3 instance initialized to CSS color #DEB887
 * <span class="colorSwath" style="background: #DEB887;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.BURLYWOOD = Object.freeze(Color3.fromCssColorString("#DEB887"));

/**
 * An immutable Color3 instance initialized to CSS color #5F9EA0
 * <span class="colorSwath" style="background: #5F9EA0;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CADETBLUE = Object.freeze(Color3.fromCssColorString("#5F9EA0"));
/**
 * An immutable Color3 instance initialized to CSS color #7FFF00
 * <span class="colorSwath" style="background: #7FFF00;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CHARTREUSE = Object.freeze(Color3.fromCssColorString("#7FFF00"));

/**
 * An immutable Color3 instance initialized to CSS color #D2691E
 * <span class="colorSwath" style="background: #D2691E;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CHOCOLATE = Object.freeze(Color3.fromCssColorString("#D2691E"));

/**
 * An immutable Color3 instance initialized to CSS color #FF7F50
 * <span class="colorSwath" style="background: #FF7F50;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CORAL = Object.freeze(Color3.fromCssColorString("#FF7F50"));

/**
 * An immutable Color3 instance initialized to CSS color #6495ED
 * <span class="colorSwath" style="background: #6495ED;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CORNFLOWERBLUE = Object.freeze(Color3.fromCssColorString("#6495ED"));

/**
 * An immutable Color3 instance initialized to CSS color #FFF8DC
 * <span class="colorSwath" style="background: #FFF8DC;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CORNSILK = Object.freeze(Color3.fromCssColorString("#FFF8DC"));

/**
 * An immutable Color3 instance initialized to CSS color #DC143C
 * <span class="colorSwath" style="background: #DC143C;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CRIMSON = Object.freeze(Color3.fromCssColorString("#DC143C"));

/**
 * An immutable Color3 instance initialized to CSS color #00FFFF
 * <span class="colorSwath" style="background: #00FFFF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.CYAN = Object.freeze(Color3.fromCssColorString("#00FFFF"));

/**
 * An immutable Color3 instance initialized to CSS color #00008B
 * <span class="colorSwath" style="background: #00008B;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKBLUE = Object.freeze(Color3.fromCssColorString("#00008B"));

/**
 * An immutable Color3 instance initialized to CSS color #008B8B
 * <span class="colorSwath" style="background: #008B8B;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKCYAN = Object.freeze(Color3.fromCssColorString("#008B8B"));

/**
 * An immutable Color3 instance initialized to CSS color #B8860B
 * <span class="colorSwath" style="background: #B8860B;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKGOLDENROD = Object.freeze(Color3.fromCssColorString("#B8860B"));

/**
 * An immutable Color3 instance initialized to CSS color #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKGRAY = Object.freeze(Color3.fromCssColorString("#A9A9A9"));

/**
 * An immutable Color3 instance initialized to CSS color #006400
 * <span class="colorSwath" style="background: #006400;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKGREEN = Object.freeze(Color3.fromCssColorString("#006400"));

/**
 * An immutable Color3 instance initialized to CSS color #A9A9A9
 * <span class="colorSwath" style="background: #A9A9A9;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKGREY = Color3.DARKGRAY;

/**
 * An immutable Color3 instance initialized to CSS color #BDB76B
 * <span class="colorSwath" style="background: #BDB76B;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKKHAKI = Object.freeze(Color3.fromCssColorString("#BDB76B"));

/**
 * An immutable Color3 instance initialized to CSS color #8B008B
 * <span class="colorSwath" style="background: #8B008B;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKMAGENTA = Object.freeze(Color3.fromCssColorString("#8B008B"));

/**
 * An immutable Color3 instance initialized to CSS color #556B2F
 * <span class="colorSwath" style="background: #556B2F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKOLIVEGREEN = Object.freeze(Color3.fromCssColorString("#556B2F"));

/**
 * An immutable Color3 instance initialized to CSS color #FF8C00
 * <span class="colorSwath" style="background: #FF8C00;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKORANGE = Object.freeze(Color3.fromCssColorString("#FF8C00"));

/**
 * An immutable Color3 instance initialized to CSS color #9932CC
 * <span class="colorSwath" style="background: #9932CC;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKORCHID = Object.freeze(Color3.fromCssColorString("#9932CC"));

/**
 * An immutable Color3 instance initialized to CSS color #8B0000
 * <span class="colorSwath" style="background: #8B0000;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKRED = Object.freeze(Color3.fromCssColorString("#8B0000"));

/**
 * An immutable Color3 instance initialized to CSS color #E9967A
 * <span class="colorSwath" style="background: #E9967A;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKSALMON = Object.freeze(Color3.fromCssColorString("#E9967A"));

/**
 * An immutable Color3 instance initialized to CSS color #8FBC8F
 * <span class="colorSwath" style="background: #8FBC8F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKSEAGREEN = Object.freeze(Color3.fromCssColorString("#8FBC8F"));

/**
 * An immutable Color3 instance initialized to CSS color #483D8B
 * <span class="colorSwath" style="background: #483D8B;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKSLATEBLUE = Object.freeze(Color3.fromCssColorString("#483D8B"));

/**
 * An immutable Color3 instance initialized to CSS color #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKSLATEGRAY = Object.freeze(Color3.fromCssColorString("#2F4F4F"));

/**
 * An immutable Color3 instance initialized to CSS color #2F4F4F
 * <span class="colorSwath" style="background: #2F4F4F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKSLATEGREY = Color3.DARKSLATEGRAY;

/**
 * An immutable Color3 instance initialized to CSS color #00CED1
 * <span class="colorSwath" style="background: #00CED1;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKTURQUOISE = Object.freeze(Color3.fromCssColorString("#00CED1"));

/**
 * An immutable Color3 instance initialized to CSS color #9400D3
 * <span class="colorSwath" style="background: #9400D3;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DARKVIOLET = Object.freeze(Color3.fromCssColorString("#9400D3"));

/**
 * An immutable Color3 instance initialized to CSS color #FF1493
 * <span class="colorSwath" style="background: #FF1493;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DEEPPINK = Object.freeze(Color3.fromCssColorString("#FF1493"));

/**
 * An immutable Color3 instance initialized to CSS color #00BFFF
 * <span class="colorSwath" style="background: #00BFFF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DEEPSKYBLUE = Object.freeze(Color3.fromCssColorString("#00BFFF"));

/**
 * An immutable Color3 instance initialized to CSS color #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DIMGRAY = Object.freeze(Color3.fromCssColorString("#696969"));

/**
 * An immutable Color3 instance initialized to CSS color #696969
 * <span class="colorSwath" style="background: #696969;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DIMGREY = Color3.DIMGRAY;

/**
 * An immutable Color3 instance initialized to CSS color #1E90FF
 * <span class="colorSwath" style="background: #1E90FF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.DODGERBLUE = Object.freeze(Color3.fromCssColorString("#1E90FF"));

/**
 * An immutable Color3 instance initialized to CSS color #B22222
 * <span class="colorSwath" style="background: #B22222;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.FIREBRICK = Object.freeze(Color3.fromCssColorString("#B22222"));

/**
 * An immutable Color3 instance initialized to CSS color #FFFAF0
 * <span class="colorSwath" style="background: #FFFAF0;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.FLORALWHITE = Object.freeze(Color3.fromCssColorString("#FFFAF0"));

/**
 * An immutable Color3 instance initialized to CSS color #228B22
 * <span class="colorSwath" style="background: #228B22;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.FORESTGREEN = Object.freeze(Color3.fromCssColorString("#228B22"));

/**
 * An immutable Color3 instance initialized to CSS color #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.FUCHSIA = Object.freeze(Color3.fromCssColorString("#FF00FF"));

/**
 * An immutable Color3 instance initialized to CSS color #DCDCDC
 * <span class="colorSwath" style="background: #DCDCDC;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GAINSBORO = Object.freeze(Color3.fromCssColorString("#DCDCDC"));

/**
 * An immutable Color3 instance initialized to CSS color #F8F8FF
 * <span class="colorSwath" style="background: #F8F8FF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GHOSTWHITE = Object.freeze(Color3.fromCssColorString("#F8F8FF"));

/**
 * An immutable Color3 instance initialized to CSS color #FFD700
 * <span class="colorSwath" style="background: #FFD700;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GOLD = Object.freeze(Color3.fromCssColorString("#FFD700"));

/**
 * An immutable Color3 instance initialized to CSS color #DAA520
 * <span class="colorSwath" style="background: #DAA520;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GOLDENROD = Object.freeze(Color3.fromCssColorString("#DAA520"));

/**
 * An immutable Color3 instance initialized to CSS color #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GRAY = Object.freeze(Color3.fromCssColorString("#808080"));

/**
 * An immutable Color3 instance initialized to CSS color #008000
 * <span class="colorSwath" style="background: #008000;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GREEN = Object.freeze(Color3.fromCssColorString("#008000"));

/**
 * An immutable Color3 instance initialized to CSS color #ADFF2F
 * <span class="colorSwath" style="background: #ADFF2F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GREENYELLOW = Object.freeze(Color3.fromCssColorString("#ADFF2F"));

/**
 * An immutable Color3 instance initialized to CSS color #808080
 * <span class="colorSwath" style="background: #808080;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.GREY = Color3.GRAY;

/**
 * An immutable Color3 instance initialized to CSS color #F0FFF0
 * <span class="colorSwath" style="background: #F0FFF0;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.HONEYDEW = Object.freeze(Color3.fromCssColorString("#F0FFF0"));

/**
 * An immutable Color3 instance initialized to CSS color #FF69B4
 * <span class="colorSwath" style="background: #FF69B4;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.HOTPINK = Object.freeze(Color3.fromCssColorString("#FF69B4"));

/**
 * An immutable Color3 instance initialized to CSS color #CD5C5C
 * <span class="colorSwath" style="background: #CD5C5C;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.INDIANRED = Object.freeze(Color3.fromCssColorString("#CD5C5C"));

/**
 * An immutable Color3 instance initialized to CSS color #4B0082
 * <span class="colorSwath" style="background: #4B0082;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.INDIGO = Object.freeze(Color3.fromCssColorString("#4B0082"));

/**
 * An immutable Color3 instance initialized to CSS color #FFFFF0
 * <span class="colorSwath" style="background: #FFFFF0;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.IVORY = Object.freeze(Color3.fromCssColorString("#FFFFF0"));

/**
 * An immutable Color3 instance initialized to CSS color #F0E68C
 * <span class="colorSwath" style="background: #F0E68C;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.KHAKI = Object.freeze(Color3.fromCssColorString("#F0E68C"));

/**
 * An immutable Color3 instance initialized to CSS color #E6E6FA
 * <span class="colorSwath" style="background: #E6E6FA;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LAVENDER = Object.freeze(Color3.fromCssColorString("#E6E6FA"));

/**
 * An immutable Color3 instance initialized to CSS color #FFF0F5
 * <span class="colorSwath" style="background: #FFF0F5;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LAVENDAR_BLUSH = Object.freeze(Color3.fromCssColorString("#FFF0F5"));

/**
 * An immutable Color3 instance initialized to CSS color #7CFC00
 * <span class="colorSwath" style="background: #7CFC00;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LAWNGREEN = Object.freeze(Color3.fromCssColorString("#7CFC00"));

/**
 * An immutable Color3 instance initialized to CSS color #FFFACD
 * <span class="colorSwath" style="background: #FFFACD;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LEMONCHIFFON = Object.freeze(Color3.fromCssColorString("#FFFACD"));

/**
 * An immutable Color3 instance initialized to CSS color #ADD8E6
 * <span class="colorSwath" style="background: #ADD8E6;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTBLUE = Object.freeze(Color3.fromCssColorString("#ADD8E6"));

/**
 * An immutable Color3 instance initialized to CSS color #F08080
 * <span class="colorSwath" style="background: #F08080;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTCORAL = Object.freeze(Color3.fromCssColorString("#F08080"));

/**
 * An immutable Color3 instance initialized to CSS color #E0FFFF
 * <span class="colorSwath" style="background: #E0FFFF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTCYAN = Object.freeze(Color3.fromCssColorString("#E0FFFF"));

/**
 * An immutable Color3 instance initialized to CSS color #FAFAD2
 * <span class="colorSwath" style="background: #FAFAD2;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTGOLDENRODYELLOW = Object.freeze(Color3.fromCssColorString("#FAFAD2"));

/**
 * An immutable Color3 instance initialized to CSS color #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTGRAY = Object.freeze(Color3.fromCssColorString("#D3D3D3"));

/**
 * An immutable Color3 instance initialized to CSS color #90EE90
 * <span class="colorSwath" style="background: #90EE90;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTGREEN = Object.freeze(Color3.fromCssColorString("#90EE90"));

/**
 * An immutable Color3 instance initialized to CSS color #D3D3D3
 * <span class="colorSwath" style="background: #D3D3D3;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTGREY = Color3.LIGHTGRAY;

/**
 * An immutable Color3 instance initialized to CSS color #FFB6C1
 * <span class="colorSwath" style="background: #FFB6C1;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTPINK = Object.freeze(Color3.fromCssColorString("#FFB6C1"));

/**
 * An immutable Color3 instance initialized to CSS color #20B2AA
 * <span class="colorSwath" style="background: #20B2AA;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTSEAGREEN = Object.freeze(Color3.fromCssColorString("#20B2AA"));

/**
 * An immutable Color3 instance initialized to CSS color #87CEFA
 * <span class="colorSwath" style="background: #87CEFA;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTSKYBLUE = Object.freeze(Color3.fromCssColorString("#87CEFA"));

/**
 * An immutable Color3 instance initialized to CSS color #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTSLATEGRAY = Object.freeze(Color3.fromCssColorString("#778899"));

/**
 * An immutable Color3 instance initialized to CSS color #778899
 * <span class="colorSwath" style="background: #778899;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTSLATEGREY = Color3.LIGHTSLATEGRAY;

/**
 * An immutable Color3 instance initialized to CSS color #B0C4DE
 * <span class="colorSwath" style="background: #B0C4DE;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTSTEELBLUE = Object.freeze(Color3.fromCssColorString("#B0C4DE"));

/**
 * An immutable Color3 instance initialized to CSS color #FFFFE0
 * <span class="colorSwath" style="background: #FFFFE0;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIGHTYELLOW = Object.freeze(Color3.fromCssColorString("#FFFFE0"));

/**
 * An immutable Color3 instance initialized to CSS color #00FF00
 * <span class="colorSwath" style="background: #00FF00;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIME = Object.freeze(Color3.fromCssColorString("#00FF00"));

/**
 * An immutable Color3 instance initialized to CSS color #32CD32
 * <span class="colorSwath" style="background: #32CD32;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LIMEGREEN = Object.freeze(Color3.fromCssColorString("#32CD32"));

/**
 * An immutable Color3 instance initialized to CSS color #FAF0E6
 * <span class="colorSwath" style="background: #FAF0E6;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.LINEN = Object.freeze(Color3.fromCssColorString("#FAF0E6"));

/**
 * An immutable Color3 instance initialized to CSS color #FF00FF
 * <span class="colorSwath" style="background: #FF00FF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MAGENTA = Object.freeze(Color3.fromCssColorString("#FF00FF"));

/**
 * An immutable Color3 instance initialized to CSS color #800000
 * <span class="colorSwath" style="background: #800000;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MAROON = Object.freeze(Color3.fromCssColorString("#800000"));

/**
 * An immutable Color3 instance initialized to CSS color #66CDAA
 * <span class="colorSwath" style="background: #66CDAA;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMAQUAMARINE = Object.freeze(Color3.fromCssColorString("#66CDAA"));

/**
 * An immutable Color3 instance initialized to CSS color #0000CD
 * <span class="colorSwath" style="background: #0000CD;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMBLUE = Object.freeze(Color3.fromCssColorString("#0000CD"));

/**
 * An immutable Color3 instance initialized to CSS color #BA55D3
 * <span class="colorSwath" style="background: #BA55D3;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMORCHID = Object.freeze(Color3.fromCssColorString("#BA55D3"));

/**
 * An immutable Color3 instance initialized to CSS color #9370DB
 * <span class="colorSwath" style="background: #9370DB;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMPURPLE = Object.freeze(Color3.fromCssColorString("#9370DB"));

/**
 * An immutable Color3 instance initialized to CSS color #3CB371
 * <span class="colorSwath" style="background: #3CB371;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMSEAGREEN = Object.freeze(Color3.fromCssColorString("#3CB371"));

/**
 * An immutable Color3 instance initialized to CSS color #7B68EE
 * <span class="colorSwath" style="background: #7B68EE;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMSLATEBLUE = Object.freeze(Color3.fromCssColorString("#7B68EE"));

/**
 * An immutable Color3 instance initialized to CSS color #00FA9A
 * <span class="colorSwath" style="background: #00FA9A;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMSPRINGGREEN = Object.freeze(Color3.fromCssColorString("#00FA9A"));

/**
 * An immutable Color3 instance initialized to CSS color #48D1CC
 * <span class="colorSwath" style="background: #48D1CC;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMTURQUOISE = Object.freeze(Color3.fromCssColorString("#48D1CC"));

/**
 * An immutable Color3 instance initialized to CSS color #C71585
 * <span class="colorSwath" style="background: #C71585;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MEDIUMVIOLETRED = Object.freeze(Color3.fromCssColorString("#C71585"));

/**
 * An immutable Color3 instance initialized to CSS color #191970
 * <span class="colorSwath" style="background: #191970;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MIDNIGHTBLUE = Object.freeze(Color3.fromCssColorString("#191970"));

/**
 * An immutable Color3 instance initialized to CSS color #F5FFFA
 * <span class="colorSwath" style="background: #F5FFFA;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MINTCREAM = Object.freeze(Color3.fromCssColorString("#F5FFFA"));

/**
 * An immutable Color3 instance initialized to CSS color #FFE4E1
 * <span class="colorSwath" style="background: #FFE4E1;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MISTYROSE = Object.freeze(Color3.fromCssColorString("#FFE4E1"));

/**
 * An immutable Color3 instance initialized to CSS color #FFE4B5
 * <span class="colorSwath" style="background: #FFE4B5;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.MOCCASIN = Object.freeze(Color3.fromCssColorString("#FFE4B5"));

/**
 * An immutable Color3 instance initialized to CSS color #FFDEAD
 * <span class="colorSwath" style="background: #FFDEAD;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.NAVAJOWHITE = Object.freeze(Color3.fromCssColorString("#FFDEAD"));

/**
 * An immutable Color3 instance initialized to CSS color #000080
 * <span class="colorSwath" style="background: #000080;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.NAVY = Object.freeze(Color3.fromCssColorString("#000080"));

/**
 * An immutable Color3 instance initialized to CSS color #FDF5E6
 * <span class="colorSwath" style="background: #FDF5E6;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.OLDLACE = Object.freeze(Color3.fromCssColorString("#FDF5E6"));

/**
 * An immutable Color3 instance initialized to CSS color #808000
 * <span class="colorSwath" style="background: #808000;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.OLIVE = Object.freeze(Color3.fromCssColorString("#808000"));

/**
 * An immutable Color3 instance initialized to CSS color #6B8E23
 * <span class="colorSwath" style="background: #6B8E23;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.OLIVEDRAB = Object.freeze(Color3.fromCssColorString("#6B8E23"));

/**
 * An immutable Color3 instance initialized to CSS color #FFA500
 * <span class="colorSwath" style="background: #FFA500;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.ORANGE = Object.freeze(Color3.fromCssColorString("#FFA500"));

/**
 * An immutable Color3 instance initialized to CSS color #FF4500
 * <span class="colorSwath" style="background: #FF4500;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.ORANGERED = Object.freeze(Color3.fromCssColorString("#FF4500"));

/**
 * An immutable Color3 instance initialized to CSS color #DA70D6
 * <span class="colorSwath" style="background: #DA70D6;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.ORCHID = Object.freeze(Color3.fromCssColorString("#DA70D6"));

/**
 * An immutable Color3 instance initialized to CSS color #EEE8AA
 * <span class="colorSwath" style="background: #EEE8AA;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PALEGOLDENROD = Object.freeze(Color3.fromCssColorString("#EEE8AA"));

/**
 * An immutable Color3 instance initialized to CSS color #98FB98
 * <span class="colorSwath" style="background: #98FB98;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PALEGREEN = Object.freeze(Color3.fromCssColorString("#98FB98"));

/**
 * An immutable Color3 instance initialized to CSS color #AFEEEE
 * <span class="colorSwath" style="background: #AFEEEE;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PALETURQUOISE = Object.freeze(Color3.fromCssColorString("#AFEEEE"));

/**
 * An immutable Color3 instance initialized to CSS color #DB7093
 * <span class="colorSwath" style="background: #DB7093;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PALEVIOLETRED = Object.freeze(Color3.fromCssColorString("#DB7093"));

/**
 * An immutable Color3 instance initialized to CSS color #FFEFD5
 * <span class="colorSwath" style="background: #FFEFD5;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PAPAYAWHIP = Object.freeze(Color3.fromCssColorString("#FFEFD5"));

/**
 * An immutable Color3 instance initialized to CSS color #FFDAB9
 * <span class="colorSwath" style="background: #FFDAB9;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PEACHPUFF = Object.freeze(Color3.fromCssColorString("#FFDAB9"));

/**
 * An immutable Color3 instance initialized to CSS color #CD853F
 * <span class="colorSwath" style="background: #CD853F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PERU = Object.freeze(Color3.fromCssColorString("#CD853F"));

/**
 * An immutable Color3 instance initialized to CSS color #FFC0CB
 * <span class="colorSwath" style="background: #FFC0CB;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PINK = Object.freeze(Color3.fromCssColorString("#FFC0CB"));

/**
 * An immutable Color3 instance initialized to CSS color #DDA0DD
 * <span class="colorSwath" style="background: #DDA0DD;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PLUM = Object.freeze(Color3.fromCssColorString("#DDA0DD"));

/**
 * An immutable Color3 instance initialized to CSS color #B0E0E6
 * <span class="colorSwath" style="background: #B0E0E6;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.POWDERBLUE = Object.freeze(Color3.fromCssColorString("#B0E0E6"));

/**
 * An immutable Color3 instance initialized to CSS color #800080
 * <span class="colorSwath" style="background: #800080;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.PURPLE = Object.freeze(Color3.fromCssColorString("#800080"));

/**
 * An immutable Color3 instance initialized to CSS color #FF0000
 * <span class="colorSwath" style="background: #FF0000;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.RED = Object.freeze(Color3.fromCssColorString("#FF0000"));

/**
 * An immutable Color3 instance initialized to CSS color #BC8F8F
 * <span class="colorSwath" style="background: #BC8F8F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.ROSYBROWN = Object.freeze(Color3.fromCssColorString("#BC8F8F"));

/**
 * An immutable Color3 instance initialized to CSS color #4169E1
 * <span class="colorSwath" style="background: #4169E1;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.ROYALBLUE = Object.freeze(Color3.fromCssColorString("#4169E1"));

/**
 * An immutable Color3 instance initialized to CSS color #8B4513
 * <span class="colorSwath" style="background: #8B4513;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SADDLEBROWN = Object.freeze(Color3.fromCssColorString("#8B4513"));

/**
 * An immutable Color3 instance initialized to CSS color #FA8072
 * <span class="colorSwath" style="background: #FA8072;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SALMON = Object.freeze(Color3.fromCssColorString("#FA8072"));

/**
 * An immutable Color3 instance initialized to CSS color #F4A460
 * <span class="colorSwath" style="background: #F4A460;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SANDYBROWN = Object.freeze(Color3.fromCssColorString("#F4A460"));

/**
 * An immutable Color3 instance initialized to CSS color #2E8B57
 * <span class="colorSwath" style="background: #2E8B57;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SEAGREEN = Object.freeze(Color3.fromCssColorString("#2E8B57"));

/**
 * An immutable Color3 instance initialized to CSS color #FFF5EE
 * <span class="colorSwath" style="background: #FFF5EE;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SEASHELL = Object.freeze(Color3.fromCssColorString("#FFF5EE"));

/**
 * An immutable Color3 instance initialized to CSS color #A0522D
 * <span class="colorSwath" style="background: #A0522D;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SIENNA = Object.freeze(Color3.fromCssColorString("#A0522D"));

/**
 * An immutable Color3 instance initialized to CSS color #C0C0C0
 * <span class="colorSwath" style="background: #C0C0C0;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SILVER = Object.freeze(Color3.fromCssColorString("#C0C0C0"));

/**
 * An immutable Color3 instance initialized to CSS color #87CEEB
 * <span class="colorSwath" style="background: #87CEEB;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SKYBLUE = Object.freeze(Color3.fromCssColorString("#87CEEB"));

/**
 * An immutable Color3 instance initialized to CSS color #6A5ACD
 * <span class="colorSwath" style="background: #6A5ACD;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SLATEBLUE = Object.freeze(Color3.fromCssColorString("#6A5ACD"));

/**
 * An immutable Color3 instance initialized to CSS color #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SLATEGRAY = Object.freeze(Color3.fromCssColorString("#708090"));

/**
 * An immutable Color3 instance initialized to CSS color #708090
 * <span class="colorSwath" style="background: #708090;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SLATEGREY = Color3.SLATEGRAY;

/**
 * An immutable Color3 instance initialized to CSS color #FFFAFA
 * <span class="colorSwath" style="background: #FFFAFA;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SNOW = Object.freeze(Color3.fromCssColorString("#FFFAFA"));

/**
 * An immutable Color3 instance initialized to CSS color #00FF7F
 * <span class="colorSwath" style="background: #00FF7F;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.SPRINGGREEN = Object.freeze(Color3.fromCssColorString("#00FF7F"));

/**
 * An immutable Color3 instance initialized to CSS color #4682B4
 * <span class="colorSwath" style="background: #4682B4;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.STEELBLUE = Object.freeze(Color3.fromCssColorString("#4682B4"));

/**
 * An immutable Color3 instance initialized to CSS color #D2B48C
 * <span class="colorSwath" style="background: #D2B48C;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.TAN = Object.freeze(Color3.fromCssColorString("#D2B48C"));

/**
 * An immutable Color3 instance initialized to CSS color #008080
 * <span class="colorSwath" style="background: #008080;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.TEAL = Object.freeze(Color3.fromCssColorString("#008080"));

/**
 * An immutable Color3 instance initialized to CSS color #D8BFD8
 * <span class="colorSwath" style="background: #D8BFD8;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.THISTLE = Object.freeze(Color3.fromCssColorString("#D8BFD8"));

/**
 * An immutable Color3 instance initialized to CSS color #FF6347
 * <span class="colorSwath" style="background: #FF6347;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.TOMATO = Object.freeze(Color3.fromCssColorString("#FF6347"));

/**
 * An immutable Color3 instance initialized to CSS color #40E0D0
 * <span class="colorSwath" style="background: #40E0D0;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.TURQUOISE = Object.freeze(Color3.fromCssColorString("#40E0D0"));

/**
 * An immutable Color3 instance initialized to CSS color #EE82EE
 * <span class="colorSwath" style="background: #EE82EE;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.VIOLET = Object.freeze(Color3.fromCssColorString("#EE82EE"));

/**
 * An immutable Color3 instance initialized to CSS color #F5DEB3
 * <span class="colorSwath" style="background: #F5DEB3;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.WHEAT = Object.freeze(Color3.fromCssColorString("#F5DEB3"));

/**
 * An immutable Color3 instance initialized to CSS color #FFFFFF
 * <span class="colorSwath" style="background: #FFFFFF;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.WHITE = Object.freeze(Color3.fromCssColorString("#FFFFFF"));

/**
 * An immutable Color3 instance initialized to CSS color #F5F5F5
 * <span class="colorSwath" style="background: #F5F5F5;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.WHITESMOKE = Object.freeze(Color3.fromCssColorString("#F5F5F5"));

/**
 * An immutable Color3 instance initialized to CSS color #FFFF00
 * <span class="colorSwath" style="background: #FFFF00;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.YELLOW = Object.freeze(Color3.fromCssColorString("#FFFF00"));

/**
 * An immutable Color3 instance initialized to CSS color #9ACD32
 * <span class="colorSwath" style="background: #9ACD32;"></span>
 *
 * @constant
 * @type {Color3}
 */
Color3.YELLOWGREEN = Object.freeze(Color3.fromCssColorString("#9ACD32"));

export default Color3;