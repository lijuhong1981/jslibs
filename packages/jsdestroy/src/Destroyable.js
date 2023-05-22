import destroyObject from './destroyObject.js';

/**
 * Destroyable是一个包含了destroy相关Property的class，可用于继承
*/
class Destroyable {
    isDestroyed() {
        return false;
    }

    /**
     * 执行销毁，由子类实现
     */
    onDestroy() {
        // console.warn('onDestroy must be overwrited by subclass.');
    }

    /**
     * 销毁自身
     * @returns {this}
     */
    destroy() {
        if (this.isDestroyed()) {
            console.warn('This object was destroyed.', this);
        } else {
            this.onDestroy();
            destroyObject(this);
        }
        return this;
    }
}

export default Destroyable;