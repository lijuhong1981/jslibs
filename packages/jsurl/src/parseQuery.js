const queryPattern = /(?:^|&)([^&=]*)=?([^&]*)/g;

/**
 * 解析urlQuery字符串中的参数
 * @param {string} urlQuery
 * @param {object} result
 * @returns {object}
 */
function parseQuery(urlQuery, result = {}) {
    urlQuery.replace(queryPattern, function (match, key, value) {
        if (key)
            result[key] = value;
    });
};

export default parseQuery;