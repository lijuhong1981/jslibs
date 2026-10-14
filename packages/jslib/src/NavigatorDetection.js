import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import Fullscreen from "./Fullscreen.js";

let theNavigator;
if (typeof navigator !== "undefined") {
    theNavigator = navigator;
} else {
    theNavigator = { userAgent: "", platform: "" };
}

function extractVersion(versionString) {
    const parts = versionString.split(".");
    for (let i = 0, len = parts.length; i < len; ++i) {
        parts[i] = parseInt(parts[i], 10);
    }
    return parts;
}

let isChromeResult;
let chromeVersionResult;
function isChrome() {
    if (!defined(isChromeResult)) {
        isChromeResult = false;
        // Edge 的 user agent 中也包含 Chrome
        if (!isEdge()) {
            const fields = / Chrome\/([\.0-9]+)/.exec(theNavigator.userAgent);
            if (fields !== null) {
                isChromeResult = true;
                chromeVersionResult = extractVersion(fields[1]);
            }
        }
    }

    return isChromeResult;
}

function chromeVersion() {
    return isChrome() && chromeVersionResult;
}

let isSafariResult;
let safariVersionResult;
function isSafari() {
    if (!defined(isSafariResult)) {
        isSafariResult = false;

        // Chrome 和 Edge 的 user agent 中也包含 Safari
        if (
            !isChrome() &&
            !isEdge() &&
            / Safari\/[\.0-9]+/.test(theNavigator.userAgent)
        ) {
            const fields = / Version\/([\.0-9]+)/.exec(theNavigator.userAgent);
            if (fields !== null) {
                isSafariResult = true;
                safariVersionResult = extractVersion(fields[1]);
            }
        }
    }

    return isSafariResult;
}

function safariVersion() {
    return isSafari() && safariVersionResult;
}

let isWebkitResult;
let webkitVersionResult;
function isWebkit() {
    if (!defined(isWebkitResult)) {
        isWebkitResult = false;

        const fields = / AppleWebKit\/([\.0-9]+)(\+?)/.exec(theNavigator.userAgent);
        if (fields !== null) {
            isWebkitResult = true;
            webkitVersionResult = extractVersion(fields[1]);
            webkitVersionResult.isNightly = !!fields[2];
        }
    }

    return isWebkitResult;
}

function webkitVersion() {
    return isWebkit() && webkitVersionResult;
}

let isInternetExplorerResult;
let internetExplorerVersionResult;
function isInternetExplorer() {
    if (!defined(isInternetExplorerResult)) {
        isInternetExplorerResult = false;

        let fields;
        if (theNavigator.appName === "Microsoft Internet Explorer") {
            fields = /MSIE ([0-9]{1,}[\.0-9]{0,})/.exec(theNavigator.userAgent);
            if (fields !== null) {
                isInternetExplorerResult = true;
                internetExplorerVersionResult = extractVersion(fields[1]);
            }
        } else if (theNavigator.appName === "Netscape") {
            fields = /Trident\/.*rv:([0-9]{1,}[\.0-9]{0,})/.exec(
                theNavigator.userAgent,
            );
            if (fields !== null) {
                isInternetExplorerResult = true;
                internetExplorerVersionResult = extractVersion(fields[1]);
            }
        }
    }
    return isInternetExplorerResult;
}

function internetExplorerVersion() {
    return isInternetExplorer() && internetExplorerVersionResult;
}

let isEdgeResult;
let edgeVersionResult;
function isEdge() {
    if (!defined(isEdgeResult)) {
        isEdgeResult = false;
        const fields = / Edg\/([\.0-9]+)/.exec(theNavigator.userAgent);
        if (fields !== null) {
            isEdgeResult = true;
            edgeVersionResult = extractVersion(fields[1]);
        }
    }
    return isEdgeResult;
}

function edgeVersion() {
    return isEdge() && edgeVersionResult;
}

let isFirefoxResult;
let firefoxVersionResult;
function isFirefox() {
    if (!defined(isFirefoxResult)) {
        isFirefoxResult = false;

        const fields = /Firefox\/([\.0-9]+)/.exec(theNavigator.userAgent);
        if (fields !== null) {
            isFirefoxResult = true;
            firefoxVersionResult = extractVersion(fields[1]);
        }
    }
    return isFirefoxResult;
}

