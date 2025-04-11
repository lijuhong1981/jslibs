import fetchArrayBuffer from "@lijuhong1981/jsload/src/fetchArrayBuffer.js";
import defer from "@lijuhong1981/jstask/src/defer.js";
import parseAPNG from './apng-js/parser.js';

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
function loadAPNGImage(url, options = {}, result = document.createElement('canvas')) {
    const readyPromise = defer();
    result.readyPromise = readyPromise.promise;

    fetchArrayBuffer(url, options.requestOptions).then(function (buffer) {
        const apng = parseAPNG(buffer);
        result.width = apng.width;
        result.height = apng.height;
        apng.getPlayer(result.getContext('2d')).then(function (player) {
            result.apngPlayer = player;
            if (typeof options.onLoad === 'function')
                options.onLoad(result);
            readyPromise.resolve(result);
        }).catch(function (error) {
            if (typeof options.onError === 'function')
                options.onError(error);
            readyPromise.reject(error);
        });
    }).catch(function (error) {
        if (typeof options.onError === 'function')
            options.onError(error);
        readyPromise.reject(error);
    });
    return result;
};

export default loadAPNGImage;