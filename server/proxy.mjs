/**
 * 考研数学二公式大全 · 本地开发服务器 + DeepSeek 代理
 * ---------------------------------------------------------------
 * 用法：
 *   1. 复制 .env.example 为 .env，填写 DEEPSEEK_API_KEY
 *   2. node server/proxy.mjs        → http://127.0.0.1:8765/
 *
 * 说明：
 *   - 零依赖（Node 18+ 自带 fetch）
 *   - 同时托管静态文件（替代 python -m http.server）
 *   - API Key 只从环境变量 / .env 读取，绝不下发给浏览器
 *   - MOCK=1 时返回「开发模拟」响应（仅用于联调 UI，默认关闭）
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

/* ---------- 读取 .env（存在则加载，不覆盖已有环境变量） ---------- */
(function loadEnv() {
  const p = path.join(ROOT, ".env");
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].replace(/^["']|["']$/g, "");
    if (process.env[key] === undefined) process.env[key] = val;
  }
})();

const KEY = process.env.DEEPSEEK_API_KEY || "";
const BASE = (process.env.DEEPSEEK_BASE || "https://api.deepseek.com").replace(/\/+$/, "");
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";
const MOCK = process.env.MOCK === "1";
const PORT = Number(process.env.PORT || 8765);
const HOST = process.env.HOST || "127.0.0.1";
const MAX_OUT = Math.min(Number(process.env.MAX_OUTPUT_TOKENS || 1500), 2000);

/* ---------- 静态文件 ---------- */
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".md": "text/markdown; charset=utf-8"
};

