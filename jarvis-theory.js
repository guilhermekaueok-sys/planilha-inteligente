/* jarvis-theory.js — Teoria de coerência do JARVIS.
 *
 * Valida se a casa está íntegra: personalidade, protocolo, sentinela,
 * redesign, gráficos e ponte externa. Roda sob pedido:
 *   "Jarvis, valida a casa" / "Jarvis, teoria"
 *
 * Produz um relatório de coerência: o que está sólido, o que é parcial,
 * o que falta. Nunca altera nada — só diagnostica.
 */
(function (w) {
  "use strict";

  var MODULES = [
    { name: "temperament", key: "JARVIS", need: ["all", "applyVoice", "tone"] },
    { name: "protocol",    key: "JARVIS_PROTO", need: ["run", "fromExternal", "snapshot"] },
    { name: "sentinela",   key: "JARVIS_SENTINELA", need: ["scan", "read", "persist"] },
    { name: "ops",         key: "JARVIS_OPS", need: ["status", "sentinela", "gravar"] },
    { name: "gfx",         key: "JARVIS_GFX", need: ["create", "list", "paint"] },
    { name: "redesign",    key: "JARVIS_REDESIGN", need: ["snapshotTemper", "detectLoss", "proposeRestore"] },
    { name: "patch",       key: "pages", need: [] },
    { name: "tts",         key: "__JARVIS_TTS__", need: [] },
    { name: "webhook",     key: "__JARVIS_WEBHOOK__", need: [] },
    { name: "firewall",    key: "__JARVIS_FIREWALL__", need: [] }
  ];

  function check(mod) {
    var obj = w[mod.key];
    var present = !!obj;
    var missing = [];
    if (present && mod.need.length) {
      mod.need.forEach(function (fn) {
        if (typeof obj[fn] !== "function") missing.push(fn);
      });
    }
    return {
      name: mod.name,
      present: present,
      missing: missing,
      status: !present ? "ausente" : missing.length ? "parcial" : "sólido"
    };
  }

  function validate() {
    var results = MODULES.map(check);
    var solid = results.filter(function (r) { return r.status === "sólido"; }).length;
    var partial = results.filter(function (r) { return r.status === "parcial"; }).length;
    var absent = results.filter(function (r) { return r.status === "ausente"; }).length;

    var temper = w.JARVIS && w.JARVIS.all ? w.JARVIS.all() : null;
    var redesign = w.JARVIS_REDESIGN ? w.JARVIS_REDESIGN.detectLoss() : [];

    var score = Math.round((solid / MODULES.length) * 100);

    return {
      ok: true,
      ts: Date.now(),
      score: score,
      modules: results,
      summary: {
        solidos: solid, parciais: partial, ausentes: absent, total: MODULES.length
      },
      personality: temper ? {
        dimensoes: Object.keys(temper).length,
        lealdade: temper.lealdade,
        paixao: temper.paixao,
        obsessao: temper.obsessao,
        imutaveis: w.JARVIS.IMMUTABLE ? Object.keys(w.JARVIS.IMMUTABLE) : []
      } : null,
      losses: redesign,
      verdict: score >= 90 ? "casa íntegra" : score >= 70 ? "casa funcional, com lacunas" : "casa comprometida",
      action: "observe-only"
    };
  }

  w.JARVIS_THEORY = { validate: validate, modules: MODULES };
})(window);
