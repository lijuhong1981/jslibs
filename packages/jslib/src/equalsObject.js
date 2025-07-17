import equalsArray from "./equalsArray.js";

function equalsObject(left, right) {
    if (typeof left !== 'object') {
        console.warn('The left value is not Object.', left);
        return false;
    }
    if (typeof right !== 'object') {
        console.warn('The right value is not Object.', right);
        return false;
    }
    if (left === right)
        return true;
    if (typeof left.equals === 'function')
        return left.equals(right);
    for (let key in left) {
        if (left.hasOwnProperty(key) && right.hasOwnProperty(key)) {
            const leftValue = left[key];
            const rightValue = right[key];
            if (Array.isArray(leftValue) && !equalsArray(leftValue, rightValue))
                return false;
            else if (typeof leftValue === 'object' && !equalsObject(leftValue, rightValue))
                return false;
            else if (leftValue !== rightValue)
                return false;
        } else
            return false;
    }
    return true;
};

export default equalsObject;
export { equalsObject };