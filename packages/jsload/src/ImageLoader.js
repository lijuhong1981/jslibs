import Cache from './Cache.js';
import loadImage from './loadImage.js';
import Check from '@lijuhong1981/jscheck/src/Check.js';
import getValidValue from '@lijuhong1981/jscheck/src/getValidValue.js';
import isDataProtocol from '@lijuhong1981/jsurl/src/isDataProtocol.js';
import isBlobProtocol from '@lijuhong1981/jsurl/src/isBlobProtocol.js';
import mergeUrl from '@lijuhong1981/jsurl/src/mergeUrl.js';

const imageCache = new Cache();

class ImageLoader {
    constructor(options = {}) {
        this.enableCache = getValidValue(options.enableCache, true);
        this.basePath = options.basePath;
    }

    get cache() {
        return imageCache;
    }

    load(url, onLoad, onError) {
        Check.typeOf.string('url', url);

        // return new Promise((resolve, reject) => {
        const isImageData = (isDataProtocol(url) || isBlobProtocol(url));

        if (!isImageData)
            url = mergeUrl(this.basePath, url);

        if (this.enableCache) {
            const cached = this.cache.get(url);
            if (cached) {
                if (onLoad)
                    onLoad(cached);

                return cached;
            }
        }

        return loadImage(url, (image) => {
            if (this.enableCache)
                this.cache.add(url, image);
            if (typeof onLoad === 'function')
                onLoad(image);
        }, (error) => {
            if (typeof onError === 'function')
                onError(error);
        });
    }

    loadPromise(url) {
        return new Promise((resolve, reject) => {
            this.load(url, resolve, reject);
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
});

export default ImageLoader;