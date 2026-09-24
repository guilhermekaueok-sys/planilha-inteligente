const KEY = "vigilia-gcm-v1";

const DISC = [
  { id: "port", sigla: "Port", name: "Língua Portuguesa", bloco: "comuns", q: 18, pesoOf: 1, pts: 18, editais: 9, provas: 9, n: 9 },
  { id: "rlm", sigla: "RLM", name: "Raciocínio Lógico e Matemática", bloco: "comuns", q: 6, pesoOf: 1, pts: 6, editais: 8, provas: 8, n: 9 },
  { id: "infor", sigla: "Infor", name: "Noções de Informática", bloco: "comuns", q: 6, pesoOf: 1, pts: 6, editais: 8, provas: 7, n: 9 },
  { id: "const", sigla: "Const", name: "Direito Constitucional + art. 144", bloco: "direito", q: 6, pesoOf: 2, pts: 12, editais: 9, provas: 9, n: 9 },
  { id: "admin", sigla: "Admin", name: "Direito Administrativo", bloco: "direito", q: 4, pesoOf: 2, pts: 8, editais: 8, provas: 7, n: 9 },
  { id: "penal", sigla: "Penal", name: "Direito Penal", bloco: "direito", q: 4, pesoOf: 2, pts: 8, editais: 9, provas: 9, n: 9 },
  { id: "proc", sigla: "Proc.", name: "Processo Penal / flagrante", bloco: "direito", q: 3, pesoOf: 2, pts: 6, editais: 7, provas: 7, n: 9 },
  { id: "estat", sigla: "13.022", name: "Estatuto das Guardas (Lei 13.022/2014)", bloco: "direito", q: 4, pesoOf: 2, pts: 8, editais: 7, provas: 8, n: 9 },
  { id: "dh", sigla: "DH", name: "Direitos Humanos e uso da força", bloco: "direito", q: 2, pesoOf: 2, pts: 4, editais: 4, provas: 5, n: 9 },
  { id: "extrav", sigla: "Extrav.", name: "Maria da Penha, ECA, Desarmamento, Abuso, CTB", bloco: "direito", q: 4, pesoOf: 2, pts: 8, editais: 8, provas: 8, n: 9 },
  { id: "legmun", sigla: "Leg. Mun.", name: "LC 048/2025 + Lei Orgânica + Estatuto servidor", bloco: "direito", q: 4, pesoOf: 2, pts: 8, editais: 6, provas: 5, n: 9 },
  { id: "local", sigla: "Nísia", name: "Conhecimentos sobre Nísia Floresta", bloco: "direito", q: 3, pesoOf: 2, pts: 6, editais: 9, provas: 6, n: 9 },
];

