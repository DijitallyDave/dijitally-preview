/**
 * Edge effects on the hero's allies, drawn by a small WebGL shader over the slideshow's 2D
 * canvas. The shader finds edges (where brightness changes sharply, which on these rim-lit
 * portraits is the silhouette) and only touches those:
 *
 *   - a still chromatic aberration: red and blue split slightly apart along the edges;
 *   - just before each melt, a few stray edge pixels streak off sideways, the way the strips
 *     are about to go, as a hint of what's coming.
 *
 * Cheap by design: the canvas is uploaded once per slide (never per melt frame; the melt itself
 * runs on the plain canvas) and the shader only animates for the brief streak.
 */

import { HERO_MELT } from "./heroSlides.config";

const EDGES = {
  /** How far red and blue split either side of an edge, in CSS pixels. */
  split: 1.2,
  /** How long the stray pixels streak before the melt starts (ms). */
  streakMs: 450,
  /** How far the longest stray run reaches by the end of the streak, in CSS pixels. */
  reach: 36,
  /** Share of pixel rows that throw off a stray run by the end of the streak. */
  rows: 0.05,
};

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform sampler2D tex;
uniform vec2 px;       // one canvas pixel, in texture units
uniform float split;   // canvas pixels
uniform float streak;  // 0 to 1 through the streak
uniform float seed;    // new rows for each streak
uniform float reach;   // canvas pixels
uniform float rows;    // share of rows by the end
uniform float strip;   // canvas pixels per row of the melt
uniform float snap;    // canvas pixels the melt moves in
uniform float dir;     // -1 left, 1 right
varying vec2 v;

float hash(float n) { return fract(sin(n) * 43758.5453); }
float lum(vec2 q) { return dot(texture2D(tex, q).rgb, vec3(0.299, 0.587, 0.114)); }
float edgeAt(vec2 q) {
  vec2 o = px * 3.0;
  float gx = lum(q + vec2(o.x, 0.0)) - lum(q - vec2(o.x, 0.0));
  float gy = lum(q + vec2(0.0, o.y)) - lum(q - vec2(0.0, o.y));
  return smoothstep(0.03, 0.2, length(vec2(gx, gy)));
}

void main() {
  float edge = edgeAt(v);
  float ca = split * edge * px.x;
  vec4 r = texture2D(tex, v + vec2(ca, 0.0));
  vec4 g = texture2D(tex, v);
  vec4 b = texture2D(tex, v - vec2(ca, 0.0));
  vec4 c = vec4(r.r, g.g, b.b, max(max(r.a, g.a), b.a));

  if (streak > 0.0) {
    // A few rows, more as the streak builds, each throw a copy of their edge pixels sideways in
    // the melt's chunky steps.
    float row = floor(v.y / (px.y * strip));
    if (hash(row * 1.37 + seed) > 1.0 - rows * streak) {
      float len = (0.25 + 0.75 * hash(row * 7.13 + seed)) * reach * streak;
      len = max(snap, floor(len / snap) * snap);
      vec2 q = v - vec2(dir * len * px.x, 0.0);
      c = max(c, texture2D(tex, q) * edgeAt(q));
    }
  }
  gl_FragColor = c;
}`;

export type EdgeFx = {
  /** Upload the source canvas as it is now and draw it with the still colour split. */
  still: () => void;
  /** Match the source canvas's size, then draw it. */
  resize: () => void;
  /** Play the stray-pixel streak over the current still; resolves when it's done. */
  streak: () => Promise<void>;
  destroy: () => void;
};

/** Returns null where WebGL isn't available, so the caller keeps showing the source canvas. */
export function createEdgeFx(source: HTMLCanvasElement, target: HTMLCanvasElement, onLost: () => void): EdgeFx | null {
  const gl = target.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return null;

  const compile = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const p = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(p);
  gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);

  gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  const u = (n: string) => gl.getUniformLocation(prog, n);
  const uStreak = u("streak");
  gl.uniform1f(u("dir"), HERO_MELT.direction === "left" ? -1 : 1);
  gl.uniform1f(u("rows"), EDGES.rows);

  let frame = 0;
  let done = () => {};

  const draw = (streak: number) => {
    gl.uniform1f(uStreak, streak);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const still = () => {
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    draw(0);
  };

  const lost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(frame);
    done();
    onLost();
  };
  target.addEventListener("webglcontextlost", lost);

  return {
    still,
    resize: () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      target.width = source.width;
      target.height = source.height;
      gl.viewport(0, 0, target.width, target.height);
      gl.uniform2f(u("px"), 1 / target.width, 1 / target.height);
      gl.uniform1f(u("split"), EDGES.split * dpr);
      gl.uniform1f(u("reach"), EDGES.reach * dpr);
      gl.uniform1f(u("strip"), Math.max(1, Math.round(HERO_MELT.stripHeight * dpr)));
      gl.uniform1f(u("snap"), Math.max(1, Math.round((HERO_MELT.step || 1) * dpr)));
      still();
    },
    streak: () =>
      new Promise<void>((resolve) => {
        done = resolve;
        gl.uniform1f(u("seed"), Math.random() * 100);
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / EDGES.streakMs);
          draw(t * t); // eases in, so it starts as a stray pixel or two
          if (t < 1) frame = requestAnimationFrame(tick);
          else resolve();
        };
        frame = requestAnimationFrame(tick);
      }),
    destroy: () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("webglcontextlost", lost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
