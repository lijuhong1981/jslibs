/**
 * 测量文本宽高
 * @param {string} text 测量的文本
 * @param {string} font 文本样式，同CSS font规范
 * @returns {DOMRect}
 */
function measureText(text, font) {
    const span = document.createElement("span");
    document.body.appendChild(span);
    span.style.margin = 0;
    span.style.border = 0;
    span.style.padding = 0;
    if (font)
        span.style.font = font;
    span.textContent = text;
    const rect = span.getBoundingClientRect();
    // console.log("measureText:", rect);
    document.body.removeChild(span);
    return rect;
};

export default measureText;
export { measureText };