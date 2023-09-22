import ImageLoader from "@lijuhong1981/jsload/src/ImageLoader.js";
import GIFPlayer from "./GIFPlayer.js";

class GIFImageLoader extends ImageLoader {
    // constructor(options) {
    //     super(options);
    // }

    onImageLoad(url, isImageData, onLoad, onError) {
        const player = new GIFPlayer();
        player.loadUrl(url, this.requestOptions, function () {
            player.canvas.gifPlayer = player;
            onLoad(player.canvas);
        }, function (error) {
            onError(error);
        });
        return player.canvas;
    }
};

export default GIFImageLoader;