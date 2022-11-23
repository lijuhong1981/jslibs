import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取ImageBitmap对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @param {ImageBitmapOptions} imageBitmapOptions imageBitmap参数
 * @returns {Promise} 返回Promise对象
 */
function fetchImageBitmap(url, requestOptions, imageBitmapOptions) {
    return new Promise(function (resole, reject) {
        fetchResponse(url, requestOptions).then(function (response) {
            return response.blob();
        }).then(function (blob) {
            createImageBitmap(blob, imageBitmapOptions).then(function (imageBitmap) {
                resole(imageBitmap);
            }).catch(function (error) {
                reject(error);
            });
        }).catch(function (error) {
            reject(error);
        });
    });
};

export default fetchImageBitmap;