let isWindowsResult;
function isWindows() {
    if (!defined(isWindowsResult)) {
        isWindowsResult = /Windows/i.test(theNavigator.appVersion);
    }
    return isWindowsResult;
}

let isIPadOrIOSResult;
function isIPadOrIOS() {
    if (!defined(isIPadOrIOSResult)) {
        isIPadOrIOSResult =
            theNavigator.platform === "iPhone" ||
            theNavigator.platform === "iPod" ||
            theNavigator.platform === "iPad";
    }

    return isIPadOrIOSResult;
}

function firefoxVersion() {
    return isFirefox() && firefoxVersionResult;
}

let isIPadResult;
function isIPad() {
    if (!defined(isIPadResult)) {
        isIPadResult = /ipad/i.test(theNavigator.userAgent.toLowerCase());
    }
    return isIPadResult;
}

let isIPodResult;
function isIPod() {
    if (!defined(isIPodResult)) {
        isIPodResult = /ipod/i.test(theNavigator.userAgent.toLowerCase());
    }
    return isIPodResult;
}

let isIPhoneResult;
function isIPhone() {
    if (!defined(isIPhoneResult)) {
        isIPhoneResult = /iphone os/i.test(theNavigator.userAgent.toLowerCase());
    }
    return isIPhoneResult;
}

let isAndroidResult;
function isAndroid() {
    if (!defined(isAndroidResult)) {
        isAndroidResult = /android/i.test(theNavigator.userAgent.toLowerCase());
    }
    return isAndroidResult;
}

let isWindowsCEResult;
function isWindowsCE() {
    if (!defined(isWindowsCEResult)) {
        isWindowsCEResult = /windows ce/i.test(theNavigator.userAgent.toLowerCase());
    }
    return isWindowsCEResult;
}

let isWindowsMobileResult;
function isWindowsMobile() {
    if (!defined(isWindowsMobileResult)) {
        isWindowsMobileResult = /windows mobile/i.test(theNavigator.userAgent.toLowerCase());
    }
    return isWindowsMobileResult;
}

let isWindowsPhoneResult;
function isWindowsPhone() {
    if (!defined(isWindowsPhoneResult)) {
        isWindowsPhoneResult = /windows phone/i.test(theNavigator.userAgent.toLowerCase());
    }
    return isWindowsPhoneResult;
}

let isMobileResult;
function isMobile() {
    if (!defined(isMobileResult)) {
        isMobileResult = isIPad() || isIPod() || isIPhone() || isAndroid() || isWindowsCE() || isWindowsMobile() || isWindowsPhone();
    }
    return isMobileResult;
}

let hasPointerEvents;
function supportsPointerEvents() {
    if (!defined(hasPointerEvents)) {
        //虽然 navigator.pointerEnabled 在 W3C 规范中已被废弃，
        //但在其存在时我们仍需要使用它，以兼容依赖该属性的浏览器，
        //例如 Windows WebBrowser 控件，它定义了 PointerEvent
        //却将 navigator.pointerEnabled 设置为 false。

        //Firefox 被禁用，原因参见 https://github.com/CesiumGS/cesium/issues/6372
        hasPointerEvents =
            !isFirefox() &&
            typeof PointerEvent !== "undefined" &&
            (!defined(theNavigator.pointerEnabled) || theNavigator.pointerEnabled);
    }
    return hasPointerEvents;
}

let hasTouchEvents;
function supportsTouchEvents() {
    if (!defined(hasTouchEvents)) {
        hasTouchEvents = typeof TouchEvent !== "undefined" &&
            "ontouchend" in document ? true : false;
    }
    return hasTouchEvents;
}

