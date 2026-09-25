/* Fundo estático. O vídeo saiu. O orbe é um quadro só, e o cosmos fica no CSS. */
(function () {
  var canvas = document.getElementById("nebula");
  if (!canvas) return;
  canvas.style.display = "none";
  canvas.dataset.gpu = "still";
})();
