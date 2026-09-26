/* Leitura do edital com IA (Gemini, pelo servidor /api/ler-edital).
   Carregar DEPOIS de comando.js. Se a IA falhar por qualquer motivo,
   a plataforma usa o leitor automático antigo, então nada quebra. */
(function () {
  "use strict";

  var base = window.PIComando;
  if (!base || typeof base.ler !== "function" || typeof base.aplicar !== "function") return;

  var lerLocal = base.ler;
  var rodada = 0;

  function norm(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
  }

  function avisar(msg) {
    try { S.editalAviso = msg; } catch (e) { /* S ainda não existe */ }
  }

  function redesenhar() {
    try { if (typeof save === "function") save(S); } catch (e) { console.warn("[leitor-ia] save", e); }
    try { if (typeof render === "function") render({ force: true }); } catch (e) { console.warn("[leitor-ia] render", e); }
  }

  function aplicarNumeros(comando) {
    try {
      var porNome = {};
      (comando.disciplinas || []).forEach(function (d) { porNome[norm(d.nome)] = d; });
      (S.editalDiscs || []).forEach(function (d) {
        var x = porNome[norm(d.name)];
        if (!x) return;
        if (x.questoes > 0) d.q = x.questoes;
        if (x.pontos > 0) d.pts = x.pontos;
      });
    } catch (e) { console.warn("[leitor-ia] numeros", e); }
  }

  function pedirIA(texto) {
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 90000) : null;
    return fetch("/api/ler-edital", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ texto: texto }),
      signal: ctrl ? ctrl.signal : undefined,
    })
      .then(function (r) {
        return r.json().catch(function () {
          return { ok: false, motivo: r.status === 404 ? "servidor da IA ainda não publicado" : "resposta inválida (" + r.status + ")" };
        });
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  function lerComIA(texto) {
    var minha = ++rodada;
    pedirIA(texto)
      .then(function (r) {
        if (minha !== rodada) return;
        if (!r || !r.ok || !r.comando) throw new Error((r && r.motivo) || "sem resposta");
        var res = base.aplicar(r.comando);
        if (!res || !res.ok) throw new Error((res && res.motivo) || "comando recusado");
        aplicarNumeros(r.comando);
        avisar("Edital lido pela IA: " + res.disciplinas + " disciplinas e " + res.assuntos + " assuntos. Confira os dados.");
        redesenhar();
      })
      .catch(function (err) {
        if (minha !== rodada) return;
        var motivo = err && err.name === "AbortError" ? "demorou demais" : (err && err.message) || "falha";
        console.warn("[leitor-ia]", motivo, err);
        var local = lerLocal(texto);
        avisar(local && local.ok
          ? "A IA não conseguiu ler (" + motivo + "). Usei o leitor automático — confira as disciplinas."
          : ((local && local.motivo) || "Não consegui ler o edital.") + " (IA: " + motivo + ")");
        redesenhar();
      });
  }

  base.ler = function (texto) {
    var t = String(texto || "");
    if (window.PISemIA || typeof fetch !== "function" || t.replace(/\s/g, "").length < 40) return lerLocal(t);
    avisar("Lendo o edital com IA… isso leva uns segundos.");
    lerComIA(t);
    return { ok: true, motivo: "", pendente: true };
  };
  base.lerLocal = lerLocal;
})();
