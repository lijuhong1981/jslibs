function destroyHTMLElementImpl(element, recursivelyChildren) {
    if (recursivelyChildren) {
        while (element.lastChild) {
            destroyHTMLElementImpl(element.lastChild, recursivelyChildren);
        }
    }
    if (element.parentNode)
        element.parentNode.removeChild(element);
    if (element instanceof HTMLVideoElement) {
        if (element.hlsPlayer) {
            element.hlsPlayer.destroy();
            delete element.hlsPlayer;
        }
        if (element.flvPlayer) {
            try {
                element.flvPlayer.unload();
                element.flvPlayer.detachMediaElement();
            } catch (error) {
                console.error(error);
            }
            element.flvPlayer.destroy();
            delete element.flvPlayer;
        }
        try {
            element.pause();
            element.loop = false;
            element.removeAttribute('src');
            element.load();
        } catch (error) {
            console.error(error);
        }
    } else if (element instanceof HTMLImageElement) {
        //指向一张空白图片以释放之前的图片
        element.src = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
    } else if (element instanceof HTMLCanvasElement) {
        if (element.apngPlayer) {
            element.apngPlayer.stop();
            delete element.apngPlayer;
        }
        //修改canvas尺寸为0可以释放之前的绘制结果
        element.width = element.height = 0;
    }
}

/**
 * 销毁HTMLElement对象
 * @param {HTMLElement} element HTMLElement对象
 * @param {Boolean} recursivelyChildren 是否递归销毁子对象
 * @returns {void}
 */
function destroyHTMLElement(element, recursivelyChildren) {
    if (element instanceof HTMLElement === false) {
        console.warn('the element must be instanceof HTMLElement.');
        return;
    }
    destroyHTMLElementImpl(element, recursivelyChildren);
};

export default destroyHTMLElement;