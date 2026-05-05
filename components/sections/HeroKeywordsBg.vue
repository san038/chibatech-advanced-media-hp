<template>
  <div class="hero-kw-bg" aria-hidden="true">
    <span
      v-for="(kw, i) in kwStates"
      :key="i"
      :ref="(el) => setEl(el, i)"
      class="hero-kw-item"
      :style="{
        '--tx': kw.tx + 'px',
        '--ty': kw.ty + 'px',
        '--dur': kw.dur + 's',
        '--dly': kw.dly + 's',
        color: kw.color,
        fontSize: kw.size,
      }"
      >{{ kw.text }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// ── キーワード定義 ───────────────────────────────────────────────────────────
const M = "rgba(15, 14, 26, 1)";
const K = "rgba(15, 14, 26, 1)";
const D = "rgba(15, 14, 26, 1)";
const G = "rgba(15, 14, 26, 0.35)";

interface Kw {
  text: string;
  color: string;
}

const KW_LIST: Kw[] = [
  { text: "バーチャルリアリティ", color: M },
  { text: "歌声合成", color: M },
  { text: "画像/映像処理", color: M },
  { text: "３D音響", color: M },
  { text: "ディープラーニング", color: K },
  { text: "機械学習", color: K },
  { text: "人工知能", color: K },
  { text: "ビッグデータ", color: K },
  { text: "コミュニケーションデザイン", color: D },
  { text: "ビジュアライゼーション", color: D },
  { text: "テクノロジーアート", color: D },
  { text: "AR（拡張現実）", color: G },
  { text: "データ可視化", color: G },
];

const SIZES = [
  "2.2rem",
  "2.8rem",
  "3.4rem",
  "2.5rem",
  "3.0rem",
  "1.9rem",
  "4.0rem",
];

// スクランブルに使う文字：全角英数記号（各1em幅 = CJK文字と同幅）
// これによりスクランブル中も文字列幅が変わらずジッターが発生しない
const CHARS =
  "ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ０１２３４５６７８９！＠＃＄％＆＊？＋－＝＜＞／";

// ── State ────────────────────────────────────────────────────────────────────
interface KwState extends Kw {
  tx: number;
  ty: number;
  dur: number;
  dly: number;
  size: string;
}

const kwStates = ref<KwState[]>([]);
const kwEls: (HTMLElement | null)[] = [];

function setEl(el: unknown, i: number) {
  kwEls[i] = el as HTMLElement | null;
}

// ── スクランブルテキスト ─────────────────────────────────────────────────────
/**
 * progress 0→1 で左から順に文字を確定する。
 * 未確定文字はフレームごとにランダムな英数記号を返す。
 */
function scramble(target: string, progress: number): string {
  const revealCount = Math.floor(target.length * progress);
  return target
    .split("")
    .map((ch, i) => {
      if (ch === " " || ch === "　" || ch === "（" || ch === "）") return ch;
      if (i < revealCount) return ch;
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    })
    .join("");
}

// ── RAF ループ ───────────────────────────────────────────────────────────────
// フェードイン区間（0〜SCRAMBLE_PHASE）でスクランブルを走らせる
// 移動開始後、少し経ってからスクランブル開始・終了
const SCRAMBLE_START = 0.0; // cycle の 8% 経過後にスクランブル開始
const SCRAMBLE_END = 0.2; // cycle の 26% で全文字確定完了

let rafId = 0;
let startTime = 0;
let scrambleFrame = 0; // スクランブル文字の更新を間引くカウンタ

function tick(now: number) {
  if (!startTime) startTime = now;
  const elapsed = now - startTime;
  scrambleFrame++;

  kwStates.value.forEach((kw, i) => {
    const el = kwEls[i];
    if (!el) return;

    // dly は正の値（開始までの待ち時間）。その間は CSS 側で非表示
    const kwElapsed = elapsed - kw.dly * 1000;
    if (kwElapsed < 0) return; // まだ開始前

    const phase = (kwElapsed % (kw.dur * 1000)) / (kw.dur * 1000);

    if (phase < SCRAMBLE_START) {
      // 移動開始直後: まだスクランブル前 — ランダム文字を表示し続ける
      if (scrambleFrame % 2 === 0) {
        el.textContent = scramble(kw.text, 0);
      }
    } else if (phase < SCRAMBLE_END) {
      // スクランブル区間: 毎フレーム更新して1文字ずつ確定が見えるようにする
      const progress =
        (phase - SCRAMBLE_START) / (SCRAMBLE_END - SCRAMBLE_START);
      el.textContent = scramble(kw.text, progress);
    } else {
      // 確定テキストを表示
      if (el.textContent !== kw.text) {
        el.textContent = kw.text;
      }
    }
  });

  rafId = requestAnimationFrame(tick);
}

// ── Lifecycle ────────────────────────────────────────────────────────────────
onMounted(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // 短辺の半分を基準にして、キーワードが画面内に収まる開始位置を保証する
  const shortHalf = Math.min(window.innerWidth, window.innerHeight) * 0.5;
  const maxDist = shortHalf * 0.82;

  // ヒーロー入場アニメーションが終わってからキーワードを開始
  setTimeout(() => {
    kwStates.value = KW_LIST.map((kw, i) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = maxDist * (1.0 + Math.random() * 0.6);
      const dur = 7 + Math.random() * 5;
      // 正の delay: 0〜3s の範囲でスタッガーさせる（全キーワードが同時に登場しない）
      const dly = Math.random() * 3;
      return {
        ...kw,
        tx: Math.cos(angle) * dist,
        ty: Math.sin(angle) * dist,
        dur,
        dly,
        size: SIZES[i % SIZES.length],
      };
    });

    requestAnimationFrame(() => {
      rafId = requestAnimationFrame(tick);
    });
  }, 1800);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
.hero-kw-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-kw-item {
  position: absolute;
  left: 50%;
  top: 50%;
  white-space: nowrap;
  font-family: var(--font-body);
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 1;
  /* delay 中は非表示（正の delay の間は keyframe が適用されないため） */
  opacity: 0;
  animation: kw-radiate var(--dur) linear var(--dly) infinite;
  will-change: transform, opacity, filter;
}

@keyframes kw-radiate {
  /* 外側からスタート → 中央へ向かい小さくなる（1点透視の奥行き表現） */
  0% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1.8);
    opacity: 1;
    filter: blur(0px);
  }
  58% {
    opacity: 1;
    filter: blur(0px);
  }
  100% {
    transform: translate(-50%, -50%) scale(0.12);
    opacity: 0;
    filter: blur(10px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-kw-item {
    animation: none;
    opacity: 0;
  }
}
</style>
