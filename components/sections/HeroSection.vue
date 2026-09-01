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

    <!-- 見出し: 画面中央 -->
    <div class="hero__copy">
      <div class="hero__title-block">
        <p class="hero__site-title" :class="{ 'is-in': siteIn }">
          {{ SITE_TITLE }}
        </p>
        <h1 class="hero__headline" :class="{ 'is-in': headlineIn }">
          <span class="hero__headline-line">
            <span class="hero__headline-line__bar" aria-hidden="true" />
            <span class="hero__headline-line__text">{{ HEADLINE }}</span>
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

// イントロ演出のタイミング
const INTRO_LEAD_MS = 140; // マウント後、サイト名がふわっと入り始めるまで
const INTRO_STAGGER_MS = 340; // サイト名 → ヘッドライン（ゆったり重ねる）
// 3D はテキストの完了を待たず、早めに出す
const INTRO_REVEAL_MS = 240; // カーテンが引き、3D が現れ始めるまで
const INTRO_DIAGRAM_REVEAL_MS = 900; // reveal → done

const introPhase = ref<IntroPhase>("center");
const introTimeouts: ReturnType<typeof setTimeout>[] = [];
const siteIn = ref(false);
const headlineIn = ref(false);

function afterIntro(ms: number, fn: () => void) {
  introTimeouts.push(setTimeout(fn, ms));
}

function clearIntroTimeouts() {
  for (const t of introTimeouts) clearTimeout(t);
  introTimeouts.length = 0;
}

function startIntro() {
  introPhase.value = "center";
  siteIn.value = false;
  headlineIn.value = false;

  // テキスト: ゆったり・ふわっと、少し重なりながら入る
  afterIntro(INTRO_LEAD_MS, () => {
    siteIn.value = true;
  });
  afterIntro(INTRO_LEAD_MS + INTRO_STAGGER_MS, () => {
    headlineIn.value = true;
  });

  // 3D: テキストと並行して早く現れる
  afterIntro(INTRO_REVEAL_MS, () => {
    introPhase.value = "reveal";
  });
  afterIntro(INTRO_REVEAL_MS + INTRO_DIAGRAM_REVEAL_MS, () => {
    introPhase.value = "done";
  });
}

onMounted(() => {
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  if (reduceMotion) {
    siteIn.value = true;
    headlineIn.value = true;
    introPhase.value = "done";
    return;
  }

  startIntro();
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
  transition: opacity 0.7s ease;
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
  transition: opacity 0.6s ease 0.2s;
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
  transition: opacity 0.5s ease;
}

.hero--intro-reveal .hero__intro-curtain {
  opacity: 0;
}

/* 見出しブロック: 画面中央 */
.hero__copy {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 9;
  padding: 0 var(--space-md);
  text-align: center;
  /* ドラッグ操作を背面の 3D（HeroFoamBg）へ透過させる */
  pointer-events: none;
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
  align-items: center;
  gap: 0.65em;
}

.hero__site-title {
  margin: 0;
  font-family: var(--font-body);
  font-size: clamp(0.8125rem, 1.6vw, 1rem);
  font-weight: 500;
  letter-spacing: 0.12em;
  text-align: center;
  color: rgba(252, 249, 248, 0.72);
  opacity: 0;
  /* 中心からふわっと（scale を拡大しながらフォーカスイン） */
  transform: scale(0.94);
  transform-origin: center;
  filter: blur(5px);
  will-change: opacity, transform, filter;
  transition:
    opacity 1.1s ease,
    transform 1.2s cubic-bezier(0.22, 1, 0.36, 1),
    filter 1.1s ease;
}

.hero__site-title.is-in {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

.hero__headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35em;
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5vw, 3.25rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.15;
  text-align: center;
  opacity: 0;
  /* 中心からふわっと */
  transform: scale(0.9);
  transform-origin: center;
  filter: blur(7px);
  will-change: opacity, transform, filter;
  transition:
    opacity 1.2s ease,
    transform 1.35s cubic-bezier(0.22, 1, 0.36, 1),
    filter 1.2s ease;
}

.hero__headline.is-in {
  opacity: 1;
  transform: scale(1);
  filter: blur(0);
}

.hero__headline-line {
  position: relative;
  display: inline-block;
  /* 1行固定（背景に重なってよい） */
  padding: 0.08em 0.28em;
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
  animation: hero-fade-in 0.6s ease 0.9s forwards;
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

  /* 中央寄せで両端が切れないよう、狭い画面では折り返す */
  .hero__headline-line {
    white-space: normal;
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

  .hero__site-title,
  .hero__headline {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
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
