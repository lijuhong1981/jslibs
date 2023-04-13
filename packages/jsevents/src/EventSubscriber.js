import Check from "@lijuhong1981/jscheck/src/Check.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";

/**
 * A generic utility class for managing subscribers for a particular event. This class is usually instantiated inside of a container class and exposed as a property for others to subscribe to.
*/
class EventSubscriber extends Destroyable {
    constructor() {
        super();
        this._listeners = [];
        this._listenersMap = new Map();
    }

    /**
     * 事件监听器数量
     * @returns {Number}
     */
    get numberOfListeners() {
        return this._listeners.length;
    }

    /**
     * 判断事件监听器是否已存在
     * @param {Function} callback 事件监听回调函数
     * @returns {Boolean}
     */
    hasEventListener(callback) {
        return this._listenersMap.has(callback);
    }

    /**
     * 添加事件监听
     * @param {Function} callback 回调函数
     * @param {Object} options 事件配置项，可不填
     * @param {Object} options.scope 回调函数<code>this</code>指针对象，可不填
     * @param {Boolean} options.once 是否单次事件，可不填
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
            this._listeners.push(listener);
            this._listenersMap.set(callback, listener);
        } else {
            listener.options = options;
        }

        return listener.removeFunc;
    }

    /**
     * 移除事件监听
     * @param {Function} callback 回调函数
     * @returns {this}
     */
    removeEventListener(callback) {
        Check.typeOf.func('callback', callback);

        for (let i = 0, length = this._listeners.length; i < length; i++) {
            if (this._listeners[i].callback === callback) {
                this._listeners.splice(i, 1);
                this._listenersMap.delete(callback);
                break;
            }
        }

        return this;
    }

    /**
     * 清除所有事件监听
     * @returns {this}
     */
    clear() {
        this._listeners.length = 0;
        this._listenersMap.clear();
        return this;
    }

    /**
     * 发送事件
     * @param {...any} ...args 事件参数
     * @returns {this}
     */
    raiseEvent(...args) {
        const listeners = this._listeners.slice();
        listeners.forEach(listener => {
            listener.callback.call(listener.options.scope, ...args);
            if (listener.options.once) {
                const index = this._listeners.indexOf(listener);
                this._listeners.splice(index, 1);
            }
        });

        return this;
    }

    /**
     * 销毁
     * @returns {this}
     */
    destroy() {
        this.clear();
        return super.destroy();
    }
};

export default EventSubscriber;