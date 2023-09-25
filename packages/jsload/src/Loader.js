import Check from '@lijuhong1981/jscheck/src/Check';
import isFunction from '@lijuhong1981/jscheck/src/isFunction';
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
        this.requestOptions = options.requestOptions;
    }

    /**
     * 将basePath与传入url合成为真正的请求url
     * @param {String} url 传入的url
     * @returns {String} 合成后的url
     */
    mergeUrl(url) {
        return mergeUrl(this.basePath, url);
    }

    onLoad(options, onLoad, onError) {
        throw new Error('This function must be implemented by a subclass.');
    }

    /**
     * 加载资源
     * @param {string|object} options 加载url或加载配置项，必填项
     * @param {string} options.url 加载url，必填项
     * @param {object} options.requestOptions 请求配置项，可选项
     * @param {Function} options.onLoad 加载完成通知函数，可选项
     * @param {Function} options.onError 加载失败通知函数，可选项
     * @param {Function} onLoad 加载完成通知函数，可选项
     * @param {Function} onError 加载失败通知函数，可选项
     * @returns {any} 由子类决定返回对象
     */
    load(options, onLoad, onError) {
        Check.defined('options', options);
        if (typeof options === 'string')
            options = {
                url: options,
            };
        else
            options = Object.assign({}, options);
        Check.defined('options.url', options.url);
        return this.onLoad(options, onLoad, onError);
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