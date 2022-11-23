import isNumber from "./isNumber.js";

function isValid(value) {
    if (value === undefined || value === null || (isNumber(value) && isNaN(value)))
        return false;
    return true;
}

export default isValid;