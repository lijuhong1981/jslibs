/**
 * 获取对象中某属性的描述
 * @param {Object} object 对象
 * @param {String} propertyName 属性名
 * @returns {Object} 获取到的属性描述结果对象
 */
function getPropertyDescriptor(object, propertyName) {
    let __proto__ = object;
    let descriptor = Object.getOwnPropertyDescriptor(__proto__, propertyName);
    while (!descriptor && __proto__.__proto__) {
        __proto__ = __proto__.__proto__;
        descriptor = Object.getOwnPropertyDescriptor(__proto__, propertyName);
    }
    return descriptor;
}

export default getPropertyDescriptor;
export { getPropertyDescriptor };