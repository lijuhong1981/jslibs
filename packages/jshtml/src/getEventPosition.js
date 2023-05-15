import definedValue from '@lijuhong1981/jscheck/src/getDefinedValue.js';

/**
 * 计算DOMEvent真实的Position
 * @param {Event} event DOMEvent对象
 * @param {HTMLElement} domElement DOM对象，可不填，不填时使用event.currentTarget或event.target
 * @param {Object} result 计算坐标结果对象，可不填
 * @returns {Object} 返回计算坐标结果对象
 */
function getEventPosition(event, domElement, result = {}) {
    domElement = domElement || event.currentTarget || event.target;
    const bounds = domElement.getBoundingClientRect();
    // pageX / pageY needed for iOS
    result.x = definedValue(event.clientX, event.pageX) - bounds.left;
    result.y = definedValue(event.clientY, event.pageY) - bounds.top;
    return result;
}

export default getEventPosition;