import isBetween from "./isBetween";
import lerp from "./lerp";
import scalarInRange from "./scalarInRange";

/**
 * 数学上的区间对象
*/
class Interval {
    /**
     * 构造函数
     * @param {Number} start 区间开始值，默认0
     * @param {Number} end 区间结束值，默认1
     * @param {Boolean} equalsStart 区间范围是否可等于开始值，默认true
     * @param {Boolean} equalsEnd 区间范围是否可等于结束值，默认true
     */
    constructor(start = 0, end = 1, equalsStart = true, equalsEnd = true) {
        this.setValues(start, end, equalsStart, equalsEnd);
    }

    /**
     * 设置区间参数值
     * @param {Number} start 区间开始值，默认0
     * @param {Number} end 区间结束值，默认1
     * @param {Boolean} equalsStart 区间范围是否可等于开始值，默认true
     * @param {Boolean} equalsEnd 区间范围是否可等于结束值，默认true
     * @returns {Interval} 返回自身
     */
    setValues(start = 0, end = 1, equalsStart = true, equalsEnd = true) {
        if (start > end)
            throw new Error('the start value must be less than or equals end value.');

        this.start = start;
        this.end = end;
        this.equalsStart = equalsStart;
        this.equalsEnd = equalsEnd;

        return this;
    }

    /**
     * 判断该区间是否为空集
     * @returns {Boolean}
     */
    isEmpty() {
        return this.start === this.end;
    }

    /**
     * 获取区间长度
     * @returns {Number}
     */
    get length() {
        return this.end - this.start;
    }

    /**
     * 判断一个数值是否处于该区间内
     * @param {Number} 需要判断的数值
     * @returns {Boolean} 判断结果
     */
    isBetween(value) {
        return isBetween(value, this.start, this.end, this.equalsStart, this.equalsEnd);
    }

    /**
     * 在该区间内线性插值
     * @param {Number} scalar 插值标量，needClamp为true时约束在[0,1]区间内，为false时可超出[0,1]区间
     * @param {Boolean} needClamp 是否需要约束插值，默认true
     * @returns {Number} 插值结果
     */
    lerp(scalar, needClamp = true) {
        return lerp(this.start, this.end, scalar, needClamp);
    }

    /**
     * 计算一个数值在当前区间内的线性插值标量
     * @param {Number} value 需要计算的数值
     * @param {Boolean} needClamp 是否需要约束至0到1之间，默认true
     * @returns {Number} 插值标量
     */
    scalar(value, needClamp = true) {
        return scalarInRange(value, this.start, this.end, needClamp);
    }

    /**
     * 判断两个区间对象是否相等
     * @param {Interval} left
     * @param {Interval} right
     * @returns {Boolean}
     */
    static equals(left, right) {
        if (left === right)
            return true;
        if (left && right
            && left.start === right.start
            && left.end === right.end
            && left.equalsStart === right.equalsStart
            && left.equalsEnd === right.equalsEnd)
            return true;
        return false;
    }

    /**
     * 判断当前区间是否与另一个区间相等
     * @param {Interval} other
     * @returns {Boolean}
     */
    equals(other) {
        return Interval.equals(this, other);
    }

    /**
     * 两个区间相加，left + right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static add(left, right, result = new Interval()) {
        result.start = left.start + right.start;
        result.end = left.end + right.end;
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间与另一个区间相加
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    add(other, result) {
        return Interval.add(this, other, result || this);
    }

    /**
     * 两个区间相减，left - right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static subtract(left, right, result = new Interval()) {
        result.start = left.start - right.start;
        result.end = left.end - right.end;
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间减去另一个区间
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    subtract(other, result) {
        return Interval.subtract(this, other, result || this);
    }

    /**
     * 两个区间相乘，left x right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static multiply(left, right, result = new Interval()) {
        const ac = left.start * right.start;
        const ad = left.start * right.end;
        const bc = left.end * right.start;
        const bd = left.end * right.end;
        result.start = Math.min(ac, ad, bc, bd);
        result.end = Math.max(ac, ad, bc, bd);
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间乘以另一个区间
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    multiply(other, result) {
        return Interval.multiply(this, other, result || this);
    }

    /**
     * 两个区间相除，left / right
     * @param {Interval} left
     * @param {Interval} right
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static divide(left, right, result = new Interval()) {
        const ac = left.start / right.start;
        const ad = left.start / right.end;
        const bc = left.end / right.start;
        const bd = left.end / right.end;
        result.start = Math.min(ac, ad, bc, bd);
        result.end = Math.max(ac, ad, bc, bd);
        result.equalsStart = left.equalsStart && right.equalsStart;
        result.equalsEnd = left.equalsEnd && right.equalsEnd;

        return result;
    }

    /**
     * 当前区间除以另一个区间
     * @param {Interval} other
     * @param {Interval} result 结果区间对象，不填时传入自身
     * @returns {Interval} 结果区间对象
     */
    divide(other, result) {
        return Interval.divide(this, other, result || this);
    }

    /**
     * 克隆一个区间对象
     * @param {Interval} interval 需要克隆的区间对象
     * @param {Interval} result 结果区间对象，可不设置
     * @returns {Interval} 结果区间对象
     */
    static clone(interval, result = new Interval()) {
        result.start = interval.start;
        result.end = interval.end;
        result.equalsStart = interval.equalsStart;
        result.equalsEnd = interval.equalsEnd;

        return result;
    }

    /**
     * 克隆当前区间对象
     * @param {Interval} result 结果区间对象，可不设置
     * @returns {Interval} 结果区间对象
     */
    clone(result) {
        return Interval.clone(this, result);
    }

    /**
     * 将一个区间对象的所有属性打包到一个数组中
     * @param {Interval} interval 需要打包的区间对象
     * @param {Array} array 打包到的数组
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @returns {Array} 打包后的数组
     */
    static pack(interval, array = [], startingIndex = 0) {
        array[startingIndex++] = interval.start;
        array[startingIndex++] = interval.end;
        array[startingIndex++] = interval.equalsStart;
        array[startingIndex++] = interval.equalsEnd;

        return array;
    }

    /**
     * 将当前区间对象属性打包至数组
     * @param {Array} array 打包到的数组
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @returns {Array} 打包后的数组
     */
    toArray(array, startingIndex = 0) {
        return Interval.pack(this, array, startingIndex);
    }

    /**
     * 从一个数组中提取一个区间对象的所有属性
     * @param {Array} array 提取属性的数组
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @param {Interval} result 结果区间对象，可不填
     * @returns {Interval} 结果区间对象
     */
    static unpack(array, startingIndex = 0, result = new Interval()) {
        result.start = array[startingIndex++];
        result.end = array[startingIndex++];
        result.equalsStart = array[startingIndex++];
        result.equalsEnd = array[startingIndex++];

        return result;
    }

    /**
     * 等同于Interval.unpack
     * 
     * @see Interval.unpack
    */
    static fromArray(array, startingIndex, result) {
        return Interval.unpack(array, startingIndex, result);
    }

    /**
     * 从一个数组给当前区间对象赋值
     * @param {Array} array 提取属性的数组
     * @param {Integer} startingIndex 数组起始索引，默认0
     * @returns {Interval} 当前区间对象
     */
    setFromArray(array, startingIndex = 0) {
        return Interval.unpack(array, startingIndex, this);
    }

    toString() {
        return 'Interval:' + (this.equalsStart ? '[' : '(') + this.start + ', ' + this.end + (this.equalsEnd ? ']' : ')');
    }
};

Interval.packedLength = 4;

export default Interval;