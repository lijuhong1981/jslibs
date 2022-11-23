import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取文本
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
function fetchText(url, requestOptions) {
    return new Promise(function (resolve, reject) {
        fetchResponse(url, requestOptions).then(function (response) {
            return response.text();
        }).then(function (text) {
            if (text) {
                resolve(text);
            } else {
                reject(new Error('fetchText result is null. '));
            }
        }).catch(function (error) {
            reject(error);
        });
    });
};

export default fetchText;