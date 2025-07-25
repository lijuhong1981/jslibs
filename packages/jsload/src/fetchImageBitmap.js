import fetchBlob from './fetchBlob.js';

/**
 * 封装使用fetch接口获取ImageBitmap对象
 * @param {String} url 请求url
 * @param {RequestInit} requestOptions 请求参数
 * @param {ImageBitmapOptions} imageBitmapOptions imageBitmap参数
 * @returns {Promise<ImageBitmap>} 异步返回ImageBitmap对象
 */
async function fetchImageBitmap(url, requestOptions, imageBitmapOptions) {
    try {
        const blob = await fetchBlob(url, requestOptions);
        const imageBitmap = await createImageBitmap(blob, imageBitmapOptions);
        return imageBitmap;
    } catch (error) {
        throw error;
    }
};

export default fetchImageBitmap;
export { fetchImageBitmap };