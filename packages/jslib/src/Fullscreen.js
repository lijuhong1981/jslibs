let _supportsFullscreen = undefined;
const _names = {
  requestFullscreen: undefined,
  exitFullscreen: undefined,
  fullscreenEnabled: undefined,
  fullscreenElement: undefined,
  fullscreenchange: undefined,
  fullscreenerror: undefined,
};

/**
 * 与标准全屏 API 配合使用的、不依赖具体浏览器的函数。
 *
 * @namespace Fullscreen
 *
 * @see {@link http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html|W3C Fullscreen Living Specification}
 */
const Fullscreen = {};

Object.defineProperties(Fullscreen, {
  /**
   * 当前处于全屏状态的元素（如果有的话）。若仅需判断浏览器是否
   * 处于全屏模式，请使用 {@link Fullscreen#fullscreen}。
   * @memberof Fullscreen
   * @type {Object}
   * @readonly
   */
  element: {
    get: function () {
      if (!Fullscreen.supportsFullscreen()) {
        return undefined;
      }

      return document[_names.fullscreenElement];
    },
  },

  /**
   * 当进入或退出全屏时在 document 上触发的事件的名称。该事件名
   * 旨在与 addEventListener 配合使用。在事件处理函数中，若需判断
   * 浏览器是否处于全屏模式，请使用 {@link Fullscreen#fullscreen}。
   * @memberof Fullscreen
   * @type {String}
   * @readonly
   */
  changeEventName: {
    get: function () {
      if (!Fullscreen.supportsFullscreen()) {
        return undefined;
      }

      return _names.fullscreenchange;
    },
  },

  /**
   * 发生全屏错误时触发的事件的名称。该事件名旨在与
   * addEventListener 配合使用。
   * @memberof Fullscreen
   * @type {String}
   * @readonly
   */
  errorEventName: {
    get: function () {
      if (!Fullscreen.supportsFullscreen()) {
        return undefined;
      }

      return _names.fullscreenerror;
    },
  },

  /**
   * 判断浏览器是否允许将某个元素设为全屏。例如，默认情况下，
   * iframe 无法进入全屏，除非包含它的页面添加了 "allowfullscreen"
   * 属性（或带前缀的等价属性）。
   * @memberof Fullscreen
   * @type {Boolean}
   * @readonly
   */
  enabled: {
    get: function () {
      if (!Fullscreen.supportsFullscreen()) {
        return undefined;
      }

      return document[_names.fullscreenEnabled];
    },
  },

  /**
   * 判断浏览器当前是否处于全屏模式。
   * @memberof Fullscreen
   * @type {Boolean}
   * @readonly
   */
  fullscreen: {
    get: function () {
      if (!Fullscreen.supportsFullscreen()) {
        return undefined;
      }

      return Fullscreen.element != null;
    },
  },
});

/**
 * 检测浏览器是否支持标准全屏 API。
 *
 * @returns {Boolean} 若浏览器支持标准全屏 API 则为 <code>true</code>，
 * 否则为 <code>false</code>。
 */
Fullscreen.supportsFullscreen = function () {
  if (_supportsFullscreen !== undefined) {
    return _supportsFullscreen;
  }

  _supportsFullscreen = false;

  const body = document.body;
  if (body && typeof body.requestFullscreen === "function") {
    // 采用无前缀的标准名称集合
    _names.requestFullscreen = "requestFullscreen";
    _names.exitFullscreen = "exitFullscreen";
    _names.fullscreenEnabled = "fullscreenEnabled";
    _names.fullscreenElement = "fullscreenElement";
    _names.fullscreenchange = "fullscreenchange";
    _names.fullscreenerror = "fullscreenerror";
    _supportsFullscreen = true;
    return _supportsFullscreen;
  }

  // 检查浏览器所使用的各种名称与前缀的正确组合
  const prefixes = ["webkit", "moz", "o", "ms", "khtml"];
  let name;
  for (let i = 0, len = prefixes.length; i < len; ++i) {
    const prefix = prefixes[i];

    // Fullscreen 的大小写在不同浏览器中各不相同
    name = `${prefix}RequestFullscreen`;
    if (typeof body[name] === "function") {
      _names.requestFullscreen = name;
      _supportsFullscreen = true;
    } else {
      name = `${prefix}RequestFullScreen`;
      if (typeof body[name] === "function") {
        _names.requestFullscreen = name;
        _supportsFullscreen = true;
      }
    }

    // 对于是按规范使用 "exit" 还是使用 "cancel" 存在分歧
    name = `${prefix}ExitFullscreen`;
    if (typeof document[name] === "function") {
      _names.exitFullscreen = name;
    } else {
      name = `${prefix}CancelFullScreen`;
      if (typeof document[name] === "function") {
        _names.exitFullscreen = name;
      }
    }

    // Fullscreen 的大小写在不同浏览器中各不相同
    name = `${prefix}FullscreenEnabled`;
    if (document[name] !== undefined) {
      _names.fullscreenEnabled = name;
    } else {
      name = `${prefix}FullScreenEnabled`;
      if (document[name] !== undefined) {
        _names.fullscreenEnabled = name;
      }
    }

    // Fullscreen 的大小写在不同浏览器中各不相同
    name = `${prefix}FullscreenElement`;
    if (document[name] !== undefined) {
      _names.fullscreenElement = name;
    } else {
      name = `${prefix}FullScreenElement`;
      if (document[name] !== undefined) {
        _names.fullscreenElement = name;
      }
    }

    // 还好，按规范事件名都是小写的
    name = `${prefix}fullscreenchange`;
    // 事件名前面没有 'on'，但 document 上的属性有
    if (document[`on${name}`] !== undefined) {
      //IE 浏览器除外
      if (prefix === "ms") {
        name = "MSFullscreenChange";
      }
      _names.fullscreenchange = name;
    }

    name = `${prefix}fullscreenerror`;
    if (document[`on${name}`] !== undefined) {
      //IE 浏览器除外
      if (prefix === "ms") {
        name = "MSFullscreenError";
      }
      _names.fullscreenerror = name;
    }
  }

  return _supportsFullscreen;
};

/**
 * 异步请求浏览器让指定元素进入全屏模式。
 * 如果浏览器不支持全屏模式，则不做任何操作。
 *
 * @param {Object} element 将要进入全屏模式的 HTML 元素。
 * @param {Object} [vrDevice] HMDVRDevice 设备。
 *
 * @example
 * // 让整个页面进入全屏。
 * Cesium.Fullscreen.requestFullscreen(document.body)
 *
 * // 仅让 Cesium 画布进入全屏。
 * Cesium.Fullscreen.requestFullscreen(scene.canvas)
 */
Fullscreen.requestFullscreen = function (element, vrDevice) {
  if (!Fullscreen.supportsFullscreen()) {
    return;
  }

  element[_names.requestFullscreen]({ vrDisplay: vrDevice });
};

/**
 * 异步退出全屏模式。如果浏览器当前未处于全屏状态，或者浏览器不支持
 * 全屏模式，则不做任何操作。
 */
Fullscreen.exitFullscreen = function () {
  if (!Fullscreen.supportsFullscreen()) {
    return;
  }

  document[_names.exitFullscreen]();
};

//用于单元测试
Fullscreen._names = _names;

export default Fullscreen;
export { Fullscreen };
