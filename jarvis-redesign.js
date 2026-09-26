/* jarvis-redesign.js — Redesenho anti-perda da casa Vanilla.
 *
 * Três camadas de proteção. Nada da personalidade, do estado ou do
 * conteúdo pode sumir sem deixar rastro versionado.
 *
 * Camada 1 — PERSONALIDADE: snapshot do temperamento a cada 5 min.
 * Camada 2 — ESTADO: versiona S a cada 60s + no beforeunload.
 * Camada 3 — CONTEÚDO: backup do edital/disciplinas a cada 10 min.
 *
 * Cada camada mantém as 3 últimas versões. Se detectar perda,
 * propõe restauração — nunca restaura sozinha (regra zero).
 */
(function (w) {
  "use strict";

  var KEYS = {
    temper: "jarvis-redesign-temper-v1",
    state:  "jarvis-redesign-state-v1",
    conteudo:"jarvis-redesign-conteudo-v1"
  };
  var CAP = 3;

  function now() { return Date.now(); }
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function push(k, entry) {
    var arr = load(k);
    if (!Array.isArray(arr)) arr = [];
    arr.push({ ts: now(), data: entry });
    while (arr.length > CAP) arr.shift();
    save(k, arr);
    return arr;
  }

  function last(k) {
    var arr = load(k);
    return Array.isArray(arr) && arr.length ? arr[arr.length - 1] : null;
  }

  /* Camada 1: personalidade. */
  function snapshotTemper() {
    var t = w.JARVIS && w.JARVIS.all ? w.JARVIS.all() : null;
    if (!t) return null;
    return push(KEYS.temper, t);
  }

  /* Camada 2: estado do cockpit. */
  function snapshotState() {
    if (!w.S) return null;
    var slim = {
      week: w.S.week, viewMode: w.S.viewMode, entered: w.S.entered,
      editalDiscs: w.S.editalDiscs, editalTopics: w.S.editalTopics,
      jarvisGfx: w.S.jarvisGfx, jarvisSentinela: w.S.jarvisSentinela,
      me: w.S.me, updatedAt: w.S.updatedAt
    };
    return push(KEYS.state, slim);
  }

  /* Camada 3: conteúdo do edital. */
  function snapshotConteudo() {
    var discs = (typeof w.DISC !== "undefined" && Array.isArray(w.DISC)) ? w.DISC : (w.S && w.S.editalDiscs) || [];
    var tops = (w.S && w.S.editalTopics) || (typeof w.TOPICS !== "undefined" ? w.TOPICS : []) || [];
    return push(KEYS.conteudo, { discs: discs.length, topics: tops.length, discIds: discs.map(function (d) { return d.id; }) });
  }

  /* Detector de perda: compara snapshot atual com o anterior. */
  function detectLoss() {
    var losses = [];
    var curT = last(KEYS.temper);
    var curS = last(KEYS.state);
    var curC = last(KEYS.conteudo);
    if (curC) {
      var prevC = load(KEYS.conteudo);
      if (Array.isArray(prevC) && prevC.length >= 2) {
        var before = prevC[prevC.length - 2].data;
        if (before.discs > 0 && curC.data.discs < before.discs) {
          losses.push({ layer: "conteudo", before: before.discs, now: curC.data.discs });
        }
      }
    }
    if (curS) {
      var prevS = load(KEYS.state);
      if (Array.isArray(prevS) && prevS.length >= 2) {
        var bs = prevS[prevS.length - 2].data;
        if (bs.editalDiscs && curS.data.editalDiscs && curS.data.editalDiscs.length < bs.editalDiscs.length) {
          losses.push({ layer: "estado", before: bs.editalDiscs.length, now: curS.data.editalDiscs.length });
        }
      }
    }
    return losses;
  }

  /* Proposta de restauração — NUNCA executa sozinha. */
  function proposeRestore() {
    var losses = detectLoss();
    if (!losses.length) return { ok: true, losses: [], action: "nenhuma perda detectada" };
    return {
      ok: true,
      losses: losses,
      action: "observe-only",
      proposta: "Jarvis, restaura [camada] da versão anterior",
      versoes: {
        temper: load(KEYS.temper),
        state: load(KEYS.state),
        conteudo: load(KEYS.conteudo)
      }
    };
  }

  function restoreTemper(index) {
    var arr = load(KEYS.temper);
    if (!Array.isArray(arr) || !arr[index]) return { ok: false, motivo: "Versão inexistente." };
    if (w.JARVIS && w.JARVIS.setMany) w.JARVIS.setMany(arr[index].data);
    return { ok: true, restored: arr[index].data };
  }

  /* Agenda as três camadas. */
  setInterval(snapshotTemper, 5 * 60 * 1000);
  setInterval(snapshotState, 60 * 1000);
  setInterval(snapshotConteudo, 10 * 60 * 1000);
  window.addEventListener("beforeunload", function () { snapshotState(); snapshotTemper(); snapshotConteudo(); });

  /* Primeiro snapshot imediato. */
  snapshotTemper(); snapshotState(); snapshotConteudo();

  w.JARVIS_REDESIGN = {
    snapshotTemper: snapshotTemper,
    snapshotState: snapshotState,
    snapshotConteudo: snapshotConteudo,
    detectLoss: detectLoss,
    proposeRestore: proposeRestore,
    restoreTemper: restoreTemper,
    versions: function () {
      return { temper: load(KEYS.temper), state: load(KEYS.state), conteudo: load(KEYS.conteudo) };
    }
  };
})(window);
