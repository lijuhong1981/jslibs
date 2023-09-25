import ImageLoader from "@lijuhong1981/jsload/src/ImageLoader.js";
import GIFPlayer from "./GIFPlayer.js";

class GIFImageLoader extends ImageLoader {
    // constructor(options) {
    //     super(options);
    // }

    /**
     * 重写图片加载函数，生成canvas以绘制gif动画
    */
    onImageLoad(options, onLoad, onError) {
        const player = new GIFPlayer();
        player.loadUrl(options.url, options.requestOptions, function () {
            onLoad(player.canvas);
        }, function (error) {
            onError(error);
        });
        player.canvas.gifPlayer = player;
        return player.canvas;
    }
};

export default GIFImageLoader;