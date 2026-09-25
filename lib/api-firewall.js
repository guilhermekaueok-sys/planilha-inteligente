var hits = new Map();

function hostOf(req) {
  return String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
}

export function guard(req, res, opt) {
  var rule = opt || {};
  var method = req.method || "GET";
  var allow = rule.methods || ["GET", "POST"];
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Cache-Control", "no-store");
  if (allow.indexOf(method) < 0) {
    res.status(405).json({ error: "method" });
    return false;
  }
  var ip = String(req.headers["x-forwarded-for"] || "local").split(",")[0].trim() || "local";
  var now = Date.now();
  var row = (hits.get(ip) || []).filter(function (t) { return now - t < 60000; });
  if (row.length >= (rule.limit || 30)) {
    res.status(429).json({ error: "limite" });
    return false;
  }
  row.push(now);
  hits.set(ip, row);
  if (hits.size > 500) hits.clear();
  var origin = String(req.headers.origin || "");
  var host = hostOf(req);
  if (origin) {
    var same = host && origin.indexOf(host) !== -1;
    var known = origin.indexOf("https://planilha-inteligente-bessarastreamento.vercel.app") === 0 || origin.indexOf("http://127.0.0.1") === 0 || origin.indexOf("http://localhost") === 0;
    if (!same && !known) {
      res.status(403).json({ error: "origem" });
      return false;
    }
  } else if (rule.requireOrigin) {
    res.status(403).json({ error: "origem" });
    return false;
  }
  if (method === "POST") {
    var len = Number(req.headers["content-length"] || 0);
    if (len > (rule.max || 12000)) {
      res.status(413).json({ error: "corpo" });
      return false;
    }
  }
  return true;
}
