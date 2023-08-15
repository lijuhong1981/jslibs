import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import isObject from "@lijuhong1981/jscheck/src/isObject.js";

/**
 * 合并两个对象属性并输出给一个新对象
 * @param {object} object1 合并对象1
 * @param {object} object2 合并对象2
 * @param {boolean} recursive 是否递归合并，默认false
 * @param {Array<string>} ignores 合并时需要忽略的属性名称数组，可不填
 * @param {object} result 合并后输出的结果对象，可不填
 * @returns {object} 合并后的结果对象
 */
function merge(object1, object2, recursive = false, ignores = [], result = {}) {
    const object1Defined = defined(object1);
    const object2Defined = defined(object2);

    let property, object1Value, object2Value;
    if (object1Defined) {
        for (property in object1) {
            if (ignores.indexOf(property) !== -1) //过滤掉ignores中包含的property
                continue;
            if (object1.hasOwnProperty(property) &&
                //输出对象已经含有该property了，不需要合并
                !result.hasOwnProperty(property)) {
                object1Value = object1[property];
                // 当recursive为true时，如果object1Value是对象，且object2也有该property，且object2Value也是对象，执行递归合并
                if (recursive && isObject(object1Value) &&
                    object2Defined && object2.hasOwnProperty(property)) {
                    object2Value = object2[property];
                    if (isObject(object2Value)) {
                        result[property] = combine(object1Value, object2Value, recursive, ignores);
                    } else {
                        result[property] = object1Value;
                    }
                } else {
                    result[property] = object1Value;
                }
            }
        }
    }
    if (object2Defined) {
        for (property in object2) {
            if (ignores.indexOf(property) !== -1) //过滤掉ignores中包含的property
                continue;
            if (object2.hasOwnProperty(property) &&
                //输出对象已经含有该property了，不需要合并
                !result.hasOwnProperty(property)) {
                object2Value = object2[property];
                result[property] = object2Value;
            }
        }
    }
    return result;
};

export default merge;