const TOPICS = [
  { id: "t1", d: "const", t: "Art. 144 CF — segurança pública e Guardas Municipais", rec: 0.98, caiu: true, reps: "9/9 editais GM; cai em quase toda prova de segurança" },
  { id: "t2", d: "const", t: "Art. 5º — direitos e garantias fundamentais", rec: 0.95, caiu: true, reps: "editais NF, Mauá, Curitiba, Maceió; clássico IDIB" },
  { id: "t3", d: "const", t: "Administração Pública arts. 37–41", rec: 0.82, caiu: true, reps: "repete em prefeituras e GM" },
  { id: "t4", d: "estat", t: "Lei 13.022/2014 arts. 3º, 5º e 6º — princípios e competências", rec: 0.96, caiu: true, reps: "7/9 editais; o tema que mais diferencia GM de PM" },
  { id: "t5", d: "estat", t: "Natureza civil, uniformizada e armada; uso progressivo da força", rec: 0.9, caiu: true, reps: "provas AOCP, IDIB, prefeituras" },
  { id: "t6", d: "penal", t: "Crimes contra a Administração Pública (peculato, concussão, corrupção)", rec: 0.92, caiu: true, reps: "9/9 editais de penal; caiu e repetiu" },
  { id: "t7", d: "penal", t: "Crimes contra a pessoa e o patrimônio", rec: 0.88, caiu: true, reps: "padrão de prova de GM e prefeitura" },
  { id: "t8", d: "penal", t: "Tipicidade, dolo/culpa, excludentes, tentativa", rec: 0.78, caiu: true, reps: "parte geral — IDIB cobra conceito" },
  { id: "t9", d: "proc", t: "Flagrante e limites da atuação da Guarda (não é polícia judiciária)", rec: 0.93, caiu: true, reps: "pega candidato que confunde GM com PC/PM" },
  { id: "t10", d: "proc", t: "Busca, apreensão e medidas protetivas (Maria da Penha no processo)", rec: 0.8, caiu: true, reps: "Maceió, Curitiba, NF" },
  { id: "t11", d: "extrav", t: "Lei Maria da Penha 11.340/2006", rec: 0.9, caiu: true, reps: "edital NF + maioria das GMs" },
  { id: "t12", d: "extrav", t: "ECA — Lei 8.069/1990", rec: 0.84, caiu: true, reps: "repete em prefeituras e segurança" },
  { id: "t13", d: "extrav", t: "Estatuto do Desarmamento 10.826/2003", rec: 0.82, caiu: true, reps: "editais de GM armada" },
  { id: "t14", d: "extrav", t: "Lei de Abuso de Autoridade 13.869/2019", rec: 0.76, caiu: true, reps: "Curitiba e outras GMs; dolo específico" },
  { id: "t15", d: "extrav", t: "CTB aplicável à Guarda Municipal", rec: 0.72, caiu: true, reps: "5/9 editais; forte quando o município fiscaliza trânsito" },
  { id: "t16", d: "dh", t: "Uso diferenciado da força: legalidade, necessidade, proporcionalidade", rec: 0.86, caiu: true, reps: "NF cita DH na atuação da GCM; SENASP" },
  { id: "t17", d: "admin", t: "Poder de polícia e atos administrativos", rec: 0.85, caiu: true, reps: "prefeituras + GM" },
  { id: "t18", d: "admin", t: "Improbidade (8.429/1992 e 14.230/2021) e agentes públicos", rec: 0.8, caiu: true, reps: "cai em prova de prefeitura e específica" },
  { id: "t19", d: "legmun", t: "LC 048/2025 — Guarda Civil Municipal de Nísia Floresta", rec: 0.94, caiu: false, reps: "só este edital; alta chance local" },
  { id: "t20", d: "legmun", t: "Lei Orgânica do Município e Estatuto dos Servidores (Lei 006/2013)", rec: 0.8, caiu: false, reps: "padrão de prova municipal — raramente falta" },
  { id: "t21", d: "local", t: "História, geografia, lagoas, economia e símbolos de Nísia Floresta", rec: 0.88, caiu: false, reps: "todo edital municipal traz município; questões são locais" },
  { id: "t22", d: "port", t: "Interpretação de texto e articulação (pronomes, nexos)", rec: 0.95, caiu: true, reps: "100% dos editais; 18 questões neste" },
  { id: "t23", d: "port", t: "Concordância, regência, crase e ortografia", rec: 0.88, caiu: true, reps: "repete em toda banca de nível médio" },
  { id: "t24", d: "rlm", t: "Proposições, conectivos, equivalência e tabela-verdade", rec: 0.84, caiu: true, reps: "8/9 editais de GM" },
  { id: "t25", d: "rlm", t: "Porcentagem, razão, conjuntos, sequências", rec: 0.8, caiu: true, reps: "IDIB e prefeituras" },
  { id: "t26", d: "infor", t: "Windows, navegador, e-mail, segurança e Office", rec: 0.78, caiu: true, reps: "8/9 editais" },
];

