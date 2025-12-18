import isDefined from "./isDefined.js";
import isValid from "./isValid.js";

/**
 * 检查工具对象
 * @namespace Check
*/
const Check = {};
/**
 * 检查类型
 * @namespace Check.typeOf
*/
Check.typeOf = {};

function getUndefinedErrorMessage(name) {
    return name + " is required, actual value was undefined.";
};

function getInvalidErrorMessage(name) {
    return name + " is required, actual value was invalid.";
};

function getFailedTypeErrorMessage(actual, expected, name) {
    return (
        "Expected " +
        name +
        " to be typeof " +
        expected +
        ", actual typeof was " +
        actual
    );
};
/**
 * 检查值是否定义
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值未定义，则抛出错误
 * @static
 * @memberof Check
*/
Check.defined = function (name, test) {
    if (!isDefined(test)) {
        throw new Error(getUndefinedErrorMessage(name));
    }
};
/**
 * 检查值是否有效
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值无效，则抛出错误
 * @static
 * @memberof Check
*/
Check.valid = function (name, test) {
    if (!isValid(test)) {
        throw new Error(getInvalidErrorMessage(name));
    }
};
/**
 * 检查值是否为函数
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值不是函数，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.function = function (name, test) {
    if (typeof test !== "function") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "function", name)
        );
    }
};
/**
 * 检查值是否为函数
 * @see Check.typeOf.function
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.func = Check.typeOf.function;
/**
 * 检查值是否为字符串
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值不是字符串，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.string = function (name, test) {
    if (typeof test !== "string") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "string", name)
        );
    }
};
/**
 * 检查值是否为数字
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值不是数字，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.number = function (name, test) {
    if (typeof test !== "number") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "number", name)
        );
    }
};
/**
 * 检查值是否为数字且小于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值小于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.number
*/
Check.typeOf.number.lessThan = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test >= limit) {
        throw new Error(
            "Expected " +
            name +
            " to be less than " +
            limit +
            ", actual value was " +
            test
        );
    }
};
/**
 * 检查值是否为数字且小于或等于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值小于或等于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.number
*/
Check.typeOf.number.lessThanOrEquals = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test > limit) {
        throw new Error(
            "Expected " +
            name +
            " to be less than or equal to " +
            limit +
            ", actual value was " +
            test
        );
    }
};
/**
 * 检查值是否为数字且大于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值大于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.number
*/
Check.typeOf.number.greaterThan = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test <= limit) {
        throw new Error(
            "Expected " +
            name +
            " to be greater than " +
            limit +
            ", actual value was " +
            test
        );
    }
};
/**
 * 检查值是否为数字且大于或等于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值大于或等于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.number
 */
