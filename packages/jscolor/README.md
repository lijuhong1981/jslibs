# @lijuhong1981/jscolor

> 颜色工具集，提供 `ColorRGB`/`ColorRGBA` 颜色类、颜色渐变、HSL 换算与颜色字符串解析。

## 安装

```bash
npm install @lijuhong1981/jscolor
```

## 导出

- `ColorRGBA(red = 1, green = 1, blue = 1, alpha = 1)` — RGBA 颜色类（分量 0~1）
- `ColorRGB(red = 1, green = 1, blue = 1)` — RGB 颜色类
- `ColorGradient` — 颜色渐变
- `parseToColorRGBA(color)` / `parseToColorRGB(color)` — 解析颜色字符串
- `hue2rgb(p, q, t)` — HSL 分量换算
- `byteToFloat(byte)` / `floatToByte(float)` — 字节值与浮点值互转
