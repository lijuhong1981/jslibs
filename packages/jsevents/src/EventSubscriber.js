import Check from "@lijuhong1981/jscheck/src/Check.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";

/**
 * A generic utility class for managing subscribers for a particular event. This class is usually instantiated inside of a container class and exposed as a property for others to subscribe to.
*/
class EventSubscriber extends Destroyable {
    constructor() {
        super();
        this._listenersMap = new Map();
    }

    /**
     * 事件监听器数量
     * @returns {Number}
     */
    get numberOfListeners() {
        return this._listenersMap.size;
    }

    /**
     * 判断事件监听器是否已存在
     * @param {Function} callback 事件监听回调函数
     * @returns {boolean}
     */
    hasEventListener(callback) {
        return this._listenersMap.has(callback);
    }

    /**
     * 添加事件监听
     * @param {Function} callback 回调函数
     * @param {object} options 事件配置项，可不填
     * @param {object} options.scope 回调函数<code>this</code>指针对象，可不填
     * @param {boolean} options.once 是否单次事件，可不填
     * @returns {Function} 移除函数，调用该函数可直接移除事件监听
     */
    addEventListener(callback, options = {}) {
        Check.typeOf.func('callback', callback);

        let listener = this._listenersMap.get(callback);

        if (!listener) {
            listener = {
                callback: callback,
                options: options,
                removeFunc: () => {
                    this.removeEventListener(callback);
                }
            };
            this._listenersMap.set(callback, listener);
        } else {
            listener.options = options;
        }

        return listener.removeFunc;
    }

    /**
     * 移除事件监听
     * @param {Function} callback 回调函数
     * @returns {boolean}
     */
    removeEventListener(callback) {
        Check.typeOf.func('callback', callback);

        return this._listenersMap.delete(callback);
    }

    /**
     * @see addEventListener
    */
    on(callback, options) {
        return this.addEventListener(callback, options);
    }

    /**
     * @see removeEventListener
    */
    off(callback) {
        return this.removeEventListener(callback);
    }

    /**
     * 添加一次事件监听
     * @param {Function} callback 回调函数
     * @param {object} scope 回调函数<code>this</code>指针对象，可不填
     * @returns {Function} 移除函数，调用该函数可直接移除事件监听
     * 
     * @see addEventListener
     */
    once(callback, scope) {
        return this.addEventListener(callback, {
            once: true,
            scope: scope,
        });
    }

    /**
     * 清除所有事件监听
     * @returns {this}
     */
    clear() {
        this._listenersMap.clear();
        return this;
    }

    /**
     * 发送事件
     * @param {...any} ...args 事件参数
     * @returns {this}
     */
    raiseEvent(...args) {
        const listeners = this._listenersMap.values();
        for (const listener of listeners) {
            const options = listener.options;
            const callback = listener.callback;
            callback.apply(options.scope, arguments);
            if (options.once) {
                this._listenersMap.delete(callback);
            }
        }

        return this;
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this.clear();
    }
};

export default EventSubscriber;