<template>
  <section ref="sectionRef" class="course-wrapper layer-stack-container">
    <!-- Scroll progress: sticky within section so it stays centered while layers stack -->
    <div class="course-dots-anchor" aria-hidden="true">
      <div class="course-progress">
        <div
          class="course-progress__dot"
          :class="{ active: activeIndex === 0 }"
          style="background-color: var(--color-media-on-dark)"
        />
        <div
          class="course-progress__dot"
          :class="{ active: activeIndex === 1 }"
          style="background-color: var(--color-knowledge-on-dark)"
        />
        <div
          class="course-progress__dot"
          :class="{ active: activeIndex === 2 }"
          style="background-color: var(--color-design-on-dark)"
        />
      </div>
    </div>

    <div class="course-layer-stack">
      <!-- Course Panel: メディア工学 -->
      <div
        ref="mediaCardRef"
        class="sticky-card course-panel course-panel--media"
      >
        <div class="course-visual course-visual--media">
          <div class="course-visual__inner">
            <!-- Decorative geometric pattern -->
            <div
              class="course-visual__pattern course-visual__pattern--media"
              aria-hidden="true"
            >
              <div class="geo-circle geo-circle--1" />
              <div class="geo-circle geo-circle--2" />
              <div class="geo-wave" />
            </div>
            <div class="course-visual__label">
              <span class="course-visual__num">01</span>
            </div>
          </div>
        </div>
        <div class="course-text">
          <div class="course-text__inner">
            <p
              class="course-text__section-label text-label"
              style="color: var(--color-media)"
            >
              Media Engineering
            </p>
            <h2 class="course-text__name">メディア工学</h2>
            <p class="course-text__tagline">
              音・映像・インタラクションの<br />最前線
            </p>
            <p class="course-text__desc">
              人間の知覚と感情に直接作用するメディアの技術を探究します。音響処理からXR体験まで、感動を設計する力を身につける。
            </p>
            <ul class="course-text__keywords">
              <li>音響信号処理</li>
              <li>映像メディア</li>
              <li>XR・仮想現実</li>
              <li>センサーシステム</li>
            </ul>
            <NuxtLink to="/about#media" class="link-arrow course-text__link">
              詳しく見る
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Course Panel: 知識工学 -->
      <div
        ref="knowledgeCardRef"
        class="sticky-card course-panel course-panel--knowledge"
      >
        <div class="course-visual course-visual--knowledge">
          <div class="course-visual__inner">
            <div
              class="course-visual__pattern course-visual__pattern--knowledge"
              aria-hidden="true"
            >
              <div class="geo-node geo-node--1" />
              <div class="geo-node geo-node--2" />
              <div class="geo-node geo-node--3" />
              <div class="geo-edge geo-edge--1" />
              <div class="geo-edge geo-edge--2" />
            </div>
            <div class="course-visual__label">
              <span class="course-visual__num">02</span>
            </div>
          </div>
        </div>
        <div class="course-text">
          <div class="course-text__inner">
            <p
              class="course-text__section-label text-labe"
              style="color: var(--color-knowledge)"
            >
              Knowledge Engineering
            </p>
            <h2 class="course-text__name">知識工学</h2>
            <p class="course-text__tagline">AIと知識で世界を<br />解析する</p>
            <p class="course-text__desc">
              機械学習・深層学習・自然言語処理を駆使し、データの海から知識を抽出する力を培います。AIが社会を変える現場の最前線へ。
            </p>
            <ul class="course-text__keywords">
              <li>機械学習・深層学習</li>
              <li>自然言語処理</li>
              <li>知識グラフ</li>
              <li>推薦システム</li>
            </ul>
            <NuxtLink
              to="/about#knowledge"
              class="link-arrow course-text__link"
            >
              詳しく見る
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Course Panel: 情報デザイン -->
      <div
        ref="designCardRef"
        class="sticky-card course-panel course-panel--design"
      >
        <div class="course-visual course-visual--design">
          <div class="course-visual__inner">
            <div
              class="course-visual__pattern course-visual__pattern--design"
              aria-hidden="true"
            >
              <div class="geo-rect geo-rect--1" />
              <div class="geo-rect geo-rect--2" />
              <div class="geo-rect geo-rect--3" />
            </div>
            <div class="course-visual__label">
              <span class="course-visual__num">03</span>
            </div>
          </div>
        </div>
        <div class="course-text">
          <div class="course-text__inner">
            <p
              class="course-text__section-label text-label"
              style="color: var(--color-design)"
            >
              Information Design
            </p>
            <h2 class="course-text__name">情報デザイン</h2>
            <p class="course-text__tagline">伝わる形を<br />設計する</p>
            <p class="course-text__desc">
              情報をどう見せ、どう伝えるか。UXデザイン・データ可視化・コミュニケーション設計を通じ、人と情報の橋渡しをする力を磨く。
            </p>
            <ul class="course-text__keywords">
              <li>UX/UIデザイン</li>
              <li>データ可視化</li>
              <li>タイポグラフィ</li>
              <li>コミュニケーション設計</li>
            </ul>
            <NuxtLink to="/about#design" class="link-arrow course-text__link">
              詳しく見る
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/** Sticky layer stack: each course is a full-viewport sticky card; the next card slides over
 *  the previous while scaling/dimming it (see code.html reference). */

