import Check from "@lijuhong1981/jscheck/src/Check.js";
import isArray from "@lijuhong1981/jscheck/src/isArray.js";
import isString from "@lijuhong1981/jscheck/src/isString.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import Event from "./EventSubscriber.js";

/**
 * Description
 * @param {Map<any, Event>} events
 * @param {any} type
 * @param {Function} callback
 * @param {object} options 
 * @returns {void}
 */
function addListener(events, type, callback, options) {
    let event = events.get(type);
    if (!event) {
        event = new Event();
        events.set(type, event);
    }
    event.addEventListener(callback, options);
}

/**
 * Description
 * @param {Map<any, Event>} events
 * @param {any} type
 * @param {Function} callback
 * @returns {void}
 */
function removeListener(events, type, callback) {
    const event = events.get(type);
    if (event) {
        if (callback) {
            event.removeEventListener(callback);
        } else {
            events.delete(type);
            event.destroy();
        }
    }
}

/**
 * 事件分发管理器
*/
class EventDispatcher extends Destroyable {
    constructor() {
        super();
        /**
         * @type {Map<any, Event>}
        */
        this._events = new Map();
    }

    /**
     * 添加事件监听
     * @param {any} type 事件类型
     * @param {Function} callback 回调函数
     * @param {object} options 事件配置项，可不填
     * @param {object} options.scope 回调函数<code>this</code>指针对象，可不填
     * @param {boolean} options.once 是否单次事件，可不填
     * @returns {this}
     */
    addEventListener(type, callback, options) {
        Check.valid('type', type);
        Check.typeOf.func('callback', callback);

        if (isString(type) && type.match(/\s+/))
            type = type.split(/\s+/);

        if (isArray(type))
            type.forEach(element => {
                addListener(this._events, element, callback, options);
            });
        else
            addListener(this._events, type, callback, options);

        return this;
    }

    /**
     * 移除事件监听
     * @param {any} type 事件类型
     * @param {Function} callback 回调函数，不填时可移除type下所有的事件监听
     * @returns {this}
     */
    removeEventListener(type, callback) {
        Check.valid('type', type);

        if (isString(type) && type.match(/\s+/))
            type = type.split(/\s+/);

        if (isArray(type))
            type.forEach(element => {
                removeListener(this._events, element, callback);
            });
        else
            removeListener(this._events, type, callback);

        return this;
    }

    /**
     * 移除所有事件监听
     * @returns {this}
     */
    removeAllEventListeners() {
        this._events.forEach(function (event) {
            event.destroy();
        });
        this._events.clear();

        return this;
    }

    /**
     * 注册的事件数量
     * @returns {number}
     */
    get numberOfEvents() {
        return this._events.size;
    }

    /**
     * 获取某类型事件监听器数量
     * @param {any} type 事件类型
     * @returns {number} 监听器数量
     */
    numberOfListeners(type) {
        Check.valid('type', type);

        const event = this._events.get(type);

        return event ? event.numberOfListeners : 0;
    }

    /**
     * 判断是否已添加某类型的事件监听器
     * @param {any} type 事件类型
     * @returns {boolean} 判断结果
     */
    hasEventListener(type) {
        Check.valid('type', type);

        const event = this._events.get(type);

        return event && event.numberOfListeners > 0;
    }

    /**
     * 获取某类型的所有事件监听器
     * @param {any} type
     * @returns {Array<Function>}
     */
    getEventListeners(type) {
        Check.valid('type', type);

        const event = this._events.get(type);
        return event && event.listeners;
    }

    /**
     * 发送事件参数
     * @param {any} type 事件类型
     * @param {...any} ...args 事件参数 
     * @returns {this}
     */
    dispatch(type, ...args) {
        Check.valid('type', type);

        const _event = this._events.get(type);
        if (_event)
            _event.raiseEvent(...args);
        // else {
        //     console.warn('Not found the type`s event.', type);
        // }

        return this;
    }

    /**
     * 发送事件对象
     * @param {object} event 事件对象
     * @param {any} event.type 事件类型，必填项
     * @param {object} owner 事件对象所有者，可不填
     * @returns {this}
     */
    dispatchEvent(event, owner) {
        Check.typeOf.object('event', event);
        Check.valid('event.type', event.type);

        if (!event.owner)
            event.owner = owner || this;

        const _event = this._events.get(event.type);
        if (_event)
            _event.raiseEvent(event);
        // else {
        //     console.warn('Not found the type`s event.', event.type);
        // }

        return this;
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this.removeAllEventListeners();
    }
};

export default EventDispatcher;