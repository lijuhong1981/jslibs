# jslibs

一套基于 [Lerna](https://lerna.js.org/) 管理的 JavaScript 工具库 monorepo。所有包均以 `@lijuhong1981/js*` 作用域发布到 npm，使用**纯 ESM** 模块规范（`"type": "module"`），无构建/转译步骤，源码可直接在浏览器或 Node.js（≥ 12.17）中使用。

## 特性

- 🧩 **模块化**：每个包职责单一、按依赖分层，可独立安装使用。
- 🔌 **纯 ESM**：`import`/`export` 语法，无打包产物，直接发布源码。
- 🗑️ **统一的资源释放机制**：`Destroyable` / `destroyObject` 贯穿各包，支持深度销毁 DOM、数组、对象。
- ⚡ **面向浏览器图形应用**：内置 APNG/GIF 加载播放、风场粒子动画、Canvas/DOM 工具。

## 包列表

| 包 | 说明 |
| --- | --- |
| [@lijuhong1981/jscheck](./packages/jscheck) | 类型与取值校验（`Check` + 一组 `isXxx` 判断函数） |
| [@lijuhong1981/jsdestroy](./packages/jsdestroy) | 对象销毁机制（`Destroyable` 基类与深度释放） |
| [@lijuhong1981/jstime](./packages/jstime) | 时间工具（`Clock` / `now`） |
| [@lijuhong1981/jsmath](./packages/jsmath) | 数学工具（插值、夹取、经纬度换算、随机数） |
| [@lijuhong1981/jsurl](./packages/jsurl) | URL / 路径解析 |
| [@lijuhong1981/jstext](./packages/jstext) | 数值到面积/距离/体积文本的格式化 |
| [@lijuhong1981/jshtml](./packages/jshtml) | DOM / Canvas 工具 |
| [@lijuhong1981/jsevents](./packages/jsevents) | 事件系统（`EventDispatcher` 等） |
| [@lijuhong1981/jscolor](./packages/jscolor) | 颜色处理（RGB / RGBA / 渐变 / HSL） |
| [@lijuhong1981/jstask](./packages/jstask) | 任务调度（`TaskPool` / `defer` / 动画帧更新） |
| [@lijuhong1981/jslib](./packages/jslib) | 通用杂项（深拷贝、混入、相等比较、GUID、日志） |
| [@lijuhong1981/jsload](./packages/jsload) | 资源加载（fetch / Blob / Image / File / Cache） |
| [@lijuhong1981/jsapng](./packages/jsapng) | APNG 动图解析与加载 |
| [@lijuhong1981/jsgif](./packages/jsgif) | GIF 动图加载与播放 |
| [@lijuhong1981/jswindfield](./packages/jswindfield) | 风场粒子动画可视化 |
| [@lijuhong1981/jslibs](./packages/jslibs) | 聚合包，汇总导出以上全部模块 |

## 安装

可按需安装单个包：

```bash
npm install @lijuhong1981/jsmath
npm install @lijuhong1981/jsevents
```

或安装聚合包，一次性引入全部模块：

```bash
npm install @lijuhong1981/jslibs
```

## 依赖分层

依赖方向自底向上，`jslibs` 为最顶层聚合：

```
jscheck  jsdestroy  jstime  jsmath  jsurl  jstext  jshtml   ← 底层（无内部依赖）
   └───────┬──────────┴───────┴───────┴───────┘
   jsevents  jscolor  jstask  jslib                            ← 中层
       └──────────┬─────────────┘
        jsload  jsapng  jsgif  jswindfield                     ← 上层
                  └────── jslibs ──────┘                       ← 聚合层
```

## 许可证

[ISC](./LICENSE)
