(function () {
  if (typeof pages === "undefined") return;
  pages.comando = function () {
    const ranked = DISC.slice().sort(function (a, b) { return gap(b) - gap(a); });
    const top = ranked[0];
    const done = DISC.filter(function (d) { return rate(d.id) !== null; }).length;
    const xs = DISC.map(function (d) { return rate(d.id); }).filter(function (x) { return x !== null; });
    const avg = xs.length ? xs.reduce(function (a, b) { return a + b; }, 0) / xs.length : null;
    const pct = avg == null ? 0 : Math.round(avg * 100);
    const port = rate("port");
    const dirXs = ["const", "admin", "penal", "proc", "estat"].map(rate).filter(function (x) { return x !== null; });
    const dir = dirXs.length ? Math.round(dirXs.reduce(function (a, b) { return a + b; }, 0) / dirXs.length * 100) : 0;
    const leg = rate("legmun");
    const peso = Math.round(importance(top) * 100);
    const nome = (typeof userName === "function" && userName()) || "Guilherme";
    return (
      '<div class="hero-title"><h1>Desempenho Geral</h1>' +
      '<p class="muted">Overall Performance · Nísia 2026 · semana ' + S.week + "</p></div>" +
      '<div class="dash-hero"><div class="card ring-card"><div class="ring" style="--p:' + pct + '%"><span>' +
      '<div class="muted">Desempenho Geral</div><strong class="kpi huge">' + pct + "%</strong>" +
      '<div class="muted">' + done + "/" + DISC.length + " lançadas</div></span></div></div>" +
      '<div class="stack"><div class="card"><div class="muted">PROGRESSO · SEMANA</div>' +
      '<div class="kpi">' + Math.max(pct, peso) + "% · " + top.pts + ' pts</div>' +
      '<div class="bar"><i style="width:' + Math.min(100, Math.max(pct, 8)) + '%"></i></div></div>' +
      '<div class="card stars"><div><b>0%</b><span class="muted">Peso baixo</span></div>' +
      "<div><b>" + dir + '%</b><span class="muted">Direito</span></div>' +
      "<div><b>" + (port == null ? 0 : Math.round(port * 100)) + '%</b><span class="muted">Português</span></div>' +
      '<div class="onair"><b>' + (liveStatus === "on" ? "on" : "24%") + '</b><span class="muted">Online</span></div></div></div>' +
      '<div class="card copilot"><div class="muted">MÉTODO · SEMANA ' + S.week + "</div>" +
      '<h2>IA Copilot: otimizando seu plano</h2><div class="wave">' + "<i></i>".repeat(18) + "</div>" +
      '<p class="muted">' + nome + ", o que falta, no que pesa.</p></div>" +
      '<div class="card"><div class="muted">GRAU DE DISCIPLINAS</div>' +
      '<div class="disc-line"><span>Português</span><div class="bar cyan"><i style="width:' + (port == null ? 8 : Math.round(port * 100)) + '%"></i></div></div>' +
      '<div class="disc-line"><span>Direito</span><div class="bar blue"><i style="width:' + (dir || 8) + '%"></i></div></div>' +
      '<div class="disc-line"><span>Legislação</span><div class="bar violet"><i style="width:' + (leg == null ? 8 : Math.round(leg * 100)) + '%"></i></div></div></div>' +
      '<div class="card"><div class="muted">COMANDO · SEMANA ' + S.week + "</div>" +
      "<h2>" + nome + ", o que falta, no que pesa.</h2>" +
      '<p class="muted">' + top.sigla + " — " + top.name + ". Importância " + peso + " · " + level(rate(top.id)).label + ".</p>" +
      '<div class="row" style="margin-top:12px"><button class="btn" data-go="edital">Volume do edital</button>' +
      '<button class="btn ghost" data-go="questoes">Questões</button></div></div></div>'
    );
  };
  var who = document.getElementById("whoami");
  if (who) who.textContent = "Planilha Inteligente";
  var prev = window.render;
  if (typeof prev === "function") {
    window.render = function (opts) {
      var out = prev(opts);
      var w = document.getElementById("whoami");
      if (w) w.textContent = "Planilha Inteligente";
      return out;
    };
    try { window.render({ force: true }); } catch (e) {}
  }
})();
