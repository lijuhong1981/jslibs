const _canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');

/**
 * 将Image转换为DataUrl
 * @param {Image|ImageData|HTMLCanvasElement} image 需要转换的Image对象
 * @param {String} mimeType The standard MIME type for the image format to return. If you do not specify this parameter, the default value is a PNG format image.
 * @param {Number} quality 图片质量，取值范围0到1之间
 * @returns {String}
 */
function imageToDataURL(image, mimeType, quality) {
    if (/^data:/i.test(image.src)) {
        return image.src;
    }

    let canvas;

    if (image instanceof HTMLCanvasElement) {
        canvas = image;
    } else {
        _canvas.width = image.width;
        _canvas.height = image.height;

        const context = _canvas.getContext('2d');

        if (image instanceof ImageData) {
            context.putImageData(image, 0, 0);
        } else {
            context.drawImage(image, 0, 0, image.width, image.height);
        }

        canvas = _canvas;
    }

    return canvas.toDataURL(mimeType, quality);
}

export default imageToDataURL;