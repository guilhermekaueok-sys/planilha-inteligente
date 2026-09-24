/* Núcleo único. Novos concursos entram em projetos/*.js via PI.register. */
(function (w) {
  const PI = w.PI || {};
  PI.version = "1.0";
  PI.projects = PI.projects || {};
  PI.current = PI.current || "gcm-nisia";
  PI.register = function (proj) { if (!proj || !proj.id) return; PI.projects[proj.id] = proj; if (!PI.current) PI.current = proj.id; };
  PI.use = function (id) { if (PI.projects[id]) PI.current = id; return PI.projects[PI.current] || null; };
  PI.active = function () { return PI.projects[PI.current] || null; };
  PI.hook = function (name) { const p = PI.active(); if (!p || typeof p[name] !== "function") return; try { return p[name].apply(p, [].slice.call(arguments, 1)); } catch (_) {} };
  PI.mergePages = function (pages) { if (!pages) return pages; Object.keys(PI.projects).forEach(function (id) { const extra = PI.projects[id].extraPages; if (extra) Object.keys(extra).forEach(function (k) { pages[k] = extra[k]; }); }); return pages; };
  PI.typingIn = function (root) { const a = document.activeElement; return !!(root && a && root.contains(a) && /^(INPUT|SELECT|TEXTAREA)$/.test(a.tagName)); };
  PI.virtual = { rowH: 78, overscan: 3, raf: 0, bind: null, schedule: function (fn) { if (this.raf) return; const self = this; this.raf = requestAnimationFrame(function () { self.raf = 0; fn(); }); }, slice: function (len, scrollTop, viewH) { const start = Math.max(0, Math.floor(scrollTop / this.rowH) - this.overscan); const vis = Math.ceil(viewH / this.rowH) + this.overscan * 2; return { start: start, end: Math.min(len, start + vis) }; } };
  PI.sheetPaint = function () { const cfg = PI.virtual.bind; if (!cfg || typeof cfg.rows !== "function" || typeof cfg.renderRow !== "function") return; const root = document.querySelector(cfg.root || "#sheetRoot"); const body = root && root.querySelector("tbody"); if (!root || !body) return; if (PI.typingIn(root)) return; const rows = cfg.rows() || []; const win = PI.virtual.slice(rows.length, root.scrollTop, root.clientHeight || 480); const topH = win.start * PI.virtual.rowH; const botH = Math.max(0, (rows.length - win.end) * PI.virtual.rowH); const parts = []; if (topH) parts.push('<tr class="virt-pad" data-pad="top"><td colspan="9" style="height:' + topH + 'px;padding:0;border:0"></td></tr>'); for (let i = win.start; i < win.end; i++) parts.push(cfg.renderRow(rows[i], i)); if (botH) parts.push('<tr class="virt-pad" data-pad="bot"><td colspan="9" style="height:' + botH + 'px;padding:0;border:0"></td></tr>'); body.innerHTML = parts.join(""); };
  PI.sheetBind = function (cfg) { PI.virtual.bind = cfg; const root = document.querySelector((cfg && cfg.root) || "#sheetRoot"); if (!root || root._virtOn) return; root._virtOn = true; root.addEventListener("scroll", function () { PI.virtual.schedule(PI.sheetPaint); }, { passive: true }); };
  PI.mem = { db: null, timer: 0, cap: function (arr, n) { if (arr && arr.length > n) arr.splice(0, arr.length - n); }, prune: function (s) { if (!s) return s; Object.keys(s.chats || {}).forEach(function (id) { PI.mem.cap(s.chats[id], 80); }); return s; } };
  w.PI = PI;
})(window);
