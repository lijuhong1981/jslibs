import Check from "@lijuhong1981/jscheck/src/Check.js";

/**
 * 克隆一个对象
 * @param {object} source 需要克隆的源对象，必填
 * @param {boolean} deep 是否执行深克隆，默认false
 * @param {boolean} checkOwnProperty 是否执行source.hasOwnProperty(propertyName)检查，默认true
 * @returns {object} 新生成的克隆结果对象
 */
function clone(source, deep = false, checkOwnProperty = true) {
    Check.typeOf.object('source', source);

    const result = new source.constructor();
    if (typeof source.clone === 'function')
        return source.clone(result);
    for (const propertyName in source) {
        if (checkOwnProperty && !source.hasOwnProperty(propertyName))
            continue;
        let value = source[propertyName];
        if (value && typeof value === 'object' && deep) {
            value = clone(value, deep, checkOwnProperty);
        }
        result[propertyName] = value;
    }

    return result;
};

export default clone;