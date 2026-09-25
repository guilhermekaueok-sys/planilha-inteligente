function sheetTotals() {
  const totH = { all: 0 };
  const totQ = { all: 0 };
  DAYS.forEach((d) => { totH[d.id] = 0; totQ[d.id] = 0; });
  if (!S.sheet || !S.sheet.rows) return { totH, totQ };
  S.sheet.rows.forEach((row) => {
    DAYS.forEach((d) => {
      const c = (row.cells && row.cells[d.id]) || {};
      totH[d.id] += Number(c.horas) || 0;
      totQ[d.id] += Number(c.ques) || 0;
    });
  });
  totH.all = DAYS.reduce((a, d) => a + totH[d.id], 0);
  totQ.all = DAYS.reduce((a, d) => a + totQ[d.id], 0);
  return { totH, totQ };
}

function sheetRowHtml(row) {
  if (!row) return "";
  const opts = [{ id: "", sigla: "—" }, { id: "sim", sigla: "Simulado" }, ...DISC];
  const cell = (day) => {
    const c = (row.cells && row.cells[day.id]) || blankCell();
    return `<td>
      <select data-sheet="disc" data-row="${row.id}" data-day="${day.id}">
        ${opts.map((o) => `<option value="${o.id}" ${o.id === c.disc ? "selected" : ""}>${o.sigla}</option>`).join("")}
      </select>
      <div class="sheet-mini">
        <input data-sheet="horas" data-row="${row.id}" data-day="${day.id}" value="${c.horas}" placeholder="h">
        <input data-sheet="ques" data-row="${row.id}" data-day="${day.id}" value="${c.ques}" placeholder="q">
      </div>
    </td>`;
  };
  return `<tr data-row="${row.id}">
    <td><input class="sheet-label" data-sheet="label" data-row="${row.id}" value="${String(row.label || "").replace(/"/g, "")}"></td>
    ${DAYS.map(cell).join("")}
    <td><button class="btn ghost" data-sheet-del="${row.id}">×</button></td>
  </tr>`;
}

function paintSheetTotals() {
  const foot = document.querySelector("#sheetRoot tfoot");
  if (!foot) return;
  const { totH, totQ } = sheetTotals();
  foot.innerHTML = `<tr>
    <th>Total h / q</th>
    ${DAYS.map((d) => `<th>${totH[d.id]}h · ${totQ[d.id]}q</th>`).join("")}
    <th>${totH.all}h · ${totQ.all}q</th>
  </tr>`;
}

function render(opts) {
  if (window.PI && PI._lock) return;
  if (window.PI) PI._lock = true;
  try {
    if (window.PI) PI.hook("beforeRender", page, S);
    paintGate();
    paintTour();
    applyZoom();
    if (!pages[page]) page = "comando";
    const view = $("view");
    const keep = page === "planilha" && view && view.querySelector("#sheetRoot")
      && window.PI && PI.typingIn(view) && !(opts && opts.force);
    if (keep) {
      paintSheetTotals();
    } else if (view) {
      const html = pages[page]();
      view.innerHTML = typeof html === "string" ? html : "";
    }
    document.querySelectorAll("[data-nav]").forEach((b) => {
      b.classList.toggle("on", b.dataset.nav === page);
    });
    const whoami = $("whoami");
    if (whoami) whoami.textContent = "Planilha Inteligente";
    const tn = $("topName");
    const te = $("topEmail");
    if (tn && document.activeElement !== tn) tn.value = S.me.name || "";
    if (te && document.activeElement !== te) te.value = (S.me && S.me.email) || "";
    paintDock();
    if (window.PI) PI.hook("afterRender", page, S);
    if (page === "planilha" && window.PI && PI.sheetBind) {
      PI.sheetBind({
        root: "#sheetRoot",
        rows: function () { return (S.sheet && S.sheet.rows) || []; },
        renderRow: sheetRowHtml
      });
      PI.sheetPaint();
    }
  } catch (_) {
    const view = $("view");
    if (view && !view.querySelector("#sheetRoot")) {
      view.innerHTML = `<div class="card"><p class="kicker">Render</p><p>A sala não montou. Os dados continuam gravados.</p></div>`;
    }
  } finally {
    if (window.PI) PI._lock = false;
  }
}

