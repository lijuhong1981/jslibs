import Cache from './Cache.js';
import loadImage from './loadImage.js';
import Check, { getValidValue } from '@lijuhong1981/jscheck';
import { isDataProtocol, isBlobProtocol, mergeUrl } from '@lijuhong1981/jsurl';

let loader;

class ImageLoader {
    constructor(options = {}) {
        this.cache = options.cache || new Cache();
        this.enabelCache = getValidValue(options.enabelCache, true);
        this.basePath = options.basePath;
    }

    load(url, onLoad, onError) {
        Check.typeOf.string('url', url);

        // return new Promise((resolve, reject) => {
        const isImageData = (isDataProtocol(url) || isBlobProtocol(url));

        if (!isImageData)
            url = mergeUrl(this.basePath, url);

        const cached = this.cache.get(url);
        if (cached) {
            if (onLoad)
                onLoad(cached);

            return cached;
        }

        return loadImage(url, (image) => {
            if (this.enabelCache)
                this.cache.add(url, image);
            if (typeof onLoad === 'function')
                onLoad(image);
        }, (error) => {
            if (typeof onError === 'function')
                onError(error);
        });
    }

    clearCache(destroy) {
        if (this.cache)
            this.cache.clear(destroy)
    }

    static getDefault() {
        if (!loader)
            loader = new ImageLoader();
        return loader;
    }
};

export default ImageLoader;