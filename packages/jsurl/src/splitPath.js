// 用于将路径拆分为 [path, dir, root, fullname, basename, ext] 的正则
const splitPattern =
    /^(((?:[a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?[\\\/]?)(?:[^\\\/]*[\\\/])*)((\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))[\\\/]*$/;

/**
 * 使用正则表达式把一个path解析为[path, directory, root, fullname, basename, extname]数组
 * @param {String} path 传入的path
 * @returns {Array} 解析结果数组
 */
function splitPath(path) {
    return splitPattern.exec(path);
};

export default splitPath;
export { splitPath };