const sectionRef = ref<HTMLElement | null>(null);
const mediaCardRef = ref<HTMLElement | null>(null);
const knowledgeCardRef = ref<HTMLElement | null>(null);
const designCardRef = ref<HTMLElement | null>(null);
const activeIndex = ref(0);

let rafId = 0;

const updateLayerStack = () => {
  const vh = window.innerHeight;
  const cards = [
    mediaCardRef.value,
    knowledgeCardRef.value,
    designCardRef.value,
  ];

  cards.forEach((card, i) => {
    if (!card || i === cards.length - 1) return;
    const next = cards[i + 1];
    if (!next) return;
    const nextRect = next.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, 1 - nextRect.top / vh));
    // const scale = 1 - progress * 0.06;
    const translateY = -progress * 24;
    const brightness = 1 - progress * 0.32;
    card.style.transform = `translateY(${translateY}px)`;
    card.style.filter = `brightness(${brightness})`;
  });

  const section = sectionRef.value;
  if (section) {
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const relativeScroll = window.scrollY - sectionTop;
    const next = Math.min(
      2,
      Math.max(0, Math.floor(Math.max(0, relativeScroll) / vh)),
    );
    if (activeIndex.value !== next) {
      activeIndex.value = next;
    }
  }

  rafId = requestAnimationFrame(updateLayerStack);
};

onMounted(() => {
  rafId = requestAnimationFrame(updateLayerStack);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
/* Three stacked sticky viewports — total scroll height ≈ 300vh from document flow */
.course-wrapper.layer-stack-container {
  position: relative;
  overflow: visible;
}

.course-layer-stack {
  position: relative;
}

/* Sticky layer cards (reference: stitch code.html) */
.sticky-card {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transform-origin: center top;
  will-change: transform, filter;
}

/* Top-edge shadow to read as physical stacking */
.sticky-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  background: rgba(0, 0, 0, 0.25);
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.35);
  z-index: 40;
  pointer-events: none;
}

.sticky-card:first-child::before {
  display: none;
}

.course-panel {
  display: flex;
  flex-direction: column;
}

.course-panel--media {
  z-index: 10;
}

.course-panel--knowledge {
  z-index: 20;
}

.course-panel--design {
  z-index: 30;
}

@media (min-width: 768px) {
  .course-panel {
    flex-direction: row;
  }
}

/* Visual area (70%) */
.course-visual {
  flex: none;
  height: 45vh;
  position: relative;
  overflow: hidden;
}

@media (min-width: 768px) {
  .course-visual {
    width: 70%;
    height: 100%;
  }
}

.course-visual--media {
  background-color: #0e0c1a;
}

.course-visual--knowledge {
  background-color: #070d1a;
}

.course-visual--design {
  background-color: #1a0c09;
}

.course-visual__inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Geometric patterns */
.course-visual__pattern {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

/* Media pattern: waves / circles */
.geo-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(var(--color-media-on-dark-channel), 0.4);
}

.geo-circle--1 {
  width: 60vw;
  height: 60vw;
  max-width: 500px;
  max-height: 500px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: rotate-slow 20s linear infinite;
}

