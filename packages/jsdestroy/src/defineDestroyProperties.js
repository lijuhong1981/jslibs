import destroyObject from "./destroyObject.js";

function returnFalse() {
    return false;
}

/**
 * 为对象或原型链定义destroy相关Property
 * @param {Object|Object.prototype} target 对象或原型链
 * @param {Function} destroyFunc 外部传入destroy方法，可不填
 * @returns {void}
 */
function defineDestroyProperties(target, destroyFunc) {
    Object.defineProperties(target, {
        isDestroyed: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: returnFalse,
        },
        onDestroy: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function () {
                // console.warn('onDestroy must be overwrited by subclass.');
            }
        },
        destroy: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function () {
                if (this.isDestroyed()) {
                    console.warn('This object was destroyed.', this);
                } else {
                    this.onDestroy();
                    if (destroyFunc)
                        destroyFunc(this);
                    else
                        destroyObject(this);
                }
                return this;
            }
        }
    });
}

export default defineDestroyProperties;