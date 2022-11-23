const CUBE_KILOMETER = 1000 * 1000 * 1000;

/**
 * 格式化立方米体积为带单位的文本
 * @param {Number} volume 体积数值，单位立方米
 * @param {Number} fractionDigits 保留的小数位数，默认值2
 * @returns {Number} 格式化后的文本
 */
function formatVolumeString(volume, fractionDigits = 2) {
    if (volume < CUBE_KILOMETER)
        return volume.toFixed(fractionDigits) + '立方米';
    else
        return (volume / CUBE_KILOMETER).toFixed(fractionDigits) + '立方千米';
};

export default formatVolumeString;