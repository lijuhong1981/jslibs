# @lijuhong1981/jstime

> 时间工具，提供 `Clock` 计时器和 `now` 高精度时间戳函数。

## 安装

```bash
npm install @lijuhong1981/jstime
```

## 导出

- `Clock` — 计时器类
  - `new Clock(autoStart = false)`
  - `start()` / `stop()`
  - `getElapsedTime()` — 累计运行时间（秒）
  - `getDeltaTime()` — 两次调用间的时间增量（秒）
- `now()` — 返回当前时间戳（毫秒），优先使用 `performance.now()`，无 `performance` 时回退 `Date.now()`
