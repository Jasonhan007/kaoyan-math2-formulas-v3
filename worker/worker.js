/**
 * 考研数学二公式大全 · DeepSeek 代理（Cloudflare Worker）
 * ---------------------------------------------------------------
 * 部署（任选其一）：
 *   仪表盘：Workers & Pages → 创建 Worker → 粘贴本文件 → 设置变量与密钥
 *   wrangler：
 *     npm i -g wrangler
 *     wrangler deploy worker/worker.js --name m2-ai
 *     wrangler secret put DEEPSEEK_API_KEY
 *
 * 环境变量（Variables / Secrets）：
 *   DEEPSEEK_API_KEY   必填，DeepSeek 控制台获取（用 Secret 保存）
 *   DEEPSEEK_MODEL     可选，默认 deepseek-chat
 *   DEEPSEEK_BASE      可选，默认 https://api.deepseek.com
 *   ALLOWED_ORIGIN     可选，建议设为你的站点来源，如 https://jasonhan007.github.io
 *   APP_TOKEN          可选，设置后前端需在「设置」里填同一个口令
 *   MAX_OUTPUT_TOKENS  可选，单次输出上限（默认 1200，最大 2000）
 */

const CORS_DEFAULT = "*";

function json(data, status, cors) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
  });
}

function clampMessages(messages) {
  if (!Array.isArray(messages) || !messages.length) return null;
  const clean = messages.slice(-16).map((m) => ({
    role: m.role === "assistant" ? "assistant" : (m.role === "system" ? "system" : "user"),
    content: String(m?.content || "").slice(0, 6000)
  })).filter((m) => m.content.trim());
  return clean.length ? clean : null;
}

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || CORS_DEFAULT,
      "Access-Control-Allow-Headers": "content-type, x-app-token",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin"
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

    const url = new URL(request.url);
    if (url.pathname !== "/api/chat") return json({ error: "NOT_FOUND" }, 404, cors);
    if (request.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405, cors);

    if (env.APP_TOKEN && request.headers.get("x-app-token") !== env.APP_TOKEN) {
      return json({ error: "FORBIDDEN", message: "口令不正确" }, 403, cors);
    }

    let payload;
    try {
      payload = await request.json();
      payload.messages = clampMessages(payload.messages);
      if (!payload.messages) throw new Error("BAD_MESSAGES");
    } catch {
      return json({ error: "BAD_REQUEST" }, 400, cors);
    }

    if (!env.DEEPSEEK_API_KEY) {
      return json({
        error: "NO_KEY",
        message: "Worker 未配置 DEEPSEEK_API_KEY（用 wrangler secret put 或仪表盘添加）"
      }, 501, cors);
    }

    const base = (env.DEEPSEEK_BASE || "https://api.deepseek.com").replace(/\/+$/, "");
    const maxOut = Math.min(Number(env.MAX_OUTPUT_TOKENS || 1200), 2000);
    const stream = payload.stream !== false;

    const upstreamBody = {
      model: String(payload.model || env.DEEPSEEK_MODEL || "deepseek-chat").slice(0, 64),
      messages: payload.messages,
      max_tokens: Math.min(Math.max(Number(payload.max_tokens) || 800, 64), maxOut),
      temperature: Math.min(Math.max(Number(payload.temperature) ?? 0.6, 0), 1.5),
      stream
    };
    if (stream) upstreamBody.stream_options = { include_usage: true };

    let upstream;
    try {
      upstream = await fetch(`${base}/chat/completions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.DEEPSEEK_API_KEY}` },
        body: JSON.stringify(upstreamBody)
      });
    } catch (e) {
      return json({ error: "NETWORK", message: String(e?.message || e) }, 504, cors);
    }

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => "");
      return json({ error: "UPSTREAM", status: upstream.status, detail: detail.slice(0, 400) }, 502, cors);
    }

    const headers = new Headers(cors);
    headers.set("Content-Type", upstream.headers.get("content-type") || (stream ? "text/event-stream; charset=utf-8" : "application/json; charset=utf-8"));
    headers.set("Cache-Control", "no-store");
    headers.set("X-Proxy-Mode", "live");
    return new Response(upstream.body, { status: 200, headers });
  }
};
