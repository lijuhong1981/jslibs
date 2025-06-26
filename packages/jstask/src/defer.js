/**
 * Creates a deferred object, containing a promise object, and functions to resolve or reject the promise.
 * @returns {object} deferred object
 * @property {Function} resolve Resolve the promise when called.
 * @property {Function} reject Reject the promise when called.
 * @property {Promise} promise Promise object.
 * @property {string} state Promise state. 
 * * "pending" - 初始状态。
 * * "fulfilled" - resolve已调用。
 * * "rejected" - reject已调用。
 * @property {boolean} resolved True if promise is fulfilled.
 * @property {boolean} rejected True if promise is rejected.
 * @property {Function} then Same as promise.then() method.
 * @property {Function} catch Same as promise.catch() method.
 * @property {Function} finally Same as promise.finally() method.
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
                return promise.then;
            }
        },
        catch: {
            enumerable: true,
            configurable: false,
            get: function () {
                return promise.catch;
            }
        },
        finally: {
            enumerable: true,
            configurable: false,
            get: function () {
                return promise.finally;
            }
        }
    });

    return result;
}

export default defer;
export { defer };
