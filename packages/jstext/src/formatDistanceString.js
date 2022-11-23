/**
 * 格式化米距离为带单位的文本
 * @param {Number} distance 距离数值，单位米
 * @param {Number} fractionDigits 保留的小数位数，默认值2
 * @returns {String} 格式化后的文本
 */
function formatDistanceString(distance, fractionDigits = 2) {
    if (distance < 1000) {
        return distance.toFixed(fractionDigits) + '米';
    } else {
        return (distance / 1000).toFixed(fractionDigits) + '公里';
    }
};

export default formatDistanceString;