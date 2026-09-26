import { guard } from "../lib/api-firewall.js";

export function geminiText(j) {
  const list = ((((j || {}).candidates || [])[0] || {}).content || {}).parts || [];
  const visible = list.filter((p) => p && p.text && !p.thought).map((p) => p.text).join("").trim();
  if (visible) return visible;
  return list.map((p) => (p && p.text) || "").join("").trim();
}

async function geminiAnswer(key, prompt) {
  const models = [process.env.GEMINI_MODEL, "gemini-3.5-flash", "gemini-3-flash-preview", "gemini-3.5-flash-lite", "gemini-2.5-flash"].filter(Boolean);
  let last = { text: "", error: { message: "modelo indisponível" } };
  for (const model of models) {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 800 },
      }),
    });
    const j = await r.json().catch(() => ({}));
    const text = geminiText(j);
    if (r.ok && text) return { text: text, error: null };
    const msg = (j.error && (j.error.message || j.error.status)) || "";
    if (/API key not valid|API_KEY_INVALID|invalid api key/i.test(msg)) {
      return { text: "", error: { message: "Incorrect API key", code: "invalid_api_key" } };
    }
    if (j.promptFeedback && j.promptFeedback.blockReason) {
      return { text: "", error: { message: "bloqueada" } };
    }
    last = { text: "", error: j.error || { message: msg || "sem resposta" } };
    // modelo inexistente, cota esgotada ou instável → tenta o próximo modelo
    if (!/not found|NOT_FOUND|is not supported|quota|RESOURCE_EXHAUSTED|rate|overloaded|UNAVAILABLE/i.test(msg) && ![404, 429, 500, 503].includes(r.status)) break;
  }
  return last;
}

export default async function handler(req, res) {
  if (!guard(req, res, { methods: ["POST"], limit: 20, max: 12000, requireOrigin: true })) return;
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const key = String(body.key || "");
  const prompt = String(body.prompt || "").slice(0, 8000);
  const which = body.which === "gemini" || body.which === "claude" || body.which === "copilot" ? body.which : "openai";
  if (!key || !prompt || /[\r\n]/.test(key)) {
    res.status(400).json({ error: "pedido incompleto" });
    return;
  }
  try {
    if (which === "gemini") {
      const out = await geminiAnswer(key, prompt);
      res.status(out.text ? 200 : 502).json(out);
      return;
    }
    if (which === "claude") {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5",
          max_tokens: 700,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const j = await r.json();
      const text = Array.isArray(j.content) ? j.content.map((p) => p.text || "").join("") : "";
      res.status(r.ok ? 200 : 502).json({ text: text, error: j.error || null });
      return;
    }
    if (which === "copilot") {
      const r = await fetch("https://api.githubcopilot.com/chat/completions", {
        method: "POST",
        headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "gpt-4o", messages: [{ role: "user", content: prompt }] }),
      });
      const j = await r.json();
      const text = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "";
      res.status(r.ok ? 200 : 502).json({ text: text, error: j.error || null });
      return;
    }
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const j = await r.json();
    const text = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "";
    res.status(r.ok ? 200 : 502).json({ text: text, error: j.error || null });
  } catch (e) {
    res.status(502).json({ error: "falha" });
  }
}