let imageRenderingValueResult;
let supportsImageRenderingPixelatedResult;
function supportsImageRenderingPixelated() {
    if (!defined(supportsImageRenderingPixelatedResult)) {
        const canvas = document.createElement("canvas");
        canvas.setAttribute(
            "style",
            "image-rendering: -moz-crisp-edges;" + "image-rendering: pixelated;",
        );
        //在不支持该特性的浏览器上，canvas.style.imageRendering 将为 undefined、null 或空字符串。
        const tmp = canvas.style.imageRendering;
        supportsImageRenderingPixelatedResult = defined(tmp) && tmp !== "";
        if (supportsImageRenderingPixelatedResult) {
            imageRenderingValueResult = tmp;
        }
    }
    return supportsImageRenderingPixelatedResult;
}

function imageRenderingValue() {
    return supportsImageRenderingPixelated()
        ? imageRenderingValueResult
        : undefined;
}

function supportsWebP() {
    //>>includeStart('debug', pragmas.debug);
    if (!supportsWebP.initialized) {
        throw new Error(
            "You must call NavigatorDetection.supportsWebP.initialize and wait for the promise to resolve before calling NavigatorDetection.supportsWebP",
        );
    }
    //>>includeEnd('debug');
    return supportsWebP._result;
}
supportsWebP._promise = undefined;
supportsWebP._result = undefined;
supportsWebP.initialize = function () {
    // 来源：https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
    if (defined(supportsWebP._promise)) {
        return supportsWebP._promise;
    }

    supportsWebP._promise = new Promise((resolve) => {
        const image = new Image();
        image.onload = function () {
            supportsWebP._result = image.width > 0 && image.height > 0;
            resolve(supportsWebP._result);
        };

        image.onerror = function () {
            supportsWebP._result = false;
            resolve(supportsWebP._result);
        };
        image.src =
            "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA";
    });

    return supportsWebP._promise;
};
Object.defineProperties(supportsWebP, {
    initialized: {
        get: function () {
            return defined(supportsWebP._result);
        },
    },
});

const typedArrayTypes = [];
if (typeof ArrayBuffer !== "undefined") {
    typedArrayTypes.push(
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
    );

    if (typeof Uint8ClampedArray !== "undefined") {
        typedArrayTypes.push(Uint8ClampedArray);
    }

    if (typeof BigInt64Array !== "undefined") {
        // eslint-disable-next-line no-undef
        typedArrayTypes.push(BigInt64Array);
    }

    if (typeof BigUint64Array !== "undefined") {
        // eslint-disable-next-line no-undef
        typedArrayTypes.push(BigUint64Array);
    }
}

/**
 * 一组用于检测当前浏览器是否支持各种特性的函数。
 *
 * @namespace NavigatorDetection
 */
const NavigatorDetection = {
    isChrome: isChrome,
    chromeVersion: chromeVersion,
    isSafari: isSafari,
    safariVersion: safariVersion,
    isWebkit: isWebkit,
    webkitVersion: webkitVersion,
    isInternetExplorer: isInternetExplorer,
    internetExplorerVersion: internetExplorerVersion,
    isEdge: isEdge,
    edgeVersion: edgeVersion,
    isFirefox: isFirefox,
    firefoxVersion: firefoxVersion,
    isWindows: isWindows,
    isIPadOrIOS: isIPadOrIOS,
    isIPad: isIPad,
    isIPod: isIPod,
    isIPhone: isIPhone,
    isAndroid: isAndroid,
    isWindowsCE: isWindowsCE,
    isWindowsMobile: isWindowsMobile,
    isWindowsPhone: isWindowsPhone,
    isMobile: isMobile,
    hardwareConcurrency: theNavigator.hardwareConcurrency || 3,
    supportsPointerEvents: supportsPointerEvents,
    supportsTouchEvents: supportsTouchEvents,
    supportsImageRenderingPixelated: supportsImageRenderingPixelated,
    supportsWebP: supportsWebP,
    imageRenderingValue: imageRenderingValue,
    typedArrayTypes: typedArrayTypes,
};

/**
 * 检测当前浏览器是否支持 Basis Universal 纹理以及转码所需的 WebAssembly 模块。
 *
 * @param {Scene} scene
 * @returns {boolean} 如果浏览器支持 WebAssembly 模块且场景支持 Basis Universal 纹理则返回 true，否则返回 false。
 */
NavigatorDetection.supportsBasis = function (scene) {
    return NavigatorDetection.supportsWebAssembly() && scene.context.supportsBasis;
};

