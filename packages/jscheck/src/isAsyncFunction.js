/**
 * 是否异步函数
 * @param {Function} func
 * @returns {boolean}
 */
function isAsyncFunction(func) {
    return typeof func === 'function' && func.constructor.name === 'AsyncFunction';
}

export default isAsyncFunction;
export { isAsyncFunction };