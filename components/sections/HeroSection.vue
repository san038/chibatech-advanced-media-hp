<template>
  <section
    class="hero"
    :class="{
      'hero--intro-center': introPhase === 'center',
      'hero--intro-slide': introPhase === 'slide',
      'hero--intro-reveal': introPhase === 'reveal',
      'hero--intro-done': introPhase === 'done',
      'hero--course-mode': courseFocus !== null,
      'hero--scrolled': scrolled,
    }"
  >
    <!-- Background visual element -->
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__diagram">
        <HeroFoamBg />
      </div>
      <div class="hero__bg-overlay" />
    </div>

    <!-- 初回表示: 黒画面 -->
    <div
      v-if="introPhase !== 'done'"
      class="hero__intro-curtain"
      aria-hidden="true"
    />

    <!-- 見出し: 画面中央左・左寄せ -->
    <div class="hero__copy">
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

    <!-- 最新ニュース3件: 画面左端下 -->
    <div v-if="latestNews.length" class="hero__news">
      <p class="hero__news-heading">News</p>
      <ul class="hero__news-list">
        <li
          v-for="item in latestNews"
          :key="item.slug"
          class="hero__news-item"
        >
          <NuxtLink :to="`/news/${item.slug}`" class="hero__news-link">
            <time class="hero__news-date">{{ formatDate(item.date) }}</time>
            <span class="hero__news-title">{{ item.title }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>

    <div class="hero__scroll-indicator" aria-hidden="true">
      <span class="hero__scroll-text">Scroll</span>
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

type IntroPhase = "center" | "slide" | "reveal" | "done";

const SITE_TITLE = "千葉工業大学メディア工学科";
const HEADLINE = "新時代のコミュニケーションをつくる";

// CourseScrolly がアクティブな間はヒーローのコピーをフェードアウト
const courseFocus = useState<
  "media" | "knowledge" | "design" | "all" | null
>("heroFocusDomain", () => null);

// 画面左端下に出す最新ニュース3件（スクロールすると隠す）
const { articles } = useNews();
const latestNews = computed(() => articles.value.slice(0, 3));
const scrolled = ref(false);

function onScroll() {
  scrolled.value = window.scrollY > window.innerHeight * 0.12;
}

function formatDate(value: string): string {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

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
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

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
  window.removeEventListener("scroll", onScroll);
});
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  background-color: #1c1b1b;
  overflow: hidden;
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
  z-index: 3;
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

/* 見出しブロック: 画面中央・左寄せ */
.hero__copy {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9;
  padding: 0 var(--space-md);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

/* CourseScrolly 進行中はヒーローの前景を退避 */
.hero--course-mode .hero__copy,
.hero--course-mode .hero__news,
.hero--course-mode .hero__scroll-indicator {
  opacity: 0;
  pointer-events: none;
}

.hero--course-mode .hero__copy {
  transform: translateY(calc(-50% + 1.5rem));
}

.hero__title-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.65em;
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
  text-align: left;
  color: rgba(252, 249, 248, 0.72);
}

.hero__headline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35em;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-align: left;
}

.hero__headline-line {
  position: relative;
  display: inline-block;
  /* 左は隙間なし。1行固定（背景に重なってよい） */
  padding: 0.08em 0.28em 0.08em 0;
  white-space: nowrap;
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

/* 最新ニュース: 画面左端下 */
.hero__news {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 9;
  padding: var(--space-md);
  padding-bottom: max(var(--space-md), env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  max-width: min(86vw, 24rem);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(0.75rem);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.hero--intro-reveal .hero__news,
.hero--intro-done .hero__news {
  opacity: 1;
  transform: translateY(0);
}

/* スクロールしたらニュースは消す */
.hero--scrolled .hero__news {
  opacity: 0;
  transform: translateY(0.75rem);
  pointer-events: none;
}

.hero__news-heading {
  margin: 0;
  font-family: var(--font-body);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(252, 249, 248, 0.4);
}

.hero__news-list {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.hero__news-item {
  margin: 0;
}

.hero__news-link {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  text-decoration: none;
  color: rgba(252, 249, 248, 0.72);
  transition: color 150ms ease;
}

.hero__news-link:hover {
  color: #fcf9f8;
}

.hero__news-date {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  color: rgba(252, 249, 248, 0.42);
}

.hero__news-link:hover .hero__news-date {
  color: rgba(252, 249, 248, 0.66);
}

.hero__news-title {
  font-family: var(--font-body);
  font-size: 0.8rem;
  line-height: 1.45;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Scroll indicator */
.hero__scroll-indicator {
  position: absolute;
  left: 50%;
  bottom: var(--space-md);
  transform: translateX(-50%);
  z-index: 9;
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
  .hero__copy {
    top: 42%;
  }

  .hero__news {
    max-width: min(92vw, 26rem);
  }

  /* ニュースと重ならないよう Scroll を右下へ */
  .hero__scroll-indicator {
    left: auto;
    right: var(--space-md);
    transform: none;
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

  .hero__title-block {
    transform: none;
    transition: none;
  }

  .hero__copy,
  .hero__news {
    transition: opacity 0.2s linear;
  }

  .hero--course-mode .hero__copy {
    transform: translateY(-50%);
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
