<template>
  <section
    class="hero"
    :class="{
      'hero--intro-center': introPhase === 'center',
      'hero--intro-slide': introPhase === 'slide',
      'hero--intro-reveal': introPhase === 'reveal',
      'hero--intro-done': introPhase === 'done',
    }"
  >
    <!-- Background visual element -->
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__diagram">
        <DomainDiagram3D :defer-highlight="introPhase !== 'done'" />
      </div>
      <div class="hero__bg-overlay" />
    </div>

    <!-- 初回表示: 黒画面 -->
    <div
      v-if="introPhase !== 'done'"
      class="hero__intro-curtain"
      aria-hidden="true"
    />

    <!-- Title + scroll: 同一ブロックが中央 → 下部へ移動 -->
    <div class="hero__bottom">
      <div class="hero__text-area">
        <div class="hero__title-block">
          <p class="hero__site-title" :aria-label="SITE_TITLE">
            <span
              v-for="(ch, i) in siteTitleChars"
              :key="`st-${i}`"
              class="hero__type-char"
              :class="{ 'hero__type-char--shown': i < visibleSiteCount }"
              aria-hidden="true"
              >{{ ch }}</span
            >
          </p>
          <h1 class="hero__headline">
            <span class="hero__headline-line">
              <span class="hero__headline-line__bar" aria-hidden="true" />
              <span class="hero__headline-line__text" :aria-label="HEADLINE">
                <span
                  v-for="(ch, i) in headlineChars"
                  :key="`hl-${i}`"
                  class="hero__type-char"
                  :class="{ 'hero__type-char--shown': i < visibleHeadlineCount }"
                  aria-hidden="true"
                  >{{ ch }}</span
                >
              </span>
            </span>
          </h1>
        </div>
      </div>

      <div class="hero__scroll-indicator" aria-hidden="true">
        <span class="hero__scroll-text">Scroll</span>
        <div class="hero__scroll-line" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type IntroPhase = "center" | "slide" | "reveal" | "done";

const SITE_TITLE = "千葉工業大学メディア工学科";
const HEADLINE = "新時代の想像力、3領域のその先へ";

const INTRO_CHAR_MS = 52;
const INTRO_AFTER_TYPE_MS = 700;
const INTRO_TITLE_SLIDE_MS = 900;
const INTRO_DIAGRAM_REVEAL_MS = 1400;

const introPhase = ref<IntroPhase>("center");
const introTimeouts: ReturnType<typeof setTimeout>[] = [];
const siteTitleChars = splitChars(SITE_TITLE);
const headlineChars = splitChars(HEADLINE);
const visibleSiteCount = ref(0);
const visibleHeadlineCount = ref(0);

function splitChars(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const seg = new Intl.Segmenter("ja", { granularity: "grapheme" });
    return [...seg.segment(text)].map((s) => s.segment);
  }
  return [...text];
}

function afterIntro(ms: number, fn: () => void) {
  introTimeouts.push(setTimeout(fn, ms));
}

function clearIntroTimeouts() {
  for (const t of introTimeouts) clearTimeout(t);
  introTimeouts.length = 0;
}

function typeChars(
  total: number,
  setVisible: (n: number) => void,
  onComplete: () => void,
) {
  let i = 0;
  const step = () => {
    i += 1;
    setVisible(i);
    if (i >= total) {
      onComplete();
      return;
    }
    afterIntro(INTRO_CHAR_MS, step);
  };
  step();
}

function scheduleRevealPhases() {
  afterIntro(INTRO_TITLE_SLIDE_MS, () => {
    introPhase.value = "reveal";
  });
  afterIntro(INTRO_TITLE_SLIDE_MS + INTRO_DIAGRAM_REVEAL_MS, () => {
    introPhase.value = "done";
  });
}

function startSlidePhase() {
  introPhase.value = "slide";
  scheduleRevealPhases();
}

function startTypewriterIntro() {
  introPhase.value = "center";
  visibleSiteCount.value = 0;
  visibleHeadlineCount.value = 0;

  typeChars(siteTitleChars.length, (n) => {
    visibleSiteCount.value = n;
  }, () => {
    typeChars(headlineChars.length, (n) => {
      visibleHeadlineCount.value = n;
    }, () => {
      afterIntro(INTRO_AFTER_TYPE_MS, startSlidePhase);
    });
  });
}

onMounted(() => {
  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (reduceMotion) {
    visibleSiteCount.value = siteTitleChars.length;
    visibleHeadlineCount.value = headlineChars.length;
    introPhase.value = "done";
    return;
  }

  startTypewriterIntro();
});

