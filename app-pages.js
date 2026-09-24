const pages = {
  comando() {
    return `
      <div class="hero-title">
        <h1>Desempenho Geral</h1>
        <p class="muted">Planilha zerada · ${VERSION} · sem edital anexado</p>
      </div>
      <div class="dash-hero">
        <div class="card ring-card">
          <div class="ring" style="--p:0%"><span>
            <div class="muted">Desempenho Geral</div>
            <strong class="kpi huge">0%</strong>
            <div class="muted">0/0 lançadas</div>
          </span></div>
        </div>
        <div class="stack">
          <div class="card">
            <div class="muted">PROGRESSO · SEMANA</div>
            <div class="kpi">0%</div>
            <div class="bar"><i style="width:8%"></i></div>
          </div>
          <div class="card stars">
            <div><b>0%</b><span class="muted">Peso baixo</span></div>
            <div><b>0%</b><span class="muted">Direito</span></div>
            <div><b>0%</b><span class="muted">Português</span></div>
            <div class="onair"><b>0%</b><span class="muted">Online</span></div>
          </div>
        </div>
        <div class="card copilot">
          <div class="muted">Use a IA para facilitar seu manuseio.</div>
          <h2>IA Copilot: otimizando seu plano</h2>
          <div class="wave">${"<i></i>".repeat(18)}</div>
          <p class="muted">Peça por comando de voz.</p>
        </div>
        <div class="card">
          <div class="muted">GRAU DE DISCIPLINAS</div>
          <div class="disc-line"><span>Português</span><div class="bar cyan"><i style="width:8%"></i></div></div>
          <div class="disc-line"><span>Direito</span><div class="bar blue"><i style="width:8%"></i></div></div>
          <div class="disc-line"><span>Legislação</span><div class="bar violet"><i style="width:8%"></i></div></div>
        </div>
        <div class="card">
          <div class="muted">COMANDO</div>
          <h2>${userName() || "Concurseiro"}, o que falta, no que pesa.</h2>
          <p class="muted">sem dados</p>
        </div>
      </div>`;
  },
  desempenho() { return `<p class="kicker">Desempenho</p><h1>Acerto por disciplina</h1><div class="card"><p class="muted">Nenhuma disciplina lançada.</p></div>`; },
  radar() { return `<p class="kicker">Radar</p><h1>Importância × peso da prova</h1><p class="sub">Anexe um edital para ver o radar.</p>`; },
  ciclo() { return `<p class="kicker">Plano de Estudos</p><h1>Organize a semana.</h1>`; },
  questoes() { return `<p class="kicker">Questões</p><h1>Lance resolvidas e acertos.</h1>`; },
  edital() { return `<p class="kicker">Edital</p><h1>Cole ou anexe o programa.</h1>`; },
  planilha() { return `<p class="kicker">Mural</p><h1>Mural da semana.</h1>`; },
  anki() { return `<p class="kicker">Anki</p><h1>Cards da rotina.</h1>`; },
  turma() { return `<p class="kicker">Turma</p><h1>Sala ao vivo.</h1>`; },
  sobre() { return `<p class="kicker">IA Copilot</p><h2>IA Copilot: otimizando seu plano</h2><div class="wave">${"<i></i>".repeat(18)}</div>`; }
};
