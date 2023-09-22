import Cache from './Cache.js';
import Loader from './Loader.js';
import loadImage from './loadImage.js';
import Check from '@lijuhong1981/jscheck/src/Check.js';
import getValidValue from '@lijuhong1981/jscheck/src/getValidValue.js';
import isFunction from '@lijuhong1981/jscheck/src/isFunction.js';
import isDataProtocol from '@lijuhong1981/jsurl/src/isDataProtocol.js';
import isBlobProtocol from '@lijuhong1981/jsurl/src/isBlobProtocol.js';

const defaultCache = new Cache();

class ImageLoader extends Loader {
    constructor(options = {}) {
        super(options);
        this.enableCache = getValidValue(options.enableCache, true);
        this.cache = options.cache || defaultCache;
    }

    /**
     * 执行图片加载，可由子类重写实现
     */
    onImageLoad(url, isImageData, onLoad, onError) {
        return loadImage(url, onLoad, onError);
    }

    /**
     * 加载图片
     * @param {string} url 加载url
     * @param {Function} onLoad 加载完成通知函数
     * @param {Function} onError 加载失败通知函数
     * @returns {Image} 返回的Image对象
     */
    load(url, onLoad, onError) {
        Check.typeOf.string('url', url);

        const isImageData = (isDataProtocol(url) || isBlobProtocol(url));

        if (!isImageData)
            url = this.mergeUrl(url);

        if (this.enableCache) {
            const cached = this.cache.get(url);
            if (cached) {
                if (isFunction(onLoad))
                    onLoad(cached);

                return cached;
            }
        }

        return this.onImageLoad(url, isImageData, (image) => {
            if (this.enableCache)
                this.cache.set(url, image);
            if (isFunction(onLoad))
                onLoad(image);
        }, (error) => {
            if (isFunction(onError))
                onError(error);
        });
    }

    clearCache(destroy) {
        this.cache.clear(destroy)
    }
};

const defaultLoader = new ImageLoader();

Object.defineProperties(ImageLoader, {
    default: {
        configurable: false,
        get: function () {
            return defaultLoader;
        }
    },
    getDefault: {
        configurable: false,
        writable: false,
        value: function () {
            return defaultLoader;
        }
    },
    defaultCache: {
        configurable: false,
        get: function () {
            return defaultCache;
        }
    },
    getDefaultCache: {
        configurable: false,
        writable: false,
        value: function () {
            return defaultCache;
        }
    },
});

export default ImageLoader;