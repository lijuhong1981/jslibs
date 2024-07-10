import Check from "@lijuhong1981/jscheck/src/Check.js";

/**
 * 克隆一个对象
 * @param {object} source 需要克隆的源对象，必填
 * @param {object} config 克隆配置
 * @param {boolean} config.checkOwnProperty 是否执行source.hasOwnProperty(propertyName)检查，默认true
 * @param {boolean} config.deep 是否执行深克隆，默认false
 * @returns {object} 新生成的克隆结果对象
 */
function clone(source, config) {
    Check.typeOf.object('source', source);

    config = Object.assign({
        checkOwnProperty: true,
        deep: false,
    }, config);

    const result = new source.constructor();
    if (typeof source.clone === 'function')
        return source.clone(result);
    for (const propertyName in source) {
        if (config.checkOwnProperty === true && !source.hasOwnProperty(propertyName))
            continue;
        let value = source[propertyName];
        if (value) {
            if (Array.isArray(value)) {
                const newArray = value.slice();
                if (config.deep === true) {
                    for (let i = 0; i < value.length; i++) {
                        newArray[i] = clone(value[i], config);
                    }
                }
                value = newArray;
            } else if (typeof value === 'object' && config.deep === true) {
                value = clone(value, config);
            }
        }
        result[propertyName] = value;
    }

    return result;
};

export default clone;