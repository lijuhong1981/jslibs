import fetchResponse from './fetchResponse.js';

/**
 * 封装使用fetch接口获取文本
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise<string>} 异步返回string对象
 */
async function fetchText(url, requestOptions) {
    try {
        const response = await fetchResponse(url, requestOptions);
        return await response.text();
    } catch (error) {
        throw error;
    }
};

export default fetchText;
export { fetchText };