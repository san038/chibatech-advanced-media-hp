<template>
  <div ref="rootEl" class="lab-field" aria-hidden="true">
    <canvas ref="canvasEl" class="lab-field__canvas" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

// 研究室データからフィールドに流す語彙を生成
const PHRASES: string[] = (() => {
  const s = new Set<string>();
  s.add("知能メディア工学科");
  s.add("メディア工学");
  s.add("知識工学");
  s.add("情報デザイン");
  for (const lab of useContent().labs) {
    s.add(lab.focus);
    s.add(lab.professor.replace(/\s*(教授|准教授)\s*$/, ""));
    for (const k of lab.keywords) s.add(k);
  }
  return [...s];
})();

const SEP = "  ·  ";
const GLITCH_CH =
  "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ０１２３４５６７８９／＼＜＞＝＋－＊？";
const BASE_ALPHA = 0.06;
const LENS_R = 132;

interface Row {
  text: string;
  disp: string;
  width: number;
  speed: number; // px/frame @60fps, 符号つき
  x: number;
  y: number;
  glitchUntil: number;
  gs: number;
  gl: number;
}

const rootEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let cssW = 0;
let cssH = 0;
let rowGap = 28;
let fontPx = 17;
let rows: Row[] = [];
let rafId = 0;
let running = false;
let reduce = false;
let finePointer = true;
let lastT = 0;
let nextGlitch = 0;
let scrambleFrame = 0;
let resizeObs: ResizeObserver | null = null;
let io: IntersectionObserver | null = null;
let inView = true;

const pointer = { x: 0, y: 0, inside: false };

function shuffled<T>(a: T[]): T[] {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [r[i], r[j]] = [r[j], r[i]];
  }
  return r;
}

function buildRows() {
  if (!ctx) return;
  rowGap = Math.min(36, Math.max(22, cssH / 34));
  fontPx = Math.round(rowGap * 0.62);
  ctx.font = `${fontPx}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
  ctx.textBaseline = "middle";

  const target = cssW * 1.5;
  const count = Math.ceil(cssH / rowGap) + 2;
  rows = [];
  for (let i = 0; i < count; i++) {
    let text = "";
    let pool = shuffled(PHRASES);
    let pi = 0;
    while (ctx.measureText(text).width < target) {
      if (pi >= pool.length) {
        pool = shuffled(PHRASES);
        pi = 0;
      }
      text += pool[pi++] + SEP;
    }
    const width = ctx.measureText(text).width;
    const dir = i % 2 === 0 ? -1 : 1;
    rows.push({
      text,
      disp: text,
      width,
      speed: dir * (0.18 + Math.random() * 0.5),
      x: reduce ? (i * 149) % width : -Math.random() * width,
      y: rowGap * 0.7 + i * rowGap,
      glitchUntil: 0,
      gs: 0,
      gl: 0,
    });
  }
}

function scramble(base: string, start: number, len: number): string {
  const arr = [...base];
  for (let i = start; i < start + len && i < arr.length; i++) {
    const ch = arr[i];
    if (ch === " " || ch === "·") continue;
    arr[i] = GLITCH_CH[(Math.random() * GLITCH_CH.length) | 0];
  }
  return arr.join("");
}

function drawField(color: string, offX: number) {
  if (!ctx || rows.length === 0) return;
  ctx.fillStyle = color;
  for (const row of rows) {
    let x = (((row.x % row.width) + row.width) % row.width) - row.width;
    while (x < cssW) {
      ctx.fillText(row.disp, x + offX, row.y);
      x += row.width;
    }
  }
}

function render() {
  if (!ctx) return;
  ctx.clearRect(0, 0, cssW, cssH);
  drawField(`rgba(228, 234, 238, ${BASE_ALPHA})`, 0);

  // ポインタ近傍だけ明るく浮かび上がるレンズ（色収差つき）
  if (finePointer && pointer.inside && !reduce) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(pointer.x, pointer.y, LENS_R, 0, Math.PI * 2);
    ctx.clip();
    ctx.globalCompositeOperation = "lighter";
    drawField("rgba(255, 80, 90, 0.11)", -1.6);
    drawField("rgba(90, 255, 150, 0.11)", 0);
    drawField("rgba(110, 150, 255, 0.11)", 1.6);
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }
}

function tick(now: number) {
  if (!lastT) lastT = now;
  const f = Math.min(3, (now - lastT) / 16.67);
  lastT = now;

  for (const row of rows) {
    row.x += row.speed * f;
    if (row.x <= -row.width || row.x >= row.width) row.x %= row.width;
  }

  if (now > nextGlitch) {
    nextGlitch = now + 900 + Math.random() * 1600;
    const row = rows[(Math.random() * rows.length) | 0];
    if (row) {
      const n = [...row.text].length;
      row.gl = 5 + ((Math.random() * 16) | 0);
      row.gs = (Math.random() * Math.max(1, n - row.gl)) | 0;
      row.glitchUntil = now + 180 + Math.random() * 320;
    }
  }
  scrambleFrame++;
  for (const row of rows) {
    if (now < row.glitchUntil) {
      if (scrambleFrame % 2 === 0) row.disp = scramble(row.text, row.gs, row.gl);
    } else if (row.disp !== row.text) {
      row.disp = row.text;
    }
  }

  render();
  rafId = requestAnimationFrame(tick);
}

function start() {
  if (running || reduce || !inView) return;
  running = true;
  lastT = 0;
  rafId = requestAnimationFrame(tick);
}
function stop() {
  running = false;
  cancelAnimationFrame(rafId);
}

function resize() {
  const root = rootEl.value;
  const canvas = canvasEl.value;
  if (!root || !canvas) return;
  const rect = root.getBoundingClientRect();
  cssW = Math.max(1, rect.width);
  cssH = Math.max(1, rect.height);
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  buildRows();
  if (reduce || !running) render();
}

function onPointerMove(e: PointerEvent) {
  const root = rootEl.value;
  if (!root) return;
  const rect = root.getBoundingClientRect();
  pointer.x = e.clientX - rect.left;
  pointer.y = e.clientY - rect.top;
  pointer.inside =
    pointer.x >= 0 &&
    pointer.x <= rect.width &&
    pointer.y >= 0 &&
    pointer.y <= rect.height;
}
function onLeave() {
  pointer.inside = false;
}
function onVis() {
  if (document.hidden) stop();
  else start();
}

onMounted(() => {
  reduce =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  finePointer = window.matchMedia?.("(pointer: fine)").matches ?? true;

  resize();

  resizeObs = new ResizeObserver(() => resize());
  resizeObs.observe(rootEl.value as HTMLElement);

  if (reduce) {
    render();
    return;
  }

  io = new IntersectionObserver(
    (entries) => {
      inView = entries.some((e) => e.isIntersecting);
      if (inView) start();
      else stop();
    },
    { rootMargin: "120px" },
  );
  io.observe(rootEl.value as HTMLElement);

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerleave", onLeave, { passive: true });
  document.addEventListener("visibilitychange", onVis);

  start();
});

onUnmounted(() => {
  stop();
  resizeObs?.disconnect();
  io?.disconnect();
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerleave", onLeave);
  document.removeEventListener("visibilitychange", onVis);
});
</script>

<style scoped>
.lab-field {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  background: #161514;
}

.lab-field__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.lab-field::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.04;
  mix-blend-mode: screen;
}

.lab-field::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 42% 45%,
    transparent 45%,
    rgba(8, 8, 10, 0.6) 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .lab-field::before {
    display: none;
  }
}
</style>
