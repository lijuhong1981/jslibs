import destroyObject from './destroyObject.js';

/**
 * Destroyable是一个包含了destroy相关Property的class，可用于继承
*/
class Destroyable {
    isDestroyed() {
        return false;
    }

    destroy() {
        destroyObject(this);
        return this;
    }
}

export default Destroyable;