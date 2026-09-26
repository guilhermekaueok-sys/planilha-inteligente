/* jarvis-gfx.js — Fábrica de elementos gráficos da plataforma.
 * Cria card / bloco / kpi só quando o protocolo autoriza.
 * Não aumenta o menu lateral. Elementos vivem em S.jarvisGfx e no mural.
 */
(function (w) {
  "use strict";

  var KEY = "jarvis-gfx-v1";

  function load() {
    try {
      var l = JSON.parse(localStorage.getItem(KEY) || "[]");
      return Array.isArray(l) ? l : [];
    } catch (e) { return []; }
  }

  function save(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list.slice(-40))); } catch (e) {}
    if (w.S) w.S.jarvisGfx = list.slice(-40);
  }

  var items = load();
  if (w.S && Array.isArray(w.S.jarvisGfx) && w.S.jarvisGfx.length) items = w.S.jarvisGfx;

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }

  function create(payload) {
    payload = payload || {};
    var item = {
      id: "gfx" + Date.now().toString(36),
      type: payload.type || "card",
      title: String(payload.title || "Card JARVIS").slice(0, 72),
      body: String(payload.body || payload.raw || "").slice(0, 280),
      tone: (w.JARVIS && w.JARVIS.tone) ? w.JARVIS.tone() : "composto",
      ts: Date.now()
    };
    items.push(item);
    if (items.length > 40) items.splice(0, items.length - 40);
    save(items);
    paint();
    return { ok: true, item: item, count: items.length };
  }

  function list() { return items.slice(); }

  function remove(id) {
    items = items.filter(function (x) { return x.id !== id; });
    save(items);
    paint();
    return { ok: true, count: items.length };
  }

  function html() {
    if (!items.length) {
      return '<div class="card muted">Nenhum elemento JARVIS ainda. Peça: Jarvis, cria um card de desempenho.</div>';
    }
    return items.slice().reverse().map(function (it) {
      return '<article class="card jarvis-gfx" data-gfx="' + esc(it.id) + '">' +
        '<div class="muted">' + esc(it.type.toUpperCase()) + ' · ' + esc(it.tone) + '</div>' +
        '<h2>' + esc(it.title) + '</h2>' +
        (it.body ? '<p>' + esc(it.body) + '</p>' : '') +
        '</article>';
    }).join("");
  }

  function paint() {
    var host = document.getElementById("jarvisGfxHost");
    if (host) host.innerHTML = html();
  }

  w.JARVIS_GFX = { create: create, list: list, remove: remove, html: html, paint: paint };
})(window);
