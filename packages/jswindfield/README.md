# @lijuhong1981/jswindfield

> 风场粒子动画可视化，基于 Canvas 2D 渲染风场矢量场（GRIB 数据），支持经纬度/像素两种坐标单位与双线性插值。

## 安装

```bash
npm install @lijuhong1981/jswindfield
```

## 导出

- `WindField`（默认导出，同时命名导出）— 风场渲染器
  - 静态属性：`WindField.Vector`、`WindField.Field`、`WindField.defaultOptions`
  - 方法：`setOptions`、`setData`、`startRender`、`stopRender`、`destroy`
- `Field` — 矢量场（含网格构建、双线性插值、经纬度/像素坐标换算）
- `Vector` — 二维向量
- `defaultOptions` — 默认渲染选项

### 默认渲染选项

| 项 | 默认 | 说明 |
| --- | --- | --- |
| `globalAlpha` | `0.9` | Canvas 全局透明度 |
| `lineWidth` | `1` | 线宽 |
| `colors` | 15 色渐变数组 | 粒子颜色 |
| `velocityScale` | `1.0` | 速度缩放倍率 |
| `maxAge` | `90` | 粒子最大存活帧数 |
| `particlesCount` | `2000` | 粒子数量 |
| `frameDeltaTime` | `1000 / 30` | 动画帧渲染间隔（毫秒） |
| `useAnimationFrame` | `true` | 是否使用动画帧 |
| `unit` | `'degrees'` | 粒子位置单位 |
| `enableLog` | `false` | 是否启用日志 |

依赖：`@lijuhong1981/jscheck`、`@lijuhong1981/jsdestroy`、`@lijuhong1981/jslib`、`@lijuhong1981/jsmath`、`@lijuhong1981/jstime`
