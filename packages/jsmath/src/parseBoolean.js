/**
 * 
 * @param {Boolean|String} value
 * @returns {Boolean}
 */
function parseBoolean(value) {
    return value === true || value === 'true';
};

export default parseBoolean;