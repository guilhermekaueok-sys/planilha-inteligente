var FEED = [
  { key: "qc", source: "Qconcursos", st: "ABERTO", date: "2026-09-24", title: "CISAMAVI abre 7 vagas", text: "Edital 01/2026 no Alto Vale do Itajaí. Inscrições de 25 de setembro a 28 de outubro. Prova prevista para 15 de novembro.", href: "https://folha.qconcursos.com/n/consorcio-publico-interfederativo-de-saude-e-multifinalitario-do-alto-vale-do-itajai-abre-concurso-com-7-vagas" },
  { key: "est", source: "Estratégia Concursos", st: "ABERTO", date: "2026-09-24", title: "Concursos abertos, até R$ 32 mil", text: "Panorama do dia 24. Destaque: PC AP, Cesgranrio, 396 vagas, inscrições até 19 de outubro e prova em 6 de dezembro.", href: "https://www.estrategiaconcursos.com.br/blog/concursos-abertos/" },
  { key: "gran", source: "Gran Cursos", st: "IMINENTE", date: "2026-09-21", title: "Curitiba publica 348 vagas", text: "Três editais da Prefeitura. Inscrições a partir de 7 de outubro. Iniciais que chegam a R$ 38 mil no cargo de procurador.", href: "https://blog.grancursosonline.com.br/concurso-curitiba-pr-editais-publicados-2026/" },
  { key: "g1", source: "g1", st: "ABERTO", date: "2026-09-22", title: "IFPA abre 65 vagas", text: "Salários de até R$ 5,2 mil. Inscrições até 20 de outubro pelo Instituto AOCP.", href: "https://g1.globo.com/pa/para/noticia/2026/09/22/ifpa-abre-concurso-publico-com-65-vagas-e-salarios-de-ate-r-52-mil-saiba-como-se-inscrever.ghtml" },
  { key: "ape", source: "APE Concursos", st: "FONTE", date: "2026-09-25", title: "Portal sem edição acessível hoje", text: "A busca diária não abriu o site da APE. Nenhuma manchete foi inventada. O card troca quando a fonte publicar.", href: "https://apeconcursos.com.br/" },
];

export default function handler(req, res) {
  var cut = Date.now() - 12 * 86400000;
  var items = FEED.filter(function (n) {
    var t = Date.parse(n.date);
    return !isNaN(t) && t >= cut;
  });
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).json({ updated: new Date().toISOString().slice(0, 10), items: items });
}
