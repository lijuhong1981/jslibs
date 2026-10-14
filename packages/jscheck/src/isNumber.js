function isNumber(value) {
    return typeof value === 'number' && !isNaN(value);
};

export default isNumber;
export { isNumber };