const KEY = "pi-sheet-v8";

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
  planMode: "manual",
  logs: {},
  topic: {},
  userTopics: [],
  editalDiscs: [],
  simLogs: [],
  editalLido: null,
  me: {
    id: "vg-" + Math.random().toString(36).slice(2, 8),
    name: "",
    handle: "",
    city: "",
    exam: "",
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
  viewMode: "barras",
  sheet: null,
});

function blankStudy(s) {
  if (!s || s.blanked === "v8") return s;
  s.logs = {};
  s.topic = {};
  s.userTopics = [];
  s.editalDiscs = [];
  s.simLogs = [];
  s.editalLido = null;
  s.board = null;
  s.sheet = null;
  s.week = 1;
  s.planMode = "manual";
  s.atlasLog = [];
  s.mestre = null;
  s.masterUrl = "";
  if (s.me) { s.me.exam = ""; s.me.city = ""; }
  s.blanked = "v8";
  return s;
}
function purgeOldEdital(s) {
  if (!s) return s;
  const bad = /juiz de fora/i;
  const blob = JSON.stringify({ a: s.editalLido || null, b: s.editalDiscs || [], c: s.userTopics || [], d: s.me && s.me.exam });
  if (bad.test(blob)) {
    s.editalLido = null;
    s.editalDiscs = [];
    s.userTopics = [];
    if (s.me) s.me.exam = "";
  }
  if (!Array.isArray(s.editalDiscs)) s.editalDiscs = [];
  var topics = Array.isArray(s.userTopics) ? s.userTopics : [];
  if (topics.length) {
    var badRe = /inscri|deferiment|comprovante|disposi|vagas reserv|avalia|r\$|taxa|cento e|eliminat/i;
    var badCount = topics.filter(function (t) { return badRe.test((t.disc || "") + " " + (t.t || "")); }).length;
    if (badCount >= Math.ceil(topics.length * 0.5)) {
      s.userTopics = [];
      s.editalDiscs = [];
      if (s.editalLido) s.editalLido.taxa = "";
    }
  }
  return s;
}
function load() {
  try { return purgeOldEdital(blankStudy({ ...defaultState(), ...JSON.parse(localStorage.getItem(KEY) || "{}") })); }
  catch { return purgeOldEdital(blankStudy(defaultState())); }
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

function diskKey() {
  if (S && S.entered && S.me && S.me.id) return "state-" + S.me.id;
  return "state";
}

function mirrorDisk(raw, savedAt) {
  openDisk().then((db) => {
    const tx = db.transaction("kv", "readwrite");
    tx.objectStore("kv").put({ raw, savedAt }, diskKey());
  }).catch(() => {});
}

function readDisk() {
  return openDisk().then((db) => new Promise((resolve) => {
    const g = db.transaction("kv", "readonly").objectStore("kv").get(diskKey());
    g.onsuccess = () => resolve(g.result || null);
    g.onerror = () => resolve(null);
  })).catch(() => null);
}

function stateBucket() {
  if (S && S.entered && S.me && S.me.id) return "pi-state-v7-" + S.me.id;
  return KEY;
}

function commitSave(s) {
  if (window.PI) PI.mem.prune(s);
  s.savedAt = Date.now();
  let raw = "";
  try {
    raw = JSON.stringify(s);
    localStorage.setItem(stateBucket(), raw);
  } catch (_) {}
  if (raw) mirrorDisk(raw, s.savedAt);
  if (window.PISession && PISession.pushState) PISession.pushState(s);
}

function sendBackup() {
  commitSave(S);
  const payload = {
    kind: "pi-backup",
    url: location.href,
    savedAt: S.savedAt,
    state: S,
  };
  const raw = JSON.stringify(payload);
  const stamp = new Date().toISOString().slice(0, 10);
  const name = "planilha-backup-" + stamp + ".json";
  const blob = new Blob([raw], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  const mail = ((S.me && S.me.email) || "").trim();
  const lbl = $("fileLbl");
  const head = "Endereço da plataforma: " + location.href + "\n\nEstado no momento do backup:\n";
  const body = head + raw;
  if (!mail) {
    if (lbl) lbl.textContent = "Backup baixado. Preencha o e-mail para enviar.";
    return;
  }
  const use = body.length < 1500 ? body : head + "Arquivo " + name + " (anexe o arquivo que acabou de baixar).";
  location.href = "mailto:" + encodeURIComponent(mail) + "?subject=" + encodeURIComponent("Backup de segurança · Planilha Inteligente") + "&body=" + encodeURIComponent(use);
  if (lbl) lbl.textContent = body.length < 1500 ? "E-mail de backup aberto" : "E-mail aberto. Anexe o arquivo baixado.";
}

function restoreBackup(text, fileName) {
  let data = null;
  try { data = JSON.parse(text); } catch (_) {}
  const state = data && data.kind === "pi-backup" && data.state;
  const lbl = $("fileLbl");
  if (!state || typeof state !== "object") {
    if (lbl) lbl.textContent = fileName || "Nenhum arquivo selecionado";
    return;
  }
  S = Object.assign(defaultState(), state);
  commitSave(S);
  render({ force: true });
  if (lbl) lbl.textContent = "Backup restaurado";
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
  if (el.id === "topEmail" || el.id === "userMail") S.me.email = el.value;
  if (el.id === "userName") S.me.name = el.value;
  if (el.id === "userPhone") S.me.phone = el.value;
  if (el.id === "userExam") S.me.exam = el.value;
  if (el.id === "userAbout") S.me.about = el.value;
  if (el.id === "userFoco") S.me.foco = el.value;
  if (el.id === "userMetaQ") S.me.metaQ = Math.max(0, Number(el.value) || 0);
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
  if (typeof Peer === "undefined") {
    if (window.PI_PEER) {
      liveStatus = "ligando";
      PI_PEER().then(function () { joinRoom(S.room); }).catch(function () { liveStatus = "sem-peer"; });
    } else liveStatus = "sem-peer";
    return;
  }
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
function editalDiscs() {
  return Array.isArray(S && S.editalDiscs) ? S.editalDiscs : [];
}
function discOpts(sel) {
  return [{ id: "", sigla: "—" }, { id: "sim", sigla: "Simulado" }, ...editalDiscs()]
    .map((o) => `<option value="${o.id}" ${o.id === sel ? "selected" : ""}>${o.sigla}</option>`).join("");
}
const DAYHEAD = { i: "SEGUNDA", ii: "TERÇA", iii: "QUARTA", iv: "QUINTA", v: "SEXTA", vi: "SÁBADO", vii: "DOMINGO" };
function modoBtns(cell, mi, si, cid) {
  const cur = cell.modo || "";
  return `<div class="modo-row">${[["teoria", "Teoria"], ["questao", "Questão"], ["ambos", "Teoria e questões"]].map(([id, lab]) =>
    `<button type="button" class="modo-btn${cur === id ? " on" : ""}" data-modo="${id}" data-meta="${mi}" data-slot="${si}" data-ciclo="${cid}">${lab}</button>`
  ).join("")}</div>`;
}
function feitoBtns(cell, mi, si, cid) {
  const f = cell.feito || "";
  return `<div class="feito-row">
    <button type="button" class="feito-btn ok${f === "ok" ? " on" : ""}" data-feito="ok" data-meta="${mi}" data-slot="${si}" data-ciclo="${cid}">Estudou</button>
    <button type="button" class="feito-btn no${f === "no" ? " on" : ""}" data-feito="no" data-meta="${mi}" data-slot="${si}" data-ciclo="${cid}">Não estudou</button>
  </div>`;
}
function weekQuestionScore() {
  let n = 0;
  let hits = 0;
  const prefix = String(S.week) + "-";
  Object.keys(S.logs || {}).forEach((k) => {
    if (k.indexOf(prefix) !== 0) return;
    n += Number(S.logs[k].n) || 0;
    hits += Number(S.logs[k].hits) || 0;
  });
  const goal = Math.max(0, Number(S.me && S.me.metaQ) || 0);
  const acc = n ? hits / n : 0;
  const pace = goal ? Math.min(1, n / goal) : 0;
  const score = !n ? 0 : Math.round(((acc + (goal ? pace : acc)) / (goal ? 2 : 1)) * 100);
  return { n, hits, goal, score };
}
function simuladoScore() {
  const logs = Array.isArray(S.simLogs) ? S.simLogs : [];
  let pts = 0;
  let tot = 0;
  logs.forEach((r) => { pts += Number(r.pontos) || 0; tot += Number(r.total) || 0; });
  return { n: logs.length, pts, tot, score: tot ? Math.round((pts / tot) * 100) : 0 };
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
  return seen.map((id) => editalDiscs().find((d) => d.id === id)).filter(Boolean);
}
function planHasDiscs() {
  return DAYS.some((d) => discsPlanned(d.id).length);
}
function seedBoard() {
  const bag = [];
  editalDiscs().forEach((d) => {
    const w = Math.max(1, Math.round(importance(d) * 10));
    for (let i = 0; i < w; i++) bag.push(d.id);
  });
  if (!bag.length) return emptyBoard();
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
  if (!Array.isArray(S.userTopics) || !S.userTopics.length) {
    S.board = emptyBoard();
    save(S);
    return;
  }
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
  editalDiscs().forEach((d) => {
    const w = Math.max(1, Math.round(importance(d) * 10));
    for (let i = 0; i < w; i++) bag.push(d.id);
  });
  if (!bag.length) return emptySheet();
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
      const found = editalDiscs().find((x) => x.id === id);
      return found ? found.sigla : (id === "sim" ? "Simulado" : id);
    });
    const horas = DAYS.map((d) => row.cells[d.id].horas || "");
    const ques = DAYS.map((d) => row.cells[d.id].ques || "");
    lines.push([row.label, ...disc, ...horas, ...ques].join(";"));
  });
  return lines.join("\n");
}

