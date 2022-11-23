
/**
 * Converts a 'byte' color component in the range of 0 to 255 into
 * a 'float' color component in the range of 0 to 1.0.
 *
 * @param {Number} number The number to be converted.
 * @returns {Number} The converted number.
 */
function byteToFloat(number) {
    return number / 255.0;
};

export default byteToFloat;