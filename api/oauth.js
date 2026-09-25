import crypto from "crypto";
import { guard } from "../lib/api-firewall.js";

var PROVIDERS = {
  google: {
    mode: "oauth",
    slot: "gemini",
    auth: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    scope: "openid email profile",
    id: "GOOGLE_CLIENT_ID",
    secret: "GOOGLE_CLIENT_SECRET",
    note: "Liga a conta Google com PKCE. O Gemini de chat continua aceitando a chave deste aparelho; o token não é gravado no navegador.",
  },
  microsoft: {
    mode: "oauth",
    slot: "copilot",
    auth: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    scope: "openid profile offline_access User.Read",
    id: "MICROSOFT_CLIENT_ID",
    secret: "MICROSOFT_CLIENT_SECRET",
    note: "Liga a conta Microsoft com PKCE. Este token não abre o chat do Copilot; a chave do Copilot continua neste aparelho.",
  },
  openai: {
    mode: "chave",
    slot: "chatgpt",
    note: "A API de chat da OpenAI autentica com chave Bearer. Não há OAuth de usuário para essa chamada.",
  },
  anthropic: {
    mode: "chave",
    slot: "claude",
    note: "A API da Anthropic autentica com a chave no cabeçalho x-api-key. Não há OAuth de usuário para essa chamada.",
  },
};

function origin(req) {
  var host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  var proto = req.headers["x-forwarded-proto"] || "https";
  return proto + "://" + host;
}

function b64url(buf) {
  return Buffer.from(buf).toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function readCookie(req) {
  var raw = String(req.headers.cookie || "");
  var m = raw.match(/(?:^|; )pi_oa=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

function page(slot, token, error) {
  var payload = JSON.stringify({ type: "pi-oauth", provider: slot, token: token || "", error: error || "" });
  return "<!doctype html><meta charset=utf-8><title>OAuth</title><p>" + (error || "Conta ligada. Esta janela pode fechar.") + "</p><script>var msg=" + payload + ";if(window.opener)window.opener.postMessage(msg,location.origin);</script>";
}

export default async function handler(req, res) {
  if (!guard(req, res, { methods: ["GET"], limit: 20 })) return;
  var q = req.query || {};
  var name = String(q.provider || "");
  var step = String(q.step || "");
  if (!name) {
    res.status(200).json({
      ok: true,
      pkce: "S256",
      integrations: Object.keys(PROVIDERS).map(function (key) {
        var p = PROVIDERS[key];
        return {
          provider: key,
          slot: p.slot,
          mode: p.mode,
          auth: p.auth || "",
          token: p.token || "",
          scope: p.scope || "",
          configured: p.mode === "oauth" ? !!(process.env[p.id] && process.env[p.secret]) : false,
          note: p.note,
        };
      }),
      exemplo: "veja /exemplo-ia.js",
    });
    return;
  }
  var spec = PROVIDERS[name];
  if (!spec) {
    res.status(404).json({ error: "provedor" });
    return;
  }
  if (spec.mode !== "oauth") {
    res.status(400).json({ error: "sem oauth", note: spec.note, exemplo: "veja /exemplo-ia.js" });
    return;
  }
  var id = process.env[spec.id] || "";
  var secret = process.env[spec.secret] || "";
  var back = origin(req) + "/api/oauth?provider=" + encodeURIComponent(name) + "&step=callback";
  if (!id || !secret) {
    res.status(501).json({ error: "falta " + spec.id + " e " + spec.secret, note: spec.note, exemplo: "veja /exemplo-ia.js" });
    return;
  }
  if (step !== "callback") {
    var verifier = b64url(crypto.randomBytes(32));
    var challenge = b64url(crypto.createHash("sha256").update(verifier).digest());
    var url = spec.auth + "?response_type=code&client_id=" + encodeURIComponent(id) + "&redirect_uri=" + encodeURIComponent(back) + "&scope=" + encodeURIComponent(spec.scope) + "&state=" + encodeURIComponent(name) + "&code_challenge=" + challenge + "&code_challenge_method=S256";
    res.setHeader("Set-Cookie", "pi_oa=" + encodeURIComponent(verifier) + "; HttpOnly; Secure; SameSite=Lax; Max-Age=600; Path=/api/oauth");
    res.status(302);
    res.setHeader("Location", url);
    res.end();
    return;
  }
  var verifierBack = readCookie(req);
  res.setHeader("Set-Cookie", "pi_oa=; HttpOnly; Secure; SameSite=Lax; Max-Age=0; Path=/api/oauth");
  if (String(q.state || "") !== name || !q.code || !verifierBack) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(400).send(page(spec.slot, "", "A sessão OAuth expirou ou foi recusada."));
    return;
  }
  try {
    var r = await fetch(spec.token, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: "grant_type=authorization_code&code=" + encodeURIComponent(q.code) + "&redirect_uri=" + encodeURIComponent(back) + "&client_id=" + encodeURIComponent(id) + "&client_secret=" + encodeURIComponent(secret) + "&code_verifier=" + encodeURIComponent(verifierBack),
    });
    var j = await r.json();
    var token = j.access_token || "";
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(r.ok && token ? 200 : 502).send(page(spec.slot, token, token ? "" : "O provedor não devolveu o token."));
  } catch (e) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(502).send(page(spec.slot, "", "Falha ao trocar o código."));
  }
}
