import Check from "@lijuhong1981/jscheck/src/Check.js";
import isValid from "@lijuhong1981/jscheck/src/isValid.js";
import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import isArray from "@lijuhong1981/jscheck/src/isArray.js";
import isObject from "@lijuhong1981/jscheck/src/isObject.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import clamp from "@lijuhong1981/jsmath/src/clamp.js";
import normalize from "@lijuhong1981/jsmath/src/normalize.js";
import Color4 from "./Color4.js";
import parseToColor4 from "./parseToColor4.js";

function ascCompare(a, b) {
    return a.offset - b.offset;
}

// function descCompare(a, b) {
//     return b.offset - a.offset;
// }

/**
 * ColorGradient是一个用于管理、生成颜色条的对象类 
*/
class ColorGradient extends Destroyable {
    /**
     * 构造函数
     * @param {Object} options 配置项
     * @param {Boolean} options.vertical 垂直颜色条，默认false
     * @param {Boolean} options.reverse 颜色条颠倒排列，默认false
     * @param {Number} options.stripLength 颜色条长度，单位像素，默认100
     * @param {Number} options.stripHeight  颜色条高度，单位像素，默认1
     * @param {Object|Array} options.colors 色条颜色值定义
     * 
     * @example
     *  const colorGradient1 = new ColorGradient({
     *      colors: {
     *          0.2: '#000',
     *          0.4: '#00f',
     *          0.6: '#0ff',
     *          0.8: '#fff',
     *      },
     *  });
     * 
     *  const colorGradient2 = new ColorGradient({
     *      colors: [
     *          {
     *              offset: 0.2,
     *              color: '#000',
     *          },
     *          {
     *              offset: 0.4,
     *              color: '#00f',
     *          },
     *          {
     *              offset: 0.6,
     *              color: '#0ff',
     *          },
     *          {
     *              offset: 0.8,
     *              color: '#fff',
     *          },
     *      ],
     *  });
     * 
     *  const colorGradient3 = new ColorGradient({
     *      colors: [
     *          [0.2, '#000'],
     *          [0.4, '#00f'],
     *          [0.6, '#0ff'],
     *          [0.8, '#fff'],
     *      ],
     *  });
     */
    constructor(options = {}) {
        super();

        this._colors = [];
        this.vertical = getValidValue(options.vertical, false);
        this.reverse = getValidValue(options.reverse, false);
        this.stripLength = getValidValue(options.stripLength, 100);
        this.stripHeight = getValidValue(options.stripHeight, 1);
        if (options.colors)
            this.setColors(options.colors);
    }

    /**
     * 颜色数量
     * @returns {Number}
     */
    get length() {
        return this._colors.length;
    }

    set colors(value) {
        this.setColors(value);
    }

    get colors() {
        return this._colors;
    }

    get(index) {
        return this._colors[index];
    }

    forEach(callback) {
        Check.typeOf.func('callback', callback);
        this._colors.forEach(callback);
        return this;
    }

    /**
     * 设置颜色条
     * @param {Object|Array} colors 色条颜色值
     * @returns {this}
     * 
     * @example
     *  colorGradient.setColors{
     *      {
     *          0.2: '#000',
     *          0.4: '#00f',
     *          0.6: '#0ff',
     *          0.8: '#fff',
     *      },
     *  };
     * 
     *  colorGradient.setColors(
     *      [
     *          {
     *              offset: 0.2,
     *              color: '#000',
     *          },
     *          {
     *              offset: 0.4,
     *              color: '#00f',
     *          },
     *          {
     *              offset: 0.6,
     *              color: '#0ff',
     *          },
     *          {
     *              offset: 0.8,
     *              color: '#fff',
     *          },
     *      ],
     *  );
     *
     *  colorGradient.setColors(
     *      [
     *          [0.2, '#000'],
     *          [0.4, '#00f'],
     *          [0.6, '#0ff'],
     *          [0.8, '#fff'],
     *      ],
     *  );
     */
    setColors(colors) {
        Check.defined('colors', colors);
        this.removeAll();
        if (isArray(colors))
            this.addArray(colors);
        else {
            for (const key in colors) {
                if (Object.hasOwnProperty.call(colors, key)) {
                    this.add(parseFloat(key), colors[key]);
                }
            }
        }
        return this;
    }