const defaultState = () => ({
  week: 1,
  logs: {},
  topic: {},
  me: {
    id: "vg-" + Math.random().toString(36).slice(2, 8),
    name: "",
    handle: "",
    city: "Natal / Nísia Floresta",
    exam: "GCM Nísia Floresta · IDIB",
  },
  friends: {},
  chats: {},
  chatWith: null,
  room: "",
  masterUrl: "https://drive.google.com/uc?export=download&id=1l1gZ_NRJkFMXUvav8bahQEiTyhLK-kJ1",
  mestre: null,
  entered: false,
  avatar: "lia",
  tourStep: 0,
  tourDone: false,
  zoom: 1,
  sheet: null,
});

function load() {
  try { return { ...defaultState(), ...JSON.parse(localStorage.getItem(KEY) || "{}") }; }
  catch { return defaultState(); }
}
const bus = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("vigilia-gcm") : null;
const live = [];
let peer = null;
let liveStatus = "off";

function save(s, silent) {
  localStorage.setItem(KEY, JSON.stringify(s));
  if (!silent) pump();
}

function pump(extra) {
  const msg = { type: "sync", snap: myStats(), chat: extra && extra.chat, ts: Date.now() };
  if (bus) bus.postMessage(msg);
  live.forEach((c) => {
    try { if (c.open) c.send(msg); } catch (_) {}
  });
}

function applyRemote(msg) {
  if (!msg) return;
  let dirty = false;
  if (msg.snap && msg.snap.id && msg.snap.id !== S.me.id) {
    S.friends[msg.snap.id] = msg.snap;
    dirty = true;
  }
  if (msg.chat && msg.chat.fromId && msg.chat.fromId !== S.me.id) {
    const fid = msg.chat.fromId;
    S.chats[fid] = S.chats[fid] || [];
    if (!S.chats[fid].some((m) => m.ts === msg.chat.ts && m.text === msg.chat.text)) {
      S.chats[fid].push({ from: "them", text: msg.chat.text, ts: msg.chat.ts || Date.now() });
      dirty = true;
    }
    S.chatWith = S.chatWith || fid;
  }
  if (dirty) {
    save(S, true);
    if (page === "chat" || page === "turma" || page === "comando") render();
  }
}

if (bus) bus.onmessage = (e) => applyRemote(e.data);

function roomKey(code) {
  return "vigiliagcm" + String(code || "").toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 10);
}

function wireConn(c) {
  live.push(c);
  c.on("open", () => {
    liveStatus = "on";
    c.send({ type: "sync", snap: myStats() });
    if (page === "turma") render();
  });
  c.on("data", applyRemote);
  c.on("close", () => { liveStatus = live.some((x) => x.open) ? "on" : "off"; });
}

function joinRoom(code) {
  S.room = String(code || "").trim();
  save(S, true);
  if (!S.room) return;
  if (typeof Peer === "undefined") { liveStatus = "sem-peer"; return; }
  try { if (peer) peer.destroy(); } catch (_) {}
  live.length = 0;
  const key = roomKey(S.room);
  liveStatus = "ligando";
  peer = new Peer(key);
  peer.on("open", () => {
    liveStatus = "anfitrião";
    peer.on("connection", wireConn);
    if (page === "turma") render();
  });
  peer.on("error", (err) => {
    if (String(err && err.type) !== "unavailable-id") {
      liveStatus = "erro";
      if (page === "turma") render();
      return;
    }
    peer = new Peer();
    peer.on("open", () => {
      const c = peer.connect(key);
      wireConn(c);
      liveStatus = "on";
      if (page === "turma") render();
    });
    peer.on("connection", wireConn);
  });
}

