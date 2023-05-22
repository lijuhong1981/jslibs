import Check from "@lijuhong1981/jscheck/src/Check.js";
import getValidValue from "@lijuhong1981/jscheck/src/getValidValue.js";
import isArray from "@lijuhong1981/jscheck/src/isArray.js";
import isFunction from "@lijuhong1981/jscheck/src/isFunction.js";
import isNumber from "@lijuhong1981/jscheck/src/isNumber.js";
import isString from "@lijuhong1981/jscheck/src/isString.js";
import isValid from "@lijuhong1981/jscheck/src/isValid.js";
import Destroyable from "@lijuhong1981/jsdestroy/src/Destroyable.js";
import clamp from "@lijuhong1981/jsmath/src/clamp.js";
import convertToLatitudeRange from "@lijuhong1981/jsmath/src/convertToLatitudeRange.js";
import convertToLongitudeRange from "@lijuhong1981/jsmath/src/convertToLongitudeRange.js";
import lerp from "@lijuhong1981/jsmath/src/lerp.js";
import randomNumber from "@lijuhong1981/jsmath/src/randomNumber.js";
import scalarInRange from "@lijuhong1981/jsmath/src/scalarInRange.js";
import now from "@lijuhong1981/jstime/src/now.js";

class Vector {
    constructor(u, v) {
        this.u = u;
        this.v = v;
        this.m = this.magnitude();
    }

    magnitude() {
        return Math.sqrt(this.u * this.u + this.v * this.v);
    }
};

class Field extends Destroyable {
    constructor(params = {}) {
        super();
        Check.typeOf.number('xmin', params.xmin);
        Check.typeOf.number('xmax', params.xmax);
        Check.typeOf.number('ymin', params.ymin);
        Check.typeOf.number('ymax', params.ymax);
        Check.typeOf.integer('colsNumber', params.colsNumber);
        Check.typeOf.integer('rowsNumber', params.rowsNumber);
        Check.typeOf.number('deltaX', params.deltaX);
        Check.typeOf.number('deltaY', params.deltaY);
        Check.typeOf.array('uDatas', params.uDatas);
        Check.typeOf.array('vDatas', params.vDatas);

        this.xmin = Math.min(params.xmin, params.xmax);
        this.xmax = Math.max(params.xmin, params.xmax);
        this.ymin = Math.min(params.ymin, params.ymax);
        this.ymax = Math.max(params.ymin, params.ymax);
        this.colsNumber = params.colsNumber; // 列数
        this.rowsNumber = params.rowsNumber; // 行数
        this.deltaX = params.deltaX; // x方向增量
        this.deltaY = params.deltaY; // y方向增量
        this.uDatas = params.uDatas; // u数据数组
        this.vDatas = params.vDatas; // v数据数组
        this.grids = [];
        // this.flipY = this.deltaY < 0;

        // check cols and rows Number
        const colsNumber = Math.ceil((this.xmax - this.xmin + 1) / params.deltaX); // 列
        const rowsNumber = Math.ceil((this.ymax - this.ymin + 1) / params.deltaY); // 行
        if (colsNumber !== this.colsNumber || rowsNumber !== this.rowsNumber) {
            console.warn('computed cols or rows number not equals colsNumber or rowsNumber.', colsNumber, this.colsNumber, rowsNumber, this.rowsNumber);
            // this.colsNumber = colsNumber;
            // this.rowsNumber = rowsNumber;
        }
        // check uDatas and vDatas length
        const numberOfPoints = this.colsNumber * this.rowsNumber;
        if (this.uDatas.length !== numberOfPoints || this.vDatas.length !== numberOfPoints) {
            console.warn('computed numberOfPoints not equals uDatas.length or vDatas.length.', numberOfPoints, this.uDatas.length, this.vDatas.length);
        }

        this.isContinuousX = Math.floor(this.colsNumber * this.deltaX) >= 360;
        // this.yContinuous = Math.floor(this.rows * this.deltaY) >= 180;
        this.wrappedX = this.xmax > 180; // [0, 360] --> [-180, 180];
        this.buildGrids();
        this.calculateRange();
    }

    get isField() {
        return true;
    }

    buildGrids() {
        this.grids.length = 0;
        let p = 0;
        for (let y = 0; y < this.rowsNumber; y++) {
            const rows = [];
            for (let x = 0; x < this.colsNumber; x++, p++) {
                const u = this.uDatas[p];
                const v = this.vDatas[p];
                const valid = isNumber(u) && isNumber(v);
                rows[x] = valid ? new Vector(u, v) : undefined;
            }
            // if (this.isContinuousX)
            //     rows.push(rows[0]);
            // 因数据表从上到下顺序是-90~90，与纬度顺序相反，故需要反转rows数组
            // rows.reverse();
            this.grids[y] = rows;
        }
        // if (this.isContinuousX) {
        //     this.colsNumber++;
        //     this.xmax++;
        // }
        return this;
    }