    /**
     * 获取颜色条颜色值
     * @returns {Object} 
     *      {
     *          0.2: '#000',
     *          0.4: '#00f',
     *          0.6: '#0ff',
     *          0.8: '#fff',
     *      },
     * 
     */
    getCssStringColorsMap() {
        const result = {};
        this._colors.forEach(element => {
            result[element.offset] = element.color.toCssColorString();
        });
        return result;
    }

    /**
     * 获取颜色条颜色值
     * @returns {Object} 
     *      [
     *          {
     *              offset: 0.2,
     *              color: '#000',
     *          },
     *          {
     *              offset: 0.4,
     *              color: '#00f',
     *          },
     *          {
     *              offset: 0.6,
     *              color: '#0ff',
     *          },
     *          {
     *              offset: 0.8,
     *              color: '#fff',
     *          },
     *      ],
     * 
     */
    getCssStringColorsArray() {
        const result = [];
        this._colors.forEach(element => {
            result.push({
                offset: element.offset,
                color: element.color.toCssHexString(),
            });
        });
        return result;
    }

    /**
     * 添加颜色
     * @param {Number} offset 颜色值插入标量，范围0~1
     * @param {Color|String|Number|Number[]} color 颜色值
     * @param {Number} opacity 不透明度，可不填，不填时使用从color中解析出的alpha值
     * @returns {this}
     */
    add(offset, color, opacity) {
        if (isArray(offset)) {
            color = offset[1];
            opacity = offset[2];
            offset = offset[0];
        } else if (isObject(offset)) {
            color = offset.color;
            opacity = offset.opacity;
            offset = offset.offset;
        }
        Check.typeOf.number.greaterThanOrEquals('offset', offset, 0);
        Check.typeOf.number.lessThanOrEquals('offset', offset, 1);
        color = parseToColor4(color);
        if (isValid(opacity))
            color.alpha = opacity;
        const element = {
            offset: offset,
            color: color,
        };
        this._colors.push(element);
        this.needsResort = true;
        // return element;
        return this;
    }

    /**
     * 批量添加颜色
     * @param {Array} array
     * @returns {this}
     * 
     * @example
     *  colorGradient.addArray(
     *      [
     *          {
     *              offset: 0.2,
     *              color: '#000',
     *          },
     *          {
     *              offset: 0.4,
     *              color: '#00f',
     *          },
     *          {
     *              offset: 0.6,
     *              color: '#0ff',
     *          },
     *          {
     *              offset: 0.8,
     *              color: '#fff',
     *          },
     *      ],
     *  );
     *
     *  colorGradient.addArray(
     *      [
     *          [0.2, '#000'],
     *          [0.4, '#00f'],
     *          [0.6, '#0ff'],
     *          [0.8, '#fff'],
     *      ],
     *  );
     */
    addArray(array) {
        Check.typeOf.array('array', array);
        const result = [];
        array.forEach((element) => {
            result.push(this.add(element));
        });
        this.needsResort = true;
        // return result;
        return this;
    }

    // remove(element) {
    //     Check.typeOf.object('element', element);
    //     for (let i = this.length - 1; i >= 0; i--) {
    //         if (this._colors[i] === element) {
    //             this._colors.splice(i, 1);
    //             return true;
    //         }
    //     }
    //     return false;
    // }

    // removeAt(index) {
    //     const element = this.get(index);
    //     if (element) {
    //         this._colors.splice(index, 1);
    //         return element;
    //     }
    // }

    /**
     * 移除所有颜色
     * @returns {this}
     */
    removeAll() {
        this._colors.length = 0;
        return this;
    }

