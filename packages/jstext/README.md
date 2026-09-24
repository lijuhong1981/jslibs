# @lijuhong1981/jstext

> 文本格式化工具，将数值格式化为带单位的面积、距离、体积字符串，并从文本中提取数字。

## 安装

```bash
npm install @lijuhong1981/jstext
```

## 导出

- `formatDistanceString(distance, fractionDigits = 2)` — 米 → `米`/`公里` 文本
- `formatAreaString(area, fractionDigits = 2)` — 平方米 → `平方米`/`平方公里` 文本
- `formatVolumeString(volume, fractionDigits = 2)` — 体积文本
- `extractNumber(text)` — 从字符串中提取数字