.geo-circle--2 {
  width: 40vw;
  height: 40vw;
  max-width: 320px;
  max-height: 320px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-color: rgba(var(--color-media-on-dark-channel), 0.55);
  animation: rotate-slow 12s linear infinite reverse;
}

.geo-wave {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(
    to top,
    rgba(var(--color-media-on-dark-channel), 0.18) 0%,
    transparent 100%
  );
}

/* Knowledge pattern: nodes and edges */
.geo-node {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(var(--color-knowledge-on-dark-channel), 0.65);
}

.geo-node--1 {
  top: 30%;
  left: 30%;
  animation: node-pulse 3s ease-in-out infinite;
}
.geo-node--2 {
  top: 60%;
  left: 55%;
  animation: node-pulse 3s ease-in-out 1s infinite;
}
.geo-node--3 {
  top: 25%;
  left: 65%;
  animation: node-pulse 3s ease-in-out 2s infinite;
}

.geo-edge {
  position: absolute;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(var(--color-knowledge-on-dark-channel), 0.45),
    rgba(var(--color-knowledge-on-dark-channel), 0.12)
  );
  transform-origin: left center;
}

.geo-edge--1 {
  width: 25%;
  top: 33%;
  left: 31%;
  transform: rotate(30deg);
}

.geo-edge--2 {
  width: 30%;
  top: 45%;
  left: 42%;
  transform: rotate(-20deg);
}

/* Design pattern: rectangles */
.geo-rect {
  position: absolute;
  background: transparent;
  outline: 1px solid rgba(var(--color-design-on-dark-channel), 0.45);
}

.geo-rect--1 {
  width: 45%;
  height: 55%;
  top: 20%;
  left: 15%;
}

.geo-rect--2 {
  width: 30%;
  height: 35%;
  top: 35%;
  left: 45%;
  background-color: rgba(var(--color-design-on-dark-channel), 0.2);
}

.geo-rect--3 {
  width: 20%;
  height: 20%;
  bottom: 20%;
  right: 20%;
  background-color: rgba(var(--color-design-on-dark-channel), 0.14);
}

.course-visual__label {
  position: absolute;
  top: var(--space-lg);
  left: var(--space-lg);
}

.course-visual__num {
  font-family: var(--font-display);
  font-size: var(--text-7xl);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.05em;
  color: rgba(252, 249, 248, 0.04);
  user-select: none;
}

/* Text area (30%) */
.course-text {
  flex: 1;
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .course-text {
    width: 30%;
    flex: none;
  }
}

.course-text__inner {
  padding: var(--space-lg) var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  width: 100%;
}

@media (min-width: 1200px) {
  .course-text__inner {
    padding: var(--space-xl) var(--space-lg);
  }
}

.course-text__section-label {
  letter-spacing: 0.08em;
}

.course-text__name {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3vw, var(--text-4xl));
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
}

.course-text__tagline {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: var(--color-on-surface);
}

.course-text__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
}

.course-text__keywords {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.course-text__keywords li {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-on-surface-muted);
  letter-spacing: 0.04em;
  padding-left: 1rem;
  position: relative;
}

.course-text__keywords li::before {
  content: "—";
  position: absolute;
  left: 0;
  opacity: 0.4;
}

.course-panel--media .course-text__keywords li::before {
  color: var(--color-media);
}
.course-panel--knowledge .course-text__keywords li::before {
  color: var(--color-knowledge);
}
.course-panel--design .course-text__keywords li::before {
  color: var(--color-design);
}

.course-text__link {
  margin-top: var(--space-xs);
}

/* Progress dots: sticky within full-height overlay so they stay mid-viewport */
.course-dots-anchor {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-right: var(--space-md);
  pointer-events: none;
  z-index: 50;
}

.course-progress {
  position: sticky;
  top: 50vh;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  pointer-events: auto;
}

@media (min-width: 768px) {
  .course-dots-anchor {
    padding-right: calc(30% + var(--space-md));
  }
}

.course-progress__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  opacity: 0.3;
  transition:
    opacity 300ms ease,
    transform 300ms ease;
}

.course-progress__dot.active {
  opacity: 1;
  /* transform: scale(1.5); */
}

/* Animations */
@keyframes rotate-slow {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

@keyframes node-pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    /* transform: scale(1.4); */
  }
}
</style>
