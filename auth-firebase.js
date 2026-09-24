(function (w) {
  const CAP = 15;
  const TOKEN_KEY = "pi-jwt";
  let app = null;
  let auth = null;
  let db = null;
  function configured() {
    const c = w.FIREBASE_CONFIG || {};
    return !!(c.apiKey && c.projectId && c.appId && w.firebase);
  }
  function saveToken(token) {
    try {
      if (token) sessionStorage.setItem(TOKEN_KEY, token);
      else sessionStorage.removeItem(TOKEN_KEY);
    } catch (_) {}
  }
  async function freshToken(force) {
    const user = auth && auth.currentUser;
    if (!user) return "";
    const token = await user.getIdToken(!!force);
    saveToken(token);
    return token;
  }
  w.PIAuth = {
    enabled() { return configured() && !!auth; },
    token() { try { return sessionStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; } },
    async boot() {
      if (!configured()) return false;
      if (app) return true;
      app = w.firebase.initializeApp(w.FIREBASE_CONFIG);
      auth = w.firebase.auth();
      db = w.firebase.firestore();
      auth.setPersistence(w.firebase.auth.Auth.Persistence.LOCAL);
      return true;
    },
    async login(name, email, pass) {
      await this.boot();
      if (!this.enabled()) return { error: "" };
      if (!pass || pass.length < 6) return { error: "Senha de no mínimo 6 caracteres." };
      let cred;
      try {
        cred = await auth.signInWithEmailAndPassword(email, pass);
      } catch (err) {
        if (err && err.code === "auth/user-not-found") {
          cred = await auth.createUserWithEmailAndPassword(email, pass);
        } else if (err && err.code === "auth/wrong-password") {
          return { error: "Senha incorreta." };
        } else {
          return { error: (err && err.message) || "Falha no login." };
        }
      }
      const uid = cred.user.uid;
      const token = await freshToken(true);
      const pulled = await this.pullState(uid);
      return { uid, token, state: pulled };
    },
    async logout() {
      saveToken("");
      if (auth) try { await auth.signOut(); } catch (_) {}
    },
    async pullState(uid) {
      if (!this.enabled() || !uid) return null;
      const snap = await db.collection("users").doc(uid).collection("data").doc("state").get();
      return snap.exists ? snap.data() : null;
    },
    async pushState(uid, state) {
      if (!this.enabled() || !uid || !state) return;
      await freshToken(false);
      await db.collection("users").doc(uid).collection("data").doc("state").set(JSON.parse(JSON.stringify(state)));
    },
    async beat(uid, name) {
      if (!this.enabled() || !uid) return;
      await db.collection("presence").doc(uid).set({ name: name || "Aluno", ts: Date.now() });
    },
    async online() {
      if (!this.enabled()) return [];
      const from = Date.now() - 25000;
      const snap = await db.collection("presence").where("ts", ">", from).get();
      return snap.docs.map((d) => ({ id: d.id, ...(d.data() || {}) }));
    }
  };
})(window);
