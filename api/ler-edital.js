/* Lê o texto de um edital com o Gemini e devolve o comando "edital".
   A chave fica só na Vercel, na variável GEMINI_API_KEY — nunca no navegador.
   Opcional: GEMINI_MODEL para forçar um modelo específico. */

const MODELOS = [
  process.env.GEMINI_MODEL,
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
].filter(Boolean);

const LIMITE_TEXTO = 300000; // caracteres enviados ao Gemini

const INSTRUCAO = `Você lê editais de concurso público brasileiro e devolve SOMENTE um JSON, sem markdown e sem texto fora dele, exatamente neste formato:

{"cargo":"","prova":"","banca":"","inscricao":"","taxa":"","disciplinas":[{"nome":"","questoes":0,"pontos":0,"assuntos":[""]}]}

Regras:
- cargo: nome do cargo (ex.: "Guarda Civil Municipal"). Se houver vários cargos, use o principal ou o primeiro de nível médio da área de segurança; se não der para saber, o primeiro listado.
- prova: data da prova objetiva no formato dd/mm/aaaa. Vazio se não houver data.
- banca: sigla ou nome da banca organizadora (ex.: "IDIB", "Cebraspe").
- inscricao: período de inscrição no formato "dd/mm/aaaa a dd/mm/aaaa". Vazio se não houver.
- taxa: valor da taxa no formato "R$ 0,00". Se houver mais de um valor, use o do cargo escolhido.
- disciplinas: uma entrada por matéria cobrada na prova objetiva do cargo escolhido.
  - nome: nome limpo da matéria (ex.: "Língua Portuguesa", "Noções de Direito Constitucional"). Nunca inclua números, pesos, "mínimo de acertos", "caráter eliminatório", "TOTAL" ou qualquer frase de regra. Junte nomes que o PDF quebrou em duas linhas.
  - questoes: número de questões da matéria, se o quadro de provas informar; senão 0.
  - pontos: total de pontos da matéria (questões x peso), se o quadro informar; senão 0.
  - assuntos: os tópicos do conteúdo programático dessa matéria, um por item, curtos e sem numeração. Lista vazia se o edital não trouxer.
- Não inclua redação/prova discursiva, títulos, avaliação física, psicológica ou etapas como disciplina.
- Nunca invente nada: o que não estiver no texto fica vazio ou 0.`;

function limpar(v, n) {
  return String(v == null ? "" : v).replace(/\s+/g, " ").trim().slice(0, n);
}

function numero(v) {
  const n = Number(String(v == null ? "" : v).replace(",", "."));
  return Number.isFinite(n) && n > 0 && n < 1000 ? n : 0;
}

function validar(p) {
  const saida = {
    comando: "edital",
    cargo: limpar(p && p.cargo, 120),
    prova: limpar(p && p.prova, 20),
    banca: limpar(p && p.banca, 60),
    inscricao: limpar(p && p.inscricao, 40),
    taxa: limpar(p && p.taxa, 40),
    disciplinas: [],
  };
  if (!/^\d{1,2}\/\d{2}\/\d{4}$/.test(saida.prova)) saida.prova = "";
  const vistos = {};
  (Array.isArray(p && p.disciplinas) ? p.disciplinas : []).slice(0, 40).forEach((d) => {
    const nome = limpar(d && d.nome, 72).replace(/(?:\s+\d{1,3}){1,3}$/, "").trim();
    if (nome.length < 3) return;
    const chave = nome.toLowerCase();
    if (vistos[chave]) return;
    vistos[chave] = 1;
    const assuntos = (Array.isArray(d.assuntos) ? d.assuntos : [])
      .map((a) => limpar(a, 180))
      .filter((a) => a.length >= 2)
      .slice(0, 120);
    saida.disciplinas.push({ nome, questoes: numero(d.questoes), pontos: numero(d.pontos), assuntos });
  });
  return saida;
}

function extrairJson(texto) {
  const t = String(texto || "").trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  try { return JSON.parse(t); } catch (e) { /* tenta achar o objeto dentro do texto */ }
  const i = t.indexOf("{");
  const j = t.lastIndexOf("}");
  if (i >= 0 && j > i) {
    try { return JSON.parse(t.slice(i, j + 1)); } catch (e) { /* sem JSON */ }
  }
  return null;
}

async function chamarGemini(modelo, chave, texto) {
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + encodeURIComponent(modelo) + ":generateContent";
  const r = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": chave },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: INSTRUCAO }] },
      contents: [{ role: "user", parts: [{ text: "Texto do edital:\n\n" + texto }] }],
      generationConfig: { temperature: 0, responseMimeType: "application/json" },
    }),
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) {
    const msg = (data && data.error && data.error.message) || "HTTP " + r.status;
    const err = new Error(limpar(msg, 200));
    err.status = r.status;
    throw err;
  }
  const partes = (((data.candidates || [])[0] || {}).content || {}).parts || [];
  return partes.map((p) => p.text || "").join("");
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, motivo: "Use POST." });
  }

  const chave = process.env.GEMINI_API_KEY;
  if (!chave) {
    return res.status(500).json({ ok: false, motivo: "A chave GEMINI_API_KEY não está configurada na Vercel." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch (e) { body = {}; }
  }
  const texto = String((body && body.texto) || "").slice(0, LIMITE_TEXTO);
  if (texto.replace(/\s/g, "").length < 40) {
    return res.status(400).json({ ok: false, motivo: "O arquivo não trouxe texto para a IA." });
  }

  let ultimoErro = "sem resposta";
  for (const modelo of MODELOS) {
    try {
      const resposta = await chamarGemini(modelo, chave, texto);
      const json = extrairJson(resposta);
      if (!json) { ultimoErro = "a IA não devolveu JSON"; continue; }
      const comando = validar(json);
      if (!comando.disciplinas.length && !comando.cargo) { ultimoErro = "a IA não achou dados do edital"; continue; }
      return res.status(200).json({ ok: true, modelo, comando });
    } catch (e) {
      ultimoErro = e.message || "erro";
      // chave inválida: não adianta tentar outro modelo
      if (e.status === 400 && /api key/i.test(ultimoErro)) break;
      if (e.status === 401) break;
    }
  }
  return res.status(502).json({ ok: false, motivo: "Leitura com IA falhou: " + ultimoErro });
};

module.exports.config = { maxDuration: 60 };