const pages = {
  comando() {
    const ranked = [...DISC].sort((a, b) => gap(b) - gap(a));
    const top = ranked[0];
    const done = DISC.filter((d) => rate(d.id) !== null).length;
    const avg = (() => {
      const xs = DISC.map((d) => rate(d.id)).filter((x) => x !== null);
      return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
    })();
    const pct = avg == null ? 0 : Math.round(avg * 100);
    const port = rate("port");
    const dirIds = ["const", "admin", "penal", "proc", "estat"];
    const dirXs = dirIds.map(rate).filter((x) => x !== null);
    const dir = dirXs.length ? Math.round(dirXs.reduce((a, b) => a + b, 0) / dirXs.length * 100) : 0;
    const leg = rate("legmun");
    const peso = Math.round(importance(top) * 100);
    return `
      <div class="hero-title">
        <h1>Desempenho Geral</h1>
        <p class="muted">Overall Performance · Nísia 2026 · semana ${S.week}</p>
      </div>
      <div class="dash-hero">
        <div class="card ring-card">
          <div class="ring" style="--p:${pct}%"><span>
            <div class="muted">Desempenho Geral</div>
            <strong class="kpi huge">${pct}%</strong>
            <div class="muted">${done}/${DISC.length} lançadas</div>
          </span></div>
        </div>
        <div class="stack">
          <div class="card">
            <div class="muted">PROGRESSO · SEMANA</div>
            <div class="kpi">${Math.max(pct, peso)}% · ${top.pts} pts</div>
            <div class="bar"><i style="width:${Math.min(100, Math.max(pct, 8))}%"></i></div>
          </div>
          <div class="card stars">
            <div><b>0%</b><span class="muted">Peso baixo</span></div>
            <div><b>${dir}%</b><span class="muted">Direito</span></div>
            <div><b>${port == null ? 0 : Math.round(port * 100)}%</b><span class="muted">Português</span></div>
            <div class="onair"><b>${liveStatus === "on" ? "on" : "24%"}</b><span class="muted">Online</span></div>
          </div>
        </div>
        <div class="card copilot">
          <p class="copilot-lead">Use a IA para facilitar seu manuseio.</p>
          <h2>IA Copilot: otimizando seu plano</h2>
          <div class="wave">${"<i></i>".repeat(18)}</div>
          <button class="voice-btn" id="voiceAsk" type="button">
            <strong>${userName() || "Seu nome"}</strong>
            <span>Peça por comando de voz.</span>
          </button>
        </div>
        <div class="card">
          <div class="muted">GRAU DE DISCIPLINAS</div>
          <div class="disc-line"><span>Português</span><div class="bar cyan"><i style="width:${port == null ? 8 : Math.round(port * 100)}%"></i></div></div>
          <div class="disc-line"><span>Direito</span><div class="bar blue"><i style="width:${dir || 8}%"></i></div></div>
          <div class="disc-line"><span>Legislação</span><div class="bar violet"><i style="width:${leg == null ? 8 : Math.round(leg * 100)}%"></i></div></div>
        </div>
        <div class="card">
          <div class="muted">COMANDO · SEMANA ${S.week}</div>
          <h2>${userName() || "Guilherme"}, o que falta, no que pesa.</h2>
          <p class="muted">${top.sigla} — ${top.name}. Importância ${peso} · ${level(rate(top.id)).label}.</p>
          <div class="row" style="margin-top:12px">
            <button class="btn" data-go="edital">Volume do edital</button>
            <button class="btn ghost" data-go="questoes">Questões</button>
          </div>
        </div>
      </div>
    `;
  },
  radar() {
    return `
      ${cover("radar")}
      <p class="kicker">Radar</p>
      <h1>Desempenho × peso da prova</h1>
      <p class="sub">Barra mint = importância na prova de Nísia Floresta. Texto à direita = seu nível atual.</p>
      ${[...DISC].sort((a,b)=>importance(b)-importance(a)).map((d) => {
        const lv = level(rate(d.id));
        const r = rate(d.id);
        return `<div class="card" style="margin-bottom:8px">
          <div class="row" style="justify-content:space-between">
            <strong>${d.sigla}</strong>
            <span class="${lv.cls}">${lv.label}${r!=null? " · "+Math.round(r*100)+"%":""}</span>
          </div>
          <div class="muted">${d.name} · ${d.pts} pts oficiais · ${d.editais}/9 editais · caiu em ${d.provas}/9 amostras</div>
          <div class="bar"><i style="width:${Math.round(importance(d)*100)}%"></i></div>
        </div>`;
      }).join("")}
    `;
  },
  edital() {
    return `
      ${cover("edital")}
      <p class="kicker">Edital 02/2026</p>
      <h1>O que está no programa e o que já caiu fora.</h1>
      <p class="sub">Amostra: 9 editais recentes de Guarda (Mauá, Tamandaré, Piumhi, Santa Maria de Jetibá, Nísia Floresta, Caldas Novas, Curitiba, Benevides, Santana do Mundaú) + padrão de prefeituras.</p>
      ${TOPICS.sort((a,b)=>b.rec-a.rec).map((t) => {
        const d = DISC.find((x)=>x.id===t.d);
        const st = S.topic[t.id] || "pendente";
        return `<div class="topic">
          <div class="row">
            <span class="chip ${t.rec>=0.9?"alta":t.rec>=0.8?"media":"baixa"}">${t.caiu?"CAIÚ EM PROVA":"SÓ EDITAL"}</span>
            <span class="chip baixa">${d.sigla}</span>
            <select data-topic="${t.id}">
              ${["pendente","andamento","revisar","dominado"].map((s)=>`<option ${s===st?"selected":""}>${s}</option>`).join("")}
            </select>
          </div>
          <p style="margin:8px 0 4px">${t.t}</p>
          <p class="muted">${t.reps}</p>
        </div>`;
      }).join("")}
    `;
  },
  questoes() {
    ensurePlan();
    const day = DAYS.find((d) => d.id === S.day) || DAYS[0];
    const list = discsPlanned(day.id);
    return `
      <p class="kicker">Questões · ${day.label} · semana ${S.week}</p>
      <h1>Só o que caiu neste dia.</h1>
      <p class="sub">As disciplinas vêm do Plano de Estudos. Resolvidas e acertos entram por matéria do dia.</p>
      <div class="row" style="margin-bottom:12px">
        <label class="muted">Dia
          <select id="dayIn">${DAYS.map((d) => `<option value="${d.id}" ${d.id === day.id ? "selected" : ""}>${d.label}</option>`).join("")}</select>
        </label>
        <label class="muted">Semana <input type="number" min="1" max="14" value="${S.week}" id="weekIn" style="width:72px"></label>
        <button class="btn ghost" data-go="ciclo">Editar plano</button>
      </div>
      ${list.length ? list.map((d) => {
        const l = logOf(d.id);
        const lv = level(rate(d.id));
        return `<div class="card" style="margin-bottom:8px">
          <div class="row" style="justify-content:space-between">
            <div><strong>${d.sigla}</strong><div class="muted">${d.name}</div></div>
            <span class="${lv.cls}">${lv.label}</span>
          </div>
          <div class="row" style="margin-top:8px">
            <label class="muted">Resolvidas <input type="number" min="0" value="${l.n}" data-q="${d.id}" style="width:88px"></label>
            <label class="muted">Acertos <input type="number" min="0" value="${l.hits}" data-h="${d.id}" style="width:88px"></label>
          </div>
        </div>`;
      }).join("") : `<div class="card"><p>Nada planejado para ${day.label}. Abra Plano de Estudos e escolha as matérias do dia.</p></div>`}
    `;
  },
  ciclo() {
    ensurePlan();
    const opts = "";
    return `
      <p class="kicker">Plano de Estudos · semana ${S.week}</p>
      <h1>Grade META × CICLO.</h1>
      <p class="sub">CICLO I–VI = Seg a Sáb (3 blocos de 1H). CICLO VII = Simulado. Tudo se preenche na mão: matéria, hora, questões e nota.</p>
      <div class="row" style="margin-bottom:12px">
        <button class="btn ghost" id="wprev">Semana −</button>
        <button class="btn ghost" id="wnext">Semana +</button>
        <button class="btn ${S.planMode === "auto" ? "" : "ghost"}" id="planAuto">Automático</button>
        <button class="btn ${S.planMode === "manual" ? "" : "ghost"}" id="planManual">Manual</button>
        <button class="btn ghost" id="planRotate">Reorganizar agora</button>
      </div>
      <div class="ciclo-wrap">
        ${S.board.map((meta, mi) => `
          <table class="ciclo-grid">
            <thead>
              <tr>
                <th class="meta-h">${meta.label}</th>
                ${CICLOS.map((c) => `<th>${c.label}</th>`).join("")}
              </tr>
            </thead>
            <tbody>
              ${meta.slots.map((slot, si) => `
                <tr>
                  <th>1H</th>
                  ${CICLOS.map((c) => {
                    const cell = slot[c.id] || blankCell();
                    if (c.simulado && si === 0) {
                      return `<td class="sim" rowspan="3">
                        <input data-board="nota" data-meta="${mi}" data-slot="0" data-ciclo="${c.id}" value="${(slot[c.id] && slot[c.id].nota) || "Simulado"}">
                        <select data-board="disc" data-meta="${mi}" data-slot="0" data-ciclo="${c.id}">${discOpts(cell.disc || "sim")}</select>
                        <div class="sheet-mini">
                          <input data-board="horas" data-meta="${mi}" data-slot="0" data-ciclo="${c.id}" value="${cell.horas || "2"}" placeholder="h">
                          <input data-board="ques" data-meta="${mi}" data-slot="0" data-ciclo="${c.id}" value="${cell.ques || ""}" placeholder="q">
                        </div>
                      </td>`;
                    }
                    if (c.simulado) return "";
                    return `<td>
                      <select data-board="disc" data-meta="${mi}" data-slot="${si}" data-ciclo="${c.id}">
                        ${discOpts(cell.disc)}
                      </select>
                      <div class="sheet-mini">
                        <input data-board="horas" data-meta="${mi}" data-slot="${si}" data-ciclo="${c.id}" value="${cell.horas || "1"}" placeholder="h">
                        <input data-board="ques" data-meta="${mi}" data-slot="${si}" data-ciclo="${c.id}" value="${cell.ques || ""}" placeholder="q">
                      </div>
                      <input data-board="nota" data-meta="${mi}" data-slot="${si}" data-ciclo="${c.id}" value="${cell.nota || ""}" placeholder="obs">
                    </td>`;
                  }).join("")}
                </tr>
              `).join("")}
            </tbody>
          </table>
        `).join("")}
      </div>
    `;
  },
  planilha() {
    if (!S.sheet || !S.sheet.rows) S.sheet = emptySheet();
    const { totH, totQ } = sheetTotals();
    return `
      ${cover("ciclo")}
      <p class="kicker">Planilha manual · semana ${S.week}</p>
      <h1>Monte o cronograma na mão.</h1>
      <p class="sub">Mesmo esquema da planilha antiga: bloco na linha, dia na coluna, disciplina + hora + questões na célula. O Ciclo automático não apaga o que você editar aqui.</p>
      <div class="row" style="margin-bottom:12px">
        <button class="btn" id="sheetAdd">Nova linha</button>
        <button class="btn ghost" id="sheetSeed">Preencher pelo peso</button>
        <button class="btn ghost" id="sheetClear">Limpar</button>
        <button class="btn ghost" id="sheetCsv">Baixar CSV</button>
      </div>
      <div class="sheet-wrap" id="sheetRoot">
        <table class="sheet">
          <thead>
            <tr>
              <th>Bloco</th>
              ${DAYS.map((d) => `<th>${d.label}</th>`).join("")}
              <th></th>
            </tr>
          </thead>
          <tbody></tbody>
          <tfoot>
            <tr>
              <th>Total h / q</th>
              ${DAYS.map((d) => `<th>${totH[d.id]}h · ${totQ[d.id]}q</th>`).join("")}
              <th>${totH.all}h · ${totQ.all}q</th>
            </tr>
          </tfoot>
        </table>
      </div>
      <p class="muted" style="margin-top:10px">Célula = disciplina + horas + questões planejadas. CSV abre no Excel e no OneDrive.</p>
    `;
  },
  turma() {
    const me = myStats();
    const list = Object.values(S.friends).sort((a, b) => (b.avg || 0) - (a.avg || 0));
    const board = [me, ...list];
    return `
      ${cover("turma")}
      <p class="kicker">Turma · ${list.length} parceiros · sala ${liveStatus}</p>
      <h1>Quem estuda junto sobe junto.</h1>
      <p class="sub">Abra a mesma sala nos dois aparelhos. Questões, nível e chat passam direto para o app do outro enquanto os dois estiverem com a página aberta.</p>
      <div class="card" style="margin-bottom:12px">
        <div class="muted">MESTRE DESTE CHAT</div>
        <p class="muted">O Grok atualiza o arquivo no seu Drive. Aqui o app puxa sem novo zip. Deixe o arquivo “qualquer um com o link”.</p>
        <input id="masterUrl" value="${(S.masterUrl || "").replace(/"/g, "")}" style="width:100%;margin:8px 0">
        <textarea id="masterPack" class="chatbox" placeholder="Ou cole o pacote VGCFG. que o Grok mandar" style="width:100%"></textarea>
        <div class="row" style="margin-top:8px">
          <button class="btn" id="masterPull">Atualizar do mestre</button>
          <button class="btn ghost" id="masterPaste">Aplicar pacote</button>
        </div>
        <p id="masterMsg" class="muted">${S.mestre && S.mestre.updated ? "Último pacote: " + S.mestre.updated : "Ainda não puxou."}</p>
      </div>
      <div class="card">
        <div class="muted">SALA AO VIVO</div>
        <div class="row" style="margin-top:8px">
          <input id="roomCode" value="${(S.room || "").replace(/"/g, "")}" placeholder="ex.: nisia01" style="flex:1">
          <button class="btn" id="roomJoin">Entrar na sala</button>
        </div>
        <p class="muted" style="margin-top:8px">Estado: ${liveStatus}${S.room ? " · código " + S.room : ""}. Os dois precisam estar online ao mesmo tempo.</p>
      </div>
      <div class="card">
        <div class="muted">SEU PERFIL</div>
        <div class="grid g2" style="margin-top:8px">
          <label class="muted">Nome <input id="meName" value="${(S.me.name || "").replace(/"/g, "")}"></label>
          <label class="muted">@handle <input id="meHandle" value="${(S.me.handle || "").replace(/"/g, "")}"></label>
        </div>
        <p class="muted" style="margin-top:8px">${me.n} questões · acerto ${me.avg == null ? "—" : Math.round(me.avg * 100) + "%"} · semana ${me.week}</p>
        <div class="row" style="margin-top:10px">
          <button class="btn" id="shareSnap">Copiar meu código</button>
          <button class="btn ghost" id="waSnap">Mandar no WhatsApp</button>
        </div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="muted">ENTRAR NA TURMA DO AMIGO</div>
        <textarea id="friendCode" class="chatbox" placeholder="Cole o código VG1.… ou a mensagem toda" style="width:100%;margin-top:8px"></textarea>
        <button class="btn" id="addFriend" style="margin-top:8px">Colar e acompanhar</button>
        <p id="turmaMsg" class="muted"></p>
      </div>
      <h3>Placar da turma</h3>
      ${board.map((p, i) => {
        const pct = p.avg == null ? "—" : Math.round(p.avg * 100) + "%";
        const mine = p.id === me.id;
        return `<div class="card" style="margin-bottom:8px">
          <div class="row" style="justify-content:space-between">
            <strong>${i + 1}. ${p.name} ${mine ? "(você)" : ""}</strong>
            <span class="${p.avg >= 0.85 ? "forte" : p.avg != null && p.avg < 0.7 ? "fraco" : ""}">${pct}</span>
          </div>
          <div class="muted">@${p.handle} · ${p.n || 0} questões · sem. ${p.week || "—"}</div>
          ${!mine ? `<div class="row" style="margin-top:8px"><button class="btn ghost" data-openchat="${p.id}">Abrir chat</button></div>` : ""}
        </div>`;
      }).join("")}
    `;
  },
  chat() {
    const ids = Object.keys(S.friends);
    const withId = S.chatWith && S.friends[S.chatWith] ? S.chatWith : ids[0] || null;
    const pal = withId ? S.friends[withId] : null;
    const thread = (withId && S.chats[withId]) || [];
    return `
      ${cover("chat")}
      <p class="kicker">Chat</p>
      <h1>${pal ? pal.name : "Nenhuma conversa ainda"}</h1>
      <p class="sub">Mensagem fica neste aparelho. Para o amigo ver, copie o envelope e mande no WhatsApp. Ele cola em Chat → Receber.</p>
      ${ids.length ? `<div class="row">${ids.map((id) => `<button class="btn ghost" data-openchat="${id}">${S.friends[id].name}</button>`).join("")}</div>` : `<p class="muted">Adicione alguém em Turma primeiro.</p>`}
      ${pal ? `
        <div class="card" style="margin-top:12px">
          ${thread.map((m) => `<div class="bubble ${m.from}">${m.text}</div>`).join("") || "<p class='muted'>Comece o papo.</p>"}
          <div class="row" style="margin-top:10px">
            <input id="chatIn" class="chatbox" placeholder="Escreve aí">
            <button class="btn" id="chatSend">Enviar</button>
          </div>
          <div class="row" style="margin-top:8px">
            <button class="btn ghost" id="chatExport">Copiar envelope</button>
          </div>
        </div>
        <div class="card" style="margin-top:12px">
          <div class="muted">RECEBER MENSAGEM DO AMIGO</div>
          <textarea id="chatPack" class="chatbox" placeholder="Cole VGCHAT.…" style="width:100%;margin-top:8px"></textarea>
          <button class="btn" id="chatImport" style="margin-top:8px">Receber</button>
          <p id="chatMsg" class="muted"></p>
        </div>
      ` : ""}
    `;
  },
  anki() {
    const n = cards().length;
    return `
      ${cover("anki")}
      <p class="kicker">Anki · ${n} cards do edital</p>
      <h1>Planilha Inteligente e Anki no mesmo ciclo.</h1>
      <p class="sub">Dois caminhos. O arquivo funciona em qualquer Anki. O botão vivo só funciona com o Anki aberto + add-on AnkiConnect (código 2055492159).</p>
      <div class="card">
        <div class="muted">1 · IMPORTAR ARQUIVO (sempre funciona)</div>
        <p>Arquivo → Importar no Anki. Tipo: notas básicas. Campos: Frente, Verso, Tags. Baralho sugerido: <strong>${DECK}</strong>.</p>
        <button class="btn" id="ankiDl">Baixar baralho .txt</button>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="muted">2 · ANKICONNECT (Anki aberto neste PC)</div>
        <p class="muted">Em Anki: Ferramentas → Add-ons → AnkiConnect. Em Config, acrescente a origem desta página em <code>webCorsOriginList</code>.</p>
        <div class="row">
          <button class="btn ghost" id="ankiPing">Testar ligação</button>
          <button class="btn" id="ankiPush">Enviar ${n} cards</button>
        </div>
        <p id="ankiMsg" class="muted" style="margin-top:10px">Ainda não testou.</p>
      </div>
      <h3>O que vai no baralho</h3>
      <p class="muted">Quadro oficial da prova + cada tópico do Anexo V com a nota de recorrência.</p>
      ${cards().slice(0, 8).map(([f]) => `<div class="topic"><p style="margin:0">${f}</p></div>`).join("")}
      <p class="muted">… e mais ${n - 8} cards.</p>
    `;
  },
  sobre() {
    return `
      ${cover("edital")}
      <p class="kicker">Método</p>
      <h1>Como o nível é calculado</h1>
      <p class="sub">Nada aqui substitui o PDF oficial. Os pontos da prova vêm do Edital 02/2026. A recorrência vem de amostra pública de 9 editais de Guarda (2025–2026) e do padrão que se repete em prefeituras.</p>
      <div class="card">
        <p><strong>Importância</strong> = 65% pontos oficiais (em 90) + 25% presença no edital da amostra + 10% “já caiu em prova”.</p>
        <p><strong>Nível</strong> = acertos ÷ questões lançadas. Sem dado = não inventa nota.</p>
        <p><strong>Fila</strong> = importância × (1 − desempenho). Alto peso + acerto baixo sobe.</p>
        <p class="muted">Direito e legislação valem 60 de 90 pontos neste edital. Por isso o radar fatia o bloco de 30 questões em temas que o Anexo V e as provas de GM realmente repetem: art. 144, 13.022, penal da Administração, flagrante, Maria da Penha, município.</p>
      </div>
    `;
  },
};