const DAYS = [
  { id: "seg", label: "Seg" },
  { id: "ter", label: "Ter" },
  { id: "qua", label: "Qua" },
  { id: "qui", label: "Qui" },
  { id: "sex", label: "Sex" },
  { id: "sab", label: "Sáb" },
  { id: "dom", label: "Dom" },
];
function blankCell() { return { disc: "", horas: "", ques: "", nota: "" }; }
function emptySheet() {
  const rows = ["CICLO I", "CICLO II", "CICLO III", "CICLO IV", "CICLO V", "CICLO VI", "CICLO VII · simulado"].map((label, i) => ({
    id: "r" + (i + 1),
    label,
    cells: Object.fromEntries(DAYS.map((d) => [d.id, blankCell()])),
  }));
  return { rows };
}
function seedSheetFromCycle() {
  const bag = [];
  DISC.forEach((d) => {
    const w = Math.max(1, Math.round(importance(d) * 10));
    for (let i = 0; i < w; i++) bag.push(d.id);
  });
  const sheet = emptySheet();
  DAYS.forEach((day, di) => {
    sheet.rows.forEach((row, ri) => {
      if (ri === 6) {
        row.cells[day.id] = { disc: "sim", horas: "2", ques: day.id === "dom" ? "60" : "", nota: "IDIB" };
        return;
      }
      const ticket = ((S.week - 1) * 7 + di * 3 + ri) % bag.length;
      row.cells[day.id] = { disc: bag[ticket], horas: "1", ques: "20", nota: "" };
    });
  });
  return sheet;
}
function sheetCsv() {
  const head = ["Bloco", ...DAYS.map((d) => d.label + " disciplina"), ...DAYS.map((d) => d.label + " horas"), ...DAYS.map((d) => d.label + " ques.")];
  const lines = [head.join(";")];
  S.sheet.rows.forEach((row) => {
    const disc = DAYS.map((d) => {
      const id = row.cells[d.id].disc;
      const found = DISC.find((x) => x.id === id);
      return found ? found.sigla : (id === "sim" ? "Simulado" : id);
    });
    const horas = DAYS.map((d) => row.cells[d.id].horas || "");
    const ques = DAYS.map((d) => row.cells[d.id].ques || "");
    lines.push([row.label, ...disc, ...horas, ...ques].join(";"));
  });
  return lines.join("\n");
}

let S = load();
S.me = { ...defaultState().me, ...(S.me || {}) };
if (!S.friends) S.friends = {};
if (!S.chats) S.chats = {};
if (!S.room) S.room = "";
if (!S.masterUrl) S.masterUrl = defaultState().masterUrl;
if (!S.avatar) S.avatar = "lia";
if (S.zoom == null) S.zoom = 1;
if (!S.sheet) S.sheet = emptySheet();
let page = "comando";
const TOUR = [
  { page: "comando", text: "Aqui é o Comando. A fila sobe o que pesa na prova e ainda está fraco no seu acerto." },
  { page: "radar", text: "No Radar você vê importância × nível. Barra menta = peso. Texto = seu desempenho." },
  { page: "questoes", text: "Em Questões você lança volume e acertos. O nível da disciplina atualiza sozinho." },
  { page: "ciclo", text: "O Ciclo reparte a semana no modo automático, pelo peso da prova." },
  { page: "planilha", text: "A Planilha é o esquema manual. Você monta linha, dia, disciplina, hora e questões — como no Excel." },
  { page: "anki", text: "No Anki você cola cards da IA ou baixa o arquivo. Nada é inventado sem você colar." },
  { page: "turma", text: "Turma é a sala com os amigos. Código VG1 troca desempenho. Chat fica no aparelho." },
];
function applyZoom() {
  const z = Math.min(1.25, Math.max(0.75, Number(S.zoom) || 1));
  S.zoom = z;
  document.documentElement.style.fontSize = (16 * z) + "px";
  const lbl = $("zoomLbl");
  if (lbl) lbl.textContent = Math.round(z * 100) + "%";
}
function avatarSrc() {
  return S.avatar === "nilo" ? "./avatares/nilo.svg" : "./avatares/lia.svg";
}
function guideName() {
  return S.avatar === "nilo" ? "Nilo" : "Lia";
}
function userName() {
  return String((S.me && S.me.name) || "").trim();
}
function say(text) {
  const n = userName();
  return n ? n + ", " + text : text;
}
function paintGate() {
  const gate = $("gate");
  if (!gate) return;
  gate.hidden = !!S.entered;
  const inp = $("gateName");
  if (inp && !inp.value && userName()) inp.value = userName();
  document.querySelectorAll("[data-avatar]").forEach((b) => {
    b.classList.toggle("on", b.dataset.avatar === S.avatar);
  });
}
function paintTour() {
  const box = $("tour");
  if (!box) return;
  box.hidden = true;
}
if (S.room) setTimeout(() => joinRoom(S.room), 400);

