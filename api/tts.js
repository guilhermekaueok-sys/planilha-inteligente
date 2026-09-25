import { guard } from "../lib/api-firewall.js";

var BRIEF = "Fale em português do Brasil, sotaque brasileiro nativo, voz masculina adulta, clara e natural. Sem sotaque inglês, sem tom de robô. Pause nas vírgulas e nos pontos.";

async function synth(key, text, model, extra) {
  return fetch("https://api.openai.com/v1/audio/speech", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify(Object.assign({ model: model, voice: "ash", input: text, response_format: "mp3" }, extra || {})),
  });
}

export default async function handler(req, res) {
  if (!guard(req, res, { methods: ["POST"], limit: 12, max: 8000, requireOrigin: true })) return;
  var body = req.body && typeof req.body === "object" ? req.body : {};
  var key = String(body.key || "");
  var text = String(body.text || "").slice(0, 900);
  if (!key || !text || /[\r\n]/.test(key)) {
    res.status(400).json({ error: "pedido" });
    return;
  }
  try {
    var r = await synth(key, text, "gpt-4o-mini-tts", { instructions: BRIEF });
    if (!r.ok) r = await synth(key, text, "tts-1-hd");
    if (!r.ok) {
      res.status(502).json({ error: "voz" });
      return;
    }
    var buf = Buffer.from(await r.arrayBuffer());
    res.setHeader("Content-Type", "audio/mpeg");
    res.status(200).send(buf);
  } catch (e) {
    res.status(502).json({ error: "voz" });
  }
}
