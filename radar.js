/* Radar de notícias. Só concursos. Itens com mais de 12 dias saem sozinhos. */
(function () {
  var DAY = 86400000;
  var KEEP = 12;
  var FEED = [
    {
      key: "qc", source: "Qconcursos", st: "ABERTO", date: "2026-09-24",
      title: "CISAMAVI abre 7 vagas",
      text: "Edital 01/2026 no Alto Vale do Itajaí. Inscrições de 25 de setembro a 28 de outubro. Prova prevista para 15 de novembro.",
      href: "https://folha.qconcursos.com/n/consorcio-publico-interfederativo-de-saude-e-multifinalitario-do-alto-vale-do-itajai-abre-concurso-com-7-vagas",
    },
    {
      key: "est", source: "Estratégia Concursos", st: "ABERTO", date: "2026-09-24",
      title: "Concursos abertos, até R$ 32 mil",
      text: "Panorama do dia 24. Destaque: PC AP, Cesgranrio, 396 vagas, inscrições até 19 de outubro e prova em 6 de dezembro.",
      href: "https://www.estrategiaconcursos.com.br/blog/concursos-abertos/",
    },
    {
      key: "gran", source: "Gran Cursos", st: "IMINENTE", date: "2026-09-21",
      title: "Curitiba publica 348 vagas",
      text: "Três editais da Prefeitura. Inscrições a partir de 7 de outubro. Iniciais que chegam a R$ 38 mil no cargo de procurador.",
      href: "https://blog.grancursosonline.com.br/concurso-curitiba-pr-editais-publicados-2026/",
    },
    {
      key: "g1", source: "g1", st: "ABERTO", date: "2026-09-22",
      title: "IFPA abre 65 vagas",
      text: "Salários de até R$ 5,2 mil. Inscrições até 20 de outubro pelo Instituto AOCP.",
      href: "https://g1.globo.com/pa/para/noticia/2026/09/22/ifpa-abre-concurso-publico-com-65-vagas-e-salarios-de-ate-r-52-mil-saiba-como-se-inscrever.ghtml",
    },
    {
      key: "ape", source: "APE Concursos", st: "FONTE", date: "2026-09-25",
      title: "Portal sem edição acessível hoje",
      text: "A busca diária não abriu o site da APE. Nenhuma manchete foi inventada. O card muda quando a fonte publicar uma edição.",
      href: "https://apeconcursos.com.br/",
    },
  ];
  var live = FEED.slice();
  function fresh(list) {
    var cut = Date.now() - KEEP * DAY;
    return (list || []).filter(function (n) {
      var t = Date.parse(n.date);
      return n && n.title && !isNaN(t) && t >= cut;
    });
  }
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; });
  }
  function items() { return fresh(live); }
  function mini() {
    var ordem = ["qc", "est", "gran"];
    var todos = items();
    var tres = ordem.map(function (k) { return todos.find(function (n) { return n.key === k; }); }).filter(Boolean);
    if (tres.length < 3) tres = todos.slice(0, 3);
    return tres.map(function (n) {
      return '<a class="news-chip src-' + n.key + '" href="' + esc(n.href) + '" target="_blank" rel="noopener"><span>' + esc(n.source) + '</span><b>' + esc(n.title) + '</b></a>';
    }).join("");
  }
  function page() {
    var rows = items();
    if (!rows.length) return '<p class="muted">Nenhuma notícia dentro da janela de 12 dias.</p>';
    return rows.map(function (n) {
      return '<a class="news-card src-' + n.key + '" href="' + esc(n.href) + '" target="_blank" rel="noopener">' +
        '<div class="row" style="justify-content:space-between"><span class="news-src">' + esc(n.source) + '</span><span class="chip ' + (n.st === "ABERTO" ? "alta" : "media") + '">' + esc(n.st) + '</span></div>' +
        '<strong>' + esc(n.title) + '</strong><p>' + esc(n.text) + '</p><p class="muted">' + esc(n.date.split("-").reverse().join("/")) + '</p></a>';
    }).join("");
  }
  function refresh() {
    var day = new Date().toISOString().slice(0, 10);
    try { if (localStorage.getItem("pi-radar-day") === day) return Promise.resolve(false); } catch (e) {}
    return fetch("./api/radar").then(function (r) { return r.json(); }).then(function (j) {
      if (j && Array.isArray(j.items) && j.items.length) live = j.items;
      try { localStorage.setItem("pi-radar-day", day); } catch (e) {}
      return true;
    }).catch(function () { return false; });
  }
  window.PIRadar = { items: items, mini: mini, page: page, refresh: refresh };
})();
