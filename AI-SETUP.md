# AI 助手配置与部署说明

本站默认是**纯静态站点**（GitHub Pages）。浏览器端不能安全保存 API Key，因此 AI 能力通过**一层极薄的代理**调用 DeepSeek：

```
浏览器（ai.html）  ──POST /api/chat──▶  代理（Node 本地 / Cloudflare Worker）
                                            │  注入 Authorization: Bearer $DEEPSEEK_API_KEY
                                            ▼
                                     https://api.deepseek.com/chat/completions
```

- **API Key 只存在于服务端环境变量**，前端只知道「代理地址」，仓库里没有任何密钥。
- 前端不保存、不打印、不上传 Key；`localStorage` 里只存代理地址、可选口令、max_tokens 等公开配置。
- 所有 AI 请求都只在**用户主动操作**时发出（点「AI 讲解」/ 发送消息 / 生成练习），页面加载、切换章节、浏览公式、本地搜索都**不会**请求模型。

---

## 一、最快方式：手机浏览器直连（无需后端）

DeepSeek 官方 API 支持浏览器跨域（实测 `OPTIONS` 预检与 `POST` 响应均返回 `Access-Control-Allow-Origin`），因此可以**直接在手机上填密钥**：

1. 手机打开 `https://jasonhan007.github.io/kaoyan-math2-formulas-v3/ai.html`
2. 点右上角 **⚙️** → 选 **直连（最简单）**
3. 粘贴 `sk-…` 密钥 → **保存** → 点 **测试连接**
4. 看到「✅ 密钥有效（直连 DeepSeek）」就能直接提问

**密钥去了哪**：只存在这台设备的浏览器 `localStorage`（键 `m2-ai-config`），请求只发往 `https://api.deepseek.com`，不经过任何第三方服务器。本站不加载任何第三方脚本（KaTeX 本地化），因此不会被外部脚本读走。

**风险与对策（请自觉遵守）**：

- 公用/借出去的手机会被别人读到密钥 → 用完点设置里的 **「清除密钥」**；
- 浏览器清缓存/换设备后需重新粘贴；
- 如果你要把站点分享给别人用，请改用**代理模式**（密钥留在服务端），见下一节；
- 密钥泄露立即到 DeepSeek 控制台吊销重建。

---

## 二、本地运行（代理模式，密钥在服务端）

### 方式 A：双击（Windows，推荐新手）

1. 双击项目里的 **`start-ai.cmd`**；
2. 第一次运行会自动生成 `.env` 并打开记事本——在里面填一行
   `DEEPSEEK_API_KEY=sk-你的密钥`（DeepSeek 控制台创建），保存关闭；
3. 回到黑色窗口按任意键，浏览器会自动打开 `http://127.0.0.1:8765/ai.html`。

> 之所以不把密钥填在网页里：网页源码/浏览器存储是公开可读的，填进去等于泄露；密钥只放在本机 `.env`，由 `server/proxy.mjs` 读取后转发。

### 方式 B：命令行

```bash
cp .env.example .env        # Windows: copy .env.example .env
# 编辑 .env，填入 DEEPSEEK_API_KEY=sk-xxxx

node server/proxy.mjs       # Node 18+，零依赖，同时托管静态文件与 /api/chat
# → http://127.0.0.1:8765/
```

### 验证是否接通

打开 `/ai.html` → 右上角 **⚙️** → 点 **「测试连接」**：

| 提示 | 含义 |
|---|---|
| ✅ 代理可达（模型 deepseek-chat） | 一切正常，可以提问 |
| ✅ 代理可达，但服务端还没配置 DEEPSEEK_API_KEY | 代理在跑，但 `.env` 里没填密钥，填好重启 |
| ❌ 这个地址不是 AI 代理（返回的是网页） | 地址填错，或线上还没部署 Worker |
| ❌ 连接失败 | 地址/网络不对，或 Worker 的 ALLOWED_ORIGIN 没包含本站 |

「测试连接」只发一个 `GET`，**不调用模型、不产生 token 费用**。

### 没有 Key 也能先看界面

- 不填 Key 直接启动：AI 页面会明确提示 **「未配置 API Key（NO_KEY）」**，这是真实错误状态，不会伪造回答。
- 想联调流式渲染与公式排版：`MOCK=1 node server/proxy.mjs`
  - 只有在 `MOCK=1` 时才会返回**开发模拟**文本，响应头带 `X-Proxy-Mode: mock`，界面顶部会显示「开发模拟」标签；
  - 这是联调用途，**不是真实 AI 输出**，正式环境请保持 `MOCK` 未设置。

环境变量一览（`.env` 或系统环境）：

