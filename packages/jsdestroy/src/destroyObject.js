import destroyHTMLElement from './destroyHTMLElement.js';
import isDestroyed from './isDestroyed.js';

function returnTrue() {
    return true;
}

/**
 * 销毁对象
 * 销毁完成后会设置object.isDestroyed = function() { return true; };
 * @param {Object} object
 * @returns {void}
 */
function destroyObject(object) {
    if (isDestroyed(object) || object.isDestroying) {
        console.warn('The object isDestroyed or isDestroying, repeated call destroyObject function are not required.', object);
        return;
    }

    //标记正在执行销毁
    object.isDestroying = true;

    for (let key in object) {
        if (key === 'isDestroying' || key === 'isDestroyed' || key === 'destroy')
            continue;
        try {
            const value = object[key];
            if (value) {
                //有缓存标记，不执行销毁
                if (value.isCached)
                    continue;
                if (value instanceof HTMLElement)
                    destroyHTMLElement(object[key]);
                if (typeof value.destroy === 'function' || isDestroyed(value))
                    continue;
            }
        } catch (error) {
            console.warn(error);
        }
        delete object[key];
    }

    object.isDestroyed = returnTrue;

    delete object.isDestroying;

    return object;
}

export default destroyObject;