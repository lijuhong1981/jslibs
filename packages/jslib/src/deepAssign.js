import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import isObject from "@lijuhong1981/jscheck/src/isObject.js";

/**
 * @param {object} target
 * @param {object} source
 * @returns {object}
 */
function merge(target, source) {
    for (const property in source) {
        if (source.hasOwnProperty(property)) {
            const targetValue = target[property];
            const sourceValue = source[property];
            //判断targetValue是否有值
            if (!defined(targetValue)) {
                //targetValue无值时，直接将target[property]赋值为sourceValue
                target[property] = sourceValue;
            } else {
                //targetValue有值时，判断targetValue与sourceValue是否Object类型
                if (isObject(targetValue) && isObject(sourceValue)) {
                    //targetValue与sourceValue都是Object类型，合并targetValue与sourceValue
                    merge(targetValue, sourceValue);
                } else {
                    target[property] = sourceValue;
                }
            }
        }
    }
};

/**
 * 对象深拷贝合并
 * 
 * 因Object.assign()只能执行对象的浅拷贝，所以设计了deepAssign这个方法来执行对象的深拷贝合并
 * 
 * 输入输出与Object.assign保持一致
 * 
 * @param {object} target 目标对象
 * @param {Array<object>} sources 源对象数组
 * @returns {object} 返回target目标对象
 */
function deepAssign(target = {}, ...sources) {
    if (!sources || sources.length === 0)
        return target;
    sources.forEach(source => {
        merge(target, source);
    });
    return target;
};

Object.deepAssign = deepAssign;

export default deepAssign;