| 变量 | 必填 | 说明 |
|---|---|---|
| `DEEPSEEK_API_KEY` | 是 | DeepSeek 控制台创建 |
| `DEEPSEEK_MODEL` | 否 | 默认 `deepseek-chat` |
| `DEEPSEEK_BASE` | 否 | 默认 `https://api.deepseek.com`，可换兼容网关 |
| `MAX_OUTPUT_TOKENS` | 否 | 单次输出上限，默认 1500，服务端再夹紧到 ≤2000 |
| `MOCK` | 否 | `1` = 开发模拟，正式请勿开启 |
| `PORT` / `HOST` | 否 | 默认 `8765` / `127.0.0.1` |

---

## 三、部署到线上（GitHub Pages + Cloudflare Worker）

GitHub Pages 只能托管静态文件，`/api/chat` 必须由外部提供。推荐 **Cloudflare Workers**：单文件、免费额度足够个人使用、无需自己运维服务器。

1. 部署 Worker
   ```bash
   npm i -g wrangler
   wrangler login
   wrangler deploy worker/worker.js --name m2-ai
   wrangler secret put DEEPSEEK_API_KEY      # 粘贴 Key，回车
   ```
   也可在 Cloudflare 仪表盘：Workers & Pages → 创建 → 粘贴 `worker/worker.js` → Settings → Variables and Secrets 里加 `DEEPSEEK_API_KEY`。

2. 建议同时设置两个变量（防止别人白用你的 Key）
   - `ALLOWED_ORIGIN` = `https://jasonhan007.github.io`（只允许你的站点跨域调用）
   - `APP_TOKEN` = 一串随机口令（设置后前端「设置」里要填同一个值，请求头 `x-app-token` 必须匹配）

3. 前端配置
   - 打开线上 `/ai.html` → 右上角齿轮 → **代理地址**填 `https://m2-ai.<你的子域>.workers.dev/api/chat`
   - 若 Worker 设置了 `APP_TOKEN`，把口令填进「访问口令」
   - 保存后发一条消息验证；`保存` 只写 localStorage，不会上传

4. 其他可选后端：任何能转发 HTTPS 的 Serverless（Vercel / Netlify / Deno Deploy）都可以，逻辑与本 Worker 相同：只做「校验 + 注入 Key + 转发」。

> 安全提醒：不要把 `DEEPSEEK_API_KEY` 写进 `.env.example`、前端 JS、GitHub Actions 明文或仓库任何文件；`.gitignore` 已忽略 `.env`。如密钥疑似泄露，请立即在 DeepSeek 控制台重建。

---

## 四、成本控制设计（页面里实际生效）

| 措施 | 实现 |
|---|---|
| 本地优先 | 「智能搜索」先在本地公式库（116 条公式 + 25 条技巧）匹配；命中则**不调模型**，只展示结果卡与「AI 深入解释」按钮 |
| 只在主动操作时调用 | 无任何自动请求；页面加载、切章节、搜索框输入、收藏都不触发 API |
| 输出上限 | 前端默认 `max_tokens=800`，可在设置里调（≤1200）；代理再夹紧到 `MAX_OUTPUT_TOKENS`（≤2000） |
| 上下文裁剪 | 只带最近 6 轮对话、单条 ≤6000 字符，避免长对话把 prompt 撑爆 |
| 缓存 | 相同问题（同模式 + 同内容 + 同模型 + 同参数）命中本地缓存，直接展示，标注「缓存」；7 天过期，最多 60 条，存 `localStorage` |
| 调用信息 | 每条回答下方显示：模型、耗时、token 用量（服务端返回时）、是否缓存/模拟 |
| 失败不重试风暴 | 出错只提示，不自动重试；流式超时 90s 主动中断 |

> 费用说明：DeepSeek 的计费规则与价格以官方文档为准，本项目不做任何「免费额度 / 固定费用」的承诺；成本 ≈ 输入 tokens × 输入单价 + 输出 tokens × 输出单价，页面会显示每次的 token 用量便于估算。

---

## 五、功能与调用点

| 功能 | 触发方式 | 是否调用模型 |
|---|---|---|
| AI 公式讲解 | 公式卡片右上「AI 讲解」按钮 → 跳转 `ai.html?explain=<id>` 并自动发送 | 是（一次，可被缓存） |
| AI 解题助手 | AI 页选「解题」→ 粘贴题目 → 发送 | 是 |
| 智能搜索 | AI 页选「搜索」→ 自然语言提问 | 先本地；未命中或点「AI 深入解释」才调用 |
| 练习题生成 | AI 页选「练习」→ 填知识点 | 是 |
| 连续对话 | 同一会话内自动带上最近 6 轮 | 每次发送算一次 |
| 公式库浏览 / 搜索 / 收藏 | 原有页面 | 否 |