function serveStatic(req, res) {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";
  const filePath = path.join(ROOT, path.normalize(urlPath).replace(/^([/\\])+/, ""));
  if (!filePath.startsWith(ROOT)) { res.writeHead(403); res.end("Forbidden"); return; }
  fs.stat(filePath, (err, st) => {
    if (err || !st.isFile()) { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }); res.end("404 Not Found"); return; }
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
      "Content-Length": st.size,
      "Cache-Control": "no-cache"
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

/* ---------- 请求体 ---------- */
function readBody(req, limit = 200 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (c) => {
      size += c.length;
      if (size > limit) { reject(new Error("BODY_TOO_LARGE")); req.destroy(); return; }
      chunks.push(c);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function clampMessages(messages) {
  if (!Array.isArray(messages) || !messages.length) throw new Error("BAD_MESSAGES");
  const clean = messages.slice(-16).map((m) => ({
    role: m.role === "assistant" ? "assistant" : (m.role === "system" ? "system" : "user"),
    content: String(m.content || "").slice(0, 6000)
  })).filter((m) => m.content.trim());
  if (!clean.length) throw new Error("BAD_MESSAGES");
  return clean;
}

/* ---------- MOCK（仅联调 UI 用，响应会明确标注） ---------- */
const MOCK_TEXT = [
  "**【开发模拟响应 · 未调用真实模型】**\n\n",
  "这是本地 `MOCK=1` 模式返回的示例文本，用于验证流式渲染与公式排版，不代表真实 AI 输出。\n\n",
  "真实配置后，这里会是针对你问题的讲解，例如：\n\n",
  "1. 极限 $\\lim\\limits_{x\\to 0}\\dfrac{\\sin x}{x}=1$ 的推导依赖夹逼准则；\n",
  "2. 常见变形：$\\lim\\limits_{x\\to 0}\\dfrac{1-\\cos x}{x^2}=\\dfrac12$；\n\n",
  "$$\\int_0^{\\pi/2}\\sin^n x\\,dx=\\frac{(n-1)!!}{n!!}\\cdot\\begin{cases}\\dfrac{\\pi}{2},&n\\text{ 偶}\\\\[2pt]1,&n\\text{ 奇}\\end{cases}$$\n\n",
  "> 提示：把 `.env` 里的 `DEEPSEEK_API_KEY` 填好后重启代理，即得到真实回答。"
].join("");

function mockStream(res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Proxy-Mode": "mock",
    Connection: "keep-alive"
  });
  const parts = MOCK_TEXT.match(/[\s\S]{1,18}/g) || [];
  let i = 0;
  const timer = setInterval(() => {
    if (i >= parts.length) {
      res.write(`data: ${JSON.stringify({ choices: [{ delta: {}, finish_reason: "stop" }], usage: { prompt_tokens: 128, completion_tokens: 96 } })}\n\n`);
      res.write("data: [DONE]\n\n");
      res.end();
      clearInterval(timer);
      return;
    }
    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: parts[i++] } }] })}\n\n`);
  }, 30);
  res.on("close", () => clearInterval(timer));
}

/* ---------- /api/chat ---------- */
async function handleChat(req, res) {
  if (req.method !== "POST") { res.writeHead(405, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: "METHOD_NOT_ALLOWED" })); return; }

  let payload;
  try {
    const raw = await readBody(req);
    payload = JSON.parse(raw || "{}");
    payload.messages = clampMessages(payload.messages);
  } catch (e) {
    res.writeHead(400, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({ error: e.message === "BODY_TOO_LARGE" ? "BODY_TOO_LARGE" : "BAD_REQUEST" }));
    return;
  }

  if (MOCK) { mockStream(res); return; }

  if (!KEY) {
    res.writeHead(501, { "Content-Type": "application/json; charset=utf-8" });
    res.end(JSON.stringify({
      error: "NO_KEY",
      message: "未配置 DEEPSEEK_API_KEY：请复制 .env.example 为 .env 并填写密钥后重启代理"
    }));
    return;
  }

  const wantStream = payload.stream !== false;
  const body = {
    model: String(payload.model || MODEL).slice(0, 64),
    messages: payload.messages,
    max_tokens: Math.min(Math.max(Number(payload.max_tokens) || 800, 64), MAX_OUT),
    temperature: Math.min(Math.max(Number(payload.temperature) ?? 0.6, 0), 1.5),
    stream: wantStream
  };
  if (wantStream) body.stream_options = { include_usage: true };

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 90000);
  req.on("close", () => ctrl.abort());

  try {
    const upstream = await fetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
      body: JSON.stringify(body),
      signal: ctrl.signal
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({
        error: "UPSTREAM",
        status: upstream.status,
        detail: detail.slice(0, 400)
      }));
      return;
    }

    res.writeHead(200, {
      "Content-Type": upstream.headers.get("content-type") || (wantStream ? "text/event-stream; charset=utf-8" : "application/json; charset=utf-8"),
      "Cache-Control": "no-store",
      "X-Proxy-Mode": "live"
    });
    if (upstream.body) {
      for await (const chunk of upstream.body) res.write(chunk);
      res.end();
    } else {
      res.end(await upstream.text());
    }
  } catch (e) {
    if (!res.headersSent) {
      res.writeHead(504, { "Content-Type": "application/json; charset=utf-8" });
      res.end(JSON.stringify({ error: e.name === "AbortError" ? "TIMEOUT" : "NETWORK", message: String(e.message || e) }));
    } else {
      res.end();
    }
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- 启动 ---------- */
const server = http.createServer((req, res) => {
  const p = (req.url || "").split("?")[0];
  if (p === "/api/chat") { handleChat(req, res); return; }
  if (p.startsWith("/api/")) { res.writeHead(404); res.end("Not Found"); return; }
  serveStatic(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`\n  考研数学二公式大全 · 本地服务`);
  console.log(`  地址      http://${HOST}:${PORT}/`);
  console.log(`  代理      POST /api/chat  (${MOCK ? "MOCK 开发模拟" : KEY ? "已配置密钥" : "⚠ 未配置 DEEPSEEK_API_KEY"})`);
  console.log(`  模型      ${MODEL}   上游 ${BASE}`);
  console.log(`  输出上限  ${MAX_OUT} tokens\n`);
});
