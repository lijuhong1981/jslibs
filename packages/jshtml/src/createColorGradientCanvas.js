/**
 * 默认的颜色停止点数组
 * @type {Array<{offset: number, color: string}>}
*/
const defaultColorStops = Object.freeze([
    { offset: 0, color: 'rgb(0, 0, 255)' },
    { offset: 0.2, color: 'rgb(0, 255, 255)' },
    { offset: 0.4, color: 'rgb(0, 255, 0)' },
    { offset: 0.6, color: 'rgb(255, 255, 0)' },
    { offset: 0.8, color: 'rgb(255, 0, 0)' },
]);

/**
 * 创建一个颜色渐变的Canvas元素
 * @param {Object} options - 配置对象
 * @param {string} [options.type] - 渐变类型，可选值为 'linear' 或 'radial'，默认'linear'
 * @param {number} [options.width] - 画布宽度，默认256
 * @param {number} [options.height] - 画布高度，type='linear'时默认1，type='radial'时默认256
 * @param {number} [options.startX] - 起始点X坐标，范围0~1，0为左端，1为右端
 * @param {number} [options.startY] - 起始点Y坐标，范围0~1，0为上端，1为下端
 * @param {number} [options.endX] - 终止点X坐标，范围0~1，0为左端，1为右端
 * @param {number} [options.endY] - 终止点Y坐标，范围0~1，0为上端，1为下端
 * @param {number} [options.startR=0] - 起始半径，范围0~2，0为最小半径，2为最大半径（即画布宽高的最大值），type='radial'时有效，默认0
 * @param {number} [options.endR=1] - 终止半径，范围0~2，0为最小半径，2为最大半径（即画布宽高的最大值），type='radial'时有效，默认1
 * @param {Array<{offset: number, color: string}>} [options.colorStops=defaultColorStops] - 颜色停止点数组
 * @returns {HTMLCanvasElement} 创建的Canvas元素
*/
function createColorGradientCanvas(options = {}) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const type = (options.type ?? 'linear').toLowerCase();
    let gradient;
    if (type === 'linear') { //线性渐变
        canvas.width = options.width ?? 256;
        canvas.height = options.height ?? 1;
        const startX = options.startX ?? 0;
        const startY = options.startY ?? 0;
        const endX = options.endX ?? 1;
        const endY = options.endY ?? 0;
        gradient = context.createLinearGradient(startX * canvas.width, startY * canvas.height, endX * canvas.width, endY * canvas.height);
    } else if (type === 'radial') { //径向渐变
        canvas.width = options.width ?? 256;
        canvas.height = options.height ?? 256;
        const startX = options.startX ?? 0.5;
        const startY = options.startY ?? 0.5;
        const startR = options.startR ?? 0;
        const endX = options.endX ?? 0.5;
        const endY = options.endY ?? 0.5;
        const endR = options.endR ?? 1;
        const radius = Math.max(canvas.width, canvas.height) / 2;
        gradient = context.createRadialGradient(startX * canvas.width, startY * canvas.height, startR * radius, endX * canvas.width, endY * canvas.height, endR * radius);
    } else
        throw new Error(`Invalid gradient type: ${type}`);
    const colorStops = options.colorStops ?? defaultColorStops;
    colorStops.forEach(stop => {
        gradient.addColorStop(stop.offset, stop.color);
    });
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    return canvas;
};

export default createColorGradientCanvas;
export { createColorGradientCanvas, defaultColorStops };