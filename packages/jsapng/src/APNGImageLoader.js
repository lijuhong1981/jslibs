import ImageLoader from "@lijuhong1981/jsload/src/ImageLoader.js";
import loadAPNGImage from "./loadAPNGImage.js";

class APNGImageLoader extends ImageLoader {

    /**
     * 重写图片加载函数，生成canvas以绘制apng动画
    */
    onLoad(url, options) {
        return loadAPNGImage(url, options);
    }
};

export default APNGImageLoader;
export { APNGImageLoader };