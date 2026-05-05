<template>
  <section ref="sectionRef" class="course-wrapper layer-stack-container">
    <!-- Scroll progress: sticky within section so it stays centered while layers stack -->
    <div class="course-layer-stack">
      <!-- Course Panel: メディア工学 -->
      <div
        ref="mediaCardRef"
        class="sticky-card course-panel course-panel--media"
      >
        <div class="course-visual course-visual--media">
          <div class="course-visual__inner">
            <div class="course-slideshow">
              <div class="course-slideshow__slides" aria-hidden="true">
                <img
                  v-for="(src, i) in mediaSlideshow.sources"
                  :key="src"
                  :src="src"
                  alt=""
                  class="course-slideshow__img"
                  :class="{
                    'course-slideshow__img--active':
                      mediaSlideshow.currentIndex === i,
                  }"
                  width="1200"
                  height="800"
                  decoding="async"
                />
              </div>
              <div
                class="course-slideshow__gradient course-slideshow__gradient--media"
                aria-hidden="true"
              />
              <div class="course-visual__label">
                <span class="course-visual__num">01</span>
              </div>
              <div
                class="course-slideshow__dots"
                role="group"
                aria-label="メディア工学 スライドの位置"
              >
                <span
                  v-for="(_, i) in mediaSlideshow.sources"
                  :key="i"
                  class="course-slideshow__dot"
                  :class="{
                    'course-slideshow__dot--active':
                      mediaSlideshow.currentIndex === i,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="course-text">
          <div class="course-text__inner">
            <p class="course-text__section-label text-label">
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
            <div class="course-slideshow">
              <div class="course-slideshow__slides" aria-hidden="true">
                <img
                  v-for="(src, i) in knowledgeSlideshow.sources"
                  :key="src"
                  :src="src"
                  alt=""
                  class="course-slideshow__img"
                  :class="{
                    'course-slideshow__img--active':
                      knowledgeSlideshow.currentIndex === i,
                  }"
                  width="1200"
                  height="800"
                  decoding="async"
                />
              </div>
              <div
                class="course-slideshow__gradient course-slideshow__gradient--knowledge"
                aria-hidden="true"
              />
              <div class="course-visual__label">
                <span class="course-visual__num">02</span>
              </div>
              <div
                class="course-slideshow__dots"
                role="group"
                aria-label="知識工学 スライドの位置"
              >
                <span
                  v-for="(_, i) in knowledgeSlideshow.sources"
                  :key="i"
                  class="course-slideshow__dot"
                  :class="{
                    'course-slideshow__dot--active':
                      knowledgeSlideshow.currentIndex === i,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="course-text">
          <div class="course-text__inner">
            <p class="course-text__section-label text-label">
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
            <div class="course-slideshow">
              <div class="course-slideshow__slides" aria-hidden="true">
                <img
                  v-for="(src, i) in designSlideshow.sources"
                  :key="src"
                  :src="src"
                  alt=""
                  class="course-slideshow__img"
                  :class="{
                    'course-slideshow__img--active':
                      designSlideshow.currentIndex === i,
                  }"
                  width="1200"
                  height="800"
                  decoding="async"
                />
              </div>
              <div
                class="course-slideshow__gradient course-slideshow__gradient--design"
                aria-hidden="true"
              />
              <div class="course-visual__label">
                <span class="course-visual__num">03</span>
              </div>
              <div
                class="course-slideshow__dots"
                role="group"
                aria-label="情報デザイン スライドの位置"
              >
                <span
                  v-for="(_, i) in designSlideshow.sources"
                  :key="i"
                  class="course-slideshow__dot"
                  :class="{
                    'course-slideshow__dot--active':
                      designSlideshow.currentIndex === i,
                  }"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="course-text">
          <div class="course-text__inner">
            <p class="course-text__section-label text-label">
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

const publicPath = usePublicPath();

const SLIDE_INTERVAL_MS = 4800;