var S = load();
S.me = { ...defaultState().me, ...(S.me || {}) };
if (!S.friends) S.friends = {};
if (!S.chats) S.chats = {};
if (!S.room) S.room = "";
if (!S.masterUrl) S.masterUrl = defaultState().masterUrl;
if (!S.avatar) S.avatar = "lia";
if (S.zoom == null) S.zoom = 1;
if (S.viewMode !== "blocos") S.viewMode = "barras";
if (!S.sheet) S.sheet = emptySheet();
if (!S.day) S.day = todayDayId();
if (!S.planMode) S.planMode = "auto";
if (!S.board || !S.board.length) S.board = emptyBoard();
let page = "comando";
let iaTicket = 0;
function iaText(s) {
  var amp = String.fromCharCode(38);
  return String(s || "").replace(new RegExp(amp, "g"), amp + "amp;").replace(/</g, amp + "lt;").replace(/>/g, amp + "gt;").replace(/"/g, amp + "quot;");
}
function openIaModal() {
  const overlay = $("iaOverlay");
  const body = $("iaModalBody");
  if (!overlay || !body) return;
  body.innerHTML = `<div class="ia-wait"><i class="ia-spin"></i><span>As IAs estão cruzando a resposta.</span><div class="ia-skel"></div><div class="ia-skel short"></div></div>`;
  overlay.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("show")));
}
function fillIaModal(pack) {
  const body = $("iaModalBody");
  if (!body) return;
  const votes = pack.votes && pack.votes.length ? "Consenso de " + pack.votes.join(", ") + "." : "Sem resposta das IAs nesta rodada.";
  const precision = Math.max(0, Math.min(100, Math.round(Number(pack.precision) || 0)));
  body.innerHTML = `<p class="ia-precision">Precisão ${precision}%.</p><p class="ia-say">${iaText(pack.say || "")}</p><p class="muted">${iaText(votes)}</p>`;
}
function closeIaModal() {
  const overlay = $("iaOverlay");
  if (!overlay) return;
  iaTicket += 1;
  overlay.classList.remove("show");
  setTimeout(() => { if (!overlay.classList.contains("show")) overlay.hidden = true; }, 380);
}
function openMetric(id) {
  const overlay = $("metricOverlay");
  const body = $("metricBody");
  const title = $("metricTitle");
  if (!overlay || !body) return;
  const note = metricNote(id);
  if (title) title.textContent = note.title;
  body.innerHTML = `<p class="ia-precision">${note.pct}%</p><p class="ia-say">${iaText(note.formula)}</p><p>${iaText(note.raw)}</p><p class="muted">Última atualização: ${iaText(note.when)}</p>`;
  overlay.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add("show")));
}
function closeMetric() {
  const overlay = $("metricOverlay");
  if (!overlay) return;
  overlay.classList.remove("show");
  setTimeout(() => { if (!overlay.classList.contains("show")) overlay.hidden = true; }, 320);
}
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
function applyView() {
  const mode = S.viewMode === "blocos" ? "blocos" : "barras";
  S.viewMode = mode;
  document.body.classList.toggle("view-blocos", mode === "blocos");
  document.body.classList.toggle("view-barras", mode !== "blocos");
  document.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === mode));
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
  const ok = !!(S.entered && S.me && S.me.email);
  gate.hidden = ok;
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
function metricState() {
  const pulse = window.ATLAS ? ATLAS.pulse() : { geral: 0, qScore: 0, hScore: 0, dScore: 0, q: { n: 0, hits: 0 }, hoursPlan: 0, hoursDone: 0, planned: 0, studied: 0, missed: 0 };
  const sumLogs = (ids) => ids.reduce((a, id) => {
    const l = logOf(id);
    a.n += l.n;
    a.hits += l.hits;
    return a;
  }, { n: 0, hits: 0 });
  const lowIds = DISC.filter((d) => d.pesoOf === 1).map((d) => d.id);
  const low = sumLogs(lowIds);
  const dir = sumLogs(["const", "admin", "penal", "proc", "estat"]);
  const port = logOf("port");
  const leg = logOf("legmun");
  const pctOf = (hits, n) => (n ? Math.round((hits / n) * 100) : 0);
  const list = Array.isArray(S.userTopics) ? S.userTopics : [];
  const w = { dominado: 1, revisar: 0.75, andamento: 0.45, pendente: 0 };
  const sum = list.reduce((a, t) => a + (w[(S.topic && S.topic[t.id]) || "pendente"] || 0), 0);
  const editalDone = list.filter((t) => S.topic && S.topic[t.id] && S.topic[t.id] !== "pendente").length;
  const edital = { pct: list.length ? Math.round((sum / list.length) * 100) : 0, done: editalDone, n: list.length };
  const active = !!(pulse.q.n || pulse.hoursDone || pulse.studied || editalDone || low.n || dir.n || port.n || leg.n);
  const when = active && S.savedAt ? new Date(S.savedAt).toLocaleString("pt-BR") : "Sem dados registrados";
  return {
    pulse,
    week: pulse.geral,
    low: pctOf(low.hits, low.n),
    lowN: low.n,
    lowHits: low.hits,
    dir: pctOf(dir.hits, dir.n),
    dirN: dir.n,
    dirHits: dir.hits,
    port: pctOf(port.hits, port.n),
    portN: port.n,
    portHits: port.hits,
    leg: pctOf(leg.hits, leg.n),
    legN: leg.n,
    legHits: leg.hits,
    edital,
    online: 0,
    when,
  };
}
function metricNote(id) {
  const m = metricState();
  const p = m.pulse;
  const q = p.q || { n: 0, hits: 0 };
  const map = {
    geral: ["Desempenho Geral", "Média ponderada da semana: acertos 50%, horas cumpridas 30% e disciplinas estudadas 20%. O que não tem registro fica de fora. O peso do edital não entra.", q.hits + " acertos em " + q.n + " questões. " + p.hoursDone + "h de " + p.hoursPlan + "h. " + p.studied + " disciplinas estudadas de " + p.planned + ".", m.week],
    semana: ["Progresso da semana", "Acertos da semana pesam 50%, horas marcadas como estudadas pesam 30% e disciplinas concluídas pesam 20%. Sem registro, o resultado é 0%.", q.hits + " acertos em " + q.n + " questões nesta semana.", m.week],
    questoes: ["Questões", "Acertos ÷ questões resolvidas na semana.", q.hits + " acertos em " + q.n + " resolvidas nesta semana.", p.qScore],
    disciplinas: ["Disciplinas", "Disciplinas marcadas como estudadas ÷ disciplinas previstas na meta da semana.", p.studied + " estudadas de " + p.planned + " previstas. " + p.missed + " não estudadas.", p.planned ? p.dScore : 0],
    horas: ["Horas", "Horas marcadas como batidas ÷ horas previstas na semana.", p.hoursDone + "h batidas de " + p.hoursPlan + "h previstas.", p.hoursPlan ? p.hScore : 0],
    editais: ["Editais", "Assuntos trabalhados no edital verticalizado, com peso menor para os que estão em andamento.", m.edital.done + " de " + m.edital.n + " assuntos trabalhados.", m.edital.pct],
    baixo: ["Peso baixo", "Acertos ÷ questões de Português, Raciocínio Lógico e Informática.", m.lowHits + " acertos em " + m.lowN + " questões de peso baixo.", m.low],
    direito: ["Direito", "Acertos ÷ questões de Constitucional, Administrativo, Penal, Processo Penal e Estatuto das Guardas.", m.dirHits + " acertos em " + m.dirN + " questões de Direito.", m.dir],
    port: ["Português", "Acertos ÷ questões de Língua Portuguesa na semana.", m.portHits + " acertos em " + m.portN + " questões.", m.port],
    online: ["Online", "Não há taxa inventada de presença. O 24% antigo era valor fixo e foi retirado.", "0 sessões de estudo online contabilizadas.", 0],
    portbar: ["Português", "Acertos ÷ questões de Língua Portuguesa na semana.", m.portHits + " acertos em " + m.portN + " questões.", m.port],
    dirbar: ["Direito", "Acertos ÷ questões do bloco de Direito na semana.", m.dirHits + " acertos em " + m.dirN + " questões.", m.dir],
    legbar: ["Legislação", "Acertos ÷ questões de legislação municipal na semana.", m.legHits + " acertos em " + m.legN + " questões.", m.leg],
  };
  const row = map[id] || map.geral;
  return { title: row[0], formula: row[1], raw: row[2], pct: row[3], when: m.when };
}
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
  const topics = Array.isArray(S.userTopics) ? S.userTopics : [];
  return topics.map((t) => [t.t, "Disciplina: " + (t.disc || "assunto"), [t.d || "edital"]]);
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
  if (window.PIRoom) {
    PIRoom.paint(log);
    return;
  }
  const pal = S.chatWith;
  const thread = (pal && S.chats[pal]) || [];
  const fallback = thread.length ? thread.slice(-16) : [{ from: "them", text: "Chat ligado à planilha. Ex.: segunda port infor rlm · q port 20 15 · ajuda" }];
  const sig = "local:" + fallback.map((m) => (m.ts || "") + "|" + (m.text || "")).join("\n");
  if (log.dataset.sig === sig) return;
  log.dataset.sig = sig;
  log.innerHTML = fallback.map((m) => `<div class="dock-msg ${m.from}">${m.text}</div>`).join("");
  log.scrollTop = log.scrollHeight;
}
function foldName(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, " ").trim();
}
function discIdOf(name) {
  return foldName(name).replace(/[^a-z0-9]+/g, "").slice(0, 24) || "disc";
}
function discSigla(name) {
  const stop = { das: 1, dos: 1, de: 1, da: 1, do: 1, e: 1, para: 1, com: 1, em: 1, no: 1, na: 1 };
  const parts = String(name || "").split(/\s+/).filter((w) => w.length > 2 && !stop[foldName(w)]);
  if (!parts.length) return "DISC";
  if (parts.length === 1) return parts[0].slice(0, 10);
  return parts.slice(0, 3).map((w) => w[0]).join("").toUpperCase();
}
function parseEditalText(raw) {
  const text = String(raw || "").replace(/\r/g, "");
  const flat = text.replace(/\s+/g, " ");
  const cargoM = flat.match(/(?:para o cargo de|cargo pretendido|denomina[cç][aã]o do cargo)\s*[:\-]?\s*([A-Za-zÀ-ú][^.]{3,70})/i)
    || flat.match(/\bcargo\s*[:\-]\s*([A-Za-zÀ-ú][^.]{3,70})/i);
  let cargo = cargoM ? cargoM[1].trim() : "";
  cargo = cargo.split(/\s+(?:,|taxa\b|banca\b|prova\b|remunera|inscri|per[ií]odo|r\$)/i)[0].trim();
  cargo = cargo.replace(/\s+(do concurso|do edital|da inscri[cç][aã]o).*/i, "").trim();
  if (/inscri|deferiment|comprovante|disposi/i.test(cargo)) cargo = "";
  const tight = cargo.match(/[A-Za-zÀ-ú]{4,}(?:\s+[A-Za-zÀ-ú]{3,}){0,3}/);
  if (tight) cargo = tight[0];
  const bancaSpot = flat.slice(Math.max(0, flat.toLowerCase().indexOf("banca")), Math.max(0, flat.toLowerCase().indexOf("banca")) + 80);
  const banca = ((bancaSpot.match(/\b(IDIB|VUNESP|CESPE|CEBRASPE|AOCP|IBFC|FGV|FUNDATEC|SELECON|CONSULPLAN|INQC|ABCP|QUADRIX)\b/i) || [])[1]
    || (flat.match(/\b(IDIB|VUNESP|CESPE|CEBRASPE|AOCP|IBFC|FGV|FUNDATEC|SELECON|CONSULPLAN|INQC|ABCP|QUADRIX)\b/i) || [])[1]
    || "").toUpperCase();
  const prova = (flat.match(/(?:data da prova|prova objetiva|realiza[cç][aã]o da prova)[^\d]{0,30}(\d{1,2}\/\d{2}\/\d{4})/i) || [])[1] || "";
  const insc = (flat.match(/(?:per[ií]odo de inscri[cç][aã]o|as inscri[cç][oõ]es)[^\d]{0,40}(\d{1,2}\/\d{2}\/\d{4}\s*(?:a|at[eé]|–|-)\s*\d{1,2}\/\d{2}\/\d{4})/i) || [])[1] || "";
  const taxaM = flat.match(/taxa de inscri[cç][aã]o[^R]{0,60}(R\$\s*[\d.]+,\d{2})/i)
    || flat.match(/(R\$\s*[\d.]+,\d{2})[^.]{0,40}(?:referente [aà] taxa|taxa de inscri)/i);
  const taxa = taxaM ? taxaM[1].replace(/\s+/g, " ") : "";
  const low = text.toLowerCase();
  const marks = ["conteúdo programático", "conteudo programatico", "conteúdos programáticos", "conteudos programaticos", "conteúdo da prova"];
  let start = -1;
  marks.forEach((k) => {
    const i = low.indexOf(k);
    if (i >= 0 && (start < 0 || i < start)) start = i;
  });
  if (start < 0) {
    ["programa das provas", "programa da prova", "conhecimentos básicos", "conhecimentos específicos", "conhecimentos especificos"].forEach((k) => {
      const i = low.indexOf(k);
      if (i >= 0 && (start < 0 || i < start)) start = i;
    });
  }
  const chunk = start >= 0 ? text.slice(start, start + 18000) : "";
  const lines = chunk.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean);
  const blocked = /inscri[cç]|deferiment|comprovante|disposi[cç]|vagas reserv|avalia[cç][aã]o de sa[uú]de|taxa|elimina|cronograma|recurso|sum[aá]rio|homolog|convoca[cç]|remunera|r\$|preliminar|do cargo|da inscri/i;
  const discs = [];
  const topics = [];
  let cur = null;
  const seen = {};
  lines.forEach((line) => {
    if (/conte[uú]do program|programa da prova|programa das provas|conhecimentos b[aá]sicos|conhecimentos espec/i.test(line)) return;
    if (blocked.test(line)) { cur = null; return; }
    if (/^\d+[\.\)]\s+\S/.test(line) || /^[-•]\s+\S/.test(line)) {
      if (!cur) return;
      topics.push({ id: "u" + topics.length, disc: cur.name, d: cur.id, t: line.replace(/^(?:\d+[\.\)]|[-•])\s+/, "").slice(0, 180) });
      return;
    }
    if (line.length < 4 || line.length > 72 || /[.]/.test(line)) return;
    const words = line.split(/\s+/);
    if (words.length > 10) return;
    const letters = line.replace(/[^A-Za-zÀ-ú]/g, "");
    const ups = letters.replace(/[^A-ZÁÉÍÓÚÂÊÔÃÕÇ]/g, "");
    if (letters.length < 4 || ups.length / letters.length < 0.65) return;
    const name = line.replace(/[:\-–]\s*$/, "").trim();
    const id = discIdOf(name);
    if (seen[id]) { cur = discs.find((d) => d.id === id) || cur; return; }
    seen[id] = 1;
    cur = { id: id, sigla: discSigla(name), name: name, pesoOf: 1, pts: 1, q: 0, editais: 1, provas: 1, n: 1 };
    discs.push(cur);
  });
  return {
    meta: { cargo: cargo, prova: prova, banca: banca, inscricao: insc, taxa: taxa, linkInscricao: "", linkBanca: "", aviso: "" },
    discs: discs,
    topics: topics,
  };
}
function applyParsedEdital(parsed) {
  const ids = { sim: 1 };
  S.editalDiscs = parsed.discs || [];
  S.userTopics = parsed.topics || [];
  S.editalLido = parsed.meta || {};
  S.editalAviso = (parsed.meta && parsed.meta.aviso) || "";
  if (S.editalLido.aviso) delete S.editalLido.aviso;
  S.editalDiscs.forEach((d) => { ids[d.id] = 1; });
  (S.board || []).forEach((meta) => (meta.slots || []).forEach((slot) => {
    Object.keys(slot || {}).forEach((k) => {
      if (slot[k] && slot[k].disc && !ids[slot[k].disc]) slot[k].disc = "";
    });
  }));
}
function loadPdfJs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  return new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
      ok(window.pdfjsLib);
    };
    s.onerror = fail;
    document.head.appendChild(s);
  });
}
async function textFromPdf(buf) {
  const pdfjs = await loadPdfJs();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  let out = "";
  const n = Math.min(doc.numPages, 40);
  for (let i = 1; i <= n; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    let lastY = null;
    let line = "";
    content.items.forEach((item) => {
      const y = item.transform ? item.transform[5] : 0;
      if (lastY != null && Math.abs(y - lastY) > 2) {
        out += line.trim() + "\n";
        line = "";
      }
      line += (item.str || "") + " ";
      lastY = y;
    });
    out += line.trim() + "\n";
  }
  if (out.replace(/\s/g, "").length >= 80) return out;
  return ocrPdf(doc);
}
function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  return new Promise((ok, fail) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js";
    s.onload = () => ok(window.Tesseract);
    s.onerror = fail;
    document.head.appendChild(s);
  });
}
async function ocrPdf(doc) {
  const Tesseract = await loadTesseract();
  const worker = await Tesseract.createWorker("por", 1, {
    workerPath: "https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/worker.min.js",
    corePath: "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.1.1/tesseract-core-simd-lstm.wasm.js",
    langPath: "https://tessdata.projectnaptha.com/4.0.0",
  });
  let out = "";
  const n = Math.min(doc.numPages, 4);
  try {
    for (let i = 1; i <= n; i++) {
      const page = await doc.getPage(i);
      const viewport = page.getViewport({ scale: 1.8 });
      const canvas = document.createElement("canvas");
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      await page.render({ canvasContext: canvas.getContext("2d"), viewport }).promise;
      const res = await worker.recognize(canvas);
      out += (res && res.data && res.data.text ? res.data.text : "") + "\n";
    }
  } finally {
    await worker.terminate();
  }
  return out;
}
function foldTxt(s) {
  return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
function resolveDiscToken(token) {
  const t = foldTxt(token).replace(/[^a-z0-9.]+/g, "");
  if (!t) return null;
  if (/^simu?l?a?d?o?$/.test(t) || t === "sim") return "sim";
  const hit = editalDiscs().find((d) => {
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
  if (window.ATLAS && ATLAS.exec) {
    const hit = ATLAS.exec(text);
    if (hit) return hit;
  }
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
function deliverAtlas(text, reply, ts, opt) {
  const pal = S.chatWith || S.me.id;
  S.chats[pal] = S.chats[pal] || [];
  S.atlasLog = S.atlasLog || [];
  S.atlasLog.push({ id: "a" + ts, uid: S.me.id, name: S.me.name || "você", text: text, ts: ts, priv: true });
  S.atlasLog.push({ id: "a" + (ts + 1), uid: "atlas", name: "IAs", text: reply, ts: ts + 1, priv: true });
  if (S.atlasLog.length > 40) S.atlasLog = S.atlasLog.slice(-40);
  S.chats[pal].push({ from: "me", text: text, ts: ts, priv: true });
  S.chats[pal].push({ from: "atlas", text: reply, ts: ts + 1, priv: true });
  save(S);
  render({ force: true });
  if (window.ATLAS && opt && opt.voice) ATLAS.speak(reply);
}
function sendPlanChat(inp, opt) {
  if (!inp || !inp.value.trim()) return;
  const pal = S.chatWith || S.me.id;
  S.chats[pal] = S.chats[pal] || [];
  const text = inp.value.trim();
  const ts = Date.now();
  inp.value = "";
  const direct = !!(opt && opt.voice) || /^\s*(atlas|ias|pergunte|gemini|claude|copilot)\b/i.test(text);
  if (window.ATLAS) ATLAS._direct = direct;
  const reply = applyChatPlan(text);
  if (reply && !/^Não\b/.test(reply)) {
    deliverAtlas(text, reply, ts, opt);
    return;
  }
  if ((direct || (opt && opt.voice)) && window.ATLAS && ATLAS.consult) {
    ATLAS.consult(text).then((pack) => {
      deliverAtlas(text, (pack && pack.say) || "As IAs não responderam. Confira a chave neste aparelho.", ts, opt);
    });
    return;
  }
  if (direct) {
    deliverAtlas(text, "As IAs não responderam. Confira a chave neste aparelho.", ts, opt);
    return;
  }
  S.chats[pal].push({ from: "me", text: text, ts: ts });
  S.chatWith = pal;
  if (window.PIRoom) PIRoom.postText(text);
  save(S);
  pump({ chat: { fromId: S.me.id, text: text, ts: ts } });
  paintDock();
  if (page === "chat") render();
}

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
    applyView();
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
    if (whoami) whoami.textContent = "A Planilha Inteligente";
    const photo = $("userPhoto");
    const chipName = $("userChipName");
    if (photo) photo.src = (S.me && S.me.photo) || "./logo-a.jpg";
    if (chipName) chipName.textContent = (S.me && S.me.name) || "Seu nome";
    const tn = $("topName");
    const te = $("topEmail");
    if (tn && document.activeElement !== tn) tn.value = S.me.name || "";
    if (te && document.activeElement !== te) te.value = (S.me && S.me.email) || "";
    paintDock();
    if (S && S.entered) {
      if (!Array.isArray(S.visits)) S.visits = [];
      const now = Date.now();
      const lastIn = S.visits[S.visits.length - 1] || 0;
      if (now - lastIn > 20 * 60 * 1000) {
        S.visits.push(now);
        if (S.visits.length > 400) S.visits = S.visits.slice(-400);
        save(S, true);
      }
    }
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
    const pool = editalDiscs();
    const ranked = pool.slice().sort((a, b) => gap(b) - gap(a));
    const top = ranked[0] || null;
    const done = DISC.filter((d) => rate(d.id) !== null).length;
    const avg = (() => {
      const xs = DISC.map((d) => rate(d.id)).filter((x) => x !== null);
      return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
    })();
    const pulse = window.ATLAS ? ATLAS.pulse() : null;
    const m = metricState();
    const pct = m.week;
    const port = m.port;
    const dir = m.dir;
    const leg = m.leg;
    const peso = top ? Math.round(importance(top) * 100) : 0;
    const edital = m.edital;
    const qScore = pulse ? pulse.qScore : 0;
    const dScore = pulse && pulse.planned ? pulse.dScore : 0;
    const hScore = pulse && pulse.hoursPlan ? pulse.hScore : 0;
    return `
      <div class="hero-title">
        <div>
          <h1>DESEMPENHO GERAL</h1>
          <p class="muted">Semana ${S.week}</p>
        </div>
        <div class="news-rail" aria-label="Radar de notícias">${window.PIRadar ? PIRadar.mini() : ""}</div>
      </div>
      <div class="dash-hero">
        <div class="card ring-card">
          <div class="ring metric-hit" data-metric="geral" style="--p:${pct}%"><span>
            <strong class="kpi huge">${pct}%</strong>
            <div class="muted">Desempenho Geral</div>
          </span></div>
          <p class="ring-area">Desempenho em outras áreas da plataforma</p>
          <ul class="ring-meta">
            <li class="metric-hit" data-metric="questoes">
              <div class="ring-line"><span>Questões</span><b>${qScore}%</b></div>
              <div class="muted">${pulse && pulse.q ? pulse.q.hits : 0} acertos em ${pulse && pulse.q ? pulse.q.n : 0} resolvidas</div>
              <div class="bar"><i style="width:${Math.max(0, Math.min(100, qScore))}%"></i></div>
            </li>
            <li class="metric-hit" data-metric="disciplinas">
              <div class="ring-line"><span>Disciplinas</span><b>${pulse ? pulse.studied : 0}/${pulse ? pulse.planned : 0}</b></div>
              <div class="muted">${pulse ? pulse.studied : 0} estudadas na meta · ${pulse ? pulse.missed : 0} não estudadas</div>
              <div class="bar cyan"><i style="width:${Math.max(0, Math.min(100, dScore))}%"></i></div>
            </li>
            <li class="metric-hit" data-metric="horas">
              <div class="ring-line"><span>Horas</span><b>${hScore}%</b></div>
              <div class="muted">${pulse ? pulse.hoursDone : 0}h batidas de ${pulse ? pulse.hoursPlan : 0}h previstas</div>
              <div class="bar blue"><i style="width:${Math.max(0, Math.min(100, hScore))}%"></i></div>
            </li>
            <li class="metric-hit" data-metric="editais">
              <div class="ring-line"><span>Editais</span><b>${edital.pct}%</b></div>
              <div class="muted">${edital.done} de ${edital.n} assuntos trabalhados</div>
              <div class="bar violet"><i style="width:${edital.pct}%"></i></div>
            </li>
          </ul>
        </div>
        <div class="stack">
          <div class="card metric-hit" data-metric="semana">
            <div class="muted">PROGRESSO · SEMANA</div>
            <div class="kpi">${m.week}% · ${pulse && pulse.q ? pulse.q.hits : 0} pts</div>
            <div class="bar"><i style="width:${Math.max(0, Math.min(100, m.week))}%"></i></div>
          </div>
          <div class="card stars">
            <div class="metric-hit" data-metric="baixo"><b>${m.low}%</b><span class="muted">Peso baixo</span></div>
            <div class="metric-hit" data-metric="direito"><b>${dir}%</b><span class="muted">Direito</span></div>
            <div class="metric-hit" data-metric="port"><b>${port}%</b><span class="muted">Português</span></div>
            <div class="metric-hit" data-metric="online"><b>${m.online}%</b><span class="muted">Online</span></div>
          </div>
        </div>
        <div class="card copilot">
          <div class="atlas-orb" aria-hidden="true"></div>
          <p class="copilot-lead">Comando fica só com você. A turma não vê.</p>
          <h2 class="ask-title">Pergunte às IAs</h2>
          <p class="ask-sub">Assistentes integrados: ChatGPT, Claude, Gemini e Copilot.</p>
          <div class="wave">${"<i></i>".repeat(18)}</div>
          <button class="voice-btn" id="voiceAsk" type="button">
            <strong>${userName() || "Seu nome"}</strong>
            <span>Peça por voz. Ex.: adicione 2 horas de Direito Administrativo na terça.</span>
          </button>
        </div>
        <div class="card">
          <div class="muted">GRAU DE DISCIPLINAS</div>
          <div class="disc-line metric-hit" data-metric="portbar"><span>Português</span><div class="bar cyan"><i style="width:${port}%"></i></div></div>
          <div class="disc-line metric-hit" data-metric="dirbar"><span>Direito</span><div class="bar blue"><i style="width:${dir}%"></i></div></div>
          <div class="disc-line metric-hit" data-metric="legbar"><span>Legislação</span><div class="bar violet"><i style="width:${leg}%"></i></div></div>
        </div>
        <div class="card">
          <div class="muted">COMANDO · SEMANA ${S.week}</div>
          <h2>${userName() || "Guilherme"}, o que falta, no que pesa.</h2>
          <p class="muted">${top ? top.sigla + " — " + top.name + ". Importância " + peso + " · " + level(rate(top.id)).label + "." : "Nenhum edital carregado. Faça o upload do edital para liberar as disciplinas."}</p>
          <div class="row" style="margin-top:12px">
            <button class="btn" data-go="edital">Volume do edital</button>
            <button class="btn ghost" data-go="questoes">Questões</button>
          </div>
        </div>
      </div>
    `;
  },
  desempenho() {
    const open = S.openDisc || "";
    return `
      <p class="kicker">HISTÓRICO DE DESEMPENHO DA JORNADA</p>
      <h1>HISTÓRICO DE DESEMPENHO DA JORNADA</h1>
      <p class="sub">Um volume por disciplina. Clique para ver acertos, erros e o total desde o primeiro registro.</p>
      <div class="disc-board">
      ${editalDiscs().length ? editalDiscs().map((d) => {
        const life = window.ATLAS ? ATLAS.journey(d.id) : { n: 0, hits: 0, wrong: 0, pct: 0 };
        const on = open === d.id;
        return `<article class="card disc-item disc-life${on ? " on" : ""}" data-life="${d.id}">
          <div class="row">
            <div class="mini-ring" style="--p:${life.pct}%"><span>${life.pct}%</span></div>
            <div>
              <strong>${d.sigla}</strong>
              <div class="muted">${d.name}</div>
            </div>
          </div>
          <div class="bar"><i style="width:${life.n ? Math.max(life.pct, 4) : 0}%"></i></div>
          ${on ? `<p class="life-pop">${life.n ? "Desde o primeiro registro: " + life.n + " resolvidas, " + life.hits + " acertos, " + life.wrong + " erros." : "Ainda sem registro nesta disciplina."}</p>` : ""}
        </article>`;
      }).join("") : `<p class="muted">Nenhum edital carregado. Faça o upload do edital para liberar as disciplinas.</p>`}
      </div>
    `;
  },
  radar() {
    const stamp = new Date().toLocaleDateString("pt-BR");
    return `
      <p class="kicker">RADAR · ${stamp}</p>
      <h1>RADAR DE CONCURSOS</h1>
      <p class="sub">Só notícias: concursos abertos, iminentes ou com prova marcada. O que passar de 12 dias sai sozinho.</p>
      <div class="news-board">${window.PIRadar ? PIRadar.page() : ""}</div>
    `;
  },
  edital() {
    const saved = S.editalLido || null;
    const topics = Array.isArray(S.userTopics) ? S.userTopics : [];
    const labels = [["cargo", "Cargo"], ["prova", "Data da prova"], ["banca", "Banca"], ["inscricao", "Inscrição"], ["taxa", "Taxa"]];
    const fields = saved ? labels.map(([k, lab]) => `<p><strong>${lab}.</strong> ${iaText(saved[k] || "—")}</p>`).join("") : `<p>Nenhum edital. A planilha está em branco. Anexe um arquivo para começar do zero.</p>`;
    const groups = {};
    topics.forEach((t) => {
      const name = t.disc || "Assunto";
      groups[name] = groups[name] || [];
      if (t.t) groups[name].push(t.t);
    });
    const names = Object.keys(groups);
    const list = names.length
        ? names.map((name) => `<div class="topic"><strong>${iaText(name)}</strong><p>${groups[name].map((x) => iaText(x)).join("<br>")}</p></div>`).join("")
        : `<p class="muted">${iaText(S.editalAviso || "O verticalizado aparece aqui depois que você anexar o edital novo.")}</p>`;
    return `
      <p class="kicker">EDITAL</p>
      <h1>EDITAL</h1>
      <div class="card">${fields}
        <label class="muted" style="display:block;margin-top:8px">Anexar edital novo (PDF ou texto)
          <input id="editalFile" type="file" accept=".pdf,.txt,.text,text/plain,application/pdf">
        </label>
      </div>
      <h2>EDITAL VERTICALIZADO</h2>
      <div class="room-view room-edital">${list}</div>
    `;
  },
  questoes() {
    ensurePlan();
    const day = DAYS.find((d) => d.id === S.day) || DAYS[0];
    const list = discsPlanned(day.id);
    return `
      <p class="kicker">REGISTRO DE QUES. PARA ACOMPANHAMENTO DE EVOLUÇÃO</p>
      <h1>REGISTRO DE QUES. PARA ACOMPANHAMENTO DE EVOLUÇÃO</h1>
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
    const meta = S.board[0];
    const mi = 0;
    const head = (c) => DAYHEAD[c.id] || c.label;
    const cellTd = (c, slot, si) => {
      const cell = slot[c.id] || blankCell();
      const mark = cell.feito === "ok" ? " feito-ok" : cell.feito === "no" ? " feito-no" : "";
      if (c.simulado && si === 0) {
        return `<td class="sim${mark}" rowspan="3">
          <input data-board="nota" data-meta="${mi}" data-slot="0" data-ciclo="${c.id}" value="${(slot[c.id] && slot[c.id].nota) || "Simulado"}">
          <select data-board="disc" data-meta="${mi}" data-slot="0" data-ciclo="${c.id}">${discOpts(cell.disc || "sim")}</select>
          ${modoBtns(cell, mi, 0, c.id)}
          ${feitoBtns(cell, mi, 0, c.id)}
        </td>`;
      }
      if (c.simulado) return "";
      return `<td class="${mark.trim()}">
        <select data-board="disc" data-meta="${mi}" data-slot="${si}" data-ciclo="${c.id}">${discOpts(cell.disc)}</select>
        ${modoBtns(cell, mi, si, c.id)}
        ${feitoBtns(cell, mi, si, c.id)}
      </td>`;
    };
    return `
      <p class="kicker">PLANO DE ESTUDOS · semana ${S.week}</p>
      <h1 class="plan-title">PLANEJAMENTO SEMANAL</h1>
      <p class="sub">Acione manualmente ou peça às IAs.</p>
      ${editalDiscs().length ? "" : `<p class="muted">Nenhum edital carregado. Faça o upload do edital para liberar as disciplinas.</p>`}
      <div class="row" style="margin-bottom:12px">
        <button class="btn ghost" id="wprev">Semana −</button>
        <button class="btn ghost" id="wnext">Semana +</button>
        <button class="btn ${S.planMode === "auto" ? "" : "ghost"}" id="planAuto">Automático</button>
        <button class="btn ${S.planMode === "manual" ? "" : "ghost"}" id="planManual">Manual</button>
        <button class="btn ghost" id="planRotate">Reorganizar agora</button>
      </div>
      <div class="ciclo-wrap">
        <table class="ciclo-grid">
          <thead>
            <tr>
              <th class="meta-h">META</th>
              ${CICLOS.map((c) => `<th>${head(c)}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${meta.slots.map((slot, si) => `
              <tr>
                <th>1H</th>
                ${CICLOS.map((c) => cellTd(c, slot, si)).join("")}
              </tr>
            `).join("")}
          </tbody>
        </table>
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
      <div class="room-view room-turma">
      <div class="card">
        <div class="muted">MESTRE DESTE CHAT</div>
        <p class="muted">O Grok atualiza o arquivo no seu Drive. Aqui o app puxa sem novo zip. Deixe o arquivo como “qualquer pessoa com o link”.</p>
        <input id="masterUrl" value="${(S.masterUrl || "").replace(/"/g, "")}" style="width:100%;margin:8px 0">
        <textarea id="masterPack" class="chatbox" placeholder="Ou cole o pacote VGCFG. que o Grok enviar" style="width:100%"></textarea>
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
      <h3 class="room-span">Placar da turma</h3>
      ${board.map((p, i) => {
        const pct = p.avg == null ? "—" : Math.round(p.avg * 100) + "%";
        const bar = p.avg == null ? 0 : Math.round(p.avg * 100);
        const mine = p.id === me.id;
        return `<div class="card">
          <div class="row" style="justify-content:space-between">
            <strong>${i + 1}. ${p.name} ${mine ? "(você)" : ""}</strong>
            <span class="${p.avg >= 0.85 ? "forte" : p.avg != null && p.avg < 0.7 ? "fraco" : ""}">${pct}</span>
          </div>
          <div class="muted">@${p.handle} · ${p.n || 0} questões · sem. ${p.week || "—"}</div>
          <div class="bar"><i style="width:${bar}%"></i></div>
          ${!mine ? `<div class="row" style="margin-top:8px"><button class="btn ghost" data-openchat="${p.id}">Abrir chat</button></div>` : ""}
        </div>`;
      }).join("")}
      </div>
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
      <div class="room-view room-anki">
      <div class="card">
        <div class="muted">1 · IMPORTAR ARQUIVO (sempre funciona)</div>
        <p>Arquivo → Importar no Anki. Tipo: notas básicas. Campos: Frente, Verso, Tags. Baralho sugerido: <strong>${DECK}</strong>.</p>
        <button class="btn" id="ankiDl">Baixar baralho .txt</button>
      </div>
      <div class="card">
        <div class="muted">2 · ANKICONNECT (Anki aberto neste PC)</div>
        <p class="muted">Em Anki: Ferramentas → Add-ons → AnkiConnect. Em Config, acrescente a origem desta página em <code>webCorsOriginList</code>.</p>
        <div class="row">
          <button class="btn ghost" id="ankiPing">Testar ligação</button>
          <button class="btn" id="ankiPush">Enviar ${n} cards</button>
        </div>
        <p id="ankiMsg" class="muted" style="margin-top:10px">Ainda não testou.</p>
      </div>
      <h3 class="room-span">O que vai no baralho</h3>
      <p class="muted room-span">Quadro oficial da prova + cada tópico do Anexo V com a nota de recorrência.</p>
      ${cards().slice(0, 8).map(([f]) => `<div class="topic"><p style="margin:0">${f}</p></div>`).join("")}
      </div>
      ${n > 8 ? `<p class="muted">… e mais ${n - 8} cards.</p>` : `<p class="muted">${n ? "" : "Nenhum edital carregado. Faça o upload do edital para liberar as disciplinas."}</p>`}
    `;
  },
  sobre() {
    const a = window.ATLAS ? ATLAS.prefs() : {};
    const on = a.on || { chatgpt: true, claude: true, gemini: true, copilot: true };
    const models = [["chatgpt", "ChatGPT"], ["claude", "Claude"], ["gemini", "Gemini"], ["copilot", "Copilot"]];
    return `
      <p class="kicker">PERGUNTE ÀS IAs</p>
      <h1>Pergunte às IAs</h1>
      <p class="sub">Assistentes integrados: ChatGPT, Claude, Gemini e Copilot.</p>
      <div class="card">
        <div class="ia-row">
          ${models.map(([id, lab]) => `<button type="button" class="btn ${on[id] ? "" : "ghost"}" data-ia="${id}">${lab}</button>`).join("")}
        </div>
        <div class="row" style="margin-top:10px">
          ${models.map(([id, lab]) => `<label class="muted">${lab} <input id="key-${id}" type="password" placeholder="${a[id] ? "chave neste aparelho" : "cole a chave"}" autocomplete="off"></label>`).join("")}
        </div>
        <div class="row" style="margin-top:10px">
          <input id="iaAsk" placeholder="Peça às IAs" style="flex:1">
          <button class="btn" id="iaSend" type="button">Consultar</button>
        </div>
        <p class="muted" style="margin-top:12px">A resposta abre à frente, com a precisão do consenso.</p>
      </div>
    `;
  },
  simulados() {
    const logs = Array.isArray(S.simLogs) ? S.simLogs : [];
    const pool = editalDiscs();
    const opts = pool.length ? pool.map((d) => `<label class="sim-pill" title="${d.name}"><input type="checkbox" data-simdisc="${d.id}"><span>${d.sigla}</span></label>`).join("") : "";
    const rows = logs.map((r) => {
      const nomes = (r.discs || []).map((id) => {
        const d = DISC.find((x) => x.id === id);
        return d ? d.sigla : id;
      }).join(", ");
      return `<div class="card" style="margin-bottom:8px">
        <div class="row" style="justify-content:space-between">
          <strong>${r.nome || "Simulado"}</strong>
          <button class="btn ghost" type="button" data-simdel="${r.id}">Apagar</button>
        </div>
        <p class="muted">${r.data || "sem data"} · ${r.pontos || 0}${r.total ? "/" + r.total : ""} pts</p>
        <p>${nomes || "sem disciplina"}</p>
      </div>`;
    }).join("");
    return `
      <p class="kicker">SIMULADOS</p>
      <h1>SIMULADOS</h1>
      <p class="sub">Pontuação e disciplinas de cada simulado feito. Esta sala não abre o plano de estudos.</p>
      <div class="card">
        <div class="row">
          <label class="muted">Nome <input id="simNome" placeholder="Simulado 1"></label>
          <label class="muted">Data <input id="simData" type="date"></label>
          <label class="muted">Pontos <input id="simPts" type="number" min="0" value="0"></label>
          <label class="muted">Total <input id="simTot" type="number" min="0" value="0"></label>
        </div>
        <div class="sim-pills">${opts || `<p class="muted">Nenhum edital carregado. Faça o upload do edital para liberar as disciplinas.</p>`}</div>
        <button class="btn" id="simAdd" type="button" style="margin-top:12px">Registrar simulado</button>
      </div>
      <div style="margin-top:12px">${rows || `<p class="muted">Nenhum simulado registrado.</p>`}</div>
    `;
  },
  usuario() {
    const me = S.me || {};
    const win = [7, 15, 30].indexOf(Number(me.freqWin)) >= 0 ? Number(me.freqWin) : 30;
    const list = Array.isArray(S.visits) ? S.visits : [];
    const now = Date.now();
    const inWin = list.filter((t) => now - t <= win * 86400000);
    const prev = list.filter((t) => now - t > 60000);
    const last = prev.length ? prev[prev.length - 1] : 0;
    const lastTxt = last ? new Date(last).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "sem dados";
    const q = weekQuestionScore();
    const sim = simuladoScore();
    const parts = [];
    if (q.n) parts.push(q.score);
    if (sim.tot) parts.push(sim.score);
    const geral = parts.length ? Math.round(parts.reduce((a, b) => a + b, 0) / parts.length) : 0;
    const foto = me.photo || "./logo-a.jpg";
    const metodo = me.metodo || "";
    const qv = (v) => String(v || "").replace(/&/g, "&" + "amp;").replace(/"/g, "&" + "quot;").replace(/</g, "&" + "lt;");
    return `
      <p class="kicker">Usuário</p>
      <h1>${qv(me.name) || "Seu nome"}</h1>
      <p class="sub">Seus dados, o concurso e o desempenho. O status por evolução fica para depois.</p>
      <div class="card" style="margin-bottom:12px">
        <div class="row">
          <img src="${foto}" alt="" class="brand-logo lg">
          <label class="btn ghost" style="display:inline-flex;align-items:center">Foto
            <input id="userPhotoFile" type="file" accept="image/*" hidden>
          </label>
        </div>
        <div class="row" style="margin-top:10px">
          <label class="muted">Nome <input id="userName" value="${qv(me.name)}"></label>
          <label class="muted">Telefone <input id="userPhone" value="${qv(me.phone)}"></label>
          <label class="muted">E-mail <input id="userMail" type="email" value="${qv(me.email)}"></label>
        </div>
        <label class="muted" style="display:block;margin-top:10px">Concurso <input id="userExam" value="${qv(me.exam)}"></label>
        <label class="muted" style="display:block;margin-top:10px">Apresentação <textarea id="userAbout" rows="3">${qv(me.about)}</textarea></label>
        <p class="muted" style="margin-top:12px">Metodologia</p>
        <div class="row">
          ${[["questoes", "Questões"], ["teoria", "Teoria"], ["pdf", "PDF"]].map(([id, lab]) =>
            `<button type="button" class="btn ${metodo === id ? "" : "ghost"}" data-metodo="${id}">${lab}</button>`
          ).join("")}
        </div>
        <label class="muted" style="display:block;margin-top:10px">Foco do planejamento <textarea id="userFoco" rows="2">${qv(me.foco)}</textarea></label>
        <label class="muted" style="display:block;margin-top:10px">Meta de questões na semana <input id="userMetaQ" type="number" min="0" value="${Number(me.metaQ) || 0}"></label>
      </div>
      <div class="card" style="margin-bottom:12px">
        <div class="row" style="justify-content:space-between">
          <strong>Frequência</strong>
          <span class="muted">Última entrada: ${lastTxt}</span>
        </div>
        <div class="row" style="margin-top:8px">
          ${[7, 15, 30].map((n) => `<button type="button" class="btn freq-btn ${win === n ? "on" : "ghost"}" data-freq="${n}">${n} dias</button>`).join("")}
        </div>
        <p class="kpi">${inWin.length}</p>
        <p class="muted">entradas nos últimos ${win} dias</p>
      </div>
      <div class="card">
        <div class="muted">GRAU DE EVOLUÇÃO</div>
        <p style="margin:8px 0 0">Desempenho geral</p>
        <div class="kpi">${parts.length ? geral + "%" : "0%"}</div>
        <p class="muted">${parts.length ? "Questões e simulados somados." : "sem dados"}</p>
        <p style="margin:12px 0 0">Questões da semana</p>
        <div class="bar cyan"><i style="width:${q.score || 0}%"></i></div>
        <p class="muted">${q.n ? q.hits + " acertos em " + q.n + " · meta " + (q.goal || "—") : "sem dados"}</p>
        <p style="margin:12px 0 0">Simulados</p>
        <div class="bar blue"><i style="width:${sim.score || 0}%"></i></div>
        <p class="muted">${sim.tot ? sim.pts + "/" + sim.tot + " pts" : "sem dados"}</p>
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

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeIaModal(); closeMetric(); }
});
document.addEventListener("click", (e) => {
  if (e.target.id === "iaClose" || e.target.id === "iaOverlay") { closeIaModal(); return; }
  if (e.target.id === "metricClose" || e.target.id === "metricOverlay") { closeMetric(); return; }
  const metric = e.target.closest && e.target.closest("[data-metric]");
  if (metric && page === "comando") { openMetric(metric.dataset.metric); return; }
  if (!e.target.closest(".side-tools")) {
    const pop = $("zoomPop");
    if (pop) pop.hidden = true;
    const eye = $("eyeFit");
    if (eye) eye.setAttribute("aria-expanded", "false");
  }
  const nav = e.target.closest("[data-nav]");
  if (nav) { page = nav.dataset.nav; $("side").classList.remove("open"); render(); }
  if (e.target.closest("#userChip")) { page = "usuario"; $("side").classList.remove("open"); render(); return; }
  const modo = e.target.closest("[data-modo]");
  if (modo) {
    const mi = Number(modo.dataset.meta);
    const si = Number(modo.dataset.slot);
    const cid = modo.dataset.ciclo;
    const slot = S.board && S.board[mi] && S.board[mi].slots[si];
    if (slot) {
      slot[cid] = Object.assign(blankCell(), slot[cid] || {});
      slot[cid].modo = modo.dataset.modo;
      S.planMode = "manual";
      save(S);
      render();
    }
    return;
  }
  const feito = e.target.closest("[data-feito]");
  if (feito) {
    const mi = Number(feito.dataset.meta);
    const si = Number(feito.dataset.slot);
    const cid = feito.dataset.ciclo;
    const slot = S.board && S.board[mi] && S.board[mi].slots[si];
    if (slot) {
      slot[cid] = Object.assign(blankCell(), slot[cid] || {});
      slot[cid].feito = slot[cid].feito === feito.dataset.feito ? "" : feito.dataset.feito;
      S.planMode = "manual";
      save(S);
      render();
    }
    return;
  }
  const met = e.target.closest("[data-metodo]");
  if (met) { S.me.metodo = met.dataset.metodo; save(S); render(); return; }
  const freq = e.target.closest("[data-freq]");
  if (freq) { S.me.freqWin = Number(freq.dataset.freq); save(S); render(); return; }
  const go = e.target.closest("[data-go]");
  if (go) { page = go.dataset.go; render(); }
  if (e.target.id === "menu" || (e.target.closest && e.target.closest("#menu"))) {
    const side = $("side");
    const arrow = $("menu");
    if (window.matchMedia("(max-width: 820px)").matches) {
      side.classList.toggle("open");
      if (arrow) arrow.textContent = side.classList.contains("open") ? "‹" : "›";
    } else {
      side.classList.toggle("collapsed");
      if (arrow) arrow.textContent = side.classList.contains("collapsed") ? "›" : "‹";
      try { localStorage.setItem("pi-side", side.classList.contains("collapsed") ? "1" : "0"); } catch (_) {}
    }
  }
  const av = e.target.closest("[data-avatar]");
  if (av) {
    S.avatar = av.dataset.avatar;
    save(S, true);
    paintGate();
  }
  if (e.target.id === "simAdd") {
    if (!Array.isArray(S.simLogs)) S.simLogs = [];
    const discs = [...document.querySelectorAll("[data-simdisc]:checked")].map((x) => x.dataset.simdisc);
    S.simLogs.unshift({
      id: "s" + Date.now(),
      nome: (($("simNome") && $("simNome").value) || "").trim() || "Simulado",
      data: ($("simData") && $("simData").value) || "",
      pontos: Math.max(0, Number($("simPts") && $("simPts").value) || 0),
      total: Math.max(0, Number($("simTot") && $("simTot").value) || 0),
      discs,
    });
    save(S);
    render({ force: true });
    return;
  }
  const simDel = e.target.closest("[data-simdel]");
  if (simDel && Array.isArray(S.simLogs)) {
    S.simLogs = S.simLogs.filter((r) => r.id !== simDel.dataset.simdel);
    save(S);
    render({ force: true });
    return;
  }
  if (e.target.closest("#eyeFit")) {
    const pop = $("zoomPop");
    if (!pop) return;
    pop.hidden = !pop.hidden;
    e.target.closest("#eyeFit").setAttribute("aria-expanded", pop.hidden ? "false" : "true");
    const bf = $("backupFloat");
    if (bf) bf.hidden = true;
    return;
  }
  if (e.target.closest("#backupBtn")) {
    const pop = $("zoomPop");
    if (pop) pop.hidden = true;
    const eye = $("eyeFit");
    if (eye) eye.setAttribute("aria-expanded", "false");
    const bf = $("backupFloat");
    if (bf) {
      bf.hidden = false;
      clearTimeout(window.__piBackupT);
      window.__piBackupT = setTimeout(() => { bf.hidden = true; }, 2200);
    }
    sendBackup();
    return;
  }
  if (e.target.id === "gateStart") {
    const name = (($("gateName") && $("gateName").value) || "").trim();
    const email = (($("gateEmail") && $("gateEmail").value) || "").trim();
    const pass = (($("gatePass") && $("gatePass").value) || "").trim();
    const err = $("gateErr");
    const done = (msg) => {
      if (msg) { if (err) err.textContent = msg; return; }
      if (window.PISession) PISession.afterEnter();
      render();
    };
    if (window.PISession && PISession.enterAccount) {
      PISession.enterAccount(name, email, pass).then(done);
      return;
    }
    if (!name) { if (err) err.textContent = "Escreve o nome para entrar."; return; }
    S.me.name = name;
    S.entered = true;
    S.tourDone = true;
    save(S);
    render();
    return;
  }
  if (e.target.id === "logoutBtn") {
    const go = () => { S = defaultState(); S.entered = false; S.viewMode = "barras"; render(); };
    if (window.PISession && PISession.exitAccount) PISession.exitAccount().then(go);
    else go();
    return;
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
  const vbtn = e.target.closest("[data-view]");
  if (vbtn) {
    S.viewMode = vbtn.dataset.view === "blocos" ? "blocos" : "barras";
    save(S, true);
    applyView();
    render({ force: true });
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
      if (msg) msg.textContent = "Não foi possível ler o Drive. Libere o link ou cole o pacote VGCFG.";
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
      msg.textContent = "Não foi possível ler o código. Peça um código VG1. novo.";
    }
  }
  const iaBtn = e.target.closest && e.target.closest("[data-ia]");
  if (iaBtn && window.ATLAS) {
    const p = ATLAS.prefs();
    p.on = p.on || { chatgpt: true, claude: true, gemini: true, copilot: true };
    p.on[iaBtn.dataset.ia] = !p.on[iaBtn.dataset.ia];
    save(S);
    render({ force: true });
    return;
  }
  if (e.target.id === "iaSend" && window.ATLAS) {
    const inp = $("iaAsk");
    const text = inp && inp.value.trim();
    if (!text) return;
    inp.value = "";
    openIaModal();
    const ticket = ++iaTicket;
    const run = ATLAS.consult ? ATLAS.consult(text) : ATLAS.act(text);
    Promise.race([
      run,
      new Promise((resolve) => setTimeout(() => resolve({ say: "O pedido passou do tempo. Tente de novo.", precision: 0, votes: [] }), 28000)),
    ]).then((pack) => {
      if (ticket !== iaTicket) return;
      S.iaLast = pack || { say: "As IAs não responderam. Confira a chave neste aparelho.", precision: 0, votes: [] };
      save(S);
      fillIaModal(S.iaLast);
    }).catch(() => {
      if (ticket !== iaTicket) return;
      fillIaModal({ say: "As IAs não responderam. Confira a chave neste aparelho.", precision: 0, votes: [] });
    });
    return;
  }
  if (e.target.id === "voiceAsk" || (e.target.closest && e.target.closest("#voiceAsk"))) {
    if (window.ATLAS) { ATLAS.prime(); ATLAS.listen(); }
  }
  const prefBtn = e.target.closest && e.target.closest("[data-atlaspref]");
  if (prefBtn && window.ATLAS) {
    const line = ATLAS.setLevel(prefBtn.dataset.atlaspref, prefBtn.dataset.level);
    save(S);
    render({ force: true });
    ATLAS.prime();
    ATLAS.speak(line);
    return;
  }
  const life = e.target.closest && e.target.closest("[data-life]");
  if (life && page === "desempenho") {
    S.openDisc = S.openDisc === life.dataset.life ? "" : life.dataset.life;
    save(S, true);
    render({ force: true });
    return;
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
  const atlasKey = { atlasSim: "simpatia", atlasInt: "interacao", atlasCri: "criatividade", atlasPod: "poder" }[e.target.id];
  if (atlasKey) {
    if (!S.atlas) S.atlas = { simpatia: 2, interacao: 2, criatividade: 1, poder: 2 };
    S.atlas[atlasKey] = Number(e.target.value);
    const b = e.target.parentElement && e.target.parentElement.querySelector("b");
    if (b) b.textContent = e.target.value;
    save(S, true);
    return;
  }
  captureField(e.target);
  save(S, true);
  if (e.target.dataset && e.target.dataset.sheet) paintSheetTotals();
});
document.addEventListener("change", (e) => {
  if (e.target.id && e.target.id.indexOf("key-") === 0 && window.ATLAS) {
    const id = e.target.id.slice(4);
    const val = String(e.target.value || "").trim();
    if (val) ATLAS.prefs()[id] = val;
    save(S, true);
    return;
  }
  if (e.target.id === "atlasGemini" || e.target.id === "atlasOpenai") {
    if (!S.atlas) S.atlas = { simpatia: 2, interacao: 2, criatividade: 1, poder: 3 };
    const val = String(e.target.value || "").trim();
    if (val) S.atlas[e.target.id === "atlasGemini" ? "gemini" : "openai"] = val;
    save(S, true);
    return;
  }
  if (e.target.id === "userPhotoFile" && e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = 128; c.height = 128;
        const ctx = c.getContext("2d");
        const k = Math.max(128 / img.width, 128 / img.height);
        const w = img.width * k;
        const h = img.height * k;
        ctx.drawImage(img, (128 - w) / 2, (128 - h) / 2, w, h);
        S.me.photo = c.toDataURL("image/jpeg", 0.82);
        save(S);
        render();
      };
      img.src = String(reader.result || "");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
    return;
  }
  if (e.target.id === "editalFile" && e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();
    const finish = (text) => {
      page = "edital";
      const res = window.PIComando ? PIComando.ler(text) : { ok: false, motivo: "Leitor ausente." };
      if (!res.ok) S.editalAviso = res.motivo;
      save(S);
      render({ force: true });
    };
    reader.onload = () => {
      if (/\.pdf$/i.test(file.name)) {
        textFromPdf(reader.result).then(finish).catch(() => finish(""));
      } else finish(String(reader.result || ""));
    };
    if (/\.pdf$/i.test(file.name)) reader.readAsArrayBuffer(file);
    else reader.readAsText(file);
    S.editalAviso = "Lendo o arquivo.";
    page = "edital";
    render({ force: true });
    e.target.value = "";
    return;
  }
  if (e.target.id === "topFile" && e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = () => restoreBackup(String(reader.result || ""), file.name);
    reader.readAsText(file);
    e.target.value = "";
    return;
  }
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
try {
  if (localStorage.getItem("pi-side") === "1" && $("side")) {
    $("side").classList.add("collapsed");
    if ($("menu")) $("menu").textContent = "›";
  }
} catch (_) {}
render({ force: true });
if (window.PIRadar) PIRadar.refresh().then((changed) => { if (changed && (page === "comando" || page === "radar")) render({ force: true }); });
readDisk().then((disk) => {
  if (window.__piUserLock || (S.entered && S.me && S.me.email)) return;
  if (!disk || !disk.raw) {
    save(S, true);
    return;
  }
  let parsed = null;
  try { parsed = JSON.parse(disk.raw); } catch (_) {}
  if (parsed && (parsed.savedAt || 0) > (S.savedAt || 0)) {
    S = blankStudy({ ...defaultState(), ...parsed });
    if (!S.sheet) S.sheet = emptySheet();
    render();
  }
});
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(() => {});
