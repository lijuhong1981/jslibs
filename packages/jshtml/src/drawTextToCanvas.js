
import definedValue from "@lijuhong1981/jscheck/src/getDefinedValue.js";
import measureText from "./measureText.js";

/**
 * 绘制文本至画布
 * @param {Object} options 绘制文本配置项
 * @param {HTMLCanvasElement} canvas 画布对象，不填则自动创建
 * @returns {HTMLCanvasElement} 绘制后的画布对象
 * 
 * @example
 *  const options = {
 *      text: '文本内容', //文本内容，必填项
 *      font: '30px sans-serif', //字体样式，与CSS font规范相同，不填默认浏览器设置
 *      textAlign: 'start', //文字水平方向的对齐方式，可选值有start, end, left, right, center等，不填默认start
 *      textBaseline: 'alphabetic', //文字垂直方向的对齐方式，可选值有top, hanging, middle, alphabetic, ideographic, bottom等，不填默认alphabetic
 *      direction: 'inherit', //文本方向，可选值有ltr, rtl, inherit等，不填默认inherit
 *      fill: true, //是否填充，不填默认true
 *      fillColor: '#000000', //填充颜色，与Css color规范相同，不填默认'#000000'
 *      outline: false, //是否显示轮廓线，与Css color规范相同，不填默认false
 *      outlineColor: '#ff0000', //轮廓先颜色，不填默认'#ff0000'
 *      outlineWidth: 1, //轮廓线宽度，不填默认1
 *      x: 0, //文本起始点x轴坐标，不填默认0
 *      y: 0, //文本其实点y轴坐标，不填默认0
 *  };
 */
function drawTextToCanvas(options, canvas) {
    if (!options || !options.text)
        return;
    const text = options.text;

    let x, y, textAlign, textBaseline;
    if (!canvas) {
        canvas = document.createElement('canvas');

        const rect = measureText(text, options.font);
        const width = Math.ceil(rect.width);
        const height = Math.ceil(rect.height);
        canvas.width = width;
        canvas.height = height;

        x = width / 2;
        y = height / 2;
        textAlign = definedValue(options.textAlign, 'center');
        textBaseline = definedValue(options.textBaseline, 'middle');
    } else {
        x = definedValue(options.x, 0);
        y = definedValue(options.y, 0);
        textAlign = definedValue(options.textAlign, 'start');
        textBaseline = definedValue(options.textBaseline, 'alphabetic');
    }

    const context = canvas.getContext('2d');
    if (options.font)
        context.font = options.font;
    context.textAlign = textAlign;
    context.textBaseline = textBaseline;

    const fill = definedValue(options.fill, true);
    const outline = definedValue(options.outline, false);
    const maxWidth = options.maxWidth;
    if (fill) {
        context.fillStyle = definedValue(options.fillColor, '#000000');
        context.fillText(text, x, y, maxWidth);
    }
    if (outline) {
        context.strokeStyle = definedValue(options.outlineColor, '#ff0000');
        context.lineWidth = definedValue(options.outlineWidth, 1);
        context.strokeText(text, x, y, maxWidth);
    }

    return canvas;
};

export default drawTextToCanvas;