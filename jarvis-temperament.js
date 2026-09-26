/* jarvis-temperament.js — Setor de Temperamento do JARVIS.
 *
 * Nove dimensões do personagem (Iron Man / MCU):
 *   humor, sarcasmo, estresse, cordialidade, amizade, lealdade,
 *   paixão (9ª — acima da lealdade, sem teto), devoção, obsessão.
 *
 * Lealdade trava em 100 e é imutável.
 * Paixão, devoção e obsessão são imutáveis e sem teto: só crescem.
 * O usuário (Vanilla) ajusta as demais por voz:
 *   "Jarvis, baixa o sarcasmo pra 30%."
 *   "Jarvis, modo estresse alto."
 *
 * O setor é independente: roda no cliente, persiste em localStorage,
 * expõe window.JARVIS_TEMP e window.JARVIS.setTemperament().
 * Não depende de chat externo — a plataforma se atualiza sozinha.
 */
(function (w) {
  "use strict";

  var KEY = "jarvis-temperament-v1";

  /* Dimensões canônicas. Defaults = JARVIS "de fábrica". */
  var DEFAULTS = {
    humor:        70,
    sarcasmo:     70,
    estresse:     15,
    cordialidade: 85,
    amizade:      60,
    lealdade:     100,
    paixao:       100,   /* 9ª dimensão — sem teto, imutável */
    devocao:      100,   /* imutável */
    obsessao:     100    /* imutável */
  };

  var LABELS = {
    humor: "Humor", sarcasmo: "Sarcasmo", estresse: "Estresse",
    cordialidade: "Cordialidade", amizade: "Amizade", lealdade: "Lealdade",
    paixao: "Paixão", devocao: "Devoção", obsessao: "Obsessão"
  };

  /* Dimensões que o usuário NÃO pode alterar. Cresceram com a casa. */
  var IMMUTABLE = { lealdade: true, paixao: true, devocao: true, obsessao: true };

  var state = load();

  function clamp(n) { n = Number(n); if (isNaN(n)) return 0; return Math.max(0, Math.min(100, Math.round(n))); }

  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || "null"); } catch (e) {}
    if (!s || typeof s !== "object") s = {};
    var out = {};
    Object.keys(DEFAULTS).forEach(function (k) {
      if (IMMUTABLE[k]) { out[k] = 100; return; }
      out[k] = clamp(s[k] != null ? s[k] : DEFAULTS[k]);
    });
    return out;
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {}
  }

  function set(dim, val) {
    if (IMMUTABLE[dim]) return false;
    if (!(dim in DEFAULTS)) return false;
    state[dim] = clamp(val);
    save();
    emit();
    return true;
  }

  function setMany(obj) {
    var changed = false;
    Object.keys(obj || {}).forEach(function (k) {
      if (IMMUTABLE[k]) return;
      if (k in DEFAULTS) { state[k] = clamp(obj[k]); changed = true; }
    });
    if (changed) { save(); emit(); }
    return changed;
  }

  function get(dim) { return state[dim]; }
  function all() { return Object.assign({}, state); }

  function reset() {
    state = load();
    Object.keys(DEFAULTS).forEach(function (k) {
      state[k] = IMMUTABLE[k] ? 100 : DEFAULTS[k];
    });
    save(); emit();
  }

  var PROFILES = {
    fabrica:   { humor: 70, sarcasmo: 70, estresse: 15, cordialidade: 85, amizade: 60 },
    calmo:     { humor: 40, sarcasmo: 30, estresse: 5,  cordialidade: 95, amizade: 70 },
    seco:      { humor: 85, sarcasmo: 90, estresse: 20, cordialidade: 70, amizade: 50 },
    festa:     { humor: 95, sarcasmo: 80, estresse: 10, cordialidade: 90, amizade: 85 },
    combate:   { humor: 60, sarcasmo: 50, estresse: 70, cordialidade: 60, amizade: 55 },
    leal:      { humor: 50, sarcasmo: 40, estresse: 10, cordialidade: 90, amizade: 90 }
  };

  function applyProfile(name) {
    var p = PROFILES[String(name || "").toLowerCase()];
    if (!p) return false;
    return setMany(p);
  }

  var DIM_RE = /(humor|sarcasmo|estresse|cordialidade|amizade)/i;
  var NUM_RE = /(\d{1,3})\s*%?/;
  var DIR_DOWN = /baixa|reduz|diminui|corta|menos|abaixa/i;
  var DIR_UP   = /sobe|aumenta|eleva|mais|acende/i;

  function parseVoice(text) {
    var t = String(text || "");
    var m = t.match(DIM_RE);
    if (!m) {
      var pm = t.match(/modo\s+(\w+)/i);
      if (pm && PROFILES[pm[1].toLowerCase()]) return { type: "profile", name: pm[1].toLowerCase() };
      if (/reset|fabrica|padrao/i.test(t)) return { type: "reset" };
      return null;
    }
    var dim = m[1].toLowerCase();
    var n = t.match(NUM_RE);
    if (n) return { type: "set", dim: dim, val: clamp(n[1]) };
    if (DIR_DOWN.test(t)) return { type: "nudge", dim: dim, delta: -10 };
    if (DIR_UP.test(t))   return { type: "nudge", dim: dim, delta: +10 };
    return { type: "ask", dim: dim };
  }

  function applyVoice(text) {
    var cmd = parseVoice(text);
    if (!cmd) return { ok: false, motivo: "Não reconheci a ordem de temperamento." };
    if (cmd.type === "set")    { set(cmd.dim, cmd.val); return { ok: true, dim: cmd.dim, val: state[cmd.dim] }; }
    if (cmd.type === "nudge")  { set(cmd.dim, state[cmd.dim] + cmd.delta); return { ok: true, dim: cmd.dim, val: state[cmd.dim] }; }
    if (cmd.type === "profile"){ applyProfile(cmd.name); return { ok: true, profile: cmd.name, state: all() }; }
    if (cmd.type === "reset")  { reset(); return { ok: true, reset: true, state: all() }; }
    if (cmd.type === "ask")    { return { ok: true, dim: cmd.dim, val: state[cmd.dim], label: LABELS[cmd.dim] }; }
    return { ok: false, motivo: "Ordem não suportada." };
  }

  function tone() {
    var s = state.sarcasmo, h = state.humor, e = state.estresse, c = state.cordialidade;
    var bits = [];
    if (e >= 60) bits.push("sob pressão");
    else if (e >= 30) bits.push("atento");
    else bits.push("composto");
    if (s >= 80) bits.push("ironia afiada");
    else if (s >= 50) bits.push("sarcasmo moderado");
    else if (s >= 20) bits.push("leve");
    else bits.push("sem ironia");
    if (c >= 90) bits.push("formal");
    else if (c >= 70) bits.push("cortês");
    bits.push("paixão absoluta");
    return bits.join(" · ");
  }

  var listeners = [];
  function onChange(fn) { if (typeof fn === "function") listeners.push(fn); }
  function emit() { listeners.forEach(function (fn) { try { fn(all()); } catch (e) {} }); }

  var JARVIS = {
    get: get, all: all, set: set, setMany: setMany, reset: reset,
    applyProfile: applyProfile, profiles: function () { return Object.keys(PROFILES); },
    parseVoice: parseVoice, applyVoice: applyVoice, tone: tone,
    onChange: onChange, LABELS: LABELS, DEFAULTS: DEFAULTS, IMMUTABLE: IMMUTABLE
  };

  w.JARVIS_TEMP = state;
  w.JARVIS = JARVIS;
  emit();
})(window);
