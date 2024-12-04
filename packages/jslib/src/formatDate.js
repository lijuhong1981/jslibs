/**
 * 日期格式化
 * @param {string|undefined} formatString 格式化字符串，不填则默认使用'yyyy-MM-dd HH:mm:ss'
 * @param {Date|undefined} date 日期对象，不填则默认使用当前日期
 * @returns {string}
 */
function formatDate(formatString = 'yyyy-MM-dd HH:mm:ss', date = new Date()) {
    const values = {
        "y+": '' + date.getFullYear(),
        "M+": '' + (date.getMonth() + 1), // 月份
        "d+": '' + date.getDate(), //日
        "H+": '' + date.getHours(), //24小时制
        "h+": '' + (date.getHours() % 12 === 0 ? 12 : date.getHours() % 12), //12小时制  
        "m+": '' + date.getMinutes(), //分
        "s+": '' + date.getSeconds(), //秒
        "q+": '' + Math.floor((date.getMonth() + 3) / 3), //季度
        "S": '' + date.getMilliseconds()  //毫秒
    };
    for (const key in values) {
        const regex = new RegExp('(' + key + ')');
        const result = regex.exec(formatString);
        if (result) {
            let value = values[key];
            while (value.length < result[1].length) {
                value = '0' + value;
            }
            formatString = formatString.replace(result[1], value.substring(value.length - result[1].length));
        }
    }
    return formatString;
}

export default formatDate;