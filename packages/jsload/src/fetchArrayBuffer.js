import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取ArrayBuffer对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
function fetchArrayBuffer(url, requestOptions) {
    return new Promise(function (resolve, reject) {
        fetchResponse(url, requestOptions).then(function (response) {
            return response.arrayBuffer();
        }).then(function (arrayBuffer) {
            if (arrayBuffer) {
                resolve(arrayBuffer);
            } else {
                reject(new Error('fetchArrayBuffer result is null. '));
            }
        }).catch(function (error) {
            reject(error);
        });
    });
};

export default fetchArrayBuffer;