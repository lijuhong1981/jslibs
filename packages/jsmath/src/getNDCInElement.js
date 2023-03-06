import windowPositionToNDC from "./windowPositionToNDC.js";

/**
 * 根据一个HTMLElement中的像素位置计算NDC坐标(NormalizedDeviceCoordinates)
 * @param {HTMLElement} element HTMLElement对象
 * @param {Object} posInElement 在HTMLElement中的像素坐标，{x: 500, y: 300}
 * @param {Object} result 输出结果对象
 * @returns {Object} 输出结果对象, 如：{x: 0.5, y: -0.5}
 */
function getNDCInElement(element, posInElement, result = {}) {
    return windowPositionToNDC(posInElement, element.clientWidth, element.clientHeight, result);
};

export default getNDCInElement;