import Check from '@lijuhong1981/jscheck/src/Check.js';
import defined from '@lijuhong1981/jscheck/src/isDefined.js';
import definedValue from '@lijuhong1981/jscheck/src/getDefinedValue.js';
import isObject from '@lijuhong1981/jscheck/src/isObject.js';
import Destroyable from '@lijuhong1981/jsdestroy/src/Destroyable.js';
import destroyHTMLElement from '@lijuhong1981/jsdestroy/src/destroyHTMLElement.js';
import destroyObject from '@lijuhong1981/jsdestroy/src/destroyObject.js';

function destroyValue(value) {
    if (value instanceof HTMLElement)
        destroyHTMLElement(value);
    else if (isObject(value))
        destroyObject(value);
};

/**
 * 缓存类，用于存储和管理缓存项
 * @class Cache
*/
class Cache extends Destroyable {
    constructor() {
        super();
        this.map = new Map();
        this.destroyValues = true;
    }
    /**
     * 获取缓存项的值
     * @param {string} key 缓存项的键
     * @return {*} 返回缓存项的值，如果不存在则返回undefined
    */
    get(key) {
        return this.map.get(key);
    }
    /**
     * 检查缓存项是否存在
     * @param {string} key 缓存项的键
     * @return {boolean} 如果缓存项存在则返回true，否则返回false
    */
    has(key) {
        return this.map.has(key);
    }
    /**
     * 设置缓存项
     * @param {string} key 缓存项的键
     * @param {*} value 缓存项的值
     * @param {boolean} [destroyOldValue] 是否销毁旧值，未设置时使用destroyValues属性的值
     * @return {Cache} 返回当前Cache实例
    */
    set(key, value, destroyOldValue) {
        Check.valid('key', key);
        Check.valid('value', value);

        destroyOldValue = definedValue(destroyOldValue, this.destroyValues);
        const oldValue = this.map.get(key);
        if (oldValue === value)
            return;

        if (defined(oldValue)) {
            isObject(oldValue) && delete oldValue.isCached;
            destroyOldValue && destroyValue(oldValue);
        }

        //如果缓存的是对象，设置一个缓存标记isCached
        isObject(value) && (value.isCached = true);
        this.map.set(key, value);

        return this;
    }
    /**
     * 删除缓存项
     * @param {string} key 缓存项的键
     * @param {boolean} [destroy] 是否销毁缓存项的值，未设置时使用destroyValues属性的值
     * @return {Cache} 返回当前Cache实例
    */
    delete(key, destroy) {
        destroy = definedValue(destroy, this.destroyValues);
        const value = this.map.get(key);
        if (defined(value)) {
            isObject(value) && delete value.isCached;
            destroy && destroyValue(value);
        }
        this.map.delete(key);
        return this;
    }
    /**
     * 清空缓存
     * @param {boolean} [destroy] 是否销毁缓存的值，未设置时使用destroyValues属性的值
     * @return {Cache} 返回当前Cache实例
    */
    clear(destroy) {
        destroy = definedValue(destroy, this.destroyValues);
        const values = this.map.values();
        for (const value of values) {
            isObject(value) && delete value.isCached;
            destroy && destroyValue(value);
        }
        this.map.clear();
        return this;
    }
    /**
     * 执行销毁
     * @ignore
     */
    onDestroy() {
        this.clear();
    }
};

export default Cache;
export { Cache };