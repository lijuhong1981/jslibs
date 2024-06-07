import Event from "@lijuhong1981/jsevents/src/EventSubscriber.js";
import Check from "@lijuhong1981/jscheck/src/Check.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";

/**
 * Hash数组
 * 
 * 以键值对{key, value}形式保存元素
 * 
 * 同时会记住键的原始插入顺序
 * 
 * 键Key必须是字符串类型
 * 
 * @template T
 * 
 * @class
*/
class HashArray {
    /**
     * @constructor
     * 
     * @param {Function} onChange change事件回调函数
     */
    constructor(onChange) {
        this._keys = [];
        this._hash = {};
        this.changeEvent = new Event();
        this.onChange = onChange;
    }

    /**
     * 返回键值对元素数量
     * @returns {number}
     */
    get size() {
        return this._keys.length;
    }

    /**
     * 返回键元素数组
     * @returns {Array<string>}
     */
    keys() {
        return this._keys.slice();
    }

    /**
     * 返回值元素数组
     * @returns {Array<T>}
     */
    values() {
        const result = [];
        for (let i = 0, len = this._keys.length; i < len; i++) {
            const key = this._keys[i];
            const value = this._hash[key];
            result.push(value);
        }
        return result;
    }

    /**
     * 返回键值对{key, value}元素数组
     * @returns {Array<{string, T}>}
     */
    entries() {
        const result = [];
        for (let i = 0, len = this._keys.length; i < len; i++) {
            const key = this._keys[i];
            const value = this._hash[key];
            result.push({ key, value });
        }
        return result;
    }

    /**
     * 移除所有的键值对元素
     * @returns {void}
     */
    clear() {
        this._hash = {};
        this._keys.length = 0;
        this._emitEvent({
            type: 'clear',
        });
    }

    /**
     * 设置键值对元素
     * @param {string} key 设置的键，必须是字符串类型
     * @param {T} value 设置的值，任意类型，可以是null、undefined或NaN
     * @param {number} insertAt 插入索引，不填则表示在最后插入，如果key已在数组中存在，则该值不生效
     * @returns {void}
     */
    set(key, value, insertAt) {
        Check.typeOf.string('key', key);

        // 判断键元素是否已存在
        const hasKey = this._keys.indexOf(key) !== -1;
        if (!hasKey) {
            // 判断是否传入了插入索引
            const hasInsertIndex = Number.isSafeInteger(insertAt);
            if (hasInsertIndex) {
                // 检查插入索引是否超出了范围
                Check.typeOf.integer.greaterThanOrEquals('insertAt', insertAt, 0);
                Check.typeOf.integer.lessThan('insertAt', insertAt, this.size);
                // 根据索引插入键元素
                this._keys.splice(insertAt, 0, key);
            } else {
                // 放入键元素
                this._keys.push(key);
            }
        }

        // 设置值元素
        this._hash[key] = value;
        hasKey ? this._emitEvent({
            type: 'replace',
            key, value
        }) : this._emitEvent({
            type: 'add',
            key, value, insertAt
        });

    }

    /**
     * 删除由某个键指定的键值对元素
     * @param {string} key 键
     * @returns {boolean} 返回true表示删除成功，false表示未找到
     */
    delete(key) {
        Check.typeOf.string('key', key);
        const idx = this._keys.indexOf(key);
        if (idx !== -1) {
            this._keys.splice(idx, 1);
            delete this._hash[key];
            this._emitEvent({
                type: 'delete',
                key,
            });
            return true;
        }
        return false;
    }

    /**
     * 根据键获取值
     * @param {string} key
     * @returns {T}
     */
    get(key) {
        Check.typeOf.string('key', key);
        return this._hash[key];
    }

    /**
     * 判断键是否已存在
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        Check.typeOf.string('key', key);
        return this._keys.indexOf(key) !== -1;
    }

    /**
     * 返回键索引
     * @param {string} key
     * @returns {number}
     */
    indexOf(key) {
        Check.typeOf.string('key', key);
        return this._keys.indexOf(key);
    }

    /**
     * 遍历回调方法
     * @callback forEachCallback
     * @param {T} value
     * @param {string} key
    */
    /**
     * 遍历
     * @param {forEachCallback} callback
     * @returns {void}
     * 
     * @example
     * hashArray.forEach(function(value, key) {
     *     console.log(key, value);
     * });
     * 
     */
    forEach(callback) {
        Check.typeOf.func('callback', callback);
        for (let i = 0, len = this._keys.length; i < len; i++) {
            const key = this._keys[i];
            const value = this._hash[key];
            callback(value, key);
        }
    }

    /**
     * @param {object} event
     * @returns {this}
     * 
     * @private
     */
    _emitEvent(event) {
        this.changeEvent.raiseEvent(event);
        isFunction(this.onChange) && this.onChange(event);
        return this;
    }
};

export default HashArray;