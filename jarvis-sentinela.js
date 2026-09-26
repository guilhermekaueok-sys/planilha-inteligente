/* jarvis-sentinela.js — Observa. Não altera.
 *
 * Três ameaças da casa:
 *   conteudo     — disciplinas/assuntos sumiram ou nunca existiram
 *   memorizacao  — sessão morta, estado local vazio, histórico cortado
 *   desempenho   — queda vs. snapshot anterior, estresse alto, sumiço prolongado
 *
 * Toda ação corretiva fica em `propostas`. Só sobe ao banco se o usuário
 * disser: Jarvis, grava sentinela.
 */
(function (w) {
  "use strict";

  var KEY = "jarvis-sentinela-v1";
  var PREV = "jarvis-sentinela-prev-v1";

  function now() { return Date.now(); }

  function loadJSON(k, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(k) || "null");
      return v == null ? fallback : v;
    } catch (e) { return fallback; }
  }

  function saveJSON(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {}
  }

  function discs() {
    if (typeof w.DISC !== "undefined" && Array.isArray(w.DISC)) return w.DISC;
    if (w.S && Array.isArray(w.S.editalDiscs)) return w.S.editalDiscs;
    return [];
  }

  function topics() {
    if (w.S && Array.isArray(w.S.editalTopics)) return w.S.editalTopics;
    if (typeof w.TOPICS !== "undefined" && Array.isArray(w.TOPICS)) return w.TOPICS;
    return [];
  }

  function rateOf(id) {
    if (typeof w.rate === "function") {
      try { return w.rate(id); } catch (e) { return null; }
    }
    return null;
  }

  function avgRate() {
    var xs = discs().map(function (d) { return rateOf(d.id); }).filter(function (x) { return x !== null && !isNaN(x); });
    if (!xs.length) return null;
    return xs.reduce(function (a, b) { return a + b; }, 0) / xs.length;
  }

  function lastSeen() {
    var s = w.S || {};
    return s.updatedAt || s.savedAt || s.lastStudy || null;
  }

  function scan() {
    var list = discs();
    var tops = topics();
    var entered = !!(w.S && w.S.entered);
    var avg = avgRate();
    var last = lastSeen();
    var idleH = last ? (now() - last) / 3600000 : null;
    var temper = w.JARVIS && w.JARVIS.all ? w.JARVIS.all() : null;
    var prev = loadJSON(PREV, null);

    var alerts = [];
    var propostas = [];

    if (!list.length) {
      alerts.push({ code: "conteudo", level: "high", msg: "Edital sem disciplinas. Conteúdo ausente." });
      propostas.push({ intent: "edital", label: "Ler o edital de novo" });
    }
    if (list.length && !tops.length) {
      alerts.push({ code: "conteudo", level: "mid", msg: "Disciplinas existem, assuntos não. Grade oca." });
      propostas.push({ intent: "topicadd", label: "Pedir inclusão de assuntos" });
    }
    if (prev && prev.discCount > 0 && list.length < prev.discCount) {
      alerts.push({
        code: "conteudo",
        level: "high",
        msg: "Perda de conteúdo: " + prev.discCount + " → " + list.length + " disciplinas."
      });
      propostas.push({ intent: "status", label: "Abrir snapshot e conferir backup" });
    }

    if (!entered) {
      alerts.push({ code: "memorizacao", level: "high", msg: "Sessão não autenticada. Banco remoto não recebe estado." });
    }
    if (w.S && (!w.S.me || !w.S.me.id)) {
      alerts.push({ code: "memorizacao", level: "mid", msg: "Identidade da sessão vazia. Risco de amnésia no próximo reload." });
    }

    if (avg == null) {
      alerts.push({ code: "desempenho", level: "mid", msg: "Nenhuma taxa lançada. Desempenho invisível." });
    } else if (prev && prev.avg != null && avg < prev.avg - 0.08) {
      alerts.push({
        code: "desempenho",
        level: "high",
        msg: "Queda de desempenho: " + Math.round(prev.avg * 100) + "% → " + Math.round(avg * 100) + "%"
      });
      propostas.push({ intent: "card", label: "Gerar card de desempenho agora" });
    }
    if (idleH != null && idleH >= 48) {
      alerts.push({ code: "desempenho", level: "mid", msg: "Sumiço de " + Math.round(idleH) + "h. Ritmo quebrado." });
    }
    if (temper && temper.estresse >= 70) {
      alerts.push({ code: "desempenho", level: "mid", msg: "Estresse do cockpit em " + temper.estresse + "%." });
    }

    var report = {
      ts: now(),
      discCount: list.length,
      topicCount: tops.length,
      avg: avg,
      entered: entered,
      idleH: idleH,
      alerts: alerts,
      propostas: propostas,
      action: "observe-only"
    };
    return report;
  }

  function remember(report) {
    saveJSON(PREV, {
      ts: report.ts,
      discCount: report.discCount,
      topicCount: report.topicCount,
      avg: report.avg
    });
  }

  function persist(report) {
    saveJSON(KEY, report);
    remember(report);
    if (w.S) w.S.jarvisSentinela = report;
    try { if (typeof w.save === "function" && w.S) w.save(w.S); } catch (e) {}
    try {
      if (w.PISession && typeof w.PISession.pushState === "function" && w.S) {
        w.PISession.pushState(w.S);
      }
    } catch (e) {}
    return { ok: true, persisted: true, report: report };
  }

  function read() {
    var report = scan();
    remember(report);
    return { ok: true, persisted: false, report: report };
  }

  function last() {
    return loadJSON(KEY, null);
  }

  w.JARVIS_SENTINELA = {
    scan: scan,
    read: read,
    persist: persist,
    last: last
  };
})(window);
