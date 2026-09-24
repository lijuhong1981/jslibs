# @lijuhong1981/jsurl

> URL 与路径解析工具集，支持 URL 全量解析、查询参数解析、路径拆分与文件名/扩展名提取。

## 安装

```bash
npm install @lijuhong1981/jsurl
```

## 导出

- **解析**：`parseUrl(url, result?)`、`parseQueryParams(urlQuery, result?)`、`parsePath(path, result?)`
- **拆分**：`splitUrl(url)`、`splitPath(path)`
- **文件名/路径**：`extractBaseName`、`extractExtName`、`extractFileName`、`extractFolderPath`
- **协议判断**：`hasProtocolPrefix`、`isHttpProtocol`、`isFileProtocol`、`isBlobProtocol`、`isDataProtocol`
- **拼接**：`mergeUrl(...)`