function rowDisc(d) {
  const lv = level(rate(d.id));
  return `<div class="card" style="margin-bottom:8px">
    <div class="row" style="justify-content:space-between">
      <strong>${d.sigla}</strong>
      <span class="${lv.cls}">${lv.label}</span>
    </div>
    <div class="muted">${d.name} · ${d.pts} pts · prioridade ${gap(d).toFixed(2)}</div>
  </div>`;
}

document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-nav]");
  if (nav) { page = nav.dataset.nav; $("side").classList.remove("open"); render(); }
  const go = e.target.closest("[data-go]");
  if (go) { page = go.dataset.go; render(); }
  if (e.target.id === "menu") $("side").classList.toggle("open");
  const av = e.target.closest("[data-avatar]");
  if (av) {
    S.avatar = av.dataset.avatar;
    save(S, true);
    paintGate();
  }
  if (e.target.id === "gateStart") {
    const name = (($("gateName") && $("gateName").value) || "").trim();
    if (!name) {
      const err = $("gateErr");
      if (err) err.textContent = "Escreve o nome para entrar.";
      return;
    }
    S.me.name = name;
    S.me.handle = S.me.handle || name.replace(/\s+/g, "").slice(0, 16);
    S.entered = true;
    S.tourDone = true;
    S.tourStep = 0;
    save(S);
    render();
  }
  if (e.target.id === "tourNext") {
    S.tourStep += 1;
    if (S.tourStep >= TOUR.length) S.tourDone = true;
    save(S);
    render();
  }
  if (e.target.id === "tourSkip") {
    S.tourDone = true;
    save(S);
    render();
  }
  if (e.target.id === "replayTour") {
    S.tourDone = false;
    S.tourStep = 0;
    $("side").classList.remove("open");
    save(S);
    render();
  }
  const zbtn = e.target.closest("[data-zoom]");
  if (zbtn) {
    S.zoom = (Number(S.zoom) || 1) + (zbtn.dataset.zoom === "+" ? 0.1 : -0.1);
    save(S, true);
    applyZoom();
  }
  if (e.target.id === "wprev") {
    S.week = Math.max(1, S.week - 1);
    if (S.planMode === "auto") rotatePlan();
    save(S); render({ force: true });
  }
  if (e.target.id === "wnext") {
    S.week = Math.min(14, S.week + 1);
    if (S.planMode === "auto") rotatePlan();
    save(S); render({ force: true });
  }
  if (e.target.id === "planAuto") { S.planMode = "auto"; rotatePlan(); render({ force: true }); }
  if (e.target.id === "planManual") { S.planMode = "manual"; save(S); render({ force: true }); }
  if (e.target.id === "planRotate") { rotatePlan(); render({ force: true }); }
  if (e.target.dataset.pickDay) { S.day = e.target.dataset.pickDay; save(S); render(); }
  if (e.target.dataset.planDel) {
    const day = e.target.dataset.planDel;
    const disc = e.target.dataset.disc;
    S.sheet.rows.forEach((row) => {
      if (row.cells[day] && row.cells[day].disc === disc) row.cells[day] = blankCell();
    });
    S.planMode = "manual";
    save(S); render({ force: true });
  }
  if (e.target.id === "sheetAdd") {
    const n = S.sheet.rows.length + 1;
    S.sheet.rows.push({
      id: "r" + Date.now(),
      label: "BLOCO " + n,
      cells: Object.fromEntries(DAYS.map((d) => [d.id, blankCell()])),
    });
    save(S);
    render({ force: true });
  }
  if (e.target.id === "sheetSeed") {
    S.sheet = seedSheetFromCycle();
    save(S);
    render({ force: true });
  }
  if (e.target.id === "sheetClear") {
    S.sheet = emptySheet();
    save(S);
    render({ force: true });
  }
  if (e.target.id === "sheetCsv") {
    const blob = new Blob(["\ufeff" + sheetCsv()], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    const url = URL.createObjectURL(blob);
    a.href = url;
    a.download = "vigilia-planilha-semana-" + S.week + ".csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  if (e.target.dataset.sheetDel) {
    S.sheet.rows = S.sheet.rows.filter((r) => r.id !== e.target.dataset.sheetDel);
    save(S);
    render({ force: true });
  }
  if (e.target.dataset.openchat) {
    S.chatWith = e.target.dataset.openchat;
    page = "chat";
    save(S);
    render();
  }
  if (e.target.id === "masterPull") {
    const msg = $("masterMsg");
    if ($("masterUrl")) { S.masterUrl = $("masterUrl").value.trim(); save(S, true); }
    pullMestre().then(() => { if (msg) msg.textContent = "Mestre aplicado."; }).catch(() => {
      if (msg) msg.textContent = "Não leu o Drive. Libere o link ou cole o pacote VGCFG.";
    });
  }
  if (e.target.id === "masterPaste") {
    const msg = $("masterMsg");
    try {
      const raw = $("masterPack").value.trim();
      const data = raw.startsWith("VGCFG.") ? decodePack(raw.replace(/^VGCFG\./, "VG1.")) : JSON.parse(raw);
      applyMestre(data);
      render();
      if (msg) msg.textContent = "Pacote do chat aplicado.";
    } catch {
      if (msg) msg.textContent = "Pacote inválido.";
    }
  }
  if (e.target.id === "roomJoin") {
    const code = ($("roomCode") && $("roomCode").value) || "";
    joinRoom(code);
    const m = $("turmaMsg");
    if (m) m.textContent = "Sala " + code + " — deixe os dois apps abertos.";
  }
  if (e.target.id === "shareSnap") {
    const t = shareText(myStats());
    navigator.clipboard.writeText(t).then(() => { const m = $("turmaMsg"); if (m) m.textContent = "Código copiado."; }).catch(() => prompt("Copie:", t));
  }
  if (e.target.id === "waSnap") {
    const t = shareText(myStats());
    location.href = "https://wa.me/?text=" + encodeURIComponent(t);
  }
  if (e.target.id === "addFriend") {
    const box = $("friendCode");
    const msg = $("turmaMsg");
    try {
      const raw = (box.value.match(/VG1\.[A-Za-z0-9+/=_-]+/) || [box.value])[0];
      const snap = decodePack(raw);
      if (!snap.id || snap.id === S.me.id) throw new Error("código inválido");
      S.friends[snap.id] = snap;
      save(S);
      msg.textContent = snap.name + " entrou no placar.";
      render();
    } catch {
      msg.textContent = "Não deu para ler o código. Peça um VG1. novo.";
    }
  }
  if (e.target.id === "chatSend" || e.target.id === "dockSend") {
    const pal = S.chatWith || S.me.id;
    const inp = e.target.id === "dockSend" ? $("dockIn") : $("chatIn");
    if (inp && inp.value.trim()) sendPlanChat(inp);
  }
  if (e.target.id === "chatExport") {
    const pal = S.chatWith;
    const last = (S.chats[pal] || []).filter((m) => m.from === "me").slice(-1)[0];
    if (!last) return;
    const pack = "VGCHAT." + encodePack({ to: pal, from: S.me, text: last.text, ts: last.ts }).slice(4);
    navigator.clipboard.writeText(pack).catch(() => prompt("Copie:", pack));
  }
  if (e.target.id === "chatImport") {
    const msg = $("chatMsg");
    try {
      const raw = $("chatPack").value.trim().replace(/^VGCHAT\./, "VG1.");
      const pack = decodePack(raw);
      const fid = pack.from && pack.from.id;
      if (!fid) throw new Error("x");
      if (!S.friends[fid]) S.friends[fid] = { ...pack.from, avg: null, n: 0, week: S.week, discs: [] };
      S.chats[fid] = S.chats[fid] || [];
      S.chats[fid].push({ from: "them", text: pack.text, ts: pack.ts || Date.now() });
      S.chatWith = fid;
      save(S);
      render();
    } catch {
      if (msg) msg.textContent = "Envelope inválido.";
    }
  }
  if (e.target.id === "ankiDl") downloadTsv();
  if (e.target.id === "ankiPing") {
    const msg = $("ankiMsg");
    anki("version").then((v) => { msg.textContent = "AnkiConnect ok · API v" + v; }).catch(() => {
      msg.textContent = "Anki fechado ou AnkiConnect ausente. Abra o Anki neste computador e instale o add-on 2055492159.";
    });
  }
  if (e.target.id === "ankiPush") {
    const msg = $("ankiMsg");
    msg.textContent = "Enviando…";
    (async () => {
      await anki("createDeck", { deck: DECK });
      const notes = cards().map(([Front, Back, tags]) => ({
        deckName: DECK,
        modelName: "Basic",
        fields: { Front, Back },
        tags: ["vigilia", "gcm", ...tags],
        options: { allowDuplicate: false, duplicateScope: "deck" },
      }));
      const ids = await anki("addNotes", { notes });
      const ok = (ids || []).filter(Boolean).length;
      msg.textContent = `${ok} cards novos no baralho ${DECK}. Repetidos foram ignorados.`;
    })().catch((err) => {
      msg.textContent = "Não enviou: " + (err.message || "abra o Anki com AnkiConnect e libere esta origem no CORS.");
    });
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target && e.target.id === "dockIn") {
    e.preventDefault();
    sendPlanChat(e.target);
  }
});
document.addEventListener("input", (e) => {
  captureField(e.target);
  save(S, true);
  if (e.target.dataset && e.target.dataset.sheet) paintSheetTotals();
});
document.addEventListener("change", (e) => {
  captureField(e.target);
  if (e.target.dataset && e.target.dataset.planAdd && e.target.value) {
    const day = e.target.dataset.planAdd;
    const disc = e.target.value;
    let slot = S.sheet.rows.find((r) => !r.cells[day] || !r.cells[day].disc);
    if (!slot) {
      slot = { id: "r" + Date.now(), label: "BLOCO", cells: Object.fromEntries(DAYS.map((d) => [d.id, blankCell()])) };
      S.sheet.rows.push(slot);
    }
    slot.cells[day] = { disc, horas: "1", ques: "20", nota: "" };
    S.planMode = "manual";
    save(S); render({ force: true });
    return;
  }
  save(S, true);
  if (e.target.id === "weekIn") {
    if (S.planMode === "auto") rotatePlan();
    render({ force: true });
  }
  if (e.target.dataset && e.target.dataset.board === "disc") render({ force: true });
  if (e.target.id === "dayIn" || e.target.dataset.q || e.target.dataset.h) render();
});
window.addEventListener("pagehide", flushNow);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") flushNow();
});

if (window.PI) {
  PI.mergePages(pages);
  PI.use("gcm-nisia");
  PI.hook("boot", S);
}
render({ force: true });
readDisk().then((disk) => {
  if (!disk || !disk.raw) {
    save(S, true);
    return;
  }
  let parsed = null;
  try { parsed = JSON.parse(disk.raw); } catch (_) {}
  if (parsed && (parsed.savedAt || 0) > (S.savedAt || 0)) {
    S = { ...defaultState(), ...parsed };
    if (!S.sheet) S.sheet = emptySheet();
    render();
  }
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
