/**
 * 一个简单的日志记录类，封装了控制台方法。它允许您全局启用或禁用日志记录。
*/
class Log {
    /**
     * 创建一个Log实例。
     * @param {boolean} [enabled=true] - 是否启用日志记录，默认为true。
     * @constructor
    */
    constructor(enabled = true) {
        /**
         * 日志记录是否启用，设置为false将禁用所有日志输出。
         * @type {boolean}
         * @default true
        */
        this.enabled = enabled;
    }
    /**
     * 启用日志记录，使所有日志输出生效。
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    enable() {
        this.enabled = true;
        return this;
    }
    /**
     * 禁用日志记录，所有日志输出将被忽略。
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    disable() {
        this.enabled = false;
        return this;
    }
    /**
     * 输出debug级别的日志信息。
     * @param {...*} msg
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    debug(...msg) {
        return this._log('debug', ...msg);
    }
    /**
     * 输出error级别的日志信息。
     * @param {...*} msg
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    error(...msg) {
        return this._log('error', ...msg);
    }
    /**
     * 输出info级别的日志信息。
     * @param {...*} msg
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    info(...msg) {
        return this._log('info', ...msg);
    }
    /**
     * 输出log级别的日志信息。
     * @param {...*} msg
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    log(...msg) {
        return this._log('log', ...msg);
    }
    /**
     * 输出warn级别的日志信息。
     * @param {...*} msg
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    warn(...msg) {
        return this._log('warn', ...msg);
    }
    /**
     * 启动一个计时器，用于计算操作的持续时间。
     * @param {string} label - 计时器标签。
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    time(label) {
        return this._log('time', label);
    }
    /**
     * 结束指定标签的计时器，并输出耗时。
     * @param {string} label - 计时器标签。
     * @returns {Log} 当前Log实例，支持链式调用。
    */
    timeEnd(label) {
        return this._log('timeEnd', label);
    }
    /**
     * 输出日志的内部实现：仅在启用时调用指定的控制台方法。
     * @param {string} method 控制台方法名
     * @param {...*} args 日志参数
     * @returns {Log} 当前Log实例，支持链式调用。
     * @private
    */
    _log(method, ...args) {
        this.enabled && console[method](...args);
        return this;
    }
};

export default Log;
export { Log };
