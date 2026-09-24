# @lijuhong1981/jsload

> 资源加载工具集，封装 fetch、Blob、ArrayBuffer、Image、File 的加载，并提供 `Cache`、`Loader` 与 `ImageLoader` 等加载器类。

## 安装

```bash
npm install @lijuhong1981/jsload
```

## 导出

- **fetch 封装**：`fetchJson`、`fetchText`、`fetchArrayBuffer`、`fetchBlob`、`fetchBinaryString`、`fetchImageBitmap`、`fetchResponse`
- **图片**：`loadImage`、`blobToImage`、`blobToImageAsync`、`arrayBufferToImage`、`arrayBufferToImageAsync`
- **二进制转换**：`arrayBufferToBinaryString`、`arrayBufferToBinaryStringAsync`
- **类**：`Cache`、`Loader`、`ImageLoader`、`FileInput`、`FileRead`
- **其他**：`readLine`
