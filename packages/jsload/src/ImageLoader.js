import Cache from './Cache.js';
import Loader from './Loader.js';
import loadImage from './loadImage.js';
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
    onImageLoad(options, onLoad, onError) {
        return loadImage(options.url, onLoad, onError);
    }

    /**
     * 加载的子类实现
     * @returns {Image} 返回的Image对象
     */
    onLoad(options, onLoad, onError) {
        const isImageData = options.isImageData = (isDataProtocol(url) || isBlobProtocol(url));

        if (!isImageData)
            options.url = this.mergeUrl(options.url);

        if (this.enableCache) {
            const cached = this.cache.get(options.url);
            if (cached) {
                if (isFunction(onLoad))
                    onLoad(cached);
                if (isFunction(options.onLoad))
                    options.onLoad(cached);

                return cached;
            }
        }

        return this.onImageLoad(options, (image) => {
            if (this.enableCache)
                this.cache.set(options.url, image);
            if (isFunction(onLoad))
                onLoad(image);
            if (isFunction(options.onLoad))
                options.onLoad(image);
        }, (error) => {
            if (isFunction(onError))
                onError(error);
            if (isFunction(options.onError))
                options.onError(error);
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