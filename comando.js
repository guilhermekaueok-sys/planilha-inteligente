/* Comando único da plataforma. Um script de fora só entra neste formato:
{
  "comando": "edital",
  "cargo": "",
  "prova": "",
  "banca": "",
  "inscricao": "",
  "taxa": "",
  "disciplinas": [{ "nome": "", "assuntos": [""] }]
}
Outra chave é ignorada. Outro comando não muda nada.
*/
(function () {
  var CAMPOS = ["cargo", "prova", "banca", "inscricao", "taxa"];
  var blocked = /inscri[cç]|deferiment|comprovante|disposi[cç]|vagas reserv|avalia[cç][aã]o de sa[uú]de|elimina|cronograma|recurso|preliminar|do cargo|da inscri/i;

  function clean(v, n) {
    return String(v || "").replace(/\s+/g, " ").trim().slice(0, n || 180);
  }

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
    if (typeof parseEditalText !== "function") return { ok: false, motivo: "Leitor ausente." };
    if (!text || String(text).length < 40) return { ok: false, motivo: "O arquivo não trouxe texto para o leitor." };
    return aplicar(packDe(parseEditalText(text)));
  }

  window.PIComando = { aplicar: aplicar, ler: ler };
})();
