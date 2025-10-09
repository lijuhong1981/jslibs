/**
 * 计算DOMEvent真实的Position
 * @param {MouseEvent} event DOMEvent对象
 * @param {HTMLElement} domElement DOM对象，可不填，不填时使用event.currentTarget或event.target
 * @param {object} result 计算坐标结果对象，可不填
 * @returns {{x:number, y:number}} 返回计算坐标结果对象
 */
function getPosition(event, domElement, result = {}) {
    domElement = domElement || event.target || event.currentTarget;
    if (domElement === document) {
        // pageX / pageY needed for iOS
        result.x = event.clientX ?? event.pageX;
        result.y = event.clientY ?? event.pageY;
        return result;
    }
    const bounds = domElement.getBoundingClientRect();
    // pageX / pageY needed for iOS
    result.x = event.clientX ?? event.pageX - bounds.left;
    result.y = event.clientY ?? event.pageY - bounds.top;
    return result;
}

export default getPosition;
export { getPosition };