系统提示词已限定**考研数学二范围**（一元微积分、多元微分、二重积分、常微分方程、行列式、矩阵、向量、线性方程组、特征值、二次型），并要求不使用无穷级数、三重积分、曲线曲面积分、概率统计等超纲内容；公式统一用 `$...$` / `$$...$$` 输出，前端用本地 KaTeX 渲染。

---

## 六、已知限制（如实说明）

- 仓库内**没有**任何 API Key，因此真实模型调用**未在本机实测**；已实测的是：代理的转发/流式/超时/错误码路径、前端流式渲染、公式排版、缓存命中、本地搜索、无 Key 时的 501 提示（详见 `AI-SETUP.md` 末尾的测试记录）。
- URL 里带 `?explain=` 会**自动发送**一次讲解请求（这是用户点击「AI 讲解」后的落地页），如需改为手动，把 `ai.js` 中 `autoExplain` 的自动调用去掉即可。
- Cloudflare Worker 免费额度与限制以 Cloudflare 官方为准；若被墙或延迟高，可换 Vercel / Deno Deploy 部署同样逻辑。

---

## 七、实测记录（2026-10，本机）

环境：Windows + Node（MiMo 内置 v24）+ Playwright 无头 Chromium。

已实测通过：

| 项目 | 结果 |
|---|---|
| 页面加载是否自动请求模型 | `performance` 资源计数 0 次 `/api/` 请求 ✅ |
| 未配置 Key 的错误路径 | `POST /api/chat` → **501** `{"error":"NO_KEY"}`；界面显示「后端未配置 API Key…请在服务端设置 DEEPSEEK_API_KEY」✅ |
| 流式渲染（MOCK=1） | SSE 逐字返回，最终渲染 3 处 KaTeX（2 行内 + 1 独立公式），信息行「0.9s · 输出 96 tokens · 开发模拟」，状态「完成（开发模拟，非真实模型）」，顶部出现「模拟」徽标 ✅ |
| 缓存 | 同一问题第二次：新增 API 调用 **0** 次，信息行显示「缓存」，状态「缓存命中（未发起请求）」✅ |
| 本地优先搜索 | 「极坐标 二重积分」命中本地 3 条（极坐标计算二重积分 / 二重积分四步走 / 坐标互化），**0 次 API 调用**，附「让 AI 深入解释」按钮 ✅ |
| 公式讲解深链 | `ai.html?explain=ga3-12` 自动发送含公式 LaTeX + 条件 + 章节的提示，模式自动切「公式讲解」✅ |
| 章节胶囊重排 | 进入 `section.html?id=la2`，胶囊第一位就是「矩阵」且高亮 ✅ |
| 技巧页顶导航 | 4 个题型胶囊，点击滚动至对应分组并置为 active ✅ |
| 回归 | 章节搜索「点火」→ 2 条；收藏角标 1；收藏页列表正常；4 个 dock tab；402px / 1440px 无横向溢出；控制台 0 报错 ✅ |
| 密钥保护 | 仓库内无任何 Key；`.env` 已忽略；直连模式密钥只存本机 localStorage，请求只发往 api.deepseek.com ✅ |
| 直连 CORS | 从 `https://jasonhan007.github.io` 预检 OPTIONS 200 + `Access-Control-Allow-Origin` 回显；`POST /chat/completions`、`GET /models`（无 key 时 401）均带 CORS 头 → 浏览器直连可行 ✅ |
| 直连 · 未填密钥 | 设置里点发送 → 「还没填 API 密钥：点右上角 ⚙️ → 直连 → 粘贴…」✅ |
| 直连 · 无效密钥 | 测试连接与发送均得到真实 401：界面提示「密钥无效或已过期（401）」并附上游消息（说明请求真的到达 DeepSeek）✅ |
| 代理 · 测试连接 | 无 Key 的本地代理返回「✅ 代理可达，但服务端还没配置 DEEPSEEK_API_KEY」；GET 探活不调用模型 ✅ |

未实测（如实说明）：

- **真实 DeepSeek 调用**：仓库内无有效 Key，真实模型输出、真实 usage 与计费未在本机跑通；已验证的是「请求能真正到达 DeepSeek 并正确解析 401」（直连与代理两条链路）。填入有效 Key 后即可使用。
- **Cloudflare Worker 线上部署**：需要 Cloudflare 账号与 `wrangler login`，本机未部署；代码与本地代理同逻辑，本地已验证转发/流式/错误码路径。
