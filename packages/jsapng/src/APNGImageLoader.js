import ImageLoader from "@lijuhong1981/jsload/src/ImageLoader.js";
import fetchArrayBuffer from "@lijuhong1981/jsload/src/fetchArrayBuffer.js";
import parseAPNG from './apng-js/parser.js';

class APNGImageLoader extends ImageLoader {
    // constructor(options) {
    //     super(options);
    // }

    onImageLoad(url, isImageData, onLoad, onError) {
        const canvas = document.createElement('canvas');
        fetchArrayBuffer(url, this.requestOptions).then(function (buffer) {
            const apng = parseAPNG(buffer);
            canvas.width = apng.width;
            canvas.height = apng.height;
            apng.getPlayer(canvas.getContext('2d')).then(function (player) {
                canvas.apngPlayer = player;
                onLoad(canvas);
            }).catch(function (error) {
                onError(error);
            });
        }).catch(function (error) {
            onError(error);
        });
        return canvas;
    }
};

export default APNGImageLoader;