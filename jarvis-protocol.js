/* jarvis-protocol.js — Protocolo Inside-Out da casa A.P.I.
 *
 * REGRA ZERO
 *   Jarvis só atende pedido ou chamada explícita.
 *   Sem o nome "Jarvis" no texto, o protocolo recusa.
 *   Nenhuma alteração entra no banco sem commit autorizado.
 *
 * FLUXO (dentro → fora)
 *   1. CALL     texto do usuário
 *   2. GATE     exige wake word
 *   3. PARSE    intent + payload sanitizado
 *   4. DRAFT    objeto criado só na memória
 *   5. COMMIT   aplica no estado S + fila de persistência
 *   6. STORE    localStorage / IndexedDB / Firestore
 *   7. PAINT    elemento gráfico, se o pedido pediu visual
 *
 * Não toca em engine.js. Usa PIComando quando a ação já existe.
 */
(function (w) {
  "use strict";

  var WAKE = /\bjarvis\b/i;
  var LOG_CAP = 80;
  var STORE_KEY = "jarvis-protocol-log-v1";
  var CFG_KEY = "jarvis-config-v1";

  var DEFAULT_CFG = {
    wakeRequired: true,
    persist: true,
    gfx: true,
    sentinela: true,
    owner: "A.P.I.",
    platform: "Planilha Inteligente",
    project: "gcm-nisia"
  };

  function clean(v, n) {
    return String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, n || 240);
  }

  function uid(prefix) {
    return (prefix || "j") + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function loadCfg() {
    var c = {};
    try { c = JSON.parse(localStorage.getItem(CFG_KEY) || "{}"); } catch (e) {}
    var out = Object.assign({}, DEFAULT_CFG, c && typeof c === "object" ? c : {});
    out.wakeRequired = out.wakeRequired !== false;
    return out;
  }

  function saveCfg(cfg) {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (e) {}
  }

  var cfg = loadCfg();
  var log = [];
  try {
    var raw = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    if (Array.isArray(raw)) log = raw.slice(-LOG_CAP);
  } catch (e) {}

  function writeLog() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(log.slice(-LOG_CAP))); } catch (e) {}
  }

  function note(entry) {
    entry.ts = Date.now();
    entry.id = entry.id || uid("log");
    log.push(entry);
    if (log.length > LOG_CAP) log.splice(0, log.length - LOG_CAP);
    writeLog();
    return entry;
  }

  /* Intents permitidos. Fora da lista = recusa. */
  var INTENTS = {
    hours:    { kind: "study",  persist: "comando" },
    done:     { kind: "study",  persist: "comando" },
    log:      { kind: "study",  persist: "comando" },
    sim:      { kind: "study",  persist: "comando" },
    nota:     { kind: "study",  persist: "comando" },
    week:     { kind: "study",  persist: "comando" },
    topic:    { kind: "study",  persist: "comando" },
    topicadd: { kind: "study",  persist: "comando" },
    drop:     { kind: "study",  persist: "comando" },
    edital:   { kind: "study",  persist: "comando" },
    config:   { kind: "config", persist: "config" },
    gfx:      { kind: "gfx",    persist: "gfx" },
    card:     { kind: "gfx",    persist: "gfx" },
    bloco:    { kind: "gfx",    persist: "gfx" },
    temper:   { kind: "voice",  persist: "temper" },
    status:   { kind: "read",   persist: "none" },
    sentinela:{ kind: "read",   persist: "none" }
  };

  function hasWake(text) {
    if (!cfg.wakeRequired) return true;
    return WAKE.test(String(text || ""));
  }

  function stripWake(text) {
    return String(text || "").replace(WAKE, " ").replace(/\s+/g, " ").trim();
  }

  function guessIntent(text) {
    var t = stripWake(text).toLowerCase();
    if (!t) return null;
    if (/temperamento|sarcasmo|humor|estresse|cordialidade|amizade|modo\s+(calmo|seco|festa|combate|leal|fabrica)/.test(t)) return "temper";
    if (/status|como est[aá]|relat[oó]rio|diagn[oó]stico/.test(t)) return "status";
    if (/sentinela|desempenho|queda|mem[oó]ria|conte[uú]do perdido/.test(t)) return "sentinela";
    if (/card|cart[aã]o/.test(t)) return "card";
    if (/bloco/.test(t)) return "bloco";
    if (/gr[aá]fico|anel|barra|kpi|hud/.test(t)) return "gfx";
    if (/config|configura/.test(t)) return "config";
    if (/edital/.test(t)) return "edital";
    if (/hora|horas/.test(t)) return "hours";
    if (/conclu|feito|done/.test(t)) return "done";
    if (/simulado/.test(t)) return "sim";
    if (/nota/.test(t)) return "nota";
    if (/semana/.test(t)) return "week";
    if (/t[oó]pico|assunto/.test(t)) return /adicion|cria|novo/.test(t) ? "topicadd" : "topic";
    if (/remover|apagar disciplina|drop/.test(t)) return "drop";
    return null;
  }

  function parsePayload(intent, text) {
    var t = stripWake(text);
    var num = t.match(/(\d+(?:[\.,]\d+)?)/);
    var payload = { raw: clean(t, 400) };
    if (num) payload.n = Number(String(num[1]).replace(",", "."));
    if (intent === "hours") {
      payload.horas = clean((num && num[1]) || "1", 3);
      var dia = t.match(/\b(seg|ter|qua|qui|sex|sab|s[aá]b|dom)\w*/i);
      payload.dia = dia ? clean(dia[1], 3).toLowerCase().slice(0, 3) : "seg";
    }
    if (intent === "config") {
      payload.patch = {};
      if (/sem\s+wake|n[aã]o\s+exig/.test(t.toLowerCase())) payload.patch.wakeRequired = false;
      if (/com\s+wake|exig/.test(t.toLowerCase())) payload.patch.wakeRequired = true;
    }
    if (intent === "card" || intent === "bloco" || intent === "gfx") {
      payload.title = clean(t.replace(/^(crie|cria|monte|gere|fa[cç]a)\s+/i, ""), 72) || "Elemento JARVIS";
      payload.type = intent === "bloco" ? "bloco" : intent === "card" ? "card" : "gfx";
    }
    return payload;
  }

  function draftOf(intent, payload, source) {
    return {
      id: uid("draft"),
      intent: intent,
      kind: INTENTS[intent].kind,
      persist: INTENTS[intent].persist,
      payload: payload || {},
      source: source || "voice",
      authorized: true,
      createdAt: Date.now(),
      status: "draft"
    };
  }

  function applyConfig(patch) {
    Object.keys(patch || {}).forEach(function (k) {
      if (k in DEFAULT_CFG) cfg[k] = patch[k];
    });
    saveCfg(cfg);
    return cfg;
  }

  function commitComando(draft) {
    if (!w.PIComando || typeof w.PIComando.aplicarGenerico !== "function") {
      return { ok: false, motivo: "PIComando.aplicarGenerico ausente." };
    }
    var proposta = Object.assign({ comando: draft.intent }, draft.payload);
    return w.PIComando.aplicarGenerico(proposta);
  }

  function commitGfx(draft) {
    if (!w.JARVIS_GFX || typeof w.JARVIS_GFX.create !== "function") {
      return { ok: false, motivo: "Módulo gráfico ausente." };
    }
    return w.JARVIS_GFX.create(draft.payload);
  }

  function commitTemper(draft) {
    if (!w.JARVIS || typeof w.JARVIS.applyVoice !== "function") {
      return { ok: false, motivo: "Setor de temperamento ausente." };
    }
    return w.JARVIS.applyVoice(draft.payload.raw || "");
  }

  function persistState() {
    try {
      if (typeof w.save === "function" && w.S) w.save(w.S);
    } catch (e) {}
    try {
      if (w.PISession && typeof w.PISession.pushState === "function" && w.S) {
        w.PISession.pushState(w.S);
      }
    } catch (e) {}
    try {
      if (typeof w.render === "function") w.render({ force: true });
    } catch (e) {}
  }

  function commit(draft) {
    if (!draft || draft.authorized !== true) {
      return { ok: false, motivo: "Commit recusado: sem autorização do usuário." };
    }
    var res;
    if (draft.persist === "comando") res = commitComando(draft);
    else if (draft.persist === "config") res = { ok: true, cfg: applyConfig(draft.payload.patch) };
    else if (draft.persist === "gfx") res = commitGfx(draft);
    else if (draft.persist === "temper") res = commitTemper(draft);
    else res = { ok: true, read: true };

    draft.status = res && res.ok !== false ? "committed" : "rejected";
    draft.result = res;
    note({ type: "commit", intent: draft.intent, status: draft.status, draftId: draft.id });
    if (cfg.persist && draft.status === "committed" && draft.persist !== "none") persistState();
    return res || { ok: false, motivo: "Falha no commit." };
  }

  function snapshot() {
    var s = w.S || {};
    return {
      owner: cfg.owner,
      platform: cfg.platform,
      project: (w.PI && w.PI.current) || cfg.project,
      week: s.week || null,
      discs: Array.isArray(s.editalDiscs) ? s.editalDiscs.length : (typeof w.DISC !== "undefined" && Array.isArray(w.DISC) ? w.DISC.length : 0),
      entered: !!s.entered,
      view: s.viewMode || null,
      temper: w.JARVIS && w.JARVIS.all ? w.JARVIS.all() : null,
      gfxCount: w.JARVIS_GFX && w.JARVIS_GFX.list ? w.JARVIS_GFX.list().length : 0,
      cfg: Object.assign({}, cfg)
    };
  }

  function sentinelaRead() {
    var snap = snapshot();
    var alerts = [];
    if (snap.discs === 0) alerts.push({ code: "conteudo", msg: "Nenhuma disciplina no edital. Risco de perda de conteúdo." });
    if (!snap.entered) alerts.push({ code: "sessao", msg: "Sessão não autenticada. Estado pode não gravar no banco." });
    if (snap.temper && snap.temper.estresse >= 70) alerts.push({ code: "carga", msg: "Estresse do cockpit alto. Queda de desempenho possível." });
    return { ok: true, snap: snap, alerts: alerts, action: "observe-only" };
  }

  function run(text, extra) {
    extra = extra || {};
    if (!hasWake(text) && extra.force !== true) {
      return { ok: false, motivo: "Sem chamada JARVIS. Protocolo em espera." };
    }
    var intent = extra.intent || guessIntent(text);
    if (!intent || !INTENTS[intent]) {
      note({ type: "refuse", text: clean(text, 180) });
      return { ok: false, motivo: "Pedido fora da lista de intents. Diga o que criar ou alterar." };
    }
    if (intent === "status") return { ok: true, snap: snapshot() };
    if (intent === "sentinela") return sentinelaRead();

    var payload = Object.assign(parsePayload(intent, text), extra.payload || {});
    var draft = draftOf(intent, payload, extra.source || "user");
    note({ type: "draft", intent: intent, draftId: draft.id });
    var res = commit(draft);
    return {
      ok: !!(res && res.ok !== false),
      intent: intent,
      draftId: draft.id,
      status: draft.status,
      result: res
    };
  }

  /* Ponte para IA externa: só aceita ação se o texto original tiver Jarvis
     ou se o envelope trouxer authorizedByUser = true (pedido já confirmado na UI). */
  function fromExternal(envelope) {
    envelope = envelope || {};
    var text = envelope.text || "";
    var authorized = envelope.authorizedByUser === true || hasWake(text);
    if (!authorized) return { ok: false, motivo: "IA externa sem autorização do usuário." };
    return run(hasWake(text) ? text : ("Jarvis " + text), {
      intent: envelope.intent,
      payload: envelope.payload,
      source: "external-ia",
      force: true
    });
  }

  w.JARVIS_PROTO = {
    run: run,
    fromExternal: fromExternal,
    snapshot: snapshot,
    sentinela: sentinelaRead,
    config: function () { return Object.assign({}, cfg); },
    setConfig: function (patch) { return applyConfig(patch); },
    log: function () { return log.slice(); },
    hasWake: hasWake,
    intents: function () { return Object.keys(INTENTS); }
  };
})(window);
