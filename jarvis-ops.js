/* jarvis-ops.js — As duas operações do final: STATUS e SENTINELA.
 *
 *  Jarvis, status
 *    lê o cockpit e gera um card de desempenho (só depois do pedido).
 *
 *  Jarvis, sentinela
 *    observa as três ameaças e devolve o relatório.
 *
 *  Jarvis, grava sentinela
 *    único caminho que escreve o relatório no estado / banco.
 */
(function (w) {
  "use strict";

  function pct(x) {
    if (x == null || isNaN(x)) return "—";
    return Math.round(x * 100) + "%";
  }

  function statusBody(snap, sent) {
    var lines = [];
    lines.push("Projeto: " + (snap.project || "gcm-nisia"));
    lines.push("Semana: " + (snap.week == null ? "—" : snap.week));
    lines.push("Disciplinas: " + (snap.discs || 0));
    lines.push("Sessão: " + (snap.entered ? "autenticada" : "offline"));
    if (sent && sent.report) {
      lines.push("Média: " + pct(sent.report.avg));
      lines.push("Alertas: " + (sent.report.alerts ? sent.report.alerts.length : 0));
    }
    if (snap.temper) {
      lines.push("Sarcasmo " + snap.temper.sarcasmo + "% · Estresse " + snap.temper.estresse + "%");
    }
    return lines.join(" · ");
  }

  function makeStatusCard() {
    var snap = w.JARVIS_PROTO && w.JARVIS_PROTO.snapshot ? w.JARVIS_PROTO.snapshot() : {};
    var sent = w.JARVIS_SENTINELA ? w.JARVIS_SENTINELA.read() : null;
    if (!w.JARVIS_GFX || typeof w.JARVIS_GFX.create !== "function") {
      return { ok: false, motivo: "Fábrica gráfica ausente." };
    }
    var res = w.JARVIS_GFX.create({
      type: "card",
      title: "Desempenho · " + (snap.project || "Vigília"),
      body: statusBody(snap, sent),
      raw: "status"
    });
    var host = document.getElementById("jarvisGfxHost");
    if (host) {
      host.hidden = false;
      if (w.JARVIS_GFX.paint) w.JARVIS_GFX.paint();
    }
    return { ok: true, snap: snap, sentinela: sent && sent.report, gfx: res };
  }

  function runSentinela(persist) {
    if (!w.JARVIS_SENTINELA) return { ok: false, motivo: "Sentinela ausente." };
    var out = persist ? w.JARVIS_SENTINELA.persist(w.JARVIS_SENTINELA.scan()) : w.JARVIS_SENTINELA.read();
    if (w.JARVIS_GFX && out.report && out.report.alerts && out.report.alerts.length) {
      w.JARVIS_GFX.create({
        type: "bloco",
        title: persist ? "Sentinela gravada" : "Sentinela · observação",
        body: out.report.alerts.map(function (a) { return a.msg; }).join(" | ")
      });
      var host = document.getElementById("jarvisGfxHost");
      if (host) { host.hidden = false; w.JARVIS_GFX.paint(); }
    }
    return out;
  }

  function handle(text) {
    var t = String(text || "");
    if (!/\bjarvis\b/i.test(t)) return null;
    var rest = t.replace(/\bjarvis\b/ig, " ").replace(/\s+/g, " ").trim().toLowerCase();
    if (/grava\s+sentinela|salva\s+sentinela|commit\s+sentinela/.test(rest)) {
      return { ok: true, handled: true, intent: "sentinela-commit", result: runSentinela(true) };
    }
    if (/sentinela/.test(rest)) {
      return { ok: true, handled: true, intent: "sentinela", result: runSentinela(false) };
    }
    if (/status|card de desempenho|desempenho/.test(rest) && !/sentinela/.test(rest)) {
      return { ok: true, handled: true, intent: "status", result: makeStatusCard() };
    }
    return null;
  }

  function speakResult(res) {
    if (!res) return;
    if (w.PIRoom && typeof w.PIRoom.note === "function") {
      if (res.intent === "status") w.PIRoom.note("JARVIS: card de desempenho criado.");
      if (res.intent === "sentinela") {
        var n = res.result && res.result.report && res.result.report.alerts ? res.result.report.alerts.length : 0;
        w.PIRoom.note("JARVIS: sentinela observou " + n + " alerta(s). Nada gravado no banco.");
      }
      if (res.intent === "sentinela-commit") w.PIRoom.note("JARVIS: relatório da sentinela lançado no estado.");
    }
  }

  function interceptDock() {
    var input = document.getElementById("dockIn");
    var send = document.getElementById("dockSend");
    if (!input || input._jarvisOps) return;
    input._jarvisOps = true;
    function fire() {
      var text = input.value || "";
      var hit = handle(text);
      if (!hit) return;
      speakResult(hit);
    }
    if (send) send.addEventListener("click", fire);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") fire();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", interceptDock);
  } else {
    interceptDock();
  }
  setTimeout(interceptDock, 800);

  w.JARVIS_OPS = {
    status: makeStatusCard,
    sentinela: function () { return runSentinela(false); },
    gravar: function () { return runSentinela(true); },
    handle: handle
  };
})(window);