function applyMestre(data) {
  if (!data || typeof data !== "object") throw new Error("mestre inválido");
  S.mestre = data;
  save(S, true);
}

async function pullMestre() {
  const url = (S.masterUrl || "").trim();
  if (!url) throw new Error("sem url");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("http " + res.status);
  const data = await res.json();
  applyMestre(data);
  if (page === "comando" || page === "turma" || page === "sobre") render();
  return data;
}

function freq(d) { return d.editais / d.n; }
function importance(d) {
  return (d.pts / 90) * 0.65 + freq(d) * 0.25 + (d.provas / d.n) * 0.1;
}
function logOf(id) {
  const k = `${S.week}-${id}`;
  return S.logs[k] || { n: 0, hits: 0 };
}
function rate(id) {
  const l = logOf(id);
  return l.n ? l.hits / l.n : null;
}
function level(r) {
  if (r === null) return { label: "SEM DADOS", cls: "muted" };
  if (r >= 0.85) return { label: "FORTE", cls: "forte" };
  if (r >= 0.7) return { label: "EM EVOLUÇÃO", cls: "" };
  return { label: "REFORÇAR", cls: "fraco" };
}
function gap(d) {
  const r = rate(d.id);
  const perf = r === null ? 0.4 : r;
  return importance(d) * (1 - perf);
}

function myStats() {
  const xs = DISC.map((d) => {
    const all = Object.entries(S.logs).filter(([k]) => k.endsWith("-" + d.id));
    const n = all.reduce((a, [, v]) => a + (v.n || 0), 0);
    const hits = all.reduce((a, [, v]) => a + (v.hits || 0), 0);
    return { id: d.id, sigla: d.sigla, n, hits, r: n ? hits / n : null };
  });
  const totN = xs.reduce((a, x) => a + x.n, 0);
  const totH = xs.reduce((a, x) => a + x.hits, 0);
  return {
    id: S.me.id,
    name: S.me.name || "Concurseiro",
    handle: S.me.handle || S.me.id,
    city: S.me.city,
    exam: S.me.exam,
    week: S.week,
    n: totN,
    hits: totH,
    avg: totN ? totH / totN : null,
    discs: xs,
    ts: Date.now(),
  };
}

function encodePack(obj) {
  return "VG1." + btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodePack(str) {
  const raw = str.trim().replace(/^VG1\./, "").replace(/-/g, "+").replace(/_/g, "/");
  const pad = raw + "===".slice((raw.length + 3) % 4);
  return JSON.parse(decodeURIComponent(escape(atob(pad))));
}

function shareText(snap) {
  const pct = snap.avg == null ? "sem lançamento" : Math.round(snap.avg * 100) + "%";
  return `${snap.name} (@${snap.handle}) · ${snap.exam}\nSemana ${snap.week} · ${snap.n} questões · acerto ${pct}\n\nCole na Planilha Inteligente → Turma → Colar código:\n${encodePack(snap)}`;
}

const DECK = "Planilha Inteligente::GCM Nísia Floresta";
const ANKI_URL = "http://127.0.0.1:8765";

function cards() {
  return [
    ["Qual o valor total da prova objetiva da GCM Nísia Floresta (Edital 02/2026)?", "60 questões · 90 pontos. Direito e legislação valem peso 2 e sozinhos somam 60 dos 90 pontos.", ["prova"]],
    ["Quantas questões de Língua Portuguesa caem na prova?", "18 questões, peso 1, 18 pontos. Aprovação exige 50% em cada disciplina.", ["port"]],
    ["Quantas questões de Matemática / RLM?", "6 questões, peso 1, 6 pontos.", ["rlm"]],
    ["Quantas questões de Informática?", "6 questões, peso 1, 6 pontos.", ["infor"]],
    ["Quantas questões de Noções de Direito e Legislação?", "30 questões, peso 2, 60 pontos. Metade das questões e 2/3 da nota.", ["direito"]],
    ["Qual o perfil mínimo de aprovação na objetiva?", "50% dos pontos em CADA disciplina. Banca IDIB. Prova 06/12/2026, 4 horas.", ["prova"]],
    ...TOPICS.map((t) => {
      const d = DISC.find((x) => x.id === t.d);
      return [t.t + " — o que revisar?", `${t.reps}<br><br>Disciplina: ${d.name} (${d.pts} pts). ${t.caiu ? "Já caiu em prova de GM/prefeitura." : "Só no edital de NF — peso local."}`, [t.d, t.caiu ? "caiu" : "edital"]];
    }),
  ];
}

async function anki(action, params = {}) {
  const res = await fetch(ANKI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, version: 6, params }),
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.result;
}

