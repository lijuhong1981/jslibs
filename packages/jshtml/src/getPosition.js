/**
 * 计算DOMEvent真实的Position
 * @param {Event} event DOMEvent对象
 * @param {HTMLElement} domElement DOM对象，可不填，不填时使用event.currentTarget或event.target
 * @param {Object} result 计算坐标结果对象，可不填
 * @returns {Object} 返回计算坐标结果对象
 */
function getPosition(event, domElement, result = {}) {
    domElement = domElement || event.currentTarget || event.target;
    const bounds = domElement.getBoundingClientRect();
    // pageX / pageY needed for iOS
    result.x = event.clientX ?? event.pageX - bounds.left;
    result.y = event.clientY ?? event.pageY - bounds.top;
    return result;
}

export default getPosition;
export { getPosition };