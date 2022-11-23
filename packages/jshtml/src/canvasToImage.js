/**
 * 将Canvas对象转换为Image对象
 * @param {HTMLCanvasElement} canvas 需要转换的Canvas对象
 * @param {String} mimeType The standard MIME type for the image format to return. If you do not specify this parameter, the default value is a PNG format image.
 * @param {Number} quality 图片质量，取值范围0到1之间
 * @returns {Image}
 */
function canvasToImage(canvas, mimeType, quality) {
    const image = new Image();
    image.src = canvas.toDataURL(mimeType, quality);
    return image;
};

export default canvasToImage;