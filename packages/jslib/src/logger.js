/**
 * 一个简单的日志记录类，封装了控制台方法。它允许您全局启用或禁用日志记录。
*/
class Logger {
    /**
     * 创建一个Logger实例。
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
     * 输出debug级别的日志信息。
    */
    debug(...msg) {
        this.enabled && console.debug(...msg);
    }
    /**
     * 输出error级别的日志信息。
    */
    error(...msg) {
        this.enabled && console.error(...msg);
    }
    /**
     * 输出info级别的日志信息。
    */
    info(...msg) {
        this.enabled && console.info(...msg);
    }
    /**
     * 输出log级别的日志信息。
    */
    log(...msg) {
        this.enabled && console.log(...msg);
    }
    /**
     * 输出warn级别的日志信息。
    */
    warn(...msg) {
        this.enabled && console.warn(...msg);
    }
};

export default Logger;
export { Logger };