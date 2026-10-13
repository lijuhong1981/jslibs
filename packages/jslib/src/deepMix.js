import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import isObject from "@lijuhong1981/jscheck/src/isObject.js";

/**
 * 深拷贝一个值，处理循环引用
 * @param {any} value 需要拷贝的值
 * @param {WeakMap} cache 记录已拷贝的对象，避免循环引用
 * @returns {any} 深拷贝后的值
 */
function cloneDeep(value, cache) {
    if (!isObject(value))
        return value;
    if (cache.has(value))
        return cache.get(value);
    const result = Array.isArray(value) ? [] : {};
    cache.set(value, result);
    for (const key in value) {
        if (value.hasOwnProperty(key)) {
            result[key] = cloneDeep(value[key], cache);
        }
    }
    return result;
};

/**
 * @param {object} target
 * @param {object} source
 * @param {WeakSet} seen 记录已合并的源对象，避免循环引用
 * @returns {object}
 */
function merge(target, source, seen) {
    if (seen.has(source))
        return target;
    seen.add(source);
    for (const property in source) {
        if (source.hasOwnProperty(property)) {
            const targetValue = target[property];
            const sourceValue = source[property];
            //判断targetValue是否有值
            if (!defined(targetValue)) {
                //targetValue无值时，深拷贝sourceValue后赋值，避免与source共享引用
                target[property] = cloneDeep(sourceValue, new WeakMap());
            } else {
                //targetValue有值时，判断targetValue与sourceValue是否Object类型（排除数组）
                if (isObject(targetValue) && isObject(sourceValue) && !Array.isArray(targetValue) && !Array.isArray(sourceValue)) {
                    //targetValue与sourceValue都是Object类型，合并targetValue与sourceValue
                    merge(targetValue, sourceValue, seen);
                } else if (defined(sourceValue)) {
                    //数组或非对象且sourceValue有值：整体深拷贝覆盖
                    target[property] = cloneDeep(sourceValue, new WeakMap());
                }
            }
        }
    }
    return target;
};

/**
 * 对象深度递归混合
 *
 * 将多个对象深度递归混合为一个对象
 *
 * 与deepAssign混合方式一样，区别是如果后一个对象的某属性值为undefined或null，则不会覆盖掉前一个对象的同属性值
 *
 * @param {object} target 目标对象
 * @param {Array<object>} sources 源对象数组
 * @returns {object} 返回target目标对象
 */
function deepMix(target = {}, ...sources) {
    if (sources.length === 0)
        return target;
    sources.forEach(source => {
        merge(target, source, new WeakSet());
    });
    return target;
};

Object.deepMix = deepMix;

export default deepMix;
export { deepMix };