function useImageSlideshow(sources: readonly string[]) {
  const currentIndex = ref(0);
  let timer: ReturnType<typeof setInterval> | undefined;
  onMounted(() => {
    timer = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % sources.length;
    }, SLIDE_INTERVAL_MS);
  });
  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });
  return reactive({
    currentIndex,
    sources,
  });
}

const mediaSlideshow = useImageSlideshow([
  publicPath("images/img1.jpg"),
  publicPath("images/img2.jpg"),
  publicPath("images/img3.jpg"),
]);
const knowledgeSlideshow = useImageSlideshow([
  publicPath("images/img4.jpg"),
  publicPath("images/img5.jpg"),
  publicPath("images/img6.jpg"),
]);
const designSlideshow = useImageSlideshow([
  publicPath("images/img7.jpg"),
  publicPath("images/img8.jpg"),
  publicPath("images/img9.jpg"),
]);

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
}

/* Image slideshow */
.course-slideshow {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.course-slideshow__slides {
  position: absolute;
  inset: 0;
}

.course-slideshow__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 900ms ease-in-out;
  z-index: 0;
}

.course-slideshow__img--active {
  opacity: 0.7;
  z-index: 0;
}

/* Course tint over photos (subtle brand gradient) */
.course-slideshow__gradient {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.course-slideshow__gradient--media {
  background: linear-gradient(
    165deg,
    rgba(var(--color-media-on-dark-channel), 0.22) 0%,
    transparent 42%,
    rgba(var(--color-media-on-dark-channel), 0.08) 78%,
    rgba(14, 12, 26, 0.45) 100%
  );
}

.course-slideshow__gradient--knowledge {
  background: linear-gradient(
    195deg,
    rgba(var(--color-knowledge-on-dark-channel), 0.2) 0%,
    transparent 48%,
    rgba(var(--color-knowledge-on-dark-channel), 0.1) 72%,
    rgba(7, 13, 26, 0.48) 100%
  );
}

.course-slideshow__gradient--design {
  background: linear-gradient(
    180deg,
    rgba(var(--color-design-on-dark-channel), 0.2) 0%,
    transparent 45%,
    rgba(var(--color-design-on-dark-channel), 0.09) 75%,
    rgba(26, 12, 9, 0.46) 100%
  );
}

.course-slideshow__dots {
  position: absolute;
  left: 50%;
  bottom: var(--space-md);
  transform: translateX(-50%);
  z-index: 4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  pointer-events: none;
}

.course-slideshow__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(252, 249, 248, 0.35);
  transition:
    opacity 400ms ease,
    transform 400ms ease,
    background-color 400ms ease;
}

.course-slideshow__dot--active {
  background: rgba(252, 249, 248, 0.92);
  transform: scale(1.15);
}

.course-visual__label {
  position: absolute;
  top: var(--space-lg);
  left: var(--space-lg);
  z-index: 3;
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
  display: flex;
  align-items: center;
  overflow-y: auto;
}

.course-panel--media .course-text {
  background-color: var(--color-media);
}

.course-panel--knowledge .course-text {
  background-color: var(--color-knowledge);
}

.course-panel--design .course-text {
  background-color: var(--color-design);
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
  color: rgba(252, 249, 248, 0.6);
}

.course-text__name {
  font-family: var(--font-display);
  font-size: clamp(2rem, 3vw, var(--text-4xl));
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: #fcf9f8;
}

.course-text__tagline {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
  color: #fcf9f8;
}

.course-text__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.8;
  color: rgba(252, 249, 248, 0.78);
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
  color: rgba(252, 249, 248, 0.78);
  letter-spacing: 0.04em;
  padding-left: 1rem;
  position: relative;
}

.course-text__keywords li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: rgba(252, 249, 248, 0.5);
  opacity: 1;
}

.course-text__link {
  margin-top: var(--space-xs);
  color: #fcf9f8;
}

.course-text__link:hover {
  color: rgba(252, 249, 248, 0.75);
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
</style>
