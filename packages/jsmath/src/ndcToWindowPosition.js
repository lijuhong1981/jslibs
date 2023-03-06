import Check from '@lijuhong1981/jscheck/src/Check.js';
import isValid from '@lijuhong1981/jscheck/src/isValid.js';

/**
 * ndc坐标(NormalizedDeviceCoordinates)转换为窗口像素坐标
 * @param {Object} ndc 需转换的ndc坐标, {x: 0.5, y: -0.5, z: 0.0}
 * @param {Number} width 窗口像素宽
 * @param {Number} height 窗口像素高
 * @param {Object} result 输出结果对象
 * @returns {Object} 输出结果对象, 如：{x: 123, y: 321}
 */
function ndcToWindowPosition(ndc, width, height, result = {}) {
    Check.typeOf.object('ndc', ndc);
    Check.typeOf.number('width', width);
    Check.typeOf.number('height', height);

    // invisible
    if (isValid(ndc.z) && (ndc.z < 0 || ndc.z > 1))
        return;

    const x = (ndc.x + 1) / 2 * width;
    const y = (1 - ndc.y) / 2 * height;

    result.x = x;
    result.y = y;

    return result;
}

export default ndcToWindowPosition;