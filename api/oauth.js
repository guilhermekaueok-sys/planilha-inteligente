var PROVIDERS = {
  google: {
    auth: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    scope: "openid email",
    id: "GOOGLE_CLIENT_ID",
    secret: "GOOGLE_CLIENT_SECRET",
    slot: "gemini",
  },
  microsoft: {
    auth: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    scope: "openid profile offline_access",
    id: "MICROSOFT_CLIENT_ID",
    secret: "MICROSOFT_CLIENT_SECRET",
    slot: "copilot",
  },
  openai: {
    auth: "https://auth.openai.com/authorize",
    token: "https://auth.openai.com/oauth/token",
    scope: "openid",
    id: "OPENAI_CLIENT_ID",
    secret: "OPENAI_CLIENT_SECRET",
    slot: "chatgpt",
  },
  anthropic: {
    auth: "https://console.anthropic.com/oauth/authorize",
    token: "https://console.anthropic.com/oauth/token",
    scope: "openid",
    id: "ANTHROPIC_CLIENT_ID",
    secret: "ANTHROPIC_CLIENT_SECRET",
    slot: "claude",
  },
};

function origin(req) {
  var host = req.headers["x-forwarded-host"] || req.headers.host || "";
  var proto = req.headers["x-forwarded-proto"] || "https";
  return proto + "://" + host;
}

function page(slot, token, error) {
  var payload = JSON.stringify({ type: "pi-oauth", provider: slot, token: token || "", error: error || "" });
  return "<!doctype html><meta charset=utf-8><title>OAuth</title><p>" + (error || "Conectado. Pode fechar.") + "</p><script>var msg=" + payload + ";if(window.opener)window.opener.postMessage(msg,location.origin);</script>";
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.status(405).json({ error: "method" });
    return;
  }
  var q = req.query || {};
  var name = String(q.provider || "");
  var step = String(q.step || "start");
  var spec = PROVIDERS[name];
  if (!spec) {
    res.status(200).json({
      ok: true,
      providers: Object.keys(PROVIDERS),
      exemplo: "veja /exemplo-ia.js",
    });
    return;
  }
  var id = process.env[spec.id] || "";
  var secret = process.env[spec.secret] || "";
  var back = origin(req) + "/api/oauth?provider=" + encodeURIComponent(name) + "&step=callback";
  if (!id || !secret) {
    res.status(501).json({ error: "falta " + spec.id + " e " + spec.secret, exemplo: "veja /exemplo-ia.js" });
    return;
  }
  if (step === "start") {
    var url = spec.auth + "?response_type=code&client_id=" + encodeURIComponent(id) + "&redirect_uri=" + encodeURIComponent(back) + "&scope=" + encodeURIComponent(spec.scope) + "&state=" + encodeURIComponent(name);
    res.status(302);
    res.setHeader("Location", url);
    res.end();
    return;
  }
  if (String(q.state || "") !== name || !q.code) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(400).send(page(spec.slot, "", "OAuth recusado."));
    return;
  }
  try {
    var r = await fetch(spec.token, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=authorization_code&code=" + encodeURIComponent(q.code) + "&redirect_uri=" + encodeURIComponent(back) + "&client_id=" + encodeURIComponent(id) + "&client_secret=" + encodeURIComponent(secret),
    });
    var j = await r.json();
    var token = j.access_token || "";
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(r.ok && token ? 200 : 502).send(page(spec.slot, token, token ? "" : "O token não veio."));
  } catch (e) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(502).send(page(spec.slot, "", "Falha ao trocar o código."));
  }
}
