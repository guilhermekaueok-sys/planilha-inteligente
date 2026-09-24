document.addEventListener("click", (e) => {
  const nav = e.target.closest("[data-nav]");
  if (nav) { page = nav.dataset.nav; $("side").classList.remove("open"); render(); }
  const go = e.target.closest("[data-go]");
  if (go) { page = go.dataset.go; render(); }
  if (e.target.id === "menu") $("side").classList.toggle("open");
  if (e.target.id === "gateStart") {
    const name = (($("gateName") && $("gateName").value) || "").trim();
    const email = (($("gateEmail") && $("gateEmail").value) || "").trim();
    const pass = (($("gatePass") && $("gatePass").value) || "").trim();
    const err = $("gateErr");
    enterAccount(name, email, pass).then((msg) => {
      if (msg) { if (err) err.textContent = msg; return; }
      render();
    });
    return;
  }
  if (e.target.id === "logoutBtn") {
    exitAccount().then(() => render());
    return;
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
  if (e.target.id === "dockSend") {
    const inp = $("dockIn");
    if (inp && inp.value.trim()) sendPlanChat(inp);
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
});
window.addEventListener("pagehide", () => { dropPresence(); flushNow(); });
setInterval(beatPresence, 8000);
if (S.entered) beatPresence();
if (window.PI) { PI.mergePages(pages); PI.use("gcm-nisia"); PI.hook("boot", S); }
render({ force: true });
