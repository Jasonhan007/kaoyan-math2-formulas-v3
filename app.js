/* ============================================================
   考研数学二公式大全 · 交互（多页面版）
   首页 index.html / 章节 section.html?id=xx / 收藏 favorites.html
   ============================================================ */
(function () {
  "use strict";

  var data = window.MATH2_DATA;
  var page = document.body.dataset.page || "home";
  var LS_FAV = "m2-fav";

  var state = { query: "", favs: loadFavs() };
  var cards = [];            // 当前页卡片记录
  var secMap = {};           // sectionId -> {ch, sec, no}
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 本地收藏 ---------- */
  function loadFavs() {
    try { return new Set(JSON.parse(localStorage.getItem(LS_FAV) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveFavs() {
    try { localStorage.setItem(LS_FAV, JSON.stringify(Array.from(state.favs))); } catch (e) {}
  }

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function highlight(text, q) {
    text = String(text == null ? "" : text);
    if (!q) return esc(text);
    var out = "", lower = text.toLowerCase(), ql = q.toLowerCase(), i = 0;
    while (true) {
      var idx = lower.indexOf(ql, i);
      if (idx < 0) { out += esc(text.slice(i)); break; }
      out += esc(text.slice(i, idx)) + "<mark>" + esc(text.slice(idx, idx + q.length)) + "</mark>";
      i = idx + q.length;
    }
    return out;
  }
  function param(key) {
    try { return new URLSearchParams(location.search).get(key) || ""; } catch (e) { return ""; }
  }

  /* ---------- 索引 ---------- */
  function buildIndex() {
    var no = 0;
    data.chapters.forEach(function (ch) {
      ch.sections.forEach(function (sec) {
        no++;
        secMap[sec.id] = { ch: ch, sec: sec, no: no };
      });
    });
  }
  function allSections() {
    var out = [];
    data.chapters.forEach(function (ch) { ch.sections.forEach(function (s) { out.push({ ch: ch, sec: s }); }); });
    return out;
  }
  function totalCount() {
    var n = 0;
    data.chapters.forEach(function (ch) { ch.sections.forEach(function (s) { n += s.items.length; }); });
    return n;
  }

  /* ---------- KaTeX（分帧渲染，避免单次长任务卡顿） ---------- */
  var renderQueue = [];
  var flushScheduled = false;

  function renderMath(el, tex) {
    el.dataset.tex = tex;
    el._rendered = false;
    if (typeof katex === "undefined") return;   // 未就绪时由 load 兜底
    renderQueue.push(el);
    scheduleFlush();
  }
  function scheduleFlush() {
    if (flushScheduled) return;
    flushScheduled = true;
    requestAnimationFrame(flushQueue);
  }
  function flushQueue() {
    flushScheduled = false;
    if (typeof katex === "undefined") return;
    var n = Math.min(4, renderQueue.length);
    for (var i = 0; i < n; i++) {
      var el = renderQueue.shift();
      tryRender(el);
      markOne(el);
    }
    if (renderQueue.length) scheduleFlush();
  }
  function markOne(f) {
    var inner = f.firstElementChild;
    if (inner) f.classList.toggle("ovf", inner.scrollWidth - inner.clientWidth > 4);
  }
  function tryRender(el) {
    if (el._rendered || typeof katex === "undefined") return;
    try {
      katex.render(el.dataset.tex, el, {
        displayMode: true, throwOnError: false, strict: false, output: "html", trust: false
      });
      el._rendered = true;
    } catch (e) {
      el.innerHTML = '<span class="raw"></span>';
      el.firstChild.textContent = el.dataset.tex;
      el._rendered = true;
    }
  }
  function renderMathReady() {
    if (typeof katex === "undefined") return;
    while (renderQueue.length) {
      var el = renderQueue.shift();
      tryRender(el);
      markOne(el);
    }
    $$(".formula").forEach(tryRender);
    $("#katexBanner") && ($("#katexBanner").hidden = true);
    markOverflow();
  }
  function markOverflow() {
    $$(".formula").forEach(markOne);
  }

  /* ---------- 卡片 ---------- */
  function buildCard(item, idx, opts) {
    opts = opts || {};
    var card = document.createElement("article");
    card.className = "card";
    card.id = "f-" + item.id;

    var head = document.createElement("div");
    head.className = "card-head";

    var idxEl = document.createElement("span");
    idxEl.className = "card-idx";
    idxEl.textContent = idx;

    var name = document.createElement("h4");
    name.className = "card-name";
    name.textContent = item.name;

    var fav = document.createElement("button");
    fav.className = "fav-btn" + (state.favs.has(item.id) ? " on" : "");
    fav.type = "button";
    fav.setAttribute("aria-label", "收藏 " + item.name);
    fav.setAttribute("aria-pressed", state.favs.has(item.id) ? "true" : "false");
    fav.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">' +
      '<path d="M12 20.3s-7.4-4.6-9.2-9A5.1 5.1 0 0 1 12 6.4a5.1 5.1 0 0 1 9.2 4.9c-1.8 4.4-9.2 9-9.2 9z"/></svg>';
    fav.addEventListener("click", function () { toggleFav(item, fav); });

    head.appendChild(idxEl);
    head.appendChild(name);
    head.appendChild(fav);
    card.appendChild(head);

    var fBox = document.createElement("div");
    fBox.className = "formula";
    card.appendChild(fBox);
    renderMath(fBox, item.tex);

    if (item.cond) {
      var p1 = document.createElement("p");
      p1.className = "note cond";
      p1.innerHTML = '<span class="tag">条件</span><span class="txt">' + esc(item.cond) + "</span>";
      card.appendChild(p1);
    }
    if (item.warn) {
      var p2 = document.createElement("p");
      p2.className = "note warn";
      p2.innerHTML = '<span class="tag">易错</span><span class="txt">' + esc(item.warn) + "</span>";
      card.appendChild(p2);
    }
    if (opts.showSource && opts.source) {
      var a = document.createElement("a");
      a.className = "src-link";
      a.href = opts.source.href;
      a.textContent = "来自：" + opts.source.title;
      card.appendChild(a);
    }

    var rec = {
      el: card, item: item, nameEl: name, favBtn: fav,
      hay: (item.name + " " + (item.cond || "") + " " + (item.warn || "") + " " +
        (item.kw ? item.kw.join(" ") : "") + " " + item.tex + " " +
        (opts.source ? opts.source.secTitle + " " + opts.source.chTitle : "")).toLowerCase()
    };
    return rec;
  }

  function toggleFav(item, btn) {
    if (state.favs.has(item.id)) state.favs.delete(item.id);
    else state.favs.add(item.id);
    saveFavs();
    var on = state.favs.has(item.id);
    btn.classList.toggle("on", on);
    btn.setAttribute("aria-pressed", on ? "true" : "false");
    btn.classList.remove("pop");
    void btn.offsetWidth;
    btn.classList.add("pop");
    updateBadges();
    if (page === "favorites") applyFilter();   // 收藏页：增删都即时刷新列表
  }

  /* ---------- 技巧卡片 ---------- */
  function buildTipCard(tip, idx, opts) {
    opts = opts || {};
    var card = document.createElement("article");
    card.className = "card tip-card";
    card.id = "f-" + tip.id;

    var head = document.createElement("div");
    head.className = "card-head";

    var idxEl = document.createElement("span");
    idxEl.className = "card-idx";
    idxEl.textContent = idx;

    var name = document.createElement("h4");
    name.className = "card-name";
    name.textContent = tip.title;

    var fav = document.createElement("button");
    fav.className = "fav-btn" + (state.favs.has(tip.id) ? " on" : "");
    fav.type = "button";
    fav.setAttribute("aria-label", "收藏 " + tip.title);
    fav.setAttribute("aria-pressed", state.favs.has(tip.id) ? "true" : "false");
    fav.innerHTML =
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round">' +
      '<path d="M12 20.3s-7.4-4.6-9.2-9A5.1 5.1 0 0 1 12 6.4a5.1 5.1 0 0 1 9.2 4.9c-1.8 4.4-9.2 9-9.2 9z"/></svg>';
    fav.addEventListener("click", function () { toggleFav(tip, fav); });

    head.appendChild(idxEl);
    head.appendChild(name);
    head.appendChild(fav);
    card.appendChild(head);

    if (tip.sub) {
      var sub = document.createElement("p");
      sub.className = "tip-sub";
      sub.textContent = tip.sub;
      card.appendChild(sub);
    }

    if (tip.steps && tip.steps.length) {
      var ol = document.createElement("ol");
      ol.className = "tip-steps";
      tip.steps.forEach(function (s) {
        var li = document.createElement("li");
        li.textContent = s;
        ol.appendChild(li);
      });
      card.appendChild(ol);
    }

    if (tip.warn) {
      var p2 = document.createElement("p");
      p2.className = "note warn";
      p2.innerHTML = '<span class="tag">提醒</span><span class="txt">' + esc(tip.warn) + "</span>";
      card.appendChild(p2);
    }

    if (opts.showSource && opts.source) {
      var a = document.createElement("a");
      a.className = "src-link";
      a.href = opts.source.href;
      a.textContent = "来自：" + opts.source.title;
      card.appendChild(a);
    }

    return {
      el: card,
      item: tip,
      nameEl: name,
      favBtn: fav,
      hay: (tip.title + " " + (tip.sub || "") + " " + (tip.steps || []).join(" ") + " " +
        (tip.warn || "") + " " + (tip.kw || []).join(" ") + " 做题技巧 " + (tip.group || "")).toLowerCase()
    };
  }

  function updateBadges() {
    var n = state.favs.size;
    var badge = $("#favBadge");
    if (badge) { badge.textContent = n; badge.hidden = n === 0; }
    var stat = $("#statFav");
    if (stat) stat.textContent = n;
    if (page === "favorites") {
      var m = $("#pageMeta");
      if (m) m.textContent = n + " 条收藏 · 取消收藏后即时移出列表";
    }
  }

  /* ---------- 各页构建 ---------- */
  function buildHome() {
    var wrap = $("#directory");
    if (!wrap) return;
    var frag = document.createDocumentFragment();

    // 专题：做题技巧
    if (data.tips && data.tips.length) {
      var gt = document.createElement("div");
      gt.className = "dir-group";
      var ht = document.createElement("h2");
      ht.textContent = "专题";
      gt.appendChild(ht);
      var at = document.createElement("a");
      at.className = "dir-row";
      at.href = "tips.html";
      at.innerHTML =
        '<span class="dir-num tip">技</span>' +
        '<span class="dir-main"><b>做题技巧</b><em>选择题 / 填空题 / 解答题 / 高频题型专项</em></span>' +
        '<span class="dir-count">' + data.tips.length + " 条</span>" +
        '<svg class="dir-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
      gt.appendChild(at);
      frag.appendChild(gt);
    }

    data.chapters.forEach(function (ch, gi) {
      var g = document.createElement("div");
      g.className = "dir-group";
      var h = document.createElement("h2");
      h.textContent = "PART 0" + (gi + 1) + " · " + ch.title;
      g.appendChild(h);
      ch.sections.forEach(function (sec) {
        var a = document.createElement("a");
        a.className = "dir-row";
        a.href = "section.html?id=" + sec.id;
        a.innerHTML =
          '<span class="dir-num">' + secMap[sec.id].no + "</span>" +
          '<span class="dir-main"><b>' + esc(sec.title) + "</b><em>" + esc(ch.title) + "</em></span>" +
          '<span class="dir-count">' + sec.items.length + " 条</span>" +
          '<svg class="dir-chevron" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 6 6 6-6 6"/></svg>';
        g.appendChild(a);
      });
      frag.appendChild(g);
    });
    wrap.appendChild(frag);

    var tn = $("#statNum"); if (tn) tn.textContent = totalCount();
    var ts = $("#statSec");
    if (ts) { var c = 0; data.chapters.forEach(function (ch) { c += ch.sections.length; }); ts.textContent = c; }
    updateBadges();
  }

  function buildSection() {
    var id = param("id");
    var entry = secMap[id];
    if (!entry) { location.replace("index.html"); return; }
    var sec = entry.sec, ch = entry.ch;

    document.title = sec.title + " · 考研数学二公式大全";
    var crumb = $("#crumb"); if (crumb) crumb.textContent = "PART 0" + (data.chapters.indexOf(ch) + 1) + " · " + ch.title;
    var h = $("#pageTitle"); if (h) h.textContent = sec.title;
    var meta = $("#pageMeta");
    if (meta) meta.textContent = sec.items.length + " 条公式 · 搜索可按名称、条件与关键词过滤";

    // 胶囊导航（跨页）
    var chips = $("#chipsRow");
    if (chips) {
      allSections().forEach(function (x) {
        var a = document.createElement("a");
        a.className = "chip" + (x.sec.id === sec.id ? " active" : "");
        a.href = "section.html?id=" + x.sec.id;
        a.textContent = x.sec.title;
        chips.appendChild(a);
      });
    }

    var box = $("#cards");
    var delay = 0;
    sec.items.forEach(function (item, ii) {
      var rec = buildCard(item, ii + 1, {});
      rec.el.style.animationDelay = Math.min(delay, 320) + "ms";
      delay += 45;
      cards.push(rec);
      box.appendChild(rec.el);
    });

    buildToc(sec.id);
  }

  function buildFavorites() {
    var box = $("#cards");
    var found = 0, delay = 0;
    allSections().forEach(function (x) {
      x.sec.items.forEach(function (item, ii) {
        if (!state.favs.has(item.id)) return;
        found++;
        var rec = buildCard(item, ii + 1, {
          showSource: true,
          source: { title: x.sec.title, href: "section.html?id=" + x.sec.id + "#f-" + item.id }
        });
        rec.el.style.animationDelay = Math.min(delay, 320) + "ms";
        delay += 45;
        cards.push(rec);
        box.appendChild(rec.el);
      });
    });

    // 收藏里的做题技巧
    (data.tips || []).forEach(function (tip, ii) {
      if (!state.favs.has(tip.id)) return;
      found++;
      var rec = buildTipCard(tip, ii + 1, {
        showSource: true,
        source: { title: "做题技巧", href: "tips.html#f-" + tip.id }
      });
      rec.el.style.animationDelay = Math.min(delay, 320) + "ms";
      delay += 45;
      cards.push(rec);
      box.appendChild(rec.el);
    });

    var meta = $("#pageMeta");
    if (meta) meta.textContent = found + " 条收藏 · 取消收藏后即时移出列表";
    if (found === 0) $("#emptyState") && ($("#emptyState").hidden = false);
    updateBadges();
    buildToc(null);
  }

  /* ---------- 做题技巧页 ---------- */
  var TIP_GROUP_TITLE = { "选择题": "选择题技巧", "填空题": "填空题技巧", "解答题": "解答题技巧", "专项": "高频题型专项" };
  var TIP_GROUP_NOTE = { "选择题": "10 题 × 5 分 = 50 分", "填空题": "6 题 × 5 分 = 30 分", "解答题": "6 题 ≈ 70 分", "专项": "按题型逐个击破" };

  function buildTips() {
    var box = $("#tips");
    if (!box) return;
    var groups = [];
    (data.tips || []).forEach(function (t) {
      if (groups.indexOf(t.group) < 0) groups.push(t.group);
    });

    var total = 0, delay = 0;
    groups.forEach(function (gname, gi) {
      var list = data.tips.filter(function (t) { return t.group === gname; });
      var sec = document.createElement("section");
      sec.className = "tip-group";
      sec.id = "g-tip-" + gi;

      var head = document.createElement("div");
      head.className = "tip-head";
      head.innerHTML = "<h2>" + esc(TIP_GROUP_TITLE[gname] || gname) + "</h2>" +
        '<span class="tip-note">' + esc(TIP_GROUP_NOTE[gname] || "") + "</span>";
      sec.appendChild(head);

      var cardsBox = document.createElement("div");
      cardsBox.className = "cards";
      list.forEach(function (tip, ii) {
        var rec = buildTipCard(tip, ii + 1, {});
        rec.el.style.animationDelay = Math.min(delay, 320) + "ms";
        delay += 45;
        total++;
        cards.push(rec);
        cardsBox.appendChild(rec.el);
      });
      sec.appendChild(cardsBox);
      box.appendChild(sec);
    });

    var meta = $("#pageMeta");
    if (meta) meta.textContent = total + " 条技巧 · 按题型分类，可直接搜索“排除法”“辅助函数”等";

    buildTipsToc(groups);
    updateBadges();
  }

  function buildTipsToc(groups) {
    var toc = $("#toc");
    if (!toc) return;
    var frag = document.createDocumentFragment();
    var t = document.createElement("div");
    t.className = "toc-title";
    t.textContent = "题型分类";
    frag.appendChild(t);
    groups.forEach(function (g, i) {
      var a = document.createElement("a");
      a.href = "#g-tip-" + i;
      a.textContent = TIP_GROUP_TITLE[g] || g;
      frag.appendChild(a);
    });
    var back = document.createElement("a");
    back.href = "index.html";
    back.style.marginTop = "10px";
    back.textContent = "← 返回公式目录";
    frag.appendChild(back);
    toc.appendChild(frag);
  }

  function buildToc(activeId) {
    var toc = $("#toc");
    if (!toc) return;
    var frag = document.createDocumentFragment();
    var t = document.createElement("div");
    t.className = "toc-title";
    t.textContent = "全部章节";
    frag.appendChild(t);
    data.chapters.forEach(function (ch) {
      var g = document.createElement("div");
      g.className = "toc-group";
      g.textContent = ch.title;
      frag.appendChild(g);
      ch.sections.forEach(function (sec) {
        var a = document.createElement("a");
        a.href = "section.html?id=" + sec.id;
        if (sec.id === activeId) a.className = "active";
        a.textContent = sec.title;
        frag.appendChild(a);
      });
    });
    toc.appendChild(frag);
  }

  /* ---------- 搜索过滤 ---------- */
  function applyFilter() {
    var q = state.query.trim().toLowerCase();
    var tokens = q ? q.split(/\s+/) : [];
    var visible = 0;
    cards.forEach(function (rec) {
      var ok = true;
      if (page === "favorites" && !state.favs.has(rec.item.id)) ok = false;
      if (ok && tokens.length) {
        for (var i = 0; i < tokens.length; i++) {
          if (rec.hay.indexOf(tokens[i]) < 0) { ok = false; break; }
        }
      }
      rec.el.hidden = !ok;
      if (ok) visible++;
      var nm = rec.item.name || rec.item.title || "";
      rec.nameEl.innerHTML = tokens.length ? highlight(nm, tokens[0]) : esc(nm);
    });

    var empty = $("#emptyState");
    if (empty) {
      if (visible === 0) {
        empty.hidden = false;
        $("#emptyText").textContent = (page === "favorites" && state.favs.size === 0)
          ? "还没有收藏任何公式" : "没有找到相关公式";
      } else empty.hidden = true;
    }
    var chip = $("#resultChip");
    if (chip) {
      if (q) { chip.hidden = false; chip.textContent = visible + " 条结果"; }
      else chip.hidden = true;
    }
    var cb = $("#clearBtn");
    if (cb) cb.hidden = !state.query;

    // 技巧页：隐藏没有结果的分组
    if (page === "tips") {
      $$(".tip-group").forEach(function (g) {
        g.hidden = !$$(".tip-card", g).some(function (c) { return !c.hidden; });
      });
    }
    // 收藏页：隐藏无结果（保持分组无）
  }

  /* ---------- 顶栏高度 ---------- */
  function measureTop() {
    var bar = $("#topbar");
    if (bar) document.documentElement.style.setProperty("--top-h", bar.offsetHeight + "px");
    markOverflow();
  }

  /* ---------- 事件 ---------- */
  function bind() {
    var input = $("#searchInput");
    if (input) {
      var timer = null;
      input.addEventListener("input", function () {
        clearTimeout(timer);
        timer = setTimeout(function () { state.query = input.value; applyFilter(); }, 120);
      });
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          var first = cards.filter(function (r) { return !r.el.hidden; })[0];
          if (first) first.el.scrollIntoView({ behavior: "smooth", block: "center" });
          input.blur();
        }
      });
      $("#clearBtn").addEventListener("click", function () {
        input.value = ""; state.query = ""; applyFilter(); input.focus();
      });
      $("#resetBtn") && $("#resetBtn").addEventListener("click", function () {
        input.value = ""; state.query = ""; applyFilter();
      });
    }
    window.addEventListener("resize", measureTop);
    window.addEventListener("orientationchange", function () { setTimeout(measureTop, 250); });
  }

  /* ---------- 启动 ---------- */
  function init() {
    buildIndex();
    bind();
    if (page === "home") buildHome();
    else if (page === "section") buildSection();
    else if (page === "tips") buildTips();
    else if (page === "favorites") buildFavorites();
    measureTop();
    applyFilter();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();

  window.addEventListener("load", function () {
    renderMathReady();
    if (typeof katex === "undefined") {
      var b = $("#katexBanner"); if (b) b.hidden = false;
      $$(".formula").forEach(function (el) {
        if (!el._rendered) {
          el.innerHTML = '<span class="raw"></span>';
          el.firstChild.textContent = el.dataset.tex;
          el._rendered = true;
        }
      });
    }
    measureTop();
  });
})();