    /**
     * 颜色排序
     * @param {Boolean} force 是否强制重排序，默认false
     * @returns {this}
     */
    sort(force) {
        if (this.needsResort || force) {
            this._colors.sort(ascCompare);
            this.needsResort = false;
        }
        return this;
    }

    /**
     * 根据offset插值计算得到一个Color对象
     * @param {Number} offset 插值，范围0~1之间
     * @param {Color4} result 输出的Color对象
     * @returns {Color4}
     */
    getColor(offset, result = new Color4()) {
        Check.typeOf.number('offset', offset);
        offset = clamp(offset, 0, 1);
        this.sort();
        let prevColor, nextColor;
        for (let i = 0, length = this._colors.length; i < length; i++) {
            const element = this._colors[i];
            if (offset === element.offset)
                return element.color.clone(result);
            else if (offset < element.offset || i === length - 1) {
                if (i - 1 < 0)
                    return element.color.clone(result);
                else {
                    prevColor = this._colors[i - 1];
                    nextColor = element;
                    break;
                }
            }
        }
        offset = normalize(offset, prevColor.offset, nextColor.offset);
        return Color4.lerp(prevColor.color, nextColor.color, offset, result);
    }

    /**
     * 创建颜色条Image
     * @param {Boolean} forceResort 是否强制重排序，默认false
     * @returns {HTMLCanvasElement} 返回HTMLCanvasElement对象
     */
    createImage(forceResort) {
        this.sort(forceResort);

        const canvas = document.createElement('canvas');
        canvas.width = (this.vertical ? this.stripHeight : this.stripLength);
        canvas.height = (this.vertical ? this.stripLength : this.stripHeight);

        const length = this.length;
        if (length > 0) {
            const context = canvas.getContext('2d');
            // context.clearRect(0, 0, canvas.width, canvas.height);
            const gradient = context.createLinearGradient(0, 0, (this.vertical ? 0 : this.stripLength), (this.vertical ? this.stripLength : 0));

            for (let i = 0; i < length; i++) {
                const element = this.get(i);
                let offset = element.offset;
                if (this.reverse)
                    offset = 1.0 - offset;
                gradient.addColorStop(element.offset, element.color.toCssColorString());
            }

            context.fillStyle = gradient;
            context.fillRect(0, 0, canvas.width, canvas.height);
        }

        return canvas;
    }

    /**
     * 克隆ColorGradient对象
     * @param {ColorGradient} colorGradient 需要克隆的对象
     * @param {ColorGradient} result 克隆的结果对象，可不填
     * @returns {ColorGradient} 克隆的结果对象
     */
    static clone(colorGradient, result = new ColorGradient()) {
        Check.instanceOf('colorGradient', colorGradient, ColorGradient);

        result._colors = colorGradient._colors.slice();
        result.vertical = colorGradient.vertical;
        result.reverse = colorGradient.reverse;
        result.stripLength = colorGradient.stripLength;
        result.stripHeight = colorGradient.stripHeight;
        result.needsResort = colorGradient.needsResort;

        return result;
    }

    /**
     * 克隆自身
     * @param {ColorGradient} result 克隆的结果对象，可不填
     * @returns {ColorGradient} 克隆的结果对象
     */
    clone(result) {
        return ColorGradient.clone(this, result);
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this.removeAll();
    }
};

const DefaultColorGradient = new ColorGradient();

DefaultColorGradient.add(0.0, 'rgb(0, 0, 255)');
DefaultColorGradient.add(0.2, 'rgb(0, 128, 128)');
DefaultColorGradient.add(0.4, 'rgb(0, 255, 0)');
DefaultColorGradient.add(0.6, 'rgb(255, 255, 0)');
DefaultColorGradient.add(0.8, 'rgb(255, 0, 0)');

/**
 * 获取默认的ColorGradient对象
 *
 * @constant
 * @type {ColorGradient}
 */
ColorGradient.default = DefaultColorGradient;

/**
 * 获取默认的ColorGradient对象
 *
 * @constant
 * @returns {ColorGradient}
 */
ColorGradient.getDefault = function () {
    return DefaultColorGradient;
};

export default ColorGradient;