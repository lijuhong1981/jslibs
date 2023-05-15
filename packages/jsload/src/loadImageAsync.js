import loadImage from "./loadImage.js";

/**
 * 异步加载图片
 * @param {String} url 图片url
 * @param {Image} result 输出的Image对象，可不填
 * @returns {Promise}
 */
function loadImageAsync(url, result) {
    return new Promise((resolve, reject) => {
        loadImage(url, (image) => {
            resolve(image);
        }, (error) => {
            reject(error);
        }, result);
    });
};

export default loadImageAsync;