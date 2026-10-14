/**
 * 创建一个 deferred 对象，包含一个 promise 对象，以及 resolve 或 reject 该 promise 的函数。
 * @returns {object} deferred 对象
 * @property {Function} resolve 调用时 resolve 该 promise。
 * @property {Function} reject 调用时 reject 该 promise。
 * @property {Promise} promise Promise 对象。
 * @property {string} state Promise 状态。
 * * "pending" - 初始状态。
 * * "fulfilled" - resolve已调用。
 * * "rejected" - reject已调用。
 * @property {boolean} resolved 若 promise 已 fulfilled 则为 true。
 * @property {boolean} rejected 若 promise 已 rejected 则为 true。
 * @property {Function} then 同 promise.then() 方法。
 * @property {Function} catch 同 promise.catch() 方法。
 * @property {Function} finally 同 promise.finally() 方法。
 */
function defer() {
    let state = 'pending';
    let resolve;
    let reject;
    const promise = new Promise(function (res, rej) {
        resolve = res;
        reject = rej;
    });

    const result = {};
    Object.defineProperties(result, {
        resolve: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: function (...args) {
                state = 'fulfilled';
                resolve(...args);
            },
        },
        reject: {
            enumerable: true,
            configurable: false,
            writable: false,
            value: function (...args) {
                state = 'rejected';
                reject(...args);
            },
        },
        promise: {
            enumerable: true,
            configurable: false,
            get: function () {
                return promise;
            },
        },
        state: {
            enumerable: true,
            configurable: false,
            get: function () {
                return state;
            },
        },
        resolved: {
            enumerable: true,
            configurable: false,
            get: function () {
                return state === 'fulfilled';
            }
        },
        rejected: {
            enumerable: true,
            configurable: false,
            get: function () {
                return state === 'rejected';
            }
        },
        then: {
            enumerable: true,
            configurable: false,
            get: function () {
                return promise.then.bind(promise);
            }
        },
        catch: {
            enumerable: true,
            configurable: false,
            get: function () {
                return promise.catch.bind(promise);
            }
        },
        finally: {
            enumerable: true,
            configurable: false,
            get: function () {
                return promise.finally.bind(promise);
            }
        }
    });

    return result;
}

export default defer;
export { defer };
