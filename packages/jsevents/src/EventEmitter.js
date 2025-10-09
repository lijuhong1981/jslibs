import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import EventDispatcher from "./EventDispatcher.js";

/**
 * 事件发射器
 * 
 * @class EventEmitter
 * @extends Destroyable
*/
class EventEmitter extends Destroyable {
    constructor() {
        super();
        this._dispatcher = new EventDispatcher();
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
    addListener(type, callback, options) {
        this._dispatcher.addEventListener(type, callback, options);
        return this;
    }

    /**
     * @see addListener
    */
    on(type, callback, options) {
        return this.addListener(type, callback, options);
    }

    /**
     * 添加单次事件监听
     * @param {any} type 事件类型
     * @param {Function} callback 回调函数
     * @param {object} scope 回调函数<code>this</code>指针对象，可不填
     * @returns {this}
     * 
     * @see addListener
     */
    once(type, callback, scope) {
        this.addListener(type, callback, {
            once: true,
            scope: scope,
        });
        return this;
    }

    /**
     * 移除事件监听
     * @param {any} type 事件类型
     * @param {Function} callback 回调函数，不填时可移除type下所有的事件监听
     * @returns {this}
     */
    removeListener(type, callback) {
        this._dispatcher.removeEventListener(type, callback);
        return this;
    }

    /**
     * @see removeListener
    */
    off(type, callback) {
        return this.removeListener(type, callback);
    }

    /**
     * 移除所有事件监听
     * @returns {this}
     */
    removeAllListeners() {
        this._dispatcher.removeAllEventListeners();
        return this;
    }

    /**
     * @see removeAllListeners
    */
    offAll() {
        return this.removeAllListeners();
    }

    /**
     * 判断是否已添加某类型的事件监听
     * @param {any} type 事件类型
     * @returns {boolean} 判断结果
     */
    hasListener(type) {
        return this._dispatcher.hasEventListener(type);
    }

    /** 
     * @see hasListener
    */
    has(type) {
        return this.hasListener(type);
    }

    /**
     * 获取某类型的所有事件监听器
     * @param {any} type
     * @returns {Array<Function>}
     */
    getListeners(type) {
        return this._dispatcher.getEventListeners(type);
    }

    /**
     * @see getListeners
    */
    listeners(type) {
        return this.getListeners(type);
    }

    /**
     * 注册的事件数量
     * @returns {number}
     */
    get numberOfEvents() {
        return this._dispatcher.numberOfEvents;
    }

    /**
     * 获取某类型事件监听器数量
     * @param {any} type 事件类型
     * @returns {number} 监听器数量
     */
    numberOfListeners(type) {
        return this._dispatcher.numberOfListeners(type);
    }

    /**
     * 发送事件参数
     * @param {any} type 事件类型
     * @param {...any} ...args 事件参数 
     * @returns {this}
     */
    emit(type, ...args) {
        this._dispatcher.dispatch(type, ...args);
        return this;
    }

    /**
     * 发送事件对象
     * @param {object} event 事件对象
     * @param {object} owner 事件对象所有者，可不填
     * @returns {this}
     */
    emitEvent(event, owner) {
        this._dispatcher.dispatchEvent(event, owner || this);
        return this;
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this._dispatcher.destroy();
    }
};

export default EventEmitter;
export { EventEmitter }