/* Leitor de edital. A saída é só o comando que a plataforma grava. */
(function (root) {
  "use strict";

  var BANCAS = [
    "CEBRASPE", "CESPE", "FGV", "FCC", "VUNESP", "IBFC", "IDECAN", "SELECON",
    "AOCP", "QUADRIX", "IADES", "CONSULPLAN", "INSTITUTO AOCP", "IDIB",
    "FUNDATEC", "INQC", "ABCP", "IBAM", "IESES", "OBJETIVA", "LEGALLE",
    "INSTITUTO CIDADES", "AVANÇASP", "FAFIPA", "UEPA", "COPEVE", "UFMT",
    "UFPR", "IADHED", "IMPARH", "REIS & REIS", "INAZ DO PARÁ"
  ];

  var BLOQUEADAS = /inscri[cç]|deferiment|comprovante|disposi[cç]|vagas reserv|avalia[cç][aã]o de sa[uú]de|elimina|cronograma|recurso|sum[aá]rio|homolog|convoca[cç]|remunera|r\$|preliminar|do cargo|da inscri|taxa/i;

  var MARCA_INICIO = [
    "conteúdo programático", "conteudo programatico",
    "conteúdos programáticos", "conteudos programaticos",
    "conteúdo da prova", "conteudo da prova",
    "programa das provas", "programa da prova",
    "conhecimentos básicos", "conhecimentos basicos",
    "conhecimentos específicos", "conhecimentos especificos"
  ];

  var PARA_DE_LADO = /\b(mínimo|minimo|caráter|carater|aprova[cç][aã]o|total\b|pontos\b|aproveitamento|classifica[cç][aã]o|eliminat[oó]rio|corrigid[ao]|corre[cç][aã]o|somente ser[aá]|ser[aá]o considerados|avaliada na escala)\b/i;

  function normalizarEspacos(s) {
    return String(s || "").replace(/\s+/g, " ").trim();
  }

  function limparLinha(s) {
    return normalizarEspacos(s).replace(/[:\-–]\s*$/, "").trim();
  }

  function detectarBanca(textoFlat) {
    var re = new RegExp("\\b(" + BANCAS.join("|") + ")\\b", "i");
    var m = textoFlat.match(re);
    return m ? m[1].toUpperCase() : "";
  }

  function detectarCargo(textoFlat) {
    var m = textoFlat.match(/(?:para o cargo de|cargo pretendido|denomina[cç][aã]o do cargo)\s*[:\-]?\s*([A-Za-zÀ-ú][^. ]{0}|[A-Za-zÀ-ú][^.]{3,70})/i)
      || textoFlat.match(/\bcargo\s*[:\-]\s*([A-Za-zÀ-ú][^.]{3,70})/i);
    var cargo = m ? m[1].trim() : "";
    cargo = cargo.split(/\s+(?:,|taxa\b|banca\b|prova\b|remunera|inscri|per[ií]odo|r\$)/i)[0].trim();
    cargo = cargo.replace(/\s+(do concurso|do edital|da inscri[cç][aã]o).*/i, "").trim();
    if (/inscri|deferiment|comprovante|disposi/i.test(cargo)) cargo = "";
    var apertado = cargo.match(/[A-Za-zÀ-ú]{4,}(?:\s+[A-Za-zÀ-ú]{3,}){0,3}/);
    return apertado ? apertado[0] : cargo;
  }

  function detectarProva(textoFlat) {
    var m = textoFlat.match(/(?:data da prova|prova objetiva|realiza[cç][aã]o da prova)[^\d]{0,30}(\d{1,2}\/\d{2}\/\d{4})/i);
    return m ? m[1] : "";
  }

  function detectarInscricao(textoFlat) {
    var m = textoFlat.match(/(?:per[ií]odo de inscri[cç][aã]o|as inscri[cç][oõ]es)[^\d]{0,40}(\d{1,2}\/\d{2}\/\d{4}\s*(?:a|at[eé]|–|-)\s*\d{1,2}\/\d{2}\/\d{4})/i);
    return m ? m[1] : "";
  }

  function detectarTaxa(textoFlat) {
    var m = textoFlat.match(/taxa de inscri[cç][aã]o[\s\S]{0,60}?(R\$\s*[\d.]+,\d{2})/i)
      || textoFlat.match(/(R\$\s*[\d.]+,\d{2})[^. ]{0,0}?(R\$\s*[\d.]+,\d{2})[^.]{0,40}(?:referente [aà] taxa|taxa de inscri)/i);
    return m ? m[1].replace(/\s+/g, " ") : "";
  }

  function extrairBlocoConteudo(texto) {
    var low = texto.toLowerCase();
    var start = -1;
    MARCA_INICIO.forEach(function (k) {
      var i = low.indexOf(k);
      if (i >= 0 && (start < 0 || i < start)) start = i;
    });
    return start >= 0 ? texto.slice(start, start + 18000) : "";
  }

  function ehNaoDisciplina(linha) {
    if (BLOQUEADAS.test(linha)) return true;
    if (/conte[uú]do program|programa da prova|programa das provas|conhecimentos b[aá]sicos|conhecimentos espec/i.test(linha)) return true;
    if (/^(aprova[cç][aã]o|total)\b/i.test(linha)) return true;
    return false;
  }

  function pareceAssunto(linha) {
    return /^\d+[\.\)]\s+\S/.test(linha) || /^[-•]\s+\S/.test(linha);
  }

  function cortarRegraGrudada(linha) {
    var m = linha.match(PARA_DE_LADO);
    if (!m) return linha;
    if (m.index === 0) return "";
    return linha.slice(0, m.index).trim();
  }

  function nomeDisciplina(linha) {
    var l = cortarRegraGrudada(linha);
    l = l.replace(/(?:\s+\d{1,3}){1,2}\s*$/, "");
    return limparLinha(l);
  }

  function pareceDisciplina(nome) {
    if (!nome || nome.length < 4 || nome.length > 72) return false;
    if (/[.]/.test(nome)) return false;
    if (!/^[A-ZÀ-Ú]/.test(nome)) return false;
    var palavras = nome.split(/\s+/).filter(Boolean);
    if (palavras.length > 10) return false;
    var letras = nome.replace(/[^A-Za-zÀ-ÿ]/g, "");
    if (letras.length < 4) return false;
    var stop = { de: 1, da: 1, do: 1, das: 1, dos: 1, e: 1, em: 1, no: 1, na: 1, a: 1, o: 1 };
    var comInicialMaiuscula = palavras.filter(function (p) {
      return /^[A-ZÀ-Ú]/.test(p) || stop[p.toLowerCase()];
    }).length;
    if (comInicialMaiuscula / palavras.length < 0.7) return false;
    return true;
  }

  function extrairDisciplinas(bloco) {
    var linhas = bloco.split("\n").map(normalizarEspacos).filter(Boolean);
    var discs = [];
    var vistos = {};
    function registrar(nome) {
      var id = nome.toLowerCase();
      if (vistos[id]) return discs.filter(function (d) { return d.nome.toLowerCase() === id; })[0];
      vistos[id] = 1;
      var d = { nome: nome, assuntos: [] };
      discs.push(d);
      return d;
    }
    var atual = null;
    for (var i = 0; i < linhas.length; i++) {
      var linha = linhas[i];
      if (ehNaoDisciplina(linha) || (PARA_DE_LADO.test(linha) && cortarRegraGrudada(linha).length < 4)) {
        atual = null;
        continue;
      }
      if (pareceAssunto(linha)) {
        if (atual) atual.assuntos.push(linha.replace(/^(?:\d+[\.\)]|[-•])\s+/, "").slice(0, 180));
        continue;
      }
      var nome = nomeDisciplina(linha);
      if (!nome || !pareceDisciplina(nome)) continue;
      var proxima = linhas[i + 1] ? normalizarEspacos(linhas[i + 1]) : "";
      var proximaTemNumero = /(?:\s\d{1,3}){1,2}\s*$/.test(proxima);
      var proximaEhContinuacao = proxima
        && !proximaTemNumero
        && !ehNaoDisciplina(proxima)
        && !pareceAssunto(proxima)
        && !PARA_DE_LADO.test(proxima)
        && proxima.split(/\s+/).filter(Boolean).length <= 2
        && /^[A-ZÀ-Ú]/.test(proxima);
      if (proximaEhContinuacao) {
        nome = normalizarEspacos(nome + " " + nomeDisciplina(proxima));
        i++;
      }
      atual = registrar(nome);
    }
    return discs;
  }

  function parseEdital(textoBruto) {
    var texto = String(textoBruto || "").replace(/\r/g, "");
    var flat = texto.replace(/\s+/g, " ");
    var cargo = detectarCargo(flat);
    var banca = detectarBanca(flat);
    var prova = detectarProva(flat);
    var inscricao = detectarInscricao(flat);
    var taxa = detectarTaxa(flat);
    var bloco = extrairBlocoConteudo(texto);
    var disciplinas = bloco ? extrairDisciplinas(bloco) : [];
    return {
      comando: "edital",
      cargo: cargo,
      prova: prova,
      banca: banca,
      inscricao: inscricao,
      taxa: taxa,
      disciplinas: disciplinas
    };
  }

  root.parseEdital = parseEdital;
  root.extrairDisciplinas = extrairDisciplinas;
  root.extrairBlocoConteudo = extrairBlocoConteudo;
  root.detectarCargo = detectarCargo;
  root.detectarProva = detectarProva;
  root.detectarBanca = detectarBanca;
  root.detectarInscricao = detectarInscricao;
  root.detectarTaxa = detectarTaxa;
  root.pareceDisciplina = pareceDisciplina;
  root.pareceAssunto = pareceAssunto;
  root.ehNaoDisciplina = ehNaoDisciplina;
  root.nomeDisciplina = nomeDisciplina;
  root.normalizarEspacos = normalizarEspacos;
  root.limparLinha = limparLinha;
})(typeof window !== "undefined" ? window : this);
