/**
 * 创建Image对象
 * @param {Object} options 配置项
 * @param {String} options.url 图片地址，必填项
 * @param {Function} options.onLoad 图片加载完成回调方法，可不填
 * @param {Function} options.onError 图片加载失败回调方法，可不填
 * @param {String} options.crossOrigin 设置crossOrigin，可不填
 * @param {String} options.id 设置id，可不填
 * @param {Number} options.width 设置width，可不填
 * @param {Number} options.height 设置height，可不填
 * @param {String} options.className 设置className，可不填
 * @param {Function} onLoad 图片加载完成回调方法，可不填，options.onLoad优先
 * @param {Function} onError 图片加载失败回调方法，可不填，options.onError优先
 * @returns {Image}
 */
function createImage(options = {}, onLoad, onError) {
    if (typeof options === 'string')
        options = {
            url: options
        };
    const url = options.url || options.src;
    if (!url) throw new Error('createImage: url is required');

    const image = new Image();
    image.crossOrigin = options.crossOrigin || 'anonymous';
    if (typeof options.width === 'number')
        image.width = options.width;
    if (typeof options.height === 'number')
        image.height = options.height;
    if (typeof options.id === 'string')
        image.id = options.id;
    if (typeof options.className === 'string')
        image.className = options.className;

    onLoad = options.onLoad || onLoad;
    onError = options.onError || onError;

    function onImageLoad() {
        image.removeEventListener('load', onImageLoad, false);
        image.removeEventListener('error', onImageError, false);
        if (typeof onLoad === 'function') onLoad(image);
    }

    function onImageError(event) {
        image.removeEventListener('load', onImageLoad, false);
        image.removeEventListener('error', onImageError, false);
        if (typeof onError === 'function') onError(event);
    }

    if (typeof onLoad === 'function')
        image.addEventListener('load', onImageLoad, false);
    if (typeof onError === 'function')
        image.addEventListener('error', onImageError, false);

    image.src = url;

    // Debug Code
    // image.style.position = 'absolute';
    // image.style.top = '0';
    // image.style.left = '0';
    // image.style.zIndex = '9999999';
    // document.body.appendChild(image);

    return image;
}

export default createImage;
export { createImage };