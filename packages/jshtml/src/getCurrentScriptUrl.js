/**
 * 获取当前Script的完整网络地址
 * @returns {string|undefined}
 */
function getCurrentScriptUrl() {
    if (import.meta) {
        console.log('import.meta', import.meta);
        return import.meta.url;
    } else if (document.currentScript) {
        console.log('document.currentScript', document.currentScript);
        return document.currentScript.src;
    }
};

export default getCurrentScriptUrl;
export { getCurrentScriptUrl };