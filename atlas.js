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
    var slots = 0;
    var filled = 0;
    var notes = [];
    function takeNota(v) {
      if (v == null || v === "" || /simulado/i.test(String(v))) return;
      var n = Number(String(v).replace(",", "."));
      if (!isFinite(n)) return;
      notes.push(n);
    }
    (S.board || []).forEach(function (meta) {
      (meta.slots || []).forEach(function (slot) {
        (typeof CICLOS !== "undefined" ? CICLOS : []).forEach(function (c) {
          var cell = slot[c.id] || {};
          slots += 1;
          if (!cell.disc || cell.disc === "sim") return;
          filled += 1;
          var h = Number(cell.horas) || 1;
          hoursPlan += h;
          discs[cell.disc] = 1;
          takeNota(cell.nota);
          if (cell.feito === "ok") {
            hoursDone += h;
            discsDone[cell.disc] = 1;
          }
        });
      });
    });
    ((S.sheet && S.sheet.rows) || []).forEach(function (row) {
      Object.keys(row.cells || {}).forEach(function (day) {
        takeNota(row.cells[day] && row.cells[day].nota);
      });
    });
    var hScore = hoursPlan ? Math.min(100, (hoursDone / hoursPlan) * 100) : 0;
    var dPlan = Object.keys(discs).length;
    var dDone = Object.keys(discsDone).length;
    var dScore = dPlan ? (dDone / dPlan) * 100 : 0;
    var parts = [];
    if (q.n) parts.push({ w: 0.5, v: acc });
    if (hoursPlan) parts.push({ w: 0.3, v: hScore });
    if (dPlan) parts.push({ w: 0.2, v: dScore });
    var wsum = parts.reduce(function (a, p) { return a + p.w; }, 0);
    var geral = wsum ? Math.round(parts.reduce(function (a, p) { return a + p.v * p.w; }, 0) / wsum) : 0;
    var notaAvg = notes.length ? Math.round((notes.reduce(function (a, b) { return a + b; }, 0) / notes.length) * 10) / 10 : null;
    return {
      geral: geral,
      qScore: Math.round(acc),
      hScore: Math.round(hScore),
      dScore: Math.round(dScore),
      q: q,
      hoursPlan: Math.round(hoursPlan * 10) / 10,
      hoursDone: Math.round(hoursDone * 10) / 10,
      planned: dPlan,
      studied: dDone,
      missed: Math.max(0, dPlan - dDone),
      notaAvg: notaAvg,
      fill: slots ? Math.round((filled / slots) * 100) : 0,
    };
  }
  function journey(id) {
    var n = 0;
    var hits = 0;
    Object.keys(S.logs || {}).forEach(function (k) {
      if (k.slice(-(id.length + 1)) !== "-" + id) return;
      n += Number(S.logs[k].n) || 0;
      hits += Number(S.logs[k].hits) || 0;
    });
    hits = Math.min(n, hits);
    return { n: n, hits: hits, wrong: Math.max(0, n - hits), pct: n ? Math.round((hits / n) * 100) : 0 };
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
    return { cid: cid, si: placed };
  }
  function applyOps(actions) {
    var notes = [];
    (actions || []).forEach(function (a) {
      if (!a || !a.op) return;
      if (a.op === "hours" || a.op === "done") {
        var day = resolveDayToken(String(a.day || ""));
        var id = resolveDiscToken(String(a.disc || ""));
        if (!day || !id || id === "sim") return;
        placeHours(day, id, a.op === "hours" ? (Number(a.horas) || 1) : null, a.op === "done" || !!a.feito);
        var d = DISC.find(function (x) { return x.id === id; });
        notes.push((d ? d.sigla : id) + (a.op === "done" ? " estudado" : " " + (Number(a.horas) || 1) + "h"));
      } else if (a.op === "log") {
        var qid = resolveDiscToken(String(a.disc || ""));
        if (!qid || qid === "sim") return;
        var n = Math.max(0, Number(a.n) || 0);
        var hits = Math.min(n, Math.max(0, Number(a.hits) || 0));
        S.logs[S.week + "-" + qid] = { n: n, hits: hits };
        notes.push(qid + " " + hits + "/" + n);
      } else if (a.op === "sim") {
        if (!Array.isArray(S.simLogs)) S.simLogs = [];
        var discs = [];
        (Array.isArray(a.discs) ? a.discs : String(a.discs || "").split(/[, ]+/)).forEach(function (tok) {
          var id = resolveDiscToken(String(tok || ""));
          if (id && id !== "sim" && discs.indexOf(id) < 0) discs.push(id);
        });
        S.simLogs.unshift({
          id: "s" + Date.now() + Math.floor(Math.random() * 99),
          nome: String(a.nome || "Simulado").slice(0, 80),
          data: String(a.data || ""),
          pontos: Math.max(0, Number(a.pontos) || 0),
          total: Math.max(0, Number(a.total) || 0),
          discs: discs,
        });
        notes.push("simulado " + (a.nome || ""));
      } else if (a.op === "nota") {
        var nd = resolveDayToken(String(a.day || ""));
        var nid = resolveDiscToken(String(a.disc || ""));
        if (!nd || !nid) return;
        var spot = placeHours(nd, nid, null, false);
        setBoardSlot(0, spot.si, spot.cid, { disc: nid, nota: String(a.nota) });
        notes.push("nota " + a.nota);
      } else if (a.op === "week") {
        S.week = Math.min(14, Math.max(1, Number(a.n) || 1));
        notes.push("semana " + S.week);
      } else if (a.op === "topic" && a.id) {
        S.topic = S.topic || {};
        S.topic[a.id] = a.st || "andamento";
        notes.push("tópico");
      }
    });
    return notes;
  }
  function parseSim(t) {
    if (!/simulado/.test(t) || !/(registre|lance|anote|coloque|preencha|simulado)/.test(t)) return null;
    if (!/(registre|lance|anote|coloque|preencha)/.test(t)) return null;
    var data = (t.match(/(\d{4}-\d{2}-\d{2})/) || t.match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/) || [])[1] || "";
    if (data.indexOf("/") > 0) {
      var p = data.split("/");
      var y = p[2].length === 2 ? "20" + p[2] : p[2];
      data = y + "-" + ("0" + p[1]).slice(-2) + "-" + ("0" + p[0]).slice(-2);
    }
    var pts = t.match(/(\d+)\s*(?:pontos|pts)/);
    var tot = t.match(/(?:de|total|maximo)\s*(\d+)/);
    var nomeM = t.match(/simulado\s+(.+?)(?:\s+(?:dia|data|em|com|pontos)\b|$)/);
    var nome = nomeM ? nomeM[1].trim() : "Simulado";
    if (!nome || /^(o|a|de)$/.test(nome)) nome = "Simulado";
    var discs = [];
    var stop = { de: 1, em: 1, com: 1, dia: 1, data: 1, pontos: 1, pts: 1, simulado: 1, registre: 1, lance: 1, anote: 1, coloque: 1, para: 1, total: 1, maximo: 1, idib: 1 };
    t.split(/[^a-z0-9]+/).forEach(function (tok) {
      if (!tok || tok.length < 4 || stop[tok]) return;
      var id = null;
      DISC.forEach(function (d) {
        if (id) return;
        var did = fold(d.id);
        var sg = fold(d.sigla).replace(/[^a-z0-9]+/g, "");
        var nm = fold(d.name);
        if (tok === did || tok === sg || (tok.length >= 5 && nm.indexOf(tok) !== -1) || (did.length >= 4 && tok.indexOf(did) === 0)) id = d.id;
      });
      if (id && discs.indexOf(id) < 0) discs.push(id);
    });
    return { op: "sim", nome: nome, data: data, pontos: pts ? Number(pts[1]) : 0, total: tot ? Number(tot[1]) : 0, discs: discs };
  }
  function intent(raw) {
    var text = String(raw || "").trim();
    var t = fold(text).replace(/^atlas\s*[,:]?\s*/, "");
    if (!t) return null;
    var direct = !!(window.ATLAS && ATLAS._direct) || /^atlas\b/.test(fold(text));
    if (direct && (t === "atlas" || /^(oi|ola|hey|e ai|bom dia|boa tarde|boa noite)$/.test(t))) return { k: "hi" };
    if (/desempenho|minha media|como estou/.test(t)) return { k: "score" };
    if (/^radar\b|editais abertos|o que abriu/.test(t)) return { k: "radar" };
    var sim = parseSim(t);
    if (sim) return { k: "ops", actions: [sim], write: true };
    var hours = t.match(/(?:adicione|adiciona|coloque|coloca|marque|ponha|inclua)?\s*(\d+(?:[.,]\d+)?)\s+horas?\s+de\s+(.+?)\s+(?:na|no|nesta|neste|em)\s+([a-z0-9]+)/);
    if (hours && /hora/.test(t)) return { k: "ops", actions: [{ op: "hours", horas: Number(String(hours[1]).replace(",", ".")), disc: hours[2], day: hours[3] }], write: true };
    var estudou = t.match(/(?:marque|marca)\s+(.+?)\s+como\s+estudad[oa]\s+(?:na|no|em)\s+([a-z0-9]+)/);
    if (estudou) return { k: "ops", actions: [{ op: "done", disc: estudou[1], day: estudou[2] }], write: true };
    var nota = t.match(/(?:nota|coloque nota)\s+(\d+(?:[.,]\d+)?)\s+(?:em|de|para|na|no)\s+(.+?)\s+(?:na|no|em)\s+([a-z0-9]+)/);
    if (nota) return { k: "ops", actions: [{ op: "nota", nota: nota[1], disc: nota[2], day: nota[3] }], write: true };
    var q = t.match(/(?:registre|registra|lance|lanca|anote)\s+(\d+)\s+quest(?:ao|oes)?\s+de\s+(.+?)(?:\s+(?:com\s+)?(\d+)\s+acertos?)?$/);
    if (q) return { k: "ops", actions: [{ op: "log", n: q[1], disc: q[2], hits: q[3] || 0 }], write: true };
    if (/verticaliz/.test(t) || (/edital/.test(t) && /resum|analis|estrateg|cargo|banca|taxa/.test(t)) || t === "edital") return { k: "edital" };
    if (/^simpatia|^interacao|^criatividade|^poder/.test(t)) return { k: "pref", raw: t, write: true };
    return null;
  }
  function exec(raw) {
    var hit = intent(raw);
    if (!hit) return null;
    if (hit.write && Number(prefs().poder) < 1) {
      return tone("O poder de acesso está em zero. Eu oriento, mas não altero a planilha.");
    }
    if (hit.k === "hi") return tone("Pode falar. Eu lanço hora, questão, simulado e nota quando você pedir.");
    if (hit.k === "score") {
      var p = pulse();
      return tone("Desempenho geral " + p.geral + "%. Questões " + p.qScore + "%. Horas " + p.hoursDone + " de " + p.hoursPlan + ". Disciplinas estudadas " + p.studied + " de " + p.planned + ".");
    }
    if (hit.k === "edital") return tone(editalFala());
    if (hit.k === "radar") return tone("No radar: São Gonçalo, Paulínia e Reriutaba seguem abertos. A sua prova da GCM Nísia continua em 6 de dezembro.");
    if (hit.k === "ops") {
      var done = applyOps(hit.actions);
      if (!done.length) return tone("Não fechei disciplina ou dia. Repita com o nome da matéria.");
      return tone("Feito. " + done.join(". ") + ".");
    }
    if (hit.k === "pref") {
      var m = hit.raw.match(/(simpatia|interacao|criatividade|poder)\s+(\d)/);
      if (!m) return tone("Diga simpatia 2, interação 2, criatividade 1 ou poder 3.");
      var key = m[1] === "interacao" ? "interacao" : m[1];
      prefs()[key] = Math.max(0, Math.min(3, Number(m[2])));
      return levelLine(key);
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
  function levelLine(key) {
    var n = Number(prefs()[key]);
    var lines = {
      simpatia: ["Simpatia no mínimo. Sigo seco e objetivo.", "Simpatia em um. Direto, sem rodeio.", "Simpatia em dois. Estou com você na jornada.", "Simpatia no alto. Pode contar comigo em cada bloco."],
      interacao: ["Interação baixa. Respondo curto.", "Interação em um.", "Interação em dois. Eu devolvo o próximo passo.", "Interação no alto. Eu puxo o bloco seguinte."],
      criatividade: ["Criatividade baixa. Só o dado.", "Criatividade em um.", "Criatividade em dois. Eu lembro o que pesa na prova.", "Criatividade no alto."],
      poder: ["Poder zero. Eu oriento e não altero a planilha.", "Poder em um. Altero só o que você pedir com clareza.", "Poder em dois. Lanço hora, questão, nota e simulado quando você pedir.", "Poder no alto. Se você pedir direto, eu altero o dado na planilha."],
    };
    return (lines[key] || lines.simpatia)[Math.max(0, Math.min(3, n))];
  }
  function setLevel(key, n) {
    prefs()[key] = Math.max(0, Math.min(3, Number(n) || 0));
    return levelLine(key);
  }
  function chooseVoice() {
    var list = window.speechSynthesis ? window.speechSynthesis.getVoices() || [] : [];
    var female = /female|mulher|luciana|francisca|helena|fernanda|vit[oó]ria|maria|samantha|victoria|zira|susan|karen|moira|fiona|joana|alice/;
    var male = /daniel|david|george|alex|aaron|rishi|arthur|fred|malcolm|bruce|ralph|albert|antonio|felipe|ricardo|joao|joão|sergio|sérgio|male/;
    var best = null;
    var score = -1;
    list.forEach(function (v) {
      var n = (v.name + " " + v.lang).toLowerCase();
      if (female.test(n) && !male.test(n)) return;
      if (/portugu[eê]s do brasil|portuguese/.test(n) && !male.test(n)) return;
      var s = 0;
      if (male.test(n)) s += 6;
      if (/en-gb|en_gb|uk english/.test(n)) s += 4;
      if (/pt/.test(v.lang) && male.test(n)) s += 3;
      if (s > score) { score = s; best = v; }
    });
    return best;
  }
  function prime() {
    if (!window.speechSynthesis) return;
    try {
      window.speechSynthesis.resume();
      var u = new SpeechSynthesisUtterance(" ");
      u.volume = 0.02;
      u.pitch = 0.7;
      u.rate = 0.94;
      var v = chooseVoice();
      if (v) { u.voice = v; u.lang = v.lang; }
      else u.lang = "en-GB";
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function speak(text) {
    if (!window.speechSynthesis) return;
    var said = String(text || "").replace(/<[^>]+>/g, "");
    if (!said) return;
    window.speechSynthesis.resume();
    var u = new SpeechSynthesisUtterance(said);
    var v = chooseVoice();
    if (v) { u.voice = v; u.lang = v.lang; }
    else u.lang = "en-GB";
    u.pitch = 0.68;
    u.rate = 0.94;
    u.volume = 1;
    var on = function () { document.documentElement.classList.add("atlas-talk"); };
    var off = function () { document.documentElement.classList.remove("atlas-talk"); };
    u.onstart = on;
    u.onend = off;
    u.onerror = off;
    on();
    window.speechSynthesis.cancel();
    setTimeout(function () { window.speechSynthesis.speak(u); }, 80);
  }
  function listen() {
    prime();
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
      else speak("Não fechei a frase. Pode repetir.");
    };
    rec.onerror = function () { speak("Não ouvi. Pode repetir."); };
    try { rec.start(); } catch (e) { speak("O microfone já está aberto."); }
  }
  function catalog() {
    return DISC.map(function (d) { return d.id + "=" + d.name; }).join("; ");
  }
  function parsePlan(text) {
    var m = String(text || "").match(/\{[\s\S]*\}/);
    if (!m) return null;
    try { return JSON.parse(m[0]); } catch (e) { return null; }
  }
  function askModel(which, key, prompt) {
    return fetch("/api/atlas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ which: which, key: key, prompt: prompt }),
    }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || j.error) throw new Error("modelo");
      return j.text || "";
    });
  }
  function council(raw) {
    var p = prefs();
    var gem = String(p.gemini || "").trim();
    var oai = String(p.openai || "").trim();
    if (!gem && !oai) return Promise.resolve(null);
    var brief = "Você é o ATLAS, mentor de concurso, voz masculina, curta, sem rodeio. Disciplinas: " + catalog() + ". Dias: seg ter qua qui sex sab dom. Devolva só JSON {\"say\":\"frase em português\",\"actions\":[{\"op\":\"hours|done|log|sim|nota|week|topic\",\"disc\":\"\",\"day\":\"\",\"horas\":0,\"n\":0,\"hits\":0,\"nome\":\"\",\"data\":\"AAAA-MM-DD\",\"pontos\":0,\"total\":0,\"discs\":[],\"nota\":\"\",\"n\":1,\"id\":\"\",\"st\":\"\"}]}. Sem alteração, actions vazio. Pedido do concurseiro: " + raw;
    var first = gem ? askModel("gemini", gem, brief) : askModel("openai", oai, brief);
    return first.then(function (draft) {
      if (!gem || !oai) return draft;
      return askModel("openai", oai, "Revise o JSON do Gemini. Corrija disciplina, dia e números. Devolva só o JSON. Pedido: " + raw + " Proposta: " + draft);
    }).then(function (text) {
      var plan = parsePlan(text);
      if (!plan) return null;
      var notes = applyOps(plan.actions || []);
      var say = plan.say || (notes.length ? "Feito. " + notes.join(". ") + "." : "Não há alteração a lançar.");
      return say;
    }).catch(function () { return null; });
  }
  if (window.speechSynthesis) {
    window.speechSynthesis.onvoiceschanged = function () { chooseVoice(); };
  }
  window.ATLAS = {
    prefs: prefs,
    pulse: pulse,
    journey: journey,
    intent: intent,
    exec: exec,
    lerTexto: lerTexto,
    vertical: vertical,
    card: card,
    radarHtml: radarHtml,
    speak: speak,
    listen: listen,
    prime: prime,
    council: council,
    setLevel: setLevel,
    levelLine: levelLine,
    _direct: false,
    isPrivate: function (text) { return !!intent(text); },
  };
})();
