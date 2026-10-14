import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取Json对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise} 异步返回Json对象
 */
async function fetchJson(url, requestOptions) {
    try {
        const response = await fetchResponse(url, requestOptions);
        return await response.json();
    } catch (error) {
        throw error;
    }
};

export default fetchJson;
export { fetchJson };