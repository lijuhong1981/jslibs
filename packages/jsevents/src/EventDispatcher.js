import Check from "@lijuhong1981/jscheck/src/Check.js";
import isArray from "@lijuhong1981/jscheck/src/isArray.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import isString from "@lijuhong1981/jscheck/src/isString.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";

function indexOfListener(listeners, callback) {
    for (let i = 0; i < listeners.length; i++) {
        if (listeners[i].callback === callback)
            return i;
    }
    return -1;
}

function hasListener(listeners, callback) {
    return indexOfListener(listeners, callback) !== -1;
}

function addListener(listenersMap, type, callback, options = {}) {
    let listeners = listenersMap.get(type);
    if (!listeners) {
        listeners = [];
        listenersMap.set(type, listeners);
    }
    if (!hasListener(listeners, callback)) {
        listeners.push({
            type: type,
            callback: callback,
            options: options,
        });
    }
}

function removeListener(listenersMap, type, callback) {
    const listeners = listenersMap.get(type);
    if (listeners) {
        if (isFunction(callback)) {
            const index = indexOfListener(listeners, callback);
            if (index !== -1)
                listeners.splice(index, 1);
        } else {
            listeners.length = 0;
            listenersMap.delete(type);
        }
    }
}

/**
 * 事件分发管理器
*/
class EventDispatcher extends Destroyable {
    constructor() {
        super();
        this._listenersMap = new Map();
    }

    /**
     * 添加事件监听
     * @param {String|Object} type 事件类型
     * @param {Function} callback 回调函数
     * @param {Object} options 事件配置项，可不填
     * @param {Object} options.scope 回调函数<code>this</code>指针对象，可不填
     * @param {Boolean} options.once 是否单次事件，可不填
     * @returns {this}
     */
    addEventListener(type, callback, options) {
        Check.valid('type', type);
        Check.typeOf.func('callback', callback);

        if (isString(type) && type.match(/\s+/)) {
            type = type.split(/\s+/);
        }

        if (isArray(type)) {
            type.forEach(element => {
                addListener(this._listenersMap, element, callback, options);
            });
        } else
            addListener(this._listenersMap, type, callback, options);

        return this;
    }

    /**
     * 移除事件监听
     * @param {String|Object} type 事件类型
     * @param {Function} callback 回调函数，不填时可移除type下所有的事件监听
     * @returns {this}
     */
    removeEventListener(type, callback) {
        Check.valid('type', type);

        if (isString(type) && type.match(/\s+/)) {
            type = type.split(/\s+/);
        }

        if (isArray(type)) {
            type.forEach(element => {
                removeListener(this._listenersMap, element, callback);
            });
        } else
            removeListener(this._listenersMap, type, callback);

        return this;
    }

    /**
     * 获取某类型事件监听器数量
     * @param {String|Object} type 事件类型
     * @returns {Number} 监听器数量
     */
    getEventListenersNumber(type) {
        Check.valid('type', type);

        const listeners = this._listenersMap.get(type);

        return listeners ? listeners.length : 0;
    }

    /**
     * 判断是否已添加某类型的事件监听器
     * @param {String|Object} type 事件类型
     * @returns {Boolean} 判断结果
     */
    hasEventListener(type) {
        Check.valid('type', type);

        const listeners = this._listenersMap.get(type);

        return listeners && listeners.length > 0;
    }

    /**
     * 清除所有事件监听
     * @returns {this}
     */
    clear() {
        this._listenersMap.forEach(function (listeners, type) {
            listeners.length = 0;
        });
        this._listenersMap.clear();

        return this;
    }

    /**
     * 发送事件参数
     * @param {String|Object} type 事件类型
     * @param {...any} ...args 事件参数 
     * @returns {this}
     */
    dispatch(type, ...args) {
        Check.valid('type', type);

        const listeners = this._listenersMap.get(type);
        if (listeners && listeners.length > 0) {
            const _listeners = listeners.slice();
            _listeners.forEach(listener => {
                listener.callback.call(listener.options.scope, type, ...args);
                if (listener.options.once) {
                    const index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                }
            });
        }

        return this;
    }

    /**
     * 发送事件对象
     * @param {Object} event 事件对象
     * @param {Object} owner 事件对象所有者，可不填
     * @returns {this}
     */
    dispatchEvent(event, owner) {
        Check.typeOf.object('event', event);
        Check.valid('event.type', event.type);

        event.owner = event.owner || owner || this;

        const listeners = this._listenersMap.get(event.type);
        if (listeners && listeners.length > 0) {
            const _listeners = listeners.slice();
            _listeners.forEach(listener => {
                listener.callback.call(listener.options.scope, event);
                if (listener.options.once) {
                    const index = listeners.indexOf(listener);
                    listeners.splice(index, 1);
                }
            });
        }

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

export default EventDispatcher;