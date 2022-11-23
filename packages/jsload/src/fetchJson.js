import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取Json对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
function fetchJson(url, requestOptions) {
    return new Promise(function (resolve, reject) {
        fetchResponse(url, requestOptions).then(function (response) {
            return response.json();
        }).then(function (json) {
            if (json) {
                resolve(json);
            } else {
                reject(new Error('fetchJson result is null. '));
            }
        }).catch(function (error) {
            reject(error);
        });
    });
};

export default fetchJson;