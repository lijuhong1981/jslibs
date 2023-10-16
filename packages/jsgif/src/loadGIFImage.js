import defer from "@lijuhong1981/jstask/src/defer.js";
import GIFPlayer from "./GIFPlayer.js";

/**
 * 加载APNG图片
 * @param {string} url 图片url
 * @param {object} options 加载配置项
 * @param {object} options.requestOptions 请求配置项，可选项
 * @param {Function} options.onLoad 可选，加载成功回调函数
 * @param {Function} options.onError 可选，加载出错回调函数
 * @param {HTMLCanvasElement} result 输出的Canvas对象，可不填
 * @returns {HTMLCanvasElement} 返回Canvas对象
 */
function loadGIFImage(url, options = {}, result = document.createElement('canvas')) {
    const readyPromise = defer();
    result.readyPromise = readyPromise.promise;

    const player = new GIFPlayer({
        canvas: result,
    });
    player.loadUrl(url, options.requestOptions, function () {
        if (typeof options.onLoad === 'function')
            options.onLoad(result);
        readyPromise.resolve(result);
    }, function (error) {
        if (typeof options.onError === 'function')
            options.onError(error);
        readyPromise.reject(error);
    });
    result.gifPlayer = player;
    return result;
};

export default loadGIFImage;