# @lijuhong1981/jsdestroy

> 对象销毁机制，提供 `Destroyable` 基类和 `destroyObject` 深度释放函数，支持销毁数组、DOM 元素与嵌套对象。

## 安装

```bash
npm install @lijuhong1981/jsdestroy
```

## 导出

- `Destroyable` — 可继承的销毁基类（含 `destroy`/`isDestroyed`/`onDestroy`/`destroyConfigure`）
- `destroyObject(object, config)` — 销毁对象下所有属性与方法
- `destroyHTMLElement(element, deep)` — 销毁 DOM 元素
- `defineDestroyProperties(target, destroyFunc)` — 为目标对象或原型定义 `destroy` 相关属性
- `isDestroyed(object)` — 判断对象是否已销毁

### 销毁配置（`config`）

| 项 | 默认 | 说明 |
| --- | --- | --- |
| `deleteProperty` | `true` | 是否删除对象属性 |
| `ignoreProperties` | `[]` | 需忽略的属性数组 |
| `ignoreUnderlinePrefixProperty` | `false` | 是否忽略下划线前缀属性 |
| `overwriteFunction` | `true` | 是否覆盖对象方法 |
| `releaseArray` | `true` | 是否清空数组内容（`length = 0`） |
| `destroyHTMLElement` | `true` | 是否销毁 HTMLElement |
| `deep` | `false` | 是否向下执行深度销毁 |
