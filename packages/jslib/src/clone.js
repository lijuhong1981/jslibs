/**
 * 克隆一个对象
 * @param {Object} object 需要克隆的对象
 * @param {boolean} deep 是否执行深度拷贝
 * @returns {Object} 新生成的克隆结果对象
 */
function clone(object, deep) {
    if (object === null || typeof object !== "object") {
        return object;
    }

    let result = new object.constructor();
    if (typeof object.clone === 'function')
        return object.clone(result);
    for (let propertyName in object) {
        if (object.hasOwnProperty(propertyName)) {
            let value = object[propertyName];
            if (value && deep && typeof value === 'object') {
                value = clone(value, deep);
            }
            result[propertyName] = value;
        }
    }

    return result;
}

export default clone;