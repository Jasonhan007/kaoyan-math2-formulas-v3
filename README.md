# 考研数学二公式大全（v3）

覆盖**高等数学**与**线性代数**的公式速查网页，共 **107 条**公式（高数 69 + 线代 38），严格按数学二考试范围整理（不含无穷级数等超纲内容）。

- 单页结构：iOS 风格玻璃拟态界面，支持浅色/深色模式，适配手机、平板、电脑（iPhone 18 Pro 逻辑分辨率 402×874 已实测）
- 每条公式包含：**名称 · KaTeX 表达式 · 成立条件 · 易错提醒**
- 功能：公式搜索（带高亮）、章节导航（顶栏胶囊 / 桌面侧栏 / 手机目录弹层）、收藏（本地持久化）
- 公式数据在 `data.js`，与页面样式（`styles.css`）完全分离，方便扩充
- KaTeX 已本地化到 `vendor/`，**无需联网即可渲染公式**
- 已配置 Web App manifest 与 apple-touch-icon，Safari 可「添加到主屏幕」全屏使用

## 本地运行

```bash
python -m http.server 8765 --bind 127.0.0.1
# 打开 http://127.0.0.1:8765/
```

## 结构

```
index.html            页面骨架
styles.css            iOS 风格样式（深/浅色变量）
data.js               公式数据（String.raw LaTeX）
app.js                搜索 / 导航 / 收藏 / 主题 / 渲染
vendor/               KaTeX 0.16.9 本地文件与字体
assets/               应用图标（180 / 512）
manifest.webmanifest  PWA 清单
```