onUnmounted(() => {
  clearIntroTimeouts();
});
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: #1c1b1b;
  overflow: hidden;
  /* コピー位置: 画面中央 → Scroll 直上（レイアウト上の自然位置） */
  --hero-copy-y-center: calc(-50vh + 7.5rem);
  --hero-copy-y-rest: 0;
}

/* Background */
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__diagram {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  opacity: 0;
  transition: opacity 1.1s ease;
}

.hero--intro-reveal .hero__diagram,
.hero--intro-done .hero__diagram {
  opacity: 1;
}

.hero__bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    #1c1b1b 0%,
    rgba(28, 27, 27, 0.85) 28%,
    transparent 72%
  );
  opacity: 0;
  transition: opacity 1s ease 0.35s;
}

.hero--intro-reveal .hero__bg-overlay,
.hero--intro-done .hero__bg-overlay {
  opacity: 1;
}

/* 初回表示オーバーレイ */
.hero__intro-curtain {
  position: absolute;
  inset: 0;
  z-index: 8;
  background: #000000;
  pointer-events: none;
  transition: opacity 0.9s ease;
}

.hero--intro-reveal .hero__intro-curtain {
  opacity: 0;
}

/* Bottom block: title (left) + scroll (center) */
.hero__bottom {
  position: relative;
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  width: 100%;
  padding-left: var(--space-md);
  padding-bottom: max(var(--space-md), env(safe-area-inset-bottom, 0px));
}

.hero__text-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-md);
  width: 100%;
}

.hero__title-block {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65em;
  transform: translateY(var(--hero-copy-y, 0));
  transition: transform 0.9s cubic-bezier(0.65, 0, 0.35, 1);
}

.hero--intro-center {
  --hero-copy-y: var(--hero-copy-y-center);
}

.hero--intro-slide,
.hero--intro-reveal,
.hero--intro-done {
  --hero-copy-y: var(--hero-copy-y-rest);
}

.hero__type-char {
  opacity: 0;
}

.hero__type-char--shown {
  opacity: 1;
}

.hero__site-title {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 1.6vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  color: rgba(252, 249, 248, 0.72);
}

.hero__headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35em;
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4.2vw, 2.75rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
}

.hero__headline-line {
  position: relative;
  display: inline-block;
  padding: 0.08em 0.28em;
}

.hero__headline-line__bar {
  position: absolute;
  inset: 0;
  transform: scaleX(0);
  transform-origin: left;
}

.hero--intro-center .hero__headline-line__bar,
.hero--intro-slide .hero__headline-line__bar,
.hero--intro-reveal .hero__headline-line__bar {
  opacity: 0;
}

.hero--intro-done .hero__headline-line__bar {
  opacity: 1;
  animation: hero-bar-expand 0.55s cubic-bezier(0.65, 0, 0.35, 1) 0.15s forwards;
}

.hero__headline-line__text {
  position: relative;
  z-index: 1;
  color: #fcf9f8;
  opacity: 0.8;
}

@keyframes hero-bar-expand {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.8;
  }
}

/* Scroll indicator */
.hero__scroll-indicator {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
}

.hero--intro-done .hero__scroll-indicator {
  animation: hero-fade-in 0.6s ease 1.6s forwards;
}

.hero__scroll-text {
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: rgba(252, 249, 248, 0.45);
  text-transform: uppercase;
}

.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(
    to bottom,
    rgba(252, 249, 248, 0.45),
    transparent
  );
}

.hero--intro-done .hero__scroll-line {
  animation: scroll-line 1.6s ease-in-out infinite;
}

@keyframes scroll-line {
  0% {
    transform: scaleY(0);
    transform-origin: top;
    opacity: 1;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
    opacity: 1;
  }
  51% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
    opacity: 0.3;
  }
}

@media (max-width: 767px) {
  .hero__bottom {
    align-items: center;
    padding-left: var(--space-md);
    padding-right: var(--space-md);
  }

  .hero {
    --hero-copy-y-center: calc(-50vh + 6.5rem);
    --hero-copy-y-rest: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__diagram {
    opacity: 1;
    transition: none;
  }

  .hero__bg-overlay {
    opacity: 1;
    transition: none;
  }

  .hero__intro-curtain {
    display: none;
  }

  .hero__text-area,
  .hero__title-block {
    transform: none;
    transition: none;
  }

  .hero__type-char {
    opacity: 1;
  }

  .hero__headline-line__bar {
    transform: scaleX(1);
    animation: none;
    opacity: 1;
  }

  .hero__headline-line__text {
    opacity: 0.8;
    animation: none;
  }

  .hero__scroll-indicator {
    opacity: 1;
    animation: none;
  }

  .hero__scroll-line {
    animation: none;
    opacity: 0.4;
  }
}
</style>
