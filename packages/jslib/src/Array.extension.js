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
 * 移除数组元素
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