import Check from "@lijuhong1981/jscheck/src/Check.js";
import cloneObject from "./cloneObject.js";

/**
 * 克隆一个数组
 * @param {Array} source 需要克隆的源数组，必填
 * @param {object} config 克隆配置
 * @param {boolean} config.checkOwnProperty 是否执行source.hasOwnProperty(propertyName)检查，默认true
 * @param {boolean} config.deep 是否执行深克隆，默认false
 * @returns {Array} 新生成的克隆结果数组
 */
function cloneArray(source, config) {
    Check.typeOf.array('source', source);

    config = Object.assign({
        checkOwnProperty: true,
        deep: false,
    }, config);

    const result = source.slice();
    if (config.deep === true) {
        for (let i = 0; i < source.length; i++) {
            const value = source[i];
            if (Array.isArray(value))
                result[i] = cloneArray(value, config);
            else if (typeof value === 'object' && value)
                result[i] = cloneObject(value, config);
            else
                result[i] = value;
        }
    }
    return result;
};

export default cloneArray;
export { cloneArray };
