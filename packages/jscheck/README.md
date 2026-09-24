# @lijuhong1981/jscheck

> 类型与取值校验工具集，提供 `Check` 校验命名空间和一组 `isXxx` 判断函数。

## 安装

```bash
npm install @lijuhong1981/jscheck
```

## 导出

### `Check`（默认导出，命名空间）

- `Check.defined(name, value)` / `Check.valid(name, value)`
- `Check.instanceOf(name, value, target)`
- `Check.typeOf.function/.string/.number/.object/.boolean/.array/.integer`
- `Check.typeOf.number.lessThan/.greaterThan/.equals` 等数值范围校验
- `Check.typeOf.integer.lessThan/.greaterThan/.equals` 等整数范围校验
- `Check.typeOf.equals(name1, name2, v1, v2)`

### 判断函数

- `isDefined(value)`、`isValid(value)`
- `isArray`、`isBoolean`、`isFunction`、`isAsyncFunction`、`isInteger`
- `isNumber`、`isObject`、`isString`、`isStringNotEmpty`、`isTypedArray`
- `getDefinedValue(value, defaultValue)`、`getValidValue(value, defaultValue)`