    calculateRange() {
        if (this.grids.length === 0)
            return
        let min = 0, max = 0;
        const rowsNumber = this.grids.length;
        for (let y = 0; y < rowsNumber; y++) {
            const rows = this.grids[y];
            const colsNumber = rows.length;
            for (let x = 0; x < colsNumber; x++) {
                const vector = rows[x];
                if (vector) {
                    min = Math.min(vector.m, min);
                    max = Math.max(vector.m, max);
                }
            }
        }
        this.valueRange = [min, max];
        this.extent = {
            xmin: this.xmin,
            xmax: this.xmax,
            ymin: this.ymin,
            ymax: this.ymax,
        };
        this.longitudeRange = [this.wrappedX ? this.xmin - 180 : this.xmin, this.wrappedX ? this.xmax + 1 - 180 : this.xmax + 1];
        this.latitudeRange = [this.ymin, this.ymax];
        return this;
    }

    isOutOfBounds(x, y) {
        if (x < 0 || x > this.colsNumber - 1 || y < 0 || y > this.rowsNumber - 1)
            return true;
        return false;
    }

    randomParticle(particle = {}, unit = 'degrees', width, height) {
        let x, y;
        switch (unit) {
            case 'pixel'://像素
                x = Math.random() * width;
                y = Math.random() * height;
                break;
            case 'degrees'://经纬度
            default:
                x = randomNumber(this.longitudeRange[0], this.longitudeRange[1]);
                y = randomNumber(this.latitudeRange[0], this.latitudeRange[1]);
                break;
        }

        particle.unit = unit;
        particle.x = x;
        particle.y = y;
        return particle;
    }

    longLatToDecimalIndexes(long, lat) {
        long = convertToLongitudeRange(long);
        lat = convertToLatitudeRange(lat);
        const x = ((long < 0 ? long + 360 : long) - this.xmin) / this.deltaX; // calculate longitude index in wrapped range [0, 360)
        const y = (this.ymax - lat) / this.deltaY; // calculate latitude index in direction +90 to -90
        return [x, y];
    }

    pixelsToLongLat(pixelX, pixelY, width, height) {
        const percentX = pixelX / width;
        const percentY = pixelY / height;
        const long = lerp(percentX, this.longitudeRange[0], this.longitudeRange[1]);
        const lat = lerp(percentY, this.latitudeRange[1], this.latitudeRange[0]);
        return [long, lat];
    }

    pixelsToDecimalIndexes(pixelX, pixelY, width, height) {
        const longLat = this.pixelsToLongLat(pixelX, pixelY, width, height);
        return this.longLatToDecimalIndexes(longLat[0], longLat[1]);
    }

    clampColumnIndex(index) {
        return clamp(index, 0, this.colsNumber - 1);
    }

    clampRowIndex(index) {
        return clamp(index, 0, this.rowsNumber - 1);
    }

    getFourSurroundingIndexes(x, y) {
        const left = Math.floor(x); // 左（取整）
        let right = left + 1
        if (this.isContinuousX && right >= this.colsNumber)
            right = 0;
        else
            right = this.clampColumnIndex(right);// 右
        const up = Math.floor(y); // 上（取整）
        const down = this.clampRowIndex(up + 1); // 下
        return [left, right, up, down];
    }

    getFourSurroundingVectors(left, right, up, down) {
        let row;
        if ((row = this.grids[up])) { // up
            const g00 = row[left]; // << left
            const g10 = row[right]; // right >>
            if (g00 && g10 &&
                (row = this.grids[down])) { // down
                const g01 = row[left]; // << left
                const g11 = row[right]; // right >>
                if (g01 && g11) {
                    return [g00, g10, g01, g11]; // 4 values found!
                }
            }
        }
    }

    bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
        const rx = 1 - x;
        const ry = 1 - y;
        const a = rx * ry;
        const b = x * ry;
        const c = rx * y;
        const d = x * y;
        const u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
        const v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
        return new Vector(u, v);
    }

    calculateParticleVector(particle, width, height) {
        let x, y, indexes;
        switch (particle.unit) {
            case 'pixel': //像素
                indexes = this.pixelsToDecimalIndexes(particle.x, particle.y, width, height);
                x = indexes[0];
                y = indexes[1];
                break;
            case 'degrees': //经纬度
            default:
                indexes = this.longLatToDecimalIndexes(particle.x, particle.y);
                x = indexes[0];
                y = indexes[1];
                break;
        }
        indexes = this.getFourSurroundingIndexes(x, y);
        const left = indexes[0], right = indexes[1], up = indexes[2], down = indexes[3];
        const vectors = this.getFourSurroundingVectors(left, right, up, down);
        if (vectors) {
            const g00 = vectors[0], g10 = vectors[1], g01 = vectors[2], g11 = vectors[3];
            return this.bilinearInterpolateVector(x - left, y - up, g00, g10, g01, g11);
        }
    }

    longlatToPixelCoords(long, lat, width, height) {
        const pixelX = scalarInRange(long, this.longitudeRange[0], this.longitudeRange[1]) * width;
        let pixelY = scalarInRange(lat, this.latitudeRange[0], this.latitudeRange[1]) * height;
        pixelY = height - pixelY; // reverse y
        return [pixelX, pixelY];
    }

    calculateParticlePixelCoords(particle, width, height) {
        let fromCoords, toCoords;
        switch (particle.unit) {
            case 'pixel'://像素
                return [particle.x, particle.y, particle.tx, particle.ty];
            case 'degrees'://经纬度
            default:
                fromCoords = this.longlatToPixelCoords(particle.x, particle.y, width, height);
                toCoords = this.longlatToPixelCoords(particle.tx, particle.ty, width, height);
                return [fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]];
        }
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this.uDatas.length = 0;
        this.vDatas.length = 0;
        this.grids.length = 0;
    }
};

const defaultColors = Object.freeze([
    'rgb(36,104, 180)',
    'rgb(60,157, 194)',
    'rgb(128,205,193 )',
    'rgb(151,218,168 )',
    'rgb(198,231,181)',
    'rgb(238,247,217)',
    'rgb(255,238,159)',
    'rgb(252,217,125)',
    'rgb(255,182,100)',
    'rgb(252,150,75)',
    'rgb(250,112,52)',
    'rgb(245,64,32)',
    'rgb(237,45,28)',
    'rgb(220,24,32)',
    'rgb(180,0,35)',
]);

const defaultOptions = Object.freeze({
    globalAlpha: 0.9, //canvas全局alpha
    lineWidth: 1, //线宽
    colors: defaultColors, //颜色设置
    velocityScale: 1.0, //速度缩放倍率
    maxAge: 90, //粒子最大存活帧数
    particlesCount: 2000, //粒子数量
    frameDeltaTime: 1000 / 30, //动画帧渲染间隔时间
    useAnimationFrame: true, //是否使用动画帧
    unit: 'degrees', //粒子位置单位，支持'degrees'(经纬度),'pixel'(像素)等
});

function formatData(data) {
    console.time('format-data');
    let uComponent, vComponent;
    data.forEach(function (record) {
        switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
            case "1,2":
            case "2,2":
                uComponent = record;
                break;
            case "1,3":
            case "2,3":
                vComponent = record;
                break;
        }
    });
    if (!vComponent || !uComponent)
        throw new Error('formatData failed, vComp or uComp undefined.');
    const header = uComponent.header;
    const field = new Field({
        xmin: header.lo1,
        ymin: header.la1,
        xmax: header.lo2,
        ymax: header.la2,
        deltaX: header.dx,
        deltaY: header.dy,
        colsNumber: header.nx,
        rowsNumber: header.ny,
        uDatas: uComponent.data,
        vDatas: vComponent.data
    });
    console.timeEnd('format-data');
    return field;
};

function indexFor(value, min, max, array) {
    const maxIndex = array.length - 1
    return Math.max(0, Math.min(maxIndex, Math.round((value - min) / (max - min) * maxIndex)));
}

class WindField extends Destroyable {

    constructor(canvas, options = {}) {
        super();
        if (isString(canvas))
            canvas = document.getElementById(canvas);
        Check.instanceOf('canvas', canvas, HTMLCanvasElement);
        this.canvas = canvas;
        this.setOptions(options);
        this.update = this.update.bind(this);
        this.particles = [];
        this._oldTime = 0;
    }

    setOptions(options) {
        if (!options)
            return;
        this.options = Object.assign({}, defaultOptions, this.options, options);
        this.needsPrepareParticles = true;
        return this;
    }

    setData(data) {
        if (!data)
            return;

        let field;
        if (isArray(data))
            field = formatData(data);
        else if (data instanceof Field)
            field = data;
        else
            throw new Error('Illegal data ' + data);

        this.field = field;
        this.needsPrepareParticles = true;
        console.log('field data changed, need reset particles.');
        return this;
    }

