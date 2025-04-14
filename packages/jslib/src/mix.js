import defined from "@lijuhong1981/jscheck/src/isDefined.js";

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
            } else if (defined(sourceValue)) {
                //sourceValue有值时覆盖掉target[property]
                target[property] = sourceValue;
            }
        }
    }
};

/**
 * 对象混合
 * 
 * 将多个对象混合为一个对象
 * 
 * 与assign混合方式一样，区别是如果后一个对象的某属性值为undefined或null，则不会覆盖掉前一个对象的同属性值
 * 
 * @param {object} target 目标对象
 * @param {Array<object>} sources 源对象数组
 * @returns {object} 返回target目标对象
 */
function mix(target = {}, ...sources) {
    if (!sources || sources.length === 0)
        return target;
    sources.forEach(source => {
        merge(target, source);
    });
    return target;
};

Object.mix = mix;

export default mix;
export { mix };