/**
 * 检测当前浏览器是否支持全屏标准。
 *
 * @returns {boolean} 如果浏览器支持全屏标准则返回 true，否则返回 false。
 *
 * @see Fullscreen
 * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
 */
NavigatorDetection.supportsFullscreen = function () {
    return Fullscreen.supportsFullscreen();
};

/**
 * 检测当前浏览器是否支持类型化数组。
 *
 * @returns {boolean} 如果浏览器支持类型化数组则返回 true，否则返回 false。
 *
 * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
 */
NavigatorDetection.supportsTypedArrays = function () {
    return typeof ArrayBuffer !== "undefined";
};

/**
 * 检测当前浏览器是否支持 BigInt64Array 类型化数组。
 *
 * @returns {boolean} 如果浏览器支持 BigInt64Array 类型化数组则返回 true，否则返回 false。
 *
 * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
 */
NavigatorDetection.supportsBigInt64Array = function () {
    return typeof BigInt64Array !== "undefined";
};

/**
 * 检测当前浏览器是否支持 BigUint64Array 类型化数组。
 *
 * @returns {boolean} 如果浏览器支持 BigUint64Array 类型化数组则返回 true，否则返回 false。
 *
 * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
 */
NavigatorDetection.supportsBigUint64Array = function () {
    return typeof BigUint64Array !== "undefined";
};

/**
 * 检测当前浏览器是否支持 BigInt。
 *
 * @returns {boolean} 如果浏览器支持 BigInt 则返回 true，否则返回 false。
 *
 * @see {@link https://tc39.es/ecma262/#sec-bigint-objects|BigInt Specification}
 */
NavigatorDetection.supportsBigInt = function () {
    return typeof BigInt !== "undefined";
};

/**
 * 检测当前浏览器是否支持 Web Workers。
 *
 * @returns {boolean} 如果浏览器支持 Web Workers 则返回 true，否则返回 false。
 *
 * @see {@link http://www.w3.org/TR/workers/}
 */
NavigatorDetection.supportsWebWorkers = function () {
    return typeof Worker !== "undefined";
};

/**
 * 检测当前浏览器是否支持 Web Assembly。
 *
 * @returns {boolean} 如果浏览器支持 Web Assembly 则返回 true，否则返回 false。
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/WebAssembly}
 */
NavigatorDetection.supportsWebAssembly = function () {
    return typeof WebAssembly !== "undefined";
};

/**
 * 检测当前浏览器是否支持在 Web Worker 中使用 ECMAScript 模块。
 * @returns {boolean} 如果浏览器支持在 Web Worker 中使用 ECMAScript 模块则返回 true。
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Worker|Worker}
 */
NavigatorDetection.supportsEsmWebWorkers = function () {
    return !isFirefox() || parseInt(firefoxVersionResult) >= 114;
};

let supportsWebGLResult;
/**
 * 检测当前浏览器是否支持 WebGL。
 * @returns {boolean} 如果浏览器支持 WebGL 则返回 true，否则返回 false。
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext}
 */
NavigatorDetection.supportsWebGL = function () {
    if (!defined(supportsWebGLResult)) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        supportsWebGLResult = defined(context);
        canvas.width = canvas.height = 0;
    }
    return supportsWebGLResult;
};

let supportsWebGL2Result;
/**
 * 检测当前浏览器是否支持 WebGL2。
 * @returns {boolean} 如果浏览器支持 WebGL2 则返回 true，否则返回 false。
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/WebGL2RenderingContext}
 */
NavigatorDetection.supportsWebGL2 = function () {
    if (!defined(supportsWebGL2Result)) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("webgl2");
        supportsWebGL2Result = defined(context);
        canvas.width = canvas.height = 0;
    }
    return supportsWebGL2Result;
};

/**
 * 检测当前浏览器是否支持 WebGPU。
 * @returns {boolean} 如果浏览器支持 WebGPU 则返回 true，否则返回 false。
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Navigator/gpu}
 */
NavigatorDetection.supportsWebGPU = function () {
    return defined(theNavigator.gpu);
};

export default NavigatorDetection;
export { NavigatorDetection };
