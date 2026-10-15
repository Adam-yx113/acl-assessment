# ACL损伤相关膝关节临床疗效评测（静态版）

GitHub Pages 静态站点：IKDC、Lysholm、Tegner、ACL-RSI、VAS 量表填写与计分可在浏览器离线使用。

- 评测记录保存在本机 `localStorage`
- 支持客户端导出 Excel
- 不支持服务端保存、SMTP 邮件

访问：https://adam-yx113.github.io/acl-assessment/

## 本地构建

```bash
npm install
npm test
npm run build
```

生产静态资源输出到 `dist/`，Vite `base` 为 `/acl-assessment/`。
