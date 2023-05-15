import mergeUrl from '@lijuhong1981/jsurl/src/mergeUrl.js';

/**
 * 定义的一个加载器基类
 * 
 * load函数需由子类继承实现
 * 
 * @constructor
 * @param {Object} options 初始化配置项，可不填
 * @param {String} options.basePath 加载的basePath，可不填
*/
class Loader {
    constructor(options = {}) {
        this.basePath = options.basePath;
    }

    /**
     * 将basePath与传入url合成为真正的请求url
     * @param {String} url 传入的url
     * @returns {String} 合成后的url
     */
    mergeUrl(url) {
        return mergeUrl(this.basePath, url);
    }

    /**
     * 加载资源
     * @param {String} url 加载url
     * @param {Function} onLoad 加载完成通知函数
     * @param {Function} onError 加载失败通知函数
     * @returns {any}
     */
    load(url, onLoad, onError) {
        throw new Error('This function must be overwrite.');
    }

    /**
     * 异步加载，返回Promise
     * @param {String} url 加载url
     * @returns {Promise} 返回的Promise对象
     */
    loadAsync(url) {
        return new Promise((resolve, reject) => {
            try {
                this.load(url, (result) => {
                    resolve(result);
                }, (error) => {
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Loader;