    randomAge() {
        return Math.floor(Math.random() * this.options.maxAge);
    }

    // unproject(pixelCoords) { }

    // project(lnglatCoords) { }

    prepareParticles() {
        this.particles.length = 0;
        if (this.field) {
            const particlesCount = isFunction(this.options.particlesCount) ? this.options.particlesCount(this) : this.options.particlesCount;
            const width = this.canvas.width, height = this.canvas.height;
            for (let i = 0; i < particlesCount; i++) {
                this.particles.push(this.field.randomParticle({
                    age: this.randomAge(),
                }, this.options.unit, width, height));
            }
        }
        return this.particles;
    }

    _moveParticles(deltaTime) {
        const width = this.canvas.width, height = this.canvas.height;
        const maxAge = this.options.maxAge;
        const velocityScale = isFunction(this.options.velocityScale) ? this.options.velocityScale(deltaTime) : this.options.velocityScale;
        this.particles.forEach(particle => {
            if (particle.age > maxAge) {
                particle.age = this.randomAge();
                this.field.randomParticle(particle, this.options.unit, width, height);
            }
            const x = particle.x;
            const y = particle.y;
            const vector = this.field.calculateParticleVector(particle, width, height);
            if (!vector) {
                particle.age = maxAge;
            } else {
                const velocity = deltaTime / 1000;
                const tx = x + vector.u * velocityScale * velocity;
                const ty = y + vector.v * velocityScale * velocity;
                particle.tx = tx;
                particle.ty = ty;
                particle.m = vector.m;
                // if (this.field.isOutOfBounds(tx, ty))
                //     particle.age = maxAge;
            }
            particle.age++;
        });
    }

    _drawParticles() {
        const context = this.canvas.getContext('2d');
        context.globalCompositeOperation = 'destination-in';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        context.globalCompositeOperation = 'lighter';
        context.globalAlpha = this.options.globalAlpha;
        context.lineWidth = (isNumber(this.options.lineWidth) ? this.options.lineWidth : 1);
        context.strokeStyle = (isString(this.options.colors) ? this.options.colors : '#f00');
        if (this.field && this.particles.length > 0) {
            const range = this.field.valueRange;
            const minValue = getValidValue(this.options.minValue, range[0]);
            const maxValue = getValidValue(this.options.maxValue, range[1]);
            this.particles.forEach(particle => {
                this._drawParticle(context, particle, minValue, maxValue);
                particle.x = particle.tx;
                particle.y = particle.ty;
            });
        }
    }

    _drawParticle(context, particle, minValue, maxValue) {
        const width = this.canvas.width, height = this.canvas.height;
        const pixelCoords = this.field.calculateParticlePixelCoords(particle, width, height);
        context.beginPath();
        context.moveTo(pixelCoords[0], pixelCoords[1]);
        context.lineTo(pixelCoords[2], pixelCoords[3]);
        if (isFunction(this.options.colors)) {
            context.strokeStyle = this.options.colors(particle.m);
        } else if (isArray(this.options.colors)) {
            const colorIdx = indexFor(particle.m, minValue, maxValue, this.options.colors);
            context.strokeStyle = this.options.colors[colorIdx];
        }
        if (isFunction(this.options.lineWidth)) {
            context.lineWidth = this.options.lineWidth(particle.m);
        }
        context.stroke();
    }

    _render(deltaTime) {
        this._moveParticles(deltaTime);
        this._drawParticles();
    }

    update() {
        if (this.isStoped)
            return;
        if (this.options.useAnimationFrame)
            this.animationFrameHandle = requestAnimationFrame(this.update);
        if (this.needsPrepareParticles) {
            this.prepareParticles();
            this.needsPrepareParticles = false;
        }
        const newTime = now();
        const deltaTime = newTime - this._oldTime;
        if (deltaTime > this.options.frameDeltaTime) {
            this._oldTime = newTime;
            this._render(deltaTime);
            return true;
        }
        return false;
    }

    startRender() {
        if (this.isStarted)
            return;
        this.isStoped = false;
        this.isStarted = true;
        this._oldTime = now();
        this.update();
        return this;
    }

    stopRender() {
        if (isValid(this.animationFrameHandle))
            cancelAnimationFrame(this.animationFrameHandle);
        this.isStoped = true;
        this.isStarted = false;
        return this;
    }

    /**
     * 执行销毁
     */
    onDestroy() {
        this.stopRender();
        if (this.field)
            this.field.destroy();
    }
};

WindField.Vector = Vector;
WindField.Field = Field;
WindField.defaultOptions = defaultOptions;

export default WindField;
export {
    Vector, Field, defaultOptions, WindField,
};