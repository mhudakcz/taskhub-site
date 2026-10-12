/* Taskhub site – renders content.js into the page and drives the motion.
 * No content lives here (all texts are in content.js, in Czech and English).
 * Motion is only enabled when <html> has the class "motion" (set in index.html
 * when the visitor does not prefer reduced motion).
 * Language (cs | en) is resolved in index.html before first paint
 * (window.TASKHUB_LANG); switching it saves the choice and reloads the page.
 */
(function () {
  "use strict";
  var data = window.TASKHUB_SITE;
  if (!data) return;

  var root = document.documentElement;
  var MOTION = root.classList.contains("motion");
  var FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var live = document.getElementById("live");

  /* --------------------------------------------------------------- i18n -- */
  var LANGS = ["cs", "en"];
  var LANG = LANGS.indexOf(window.TASKHUB_LANG) >= 0 ? window.TASKHUB_LANG : "cs";
  root.lang = LANG;
  // Resolve a content value for the current language:
  // { cs, en } -> current language, falling back to Czech; arrays item by item;
  // plain strings/numbers as-is.
  function tr(v) {
    if (v == null) return "";
    if (Array.isArray(v)) return v.map(tr);
    if (typeof v === "object" && ("cs" in v || "en" in v)) {
      var x = v[LANG] != null && v[LANG] !== "" ? v[LANG] : v.cs;
      return x == null ? "" : x;
    }
    return v;
  }
  var UI = data.ui || {};
  // Resolve every { cs, en } pair in the content once, so the renderers below
  // work with plain strings.
  function resolveAll(v) {
    if (Array.isArray(v)) return v.map(resolveAll);
    if (v && typeof v === "object") {
      if ("cs" in v || "en" in v) return tr(v);
      var o = {};
      Object.keys(v).forEach((k) => (o[k] = k === "ui" ? v[k] : resolveAll(v[k])));
      return o;
    }
    return v;
  }
  data = resolveAll(data);
  // UI text by key, with {placeholders} filled in from `vars`.
  function t(key, vars) {
    var s = key in UI ? tr(UI[key]) : key;
    if (vars && typeof s === "string")
      s = s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
    return s;
  }
  // Static texts in index.html: data-i18n="key" (inner HTML) and
  // data-i18n-attr="attr:key; attr2:key2".
  document.title = t("meta.title");
  var metaDesc = document.getElementById("meta-description");
  if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));
  document.querySelectorAll("[data-i18n]").forEach(function (el) {
    var key = el.getAttribute("data-i18n");
    if (key in UI) el.innerHTML = t(key);
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(function (el) {
    el.getAttribute("data-i18n-attr")
      .split(";")
      .forEach(function (pair) {
        var i = pair.indexOf(":");
        if (i < 0) return;
        var attr = pair.slice(0, i).trim();
        var key = pair.slice(i + 1).trim();
        if (attr && key in UI) el.setAttribute(attr, t(key));
      });
  });

  /* ---------------------------------------------------- language switch -- */
  var LANG_KEY = "taskhub-site-lang";
  var SCROLL_KEY = "taskhub-site-scroll";
  var langSwitch = document.getElementById("lang-switch");
  function langUrl(l) {
    var u = new URL(location.href);
    u.searchParams.set("lang", l);
    return u.pathname + u.search + u.hash;
  }
  if (langSwitch) {
    langSwitch.querySelectorAll("a[data-lang]").forEach(function (a) {
      var l = a.getAttribute("data-lang");
      a.href = langUrl(l);
      if (l === LANG) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
      a.addEventListener("click", function (e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0) return;
        e.preventDefault();
        if (l === LANG) return;
        try {
          localStorage.setItem(LANG_KEY, l);
        } catch {
          /* storage blocked – the URL parameter still carries the choice */
        }
        try {
          sessionStorage.setItem(SCROLL_KEY, String(Math.round(scrollY)));
        } catch {
          /* ignore */
        }
        // All texts are rendered once (split headings, observers, timers),
        // so the simplest reliable switch is a reload with ?lang=.
        location.replace(langUrl(l));
      });
    });
  }

  /* ------------------------------------------------------------ helpers -- */
  var STATUS = {
    done: { label: t("status.done"), icon: '<path d="M20 6L9 17l-5-5"/>' },
    "in-progress": {
      label: t("status.in-progress"),
      icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    },
    planned: {
      label: t("status.planned"),
      icon: '<circle cx="12" cy="12" r="9" stroke-dasharray="3 3"/>',
    },
  };
  var KINDS = {
    feature: t("kind.feature"),
    improvement: t("kind.improvement"),
    fix: t("kind.fix"),
    design: t("kind.design"),
    setup: t("kind.setup"),
  };
  var MONTHS = t("months");

  // lucide-style paths (stroke icons, 24x24)
  var ICONS = {
    users:
      '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    board: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 7v7M12 7v3M16 7v9"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    receipt:
      '<path d="M5 3v18l2.5-1.5L10 21l2-1.5 2 1.5 2.5-1.5L19 21V3l-2.5 1.5L14 3l-2 1.5L10 3 7.5 4.5z"/><path d="M9 9h6M9 13h6"/>',
    handshake:
      '<path d="M11 17l2 2a1.4 1.4 0 0 0 2-2"/><path d="M14 14l2.5 2.5a1.4 1.4 0 0 0 2-2L15 11l-3 3-1-1a2 2 0 0 1 0-3l2.5-2.5a2.8 2.8 0 0 1 3.5-.3L18 8h3v7"/><path d="M3 8h3l3.5-2.3a2.8 2.8 0 0 1 3 0"/><path d="M3 8v7l5.5 5.5a1.4 1.4 0 0 0 2-2"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.9 1.9 0 0 0 3.4 0"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    palette:
      '<path d="M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.5 3.3A1.6 1.6 0 0 1 12 22z"/><circle cx="7.5" cy="11.5" r="1"/><circle cx="10.5" cy="7" r="1"/><circle cx="15.5" cy="7.5" r="1"/>',
    languages: '<path d="M5 8l6 6M4 14l6-6 2-3M2 5h12M7 2h1M22 22l-5-10-5 10M14 18h6"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3L8 21M16 3l-2 18"/>',
    layers: '<path d="M12 2l10 5-10 5L2 7z"/><path d="M2 12l10 5 10-5M2 17l10 5 10-5"/>',
    move: '<path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    download:
      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5M12 15V3"/>',
    plug: '<path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0zM12 18v4"/>',
    sparkles:
      '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 3v4M17 5h4"/>',
  };

  function svg(paths, cls) {
    return (
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"' +
      (cls ? ' class="' + cls + '"' : "") +
      ">" +
      paths +
      "</svg>"
    );
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function badge(status) {
    var s = STATUS[status] || STATUS.planned;
    return '<span class="badge ' + status + '">' + svg(s.icon) + s.label + "</span>";
  }
  function announce(text) {
    if (live) live.textContent = text;
  }
  function $(id) {
    return document.getElementById(id);
  }
  function fmtDate(iso) {
    var p = iso.split("-");
    return LANG === "en"
      ? +p[2] + " " + MONTHS[+p[1] - 1] + " " + p[0]
      : +p[2] + ". " + +p[1] + ". " + p[0];
  }

  /* ---------------------------------------------------- derived roadmap -- */
  var byId = {};
  data.roadmap.forEach(function (m) {
    byId[m.id] = m;
  });
  function moduleStatus(mod) {
    if (mod.status) return mod.status;
    var st = (mod.milestones || []).map(function (id) {
      return byId[id] ? byId[id].status : "planned";
    });
    if (st.length && st.every((s) => s === "done")) return "done";
    if (st.some((s) => s === "done" || s === "in-progress")) return "in-progress";
    return "planned";
  }
  var doneCount = data.roadmap.filter((m) => m.status === "done").length;
  var total = data.roadmap.length;
  var active = data.roadmap.find((m) => m.status === "in-progress");

  /* --------------------------------------------------------------- hero -- */
  var hs = $("hero-status");
  if (hs) {
    hs.textContent = active
      ? t("hero.statusActive", { id: active.id, title: active.title })
      : doneCount === total
        ? t("hero.statusDone")
        : t("hero.status");
  }

  var news = data.news || [];
  var pill = $("news-pill");
  var pillText = $("news-pill-text");
  var pillTag = pill && pill.querySelector(".np-tag");
  function setPill(n) {
    if (!pill || !n) return;
    pillText.textContent = n.title;
    var kind = KINDS[n.kind] || t("hero.pillTag");
    if (pillTag) pillTag.textContent = kind;
    pill.href = "#news-" + n.id;
    pill.setAttribute("aria-label", kind + ": " + n.title);
  }
  if (news.length) setPill(news[0]);
  if (MOTION && pill && news.length > 1) {
    // Cycle the latest two entries a few times, pause on hover/focus.
    var pillIdx = 0;
    var pillRounds = 0;
    var pillHold = false;
    pill.addEventListener("mouseenter", () => (pillHold = true));
    pill.addEventListener("mouseleave", () => (pillHold = false));
    pill.addEventListener("focus", () => (pillHold = true));
    pill.addEventListener("blur", () => (pillHold = false));
    var pillTimer = setInterval(function () {
      if (pillHold || document.hidden) return;
      if (++pillRounds > 6) return clearInterval(pillTimer);
      pillIdx = (pillIdx + 1) % 2;
      pillText.classList.remove("swap");
      void pillText.offsetWidth;
      pillText.classList.add("swap");
      setTimeout(() => setPill(news[pillIdx]), 280);
    }, 4200);
  }

  /* ------------------------------------------------------------ marquee -- */
  var TONE = {
    todo: "var(--g-todo)",
    doing: "var(--g-doing)",
    test: "var(--g-test)",
    done: "var(--g-done)",
    brand: "var(--g-brand)",
  };
  function tickerItems(list, clone) {
    return list
      .map(function (t) {
        return (
          "<li" +
          (clone ? ' class="clone" aria-hidden="true"' : "") +
          '><span style="--g:' +
          (TONE[t.tone] || TONE.brand) +
          '">' +
          svg(ICONS[t.icon] || ICONS.sparkles) +
          "</span>" +
          esc(t.text) +
          "</li>"
        );
      })
      .join("");
  }
  var ticker = data.ticker || [];
  if (ticker.length) {
    var half = Math.ceil(ticker.length / 2);
    [
      ["mq-a", ticker.slice(0, half)],
      ["mq-b", ticker.slice(half)],
    ].forEach(function (pair) {
      var el = $(pair[0]);
      if (!el) return;
      el.innerHTML = tickerItems(pair[1], false);
      // A second, identical track makes the loop seamless (motion only).
      var copy = el.cloneNode(true);
      copy.removeAttribute("id");
      copy.setAttribute("aria-hidden", "true");
      copy.classList.add("clone");
      copy.innerHTML = tickerItems(pair[1], false);
      el.parentNode.appendChild(copy);
    });
  }

  /* -------------------------------------------------------------- stats -- */
  var statsEl = $("stats");
  if (statsEl) {
    var C = 2 * Math.PI * 22;
    statsEl.innerHTML =
      '<li class="feature"><svg class="stat-ring" viewBox="0 0 52 52" aria-hidden="true"><defs><linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c5cff"/><stop offset=".5" stop-color="#c34bff"/><stop offset="1" stop-color="#ff4f9a"/></linearGradient></defs><circle class="bgc" cx="26" cy="26" r="22"/><circle class="fg" id="ring-fg" cx="26" cy="26" r="22" stroke-dasharray="' +
      C.toFixed(1) +
      '" stroke-dashoffset="' +
      (MOTION ? C : C * (1 - doneCount / total)).toFixed(1) +
      '"/></svg><span class="stat-num grad"><span data-count="' +
      doneCount +
      '">' +
      (MOTION ? 0 : doneCount) +
      "</span>/" +
      total +
      '</span><span class="stat-label">' +
      esc(t("stats.milestones")) +
      "</span></li>" +
      (data.stats || [])
        .map(function (s) {
          return (
            '<li><span class="stat-num"><span data-count="' +
            s.value +
            '">' +
            (MOTION ? 0 : s.value) +
            '</span></span><span class="stat-label">' +
            esc(s.label) +
            "</span></li>"
          );
        })
        .join("");
    statsEl.setAttribute("data-ring", (C * (1 - doneCount / total)).toFixed(1));
  }
  function countUp(nums) {
    var t0 = performance.now();
    var D = 1700;
    function frame(t) {
      var p = Math.min(1, (t - t0) / D);
      var e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p); // easeOutExpo
      nums.forEach(function (n) {
        n.textContent = Math.round(+n.dataset.count * e);
      });
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  function runCounters() {
    countUp(statsEl.querySelectorAll("[data-count]"));
    var fg = $("ring-fg");
    if (fg) fg.style.strokeDashoffset = statsEl.getAttribute("data-ring");
  }

  /* -------------------------------------------------------------- modules -- */
  var modEl = $("modules");
  if (modEl) {
    var ICON_TONES = [TONE.brand, TONE.todo, TONE.test, TONE.doing, TONE.done];
    modEl.innerHTML = data.modules
      .map(function (m, idx) {
        return (
          '<li><div class="module"><div class="module-head"><span class="module-icon" style="--g:' +
          ICON_TONES[idx % ICON_TONES.length] +
          '">' +
          svg(ICONS[m.icon] || ICONS.board) +
          "</span><div><h3>" +
          esc(m.title) +
          "</h3>" +
          badge(moduleStatus(m)) +
          "</div></div><ul>" +
          m.items.map((i) => "<li>" + esc(i) + "</li>").join("") +
          '</ul><p class="ms">' +
          esc(t((m.milestones || []).length > 1 ? "milestones" : "milestone")) +
          " " +
          (m.milestones || []).join(", ") +
          "</p></div></li>"
        );
      })
      .join("");
    // spotlight + tilt following the cursor
    modEl.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var card = e.target.closest(".module");
      if (!card) return;
      var r = card.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width;
      var y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", x * 100 + "%");
      card.style.setProperty("--my", y * 100 + "%");
      if (MOTION) {
        card.classList.add("tilting");
        card.style.setProperty("--try", (x - 0.5) * 7 + "deg");
        card.style.setProperty("--trx", (0.5 - y) * 7 + "deg");
      }
    });
    modEl.addEventListener(
      "pointerout",
      function (e) {
        var card = e.target.closest(".module");
        if (!card || card.contains(e.relatedTarget)) return;
        card.classList.remove("tilting");
        card.style.setProperty("--try", "0deg");
        card.style.setProperty("--trx", "0deg");
      },
      true,
    );
  }

  /* ------------------------------------------------------------ roadmap -- */
  var rmEl = $("roadmap");
  if (rmEl) {
    rmEl.innerHTML = data.roadmap
      .map(function (m) {
        return (
          '<li class="milestone ' +
          m.status +
          '"' +
          (m.status === "in-progress" ? ' aria-current="step"' : "") +
          '><span class="num">' +
          esc(m.id) +
          '</span><div class="ms-card"><div class="milestone-top"><h3>' +
          esc(m.title) +
          "</h3>" +
          badge(m.status) +
          (m.status === "in-progress"
            ? '<span class="now">' + esc(t("roadmap.working")) + "</span>"
            : "") +
          "</div><p>" +
          esc(m.text) +
          "</p></div></li>"
        );
      })
      .join("");
    var sum = $("roadmap-summary");
    if (sum) sum.textContent = t("roadmap.summary", { done: doneCount, total: total });
    var pct = Math.round((doneCount / total) * 100);
    var pctEl = $("rm-pct");
    pctEl.setAttribute("data-count", pct);
    pctEl.textContent = MOTION ? 0 : pct;
    var nextM = data.roadmap.find((m) => m.status === "planned");
    $("rm-now").textContent = active ? active.id + " · " + active.title : "–";
    $("rm-next").textContent = nextM ? nextM.id + " · " + nextM.title : t("roadmap.allDone");
    if (!MOTION) $("roadmap-bar").style.width = pct + "%";
  }

  /* --------------------------------------------------------------- news -- */
  var newsEl = $("news");
  if (newsEl) {
    newsEl.innerHTML = news
      .map(function (n) {
        var p = n.date.split("-");
        return (
          '<li class="news-item" id="news-' +
          esc(n.id) +
          '" data-rv="right"><time class="news-date" datetime="' +
          esc(n.date) +
          '"><b>' +
          +p[2] +
          (LANG === "en" ? "" : ".") +
          "</b><small>" +
          MONTHS[+p[1] - 1] +
          " " +
          p[0] +
          '</small></time><article class="news-card"><div class="news-meta"><span class="kind ' +
          esc(n.kind) +
          '">' +
          esc(KINDS[n.kind] || n.kind) +
          "</span>" +
          (n.milestone ? "<span>" + esc(t("milestone")) + " " + esc(n.milestone) + "</span>" : "") +
          "<span>" +
          fmtDate(n.date) +
          "</span></div><h3>" +
          esc(n.title) +
          "</h3><ul>" +
          n.items.map((i) => "<li>" + esc(i) + "</li>").join("") +
          "</ul></article></li>"
        );
      })
      .join("");
    newsEl.querySelectorAll(".news-item").forEach(function (li, i) {
      li.classList.add("rv");
      li.style.setProperty("--d", Math.min(i, 3) * 80 + "ms");
    });
  }
  var legend = $("news-legend");
  if (legend) {
    var used = [];
    news.forEach((n) => used.indexOf(n.kind) < 0 && used.push(n.kind));
    legend.innerHTML = used
      .map(
        (k) =>
          "<div><dt>" +
          esc(t("news.type")) +
          '</dt><dd><span class="kind ' +
          esc(k) +
          '">' +
          esc(KINDS[k] || k) +
          "</span></dd></div>",
      )
      .join("");
  }
  var chl = $("changelog-link");
  if (chl && data.repoUrl) chl.href = data.repoUrl + "/blob/main/CHANGELOG.md";

  /* ------------------------------------------------------------- footer -- */
  var up = $("updated");
  if (up && data.updated) {
    up.setAttribute("datetime", data.updated);
    up.textContent = fmtDate(data.updated);
  }
  var repo = $("repo-link");
  if (repo && data.repoUrl) repo.href = data.repoUrl;

  /* ----------------------------------------------------------- showcase -- */
  var sc = data.showcase || [];
  var scSteps = $("sc-steps");
  var scImgs = $("sc-imgs");
  var scDots = $("sc-dots");
  function shotImg(s, extra) {
    var light =
      '<img class="' +
      (s.fileDark ? "th-light" : "") +
      '" src="screenshots/' +
      esc(s.file) +
      '" alt="' +
      esc(s.title) +
      '" loading="lazy" decoding="async" width="1440" height="900"' +
      (extra || "") +
      " />";
    var dark = s.fileDark
      ? '<img class="th-dark" src="screenshots/' +
        esc(s.fileDark) +
        '" alt="' +
        esc(s.title) +
        '" loading="lazy" decoding="async" width="1440" height="900" />'
      : "";
    return light + dark;
  }
  if (scSteps && sc.length) {
    scSteps.innerHTML = sc
      .map(function (s, i) {
        return (
          '<li class="sc-step' +
          (i === 0 ? " active" : "") +
          '" data-i="' +
          i +
          '"><span class="sc-num">0' +
          (i + 1) +
          " / 0" +
          sc.length +
          "</span><h3>" +
          esc(s.title) +
          (s.preview ? '<span class="preview-tag">' + esc(t("screens.preview")) + "</span>" : "") +
          "</h3><p>" +
          esc(s.text) +
          '</p><div class="sc-inline">' +
          shotImg(s) +
          "</div></li>"
        );
      })
      .join("");
    scImgs.innerHTML = sc
      .map(function (s, i) {
        return '<figure class="' + (i === 0 ? "active" : "") + '">' + shotImg(s) + "</figure>";
      })
      .join("");
    scDots.innerHTML = sc
      .map((s, i) => "<span" + (i === 0 ? ' class="active"' : "") + "></span>")
      .join("");
  }
  function setShowcase(i) {
    scSteps.querySelectorAll(".sc-step").forEach((el, j) => el.classList.toggle("active", j === i));
    scImgs.querySelectorAll("figure").forEach(function (el, j) {
      el.classList.toggle("active", j === i);
      el.classList.toggle("past", j < i);
    });
    scDots.querySelectorAll("span").forEach((el, j) => el.classList.toggle("active", j === i));
  }

  /* ------------------------------------------------- gallery + lightbox -- */
  var shots = data.screenshots || [];
  var galEl = $("gallery");
  if (galEl) {
    galEl.innerHTML = shots
      .map(function (s, i) {
        var tall = /mobile/.test(s.file) ? " tall" : "";
        return (
          '<li><figure><button type="button" class="thumb' +
          tall +
          '" data-index="' +
          i +
          '" aria-label="' +
          esc(t("screens.zoom", { caption: s.caption })) +
          '"><img src="screenshots/' +
          esc(s.file) +
          '" alt="' +
          esc(s.caption) +
          '" loading="lazy" decoding="async" /></button><figcaption>' +
          esc(s.caption) +
          (s.preview ? '<span class="preview-tag">' + esc(t("screens.preview")) + "</span>" : "") +
          "</figcaption></figure></li>"
        );
      })
      .join("");
  }

  var lb = $("lightbox");
  var lbImg = $("lb-img");
  var lbCap = $("lb-caption");
  var lbCount = $("lb-count");
  var current = 0;
  var opener = null;
  function show(i) {
    current = (i + shots.length) % shots.length;
    var s = shots[current];
    lbImg.src = "screenshots/" + s.file;
    lbImg.alt = s.caption;
    lbCap.textContent = s.caption + (s.preview ? t("screens.previewParen") : "");
    lbCount.textContent = current + 1 + " / " + shots.length;
  }
  function open(i, btn) {
    if (!lb || typeof lb.showModal !== "function") {
      window.open("screenshots/" + shots[i].file, "_blank");
      return;
    }
    opener = btn;
    show(i);
    lb.showModal();
    $("lb-close").focus();
  }
  if (galEl && lb) {
    galEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".thumb");
      if (btn) open(+btn.dataset.index, btn);
    });
    $("lb-prev").addEventListener("click", () => show(current - 1));
    $("lb-next").addEventListener("click", () => show(current + 1));
    $("lb-close").addEventListener("click", () => lb.close());
    lb.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
    lb.addEventListener("click", function (e) {
      if (e.target === lb) lb.close();
    });
    lb.addEventListener("close", function () {
      if (opener) opener.focus();
    });
  }

  /* ------------------------------------------------------- demo board -- */
  var demo = data.demo;
  var boardEl = $("demo-board");
  var colIds = demo ? demo.columns.map((c) => c.id) : [];
  var colTitle = {};
  if (demo) demo.columns.forEach((c) => (colTitle[c.id] = c.title));
  var PRIO = {
    urgent: t("demo.prioUrgent"),
    high: t("demo.prioHigh"),
    normal: t("demo.prioNormal"),
  };
  var ARROW = svg('<path d="M5 12h14M13 6l6 6-6 6"/>');
  var CHECK =
    '<span class="check" aria-hidden="true">' + svg('<path d="M20 6L9 17l-5-5"/>') + "</span>";

  function cardHtml(c) {
    return (
      '<article class="card" tabindex="0" data-key="' +
      esc(c.key) +
      '"><div class="card-top"><span class="key">' +
      esc(c.key) +
      '</span><span class="prio ' +
      esc(c.prio || "normal") +
      '" title="' +
      PRIO[c.prio || "normal"] +
      '" role="img" aria-label="' +
      PRIO[c.prio || "normal"] +
      '"></span></div><h4>' +
      esc(c.title) +
      '</h4><div class="card-foot"><span class="tag ' +
      esc(c.tone || "violet") +
      '">' +
      esc(c.tag) +
      '</span><button type="button" class="move">' +
      ARROW +
      "</button>" +
      CHECK +
      "</div></article>"
    );
  }
  function renderBoard() {
    if (!boardEl || !demo) return;
    boardEl.innerHTML = demo.columns
      .map(function (col) {
        return (
          '<section class="col" data-col="' +
          col.id +
          '" aria-label="' +
          esc(col.title) +
          '"><div class="col-head"><h3>' +
          esc(col.title) +
          '</h3><span class="count" aria-hidden="true"></span></div><div class="cards">' +
          demo.cards
            .filter((c) => c.col === col.id)
            .map(cardHtml)
            .join("") +
          "</div></section>"
        );
      })
      .join("");
    boardEl.querySelectorAll(".card").forEach(refreshCard);
    updateCounts();
  }
  function colOf(card) {
    return card.closest(".col").dataset.col;
  }
  function refreshCard(card) {
    var col = colOf(card);
    var idx = colIds.indexOf(col);
    var title = card.querySelector("h4").textContent;
    var key = card.dataset.key;
    card.classList.toggle("is-done", col === "done");
    card.setAttribute(
      "aria-label",
      t("demo.cardAria", { key: key, title: title, col: colTitle[col] }),
    );
    var btn = card.querySelector(".move");
    var next = colIds[idx + 1];
    if (next) btn.setAttribute("aria-label", t("demo.moveAria", { key: key, col: colTitle[next] }));
  }
  function updateCounts(bumpCol) {
    boardEl.querySelectorAll(".col").forEach(function (c) {
      var el = c.querySelector(".count");
      el.textContent = c.querySelectorAll(".card:not(.ghost)").length;
      if (c.dataset.col === bumpCol && MOTION) {
        el.classList.remove("bump");
        void el.offsetWidth;
        el.classList.add("bump");
      }
    });
    var doneN = boardEl.querySelectorAll('.col[data-col="done"] .card').length;
    var all = boardEl.querySelectorAll(".card").length;
    var score = $("demo-score");
    if (score)
      score.textContent =
        doneN === all ? t("demo.allDone") : t("demo.score", { n: doneN, all: all });
  }
  function flipSnapshot() {
    var m = new Map();
    boardEl.querySelectorAll(".card").forEach((c) => m.set(c, c.getBoundingClientRect()));
    return m;
  }
  function flipPlay(first, moved) {
    if (!MOTION) return;
    first.forEach(function (a, c) {
      if (c === moved) return;
      var b = c.getBoundingClientRect();
      var dx = a.left - b.left;
      var dy = a.top - b.top;
      if (!dx && !dy) return;
      c.animate([{ transform: "translate(" + dx + "px," + dy + "px)" }, { transform: "none" }], {
        duration: 380,
        easing: "cubic-bezier(.2,.8,.2,1)",
      });
    });
  }
  function confetti(rect, n) {
    if (!MOTION) return;
    var colors = ["#7c5cff", "#ff4f9a", "#ff8a3d", "#2fa8ff", "#1fc79a", "#ffd23f"];
    var cx = rect.left + rect.width / 2;
    var cy = rect.top + rect.height / 2;
    for (var i = 0; i < n; i++) {
      var p = document.createElement("span");
      p.className = "confetti";
      p.style.left = cx + "px";
      p.style.top = cy + "px";
      p.style.background = colors[i % colors.length];
      var ang = Math.random() * Math.PI * 2;
      var dist = 70 + Math.random() * (n > 40 ? 220 : 120);
      p.style.setProperty("--dx", Math.cos(ang) * dist + "px");
      p.style.setProperty("--dy", Math.sin(ang) * dist - 40 + "px");
      p.style.setProperty("--r", Math.random() * 720 - 360 + "deg");
      document.body.appendChild(p);
      setTimeout(p.remove.bind(p), 1200);
    }
  }
  function landed(card, fromCol) {
    var to = colOf(card);
    refreshCard(card);
    updateCounts(to !== fromCol ? to : null);
    if (to === fromCol) return;
    if (to === "done") {
      card.classList.remove("just-done");
      void card.offsetWidth;
      card.classList.add("just-done");
      var all = boardEl.querySelectorAll(".card").length;
      var doneN = boardEl.querySelectorAll('.col[data-col="done"] .card').length;
      setTimeout(
        function () {
          confetti(card.getBoundingClientRect(), doneN === all ? 70 : 28);
        },
        MOTION ? 260 : 0,
      );
      announce(
        t("demo.doneAnnounce", { key: card.dataset.key }) +
          (doneN === all ? " " + t("demo.allDoneAnnounce") : ""),
      );
    } else {
      announce(t("demo.movedAnnounce", { key: card.dataset.key, col: colTitle[to] }));
    }
  }
  // Move by button / keyboard: flying card with a spring (prototype style)
  function moveTo(card, toCol, index) {
    var from = colOf(card);
    var list = boardEl.querySelector('.col[data-col="' + toCol + '"] .cards');
    var first = flipSnapshot();
    var siblings = Array.prototype.filter.call(list.children, (c) => c !== card);
    list.insertBefore(card, siblings[index] || null);
    flipPlay(first, card);
    if (MOTION) {
      var a = first.get(card);
      var b = card.getBoundingClientRect();
      var dx = a.left - b.left;
      var dy = a.top - b.top;
      if (dx || dy)
        card.animate(
          [
            { transform: "translate(" + dx + "px," + dy + "px) scale(1.04) rotate(2deg)" },
            { transform: "translate(0,-6px) scale(1.03) rotate(-1deg)", offset: 0.7 },
            { transform: "none" },
          ],
          { duration: 650, easing: "cubic-bezier(.2,.8,.2,1)" },
        );
    }
    landed(card, from);
  }

  if (boardEl && demo) {
    renderBoard();
    $("demo-reset").addEventListener("click", function () {
      renderBoard();
      announce(t("demo.resetAnnounce"));
    });

    boardEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".move");
      if (!btn) return;
      var card = btn.closest(".card");
      var next = colIds[colIds.indexOf(colOf(card)) + 1];
      if (next) {
        moveTo(card, next, 0);
        // keep keyboard focus on something sensible
        var nb = card.querySelector(".move");
        (nb && getComputedStyle(nb).display !== "none" ? nb : card).focus({ preventScroll: true });
      }
    });

    boardEl.addEventListener("keydown", function (e) {
      var card = e.target.closest(".card");
      if (!card || e.target !== card) return;
      var col = colOf(card);
      var ci = colIds.indexOf(col);
      var list = card.parentNode;
      var pos = Array.prototype.indexOf.call(list.children, card);
      if (e.key === "ArrowRight" && ci < colIds.length - 1) moveTo(card, colIds[ci + 1], 0);
      else if (e.key === "ArrowLeft" && ci > 0) moveTo(card, colIds[ci - 1], 0);
      else if (e.key === "ArrowUp" && pos > 0) moveTo(card, col, pos - 1);
      else if (e.key === "ArrowDown" && pos < list.children.length - 1) moveTo(card, col, pos + 1);
      else return;
      e.preventDefault();
      card.focus({ preventScroll: true });
    });

    /* pointer drag (mouse immediately, touch after a short long-press) */
    var drag = null;
    boardEl.addEventListener("pointerdown", function (e) {
      if (e.button !== 0 || e.target.closest(".move")) return;
      var card = e.target.closest(".card");
      if (!card || drag) return;
      drag = {
        card: card,
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        x: e.clientX,
        y: e.clientY,
        touch: e.pointerType !== "mouse",
        active: false,
        from: colOf(card),
      };
      if (drag.touch) {
        drag.timer = setTimeout(function () {
          if (drag && !drag.active) startDrag();
        }, 230);
      }
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.id) return;
      drag.x = e.clientX;
      drag.y = e.clientY;
      var dist = Math.hypot(drag.x - drag.sx, drag.y - drag.sy);
      if (!drag.active) {
        if (drag.touch) {
          if (dist > 8) cancelPending(); // user is scrolling
        } else if (dist > 5) startDrag();
        return;
      }
      if (!drag.raf) drag.raf = requestAnimationFrame(dragFrame);
    });
    window.addEventListener("pointerup", endDrag);
    window.addEventListener("pointercancel", endDrag);
    document.addEventListener(
      "touchmove",
      function (e) {
        if (drag && drag.active) e.preventDefault();
      },
      { passive: false },
    );
    boardEl.addEventListener("contextmenu", function (e) {
      if (drag) e.preventDefault();
    });

    function cancelPending() {
      if (drag && drag.timer) clearTimeout(drag.timer);
      drag = null;
    }
    function startDrag() {
      var card = drag.card;
      var r = card.getBoundingClientRect();
      drag.ox = drag.sx - r.left;
      drag.oy = drag.sy - r.top;
      var ghost = card.cloneNode(true);
      ghost.classList.add("ghost");
      ghost.removeAttribute("tabindex");
      ghost.setAttribute("aria-hidden", "true");
      ghost.style.width = r.width + "px";
      ghost.style.setProperty(
        "--g",
        getComputedStyle(card.closest(".col")).getPropertyValue("--g"),
      );
      document.body.appendChild(ghost);
      drag.ghost = ghost;
      drag.active = true;
      card.classList.add("placeholder");
      if (navigator.vibrate && drag.touch) navigator.vibrate(12);
      dragFrame();
    }
    function dragFrame() {
      if (!drag || !drag.active) return;
      drag.raf = 0;
      var vx = drag.x - (drag.lx || drag.x);
      drag.lx = drag.x;
      var tilt = MOTION ? Math.max(-8, Math.min(8, vx * 0.6)) + 2 : 0;
      drag.ghost.style.transform =
        "translate(" +
        (drag.x - drag.ox) +
        "px," +
        (drag.y - drag.oy) +
        "px) rotate(" +
        tilt +
        "deg) scale(" +
        (MOTION ? 1.05 : 1) +
        ")";
      var under = document.elementFromPoint(drag.x, drag.y);
      var col = under && under.closest && under.closest(".col");
      boardEl.querySelectorAll(".col").forEach((c) => c.classList.toggle("over", c === col));
      if (!col || !boardEl.contains(col)) return;
      var list = col.querySelector(".cards");
      var others = Array.prototype.filter.call(list.children, (c) => c !== drag.card);
      var before = null;
      for (var i = 0; i < others.length; i++) {
        var rr = others[i].getBoundingClientRect();
        if (drag.y < rr.top + rr.height / 2) {
          before = others[i];
          break;
        }
      }
      if (drag.card.parentNode === list && drag.card.nextElementSibling === before) return;
      if (before === null && list.lastElementChild === drag.card) return;
      var first = flipSnapshot();
      list.insertBefore(drag.card, before);
      flipPlay(first, drag.card);
      updateCounts();
    }
    function endDrag(e) {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      if (drag.timer) clearTimeout(drag.timer);
      if (!drag.active) {
        drag = null;
        return;
      }
      var d = drag;
      drag = null;
      if (d.raf) cancelAnimationFrame(d.raf);
      boardEl.querySelectorAll(".col").forEach((c) => c.classList.remove("over"));
      var target = d.card.getBoundingClientRect();
      var finish = function () {
        d.ghost.remove();
        d.card.classList.remove("placeholder");
        landed(d.card, d.from);
      };
      if (MOTION) {
        var anim = d.ghost.animate(
          [
            { transform: d.ghost.style.transform },
            {
              transform:
                "translate(" + target.left + "px," + target.top + "px) rotate(0deg) scale(1)",
            },
          ],
          { duration: 320, easing: "cubic-bezier(.34,1.56,.64,1)", fill: "forwards" },
        );
        anim.onfinish = finish;
      } else finish();
    }
  }

  /* -------------------------------------------------- copy code buttons -- */
  var copyIcon = svg(
    '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>',
  );
  var checkIcon = svg('<path d="M20 6L9 17l-5-5"/>');
  function fallbackCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    ta.remove();
    return ok ? Promise.resolve() : Promise.reject();
  }
  document.querySelectorAll(".code").forEach(function (block) {
    var code = block.querySelector("code");
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.innerHTML = copyIcon + "<span>" + esc(t("code.copy")) + "</span>";
    btn.setAttribute("aria-label", t("code.copyAria"));
    btn.addEventListener("click", function () {
      var text = code.textContent.replace(/\n+$/, "");
      var p =
        navigator.clipboard && window.isSecureContext
          ? navigator.clipboard.writeText(text).catch(() => fallbackCopy(text))
          : fallbackCopy(text);
      p.then(
        function () {
          btn.innerHTML = checkIcon + "<span>" + esc(t("code.copied")) + "</span>";
          btn.classList.add("ok");
          announce(t("code.copiedAnnounce"));
          setTimeout(function () {
            btn.innerHTML = copyIcon + "<span>" + esc(t("code.copy")) + "</span>";
            btn.classList.remove("ok");
          }, 1800);
        },
        function () {
          announce(t("code.copyFailed"));
        },
      );
    });
    block.appendChild(btn);
  });

  /* ---------------------------------------------------------- tabs ----- */
  var tabsEl = $("install-tabs");
  if (tabsEl) {
    var tabs = Array.prototype.slice.call(tabsEl.querySelectorAll('[role="tab"]'));
    var ind = tabsEl.querySelector(".tab-ind");
    var tablist = tabsEl.querySelector('[role="tablist"]');
    var placeInd = function () {
      var t = tabs.find((x) => x.getAttribute("aria-selected") === "true");
      if (!t) return;
      ind.style.width = t.offsetWidth + "px";
      ind.style.transform = "translateX(" + t.offsetLeft + "px)";
    };
    var select = function (tab, focus) {
      tabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        var panel = $(t.getAttribute("aria-controls"));
        panel.hidden = !on;
        if (on) {
          panel.classList.remove("enter");
          void panel.offsetWidth;
          panel.classList.add("enter");
        }
      });
      placeInd();
      var left = tab.offsetLeft - 16;
      var right = tab.offsetLeft + tab.offsetWidth + 16 - tablist.clientWidth;
      if (tablist.scrollLeft > left) tablist.scrollTo({ left: left, behavior: "smooth" });
      else if (tablist.scrollLeft < right) tablist.scrollTo({ left: right, behavior: "smooth" });
      if (focus) tab.focus();
    };
    tabs.forEach(function (t) {
      t.addEventListener("click", () => select(t, false));
      t.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(t);
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        else if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        else if (e.key === "Home") n = tabs[0];
        else if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) {
          e.preventDefault();
          select(n, true);
        }
      });
    });
    tabs.forEach(function (t) {
      $(t.getAttribute("aria-controls")).hidden = t.getAttribute("aria-selected") !== "true";
    });
    tabsEl.classList.add("ready");
    placeInd();
    window.addEventListener("resize", placeInd);
    // on narrow screens the tabs scroll sideways: fade the edge where more tabs continue
    var fadeEdges = function () {
      var max = tablist.scrollWidth - tablist.clientWidth;
      tablist.classList.toggle("fade-l", tablist.scrollLeft > 2);
      tablist.classList.toggle("fade-r", max > 2 && tablist.scrollLeft < max - 2);
    };
    tablist.addEventListener("scroll", fadeEdges, { passive: true });
    window.addEventListener("resize", fadeEdges);
    fadeEdges();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(placeInd);
  }
  document.querySelectorAll(".steps").forEach(function (ol) {
    Array.prototype.forEach.call(ol.children, (li, i) => li.style.setProperty("--i", i));
  });

  /* --------------------------------------------------------- theme ----- */
  var themeBtn = $("theme-toggle");
  var darkMq = window.matchMedia("(prefers-color-scheme: dark)");
  function effectiveTheme() {
    return root.dataset.theme || (darkMq.matches ? "dark" : "light");
  }
  function labelTheme() {
    if (themeBtn)
      themeBtn.setAttribute(
        "aria-label",
        effectiveTheme() === "dark" ? t("theme.toLight") : t("theme.toDark"),
      );
  }
  labelTheme();
  if (darkMq.addEventListener) darkMq.addEventListener("change", labelTheme);
  if (themeBtn) {
    themeBtn.addEventListener("click", function (e) {
      var next = effectiveTheme() === "dark" ? "light" : "dark";
      var apply = function () {
        root.dataset.theme = next;
        try {
          localStorage.setItem("taskhub-site-theme", next);
        } catch {
          /* storage blocked – theme still applies for this visit */
        }
        labelTheme();
      };
      if (!MOTION || !document.startViewTransition) return apply();
      var x = e.clientX || window.innerWidth - 40;
      var y = e.clientY || 32;
      var r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      var vt = document.startViewTransition(apply);
      vt.ready
        .then(function () {
          root.animate(
            {
              clipPath: [
                "circle(0px at " + x + "px " + y + "px)",
                "circle(" + r + "px at " + x + "px " + y + "px)",
              ],
            },
            {
              duration: 650,
              easing: "cubic-bezier(.2,.8,.2,1)",
              pseudoElement: "::view-transition-new(root)",
            },
          );
        })
        .catch(function () {});
    });
  }

  /* -------------------------------------------- split headings (words) -- */
  document.querySelectorAll(".split").forEach(function (h) {
    var n = 0;
    var nodes = Array.prototype.slice.call(h.childNodes);
    h.textContent = "";
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) return h.appendChild(document.createTextNode(" "));
          var w = document.createElement("span");
          w.className = "wd";
          var inner = document.createElement("span");
          inner.style.setProperty("--i", n++);
          inner.textContent = part;
          w.appendChild(inner);
          h.appendChild(w);
        });
      } else {
        var w2 = document.createElement("span");
        w2.className = "wd";
        var inner2 = document.createElement("span");
        inner2.style.setProperty("--i", n++);
        inner2.appendChild(node);
        w2.appendChild(inner2);
        h.appendChild(w2);
      }
    });
  });

  /* ------------------------------------------------ reveal on scroll ---- */
  document.querySelectorAll("[data-stagger]").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (el, i) {
      el.classList.add("rv");
      el.style.setProperty("--d", (i % 6) * 70 + "ms");
    });
  });

  function onReveal(el) {
    el.classList.add("in");
    if (el === statsEl && MOTION) runCounters();
    if (el.id === "rm-aside" && MOTION) {
      $("roadmap-bar").style.width = (doneCount / total) * 100 + "%";
      countUp([$("rm-pct")]);
    }
  }
  var revealTargets = document.querySelectorAll(".rv, .split, .steps, #stats");
  if (MOTION && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            onReveal(en.target);
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("in"));
  }

  /* ------------------------------------------------- showcase observer -- */
  if (scSteps && "IntersectionObserver" in window) {
    var scIo = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setShowcase(+en.target.dataset.i);
        });
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    scSteps.querySelectorAll(".sc-step").forEach((el) => scIo.observe(el));
  }

  /* ---------------------------------------------------------- scrollspy -- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".topnav a"));
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          navLinks.forEach(function (a) {
            var on = a.getAttribute("href") === "#" + en.target.id;
            a.classList.toggle("active", on);
            if (on) a.setAttribute("aria-current", "true");
            else a.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    navLinks.forEach(function (a) {
      var s = document.querySelector(a.getAttribute("href"));
      if (s) spy.observe(s);
    });
  }

  /* ------------------------------ scroll: progress bar + roadmap rail --- */
  var prog = $("scroll-progress");
  var rmWrap = $("roadmap-wrap");
  var railFill = $("rail-fill");
  var milestones = rmEl ? Array.prototype.slice.call(rmEl.querySelectorAll(".milestone")) : [];
  var scrollQueued = false;
  function onScroll() {
    scrollQueued = false;
    var max = document.documentElement.scrollHeight - innerHeight;
    if (prog) prog.style.transform = "scaleX(" + (max > 0 ? scrollY / max : 0) + ")";
    if (rmWrap && railFill && milestones.length) {
      var wr = rmWrap.getBoundingClientRect();
      var stop = active || data.roadmap.filter((m) => m.status === "done").pop();
      var stopIdx = stop ? data.roadmap.indexOf(stop) : -1;
      var limit = 0;
      if (stopIdx >= 0) {
        var nr = milestones[stopIdx].querySelector(".num").getBoundingClientRect();
        limit = nr.top + nr.height / 2 - wr.top - 24;
      }
      var raw = MOTION ? innerHeight * 0.62 - wr.top - 24 : wr.height;
      var fill = Math.max(0, Math.min(raw, limit));
      railFill.style.setProperty("--fill", fill + "px");
      milestones.forEach(function (li) {
        var n = li.querySelector(".num").getBoundingClientRect();
        li.classList.toggle("lit", n.top + n.height / 2 - wr.top - 24 <= raw + 4);
      });
    }
  }
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---------------------------------- hero: kinetic word rotator -------- */
  var rot = $("rotator");
  if (rot && MOTION) {
    var words = rot.dataset.words.split("|");
    var wi = 0;
    var heroVisible = true;
    var build = function (word) {
      var w = document.createElement("span");
      w.className = "w";
      Array.prototype.forEach.call(word, function (ch, i) {
        var s = document.createElement("span");
        s.className = "ch";
        s.style.setProperty("--i", i);
        s.textContent = ch === " " ? " " : ch;
        w.appendChild(s);
      });
      rot.appendChild(w);
      // one continuous gradient across the letters
      var W = w.offsetWidth;
      Array.prototype.forEach.call(w.children, function (s) {
        s.style.backgroundSize = W + "px 100%";
        s.style.backgroundPosition = -s.offsetLeft + "px 0";
      });
      return w;
    };
    var ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    ready.then(function () {
      rot.textContent = "";
      var cur = build(words[0]);
      rot.style.width = cur.offsetWidth + "px";
      new IntersectionObserver(function (en) {
        heroVisible = en[0].isIntersecting;
      }).observe(rot);
      setInterval(function () {
        if (document.hidden || !heroVisible) return;
        wi = (wi + 1) % words.length;
        var old = cur;
        old.classList.remove("in");
        old.classList.add("out");
        setTimeout(() => old.remove(), 700);
        cur = build(words[wi]);
        cur.classList.add("in");
        rot.style.width = cur.offsetWidth + "px";
      }, 2600);
    });
  }

  /* ------------------------------------ hero: 3D tilt + glow + sheen ---- */
  var hero = document.querySelector(".hero");
  var tilt = $("tilt");
  var spot = $("hero-spot");
  if (hero && tilt && MOTION && FINE_POINTER) {
    var base = { rx: 7, ry: -13 };
    var cur2 = { rx: 7, ry: -13, gx: 30, gy: 20 };
    var tgt = { rx: 7, ry: -13, gx: 30, gy: 20 };
    var running = false;
    var loop = function () {
      var k = 0.09;
      var moving = false;
      ["rx", "ry", "gx", "gy"].forEach(function (p) {
        var d = tgt[p] - cur2[p];
        if (Math.abs(d) > 0.01) moving = true;
        cur2[p] += d * k;
      });
      tilt.style.setProperty("--rx", cur2.rx.toFixed(2) + "deg");
      tilt.style.setProperty("--ry", cur2.ry.toFixed(2) + "deg");
      tilt.style.setProperty("--gx", cur2.gx.toFixed(1) + "%");
      tilt.style.setProperty("--gy", cur2.gy.toFixed(1) + "%");
      if (moving) requestAnimationFrame(loop);
      else running = false;
    };
    var kick = function () {
      if (!running) {
        running = true;
        requestAnimationFrame(loop);
      }
    };
    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = hero.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      tgt.rx = base.rx - ny * 10;
      tgt.ry = base.ry + nx * 16;
      tgt.gx = 50 + nx * 90;
      tgt.gy = 40 + ny * 90;
      if (spot)
        spot.style.transform =
          "translate(" + (e.clientX - r.left - 260) + "px," + (e.clientY - r.top - 260) + "px)";
      kick();
    });
    hero.addEventListener("pointerleave", function () {
      tgt.rx = base.rx;
      tgt.ry = base.ry;
      tgt.gx = 30;
      tgt.gy = 20;
      kick();
    });
  }

  /* -------------------- keep the scroll position after a language switch -- */
  try {
    var savedY = sessionStorage.getItem(SCROLL_KEY);
    if (savedY !== null) {
      sessionStorage.removeItem(SCROLL_KEY);
      window.scrollTo({ top: +savedY || 0, behavior: "instant" });
    }
  } catch {
    /* storage blocked – start at the top */
  }
})();
