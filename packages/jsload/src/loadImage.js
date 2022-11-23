/**
 * 加载图片
 * @param {String} url 图片url
 * @param {Function} onLoad 加载完成回调
 * @param {Function} onError 加载出错回调
 * @param {Image} result 输出的Image对象，可不填
 * @returns {Image} 返回Image对象
 */
function loadImage(url, onLoad, onError, result = new Image()) {

    result.onload = () => {
        result.onload = undefined;
        result.onerror = undefined;

        if (typeof onLoad === 'function')
            onLoad(result);
    }

    result.onerror = (error) => {
        result.onload = undefined;
        result.onerror = undefined;

        if (typeof onError === 'function')
            onError(error);
    }

    result.crossOrigin = 'anonymous';
    result.src = url;

    return result;
};

export default loadImage;