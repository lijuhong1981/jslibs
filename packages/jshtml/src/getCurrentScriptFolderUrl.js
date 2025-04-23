import getCurrentScriptUrl from "./getCurrentScriptUrl.js";

/**
 * 获取当前Script的文件夹网络地址
 * @returns {string|undefined}
 */
function getCurrentScriptFolderUrl() {
    const url = getCurrentScriptUrl();
    if (url)
        return url.substring(0, url.lastIndexOf("/") + 1);
}

export default getCurrentScriptFolderUrl;
export { getCurrentScriptFolderUrl }