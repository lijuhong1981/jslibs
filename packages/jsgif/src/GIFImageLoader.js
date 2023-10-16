import ImageLoader from "@lijuhong1981/jsload/src/ImageLoader.js";
import loadGIFImage from "./loadGIFImage.js";

class GIFImageLoader extends ImageLoader {

    /**
     * 重写图片加载函数，生成canvas以绘制gif动画
    */
    onLoad(url, options) {
        return loadGIFImage(url, options);
    }
};

export default GIFImageLoader;