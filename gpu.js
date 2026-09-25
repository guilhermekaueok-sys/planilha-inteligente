/* Névoa na GPU. Se o quadro atrasar, baixa a resolução. Sem WebGL, o CSS cobre. */
(function () {
  var canvas = document.getElementById("nebula");
  if (!canvas) return;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) {
    document.documentElement.classList.add("no-gpu");
    canvas.dataset.gpu = "fallback";
    return;
  }
  var vs = "attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}";
  var fs = [
    "precision mediump float;",
    "uniform sampler2D uTex;uniform float uTime;uniform vec2 uRes;",
    "void main(){",
    "vec3 navy=vec3(0.020,0.031,0.078);",
    "vec2 uv=gl_FragCoord.xy/uRes;",
    "float aspect=uRes.x/max(uRes.y,1.0);",
    "vec2 p=uv-vec2(0.58,0.64);",
    "p.x*=aspect;",
    "float ang=0.11*sin(uTime*0.42);",
    "float cs=cos(ang);float sn=sin(ang);",
    "vec2 r=vec2(cs*p.x-sn*p.y,sn*p.x+cs*p.y);",
    "r.y+=0.025*sin(uTime*0.31);",
    "float breathe=1.0+0.045*sin(uTime*0.52);",
    "r/=breathe;",
    "vec2 tuv=vec2(r.x/aspect,r.y)*1.12+0.5;",
    "vec2 px=vec2(0.6/1024.0,0.6/720.0);",
    "vec3 c=texture2D(uTex,tuv).rgb;",
    "c=c*0.82+texture2D(uTex,tuv+px).rgb*0.06+texture2D(uTex,tuv-px).rgb*0.06+texture2D(uTex,tuv+vec2(px.x,-px.y)).rgb*0.03+texture2D(uTex,tuv+vec2(-px.x,px.y)).rgb*0.03;",
    "float filament=pow(clamp(c.b,0.0,1.0),1.6);",
    "c+=vec3(0.015,0.05,0.10)*filament*(0.5+0.5*sin(uTime*1.15+length(p)*7.0));",
    "float edge=smoothstep(0.42,1.15,length(p));",
    "c=mix(c,navy,edge*0.35);",
    "if(tuv.x<0.0||tuv.y<0.0||tuv.x>1.0||tuv.y>1.0) c=navy;",
    "gl_FragColor=vec4(c,1.0);",
    "}",
  ].join("");
  function shader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  var prog = gl.createProgram();
  gl.attachShader(prog, shader(gl.VERTEX_SHADER, vs));
  gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    document.documentElement.classList.add("no-gpu");
    canvas.dataset.gpu = "fallback";
    return;
  }
  gl.useProgram(prog);
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uTime = gl.getUniformLocation(prog, "uTime");
  var uRes = gl.getUniformLocation(prog, "uRes");
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([5, 8, 20, 255]));
  var ready = false;
  var img = new Image();
  img.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    ready = true;
    lastDraw = 0;
    if (reduced) requestAnimationFrame(draw);
  };
  img.src = "./fundo-orbe.jpg";
  var dpr = Math.min(window.devicePixelRatio || 1, 1.25);
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
  function draw(t) {
    if (!running) return;
    if (!reduced) requestAnimationFrame(draw);
    if (!reduced && t - lastDraw < 32) return;
    var gap = lastDraw ? t - lastDraw : 32;
    lastDraw = t;
    if (gap > 48) slow += 1;
    else slow = Math.max(0, slow - 1);
    if (slow > 8 && dpr > 0.7) {
      dpr = Math.max(0.7, dpr * 0.75);
      slow = 0;
      resize();
    }
    var t0 = performance.now();
    gl.uniform1f(uTime, t * 0.001);
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (performance.now() - t0 > 12 && dpr > 0.7) {
      dpr = Math.max(0.7, dpr * 0.8);
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
      return;
    }
    if (!running) {
      running = true;
      lastDraw = 0;
      requestAnimationFrame(draw);
    }
  });
})();
