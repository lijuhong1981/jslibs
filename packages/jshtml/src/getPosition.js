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
        result.x = event.clientX;
        result.y = event.clientY;
        return result;
    }
    const bounds = domElement.getBoundingClientRect();
    result.x = event.clientX - bounds.left;
    result.y = event.clientY - bounds.top;
    return result;
}

export default getPosition;
export { getPosition };