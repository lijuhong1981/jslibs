import fetchArrayBuffer from './fetchArrayBuffer.js';
import arrayBufferToBinaryString from './arrayBufferToBinaryString.js';

/**
 * 封装使用fetch接口获取二进制字符串
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @returns {Promise<string>} 异步返回string对象
 */
async function fetchBinaryString(url, requestOptions) {
    try {
        const arrayBuffer = await fetchArrayBuffer(url, requestOptions);
        const result = arrayBufferToBinaryString(arrayBuffer);
        return result;
    } catch (error) {
        throw error;
    }
};

export default fetchBinaryString;
export { fetchBinaryString };