Check.typeOf.number.greaterThanOrEquals = function (name, test, limit) {
    Check.typeOf.number(name, test);
    if (test < limit) {
        throw new Error(
            "Expected " +
            name +
            " to be greater than or equal to" +
            limit +
            ", actual value was " +
            test
        );
    }
};
/**
 * 检查两个值是否为数字且相等
 * @param {string} name1 值1的名称
 * @param {string} name2 值2的名称
 * @param {number} test1 需要检查的值1
 * @param {number} test2 需要检查的值2
 * @throws {Error} 如果两个数值不相等，则抛出错误
 * @static
 * @memberof Check.typeOf.number
*/
Check.typeOf.number.equals = function (name1, name2, test1, test2) {
    Check.typeOf.number(name1, test1);
    Check.typeOf.number(name2, test2);
    if (test1 !== test2) {
        throw new Error(
            name1 +
            " must be equal to " +
            name2 +
            ", the actual values are " +
            test1 +
            " and " +
            test2
        );
    }
};
/**
 * 检查值是否为对象
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值不是对象，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.object = function (name, test) {
    if (typeof test !== "object") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "object", name)
        );
    }
};
/**
 * 检查值是否为布尔值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值不是布尔值，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.boolean = function (name, test) {
    if (typeof test !== "boolean") {
        throw new Error(
            getFailedTypeErrorMessage(typeof test, "boolean", name)
        );
    }
};
/**
 * 检查值是否为布尔值
 * @see Check.typeOf.boolean
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.bool = Check.typeOf.boolean;
/**
 * 检查值是否为数组
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值不是数组，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.array = function (name, test) {
    if (Array.isArray(test) === false) {
        throw new Error(getFailedTypeErrorMessage(typeof test, 'array', name));
    }
};
/**
 * 检查值是否为整数
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @throws {Error} 如果值不是整数，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.integer = function (name, test) {
    if (Number.isSafeInteger(test) === false) {
        throw new Error(getFailedTypeErrorMessage(typeof test, 'integer', name));
    }
}
/**
 * 检查值是否为整数且小于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值小于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.integer
*/
Check.typeOf.integer.lessThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test >= limit) {
        throw new Error('Expected ' +
            name +
            ' to be less than ' +
            limit +
            ', actual value was ' +
            test);
    }
};
/**
 * 检查值是否为整数且小于或等于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值小于或等于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.integer
*/
Check.typeOf.integer.lessThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test > limit) {
        throw new Error('Expected ' +
            name +
            ' to be less than or equal to ' +
            limit +
            ', actual value was ' +
            test);
    }
};
/**
 * 检查值是否为整数且大于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值大于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.integer
*/
Check.typeOf.integer.greaterThan = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test <= limit) {
        throw new Error('Expected ' +
            name +
            ' to be greater than ' +
            limit +
            ', actual value was ' +
            test);
    }
};
/**
 * 检查值是否为整数且大于或等于指定值
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {number} limit 指定值
 * @throws {Error} 如果值大于或等于指定值，则抛出错误
 * @static
 * @memberof Check.typeOf.integer
*/
Check.typeOf.integer.greaterThanOrEquals = function (name, test, limit) {
    Check.typeOf.integer(name, test);
    if (test < limit) {
        throw new Error('Expected ' +
            name +
            ' to be greater than or equal to' +
            limit +
            ', actual value was ' +
            test);
    }
};
/**
 * 检查两个值是否为整数且相等
 * @param {string} name1 值1的名称
 * @param {string} name2 值2的名称
 * @param {number} test1 需要检查的值1
 * @param {number} test2 需要检查的值2
 * @throws {Error} 如果两个整数值不相等，则抛出错误
 * @static
 * @memberof Check.typeOf.integer
*/
Check.typeOf.integer.equals = function (name1, name2, test1, test2) {
    Check.typeOf.integer(name1, test1);
    Check.typeOf.integer(name2, test2);
    if (test1 !== test2) {
        throw new Error(
            name1 +
            " must be equal to " +
            name2 +
            ", the actual values are " +
            test1 +
            " and " +
            test2
        );
    }
};
/**
 * 检查值是否为指定类的实例
 * @param {string} name 值的名称
 * @param {any} test 需要检查的值
 * @param {Function} target 指定类
 * @throws {Error} 如果值不是指定类的实例，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.instanceOf = function (name, test, target) {
    if (test instanceof target === false) {
        throw new Error(getFailedTypeErrorMessage(false, target.name, name));
    }
};
/**
 * 检查两个值是否已定义且相等
 * @param {string} name1 值1的名称
 * @param {string} name2 值2的名称
 * @param {any} test1 需要检查的值1
 * @param {any} test2 需要检查的值2
 * @throws {Error} 如果两个值不相等，则抛出错误
 * @static
 * @memberof Check.typeOf
*/
Check.typeOf.equals = function (name1, name2, test1, test2) {
    Check.defined(name1, test1);
    Check.defined(name2, test2);
    if (test1 !== test2) {
        throw new Error(
            name1 +
            " must be equal to " +
            name2 +
            ", the actual values are " +
            test1 +
            " and " +
            test2
        );
    }
};

export default Check;
export { Check };