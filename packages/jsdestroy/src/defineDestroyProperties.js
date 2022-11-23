import destroyObject from "./destroyObject";

function returnFalse() {
    return false;
}

/**
 * 为对象或原型链定义destroy相关Property
 * @param {Object||Object.prototype} target 对象或原型链
 * @returns {void}
 */
function defineDestroyProperties(target) {
    Object.defineProperties(target, {
        isDestroyed: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: returnFalse,
        },
        destroy: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function () {
                destroyObject(this);
            }
        }
    });
}

export default defineDestroyProperties;