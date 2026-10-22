/* ============================================================
   AI 数学助手 · 前端逻辑
   - 只在用户主动操作时请求模型
   - 本地优先：公式搜索先查 data.js，命中不调 API
   - 缓存 / max_tokens / 流式 / 错误提示 / 调用信息
   - API Key 永远不进入前端（由代理注入）
   ============================================================ */
(function () {
  "use strict";

  var LS_CFG = "m2-ai-config";
  var LS_CACHE = "m2-ai-cache";
  var LS_FAV = "m2-fav";
  var SS_CHAT = "m2-ai-chat";
  var CACHE_TTL = 7 * 24 * 3600 * 1000;
  var CACHE_MAX = 60;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var cfg = loadCfg();
  var uiConn = cfg.conn;   // 设置面板里当前选中的连接方式

  var state = {
    mode: "solve",
    messages: loadChat(),   // 仅 role/content，用于连续对话
    busy: false,
    abort: null,
    expectAnswer: false
  };

  var data = window.MATH2_DATA || { chapters: [], tips: [] };

  /* ---------------- 配置 ---------------- */
  function loadCfg() {
    try {
      var c = JSON.parse(localStorage.getItem(LS_CFG) || "{}");
      return {
        // direct = 浏览器直连 DeepSeek（密钥存本机）；proxy = 走服务端代理（密钥不进前端）
        conn: c.conn || (c.proxy ? "proxy" : "direct"),
        key: c.key || "",
        base: c.base || "https://api.deepseek.com",
        proxy: c.proxy || "",
        token: c.token || "",
        model: c.model || "deepseek-chat",
        maxTokens: Math.min(Math.max(Number(c.maxTokens) || 800, 200), 1200)
      };
    } catch (e) {
      return { conn: "direct", key: "", base: "https://api.deepseek.com", proxy: "", token: "", model: "deepseek-chat", maxTokens: 800 };
    }
  }
  function chatEndpoint() {
    if (cfg.conn === "direct") return String(cfg.base || "https://api.deepseek.com").replace(/\/+$/, "") + "/chat/completions";
    return cfg.proxy || "/api/chat";
  }
  function saveCfg() {
    try { localStorage.setItem(LS_CFG, JSON.stringify(cfg)); } catch (e) {}
  }

  /* ---------------- 缓存 ---------------- */
  function cacheKey(text, mode) {
    return cfg.conn + "|" + mode + "|" + String(text).trim().replace(/\s+/g, " ").toLowerCase() + "|" + cfg.maxTokens;
  }
  function readCache() {
    try { return JSON.parse(localStorage.getItem(LS_CACHE) || "{}") || {}; } catch (e) { return {}; }
  }
  function getCache(key) {
    var all = readCache(), e = all[key];
    if (!e || Date.now() - e.t > CACHE_TTL) return null;
    return e;
  }
  function setCache(key, answer, meta) {
    var all = readCache();
    all[key] = { a: answer, t: Date.now(), m: meta || {} };
    var keys = Object.keys(all);
    if (keys.length > CACHE_MAX) {
      keys.sort(function (a, b) { return all[a].t - all[b].t; });
      keys.slice(0, keys.length - CACHE_MAX).forEach(function (k) { delete all[k]; });
    }
    try { localStorage.setItem(LS_CACHE, JSON.stringify(all)); } catch (e) {}
  }

  /* ---------------- 会话持久化 ---------------- */
  function loadChat() {
    try { return JSON.parse(sessionStorage.getItem(SS_CHAT) || "[]") || []; } catch (e) { return []; }
  }
  function saveChat() {
    try { sessionStorage.setItem(SS_CHAT, JSON.stringify(state.messages.slice(-12))); } catch (e) {}
  }

  /* ---------------- 系统提示词 ---------------- */
  var SYSTEM = [
    "你是「考研数学二」学习助手，服务对象是正在准备考研数学二的考生。",
    "硬性范围：一元函数微积分、多元函数微分学、二重积分、常微分方程、行列式、矩阵、向量、线性方程组、特征值与特征向量、二次型。",
    "不要使用超纲内容（无穷级数、三重积分、曲线曲面积分、概率统计、数值分析等）；若题目超纲，直接说明“数二不考”，并给出范围内最接近的方法。",
    "输出要求：",
    "1) 数学公式一律用 LaTeX：行内 $...$，独立成行 $$...$$；不要用代码块包公式。",
    "2) 结构清晰：先给思路，再分步骤，最后结论；解题要写清关键变形与所用公式。",
    "3) 中文、简洁、不说客套话；不编造考研真题原文与年份。",
    "4) 用户要的是可执行的方法，不要空泛鼓励。"
  ].join("\n");

  // 无模式选择：统一由模型自行判断意图（解题 / 讲解 / 出题 / 找公式）
  var PROMPT_HEAD = "【请求】请判断下面这段内容的意图（解题 / 公式讲解 / 出练习题 / 找公式）并直接按要求作答。" +
    "若是题目就按“思路 → 分步骤 → 结论 → 易错点”输出；若是知识点就讲含义、条件、易错点；若要求出题就给 2~3 道题＋答案解析。\n\n";

  function promptFor(text, kind) {
    if (kind === "explain") {
      return "【公式讲解】请讲解下面的公式或知识点，输出：\n1. 含义（它在算什么）\n2. 推导思路或来源（讲清关键一步）\n3. 适用条件\n4. 常见易错点 / 使用场景\n\n对象：" + text;
    }
    return PROMPT_HEAD + text;
  }
  /* ---------------- 本地公式库检索 ---------------- */
  var localPool = null;
  function buildPool() {
    if (localPool) return localPool;
    localPool = [];
    (data.chapters || []).forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        sec.items.forEach(function (it) {
          localPool.push({
            kind: "formula",
            item: it,
            href: "section.html?id=" + sec.id + "#f-" + it.id,
            label: ch.title + " · " + sec.title,
            title: it.name,
            hay: (it.name + " " + (it.cond || "") + " " + (it.warn || "") + " " + (it.kw || []).join(" ") + " " + it.tex + " " + sec.title + " " + ch.title).toLowerCase(),
            strong: (it.name + " " + (it.kw || []).join(" ")).toLowerCase()
          });
        });
      });
    });
    (data.tips || []).forEach(function (t) {
      localPool.push({
        kind: "tip",
        item: t,
        href: "tips.html#f-" + t.id,
        label: "做题技巧 · " + (t.group || ""),
        title: t.title,
        hay: (t.title + " " + (t.sub || "") + " " + (t.steps || []).join(" ") + " " + (t.kw || []).join(" ") + " " + (t.group || "")).toLowerCase(),
        strong: (t.title + " " + (t.kw || []).join(" ")).toLowerCase()
      });
    });
    return localPool;
  }

  function localSearch(q) {
    var pool = buildPool();
    var query = String(q).trim().toLowerCase();
    if (!query) return [];
    var tokens = query.split(/\s+/).filter(Boolean);
    var scored = [];
    pool.forEach(function (p) {
      var score = 0, all = true;
      tokens.forEach(function (t) {
        if (p.hay.indexOf(t) >= 0) score += p.strong.indexOf(t) >= 0 ? 3 : 1;
        else all = false;
      });
      if (all && score > 0) scored.push({ p: p, s: score + (p.kind === "formula" ? 0.5 : 0) });
    });
    if (!scored.length) {
      var longest = tokens.slice().sort(function (a, b) { return b.length - a.length; })[0];
      if (longest && longest.length >= 2) {
        pool.forEach(function (p) {
          if (p.hay.indexOf(longest) >= 0) scored.push({ p: p, s: 1 });
        });
      }
    }
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored.slice(0, 3).map(function (x) { return x.p; });
  }

  /* ---------------- 富文本 + 公式渲染 ---------------- */
  function katexInto(el, tex, display) {
    if (typeof katex === "undefined") { el.textContent = tex; return; }
    try {
      katex.render(tex, el, { displayMode: !!display, throwOnError: false, strict: false, output: "html", trust: false });
    } catch (e) {
      el.textContent = tex;
    }
  }

  function renderInline(parent, text) {
    var re = /(\$[^$\n]+?\$|\*\*[^*]+\*\*)/g;
    var last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) parent.appendChild(document.createTextNode(text.slice(last, m.index)));
      var tok = m[0];
      if (tok.charAt(0) === "$") {
        var s = document.createElement("span");
        s.className = "md-inline-math";
        katexInto(s, tok.slice(1, -1), false);
        parent.appendChild(s);
      } else {
        var b = document.createElement("strong");
        b.textContent = tok.slice(2, -2);
        parent.appendChild(b);
      }
      last = m.index + tok.length;
    }
    if (last < text.length) parent.appendChild(document.createTextNode(text.slice(last)));
  }

  function renderRich(container, text) {
    container.textContent = "";
    // 先把行间公式 $$...$$ 单独切出来，避免嵌进 <p> 里撑破布局
    var segs = String(text).split(/(\$\$[\s\S]+?\$\$)/);
    segs.forEach(function (seg) {
      if (!seg.trim()) return;
      if (seg.slice(0, 2) === "$$" && seg.slice(-2) === "$$") {
        var d = document.createElement("div");
        d.className = "md-block-math";
        katexInto(d, seg.slice(2, -2), true);
        container.appendChild(d);
        return;
      }
      renderSegments(container, seg);
    });
  }

  function renderSegments(container, text) {
    var blocks = String(text).split(/\n{2,}/);
    blocks.forEach(function (block) {
      var lines = block.split("\n").filter(function (l, i, arr) { return !(l.trim() === "" && i === arr.length - 1); });
      if (!lines.length) return;
      var isBullet = lines.every(function (l) { return /^\s*[-*]\s+/.test(l); });
      var isNum = lines.every(function (l) { return /^\s*\d+[.、]\s+/.test(l); });
      var isQuote = lines.every(function (l) { return /^\s*>\s?/.test(l); });
      if (isQuote) {
        var q = document.createElement("blockquote");
        q.className = "md-quote";
        renderInline(q, lines.map(function (l) { return l.replace(/^\s*>\s?/, ""); }).join("\n"));
        container.appendChild(q);
      } else if (isBullet || isNum) {
        var list = document.createElement(isNum ? "ol" : "ul");
        list.className = "md-list";
        lines.forEach(function (l) {
          var li = document.createElement("li");
          renderInline(li, l.replace(/^\s*([-*]|\d+[.、])\s+/, ""));
          list.appendChild(li);
        });
        container.appendChild(list);
      } else {
        var p = document.createElement("p");
        p.className = "md-p";
        lines.forEach(function (l, i) {
          if (i) p.appendChild(document.createElement("br"));
          renderInline(p, l);
        });
        container.appendChild(p);
      }
    });
  }

  /* ---------------- DOM 构造 ---------------- */
  var log = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function addUserMsg(text) {
    var wrap = el("div", "msg msg-user");
    var bubble = el("div", "bubble");
    bubble.textContent = text;
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    scrollBottom(true);
    return wrap;
  }

  function addAssistantMsg() {
    var wrap = el("div", "msg msg-ai");
    var bubble = el("div", "bubble");
    var body = el("div", "msg-body");
    bubble.appendChild(body);
    var info = el("div", "msg-info");
    info.hidden = true;
    bubble.appendChild(info);
    wrap.appendChild(bubble);
    log.appendChild(wrap);
    scrollBottom(true);
    return { wrap: wrap, body: body, info: info };
  }

  function infoText(meta) {
    var bits = [];
    if (meta.model) bits.push(meta.model);
    if (meta.ms != null) bits.push((meta.ms / 1000).toFixed(1) + "s");
    var u = meta.usage;
    if (u && (u.prompt_tokens != null || u.completion_tokens != null)) {
      bits.push("输入 " + (u.prompt_tokens || 0) + " / 输出 " + (u.completion_tokens || 0) + " tokens");
    } else if (meta.estTokens != null) {
      bits.push("输出 ≈ " + meta.estTokens + " tokens（估算）");
    }
    if (meta.cached) bits.push("缓存");
    if (meta.mock) bits.push("开发模拟");
    return bits.join(" · ");
  }

  function estimateTokens(text) {
    var s = String(text || "");
    // 粗估：中文约 1 字≈0.65 token，其余按 4 字符≈1 token
    var cjk = (s.match(/[\u4e00-\u9fa5]/g) || []).length;
    var other = s.length - cjk;
    return Math.max(1, Math.round(cjk * 0.65 + other / 4));
  }

  function addErrorMsg(code, detail) {
    var rec = addAssistantMsg();
    var box = el("div", "msg-error");
    var map = {
      NO_KEY: "后端未配置 API Key：请在服务端设置 DEEPSEEK_API_KEY 后重启（详见 AI-SETUP.md）。",
      FORBIDDEN: "访问口令不正确：请到设置里填写与 Worker 的 APP_TOKEN 一致的口令。",
      UPSTREAM: "上游模型报错（" + (detail && detail.status ? detail.status : "未知") + "）：请检查 Key 余额/权限与模型名。",
      TIMEOUT: "请求超时（90 秒）：网络较慢或模型繁忙，可稍后重试。",
      NETWORK: "网络错误：无法连接代理，请检查代理地址与网络。",
      NO_PROXY: "代理不可用：当前地址返回了非 JSON 内容（线上请到设置里填写 Worker 地址）。",
      NO_LOCAL_KEY: "还没填 API 密钥：点右上角 ⚙️ → 直连 → 粘贴 sk- 开头的密钥 → 保存。",
      AUTH: "密钥无效或已过期（401）：请重新复制完整的 sk- 密钥。",
      BALANCE: "账户余额不足（402）：请到 DeepSeek 控制台充值后重试。",
      RATE: "请求太频繁（429）：等几秒再发。",
      BAD_REQUEST: "请求格式有误，请换个描述再试。"
    };
    box.textContent = map[code] || ("出错了：" + (detail && detail.message ? detail.message : code));
    if (detail && detail.detail) {
      var d = el("div", "msg-error-detail", String(detail.detail).slice(0, 200));
      box.appendChild(d);
    }
    rec.body.appendChild(box);
    setStatus("出错");
    scrollBottom(true);
  }

  function addLocalResults(query, hits) {
    var rec = addAssistantMsg();
    var head = el("p", "local-head", "本地公式库命中 " + hits.length + " 条（未调用 AI）");
    rec.body.appendChild(head);
    hits.forEach(function (h) {
      var card = el("a", "local-card");
      card.href = h.href;
      var t = el("b", null, h.title);
      var m = el("em", null, h.label);
      card.appendChild(t);
      card.appendChild(m);
      var snippet = h.item.cond || (h.item.steps && h.item.steps[0]) || "";
      if (snippet) card.appendChild(el("span", "local-snip", snippet.slice(0, 70)));
      rec.body.appendChild(card);
    });
    var askBtn = el("button", "ghost-btn local-ask", "让 AI 深入解释");
    askBtn.addEventListener("click", function () {
      send(buildPromptForLocal(query, hits), { forceAI: true });
    });
    rec.body.appendChild(askBtn);
    rec.info.hidden = false;
    rec.info.textContent = "本地检索 · 未消耗 API 额度";
    setStatus("本地命中");
    scrollBottom(true);
  }

  function buildPromptForLocal(query, hits) {
    var refs = hits.map(function (h) {
      return "- " + h.title + "（" + h.label + "）" + (h.item.tex ? "：" + h.item.tex : "");
    }).join("\n");
    return "【结合公式库回答】用户问题：" + query + "\n\n公式库里匹配到：\n" + refs +
      "\n\n请基于以上公式，用考研数学二范围解释用户的问题：含义、适用条件、典型用法，并指出易错点。";
  }

  function scrollBottom(force) {
    var nearBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 220;
    if (force || nearBottom) window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function setStatus(t) { $("#aiStatus").textContent = t; }

  /* ---------------- 发送 ---------------- */
  function historyForApi() {
    var hist = state.messages.slice(-12).map(function (m) { return { role: m.role, content: m.content }; });
    return [{ role: "system", content: SYSTEM }].concat(hist);
  }

  /* 只有“像查公式的短语”才先走本地库，其余一律交给 AI */
  function isLookupQuery(q) {
    var s = String(q).trim();
    if (!s || s.length > 16) return false;
    if (/[=+\-×÷∫∑√^<>≤≥()（）0-9]/.test(s)) return false;
    if (/(为什么|怎么|如何|解释|区别|证明|求|计算|步骤|练习|题)/.test(s)) return false;
    return true;
  }

  async function send(rawText, opts) {
    opts = opts || {};
    var text = String(rawText || "").trim();
    if (!text || state.busy) return;

    addUserMsg(text);
    state.messages.push({ role: "user", content: text });
    saveChat();

    // 本地优先：只有明确的“查公式”短查询才命中本地库，不调用模型
    if (!opts.forceAI && !opts.explain && isLookupQuery(text)) {
      var hits = localSearch(text);
      if (hits.length >= 2 || (hits.length === 1 && hits[0].title.length <= text.length + 4)) {
        state.expectAnswer = false;
        addLocalResults(text, hits);
        return;
      }
    }

    var prompt = promptFor(text, opts.explain ? "explain" : "");
    var key = cacheKey(text, opts.explain ? "explain" : "chat");
    var cached = getCache(key);
    if (cached) {
      var r0 = addAssistantMsg();
      renderRich(r0.body, cached.a);
      r0.info.hidden = false;
      r0.info.textContent = infoText({ model: (cached.m && cached.m.model) || cfg.model, usage: cached.m && cached.m.usage, cached: true, estTokens: (!cached.m || !cached.m.usage || cached.m.usage.completion_tokens == null) ? estimateTokens(cached.a) : null });
      state.messages.push({ role: "assistant", content: c000(cached.a) });
      saveChat();
      setStatus("缓存命中（未发起请求）");
      scrollBottom(true);
      return;
    }

    // 真正请求
    state.busy = true;
    state.expectAnswer = true;
    $("#sendBtn").hidden = true;
    $("#stopBtn").hidden = false;
    setStatus("思考中…");
    $("#proxyBadge").hidden = true;

    var rec = addAssistantMsg();
    var streamEl = el("div", "msg-stream");
    rec.body.appendChild(streamEl);
    var acc = "", usage = null, model = "", mock = false;
    var t0 = performance.now();
    var painted = false, rafId = 0;

    function paint() {
      rafId = 0;
      painted = true;
      streamEl.textContent = acc || "…";
      scrollBottom(false);
    }
    function schedulePaint() {
      if (!rafId) rafId = requestAnimationFrame(paint);
    }

    var ctrl = new AbortController();
    state.abort = ctrl;
    var timer = setTimeout(function () { ctrl.abort("timeout"); }, 95000);

    try {
      if (cfg.conn === "direct" && !cfg.key) {
        rec.wrap.remove();
        addErrorMsg("NO_LOCAL_KEY");
        return;
      }

      var reqHeaders = { "Content-Type": "application/json" };
      var reqBody = {
        messages: historyForApi(),
        max_tokens: cfg.maxTokens,
        temperature: 0.6,
        stream: true
      };
      if (cfg.conn === "direct") {
        reqHeaders.Authorization = "Bearer " + cfg.key;
        reqBody.model = cfg.model;
        reqBody.stream_options = { include_usage: true };
      } else if (cfg.token) {
        reqHeaders["x-app-token"] = cfg.token;
      }
      reqBody.model = cfg.model;

      var res = await fetch(chatEndpoint(), {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(reqBody),
        signal: ctrl.signal
      });

      mock = res.headers.get("x-proxy-mode") === "mock";

      if (!res.ok) {
        var errJson = null;
        try { errJson = await res.json(); } catch (e) { errJson = null; }
        rec.wrap.remove();
        clearTimeout(timer);
        if (cfg.conn === "direct") {
          var msg = errJson && errJson.error && (errJson.error.message || errJson.error);
          var code2 = res.status === 401 ? "AUTH"
            : res.status === 402 ? "BALANCE"
            : res.status === 429 ? "RATE"
            : "UPSTREAM";
          addErrorMsg(code2, { status: res.status, detail: typeof msg === "string" ? msg : "" });
        } else if (!errJson) {
          addErrorMsg("NO_PROXY");
        } else {
          addErrorMsg(errJson.error || "UPSTREAM", errJson);
        }
        return;
      }

      var ct = res.headers.get("content-type") || "";
      if (ct.indexOf("application/json") >= 0) {
        var j = await res.json();
        acc = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || "";
        usage = j.usage || null;
        model = j.model || cfg.model;
      } else {
        var reader = res.body.getReader();
        var dec = new TextDecoder("utf-8");
        var buf = "";
        while (true) {
          var rr = await reader.read();
          if (rr.done) break;
          buf += dec.decode(rr.value, { stream: true });
          var parts = buf.split("\n\n");
          buf = parts.pop();
          for (var i = 0; i < parts.length; i++) {
            var line = parts[i].trim();
            if (!line || line.slice(0, 5) !== "data:") continue;
            var data = line.slice(5).trim();
            if (data === "[DONE]") continue;
            var jj;
            try { jj = JSON.parse(data); } catch (e) { continue; }
            if (jj.model) model = jj.model;
            if (jj.usage) usage = jj.usage;
            var delta = jj.choices && jj.choices[0] && jj.choices[0].delta && jj.choices[0].delta.content;
            if (delta) { acc += delta; schedulePaint(); }
          }
        }
      }

      if (rafId) cancelAnimationFrame(rafId);
      if (!acc.trim()) {
        rec.wrap.remove();
        addErrorMsg("UPSTREAM", { detail: "模型返回为空" });
        return;
      }

      rec.body.textContent = "";
      renderRich(rec.body, acc);
      var ms = Math.round(performance.now() - t0);
      rec.info.hidden = false;
      rec.info.textContent = infoText({ model: model || cfg.model, usage: usage, ms: ms, mock: mock, estTokens: (!usage || usage.completion_tokens == null) ? estimateTokens(acc) : null });
      $("#proxyBadge").hidden = !mock;
      setStatus(mock ? "完成（开发模拟，非真实模型）" : "完成 · " + (ms / 1000).toFixed(1) + "s");

      state.messages.push({ role: "assistant", content: c000(acc) });
      saveChat();
      setCache(key, acc, { model: model, usage: usage });
      scrollBottom(true);
    } catch (e) {
      if (rafId) cancelAnimationFrame(rafId);
      rec.wrap.remove();
      var aborted = e && (e.name === "AbortError" || String(e).indexOf("timeout") >= 0);
      addErrorMsg(aborted ? "TIMEOUT" : "NETWORK", { message: String(e && e.message || e) });
    } finally {
      clearTimeout(timer);
      state.busy = false;
      state.expectAnswer = false;
      state.abort = null;
      $("#sendBtn").hidden = false;
      $("#stopBtn").hidden = true;
      if ((!acc || !acc.trim()) && $("#aiStatus").textContent === "思考中…") setStatus("就绪");
    }
  }

  /* 历史里存截断版本，控制后续请求的 token */
  function c000(s) { return String(s); }

  /* ---------------- 输入 ---------------- */
  function bind() {
    log = $("#chatLog");

    var input = $("#aiInput");
    var autoGrow = function () {
      input.style.height = "auto";
      input.style.height = Math.min(input.scrollHeight, 140) + "px";
    };
    input.addEventListener("input", autoGrow);
    input.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        doSend();
      }
    });

    function doSend() {
      var v = input.value.trim();
      if (!v || state.busy) return;
      input.value = "";
      autoGrow();
      send(v);
    }
    $("#sendBtn").addEventListener("click", doSend);
    $("#stopBtn").addEventListener("click", function () {
      if (state.abort) state.abort.abort("stop");
    });

    $("#examples").addEventListener("click", function (e) {
      var b = e.target.closest("button[data-fill]");
      if (!b) return;
      input.value = b.dataset.fill;
      autoGrow();
      input.focus();
    });

    // 设置
    $("#settingsBtn").addEventListener("click", openSheet);
    $("#sheetMask").addEventListener("click", closeSheet);
    $("#sheetClose").addEventListener("click", closeSheet);

    // 连接方式切换
    $$("#connSeg .seg-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        uiConn = b.dataset.conn;
        syncConnUI();
      });
    });

    $("#saveCfg").addEventListener("click", function () {
      cfg.conn = uiConn;
      cfg.key = $("#cfgKey").value.trim();
      cfg.base = ($("#cfgBase").value.trim() || "https://api.deepseek.com").replace(/\/+$/, "");
      cfg.proxy = $("#cfgProxy").value.trim();
      cfg.token = $("#cfgToken").value.trim();
      var sel = $("#cfgModel").value;
      var custom = $("#cfgModelCustom").value.trim();
      cfg.model = (sel === "__custom" ? (custom || "deepseek-chat") : sel) || "deepseek-chat";
      cfg.maxTokens = Math.min(Math.max(Number($("#cfgTokens").value) || 800, 200), 1200);
      saveCfg();
      updateConnBadge();
      $("#cfgNote").textContent = uiConn === "direct"
        ? (cfg.key ? "已保存到本机浏览器，可以直接提问了。" : "已保存，但还没填密钥。")
        : "已保存（密钥仍在服务端，网页里没有密钥）。";
    });

    $("#cfgModel").addEventListener("change", function () {
      $("#cfgModelCustom").hidden = this.value !== "__custom";
    });

    $("#clearKey").addEventListener("click", function () {
      cfg.key = "";
      $("#cfgKey").value = "";
      saveCfg();
      $("#cfgNote").textContent = "已从本机浏览器清除密钥。";
    });
    $("#clearCache").addEventListener("click", function () {
      try { localStorage.removeItem(LS_CACHE); } catch (e) {}
      $("#cfgNote").textContent = "已清空答案缓存。";
    });

    // 测试连接：直连走 /models 鉴权探测；代理走 GET 探活（都不调用模型、不花 token）
    $("#testConn").addEventListener("click", async function () {
      var note = $("#cfgNote");

      if (uiConn === "direct") {
        var key = $("#cfgKey").value.trim();
        var base = ($("#cfgBase").value.trim() || "https://api.deepseek.com").replace(/\/+$/, "");
        if (!key) { note.textContent = "请先填写 API 密钥（sk- 开头）。"; return; }
        note.textContent = "测试中…（只请求 " + base + "/models，不消耗 token）";
        try {
          var r = await fetch(base + "/models", { headers: { Authorization: "Bearer " + key } });
          if (r.ok) {
            var jj = null;
            try { jj = await r.json(); } catch (e) {}
            var models = jj && jj.data ? jj.data.map(function (m) { return m.id; }).slice(0, 3).join(" / ") : "";
            note.textContent = "✅ 密钥有效（直连 DeepSeek）" + (models ? "，可用模型：" + models : "") + "，可以提问了。";
          } else if (r.status === 401) {
            note.textContent = "❌ 密钥无效或已过期：请重新复制完整的 sk- 密钥。";
          } else if (r.status === 402) {
            note.textContent = "⚠ 密钥有效但账户余额不足，充值后可用。";
          } else {
            note.textContent = "⚠ 返回 HTTP " + r.status + "：" + (await r.text()).slice(0, 120);
          }
        } catch (e) {
          note.textContent = "❌ 无法连接：" + (e && e.message || e) + "。检查网络或接口地址（需 https）。";
        }
        return;
      }

      var url = ($("#cfgProxy").value || "").trim() || "/api/chat";
      note.textContent = "测试中… " + url;
      try {
        var res = await fetch(url, { method: "GET" });
        var ct = res.headers.get("content-type") || "";
        if (ct.indexOf("application/json") < 0) {
          note.textContent = "❌ 这个地址不是 AI 代理（返回的是网页）。线上请填 Worker 的 /api/chat 地址。";
          return;
        }
        var j = null;
        try { j = await res.json(); } catch (e) {}
        var code = j && j.error;
        if (j && j.ok && j.keyConfigured === false) {
          note.textContent = "✅ 代理可达，但服务端还没配置 DEEPSEEK_API_KEY：在 .env 或 Worker 环境变量里加上后重启即可。";
        } else if (j && j.ok) {
          note.textContent = "✅ 代理可达（模型 " + (j.model || "deepseek-chat") + "），可以直接发消息了。";
        } else if (res.status === 501 || code === "NO_KEY") {
          note.textContent = "✅ 代理可达，但服务端还没配置 DEEPSEEK_API_KEY：在 .env 或 Worker 环境变量里加上后重启即可。";
        } else if (code === "METHOD_NOT_ALLOWED") {
          note.textContent = "✅ 代理可达（服务端已就绪），可以直接发消息了。";
        } else if (res.status === 403 || code === "FORBIDDEN") {
          note.textContent = "⚠ 代理可达，但访问口令不正确：把 Worker 的 APP_TOKEN 填到上面的「访问口令」。";
        } else {
          note.textContent = "⚠ 代理返回 HTTP " + res.status + (code ? "（" + code + "）" : "") + "，请检查 Worker 日志。";
        }
      } catch (e) {
        note.textContent = "❌ 连接失败：" + (e && e.message || e) + "。检查地址、网络，或 Worker 是否允许本站来源（ALLOWED_ORIGIN）。";
      }
    });

    // 收藏角标（沿用公式页的收藏数据）
    try {
      var favs = JSON.parse(localStorage.getItem(LS_FAV) || "[]");
      var badge = $("#favBadge");
      if (badge) { badge.textContent = favs.length; badge.hidden = favs.length === 0; }
    } catch (e) {}
  }

  function updateConnBadge() {
    var b = $("#connBadge");
    if (!b) return;
    b.textContent = cfg.conn === "direct" ? "直连 · " + cfg.model : "代理 · " + cfg.model;
  }

  function syncConnUI() {
    $$("#connSeg .seg-btn").forEach(function (b) {
      b.classList.toggle("active", b.dataset.conn === uiConn);
    });
    var direct = uiConn === "direct";
    $("#directFields").hidden = !direct;
    $("#proxyFields").hidden = direct;
    $("#clearKey").hidden = !direct;
  }

  function openSheet() {
    uiConn = cfg.conn;
    $("#cfgKey").value = cfg.key;
    $("#cfgBase").value = cfg.base;
    $("#cfgProxy").value = cfg.proxy;
    $("#cfgToken").value = cfg.token;
    $("#cfgTokens").value = cfg.maxTokens;
    var known = ["deepseek-chat", "deepseek-reasoner"];
    if (known.indexOf(cfg.model) >= 0) {
      $("#cfgModel").value = cfg.model;
      $("#cfgModelCustom").hidden = true;
      $("#cfgModelCustom").value = "";
    } else {
      $("#cfgModel").value = "__custom";
      $("#cfgModelCustom").hidden = false;
      $("#cfgModelCustom").value = cfg.model;
    }
    syncConnUI();
    updateConnBadge();
    $("#cfgNote").textContent = cfg.conn === "direct"
      ? (cfg.key ? "当前：直连 DeepSeek（密钥存在本机浏览器）" : "当前：直连，但还没填密钥")
      : "当前：代理模式（密钥在服务端）";
    $("#sheet").hidden = false;
    $("#sheetMask").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    $("#sheet").hidden = true;
    $("#sheetMask").hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------------- 恢复历史 / 深度链接 ---------------- */
  function restoreChat() {
    if (!state.messages.length) return;
    state.messages.forEach(function (m) {
      if (m.role === "user") addUserMsg(m.content);
      else {
        var r = addAssistantMsg();
        renderRich(r.body, m.content);
      }
    });
    setStatus("已恢复上次对话（" + state.messages.length + " 条）");
  }

  function findFormula(id) {
    var out = null;
    (data.chapters || []).forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        sec.items.forEach(function (it) {
          if (it.id === id) out = { item: it, sec: sec, ch: ch };
        });
      });
    });
    return out;
  }

  function autoExplain() {
    var id;
    try { id = new URLSearchParams(location.search).get("explain"); } catch (e) { id = null; }
    if (!id) return;
    var hit = findFormula(id);
    if (!hit) return;
    var prompt = "【公式】" + hit.item.name +
      "\n公式 LaTeX：" + hit.item.tex +
      (hit.item.cond ? "\n页面已有成立条件：" + hit.item.cond : "") +
      (hit.item.warn ? "\n页面已有提醒：" + hit.item.warn : "") +
      "\n所在章节：" + hit.ch.title + " · " + hit.sec.title;
    send(prompt, { explain: true });
  }

  function init() {
    bind();
    updateConnBadge();
    restoreChat();
    autoExplain();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
