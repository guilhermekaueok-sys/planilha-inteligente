/* Névoa na GPU. O orbe é o vídeo entregue, centralizado, sem recorte. Se o quadro atrasar, baixa a resolução. Sem WebGL, o poster cobre. */
(function () {
  var canvas = document.getElementById("nebula");
  if (!canvas) return;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function fallback() {
    document.documentElement.classList.add("no-gpu");
    canvas.dataset.gpu = "fallback";
    canvas.style.display = "none";
  }
  var gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) {
    fallback();
    return;
  }
  var vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";
  var fs = [
    "precision mediump float;",
    "uniform sampler2D uTex;uniform vec2 uRes;",
    "void main(){",
    "vec3 navy=vec3(0.0196,0.0314,0.0784);",
    "vec2 p=gl_FragCoord.xy/uRes-0.5;",
    "float side=min(uRes.x,uRes.y)*1.42;",
    "vec2 tuv=p*(uRes/side)+0.5;",
    "if(tuv.x<0.0||tuv.y<0.0||tuv.x>1.0||tuv.y>1.0){gl_FragColor=vec4(navy,1.0);return;}",
    "vec3 c=texture2D(uTex,tuv).rgb;",
    "float lum=max(c.r,max(c.g,c.b));",
    "gl_FragColor=vec4(mix(navy,c,smoothstep(0.003,0.018,lum)),1.0);",
    "}",
  ].join("");
  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }
  var prog = gl.createProgram();
  var vsh = shader(gl.VERTEX_SHADER, vs);
  var fsh = shader(gl.FRAGMENT_SHADER, fs);
  if (!vsh || !fsh) {
    fallback();
    return;
  }
  gl.attachShader(prog, vsh);
  gl.attachShader(prog, fsh);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    fallback();
    return;
  }
  gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uRes = gl.getUniformLocation(prog, "uRes");
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([5, 8, 20, 255]));
  var vid = document.createElement("video");
  vid.muted = true;
  vid.defaultMuted = true;
  vid.loop = true;
  vid.playsInline = true;
  vid.setAttribute("playsinline", "");
  vid.setAttribute("webkit-playsinline", "");
  vid.preload = "auto";
  vid.setAttribute("aria-hidden", "true");
  vid.style.cssText = "position:fixed;width:1px;height:1px;opacity:0;pointer-events:none";
  document.body.appendChild(vid);
  vid.src = "./orbe-loop.mp4";
  function arm() {
    if (reduced) {
      try { vid.currentTime = 20; } catch (_) {}
      return;
    }
    var p = vid.play();
    if (p && p.catch) p.catch(function () {});
  }
  vid.addEventListener("loadeddata", arm);
  vid.addEventListener("error", fallback);
  document.addEventListener("pointerdown", arm);
  var dpr = Math.min(window.devicePixelRatio || 1, 1.15);
  var slow = 0;
  var lastDraw = 0;
  var running = true;
  function resize() {
    var w = Math.max(1, Math.floor(window.innerWidth * dpr));
    var h = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    canvas.dataset.tier = String(Math.round(dpr * 100));
  }
  function draw(now) {
    if (!running) return;
    if (!reduced) requestAnimationFrame(draw);
    if (!reduced && now - lastDraw < 32) return;
    var gap = lastDraw ? now - lastDraw : 32;
    lastDraw = now;
    if (gap > 48) slow += 1;
    else slow = Math.max(0, slow - 1);
    if (slow > 8 && dpr > 0.65) {
      dpr = Math.max(0.65, dpr * 0.75);
      slow = 0;
      resize();
    }
    var t0 = performance.now();
    if (vid.readyState >= 2 && vid.videoWidth) {
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, vid);
    }
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (performance.now() - t0 > 14 && dpr > 0.65) {
      dpr = Math.max(0.65, dpr * 0.8);
      resize();
    }
  }
  resize();
  canvas.dataset.gpu = "webgl";
  requestAnimationFrame(draw);
  window.addEventListener("resize", resize);
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) {
      running = false;
      try { vid.pause(); } catch (_) {}
      return;
    }
    if (!running) {
      running = true;
      lastDraw = 0;
      if (!reduced) {
        arm();
        requestAnimationFrame(draw);
      }
    }
  });
})();
