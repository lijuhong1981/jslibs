/**
 * ndc坐标(NormalizedDeviceCoordinates)转换为窗口像素坐标
 * @param {Object} ndc 需转换的ndc坐标, {x: 0.5, y: -0.5, z: 0.0}
 * @param {Number} width 窗口像素宽
 * @param {Number} height 窗口像素高
 * @param {Object} result 输出结果对象
 * @param {Boolean} checkInvisible 是否检查不可见，默认true
 * @returns {Object|undefined} 输出结果对象, 如：{x: 123, y: 321}，返回undefined表示不可见
 */
function ndcToWindowPosition(ndc, width, height, result = {}, checkInvisible = true) {

    // invisible
    if (checkInvisible && (ndc.z < 0 || ndc.z > 1))
        return;

    const x = (ndc.x + 1) / 2 * width;
    const y = (1 - ndc.y) / 2 * height;

    result.x = x;
    result.y = y;

    return result;
}

export default ndcToWindowPosition;