import Check from "@lijuhong1981/jscheck";
import { fetchArrayBuffer } from "@lijuhong1981/jsload";

// 转流数组
function byteToBitArr(bite) {
    let byteArr = [];
    for (let i = 7; i >= 0; i--) {
        byteArr.push(!!(bite & (1 << i)));
    }
    return byteArr;
};

// Generic functions
function bitsToNum(ba) {
    return ba.reduce(function (s, n) {
        return s * 2 + n;
    }, 0);
};

class Stream {
    constructor(data) {
        this.data = data;
        this.len = data.length;
        this.pos = 0;
    }

    readByte() {
        if (this.pos >= this.data.length) {
            throw new Error('Attempted to read past end of stream.');
        }
        if (this.data instanceof Uint8Array)
            return this.data[this.pos++];
        else
            return this.data.charCodeAt(this.pos++) & 0xFF;
    };

    readBytes(n) {
        let bytes = [];
        for (let i = 0; i < n; i++) {
            bytes.push(this.readByte());
        }
        return bytes;
    };

    read(n) {
        let chars = '';
        for (let i = 0; i < n; i++) {
            chars += String.fromCharCode(this.readByte());
        }
        return chars;
    };

    readUnsigned() { // Little-endian.
        let unsigned = this.readBytes(2);
        return (unsigned[1] << 8) + unsigned[0];
    };
};

function lzwDecode(minCodeSize, data) {
    // TODO: Now that the GIF parser is a bit different, maybe this should get an array of bytes instead of a String?
    let pos = 0; // Maybe this streaming thing should be merged with the Stream?

    function readCode(size) {
        let code = 0;
        for (let i = 0; i < size; i++) {
            if (data.charCodeAt(pos >> 3) & (1 << (pos & 7))) {
                code |= 1 << i;
            }
            pos++;
        }
        return code;
    };

    let output = [],
        clearCode = 1 << minCodeSize,
        eoiCode = clearCode + 1,
        codeSize = minCodeSize + 1,
        dict = [];

    function clear() {
        dict = [];
        codeSize = minCodeSize + 1;
        for (let i = 0; i < clearCode; i++) {
            dict[i] = [i];
        }
        dict[clearCode] = [];
        dict[eoiCode] = null;

    };

    let code = null, last = null;
    while (true) {
        last = code;
        code = readCode(codeSize);

        if (code === clearCode) {
            clear();
            continue;
        }
        if (code === eoiCode) {
            break
        };
        if (code < dict.length) {
            if (last !== clearCode) {
                dict.push(dict[last].concat(dict[code][0]));
            }
        }
        else {
            if (code !== dict.length) {
                throw new Error('Invalid LZW code.');
            }
            dict.push(dict[last].concat(dict[last][0]));
        }
        output.push.apply(output, dict[code]);

        if (dict.length === (1 << codeSize) && codeSize < 12) {
            // If we're at the last code and codeSize is 12, the next code will be a clearCode, and it'll be 12 bits long.
            codeSize++;
        }
    }
    return output;
};

const defaultOptions = {
    autoPlay: true,
    reverse: false,
    timeScale: 1.0,
};

