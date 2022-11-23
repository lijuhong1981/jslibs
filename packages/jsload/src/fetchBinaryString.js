import fetchResponse from './fetchResponse.js';
import arrayBufferToBinaryString from './arrayBufferToBinaryString.js';

/**
 * 封装使用fetch接口获取二进制字符串
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
function fetchBinaryString(url, requestOptions) {
    return new Promise(function (resolve, reject) {
        fetchResponse(url, requestOptions).then(function (response) {
            return response.arrayBuffer();
        }).then(function (arrayBuffer) {
            if (arrayBuffer) {
                const result = arrayBufferToBinaryString(arrayBuffer);
                resolve(result);
            } else {
                reject(new Error('fetchBinaryString result is null. '));
            }
        }).catch(function (error) {
            reject(error);
        });
    });
};

export default fetchBinaryString;