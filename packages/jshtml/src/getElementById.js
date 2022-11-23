/**
 * 查找传入的HTMLElement对象下对应传入id值的子对象
 * @param {HTMLElement} element 需要查找的HTMLElement对象
 * @param {String} id 对应的id
 * @returns {HTMLElement} 找到的HTMLElement结果对象
 */
function getElementById(element, id) {
    if (element.id === id)
        return element;
    const childNodes = element.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
        const child = childNodes[i];
        const result = getElementById(child, id);
        if (result)
            return result;
    }
};

export default getElementById;