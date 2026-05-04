<template>
  <div class="hero-kw-bg" aria-hidden="true">
    <span
      v-for="(kw, i) in KW_ITEMS"
      :key="kw.text"
      class="hero-kw-item"
      :style="{
        top: topPct(i) + '%',
        fontSize: fontSize(i),
        opacity: opacity(i),
        color: kw.color,
        '--dur': duration(i) + 's',
        '--delay': '-' + delay(i) + 's',
      }"
    >{{ kw.text }}</span>
  </div>
</template>

<script setup lang="ts">
const M = 'var(--color-media-on-dark)'
const K = 'var(--color-knowledge-on-dark)'
const D = 'var(--color-design-on-dark)'
const G = 'rgba(252, 249, 248, 0.55)'

interface Kw { text: string; color: string }

const KW_ITEMS: Kw[] = [
  // Media
  { text: '３D音響', color: M },
  { text: '音場シミュレーション', color: M },
  { text: '音声伝達', color: M },
  { text: '話者認識', color: M },
  { text: '歌声合成', color: M },
  { text: '画像/映像処理', color: M },
  { text: '画像/映像合成', color: M },
  { text: '画像/映像符号化と伝送', color: M },
  { text: 'バーチャルリアリティ', color: M },
  // Knowledge
  { text: '環境認識', color: K },
  { text: 'コンピュータネットワーク', color: K },
  { text: 'データマイニング', color: K },
  { text: 'マルチエージェントシステム', color: K },
  { text: 'ビッグデータ', color: K },
  { text: '人工知能', color: K },
  { text: '機械学習', color: K },
  { text: 'テキストマイニング', color: K },
  { text: 'ITS（Intelligent Transport Systems）', color: K },
  { text: 'ディープラーニング', color: K },
  { text: 'ユビキタスコンピューティング', color: K },
  // Design
  { text: 'コミュニケーションデザイン', color: D },
  { text: 'ビジュアライゼーション', color: D },
  { text: 'プロダクトデザイン/デジタルファブリケーション', color: D },
  { text: 'ユーザインタフェースデザイン', color: D },
  { text: 'Webデザイン/アプリケーションデザイン', color: D },
  { text: '映像・CG・アニメーションデザイン', color: D },
  { text: 'ユーザエクスペリエンスデザイン/人間中心設計', color: D },
  { text: 'ソーシャルデザイン', color: D },
  { text: 'サービスデザイン', color: D },
  { text: 'テクノロジーアート', color: D },
  // Media × Knowledge
  { text: '音声認識', color: G },
  { text: 'インテリジェント拡声システム', color: G },
  { text: '画像認識', color: G },
  { text: '音の情景分析', color: G },
  { text: 'AR（拡張現実）', color: G },
  // Media × Design
  { text: 'サウンドデザイン', color: G },
  { text: '音環境デザイン', color: G },
  { text: 'マルチモーダルインタフェース', color: G },
  { text: 'メディアデザイン', color: G },
  { text: 'サイエンティフィック・ビジュアライゼーション', color: G },
  // All
  { text: 'データ可視化', color: G },
  { text: 'IoT（Internet of Things）', color: G },
  { text: 'インテリジェントプロダクトデザイン', color: G },
  { text: 'インテリジェントインタフェースデザイン', color: G },
  { text: 'インタフェースエージェント', color: G },
]

// Deterministic pseudo-random distribution using golden ratio
// to avoid visible grid/row patterns
const PHI = 0.6180339887

function topPct(i: number): number {
  // Golden ratio spiral → visually random, no clustering
  return parseFloat(((i * PHI * 100) % 93 + 2).toFixed(2))
}

function fontSize(i: number): string {
  const sizes = [
    '0.62rem', '0.88rem', '1.18rem', '0.7rem',
    '1.0rem',  '0.58rem', '1.28rem', '0.78rem',
    '0.95rem', '0.65rem', '1.08rem', '0.82rem',
  ]
  return sizes[i % sizes.length]
}

function opacity(i: number): number {
  const ops = [0.16, 0.22, 0.1, 0.19, 0.13, 0.25, 0.09, 0.2, 0.15, 0.12, 0.18, 0.08]
  return ops[i % ops.length]
}

function duration(i: number): number {
  // 28–72 s — spread so adjacent keywords scroll at different speeds
  return 28 + ((i * 13) % 44)
}

function delay(i: number): number {
  // Pre-start each item mid-journey so the screen is never empty at load
  const dur = duration(i)
  return parseFloat(((i * 7.3) % dur).toFixed(1))
}
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
  left: 0;
  white-space: nowrap;
  font-family: var(--font-body);
  font-weight: 400;
  letter-spacing: 0.01em;
  line-height: 1;
  animation: kw-float var(--dur) linear calc(var(--delay) * -1) infinite;
  will-change: transform;
}

@keyframes kw-float {
  from { transform: translateX(110vw); }
  to   { transform: translateX(calc(-100% - 10vw)); }
}

@media (prefers-reduced-motion: reduce) {
  .hero-kw-item {
    animation-play-state: paused;
  }
}
</style>
