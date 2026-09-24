# @lijuhong1981/jsevents

> 事件系统，提供 `EventDispatcher`（事件分发）、`EventEmitter`（发布/订阅）与 `EventSubscriber`（事件封装），均支持 `Destroyable` 销毁。

## 安装

```bash
npm install @lijuhong1981/jsevents
```

## 导出

- `EventDispatcher` — 事件分发管理器（`addEventListener`/`removeEventListener`/`dispatch`/`dispatchEvent` 等）
- `EventEmitter` — 发布/订阅模式
- `EventSubscriber` — 单类型事件的监听器封装

监听选项 `options`：

| 项 | 说明 |
| --- | --- |
| `scope` | 回调函数的 `this` 指针对象 |
| `once` | 是否单次事件（触发后自动移除） |
