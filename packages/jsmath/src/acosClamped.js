import clamp from "./clamp";

/**
 * 计算一个数值的反余弦值，并将输入值约束在-1到1之间
 * @param {number} value 需要计算反余弦值的数值
 * @return {number} 反余弦值 
*/
function acosClamped(value) {
    return Math.acos(clamp(value, -1.0, 1.0));
};

export default acosClamped;
export { acosClamped };