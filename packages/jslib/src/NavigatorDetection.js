import defined from "@lijuhong1981/jscheck/src/isDefined.js";
import Fullscreen from "./Fullscreen.js";

let theNavigator;
if (typeof navigator !== "undefined") {
    theNavigator = navigator;
} else {
    theNavigator = {};
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
        // Edge contains Chrome in the user agent too
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

        // Chrome and Edge contain Safari in the user agent too
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
            navigator.platform === "iPhone" ||
            navigator.platform === "iPod" ||
            navigator.platform === "iPad";
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
        //While navigator.pointerEnabled is deprecated in the W3C specification
        //we still need to use it if it exists in order to support browsers
        //that rely on it, such as the Windows WebBrowser control which defines
        //PointerEvent but sets navigator.pointerEnabled to false.

        //Firefox disabled because of https://github.com/CesiumGS/cesium/issues/6372
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
        //canvas.style.imageRendering will be undefined, null or an empty string on unsupported browsers.
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
    // From https://developers.google.com/speed/webp/faq#how_can_i_detect_browser_support_for_webp
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
 * A set of functions to detect whether the current browser supports
 * various features.
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
 * Detects whether the current browser supports Basis Universal textures and the web assembly modules needed to transcode them.
 *
 * @param {Scene} scene
 * @returns {boolean} true if the browser supports web assembly modules and the scene supports Basis Universal textures, false if not.
 */
NavigatorDetection.supportsBasis = function (scene) {
    return NavigatorDetection.supportsWebAssembly() && scene.context.supportsBasis;
};

/**
 * Detects whether the current browser supports the full screen standard.
 *
 * @returns {boolean} true if the browser supports the full screen standard, false if not.
 *
 * @see Fullscreen
 * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
 */
NavigatorDetection.supportsFullscreen = function () {
    return Fullscreen.supportsFullscreen();
};

/**
 * Detects whether the current browser supports typed arrays.
 *
 * @returns {boolean} true if the browser supports typed arrays, false if not.
 *
 * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
 */
NavigatorDetection.supportsTypedArrays = function () {
    return typeof ArrayBuffer !== "undefined";
};

/**
 * Detects whether the current browser supports BigInt64Array typed arrays.
 *
 * @returns {boolean} true if the browser supports BigInt64Array typed arrays, false if not.
 *
 * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
 */
NavigatorDetection.supportsBigInt64Array = function () {
    return typeof BigInt64Array !== "undefined";
};

/**
 * Detects whether the current browser supports BigUint64Array typed arrays.
 *
 * @returns {boolean} true if the browser supports BigUint64Array typed arrays, false if not.
 *
 * @see {@link https://tc39.es/ecma262/#sec-typedarray-objects|Typed Array Specification}
 */
NavigatorDetection.supportsBigUint64Array = function () {
    return typeof BigUint64Array !== "undefined";
};

/**
 * Detects whether the current browser supports BigInt.
 *
 * @returns {boolean} true if the browser supports BigInt, false if not.
 *
 * @see {@link https://tc39.es/ecma262/#sec-bigint-objects|BigInt Specification}
 */
NavigatorDetection.supportsBigInt = function () {
    return typeof BigInt !== "undefined";
};

/**
 * Detects whether the current browser supports Web Workers.
 *
 * @returns {boolean} true if the browsers supports Web Workers, false if not.
 *
 * @see {@link http://www.w3.org/TR/workers/}
 */
NavigatorDetection.supportsWebWorkers = function () {
    return typeof Worker !== "undefined";
};

/**
 * Detects whether the current browser supports Web Assembly.
 *
 * @returns {boolean} true if the browsers supports Web Assembly, false if not.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/WebAssembly}
 */
NavigatorDetection.supportsWebAssembly = function () {
    return typeof WebAssembly !== "undefined";
};

/**
 * Detects whether the current browser supports ECMAScript modules in web workers.
 * @returns {boolean} true if the browser supports ECMAScript modules in web workers.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Worker|Worker}
 */
NavigatorDetection.supportsEsmWebWorkers = function () {
  return !isFirefox() || parseInt(firefoxVersionResult) >= 114;
};

export default NavigatorDetection;
export { NavigatorDetection };
