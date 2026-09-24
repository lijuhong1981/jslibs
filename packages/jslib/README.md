# @lijuhong1981/jslib

> 通用工具库，涵盖深拷贝、混入、相等比较、GUID、日期格式化、日志、Hash 数组、全屏与浏览器检测等。

## 安装

```bash
npm install @lijuhong1981/jslib
```

## 导出

- **克隆/合并**：`clone`、`merge`、`mix`、`deepAssign`、`deepMix`
- **相等比较**：`equals`、`equalsArray`、`equalsObject`
- **工具**：`formatDate`、`generateGUID`、`getLocalIP`、`getPropertyDescriptor`、`setParameters`、`wait`、`foreachBigArray`
- **类**：`Log`（日志类）、`logger`（全局日志模块）、`Fullscreen`、`HashArray`、`NavigatorDetection`
- **副作用**：导入本包会自动加载 `Array.extension`（扩展 `Array.prototype`）
