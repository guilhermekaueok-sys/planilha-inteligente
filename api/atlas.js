export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method" });
    return;
  }
  const body = req.body && typeof req.body === "object" ? req.body : {};
  const key = String(body.key || "");
  const prompt = String(body.prompt || "").slice(0, 8000);
  if (!key || !prompt) {
    res.status(400).json({ error: "pedido incompleto" });
    return;
  }
  try {
    if (body.which === "gemini") {
      const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + encodeURIComponent(key), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      });
      const j = await r.json();
      const text = j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts
        ? j.candidates[0].content.parts.map((p) => p.text || "").join("")
        : "";
      res.status(r.ok ? 200 : 502).json({ text: text, error: j.error || null });
      return;
    }
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: "Você revisa o plano do ATLAS. Devolva só JSON, sem markdown." },
          { role: "user", content: prompt },
        ],
      }),
    });
    const j = await r.json();
    const text = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : "";
    res.status(r.ok ? 200 : 502).json({ text: text, error: j.error || null });
  } catch (e) {
    res.status(502).json({ error: "falha" });
  }
}
