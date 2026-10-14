/**
 * 获取当前Script的完整网络地址
 * @returns {string|undefined}
 */
function getCurrentScriptUrl() {
    return import.meta.url;
};

export default getCurrentScriptUrl;
export { getCurrentScriptUrl };