function GifPlayer(options = {}) {
    options = Object.assign({}, defaultOptions, options);
    console.log('options:', options);
    const CANVAS = document.createElement("canvas");
    const CANVAS_CTX = CANVAS.getContext('2d');
    const TEMP_CANVAS = document.createElement("canvas");//用来拿 imageData 的工具人
    const TEMP_CANVAS_CTX = TEMP_CANVAS.getContext('2d', { willReadFrequently: true, }); // 工具人的 getContext('2d')
    const FRAME_LIST = []; // 存放每一帧以及对应的延时
    let GIF_INFO = {}; // GIF 的一些信息
    let STREAM = null;
    let LAST_DISPOSA_METHOD = null;
    let CURRENT_FRAME_INDEX = -1; //当前帧的下标
    let TRANSPARENCY = null;
    let isPlaying = false;
    let currentFrameIndex = 0;
    const player = {};

    function reset() {
        FRAME_LIST.length = 0;
        GIF_INFO = {};
        LAST_DISPOSA_METHOD = null;
        CURRENT_FRAME_INDEX = -1;
        TRANSPARENCY = null;
    };

    function readSubBlocks() {
        let size = null, data = '';
        do {
            size = STREAM.readByte();
            data += STREAM.read(size);
        } while (size !== 0);
        return data;
    };

    function doImg(img) {
        // if (!TEMP_CANVAS_CTX) {
        //     // 没有就创建
        //     TEMP_CANVAS_CTX = TEMP_CANVAS.getContext('2d');
        // }
        const currIdx = FRAME_LIST.length,
            ct = img.lctFlag ? img.lct : GIF_INFO.gct;
        if (currIdx > 0) {
            // 这块不要动
            if (LAST_DISPOSA_METHOD === 3) {
                // Restore to previous
                // If we disposed every TEMP_CANVAS_CTX including first TEMP_CANVAS_CTX up to this point, then we have
                // no composited TEMP_CANVAS_CTX to restore to. In this case, restore to background instead.
                if (CURRENT_FRAME_INDEX > -1) {
                    TEMP_CANVAS_CTX.putImageData(FRAME_LIST[CURRENT_FRAME_INDEX].data, 0, 0);
                } else {
                    TEMP_CANVAS_CTX.clearRect(0, 0, TEMP_CANVAS.width, TEMP_CANVAS.height);
                }
            } else {
                CURRENT_FRAME_INDEX = currIdx - 1;
            }

            if (LAST_DISPOSA_METHOD === 2) {
                // Restore to background color
                // Browser implementations historically restore to transparent; we do the same.
                // http://www.wizards-toolkit.org/discourse-server/viewtopic.php?f=1&t=21172#p86079
                TEMP_CANVAS_CTX.clearRect(0, 0, TEMP_CANVAS.width, TEMP_CANVAS.height);
            }
        }
        let imgData = TEMP_CANVAS_CTX.getImageData(img.leftPos, img.topPos, img.width, img.height);
        img.pixels.forEach(function (pixel, i) {
            if (pixel !== TRANSPARENCY) {
                imgData.data[i * 4 + 0] = ct[pixel][0];
                imgData.data[i * 4 + 1] = ct[pixel][1];
                imgData.data[i * 4 + 2] = ct[pixel][2];
                imgData.data[i * 4 + 3] = 255; // Opaque.
            }
        });

        TEMP_CANVAS_CTX.putImageData(imgData, img.leftPos, img.topPos);

        if (FRAME_LIST[CURRENT_FRAME_INDEX]) {
            FRAME_LIST[CURRENT_FRAME_INDEX].imgData = imgData;
            FRAME_LIST[CURRENT_FRAME_INDEX].leftPos = img.leftPos;
            FRAME_LIST[CURRENT_FRAME_INDEX].topPos = img.topPos;
            // console.log(CURRENT_FRAME_INDEX, FRAME_LIST[CURRENT_FRAME_INDEX]);
        }
    };

    function pushFrame(block) {
        // console.log('putFrame', block);
        // if (!TEMP_CANVAS_CTX) {
        //     return
        // };
        FRAME_LIST.push({ delayTime: block.delayTime });
    };

    // 解析
    function parseExt(block) {

        function parseGCExt(block) {
            STREAM.readByte(); // Always 4 这个必须得这样执行一次
            var bits = byteToBitArr(STREAM.readByte());
            block.reserved = bits.splice(0, 3); // Reserved; should be 000.

            block.disposalMethod = bitsToNum(bits.splice(0, 3));
            LAST_DISPOSA_METHOD = block.disposalMethod

            block.userInput = bits.shift();
            block.transparencyGiven = bits.shift();
            block.delayTime = STREAM.readUnsigned();
            block.transparencyIndex = STREAM.readByte();
            block.terminator = STREAM.readByte();
            pushFrame(block);
            TRANSPARENCY = block.transparencyGiven ? block.transparencyIndex : null;
        };

        function parseComExt(block) {
            block.comment = readSubBlocks();
        };

        function parsePTExt(block) {
            // No one *ever* uses this. If you use it, deal with parsing it yourself.
            STREAM.readByte(); // Always 12 这个必须得这样执行一次
            block.ptHeader = STREAM.readBytes(12);
            block.ptData = readSubBlocks();
        };

        function parseAppExt(block) {
            var parseNetscapeExt = function (block) {
                STREAM.readByte(); // Always 3 这个必须得这样执行一次
                block.unknown = STREAM.readByte(); // ??? Always 1? What is this?
                block.iterations = STREAM.readUnsigned();
                block.terminator = STREAM.readByte();
            };

            function parseUnknownAppExt(block) {
                block.appData = readSubBlocks();
                // FIXME: This won't work if a handler wants to match on any identifier.
                // handler.app && handler.app[block.identifier] && handler.app[block.identifier](block);
            };

            STREAM.readByte(); // Always 11 这个必须得这样执行一次
            block.identifier = STREAM.read(8);
            block.authCode = STREAM.read(3);
            switch (block.identifier) {
                case 'NETSCAPE':
                    parseNetscapeExt(block);
                    break;
                default:
                    parseUnknownAppExt(block);
                    break;
            }
        };

        function parseUnknownExt(block) {
            block.data = readSubBlocks();
        };

        block.label = STREAM.readByte();
        switch (block.label) {
            case 0xF9:
                block.extType = 'gce';
                parseGCExt(block);
                break;
            case 0xFE:
                block.extType = 'com';
                parseComExt(block);
                break;
            case 0x01:
                block.extType = 'pte';
                parsePTExt(block);
                break;
            case 0xFF:
                block.extType = 'app';
                parseAppExt(block);
                break;
            default:
                block.extType = 'unknown';
                parseUnknownExt(block);
                break;
        }

        // console.log('parseExt:', block);
    };

    function parseImg(img) {

        function deinterlace(pixels, width) {
            // Of course this defeats the purpose of interlacing. And it's *probably*
            // the least efficient way it's ever been implemented. But nevertheless...
            let newPixels = new Array(pixels.length);
            const rows = pixels.length / width;

            function cpRow(toRow, fromRow) {
                const fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
                newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
            };

            // See appendix E.
            const offsets = [0, 4, 2, 1],
                steps = [8, 8, 4, 2];

            let fromRow = 0;
            for (var pass = 0; pass < 4; pass++) {
                for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
                    cpRow(toRow, fromRow)
                    fromRow++;
                }
            }

            return newPixels;
        };

        img.leftPos = STREAM.readUnsigned();
        img.topPos = STREAM.readUnsigned();
        img.width = STREAM.readUnsigned();
        img.height = STREAM.readUnsigned();

        let bits = byteToBitArr(STREAM.readByte());
        img.lctFlag = bits.shift();
        img.interlaced = bits.shift();
        img.sorted = bits.shift();
        img.reserved = bits.splice(0, 2);
        img.lctSize = bitsToNum(bits.splice(0, 3));

        if (img.lctFlag) {
            img.lct = parseCT(1 << (img.lctSize + 1));
        }

        img.lzwMinCodeSize = STREAM.readByte();

        const lzwData = readSubBlocks();

        img.pixels = lzwDecode(img.lzwMinCodeSize, lzwData);

        if (img.interlaced) { // Move
            img.pixels = deinterlace(img.pixels, img.width);
        }

        doImg(img);

        // console.log('parseImg', CURRENT_FRAME_INDEX, img);
    };

    // LZW (GIF-specific)
    function parseCT(entries) { // Each entry is 3 bytes, for RGB.
        let ct = [];
        for (let i = 0; i < entries; i++) {
            ct.push(STREAM.readBytes(3));
        }
        return ct;
    };

    function parseHeader() {
        GIF_INFO.sig = STREAM.read(3);
        GIF_INFO.ver = STREAM.read(3);
        if (GIF_INFO.sig !== 'GIF') throw new Error('Not a GIF file.'); // XXX: This should probably be handled more nicely.
        GIF_INFO.width = STREAM.readUnsigned();
        GIF_INFO.height = STREAM.readUnsigned();

        let bits = byteToBitArr(STREAM.readByte());
        GIF_INFO.gctFlag = bits.shift();
        GIF_INFO.colorRes = bitsToNum(bits.splice(0, 3));
        GIF_INFO.sorted = bits.shift();
        GIF_INFO.gctSize = bitsToNum(bits.splice(0, 3));

        GIF_INFO.bgColor = STREAM.readByte();
        GIF_INFO.pixelAspectRatio = STREAM.readByte(); // if not 0, aspectRatio = (pixelAspectRatio + 15) / 64
        if (GIF_INFO.gctFlag) {
            GIF_INFO.gct = parseCT(1 << (GIF_INFO.gctSize + 1));
        }
        // console.log('parseHeader:', GIF_INFO);

        // 给 CANVAS、TEMP_CANVAS 设置大小
        CANVAS.width = TEMP_CANVAS.width = GIF_INFO.width;
        CANVAS.height = TEMP_CANVAS.height = GIF_INFO.height;
        CANVAS.style.width = TEMP_CANVAS.style.width = GIF_INFO.width + 'px';
        CANVAS.style.height = TEMP_CANVAS.style.height = GIF_INFO.height + 'px';
        TEMP_CANVAS_CTX.setTransform(1, 0, 0, 1, 0, 0);
    };

    function parseBlock() {
        let block = {};
        block.sentinel = STREAM.readByte();
        switch (String.fromCharCode(block.sentinel)) { // For ease of matching
            case '!':
                block.type = 'ext';
                parseExt(block);
                break;
            case ',':
                block.type = 'img';
                parseImg(block);
                break;
            case ';':
                block.type = 'eof';
                // 结束
                break;
            default:
                throw new Error('Unknown block: 0x' + block.sentinel.toString(16)); // TODO: Pad this with a 0.
        }

        // 递归
        if (block.type !== 'eof') {
            parseBlock();
        }
    };

    function getNextFrameIndex() {
        if (currentFrameIndex === -1)
            return options.reverse ? FRAME_LIST.length - 1 : 0;
        const delta = (options.reverse ? -1 : 1);
        return (currentFrameIndex + delta + FRAME_LIST.length) % FRAME_LIST.length;
    }

    function drawFrame(frame) {
        TEMP_CANVAS_CTX.putImageData(frame.imgData, 0, 0);
        CANVAS_CTX.globalCompositeOperation = "copy";
        CANVAS_CTX.drawImage(TEMP_CANVAS, 0, 0);
    }

    function doCurrentFrame() {
        const frame = FRAME_LIST[currentFrameIndex];
        drawFrame(frame);
        setTimeout(function () {
            if (!isPlaying)
                return;
            currentFrameIndex = getNextFrameIndex();
            doCurrentFrame();
        }, frame.delayTime * options.timeScale * 10);
    }

    // 播放gif
    function playGif() {
        if (isPlaying)
            return;

        isPlaying = true;

        doCurrentFrame();

        return player;
    }

    function pauseGif() {
        isPlaying = false;

        return player;
    }

    function stopGif() {
        isPlaying = false;

        currentFrameIndex = 0;

        return player;
    }

    function loadData(data) {
        Check.defined('data', data);

        return new Promise(function (resolve, reject) {
            try {
                if (data instanceof ArrayBuffer)
                    data = new Uint8Array(arraybuffer);
                STREAM = new Stream(data);
                reset();
                parseHeader();
                parseBlock();
                stopGif();
                if (options.autoPlay)
                    playGif();
                resolve(player);
            } catch (error) {
                reject(error);
            }
        });
    }

    // 用xhr请求本地文件
    function loadUrl(url, requestOptions) {
        Check.typeOf.string('url', url);

        return new Promise(function (resolve, reject) {
            fetchArrayBuffer(url, requestOptions).then(function (arraybuffer) {
                loadData(arraybuffer).then(resolve).catch(reject);
            }).catch(reject);
        });
    }

    Object.defineProperties(player, {
        loadData: {
            value: loadData,
        },
        loadUrl: {
            value: loadUrl,
        },
        play: {
            value: playGif,
        },
        pause: {
            value: pauseGif,
        },
        stop: {
            value: stopGif,
        },
        canvas: {
            get: function () {
                return CANVAS;
            },
        },
        framesNumber: {
            get: function () {
                return FRAME_LIST.length;
            }
        },
        currentFrameIndex: {
            set: function (value) {
                if (!FRAME_LIST[value])
                    throw new Error('illegal index: ' + value);
                currentFrameIndex = value;
            },
            get: function () {
                return currentFrameIndex;
            }
        },
        reverse: {
            set: function (value) {
                Check.typeOf.bool('reverse', value);
                options.reverse = value;
            },
            get: function () {
                return options.reverse;
            }
        },
        timeScale: {
            set: function (value) {
                Check.typeOf.number.greaterThan('timeScale', value, 0);
                options.timeScale = value;
            },
            get: function () {
                return options.timeScale;
            }
        },
    });

    return player;
};

export default GifPlayer;