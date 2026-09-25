/* Conta, JWT do Firebase, presença e sala ao vivo. Não desenha a grade. */
(function () {
  const CAP = 15;
  const USERS_KEY = "pi-users-v7";
  const SESSION_KEY = "pi-session-v7";
  const PRESENCE_KEY = "pi-presence-v7";
  const ROOM_KEY = "pi-room-v7";
  const bus = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("pi-room-v7") : null;
  let fb = null;
  let timer = 0;
  let mic = null;
  let jwt = "";
  let jwtExp = 0;

  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return "&#" + c.charCodeAt(0) + ";";
    });
  }
  function normEmail(v) { return String(v || "").trim().toLowerCase(); }
  function users() {
    try { const l = JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); return Array.isArray(l) ? l : []; }
    catch { return []; }
  }
  function saveUsers(list) { try { localStorage.setItem(USERS_KEY, JSON.stringify(list)); } catch (_) {} }
  function seal(pass) {
    let h = 2166136261;
    const s = "pi-v7|" + pass;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(16);
  }
  function readExp(token) {
    try {
      const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
      const json = JSON.parse(atob(part));
      return (json.exp || 0) * 1000;
    } catch (_) { return 0; }
  }
  async function holdToken(user, force) {
    if (!user) { jwt = ""; jwtExp = 0; return ""; }
    if (!force && jwt && jwtExp > Date.now() + 60000) return jwt;
    jwt = await user.getIdToken(!!force);
    jwtExp = readExp(jwt);
    return jwt;
  }
  function firebaseReady() {
    const c = window.PI_FIREBASE;
    return !!(c && c.apiKey && c.projectId && window.firebase && firebase.auth && firebase.firestore);
  }
  async function bootFirebase() {
    if (!firebaseReady()) return false;
    if (fb) return true;
    if (!firebase.apps.length) firebase.initializeApp(window.PI_FIREBASE);
    const db = firebase.firestore();
    try { await db.enablePersistence({ synchronizeTabs: true }); } catch (_) {}
    fb = { auth: firebase.auth(), db: db };
    try { fb.storage = firebase.storage(); } catch (_) { fb.storage = null; }
    fb.auth.onIdTokenChanged(async (user) => { await holdToken(user, false); });
    return true;
  }
  function stateKey(uid) { return "pi-state-v7-" + uid; }
  function adopt(uid, name, email, remote) {
    let local = {};
    try { local = JSON.parse(localStorage.getItem(stateKey(uid)) || "{}"); } catch (_) {}
    const base = Object.assign(defaultState(), local, remote || {});
    S = base;
    S.me = Object.assign(defaultState().me, S.me || {}, { id: uid, name: name, email: email });
    S.entered = true;
    S.tourDone = true;
    if (S.viewMode !== "blocos") S.viewMode = "barras";
    if (!S.sheet) S.sheet = emptySheet();
    window.__piUserLock = true;
    try { localStorage.setItem(SESSION_KEY, JSON.stringify({ id: uid, email: email, name: name })); } catch (_) {}
    commitSave(S);
  }
  async function pullRemote(uid) {
    if (!fb) return null;
    try {
      const snap = await fb.db.collection("users").doc(uid).collection("data").doc("state").get();
      if (!snap.exists) return null;
      const data = snap.data() || {};
      return data.state || null;
    } catch (_) { return null; }
  }
  async function reserveSeat(uid) {
    const ref = fb.db.collection("meta").doc("roster");
    return fb.db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const ids = (snap.exists && snap.data().ids) || [];
      if (ids.indexOf(uid) !== -1) return true;
      if (ids.length >= CAP) return false;
      tx.set(ref, { ids: ids.concat(uid), updated: Date.now() }, { merge: true });
      return true;
    });
  }
  async function enterFirebase(name, mail, pass) {
    let cred = null;
    try {
      cred = await fb.auth.createUserWithEmailAndPassword(mail, pass);
      const seat = await reserveSeat(cred.user.uid);
      if (!seat) {
        try { await cred.user.delete(); } catch (_) {}
        await fb.auth.signOut();
        return "Limite de 15 usuários atingido.";
      }
    } catch (e) {
      const code = e && e.code;
      if (code === "auth/email-already-in-use") {
        try { cred = await fb.auth.signInWithEmailAndPassword(mail, pass); }
        catch (_) { return "Senha incorreta para este e-mail."; }
      } else if (code === "auth/weak-password") return "Senha com no mínimo 6 caracteres.";
      else if (code === "auth/invalid-email") return "Informe um e-mail válido.";
      else return "Não foi possível entrar agora.";
    }
    const uid = cred.user.uid;
    await holdToken(cred.user, true);
    const remote = await pullRemote(uid);
    adopt(uid, name, mail, remote);
    return "";
  }
  function enterLocal(name, mail, pass) {
    const list = users();
    let u = list.find((x) => x.email === mail);
    const hash = seal(pass);
    if (!u) {
      if (list.length >= CAP) return "Limite de 15 usuários atingido.";
      u = { id: "u-" + Math.random().toString(36).slice(2, 10), name: name, email: mail, passHash: hash };
      list.push(u);
      saveUsers(list);
    } else if (u.passHash !== hash) {
      return "Senha incorreta para este e-mail.";
    } else {
      u.name = name;
      saveUsers(list);
    }
    adopt(u.id, name, mail, null);
    return "";
  }
  async function enterAccount(name, email, pass) {
    const mail = normEmail(email);
    if (!name) return "Informe o nome.";
    if (!mail || mail.indexOf("@") < 1) return "Informe um e-mail válido.";
    if (!pass || pass.length < 6) return "Senha com no mínimo 6 caracteres.";
    await bootFirebase();
    if (fb) return enterFirebase(name, mail, pass);
    return enterLocal(name, mail, pass);
  }
  function roomLoad() {
    try { const l = JSON.parse(localStorage.getItem(ROOM_KEY) || "[]"); return Array.isArray(l) ? l : []; }
    catch { return []; }
  }
  function roomSave(list) {
    const cut = list.slice(-80);
    try { localStorage.setItem(ROOM_KEY, JSON.stringify(cut)); } catch (_) {}
    return cut;
  }
  const PIRoom = {
    messages: roomLoad(),
    paint(log) {
      const list = this.messages.slice(-40);
      const sig = list.length
        ? list.map((m) => (m.id || "") + "|" + (m.ts || "") + "|" + (m.text || "")).join("\n")
        : "empty";
      if (log.dataset.sig === sig) return;
      log.dataset.sig = sig;
      if (!list.length) {
        log.innerHTML = `<div class="dock-msg them"><span class="who">sala</span>Turma ao vivo. Quem está online vê a mesma conversa.</div>`;
      } else {
        const uid = S && S.me && S.me.id;
        log.innerHTML = list.map((m) => {
          const mine = m.uid === uid;
          const audio = m.audio && String(m.audio).indexOf("data:audio/") === 0
            ? `<audio controls src="${esc(m.audio)}"></audio>` : "";
          return `<div class="dock-msg ${mine ? "me" : "them"}"><span class="who">${esc(m.name || "aluno")}</span>${esc(m.text || "")}${audio}</div>`;
        }).join("");
      }
      log.scrollTop = log.scrollHeight;
    },
    push(msg, broadcast) {
      this.messages = roomSave(this.messages.concat(msg));
      if (broadcast && bus) bus.postMessage({ type: "chat", msg: msg });
      if (broadcast && fb && S && S.entered) {
        fb.db.collection("room").add({
          uid: msg.uid, name: msg.name, text: msg.text || "", ts: msg.ts,
        }).catch(() => {});
        if (msg.audio && fb.storage) {
          const ref = fb.storage.ref().child("room/" + msg.uid + "/" + msg.ts + ".webm");
          ref.putString(msg.audio, "data_url").catch(() => {});
        }
      }
      const log = document.getElementById("dockLog");
      if (log) this.paint(log);
    },
    postText(text) {
      if (!S || !S.me) return;
      this.push({ id: "m" + Date.now(), uid: S.me.id, name: (S.me.name || "Aluno"), text: text, ts: Date.now() }, true);
    },
    note(text) {
      if (!S || !S.me) return;
      this.push({ id: "n" + Date.now(), uid: "sistema", name: "plano", text: text, ts: Date.now() }, false);
    },
  };
  window.PIRoom = PIRoom;
  function readPresence() {
    try { const l = JSON.parse(localStorage.getItem(PRESENCE_KEY) || "[]"); return Array.isArray(l) ? l : []; }
    catch { return []; }
  }
  function paintPresence(list) {
    const box = document.getElementById("presenceList");
    if (!box) return;
    const uid = S && S.me && S.me.id;
    const names = (list || []).map((p) => p.id === uid ? (p.name || "você") + " (você)" : (p.name || "aluno"));
    box.textContent = names.length ? names.join(" · ") : "só você";
  }
  function beat() {
    if (!S || !S.entered || !S.me || !S.me.id) return;
    const now = Date.now();
    const others = readPresence().filter((p) => p.id !== S.me.id && now - (p.ts || 0) < 20000);
    const mine = { id: S.me.id, name: (S.me.name || "Aluno"), ts: now };
    const list = others.concat(mine);
    try { localStorage.setItem(PRESENCE_KEY, JSON.stringify(list)); } catch (_) {}
    if (bus) bus.postMessage({ type: "presence", list: list });
    paintPresence(list);
    if (fb) {
      fb.db.collection("presence").doc(S.me.id).set({ name: mine.name, ts: now }).catch(() => {});
    }
  }
  function dropPresence() {
    if (!S || !S.me) return;
    const list = readPresence().filter((p) => p.id !== S.me.id);
    try { localStorage.setItem(PRESENCE_KEY, JSON.stringify(list)); } catch (_) {}
    if (bus) bus.postMessage({ type: "presence", list: list });
    if (fb && S.me.id) fb.db.collection("presence").doc(S.me.id).delete().catch(() => {});
  }
  function listenFirebase() {
    if (!fb) return;
    fb.db.collection("presence").onSnapshot((snap) => {
      const now = Date.now();
      const list = [];
      snap.forEach((doc) => {
        const d = doc.data() || {};
        if (now - (d.ts || 0) < 25000) list.push({ id: doc.id, name: d.name || "aluno", ts: d.ts });
      });
      if (list.length) paintPresence(list);
    }, () => {});
    fb.db.collection("room").orderBy("ts").limitToLast(40).onSnapshot((snap) => {
      const next = [];
      snap.forEach((doc) => {
        const d = doc.data() || {};
        next.push({ id: doc.id, uid: d.uid, name: d.name, text: d.text || "", ts: d.ts || 0 });
      });
      if (next.length) {
        PIRoom.messages = next;
        const log = document.getElementById("dockLog");
        if (log) PIRoom.paint(log);
      }
    }, () => {});
  }
  function afterEnter() {
    beat();
    if (timer) clearInterval(timer);
    timer = setInterval(beat, 8000);
    listenFirebase();
    const log = document.getElementById("dockLog");
    if (log) PIRoom.paint(log);
  }
  async function exitAccount() {
    dropPresence();
    if (timer) clearInterval(timer);
    timer = 0;
    try { localStorage.removeItem(SESSION_KEY); } catch (_) {}
    jwt = "";
    jwtExp = 0;
    window.__piUserLock = false;
    if (fb) { try { await fb.auth.signOut(); } catch (_) {} }
  }
  async function pushState(s) {
    if (!fb || !fb.auth.currentUser || !s || !s.me || !s.me.id || !s.entered) return;
    if (!(await holdToken(fb.auth.currentUser, false))) return;
    const copy = JSON.parse(JSON.stringify(s));
    delete copy.chats;
    try {
      await fb.db.collection("users").doc(s.me.id).collection("data").doc("state").set({
        state: copy, savedAt: Date.now(),
      });
    } catch (_) {}
  }
  window.PISession = {
    enterAccount: enterAccount,
    exitAccount: exitAccount,
    afterEnter: afterEnter,
    pushState: pushState,
    token: function () { return jwt && jwtExp > Date.now() ? jwt : ""; },
  };

  if (bus) {
    bus.onmessage = (ev) => {
      const data = ev.data || {};
      if (data.type === "presence" && Array.isArray(data.list)) paintPresence(data.list);
      if (data.type === "chat" && data.msg && data.msg.id) {
        if (!PIRoom.messages.some((m) => m.id === data.msg.id)) PIRoom.push(data.msg, false);
      }
    };
  }
  document.addEventListener("click", async (e) => {
    if (e.target && e.target.id === "dockMic") {
      const btn = e.target;
      if (mic) { mic.stop(); return; }
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === "undefined") return;
      let stream = null;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
      catch (_) { btn.textContent = "Áudio"; return; }
      const chunks = [];
      const rec = new MediaRecorder(stream);
      mic = rec;
      btn.textContent = "Parar";
      rec.ondataavailable = (ev2) => { if (ev2.data && ev2.data.size) chunks.push(ev2.data); };
      rec.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        mic = null;
        btn.textContent = "Áudio";
        const blob = new Blob(chunks, { type: rec.mimeType || "audio/webm" });
        if (!blob.size || blob.size > 700000 || !S || !S.me) return;
        const reader = new FileReader();
        reader.onload = () => {
          PIRoom.push({
            id: "a" + Date.now(),
            uid: S.me.id,
            name: S.me.name || "Aluno",
            text: "mensagem de áudio",
            audio: String(reader.result || ""),
            ts: Date.now(),
          }, true);
        };
        reader.readAsDataURL(blob);
      };
      rec.start();
      setTimeout(() => { if (mic === rec && rec.state === "recording") rec.stop(); }, 20000);
    }
  });
  window.addEventListener("pagehide", dropPresence);

  const saved = (() => { try { return JSON.parse(localStorage.getItem(SESSION_KEY) || "null"); } catch { return null; } })();
  bootFirebase().then((on) => {
    if (on && fb) {
      fb.auth.onAuthStateChanged(async (user) => {
        if (!user) return;
        await holdToken(user, true);
        const remote = await pullRemote(user.uid);
        const name = (saved && saved.name) || user.displayName || "";
        adopt(user.uid, name, user.email || (saved && saved.email) || "", remote);
        afterEnter();
        if (typeof render === "function") render({ force: true });
      });
      return;
    }
    if (saved && saved.id && saved.email && window.S) {
      adopt(saved.id, saved.name || "", saved.email, null);
      afterEnter();
      if (typeof render === "function") render({ force: true });
    }
  });
})();
