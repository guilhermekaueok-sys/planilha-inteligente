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
  day: "seg",
  planMode: "auto",
  logs: {},
  topic: {},
  me: {
    id: "vg-" + Math.random().toString(36).slice(2, 8),
    name: "",
    handle: "",
    city: "Natal / Nísia Floresta",
    exam: "GCM Nísia Floresta · IDIB",
    email: "",
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
const DISK = "planilha-inteligente";

function openDisk() {
  if (window.PI && PI.mem.db) return PI.mem.db;
  const p = new Promise((resolve, reject) => {
    const req = indexedDB.open(DISK, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains("kv")) req.result.createObjectStore("kv");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  if (window.PI) PI.mem.db = p;
  return p;
}

function mirrorDisk(raw, savedAt) {
  openDisk().then((db) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put({ raw, savedAt }, "state");
  }).catch(() => {});
}

function readDisk() {
  return openDisk().then((db) => new Promise((resolve) => {
    const g = db.transaction("kv", "readonly").objectStore("kv").get("state");
    g.onsuccess = () => resolve(g.result || null);
    g.onerror = () => resolve(null);
  })).catch(() => null);
}

function commitSave(s) {
  if (window.PI) PI.mem.prune(s);
  s.savedAt = Date.now();
  let raw = "";
  try {
    raw = JSON.stringify(s);
    localStorage.setItem(KEY, raw);
  } catch (_) {}
  if (raw) mirrorDisk(raw, s.savedAt);
}

function save(s, silent) {
  s.savedAt = Date.now();
  if (window.PI) {
    clearTimeout(PI.mem.timer);
    PI.mem.timer = setTimeout(() => commitSave(s), 280);
  } else {
    commitSave(s);
  }
  if (!silent) pump();
}

function captureField(el) {
  if (!el || !S) return;
  if (el.id === "meName" || el.id === "gateName" || el.id === "topName") S.me.name = el.value;
  if (el.id === "topEmail") S.me.email = el.value;
  if (el.id === "meHandle") S.me.handle = String(el.value || "").replace(/\s/g, "");
  if (el.id === "weekIn") S.week = Math.min(14, Math.max(1, Number(el.value) || 1));
  if (el.id === "dayIn") S.day = el.value;
  if (el.dataset && el.dataset.topic) S.topic[el.dataset.topic] = el.value;
  if (el.dataset && el.dataset.sheet && S.sheet) {
    const row = S.sheet.rows.find((r) => r.id === el.dataset.row);
    if (row) {
      if (el.dataset.sheet === "label") row.label = el.value;
      else {
        row.cells[el.dataset.day] = row.cells[el.dataset.day] || blankCell();
        row.cells[el.dataset.day][el.dataset.sheet] = el.value;
      }
    }
  }
  if (el.dataset && el.dataset.board && S.board) {
    const mi = Number(el.dataset.meta);
    const si = Number(el.dataset.slot);
    const cid = el.dataset.ciclo;
    const slot = S.board[mi] && S.board[mi].slots[si];
    if (slot) {
      slot[cid] = slot[cid] || blankCell();
      slot[cid][el.dataset.board] = el.value;
      S.planMode = "manual";
    }
  }
  if (el.dataset && (el.dataset.q || el.dataset.h)) {
    const id = el.dataset.q || el.dataset.h;
    const k = `${S.week}-${id}`;
    const cur = S.logs[k] || { n: 0, hits: 0 };
    if (el.dataset.q) cur.n = Math.max(0, Number(el.value) || 0);
    if (el.dataset.h) cur.hits = Math.max(0, Number(el.value) || 0);
    S.logs[k] = cur;
  }
}

function flushNow() {
  captureField(document.activeElement);
  if (window.PI) clearTimeout(PI.mem.timer);
  commitSave(S);
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
const CICLOS = [
  { id: "i", label: "CICLO I", day: "seg" },
  { id: "ii", label: "CICLO II", day: "ter" },
  { id: "iii", label: "CICLO III", day: "qua" },
  { id: "iv", label: "CICLO IV", day: "qui" },
  { id: "v", label: "CICLO V", day: "sex" },
  { id: "vi", label: "CICLO VI", day: "sab" },
  { id: "vii", label: "CICLO VII", day: "dom", simulado: true },
];
function blankCell() { return { disc: "", horas: "1", ques: "", nota: "" }; }
function emptyBoard() {
  return [1, 2, 3, 4].map((n) => ({
    id: "meta" + n,
    label: "META",
    slots: [0, 1, 2].map(() => Object.fromEntries(CICLOS.map((c) => [c.id, blankCell()]))),
  }));
}
function cicloOfDay(dayId) {
  const found = CICLOS.find((c) => c.day === dayId);
  return found ? found.id : "i";
}
function boardCell(meta, slot, ciclo) {
  const b = S.board && S.board[meta] && S.board[meta].slots[slot];
  return (b && b[ciclo]) || blankCell();
}
function discOpts(sel) {
  return [{ id: "", sigla: "—" }, { id: "sim", sigla: "Simulado" }, ...DISC]
    .map((o) => `<option value="${o.id}" ${o.id === sel ? "selected" : ""}>${o.sigla}</option>`).join("");
}
function todayDayId() {
  return ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][new Date().getDay()];
}
function discsPlanned(dayId) {
  const seen = [];
  const cid = cicloOfDay(dayId);
  const board = S.board || [];
  board.forEach((meta) => {
    (meta.slots || []).forEach((slot) => {
      const id = slot[cid] && slot[cid].disc;
      if (id && id !== "sim" && seen.indexOf(id) === -1) seen.push(id);
    });
  });
  if (!seen.length) {
    const rows = (S.sheet && S.sheet.rows) || [];
    rows.forEach((row) => {
      const id = row.cells && row.cells[dayId] && row.cells[dayId].disc;
      if (id && id !== "sim" && seen.indexOf(id) === -1) seen.push(id);
    });
  }
  return seen.map((id) => DISC.find((d) => d.id === id)).filter(Boolean);
}
function planHasDiscs() {
  return DAYS.some((d) => discsPlanned(d.id).length);
}
function seedBoard() {
  const bag = [];
  DISC.forEach((d) => {
    const w = Math.max(1, Math.round(importance(d) * 10));
    for (let i = 0; i < w; i++) bag.push(d.id);
  });
  const board = emptyBoard();
  board.forEach((meta, mi) => {
    CICLOS.forEach((c, ci) => {
      meta.slots.forEach((slot, si) => {
        if (c.simulado) {
          slot[c.id] = { disc: "sim", horas: "2", ques: si === 0 ? "60" : "", nota: "Simulado" };
          return;
        }
        const ticket = ((S.week - 1) * 21 + mi * 7 + ci * 3 + si) % bag.length;
        slot[c.id] = { disc: bag[ticket], horas: "1", ques: "", nota: "" };
      });
    });
  });
  return board;
}
function ensurePlan() {
  if (!S.sheet || !S.sheet.rows) S.sheet = emptySheet();
  if (!S.board || !S.board.length) S.board = emptyBoard();
}
function rotatePlan() {
  S.board = seedBoard();
  save(S);
}
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
if (!S.day) S.day = todayDayId();
if (!S.planMode) S.planMode = "auto";
if (!S.board || !S.board.length) S.board = emptyBoard();
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
  const url = URL.createObjectURL(blob);
  a.href = url;
  a.download = "anki-vigilia-gcm.txt";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function cover() {
  return "";
}

function $(id) { return document.getElementById(id); }

function paintDock() {
  const log = $("dockLog");
  if (!log) return;
  const pal = S.chatWith;
  const thread = (pal && S.chats[pal]) || [];
  const fallback = thread.length ? thread.slice(-16) : [{ from: "them", text: "Chat ligado à planilha. Ex.: segunda port infor rlm · q port 20 15 · ajuda" }];
  log.innerHTML = fallback.map((m) => `<div class="dock-msg ${m.from}">${m.text}</div>`).join("");
  log.scrollTop = log.scrollHeight;
}
function foldTxt(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function resolveDiscToken(token) {
  const t = foldTxt(token).replace(/[^a-z0-9.]+/g, "");
  if (!t) return null;
  if (/^simu?l?a?d?o?$/.test(t) || t === "sim") return "sim";
  const hit = DISC.find((d) => {
    const id = foldTxt(d.id);
    const sg = foldTxt(d.sigla).replace(/[^a-z0-9]+/g, "");
    const nm = foldTxt(d.name);
    return t === id || t === sg || nm.indexOf(t) !== -1 || t.indexOf(sg) !== -1 || t.indexOf(id) !== -1;
  });
  return hit ? hit.id : null;
}
function resolveDayToken(token) {
  const t = foldTxt(token);
  const map = {
    seg: ["seg", "segunda", "2a"],
    ter: ["ter", "terca", "3a"],
    qua: ["qua", "quarta", "4a"],
    qui: ["qui", "quinta", "5a"],
    sex: ["sex", "sexta", "6a"],
    sab: ["sab", "sabado"],
    dom: ["dom", "domingo"],
  };
  return Object.keys(map).find((k) => map[k].indexOf(t) !== -1) || null;
}
function resolveCicloToken(token) {
  const t = foldTxt(token).replace("ciclo", "").trim();
  const map = { "1": "i", i: "i", "2": "ii", ii: "ii", "3": "iii", iii: "iii", "4": "iv", iv: "iv", "5": "v", v: "v", "6": "vi", vi: "vi", "7": "vii", vii: "vii" };
  return map[t] || null;
}
function setBoardSlot(meta, slot, ciclo, patch) {
  ensurePlan();
  if (!S.board[meta] || !S.board[meta].slots[slot]) return;
  S.board[meta].slots[slot][ciclo] = Object.assign(blankCell(), S.board[meta].slots[slot][ciclo] || {}, patch);
}
function applyChatPlan(raw) {
  const text = String(raw || "").trim();
  const t = foldTxt(text);
  if (!t) return null;
  if (/^(ajuda|help|\?|comandos)$/.test(t)) {
    return "Comandos: segunda port infor rlm · meta 2 ciclo 3 slot 1 penal · q port 20 15 · semana 2 · automatico · manual · reorganizar";
  }
  if (/reorganiz/.test(t)) {
    rotatePlan();
    S.planMode = "auto";
    return "Grade reorganizada pelo peso.";
  }
  if (/automatico/.test(t)) { S.planMode = "auto"; return "Modo automático."; }
  if (/^manual$/.test(t)) { S.planMode = "manual"; return "Modo manual. A grade não gira sozinha."; }
  const week = t.match(/semana\s+(\d+)/);
  if (week) {
    S.week = Math.min(14, Math.max(1, Number(week[1]) || 1));
    if (S.planMode === "auto") rotatePlan();
    return "Semana " + S.week + ".";
  }
  const q = t.match(/^(?:q|quest(?:ao|oes)?)\s+(\S+)\s+(\d+)(?:\s+(\d+))?/);
  if (q) {
    const id = resolveDiscToken(q[1]);
    if (!id || id === "sim") return "Não achei essa disciplina.";
    const n = Number(q[2]) || 0;
    const hits = q[3] != null ? Number(q[3]) : (S.logs[S.week + "-" + id] || {}).hits || 0;
    S.logs[S.week + "-" + id] = { n, hits: Math.min(n, hits) };
    return DISC.find((d) => d.id === id).sigla + ": " + n + " resolvidas, " + Math.min(n, hits) + " acertos.";
  }
  const slotCmd = t.match(/^(?:meta\s+(\d+)\s+)?ciclo\s+(\d+|i{1,3}v?)\s+(?:slot|bloco|linha|1h)?\s*(\d+)\s+(.+)$/);
  if (slotCmd) {
    const meta = Math.max(0, Math.min(3, (Number(slotCmd[1]) || 1) - 1));
    const ciclo = resolveCicloToken(slotCmd[2]);
    const slot = Math.max(0, Math.min(2, (Number(slotCmd[3]) || 1) - 1));
    const id = resolveDiscToken(slotCmd[4].split(/\s+/)[0]);
    if (!ciclo || !id) return "Não entendi ciclo/matéria.";
    setBoardSlot(meta, slot, ciclo, { disc: id });
    S.planMode = "manual";
    const d = DISC.find((x) => x.id === id);
    return "META " + (meta + 1) + " · " + ciclo.toUpperCase() + " · 1H " + (slot + 1) + " = " + (d ? d.sigla : id);
  }
  const parts = text.split(/[,\s;+/]+/).filter(Boolean);
  const day = resolveDayToken(parts[0]);
  if (day && parts.length > 1) {
    const cid = cicloOfDay(day);
    const ids = parts.slice(1).map(resolveDiscToken).filter(Boolean).slice(0, 3);
    if (!ids.length) return "Não achei as matérias desse dia.";
    ids.forEach((id, i) => setBoardSlot(0, i, cid, { disc: id }));
    S.day = day;
    S.planMode = "manual";
    page = "ciclo";
    return DAYS.find((d) => d.id === day).label + ": " + ids.map((id) => (id === "sim" ? "Simulado" : DISC.find((d) => d.id === id).sigla)).join(", ");
  }
  return null;
}
function sendPlanChat(inp) {
  if (!inp || !inp.value.trim()) return;
  const pal = S.chatWith || S.me.id;
  S.chats[pal] = S.chats[pal] || [];
  const text = inp.value.trim();
  const ts = Date.now();
  S.chats[pal].push({ from: "me", text, ts });
  S.chatWith = pal;
  inp.value = "";
  const reply = applyChatPlan(text);
  if (reply) {
    S.chats[pal].push({ from: "them", text: reply, ts: ts + 1 });
    save(S);
    render({ force: true });
  } else {
    save(S);
    pump({ chat: { fromId: S.me.id, text, ts } });
    paintDock();
    if (page === "chat") render();
  }
}

