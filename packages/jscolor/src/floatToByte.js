/**
 * Converts a 'float' color component in the range of 0 to 1.0 into
 * a 'byte' color component in the range of 0 to 255.
 *
 * @param {Number} number The number to be converted.
 * @returns {Number} The converted number.
 */
function floatToByte(number) {
    return number === 1.0 ? 255.0 : (number * 256.0) | 0;
};

export default floatToByte;
export { floatToByte };