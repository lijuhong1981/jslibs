import arrayBufferToBinaryString from "./arrayBufferToBinaryString.js";

/**
 * 将一个ArrayBuffer类型数组异步转换为二进制字符串
 * @param {ArrayBuffer} arrayBuffer 需要转换的arrayBuffer
 * @returns {Promise<string>} 异步返回转换后的二进制字符串
 */
function arrayBufferToBinaryStringAsync(arrayBuffer) {
    return new Promise(function (resolve, reject) {
        try {
            const result = arrayBufferToBinaryString(arrayBuffer);
            resolve(result);
        } catch (error) {
            reject(error);
        }
    });
};

export default arrayBufferToBinaryStringAsync;
export { arrayBufferToBinaryStringAsync };