function tsvOf() {
  return cards().map(([f, b, tags]) => `${f.replace(/\t/g, " ")}\t${b.replace(/\t/g, " ")}\t${["vigilia", "gcm", ...tags].join(" ")}`).join("\n");
}

function downloadTsv() {
  const blob = new Blob([tsvOf()], { type: "text/tab-separated-values;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "anki-vigilia-gcm.txt";
  a.click();
}

function cover() {
  return "";
}

function $(id) { return document.getElementById(id); }

function render() {
  paintGate();
  paintTour();
  applyZoom();
  if (!pages[page]) page = "comando";
  $("view").innerHTML = pages[page]();
  document.querySelectorAll("[data-nav]").forEach((b) => {
    b.classList.toggle("on", b.dataset.nav === page);
  });
  const whoami = $("whoami");
  if (whoami) whoami.textContent = userName() ? userName() + " · GCM Nísia" : "GCM Nísia Floresta";
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
    return `
      ${cover("comando")}
      <p class="kicker">Comando · semana ${S.week} · Edital 02/2026 · IDIB</p>
      ${S.mestre && S.mestre.notice ? `<div class="card" style="margin-bottom:12px"><div class="muted">DO CHAT GROK</div><p>${S.mestre.notice}</p></div>` : ""}
      <h1>${userName() ? userName() + ", " : ""}${(S.mestre && S.mestre.copy && S.mestre.copy.comandoTitle) || "o que falta, no que pesa."}</h1>
      <p class="sub">Nível = seu acerto. Importância = pontos oficiais da prova (90) + presença em 9 editais recentes de Guarda + se o tema costuma cair de fato.</p>
      <div class="grid g4">
        <div class="card"><div class="muted">Acerto médio</div><div class="kpi">${avg == null ? "—" : Math.round(avg * 100) + "%"}</div></div>
        <div class="card"><div class="muted">Disciplinas lançadas</div><div class="kpi">${done}/${DISC.length}</div></div>
        <div class="card"><div class="muted">Prova</div><div class="kpi">60q · 90 pts</div></div>
        <div class="card"><div class="muted">Direito sozinho</div><div class="kpi">60 pts</div></div>
      </div>
      <div class="card" style="margin-top:12px">
        <div class="muted">PRÓXIMO FOCO</div>
        <h2 style="margin:6px 0 4px">${top.sigla} — ${top.name}</h2>
        <p class="muted">Importância ${Math.round(importance(top)*100)} · nível ${level(rate(top.id)).label} · ${top.editais}/9 editais de GM</p>
        <div class="row" style="margin-top:12px">
          <button class="btn" data-go="radar">Ver radar</button>
          <button class="btn ghost" data-go="questoes">Lançar questões</button>
        </div>
      </div>
      <h3>Fila de estudo (maior buraco primeiro)</h3>
      ${ranked.slice(0, 6).map((d) => rowDisc(d)).join("")}
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
    return `
      ${cover("questoes")}
      <p class="kicker">Questões · semana ${S.week}</p>
      <h1>Lance o volume. O nível fecha sozinho.</h1>
      <div class="row" style="margin-bottom:12px">
        <label class="muted">Semana <input type="number" min="1" max="14" value="${S.week}" id="weekIn" style="width:72px"></label>
      </div>
      ${DISC.map((d) => {
        const l = logOf(d.id);
        const lv = level(rate(d.id));
        return `<div class="card" style="margin-bottom:8px">
          <div class="row" style="justify-content:space-between">
            <div><strong>${d.sigla}</strong><div class="muted">${d.pts} pts · ${d.editais}/9 editais</div></div>
            <span class="${lv.cls}">${lv.label}</span>
          </div>
          <div class="row" style="margin-top:8px">
            <label class="muted">Ques. <input type="number" min="0" value="${l.n}" data-q="${d.id}" style="width:80px"></label>
            <label class="muted">Acertos <input type="number" min="0" value="${l.hits}" data-h="${d.id}" style="width:80px"></label>
          </div>
        </div>`;
      }).join("")}
    `;
  },
  ciclo() {
    const bag = [];
    DISC.forEach((d) => {
      const w = Math.max(1, Math.round(importance(d) * 10));
      for (let i = 0; i < w; i++) bag.push(d);
    });
    const slots = [];
    for (let c = 1; c <= 6; c++) {
      for (let b = 1; b <= 3; b++) {
        const i = (c - 1) * 3 + (b - 1);
        const ticket = ((S.week - 1) * 7 + i) % bag.length;
        slots.push({ c, b, d: bag[ticket] });
      }
    }
    let html = `${cover("ciclo")}<p class="kicker">Ciclo</p><h1>Semana ${S.week} — 18 blocos + simulado</h1>
      <p class="sub">O saco de fichas usa a importância (pontos oficiais × frequência em editais). Semana anda 7 fichas.</p>
      <div class="row"><button class="btn ghost" id="wprev">Anterior</button><button class="btn ghost" id="wnext">Próxima</button></div>`;
    for (let c = 1; c <= 6; c++) {
      html += `<div class="card" style="margin-top:10px"><div class="muted">CICLO ${c}</div><div class="grid g2" style="margin-top:8px">`;
      slots.filter((s) => s.c === c).forEach((s) => {
        html += `<div><strong>${s.d.sigla}</strong><div class="muted">bloco ${s.b} · 1h · ${s.d.pts} pts</div></div>`;
      });
      html += `</div></div>`;
    }
    html += `<div class="card" style="margin-top:10px"><div class="muted">CICLO VII</div><h3>Simulado IDIB</h3><p class="muted">Fecha a semana no padrão 60 questões.</p></div>`;
    return html;
  },
  planilha() {
    if (!S.sheet || !S.sheet.rows) S.sheet = emptySheet();
    const opts = [{ id: "", sigla: "—" }, { id: "sim", sigla: "Simulado" }, ...DISC];
    const totH = { all: 0 };
    const totQ = { all: 0 };
    DAYS.forEach((d) => { totH[d.id] = 0; totQ[d.id] = 0; });
    S.sheet.rows.forEach((row) => {
      DAYS.forEach((d) => {
        totH[d.id] += Number(row.cells[d.id].horas) || 0;
        totQ[d.id] += Number(row.cells[d.id].ques) || 0;
      });
    });
    totH.all = DAYS.reduce((a, d) => a + totH[d.id], 0);
    totQ.all = DAYS.reduce((a, d) => a + totQ[d.id], 0);
    const cell = (row, day) => {
      const c = row.cells[day.id] || blankCell();
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
      <div class="sheet-wrap">
        <table class="sheet">
          <thead>
            <tr>
              <th>Bloco</th>
              ${DAYS.map((d) => `<th>${d.label}</th>`).join("")}
              <th></th>
            </tr>
          </thead>
          <tbody>
            ${S.sheet.rows.map((row) => `<tr>
              <td><input class="sheet-label" data-sheet="label" data-row="${row.id}" value="${row.label.replace(/"/g, "")}"></td>
              ${DAYS.map((d) => cell(row, d)).join("")}
              <td><button class="btn ghost" data-sheet-del="${row.id}">×</button></td>
            </tr>`).join("")}
          </tbody>
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
  if (e.target.id === "wprev") { S.week = Math.max(1, S.week - 1); save(S); render(); }
  if (e.target.id === "wnext") { S.week = Math.min(14, S.week + 1); save(S); render(); }
  if (e.target.id === "sheetAdd") {
    const n = S.sheet.rows.length + 1;
    S.sheet.rows.push({
      id: "r" + Date.now(),
      label: "BLOCO " + n,
      cells: Object.fromEntries(DAYS.map((d) => [d.id, blankCell()])),
    });
    save(S);
    render();
  }
  if (e.target.id === "sheetSeed") {
    S.sheet = seedSheetFromCycle();
    save(S);
    render();
  }
  if (e.target.id === "sheetClear") {
    S.sheet = emptySheet();
    save(S);
    render();
  }
  if (e.target.id === "sheetCsv") {
    const blob = new Blob(["\ufeff" + sheetCsv()], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vigilia-planilha-semana-" + S.week + ".csv";
    a.click();
  }
  if (e.target.dataset.sheetDel) {
    S.sheet.rows = S.sheet.rows.filter((r) => r.id !== e.target.dataset.sheetDel);
    save(S);
    render();
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
  if (e.target.id === "chatSend") {
    const pal = S.chatWith;
    const inp = $("chatIn");
    if (pal && inp && inp.value.trim()) {
      S.chats[pal] = S.chats[pal] || [];
      const text = inp.value.trim();
      const ts = Date.now();
      S.chats[pal].push({ from: "me", text, ts });
      save(S);
      pump({ chat: { fromId: S.me.id, text, ts } });
      render();
    }
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
document.addEventListener("input", (e) => {
  if (e.target.id === "gateName") S.me.name = e.target.value;
});
document.addEventListener("change", (e) => {
  if (e.target.id === "meName") { S.me.name = e.target.value; save(S); }
  if (e.target.id === "gateName") { S.me.name = e.target.value; }
  if (e.target.id === "meHandle") { S.me.handle = e.target.value.replace(/\s/g, ""); save(S); }
  if (e.target.id === "weekIn") { S.week = Math.min(14, Math.max(1, Number(e.target.value) || 1)); save(S); render(); }
  if (e.target.dataset.topic) { S.topic[e.target.dataset.topic] = e.target.value; save(S); }
  if (e.target.dataset.sheet) {
    const row = S.sheet.rows.find((r) => r.id === e.target.dataset.row);
    if (row) {
      if (e.target.dataset.sheet === "label") row.label = e.target.value;
      else {
        row.cells[e.target.dataset.day] = row.cells[e.target.dataset.day] || blankCell();
        row.cells[e.target.dataset.day][e.target.dataset.sheet] = e.target.value;
      }
      save(S, true);
      if (e.target.dataset.sheet !== "label") {
        const foot = document.querySelector(".sheet tfoot");
        if (foot) {
          /* keep typing; totals refresh on next full render */
        }
      }
    }
  }
  if (e.target.dataset.q || e.target.dataset.h) {
    const id = e.target.dataset.q || e.target.dataset.h;
    const k = `${S.week}-${id}`;
    const cur = S.logs[k] || { n: 0, hits: 0 };
    if (e.target.dataset.q) cur.n = Math.max(0, Number(e.target.value) || 0);
    if (e.target.dataset.h) cur.hits = Math.max(0, Number(e.target.value) || 0);
    S.logs[k] = cur;
    save(S);
    render();
  }
});

render();
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
