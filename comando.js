/* comando.js — ponte única entre "texto/JSON de fora" e o estado da planilha.
 *
 * O bloco do comando "edital" abaixo é o que já existe e roda em produção —
 * não foi alterado. O que foi ADICIONADO é o dispatcher genérico
 * (VALIDADORES + aplicarGenerico) que faltava para as outras 9 ações do
 * webhook (hours, done, log, sim, nota, week, topic, topicadd, drop) terem
 * a mesma sanitização (clean/blocked) que hoje só protege o comando edital.
 *
 * Schema aceito de fora:
 * {
 *   "comando": "edital",
 *   "cargo": "", "prova": "", "banca": "", "inscricao": "", "taxa": "",
 *   "disciplinas": [{ "nome": "", "assuntos": [""] }]
 * }
 * ...ou qualquer uma das 9 ações abaixo, com os campos listados em VALIDADORES.
 * Qualquer chave fora da lista da ação é descartada. Qualquer comando fora
 * da lista (ACOES/edital) é recusado.
 */
(function () {
  var CAMPOS = ["cargo", "prova", "banca", "inscricao", "taxa"];
  var blocked = /inscri[cç]|deferiment|comprovante|disposi[cç]|vagas reserv|avalia[cç][aã]o de sa[uú]de|elimina|cronograma|recurso|preliminar|do cargo|da inscri/i;

  function clean(v, n) {
    return String(v || "").replace(/\s+/g, " ").trim().slice(0, n || 180);
  }

  /* ---------------------------------------------------------------
   * Comando "edital" — inalterado
   * --------------------------------------------------------------- */
  function packDe(parsed) {
    var by = {};
    var order = [];
    (parsed.discs || []).forEach(function (d) {
      if (!d || !d.name || blocked.test(d.name)) return;
      if (!by[d.name]) { by[d.name] = []; order.push(d.name); }
    });
    (parsed.topics || []).forEach(function (t) {
      var name = t && t.disc;
      if (!name || blocked.test(name) || blocked.test(t.t || "")) return;
      if (!by[name]) { by[name] = []; order.push(name); }
      if (t.t) by[name].push(clean(t.t, 180));
    });
    return {
      comando: "edital",
      cargo: parsed.meta && parsed.meta.cargo,
      prova: parsed.meta && parsed.meta.prova,
      banca: parsed.meta && parsed.meta.banca,
      inscricao: parsed.meta && parsed.meta.inscricao,
      taxa: parsed.meta && parsed.meta.taxa,
      disciplinas: order.map(function (nome) { return { nome: nome, assuntos: by[nome] }; }),
    };
  }

  function aplicar(raw) {
    var data = raw;
    if (typeof raw === "string") {
      try { data = JSON.parse(raw); } catch (e) { return { ok: false, motivo: "O script não é o JSON do comando edital." }; }
    }
    if (!data || data.comando !== "edital") return { ok: false, motivo: "Comando recusado. O único comando aceito é edital." };
    var discs = [];
    var topics = [];
    var seen = {};
    (Array.isArray(data.disciplinas) ? data.disciplinas : []).forEach(function (d) {
      var nome = clean(d && d.nome, 72);
      if (!nome || blocked.test(nome)) return;
      var id = typeof discIdOf === "function" ? discIdOf(nome) : nome.toLowerCase().slice(0, 24);
      if (seen[id]) return;
      seen[id] = 1;
      discs.push({
        id: id,
        sigla: typeof discSigla === "function" ? discSigla(nome) : nome.slice(0, 4).toUpperCase(),
        name: nome,
        pesoOf: 1, pts: 1, q: 0, editais: 1, provas: 1, n: 1,
      });
      (Array.isArray(d.assuntos) ? d.assuntos : []).forEach(function (a) {
        var topic = clean(a, 180);
        if (!topic || blocked.test(topic)) return;
        topics.push({ id: "u" + topics.length, disc: nome, d: id, t: topic });
      });
    });
    var meta = { linkInscricao: "", linkBanca: "", aviso: "" };
    CAMPOS.forEach(function (k) { meta[k] = clean(data[k], k === "taxa" ? 40 : 120); });
    if (typeof applyParsedEdital === "function") applyParsedEdital({ meta: meta, discs: discs, topics: topics });
    return { ok: true, motivo: "", cargo: meta.cargo, disciplinas: discs.length, assuntos: topics.length };
  }

  function ler(text) {
    if (!text || String(text).length < 40) return { ok: false, motivo: "O arquivo não trouxe texto para o leitor." };
    if (typeof parseEdital === "function") return aplicar(parseEdital(text));
    if (typeof parseEditalText !== "function") return { ok: false, motivo: "Leitor ausente." };
    return aplicar(packDe(parseEditalText(text)));
  }

  /* ---------------------------------------------------------------
   * NOVO — as 9 ações do webhook que ainda não passavam por sanitização.
   * Mesmo princípio do comando edital: clean() em tudo, whitelist de campo
   * por ação, e quem escreve no estado de verdade é uma função só
   * (aplicarNoEstado, em app.js) — comando.js nunca toca em S diretamente.
   * --------------------------------------------------------------- */
  var ACOES = {
    hours:    { campos: ["dia", "horas"] },
    done:     { campos: ["dia", "disc"] },
    log:      { campos: ["semana", "disc", "n", "hits"] },
    sim:      { campos: ["nota", "banca"] },
    nota:     { campos: ["dia", "disc", "nota"] },
    week:     { campos: ["semana"] },
    topic:    { campos: ["disc", "topico"] },
    topicadd: { campos: ["disc", "topico"] },
    drop:     { campos: ["disc"] },
  };

  var VALIDADORES = {
    hours:    function (p) { return { dia: clean(p.dia, 3), horas: clean(p.horas, 3) }; },
    done:     function (p) { return { dia: clean(p.dia, 3), disc: clean(p.disc, 24) }; },
    log:      function (p) { return { semana: Number(p.semana) || 0, disc: clean(p.disc, 24), n: Math.max(0, Number(p.n) || 0), hits: Math.max(0, Number(p.hits) || 0) }; },
    sim:      function (p) { return { nota: clean(p.nota, 10), banca: clean(p.banca, 20) }; },
    nota:     function (p) { return { dia: clean(p.dia, 3), disc: clean(p.disc, 24), nota: clean(p.nota, 10) }; },
    week:     function (p) { return { semana: Number(p.semana) || 0 }; },
    topic:    function (p) { return { disc: clean(p.disc, 24), topico: clean(p.topico, 180) }; },
    topicadd: function (p) { return { disc: clean(p.disc, 24), topico: clean(p.topico, 180) }; },
    drop:     function (p) { return { disc: clean(p.disc, 24) }; },
  };

  function aplicarGenerico(proposta) {
    var acao = proposta && proposta.comando;
    if (!acao) return { ok: false, motivo: "Comando ausente." };
    if (acao === "edital") return aplicar(proposta); // caminho já existente, sem mudança

    var schema = ACOES[acao];
    var validador = VALIDADORES[acao];
    if (!schema || !validador) return { ok: false, motivo: "Ação fora da lista permitida." };

    // mesma trava do comando edital: nunca deixa passar campo/texto bloqueado
    for (var i = 0; i < schema.campos.length; i++) {
      var v = proposta[schema.campos[i]];
      if (typeof v === "string" && blocked.test(v)) {
        return { ok: false, motivo: "Conteúdo não permitido no campo \"" + schema.campos[i] + "\"." };
      }
    }

    var campos = validador(proposta);

    if (typeof aplicarNoEstado !== "function") {
      return { ok: false, motivo: "aplicarNoEstado ausente — inclua aplicar-no-estado.js depois de app.js." };
    }
    var res = aplicarNoEstado(acao, campos) || { ok: true };
    return { ok: res.ok !== false, motivo: res.motivo || "", acao: acao, campos: campos };
  }

  window.PIComando = { aplicar: aplicar, ler: ler, aplicarGenerico: aplicarGenerico };
})();
