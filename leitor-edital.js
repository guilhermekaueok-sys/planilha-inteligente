/* Leitor de edital. A saída é só o comando que a plataforma grava. */
(function (root) {
  var BANCAS = [
    { nome: "Cebraspe", re: /\b(?:cebraspe|cespe(?:\s*\/\s*cebraspe)?|centro de sele[cç][aã]o e de promo[cç][aã]o de eventos)\b/i },
    { nome: "FGV", re: /\b(?:fgv|fundação getulio vargas|fundacao getulio vargas)\b/i },
    { nome: "FCC", re: /\b(?:fcc|fundação carlos chagas|fundacao carlos chagas)\b/i },
    { nome: "Vunesp", re: /\b(?:vunesp|fundação para o vestibular da unesp|fundacao para o vestibular da unesp)\b/i },
    { nome: "IBFC", re: /\b(?:ibfc|instituto brasileiro de forma[cç][aã]o e capacita[cç][aã]o)\b/i },
    { nome: "IDECAN", re: /\b(?:idecan|instituto de desenvolvimento educacional,?\s*cultural e assistencial nacional)\b/i },
    { nome: "Selecon", re: /\bselecon\b/i },
    { nome: "AOCP", re: /\b(?:aocp|assessoria em organiza[cç][aã]o de concursos p[uú]blicos)\b/i },
    { nome: "Quadrix", re: /\b(?:quadrix|instituto quadrix)\b/i },
    { nome: "IADES", re: /\biades\b/i },
    { nome: "CONSULPLAN", re: /\bconsulplan\b/i },
    { nome: "Instituto AOCP", re: /\binstituto aocp\b/i },
    { nome: "FUNDEP", re: /\b(?:fundep|fundep gest[aã]o de concursos)\b/i },
    { nome: "FUNCAB", re: /\bfuncab\b/i },
    { nome: "CETRO", re: /\bcetro\b/i },
    { nome: "IBADE", re: /\bibade\b/i },
    { nome: "CPCON", re: /\bcpcon\b/i },
    { nome: "OBJETIVA", re: /\bobjetiva concursos\b/i },
    { nome: "INSTITUTO ACCESS", re: /\binstituto access\b/i },
    { nome: "FUNDATEC", re: /\bfundatec\b/i },
    { nome: "CESGRANRIO", re: /\bcesgranrio\b/i },
    { nome: "CONSULTEC", re: /\bconsultec\b/i },
    { nome: "IMA", re: /\binstituto mais\b/i },
    { nome: "UNIVERSA", re: /\buniversa\b/i },
    { nome: "IDIB", re: /\bidib\b/i },
    { nome: "ADM&TEC", re: /\badm\s*&\s*tec\b/i },
    { nome: "FEPESE", re: /\bfepese\b/i },
    { nome: "COPESE", re: /\bcopese\b/i },
    { nome: "NC-UFPR", re: /\b(?:nc[-\s]?ufpr|n[uú]cleo de concursos da ufpr)\b/i },
    { nome: "UECE-CEV", re: /\b(?:cev\/uece|uece)\b/i },
    { nome: "COMVEST", re: /\bcomvest\b/i }
  ];
  var GATILHOS_CONTEUDO = [
    /conte[uú]do(?:s)? program[aá]tico(?:s)?/i,
    /programa(?:s)? (?:das|de) (?:disciplinas|provas|mat[eé]rias)/i,
    /dos conhecimentos(?: exigidos| espec[ií]ficos| b[aá]sicos)?/i,
    /conhecimentos (?:b[aá]sicos|espec[ií]ficos|gerais)/i,
    /anexo\s+[ivxlcdm0-9]+\s*[-–—:]?\s*(?:disciplinas|conte[uú]do|programa)/i,
    /objetos de avalia[cç][aã]o/i,
    /conte[uú]do(?:s)? da(?:s)? prova(?:s)?/i,
    /mat[eé]rias(?: e assuntos)? da prova/i,
    /programa de provas/i
  ];
  var FIM_CONTEUDO = [
    /^anexo\s+[ivxlcdm0-9]+\b(?!.*(?:disciplina|conte[uú]do|programa))/i,
    /crit[eé]rios de (?:desempate|avalia[cç][aã]o|classifica[cç][aã]o)/i,
    /disposi[cç][oõ]es (?:finais|preliminares|gerais)/i,
    /cronograma/i,
    /quadro de vagas/i,
    /das inscri[cç][oõ]es/i,
    /da taxa de inscri[cç][aã]o/i,
    /do recurso/i,
    /da convoca[cç][aã]o/i,
    /modelo de procura[cç][aã]o/i,
    /requerimento de/i
  ];
  var NAO_DISCIPLINA = [
    /^anexo\b/i, /^cap[ií]tulo\b/i, /^t[ií]tulo\b/i, /^se[cç][aã]o\b/i,
    /disposi[cç][oõ]es (?:preliminares|gerais|finais)/i,
    /crit[eé]rios? de (?:desempate|pontua[cç][aã]o|avalia[cç][aã]o|elimina[cç][aã]o)/i,
    /cronograma/i, /calend[aá]rio/i, /cabe[cç]alho/i, /p[aá]gina\s+\d+/i, /^edital\b/i,
    /taxa de inscri[cç][aã]o/i, /per[ií]odo de inscri[cç][aã]o/i,
    /quadro de (?:vagas|provas|pontua[cç][aã]o)/i, /nota(?:s)? (?:m[ií]nima|de corte)/i,
    /pontua[cç][aã]o/i, /desempate/i, /prova objetiva/i, /prova discursiva/i, /prova pr[aá]tica/i,
    /reda[cç][aã]o oficial/i, /^observa[cç][oõ]es?\b/i, /^aten[cç][aã]o\b/i, /^importante\b/i,
    /hor[aá]rio de aplica[cç][aã]o/i, /local de prova/i, /documentos? de identifica[cç][aã]o/i,
    /^sum[aá]rio\b/i, /^[ií]ndice\b/i, /continua[cç][aã]o/i, /^www\./i, /^https?:/i,
    /inscri[cç][aã]o/i, /deferiment/i, /comprovante/i, /concurso p[uú]blico/i,
    /requisito/i, /\bvagas\b/i, /investidura/i, /defici[eê]ncia/i, /candidato/i,
    /correio eletr/i, /telefone/i,
    /^\d+\s*$/, /^[-–—•·*.\s]+$/
  ];

  function normalizarEspacos(s) {
    return String(s || "").replace(/\u00a0/g, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim();
  }
  function limparLinha(s) {
    return String(s || "").replace(/\s+/g, " ").replace(/^[\s\d.)\-–—•·*]+/, "").replace(/[.;:,\s]+$/, "").trim();
  }
  function ehNaoDisciplina(nome) {
    var n = limparLinha(nome);
    if (!n || n.length < 3 || n.length > 120) return true;
    if (/^\d+([.)]\d+)*$/.test(n)) return true;
    return NAO_DISCIPLINA.some(function (re) { return re.test(n); });
  }
  function pareceDisciplina(linha) {
    var l = limparLinha(linha);
    if (ehNaoDisciplina(l)) return false;
    var maiusculas = l === l.toUpperCase() && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(l);
    var numerada = /^(?:\d{1,2}|[IVXLC]{1,6})[.)\-\s]+/.test(linha.trim());
    var resto = limparLinha(linha.replace(/^(?:\d{1,2}|[IVXLC]{1,6})[.)\-\s]+/, ""));
    var restoMaiusculo = resto === resto.toUpperCase() && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(resto);
    var rotulo = /^(?:disciplina|mat[eé]ria|conhecimento(?:s)?(?:\s+(?:b[aá]sicos|espec[ií]ficos|gerais))?)\s*[:\-–—]/i.test(linha.trim());
    var curta = l.split(" ").length <= 12 && !/[.!?]$/.test(l);
    return (maiusculas && curta && !numerada) || (numerada && restoMaiusculo && curta) || rotulo;
  }
  function detectarBanca(texto) {
    var cabeca = texto.slice(0, 12000);
    for (var i = 0; i < BANCAS.length; i++) {
      if (BANCAS[i].re.test(cabeca) || BANCAS[i].re.test(texto)) return BANCAS[i].nome;
    }
    var m = texto.match(/banca(?:\s+organizadora)?\s*[:\-–—]\s*([^\n]{3,80})/i);
    return m ? limparLinha(m[1]).slice(0, 40) : "";
  }
  function detectarCargo(texto) {
    var pats = [
      /cargo(?:\s*\/\s*especialidade)?\s*[:\-–—]\s*([^\n]{3,120})/i,
      /para o cargo de\s+([^\n.]{3,120})/i,
      /emprego(?:\s+p[uú]blico)?\s*[:\-–—]\s*([^\n]{3,120})/i,
      /concurso p[uú]blico para\s+([A-Za-zÀ-ú][^\n]{3,80})/i
    ];
    for (var i = 0; i < pats.length; i++) {
      var m = texto.match(pats[i]);
      if (m) return limparLinha(m[1]).slice(0, 120);
    }
    return "";
  }
  function detectarProva(texto) {
    var linhas = String(texto || "").split(/\n/).filter(function (l) { return /prova|aplica[cç]/i.test(l) && !/inscri/i.test(l); });
    var m = linhas.join("\n").match(/(\d{1,2}\/\d{1,2}\/\d{2,4})/);
    if (m) return m[1];
    var porExtenso = String(texto || "").match(/(?:prova|aplica[cç][aã]o)[\s\S]{0,40}?(\d{1,2})\s+de\s+(janeiro|fevereiro|mar[cç]o|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/i);
    if (!porExtenso) return "";
    var meses = { janeiro: "01", fevereiro: "02", marco: "03", março: "03", abril: "04", maio: "05", junho: "06", julho: "07", agosto: "08", setembro: "09", outubro: "10", novembro: "11", dezembro: "12" };
    var mes = meses[porExtenso[2].toLowerCase()] || "";
    return mes ? ("0" + porExtenso[1]).slice(-2) + "/" + mes + "/" + porExtenso[3] : "";
  }
  function detectarInscricao(texto) {
    var re = /(?:per[ií]odo|prazo)\s+de\s+inscri[cç][aã]o[^\n]{0,180}/gi;
    var m;
    while ((m = re.exec(texto))) {
      var datas = m[0].match(/(\d{1,2}\/\d{1,2}\/\d{2,4})\s*(?:a|at[eé]|–|-)\s*(\d{1,2}\/\d{1,2}\/\d{2,4})/);
      if (datas) return datas[1] + " a " + datas[2];
    }
    return "";
  }
  function detectarTaxa(texto) {
    var m = texto.match(/taxa\s+de\s+inscri[cç][aã]o[\s\S]{0,180}?(R\$\s*[\d.]+[.,]\d{2})/i)
      || texto.match(/(?:valor|import[aâ]ncia)\s+(?:da\s+)?taxa[\s\S]{0,80}?(R\$\s*[\d.]+[.,]\d{2})/i);
    if (!m) return "";
    var v = m[1].replace(/\s+/g, " ");
    if (/^R\$\s*\d+\.\d{2}$/.test(v)) v = v.replace(".", ",");
    return v;
  }
  function extrairBlocoConteudo(texto) {
    var forte = [
      /conte[uú]do(?:s)? program[aá]tico(?:s)?/i,
      /programa de provas/i,
      /programa(?:s)? (?:das|de) (?:disciplinas|provas|mat[eé]rias)/i
    ];
    var inicio = -1;
    var lista = forte.concat(GATILHOS_CONTEUDO);
    for (var n = 0; n < lista.length && inicio < 0; n++) {
      var m = lista[n].exec(texto);
      if (m) inicio = m.index;
    }
    if (inicio < 0) return "";
    var linhas = texto.slice(inicio).split(/\n/);
    var out = [];
    for (var i = 0; i < linhas.length; i++) {
      var l = linhas[i].trim();
      if (i > 8 && FIM_CONTEUDO.some(function (re) { return re.test(l); }) && !GATILHOS_CONTEUDO.some(function (re) { return re.test(l); })) break;
      if (/^p[aá]gina\s+\d+(\s+de\s+\d+)?$/i.test(l)) continue;
      if (/^\d{1,3}$/.test(l)) continue;
      out.push(linhas[i]);
      if (out.join("\n").length > 80000) break;
    }
    return out.join("\n");
  }
  function nomeDisciplina(linha) {
    var n = linha.trim().replace(/^(?:disciplina|mat[eé]ria)\s*[:\-–—]\s*/i, "").replace(/^(?:\d{1,2}|[IVXLC]{1,6})[.)\-\s]+/, "").replace(/\s*[-–—:]\s*$/, "");
    return limparLinha(n).toUpperCase();
  }
  function pareceAssunto(linha) {
    var raw = linha.trim();
    var l = limparLinha(raw);
    if (!l || l.length < 3 || l.length > 400) return false;
    if (ehNaoDisciplina(l) && !/^\d+[\.\)]/.test(raw)) return false;
    if (pareceDisciplina(raw) && l === l.toUpperCase() && l.split(" ").length <= 8) return false;
    return true;
  }
  function extrairDisciplinas(bloco) {
    if (!bloco) return [];
    var linhas = bloco.split(/\n/);
    var disciplinas = [];
    var atual = null;
    function flush() {
      if (!atual || !atual.nome) { atual = null; return; }
      var assuntos = [];
      var vistos = {};
      atual.assuntos.forEach(function (a) {
        var k = a.toLowerCase();
        if (!vistos[k]) { vistos[k] = 1; assuntos.push(a); }
      });
      if (assuntos.length) disciplinas.push({ nome: atual.nome, assuntos: assuntos });
      atual = null;
    }
    linhas.forEach(function (linha) {
      var t = linha.trim();
      if (!t) return;
      if (GATILHOS_CONTEUDO.some(function (re) { return re.test(t); }) && t.length < 80) return;
      if (pareceDisciplina(t)) {
        var nome = nomeDisciplina(t);
        if (ehNaoDisciplina(nome)) return;
        flush();
        atual = { nome: nome, assuntos: [] };
        return;
      }
      if (!atual || !pareceAssunto(t)) return;
      var assunto = limparLinha(t).replace(/^(?:\d+(?:\.\d+)*)[.)\-\s]+/, "").replace(/^[a-z]\)\s+/i, "").replace(/^[ivxlcdm]+\)\s+/i, "");
      if (assunto.length >= 3 && !/@|telefone|candidato dever[aá]|correio eletr/i.test(assunto)) atual.assuntos.push(assunto);
    });
    flush();
    return disciplinas;
  }
  function parseEdital(textoBruto) {
    var texto = normalizarEspacos(textoBruto);
    return {
      comando: "edital",
      cargo: detectarCargo(texto),
      prova: detectarProva(texto),
      banca: detectarBanca(texto),
      inscricao: detectarInscricao(texto),
      taxa: detectarTaxa(texto),
      disciplinas: extrairDisciplinas(extrairBlocoConteudo(texto))
    };
  }
  root.parseEdital = parseEdital;
})(typeof window !== "undefined" ? window : globalThis);
