const ARE = 100;               // 公亩 = 100 平方米
const HECTARE = 10000;         // 公顷 = 10000 平方米
const SQUARE_KILOMETER = 1000000; // 平方公里 = 1000000 平方米

/**
 * 格式化平方米面积为带单位的文本
 * @param {Number} area 面积数值，单位平方米
 * @param {Number} fractionDigits 保留的小数位数，默认值2
 * @returns {String} 格式化后的文本
 */
function formatAreaString(area, fractionDigits = 2) {
    if (area < ARE)
        return area.toFixed(fractionDigits) + '平方米';
    else if (area < HECTARE)
        return (area / ARE).toFixed(fractionDigits) + '公亩';
    else if (area < SQUARE_KILOMETER)
        return (area / HECTARE).toFixed(fractionDigits) + '公顷';
    else
        return (area / SQUARE_KILOMETER).toFixed(fractionDigits) + '平方公里';
};

export default formatAreaString;
export { formatAreaString };
