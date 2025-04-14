
import measureText from "./measureText.js";

/**
 * 绘制文本至画布
 * @param {Object} options 绘制文本配置项
 * @param {HTMLCanvasElement} canvas 画布对象，不填则自动创建
 * @returns {HTMLCanvasElement} 绘制后的画布对象
 * 
 * @example
 *  //文本配置项
 *  const options = {
 *      text: '文本内容', //文本内容，必填项
 *      font: '30px sans-serif', //字体样式，与CSS font规范相同，不填默认浏览器设置
 *      textAlign: 'start', //文字水平方向的对齐方式，可选值有start, end, left, right, center等，不填默认start
 *      textBaseline: 'alphabetic', //文字垂直方向的对齐方式，可选值有top, hanging, middle, alphabetic, ideographic, bottom等，不填默认alphabetic
 *      direction: 'inherit', //文本方向，可选值有ltr, rtl, inherit等，不填默认inherit
 *      fill: true, //是否填充，不填默认true
 *      fillColor: '#ffffff', //填充颜色，与Css color规范相同，不填默认'#ffffff'
 *      outline: false, //是否显示轮廓线，不填默认false
 *      outlineColor: '#ff0000', //轮廓线颜色，与Css color规范相同，不填默认'#ff0000'
 *      outlineWidth: 1, //轮廓线宽度，不填默认1
 *      background: false, //是否显示背景，不填默认false
 *      backgroundColor: 'rgba(0, 0, 0, 0.7)', //背景颜色，与Css color规范相同，不填默认'rgba(0, 0, 0, 0.7)'
 *      backgroundPaddingX: 5, //背景x方向padding，不填默认5
 *      backgroundPaddingY: 2, //背景x方向padding，不填默认2
 *      x: 0, //文本起始点x轴坐标，不填默认0
 *      y: 0, //文本其实点y轴坐标，不填默认0
 *      scaleRadio: 1, //canvas缩放倍率，不填默认1
 *  };
 * const canvas = drawTextToCanvas(options);
 */
function drawTextToCanvas(options = {}, canvas) {
    if (!options.text) throw new Error('options.text is required');
    const text = options.text;

    let x, y, textAlign, textBaseline;
    const scaleRadio = options.scaleRadio ?? 1;
    const background = options.background ?? false;
    let backgroundColor, backgroundPaddingX = 0, backgroundPaddingY = 0;
    if (background) {
        backgroundColor = options.backgroundColor ?? 'rgba(0, 0, 0, 0.7)';
        backgroundPaddingX = options.backgroundPaddingX ?? 5;
        backgroundPaddingY = options.backgroundPaddingY ?? 2;
    }
    if (!canvas) {
        canvas = document.createElement('canvas');

        const rect = measureText(text, options.font);
        const width = (Math.ceil(rect.width) + backgroundPaddingX * 2) * scaleRadio;
        const height = (Math.ceil(rect.height) + backgroundPaddingY * 2) * scaleRadio;
        canvas.width = width;
        canvas.height = height;

        x = width / 2;
        y = height / 2;
        textAlign = options.textAlign ?? 'center';
        textBaseline = options.textBaseline ?? 'middle';
    } else {
        x = options.x ?? 0 * scaleRadio;
        y = options.y ?? 0 * scaleRadio;
        textAlign = options.textAlign ?? 'start';
        textBaseline = options.textBaseline ?? 'alphabetic';
    }

    const context = canvas.getContext('2d');
    context.scale(scaleRadio, scaleRadio);

    if (background) {
        context.fillStyle = backgroundColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (options.font)
        context.font = options.font;
    context.textAlign = textAlign;
    context.textBaseline = textBaseline;

    const fill = options.fill ?? true;
    const outline = options.outline ?? false;
    const maxWidth = options.maxWidth;
    if (fill) {
        context.fillStyle = options.fillColor ?? '#ffffff';
        context.fillText(text, x, y, maxWidth);
    }
    if (outline) {
        context.strokeStyle = options.outlineColor ?? '#ff0000';
        context.lineWidth = options.outlineWidth ?? 1;
        context.strokeText(text, x, y, maxWidth);
    }

    return canvas;
};

export default drawTextToCanvas;
export { drawTextToCanvas };