/* ============================================================
   考研数学二公式大全 · 交互逻辑
   搜索 / 章节导航 / 收藏 / 深浅色 / KaTeX 渲染
   ============================================================ */
(function () {
  "use strict";

  var data = window.MATH2_DATA;
  var LS_FAV = "m2-fav";
  var LS_THEME = "m2-theme";

  var state = {
    favOnly: false,
    query: "",
    favs: loadFavs()
  };

  var cards = [];        // {el, item, section, haystack, nameEl}
  var secEls = {};       // sectionId -> {el, cards, chip, tocLink}
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- 本地存储 ---------- */
  function loadFavs() {
    try { return new Set(JSON.parse(localStorage.getItem(LS_FAV) || "[]")); }
    catch (e) { return new Set(); }
  }
  function saveFavs() {
    try { localStorage.setItem(LS_FAV, JSON.stringify(Array.from(state.favs))); } catch (e) {}
  }

  /* ---------- 主题 ---------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem(LS_THEME); } catch (e) {}
    var sysDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (sysDark ? "dark" : "light");
    applyTheme(theme);
  }
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem(LS_THEME, t); } catch (e) {}
  }
  function currentTheme() { return document.documentElement.getAttribute("data-theme"); }

  /* ---------- 文本工具 ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function highlight(text, q) {
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

  /* ---------- 构建页面 ---------- */
  function build() {
    var wrap = $("#sections");
    var frag = document.createDocumentFragment();
    var total = 0, secCount = 0;
    var chips = $("#chipsRow");
    var toc = $("#toc");
    var sheetBody = $("#sheetBody");

    // "全部" chip
    var allChip = document.createElement("button");
    allChip.className = "chip active";
    allChip.textContent = "全部";
    allChip.dataset.target = "top";
    chips.appendChild(allChip);

    var tocFrag = document.createDocumentFragment();
    var sheetFrag = document.createDocumentFragment();

    data.chapters.forEach(function (ch, gi) {
      var group = document.createElement("section");
      group.className = "group";
      group.id = "g-" + ch.id;

      var gh = document.createElement("div");
      gh.className = "group-head";
      gh.innerHTML =
        '<span class="g-num">PART 0' + (gi + 1) + "</span>" +
        "<h2>" + esc(ch.title) + "</h2>" +
        '<span class="g-line"></span>';
      group.appendChild(gh);

      var gToc = document.createElement("div");
      gToc.className = "toc-group";
      gToc.textContent = ch.title;
      tocFrag.appendChild(gToc);

      var gSheet = document.createElement("div");
      gSheet.className = "sheet-group";
      gSheet.textContent = ch.title;
      sheetFrag.appendChild(gSheet);

      ch.sections.forEach(function (sec, si) {
        secCount++;
        var secEl = document.createElement("section");
        secEl.className = "section";
        secEl.id = "s-" + sec.id;

        var sh = document.createElement("header");
        sh.className = "sec-head";
        sh.innerHTML =
          '<span class="sec-dot"></span><h3>' + esc(sec.title) + "</h3>" +
          '<span class="sec-count">' + sec.items.length + " 条</span>";
        secEl.appendChild(sh);

        var cardsBox = document.createElement("div");
        cardsBox.className = "cards";
        var secCards = [];
        var delay = 0;

        sec.items.forEach(function (item, ii) {
          var card = document.createElement("article");
          card.className = "card";
          card.id = "f-" + item.id;
          card.style.animationDelay = Math.min(delay, 320) + "ms";
          delay += 45;

          var head = document.createElement("div");
          head.className = "card-head";

          var idx = document.createElement("span");
          idx.className = "card-idx";
          idx.textContent = ii + 1;

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

          head.appendChild(idx);
          head.appendChild(name);
          head.appendChild(fav);
          card.appendChild(head);

          var fBox = document.createElement("div");
          fBox.className = "formula";
          card.appendChild(fBox);

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

          cardsBox.appendChild(card);

          var hay = (item.name + " " + (item.cond || "") + " " + (item.warn || "") + " " +
            (item.kw ? item.kw.join(" ") : "") + " " + item.tex +
            " " + ch.title + " " + sec.title).toLowerCase();

          var rec = { el: card, item: item, secId: sec.id, hay: hay, nameEl: name, favBtn: fav };
          cards.push(rec);
          secCards.push(rec);
          total++;

          // 渲染公式（KaTeX 可能稍后就绪，先存引用）
          renderMath(fBox, item.tex);
        });

        secEl.appendChild(cardsBox);
        group.appendChild(secEl);

        // 导航
        var chip = document.createElement("button");
        chip.className = "chip";
        chip.textContent = sec.title;
        chip.dataset.target = sec.id;
        chips.appendChild(chip);

        var link = document.createElement("a");
        link.href = "#s-" + sec.id;
        link.textContent = sec.title;
        tocFrag.appendChild(link);

        var sLink = document.createElement("a");
        sLink.href = "#s-" + sec.id;
        sLink.innerHTML = esc(sec.title) + "<span>" + sec.items.length + "</span>";
        sheetFrag.appendChild(sLink);

        secEls[sec.id] = { el: secEl, cards: secCards, chip: chip, tocLink: link, count: secCards.length };
      });

      frag.appendChild(group);
    });

    wrap.appendChild(frag);
    toc.appendChild(tocFrag);
    sheetBody.appendChild(sheetFrag);

    $("#statNum").textContent = total;
    $("#statSec").textContent = secCount;
    $("#brandSub").textContent = "高等数学 · 线性代数 · 共 " + total + " 条";
    if (data.meta && data.meta.scope) $("#heroScope").textContent = data.meta.scope;
    if (data.meta && data.meta.title) $("#heroTitle").textContent = data.meta.title;

    // chips 点击
    chips.addEventListener("click", function (e) {
      var b = e.target.closest(".chip");
      if (!b) return;
      var t = b.dataset.target;
      var el = t === "top" ? document.body : document.getElementById("s-" + t);
      if (el) el.scrollIntoView({ behavior: "smooth", block: t === "top" ? "start" : "start" });
      setActiveChip(t);
    });

    // 目录点击（平滑 + 关闭弹层）
    [toc, sheetBody].forEach(function (box) {
      box.addEventListener("click", function (e) {
        var a = e.target.closest("a[href^='#s-']");
        if (!a) return;
        e.preventDefault();
        var id = a.getAttribute("href").slice(3);
        var s = secEls[id];
        if (s) {
          s.el.scrollIntoView({ behavior: "smooth", block: "start" });
          setActiveChip(id);
        }
        closeSheet();
      });
    });

    updateFavStats();
    renderMathReady(); // 若 KaTeX 已就绪，此轮完成渲染
  }

  /* ---------- KaTeX ---------- */
  function renderMath(el, tex) {
    el.dataset.tex = tex;
    el._rendered = false;
    tryRender(el);
  }
  function tryRender(el) {
    if (el._rendered) return;
    if (typeof katex === "undefined") return;
    try {
      katex.render(el.dataset.tex, el, {
        displayMode: true,
        throwOnError: false,
        strict: false,
        output: "html",
        trust: false
      });
      el._rendered = true;
    } catch (e) {
      el.innerHTML = '<span class="raw"></span>';
      el.firstChild.textContent = el.dataset.tex;
      el._rendered = true;
    }
  }
  function renderMathReady() {
    if (typeof katex !== "undefined") {
      $$(".formula").forEach(tryRender);
      $("#katexBanner").hidden = true;
      markOverflow();
    }
  }

  /* 长公式：标记可横向滑动 */
  function markOverflow() {
    $$(".formula").forEach(function (f) {
      var inner = f.firstElementChild;
      if (!inner) return;
      f.classList.toggle("ovf", inner.scrollWidth - inner.clientWidth > 4);
    });
  }

  /* ---------- 收藏 ---------- */
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
    updateFavStats();
    if (state.favOnly) applyFilter();
  }
  function updateFavStats() {
    var n = state.favs.size;
    $("#statFav").textContent = n;
    var badge = $("#favBadge");
    badge.textContent = n;
    badge.hidden = n === 0;
    $("#favBtn").classList.toggle("on", state.favOnly);
    $("#favBtn").setAttribute("aria-pressed", state.favOnly ? "true" : "false");
    $$(".tab").forEach(function (t) {
      if (t.dataset.tab === "fav") t.classList.toggle("active", state.favOnly);
      if (t.dataset.tab === "all") t.classList.toggle("active", !state.favOnly);
    });
  }

  /* ---------- 搜索 / 过滤 ---------- */
  function applyFilter() {
    var q = state.query.trim().toLowerCase();
    var tokens = q ? q.split(/\s+/) : [];
    var visible = 0;

    cards.forEach(function (rec) {
      var ok = true;
      if (state.favOnly && !state.favs.has(rec.item.id)) ok = false;
      if (ok && tokens.length) {
        for (var i = 0; i < tokens.length; i++) {
          if (rec.hay.indexOf(tokens[i]) < 0) { ok = false; break; }
        }
      }
      rec.el.hidden = !ok;
      if (ok) visible++;

      // 高亮名称
      rec.nameEl.innerHTML = tokens.length ? highlight(rec.item.name, tokens[0]) : esc(rec.item.name);
    });

    // 显隐章节 / 分组
    Object.keys(secEls).forEach(function (id) {
      var s = secEls[id];
      var c = s.cards.filter(function (r) { return !r.el.hidden; }).length;
      s.el.hidden = c === 0;
      s.chip.hidden = c === 0;
      if (s.tocLink) s.tocLink.style.display = c === 0 ? "none" : "";
      var cnt = $(".sec-count", s.el);
      if (cnt) cnt.textContent = c + " 条";
    });
    $$(".group").forEach(function (g) {
      g.hidden = !$$(".section", g).some(function (s) { return !s.hidden; });
    });

    $("#emptyState").hidden = visible > 0;
    var chip = $("#resultChip");
    if (state.query || state.favOnly) {
      chip.hidden = false;
      chip.textContent = visible + " 条结果" + (state.favOnly ? " · 收藏" : "");
      $("#emptyText").textContent = state.favOnly && state.favs.size === 0
        ? "还没有收藏任何公式" : "没有找到相关公式";
    } else {
      chip.hidden = true;
    }
    $("#clearBtn").hidden = !state.query;
  }

  /* ---------- 目录高亮（滚动监听） ---------- */
  function setActiveChip(id) {
    $$(".chip").forEach(function (c) {
      c.classList.toggle("active", c.dataset.target === id);
    });
    Object.keys(secEls).forEach(function (k) {
      if (secEls[k].tocLink) secEls[k].tocLink.classList.toggle("active", k === id);
    });
    // 横向 chips 滚动到可见
    var active = $('.chip.active[data-target="' + id + '"]');
    if (active && active.scrollIntoView) {
      try { active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); } catch (e) {}
    }
  }

  function initSpy() {
    if (!("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (entries) {
      // 选择最靠上的可见 section
      var best = null;
      entries.forEach(function (en) {
        if (en.isIntersecting && (!best || en.boundingClientRect.top < best.boundingClientRect.top)) best = en;
      });
      if (best) {
        var id = best.target.id.replace("s-", "");
        setActiveChip(id);
      }
    }, { rootMargin: "-" + (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--top-h")) || 160) + "px 0px -55% 0px", threshold: 0 });

    Object.keys(secEls).forEach(function (k) { io.observe(secEls[k].el); });
  }

  /* ---------- 顶栏高度 ---------- */
  function measureTop() {
    var h = $("#topbar").offsetHeight;
    document.documentElement.style.setProperty("--top-h", h + "px");
    if (typeof markOverflow === "function") markOverflow();
  }

  /* ---------- 弹层 ---------- */
  function openSheet() {
    $("#sheet").hidden = false;
    $("#sheetMask").hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    $("#sheet").hidden = true;
    $("#sheetMask").hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- 事件绑定 ---------- */
  function bind() {
    // 搜索
    var input = $("#searchInput");
    var timer = null;
    input.addEventListener("input", function () {
      clearTimeout(timer);
      timer = setTimeout(function () {
        state.query = input.value;
        applyFilter();
      }, 120);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        var first = cards.find(function (r) { return !r.el.hidden; });
        if (first) first.el.scrollIntoView({ behavior: "smooth", block: "center" });
        input.blur();
      }
    });
    $("#clearBtn").addEventListener("click", function () {
      input.value = "";
      state.query = "";
      applyFilter();
      input.focus();
    });
    $("#resetBtn").addEventListener("click", function () {
      input.value = "";
      state.query = "";
      state.favOnly = false;
      updateFavStats();
      applyFilter();
    });

    // 主题
    $("#themeBtn").addEventListener("click", function () {
      applyTheme(currentTheme() === "dark" ? "light" : "dark");
    });

    // 收藏筛选（顶栏心形）
    $("#favBtn").addEventListener("click", function () {
      state.favOnly = !state.favOnly;
      updateFavStats();
      applyFilter();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // 底部标签
    $$(".tab").forEach(function (t) {
      t.addEventListener("click", function () {
        var tab = t.dataset.tab;
        if (tab === "toc") { openSheet(); return; }
        state.favOnly = tab === "fav";
        updateFavStats();
        applyFilter();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    });
    $("#sheetMask").addEventListener("click", closeSheet);
    $("#sheetClose").addEventListener("click", closeSheet);

    window.addEventListener("resize", measureTop);
    window.addEventListener("orientationchange", function () { setTimeout(measureTop, 250); });
  }

  /* ---------- 启动 ---------- */
  function init() {
    initTheme();
    build();
    bind();
    measureTop();
    initSpy();
    applyFilter();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // KaTeX 到位后再补渲染
  window.addEventListener("load", function () {
    renderMathReady();
    if (typeof katex === "undefined") {
      $("#katexBanner").hidden = false;
      $$(".formula").forEach(function (el) {
        if (!el._rendered) {
          el.innerHTML = '<span class="raw"></span>';
          el.firstChild.textContent = el.dataset.tex;
          el._rendered = true;
        }
      });
    }
    measureTop();
    if (window.scrollY < 60) setActiveChip("top");
  });
})();
