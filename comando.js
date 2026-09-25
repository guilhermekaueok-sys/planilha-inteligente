/* Comando unico da plataforma. Um script de fora so entra neste formato:
{
  "comando": "edital",
  "cargo": "",
  "prova": "",
  "banca": "",
  "inscricao": "",
  "taxa": "",
  "disciplinas": [{ "nome": "", "assuntos": [""] }]
}
Outra chave e ignorada. Outro comando nao muda nada.
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
      try { data = JSON.parse(raw); } catch (e) { return { ok: false, motivo: "O script nao e o JSON do comando edital." }; }
    }
    if (!data || data.comando !== "edital") return { ok: false, motivo: "Comando recusado. O unico comando aceito e edital." };
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
        pesoOf: 1,
        pts: Number(d && d.pts) > 0 ? Number(d.pts) : 1,
        q: Number(d && d.q) > 0 ? Number(d.q) : 0,
        editais: 1, provas: 1, n: 1,
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

  function extrairQuadroProva(text) {
    var lines = String(text || "").replace(/\r/g, "").split("\n").map(function (l) {
      return l.replace(/\s+/g, " ").trim();
    }).filter(Boolean);
    var prosa = /ser[aá]|consistir|subitem|candidat|aprovad|elabora|corrigid|percent|defici|concorr[eê]ncia|m[ií]nimo de|acertos no|car[aá]ter|somente|caso o|total\b|ampla |da prova|remanejament|classificad/i;
    var nova = /^(l[ií]ngua|racioc[ií]nio|hist[oó]ria|geografia|no[cç][oõ]es|legisla[cç][aã]o|estatuto|est\s*atuto|lei\s|direito|inform[aá]tica|matem[aá]tica|portugu|atualidades|conhecimentos)/i;
    var fim = /^(total\b|da prova|ampla concorr|prova discursiva|somente ser|caso o n)/i;
    var start = -1;
    for (var i = 0; i < lines.length; i++) {
      if (/l[ií]ngua portuguesa\s+\d+/i.test(lines[i]) || /racioc[ií]nio l[oó]gico\s+\d+/i.test(lines[i])) {
        start = i;
        break;
      }
    }
    if (start < 0) return null;
    var discs = [];
    var pend = "";
    function limpa(nome) {
      return nome.replace(/\s+/g, " ").replace(/^est\s+atuto/i, "Estatuto").replace(/\s+administrativo$/i, "").trim();
    }
    function fecha(nome, q, pts) {
      nome = limpa(nome);
      if (nome.length < 4 || prosa.test(nome)) return;
      if (/^administrativo$/i.test(nome)) nome = "Direito Administrativo";
      discs.push({ nome: nome, q: q || 0, pts: pts || 0, assuntos: [] });
    }
    for (var j = start; j < lines.length; j++) {
      var line = lines[j];
      if (fim.test(line) || prosa.test(line)) break;
      if (/^aprova[cç][aã]o$/i.test(line)) continue;
      var m = line.match(/^(.+?)\s+(\d{1,3})(?:\s+(\d{1,3}))?$/);
      if (m && /[A-Za-zÀ-ú]{3}/.test(m[1]) && Number(m[2]) <= 200 && (!m[3] || Number(m[3]) >= Number(m[2]))) {
        var nome = (pend ? pend + " " : "") + m[1];
        pend = "";
        fecha(nome, Number(m[2]), m[3] ? Number(m[3]) : 0);
        continue;
      }
      if (line.length > 42 || /[.]/.test(line)) break;
      if (nova.test(line) || /^administrativo$/i.test(line)) {
        if (pend) fecha(pend, 0, 0);
        pend = line;
        continue;
      }
      pend = pend ? pend + " " + line : line;
    }
    if (pend) fecha(pend, 0, 0);
    return discs.length >= 3 ? discs : null;
  }

  function chaveNome(s) {
    return String(s || "").toLowerCase().replace(/[áàâã]/g, "a").replace(/[éê]/g, "e").replace(/[í]/g, "i").replace(/[óôõ]/g, "o").replace(/[ú]/g, "u").replace(/ç/g, "c").replace(/[^a-z0-9]+/g, " ").trim();
  }

  function extrairConteudoProgramatico(text) {
    var raw = String(text || "").replace(/\r/g, "");
    var m = raw.match(/conte[uú]dos?\s+program[aá]ticos?/i);
    if (!m) return null;
    var bloco = raw.slice(m.index);
    var corte = bloco.search(/\n\s*(disposi[cç][oõ]es\s+finais|cronograma|crit[eé]rios\s+de\s+desempate|das\s+inscri[cç])/i);
    if (corte > 200) bloco = bloco.slice(0, corte);
    var lines = bloco.split("\n").map(function (l) { return l.replace(/\s+/g, " ").trim(); }).filter(Boolean);
    var lixo = /aprova[cç][aã]o|m[ií]nimo de|acertos no|car[aá]ter|total\s+\d+|prova discursiva|somente ser|subitem|conte[uú]do program/i;
    var discs = [];
    var atual = null;
    function flush() {
      if (atual && atual.nome) discs.push(atual);
      atual = null;
    }
    lines.forEach(function (line, i) {
      if (i === 0) return;
      if (lixo.test(line) || /^\d{1,3}$/.test(line)) return;
      var titulo = line.replace(/^(?:\d{1,2}|[IVXLC]{1,6})[.)\-\s]+/, "").replace(/\s+\d{1,3}(?:\s+\d{1,3})?$/, "").trim();
      var caps = titulo === titulo.toUpperCase() && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(titulo);
      var rotulo = /^(l[ií]ngua|racioc[ií]nio|hist[oó]ria|geografia|no[cç][oõ]es|legisla[cç]|estatuto|lei\s|direito|inform[aá]tica)/i.test(titulo);
      var isDisc = (caps || rotulo) && titulo.split(" ").length <= 12 && titulo.length >= 4 && titulo.length <= 80 && !/[.!?]$/.test(titulo) && !/^\d+\.\d+/.test(line);
      if (isDisc) {
        flush();
        atual = { nome: titulo, q: 0, pts: 0, assuntos: [] };
        return;
      }
      if (!atual) return;
      var assunto = line.replace(/^(?:\d+(?:\.\d+)*)[.)\-\s]+/, "").replace(/^[a-z]\)\s+/i, "").trim();
      if (assunto.length >= 3 && assunto.length <= 400 && !lixo.test(assunto)) atual.assuntos.push(assunto);
    });
    flush();
    var bons = discs.filter(function (d) { return d.nome.length >= 4 && !lixo.test(d.nome); });
    return bons.length >= 2 ? bons : null;
  }

  function cruzarQuadro(discs, quadro) {
    if (!quadro || !discs) return discs;
    quadro.forEach(function (q) {
      var k = chaveNome(q.nome);
      discs.forEach(function (d) {
        var kd = chaveNome(d.nome);
        if (kd === k || kd.indexOf(k) >= 0 || k.indexOf(kd) >= 0) {
          if (q.q) d.q = q.q;
          if (q.pts) d.pts = q.pts;
        }
      });
    });
    return discs;
  }

  function ler(text) {
    if (!text || String(text).length < 40) return { ok: false, motivo: "O arquivo nao trouxe texto para o leitor." };
    if (typeof parseEdital !== "function" && typeof parseEditalText !== "function") {
      return { ok: false, motivo: "Leitor ausente." };
    }
    var bruto = typeof parseEdital === "function" ? parseEdital(text) : packDe(parseEditalText(text));
    var quadro = extrairQuadroProva(text);
    var vertical = extrairConteudoProgramatico(text);
    if (vertical) bruto.disciplinas = cruzarQuadro(vertical, quadro);
    else if (quadro) bruto.disciplinas = quadro;
    return aplicar(bruto);
  }

  window.PIComando = { aplicar: aplicar, ler: ler };
})();
