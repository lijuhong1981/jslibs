/**
 * 封装使用fetch接口获取Response对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 返回Promise对象
 */
function fetchResponse(url, requestOptions) {
    return new Promise(function (resolve, reject) {
        if (typeof url !== 'string') {
            reject(new Error('fetch url ' + url + ' is illegal. '));
            return;
        }
        fetch(url, requestOptions).then(function (response) {
            if (response.ok)
                resolve(response);
            else
                reject(new Error('fetch url ' + url + ' failed, status=' + response.status + ' ;statusText=' + response.statusText));
        }).catch(function (error) {
            reject(error);
        });
    });
};

export default fetchResponse;