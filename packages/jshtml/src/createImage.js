import Check from '@lijuhong1981/jscheck/src/Check.js';
import isValid from "@lijuhong1981/jscheck/src/isValid.js";

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
    Check.typeOf.string('url', url);

    const image = new Image();
    image.crossOrigin = options.crossOrigin || 'anonymous';
    if (isValid(options.width))
        image.width = options.width;
    if (isValid(options.height))
        image.height = options.height;
    if (isValid(options.id))
        image.id = options.id;
    if (isValid(options.className))
        image.className = options.className;

    onLoad = options.onLoad || onLoad;
    onError = options.onError || onError;

    function onImageLoad() {
        image.removeEventListener('load', onImageLoad, false);
        image.removeEventListener('error', onImageError, false);
        if (onLoad) onLoad(image);
    }

    function onImageError(event) {
        image.removeEventListener('load', onImageLoad, false);
        image.removeEventListener('error', onImageError, false);
        if (onError) onError(event);
    }

    if (onLoad)
        image.addEventListener('load', onImageLoad, false);
    if (onError)
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