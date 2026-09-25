const CACHE = "planilha-inteligente-v15";
const ASSETS = ["./", "./index.html", "./styles.css", "./app.js", "./session.js", "./firebase-config.js", "./engine.js", "./projetos/gcm-nisia.js", "./manifest.json", "./icon.svg", "./logo.jpg", "./logo-pi.svg"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  var url = e.request.url;
  if (e.request.destination === "video" || url.indexOf("orbe-loop") !== -1) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    fetch(e.request).then((res) => {
      if (res.ok && res.type === "basic") {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      }
      return res;
    }).catch(() => caches.match(e.request))
  );
});
