const VERSION = "v9";
const KEY = "planilha-inteligente-" + VERSION;
const USERS_KEY = "pi-users-v1";
const SESSION_KEY = "pi-session-v1";
const PRESENCE_KEY = "pi-presence-v1";
const USER_CAP = 15;
let DISC = [];
let TOPICS = [];
function setCatalog(discs, topics) {
  DISC = Array.isArray(discs) ? discs : [];
  TOPICS = Array.isArray(topics) ? topics : [];
}
const defaultState = () => ({
  week: 1, day: "seg", planMode: "auto", logs: {}, topic: {},
  catalog: { discs: [], topics: [] },
  me: { id: "pi-" + Math.random().toString(36).slice(2, 8), name: "", handle: "", city: "", exam: "", email: "" },
  friends: {}, chats: {}, chatWith: null, room: "", masterUrl: "", mestre: null,
  entered: false, avatar: "", tourStep: 0, tourDone: true, zoom: 1, viewMode: "barras",
  sheet: null, board: null
});
function $(id) { return document.getElementById(id); }
function normEmail(v) { return String(v || "").trim().toLowerCase(); }
function loadUsers() { try { const l = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); return Array.isArray(l) ? l : []; } catch { return []; } }
function saveUsers(list) { try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (_) {} }
function sessionId() { try { return localStorage.getItem(SESSION_KEY) || ""; } catch { return ""; } }
function stateKey(uid) { return KEY + "-" + (uid || "guest"); }
function load() {
  const uid = sessionId();
  const store = uid ? stateKey(uid) : KEY;
  try {
    const s = { ...defaultState(), ...JSON.parse(localStorage.getItem(store) || "{}") };
    s.entered = !!uid;
    return s;
  } catch { return defaultState(); }
}
function commitSave(s) {
  s.savedAt = Date.now();
  try {
    const raw = JSON.stringify(s);
    const uid = (s.me && s.me.id) || sessionId();
    localStorage.setItem(uid ? stateKey(uid) : KEY, raw);
    if (window.PIAuth && PIAuth.enabled() && uid) PIAuth.pushState(uid, s).catch(() => {});
  } catch (_) {}
}
function save(s, silent) { commitSave(s); if (!silent && typeof pump === "function") pump(); }
function captureField(el) {
  if (!el || !S) return;
  if (el.id === "gateName" || el.id === "topName") S.me.name = el.value;
  if (el.id === "gateEmail" || el.id === "topEmail") S.me.email = el.value;
}
function flushNow() { captureField(document.activeElement); commitSave(S); }
function pump() {}
const DAYS = [{id:"seg",label:"Seg"},{id:"ter",label:"Ter"},{id:"qua",label:"Qua"},{id:"qui",label:"Qui"},{id:"sex",label:"Sex"},{id:"sab",label:"Sáb"},{id:"dom",label:"Dom"}];
function blankCell() { return { disc: "", horas: "1", ques: "", nota: "" }; }
function emptySheet() {
  return { rows: ["CICLO I","CICLO II","CICLO III","CICLO IV","CICLO V","CICLO VI","CICLO VII"].map((label,i)=>({ id:"r"+(i+1), label, cells: Object.fromEntries(DAYS.map(d=>[d.id, blankCell()])) })) };
}
let S = load();
S.me = { ...defaultState().me, ...(S.me || {}) };
if (S.viewMode !== "blocos") S.viewMode = "barras";
if (!S.sheet) S.sheet = emptySheet();
let page = "comando";
function applyZoom() {
  const z = Math.min(1.25, Math.max(0.75, Number(S.zoom) || 1));
  S.zoom = z;
  document.documentElement.style.fontSize = (16 * z) + "px";
}
function applyView() {
  const mode = S.viewMode === "blocos" ? "blocos" : "barras";
  S.viewMode = mode;
  document.body.classList.toggle("view-blocos", mode === "blocos");
  document.querySelectorAll("[data-view]").forEach((b) => b.classList.toggle("on", b.dataset.view === mode));
}
function userName() { return String((S.me && S.me.name) || "").trim(); }
function paintGate() {
  const gate = $("gate");
  if (!gate) return;
  gate.hidden = !!S.entered;
}
function readPresence() { try { const l = JSON.parse(localStorage.getItem(PRESENCE_KEY) || "[]"); return Array.isArray(l) ? l : []; } catch { return []; } }
function writePresence(list) { try { localStorage.setItem(PRESENCE_KEY, JSON.stringify(list)); } catch (_) {}
}
function paintPresence() {
  const box = $("presenceList");
  if (!box) return;
  const now = Date.now();
  const uid = S.me && S.me.id;
  const liveNow = readPresence().filter((p) => now - (p.ts || 0) < 25000);
  const names = liveNow.map((p) => p.id === uid ? (p.name || "você") + " (você)" : (p.name || "aluno"));
  box.textContent = names.length ? names.join(" · ") : "só você";
}
function beatPresence() {
  if (!S.entered || !S.me || !S.me.id) return;
  const now = Date.now();
  const others = readPresence().filter((p) => p.id !== S.me.id && now - (p.ts || 0) < 25000);
  others.push({ id: S.me.id, name: userName() || "Aluno", ts: now });
  writePresence(others);
  paintPresence();
}
function dropPresence() { writePresence(readPresence().filter((p) => p.id !== (S.me && S.me.id))); }
async function enterAccount(name, email, pass) {
  const mail = normEmail(email);
  if (!name) return "Informe o nome.";
  if (!mail || !mail.includes("@")) return "Informe um e-mail válido.";
  if (window.PIAuth) await PIAuth.boot();
  if (window.PIAuth && PIAuth.enabled()) {
    const r = await PIAuth.login(name, mail, pass);
    if (r.error) return r.error;
    S = { ...defaultState(), ...(r.state || {}) };
    S.me = { ...(S.me || defaultState().me), id: r.uid, name, email: mail };
    S.entered = true;
    try { localStorage.setItem(SESSION_KEY, r.uid); } catch (_) {}
    commitSave(S); beatPresence(); return "";
  }
  const users = loadUsers();
  let u = users.find((x) => x.email === mail);
  if (!u) {
    if (users.length >= USER_CAP) return "Limite de 15 usuários atingido.";
    u = { id: "u-" + Date.now().toString(36), name, email: mail };
    users.push(u); saveUsers(users);
  } else { u.name = name; saveUsers(users); }
  try { localStorage.setItem(SESSION_KEY, u.id); } catch (_) {}
  try { S = { ...defaultState(), ...JSON.parse(localStorage.getItem(stateKey(u.id)) || "{}") }; }
  catch { S = defaultState(); }
  S.me = { ...(S.me || defaultState().me), id: u.id, name, email: mail };
  S.entered = true;
  commitSave(S); beatPresence(); return "";
}
async function exitAccount() {
  dropPresence();
  if (window.PIAuth) await PIAuth.logout();
  try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
  S = defaultState(); S.entered = false;
}
function rate() { return null; }
function importance() { return 0; }
function level() { return { label: "SEM DADOS", cls: "muted" }; }
function userNameSafe() { return userName(); }
function render(opts) {
  paintGate(); applyZoom(); applyView(); paintPresence();
  if (!pages[page]) page = "comando";
  const view = $("view");
  if (view && pages[page]) view.innerHTML = pages[page]();
  document.querySelectorAll("[data-nav]").forEach((b) => b.classList.toggle("on", b.dataset.nav === page));
  const tn = $("topName"); if (tn && document.activeElement !== tn) tn.value = (S.me && S.me.name) || "";
  const te = $("topEmail"); if (te && document.activeElement !== te) te.value = (S.me && S.me.email) || "";
}
function sendPlanChat(inp) {
  if (!inp || !inp.value.trim()) return;
  const log = $("dockLog");
  if (log) log.insertAdjacentHTML("beforeend", `<div class="dock-msg me">${inp.value.trim()}</div>`);
  inp.value = "";
}
