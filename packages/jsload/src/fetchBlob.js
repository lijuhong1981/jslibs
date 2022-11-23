import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取Blob对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
function fetchBlob(url, requestOptions) {
    return new Promise(function (resolve, reject) {
        fetchResponse(url, requestOptions).then(function (response) {
            return response.blob();
        }).then(function (blob) {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('fetchBlob result is null. '));
            }
        }).catch(function (error) {
            reject(error);
        });
    });
};

export default fetchBlob;