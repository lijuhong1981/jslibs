/**
 * 异步等待一定时间
 * @param {number} milliseconds 等待时间，单位毫秒
 * @returns {Promise}
 */
function wait(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

export default wait;
export { wait };