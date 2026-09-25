/* ATLAS — mentor da planilha. Comando de sistema não sai deste aparelho. */
(function () {
  var BASE = {
    cargo: "Guarda Civil Municipal de Nísia Floresta",
    prova: "06/12/2026 · 4 horas",
    banca: "IDIB",
    inscricao: "anexe o edital para eu extrair o período",
    taxa: "anexe o edital para eu extrair a taxa",
    linkInscricao: "http://www.idib.org.br/",
    linkBanca: "http://www.idib.org.br/",
  };
  var RADAR = [
    { st: "ABERTO", t: "GCM Nísia Floresta e demais cargos da prefeitura e da câmara", d: "IDIB · inscrições até 13/10/2026 · até R$ 3.242 · a prova da GCM desta planilha segue em 06/12/2026.", href: "http://www.idib.org.br/" },
    { st: "ABERTO", t: "Guarda de São Gonçalo RJ — 606 vagas", d: "Selecon · inscrições de 28/09 a 18/11/2026 · nível médio e CNH.", href: "https://folha.qconcursos.com/n/concurso-guarda-de-sao-goncalo-rj-2026-edital" },
    { st: "ABERTO", t: "Guarda Municipal de Paulínia SP — 40 vagas", d: "VUNESP · 09/09 a 08/10/2026 · taxa R$ 100 · prova 06/12/2026 · R$ 4.676 mais auxílios.", href: "https://folha.qconcursos.com/n/prefeitura-municipal-de-paulinia-sp-publica-concurso-com-40-vagas-para-guarda-municipal-6-classe" },
    { st: "ABERTO", t: "Guarda de Reriutaba CE — edital 01/2026", d: "IDIB · 02/09 a 05/10/2026 · taxa R$ 156,67 · prova 06/12/2026.", href: "https://folha.qconcursos.com/n/prefeitura-de-reriutaba-ce-abre-concurso-para-guarda-civil-municipal-com-9-vagas" },
    { st: "PREVISTO", t: "GCM Sarandi PR e bancas já definidas", d: "Sarandi anunciada (20 vagas, cerca de R$ 4.092). Novo Hamburgo com Fundatec. Sapucaia do Sul com INQC. São Roque SP com ABCP. Leitura de 24/09/2026.", href: "https://www.estrategiaconcursos.com.br/blog/concursos-guarda-municipal/" },
  ];

  function fold(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function prefs() {
    if (!S.atlas) S.atlas = { simpatia: 2, interacao: 2, criatividade: 1, poder: 2 };
    return S.atlas;
  }
  function nome() {
    return (S.me && S.me.name) || "concurseiro";
  }
  function tone(body) {
    var p = prefs();
    var line = body;
    if (p.simpatia >= 2) line = nome().split(" ")[0] + ", " + body.charAt(0).toLowerCase() + body.slice(1);
    if (p.criatividade >= 2 && p.interacao >= 1) line += " O que pesa na prova vem primeiro.";
    if (p.interacao >= 3) line += " Quer que eu lance o próximo bloco?";
    return line;
  }
  function pulse() {
    var q = typeof weekQuestionScore === "function" ? weekQuestionScore() : { n: 0, hits: 0, score: 0 };
    var acc = q.n ? (q.hits / q.n) * 100 : 0;
    var hoursPlan = 0;
    var hoursDone = 0;
    var discs = {};
    var discsDone = {};
    (S.board || []).forEach(function (meta) {
      (meta.slots || []).forEach(function (slot) {
        (typeof CICLOS !== "undefined" ? CICLOS : []).forEach(function (c) {
          var cell = slot[c.id];
          if (!cell || !cell.disc || cell.disc === "sim") return;
          var h = Number(cell.horas) || 1;
          hoursPlan += h;
          discs[cell.disc] = 1;
          if (cell.feito === "ok") {
            hoursDone += h;
            discsDone[cell.disc] = 1;
          }
        });
      });
    });
    var hScore = hoursPlan ? Math.min(100, (hoursDone / hoursPlan) * 100) : 0;
    var dPlan = Object.keys(discs).length;
    var dScore = dPlan ? (Object.keys(discsDone).length / dPlan) * 100 : 0;
    var parts = [];
    if (q.n) parts.push({ w: 0.5, v: acc });
    if (hoursPlan) parts.push({ w: 0.3, v: hScore });
    if (dPlan) parts.push({ w: 0.2, v: dScore });
    var wsum = parts.reduce(function (a, p) { return a + p.w; }, 0);
    var geral = wsum ? Math.round(parts.reduce(function (a, p) { return a + p.v * p.w; }, 0) / wsum) : 0;
    return {
      geral: geral,
      qScore: Math.round(acc),
      hScore: Math.round(hScore),
      dScore: Math.round(dScore),
      q: q,
      hoursPlan: hoursPlan,
      hoursDone: hoursDone,
    };
  }
  function placeHours(dayId, discId, hours, feito) {
    ensurePlan();
    var cid = cicloOfDay(dayId);
    var placed = -1;
    var si;
    for (si = 0; si < 3; si++) {
      if (boardCell(0, si, cid).disc === discId) { placed = si; break; }
    }
    if (placed < 0) {
      for (si = 0; si < 3; si++) {
        if (!boardCell(0, si, cid).disc) { placed = si; break; }
      }
    }
    if (placed < 0) placed = 2;
    var patch = { disc: discId };
    if (hours != null) patch.horas = String(hours);
    if (feito) patch.feito = "ok";
    setBoardSlot(0, placed, cid, patch);
    S.planMode = "manual";
    S.day = dayId;
  }
  function intent(raw) {
    var text = String(raw || "").trim();
    var t = fold(text).replace(/^atlas\s*[,:]?\s*/, "");
    if (!t) return null;
    if (/^(oi|ola|hey|e ai|bom dia|boa tarde|boa noite)\b/.test(t) || t === "atlas") return { k: "hi" };
    if (/desempenho|minha media|como estou/.test(t)) return { k: "score" };
    if (/^radar\b|editais abertos|o que abriu/.test(t)) return { k: "radar" };
    var hours = t.match(/(?:adicione|adiciona|coloque|coloca|marque|ponha|inclua)\s+(\d+(?:[.,]\d+)?)\s+horas?\s+de\s+(.+?)\s+(?:na|no|nesta|neste|em)\s+([a-z0-9]+)/);
    if (hours) return { k: "hours", h: hours[1], disc: hours[2], day: hours[3], write: true };
    var estudou = t.match(/(?:marque|marca)\s+(.+?)\s+como\s+estudad[oa]\s+(?:na|no|em)\s+([a-z0-9]+)/);
    if (estudou) return { k: "done", disc: estudou[1], day: estudou[2], write: true };
    var q = t.match(/(?:registre|registra|lance|lanca|anote)\s+(\d+)\s+quest(?:ao|oes)?\s+de\s+(.+?)(?:\s+(\d+)\s+acertos?)?$/);
    if (q) return { k: "q", n: q[1], disc: q[2], hits: q[3], write: true };
    if (/verticaliz/.test(t) || (/edital/.test(t) && /resum|analis|estrateg|cargo|banca|taxa/.test(t)) || t === "edital") return { k: "edital" };
    if (/^simpatia|^interacao|^criatividade|^poder/.test(t)) return { k: "pref", raw: t, write: true };
    return null;
  }
  function exec(raw) {
    var hit = intent(raw);
    if (!hit) return null;
    if (hit.write && prefs().poder < 2) {
      return tone("Esse pedido altera a planilha e o poder de acesso está abaixo de 2. Suba o nível na sala ATLAS.");
    }
    if (hit.k === "hi") return tone("Sou o ATLAS. Posso lançar hora, questão, ler o edital e recalcular o desempenho. O comando fica só com você.");
    if (hit.k === "score") {
      var p = pulse();
      return tone("Desempenho geral " + p.geral + "%. Questões " + p.qScore + "%, horas batidas " + p.hScore + "%, disciplinas concluídas " + p.dScore + "%. A média usa 50, 30 e 20. O que não tem dado sai da conta.");
    }
    if (hit.k === "edital") return tone(editalFala());
    if (hit.k === "radar") return tone("No radar de hoje: São Gonçalo abre dia 28, Paulínia e Reriutaba seguem com inscrição, e a sua prova da GCM Nísia continua em 06/12. Abra a sala RADAR.");
    if (hit.k === "hours" || hit.k === "done") {
      var day = resolveDayToken(hit.day);
      var id = resolveDiscToken(hit.disc);
      if (!day || !id || id === "sim") return tone("Não fechei o dia ou a disciplina. Tente: adicione 2 horas de Direito Administrativo na terça.");
      placeHours(day, id, hit.k === "hours" ? Number(String(hit.h).replace(",", ".")) || 1 : null, hit.k === "done");
      var d = DISC.find(function (x) { return x.id === id; });
      var dia = DAYS.find(function (x) { return x.id === day; });
      return tone((hit.k === "done" ? "Marquei como estudado. " : "Entrou na grade. ") + (d ? d.sigla : id) + " · " + (dia ? dia.label : day) + ".");
    }
    if (hit.k === "q") {
      var qid = resolveDiscToken(hit.disc);
      if (!qid || qid === "sim") return tone("Não achei essa disciplina para lançar a questão.");
      var n = Number(hit.n) || 0;
      var hits = hit.hits != null ? Number(hit.hits) : 0;
      S.logs[S.week + "-" + qid] = { n: n, hits: Math.min(n, hits) };
      var disc = DISC.find(function (x) { return x.id === qid; });
      return tone((disc ? disc.sigla : qid) + ": " + n + " resolvidas, " + Math.min(n, hits) + " acertos. O desempenho geral já considera isso.");
    }
    if (hit.k === "pref") {
      var m = hit.raw.match(/(simpatia|interacao|criatividade|poder)\s+(\d)/);
      if (!m) return tone("Diga simpatia 2, interação 2, criatividade 1 ou poder 2.");
      var key = m[1] === "interacao" ? "interacao" : m[1];
      prefs()[key] = Math.max(0, Math.min(3, Number(m[2])));
      return tone("Ajustei " + key + " para " + prefs()[key] + ".");
    }
    return null;
  }
  function editalFala() {
    var e = Object.assign({}, BASE, S.editalLido || {});
    return "Cargo " + e.cargo + ". Prova " + e.prova + ". Banca " + e.banca + ". Inscrição: " + e.inscricao + ". Taxa: " + e.taxa + ".";
  }
  function lerTexto(text) {
    var t = String(text || "").replace(/\s+/g, " ");
    if (t.length < 40) return null;
    var cargo = (t.match(/cargo\s*[:\-]\s*([^.]{4,80})/i) || [])[1];
    var banca = (t.match(/\b(IDIB|VUNESP|CESPE|CEBRASPE|AOCP|IBFC|FGV|FUNDATEC|SELECON|CONSULPLAN|INQC|ABCP)\b/i) || [])[1];
    var prova = (t.match(/(?:data da prova|prova objetiva)[^\d]{0,24}(\d{1,2}\/\d{2}\/\d{4})/i) || [])[1];
    var insc = (t.match(/inscri[cç][aã]o[^\d]{0,40}(\d{1,2}\/\d{2}\/\d{4}.{0,24}\d{1,2}\/\d{2}\/\d{4})/i) || [])[1];
    var taxa = (t.match(/R\$\s*[\d.]+(?:,\d{2})?/) || [])[0];
    var link = (t.match(/https?:\/\/[^\s)]+/) || [])[0];
    S.editalLido = {
      cargo: cargo || BASE.cargo,
      prova: prova || BASE.prova,
      banca: banca || BASE.banca,
      inscricao: insc || BASE.inscricao,
      taxa: taxa || BASE.taxa,
      linkInscricao: link || BASE.linkInscricao,
      linkBanca: BASE.linkBanca,
    };
    return S.editalLido;
  }
  function vertical() {
    var by = {};
    TOPICS.forEach(function (topic) {
      var d = DISC.find(function (x) { return x.id === topic.d; });
      var name = d ? d.name : topic.d;
      by[name] = by[name] || [];
      by[name].push(topic.t);
    });
    return by;
  }
  function card() {
    var e = Object.assign({}, BASE, S.editalLido || {});
    var rows = [
      ["Cargo", e.cargo],
      ["Data da prova", e.prova],
      ["Período de inscrição", e.inscricao],
      ["Link de inscrição", e.linkInscricao],
      ["Taxa", e.taxa],
      ["Banca", e.banca],
      ["Plataforma da banca", e.linkBanca],
    ];
    return rows.map(function (r) {
      var v = /^https?:/.test(r[1]) ? '<a href="' + r[1] + '" target="_blank" rel="noopener">' + r[1] + "</a>" : r[1];
      return "<p><strong>" + r[0] + ".</strong> " + v + "</p>";
    }).join("");
  }
  function radarHtml() {
    return RADAR.map(function (n) {
      return '<article class="card disc-item"><div class="row" style="justify-content:space-between"><strong>' + n.t + '</strong><span class="chip ' + (n.st === "ABERTO" ? "alta" : "media") + '">' + n.st + '</span></div><p class="muted">' + n.d + '</p><p><a href="' + n.href + '" target="_blank" rel="noopener">Fonte</a></p></article>';
    }).join("");
  }
  function speak(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text || "").replace(/<[^>]+>/g, ""));
    u.lang = "pt-BR";
    u.rate = 1;
    var on = function () { document.documentElement.classList.add("atlas-talk"); };
    var off = function () { document.documentElement.classList.remove("atlas-talk"); };
    u.onstart = on;
    u.onend = off;
    u.onerror = off;
    on();
    window.speechSynthesis.speak(u);
  }
  function listen() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      speak("Este Chrome não abriu o microfone.");
      return;
    }
    var rec = new SR();
    rec.lang = "pt-BR";
    rec.onresult = function (ev) {
      var said = ev.results && ev.results[0] && ev.results[0][0] ? ev.results[0][0].transcript : "";
      if (said && typeof sendPlanChat === "function") sendPlanChat({ value: said }, { voice: true });
    };
    rec.onerror = function () { speak("Não ouvi. Pode repetir."); };
    rec.start();
  }
  window.ATLAS = {
    prefs: prefs,
    pulse: pulse,
    intent: intent,
    exec: exec,
    lerTexto: lerTexto,
    vertical: vertical,
    card: card,
    radarHtml: radarHtml,
    speak: speak,
    listen: listen,
    isPrivate: function (text) { return !!intent(text); },
  };
})();
