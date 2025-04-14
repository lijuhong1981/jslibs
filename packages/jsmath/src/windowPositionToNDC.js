/**
 * 窗口像素坐标转换为NDC坐标(NormalizedDeviceCoordinates)
 * @param {Object} posInWindow 需转换的窗口像素坐标，{x: 500, y: 300}
 * @param {Number} width 窗口像素宽
 * @param {Number} height 窗口像素高
 * @param {Object} result 输出结果对象
 * @returns {Object} 输出结果对象, 如：{x: 0.5, y: -0.5}
 */
function windowPositionToNDC(posInWindow, width, height, result = {}) {

    result.x = (posInWindow.x / width) * 2 - 1;
    result.y = -(posInWindow.y / height) * 2 + 1;

    return result;
};

export default windowPositionToNDC;
export { windowPositionToNDC };