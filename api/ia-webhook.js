import { guard } from "../lib/api-firewall.js";

var ALLOW = { hours: 1, done: 1, log: 1, sim: 1, nota: 1, week: 1, topic: 1, topicadd: 1, drop: 1, edital: 1 };

function clean(list) {
  return (Array.isArray(list) ? list : []).filter(function (a) { return a && ALLOW[a.op]; }).slice(0, 6);
}

export default function handler(req, res) {
  if (!guard(req, res, { methods: ["GET", "POST"], limit: 20, max: 8000 })) return;
  if (req.method === "GET") {
    res.status(200).json({ ok: true, exemplo: "veja /exemplo-ia.js" });
    return;
  }
  var env = process.env.PI_WEBHOOK_SECRET;
  if (env && req.headers["x-pi-webhook"] !== env) {
    res.status(401).json({ error: "secret" });
    return;
  }
  var body = req.body && typeof req.body === "object" ? req.body : {};
  res.status(200).json({
    ok: true,
    text: String(body.text || "").slice(0, 500),
    actions: clean(body.actions),
  });
}
