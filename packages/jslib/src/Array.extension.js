/**
 * 是否空数组
 * @returns {boolean}
 */
Array.prototype.isEmpty = function () {
    return this.length === 0;
};

/**
 * 获取数组第一个元素
 * @returns {any}
 */
Array.prototype.firstElement = function () {
    return this[0];
};

/**
 * 获取数组最后一个元素
 * @returns {any}
 */
Array.prototype.lastElement = function () {
    return this[this.length - 1];
};

/**
 * 移除指定的数组元素
 * @param {any} element 需要移除的元素
 * @returns {boolean} 移除结果，元素是否存在并移除
 */
Array.prototype.removeElement = function (element) {
    const index = this.lastIndexOf(element);
    if (index !== -1) {
        this.splice(index, 1);
        return true
    }
    return false;
};

/**
 * 移除指定的数组元素，可传入多个元素
 * @param {any} ...items 需要移除的元素，使用了扩展运算符，可传入多个元素
 * @returns {boolean} 移除结果，元素是否存在并移除
 */
Array.prototype.remove = function (...items) {
    if (items.length === 1) {
        return this.removeElement(items[0]);
    } else if (items.length > 1) {
        const result = new Array(items.length);
        for (let i = 0; i < items.length; i++) {
            result[i] = this.removeElement(items[i]);
        }
        return result;
    }
};

/**
 * 移除指定索引位置的元素
 * @param {number} index 指定索引位置
 * @param {number|undefined} deleteCount 从索引位置开始需要移除的元素数量，默认1
 * @returns {Array}
 */
Array.prototype.removeAt = function (index, deleteCount = 1) {
    return this.splice(index, deleteCount);
};

/**
 * 清空数组
 * @returns {void}
 */
Array.prototype.clear = function () {
    this.length = 0;
};