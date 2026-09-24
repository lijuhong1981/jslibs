# @lijuhong1981/jsmath

> 数学工具集，涵盖插值、夹取、角度/弧度换算、经纬度范围、NDC 坐标转换、随机数与数值解析。

## 安装

```bash
npm install @lijuhong1981/jsmath
```

## 导出

- **夹取/范围**：`clamp`、`clampLatitude`、`clampLongitude`、`scalarInRange`、`isBetween`、`convertToRange`
- **角度换算**：`degreesToRadians`、`radiansToDegrees`、`convertToDegreesCircular`、`convertToRadiansCircular`
- **经纬度范围**：`convertToLatitudeRange`、`convertToLongitudeRange`
- **插值**：`lerp`
- **坐标转换**：`getNDCInElement`、`ndcToWindowPosition`、`windowPositionToNDC`
- **数值处理**：`normalize`、`toFixed`、`extractFraction`、`acosClamped`、`equalsEpsilon`
- **随机数**：`randomNumber`、`randomInteger`
- **解析**：`parseBoolean`、`parseNumber`
- **类/常量**：`Interval`、`Constant`（命名空间导出）
