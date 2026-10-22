# 考研数学二公式大全（v3）

覆盖**高等数学**与**线性代数**的公式速查网页，共 **116 条**公式（含历年真题高频公式），严格按数学二考试范围整理（不含无穷级数等超纲内容）。

- **多页面结构**：首页为章节目录，每个小节独立一页（`section.html?id=xx`），另有做题技巧页与收藏页——单页不冗长
- **AI 数学助手**（`ai.html`）：公式讲解、解题步骤、智能搜索、练习题生成。两种接入方式：**手机直连**（⚙️ → 直连 → 粘 DeepSeek Key，密钥只存本机浏览器）或**代理模式**（Key 在服务端，适合分享）。未配置时明确提示，不伪造回答
- 每条公式包含：**名称 · KaTeX 表达式 · 成立条件 · 易错提醒**；卡片右上角 ✨ 可让 AI 讲解该公式
- 功能：页内搜索（带高亮）、章节胶囊导航（当前章节排在最前）、桌面侧栏目录、收藏（本地持久化，含来源链接）
- 简洁浅色界面（iOS 风格），适配手机、平板、电脑（iPhone 18 Pro 402×874 已实测）
- 公式数据在 `data.js`，与样式完全分离，方便扩充
- KaTeX 已本地化到 `vendor/`，**无需联网即可渲染公式**
- 已配置 Web App manifest 与 apple-touch-icon，Safari 可「添加到主屏幕」全屏使用

## 本地运行

```bash
# 纯静态浏览（不含 AI）
python -m http.server 8765 --bind 127.0.0.1

# 带 AI 代理（Node 18+，零依赖；需要 DeepSeek API Key）
copy .env.example .env    # 填入 DEEPSEEK_API_KEY
node server/proxy.mjs     # → http://127.0.0.1:8765/
```

AI 的密钥保护、代理部署（Cloudflare Worker）、成本控制与测试记录见 **[AI-SETUP.md](AI-SETUP.md)**。

## 页面

| 文件 | 说明 |
|---|---|
| `index.html` | 首页：专题（AI 助手 / 做题技巧）+ 章节目录 |
| `section.html?id=ga1` | 章节详情页（12 个小节通用模板） |
| `tips.html` | 做题技巧（25 条，按题型分类） |
| `favorites.html` | 我的收藏 |
| `ai.html` + `ai.js` + `ai.css` | AI 数学助手（对话 / 流式 / 缓存 / 设置） |
| `server/proxy.mjs` | 本地开发服务器 + DeepSeek 代理（密钥从环境变量读取） |
| `worker/worker.js` | Cloudflare Worker 版代理（线上部署用） |
| `data.js` | 公式与技巧数据（String.raw LaTeX） |
| `app.js` / `styles.css` | 公式页交互 / 样式 |
| `vendor/` | KaTeX 0.16.9 本地文件与字体 |
