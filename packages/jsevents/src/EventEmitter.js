import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import EventDispatcher from "./EventDispatcher.js";

class EventEmitter extends Destroyable {
    constructor() {
        super();
        this._dispatcher = new EventDispatcher();
    }

    /**
     * 添加事件监听
     * @param {String|Object} type 事件类型
     * @param {Function} callback 回调函数
     * @returns {this}
     */
    on(type, callback) {
        this._dispatcher.addEventListener(type, callback);
        return this;
    }

    /**
     * 添加单次事件监听
     * @param {String|Object} type 事件类型
     * @param {Function} callback 事件回调函数
     * @returns {this}
     */
    once(type, callback) {
        this._dispatcher.addEventListener(type, callback, {
            once: true
        });
        return this;
    }

    /**
     * 移除事件监听
     * @param {String|Object} type 事件类型
     * @param {Function} callback 回调函数，不填时可移除type下所有的事件监听
     * @returns {this}
     */
    off(type, callback) {
        this._dispatcher.removeEventListener(type, callback);
        return this;
    }

    /**
     * 判断是否已添加某类型的事件监听
     * @param {String|Object} type 事件类型
     * @returns {Boolean} 判断结果
     */
    hasListener(type) {
        return this._dispatcher.hasEventListener(type);
    }

    /**
     * 获取某类型事件监听器数量
     * @param {String|Object} type 事件类型
     * @returns {Number} 监听器数量
     */
    listenersCount(type) {
        return this._dispatcher.getEventListenersCount(type);
    }

    /**
     * 清除所有事件监听
     * @returns {this}
     */
    clear() {
        this._dispatcher.clear();
        return this;
    }

    /**
     * 发送事件参数
     * @param {String|Object} type 事件类型
     * @param {...any} ...args 事件参数 
     * @returns {this}
     */
    emit(type, ...args) {
        this._dispatcher.dispatch(type, ...args);
        return this;
    }

    /**
     * 发送事件对象
     * @param {Object} event 事件对象
     * @param {Object} owner 事件对象所有者，可不填
     * @returns {this}
     */
    emitEvent(event, owner) {
        this._dispatcher.dispatchEvent(event, owner);
        return this;
    }

    /**
     * 销毁
     * @returns {this}
     */
    destroy() {
        this._dispatcher.destroy();
        return super.destroy();
    }
};

export default EventEmitter;