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
      <div class="hero__grid" />
    </div>

    <!-- 初回表示: 黒画面 -->
    <div
      v-if="introPhase !== 'done'"
      class="hero__intro-curtain"
      aria-hidden="true"
    />

    <!-- 上部メタ情報 -->
    <div class="hero__meta" aria-hidden="true">
      <span>Chiba Institute of Technology</span>
      <span class="hero__meta-right">
        <span class="hero__fig">FIG.01 — Domain map</span>
        <span class="hero__coord">35.69°N 140.02°E</span>
      </span>
    </div>

    <!-- 見出し: 画面左下 -->
    <div class="hero__copy">
      <p class="hero__label section-label" :class="{ 'is-in': siteIn }">
        <span class="section-label__index">[ 00 ]</span>Dept. of Intelligent
        Media Engineering
      </p>
      <h1
        class="hero__headline"
        :class="{ 'is-in': headlineIn }"
        :aria-label="HEADLINE"
      >
        <span
          v-for="(line, i) in HEADLINE_LINES"
          :key="line"
          class="hero__line"
          :style="{ '--i': i }"
          aria-hidden="true"
        >
          <span class="hero__line-inner"
            >{{ line
            }}<span
              v-if="i === HEADLINE_LINES.length - 1"
              class="hero__cursor"
            /></span>
        </span>
      </h1>
      <div class="hero__sub" :class="{ 'is-in': headlineIn }">
        <p class="hero__lead">
          音・AI・デザインを横断し、まだないコミュニケーションを設計・実装する。
        </p>
        <p class="hero__lead-en">Designing communication that doesn't exist yet.</p>
      </div>
    </div>

    <!-- 最新ニュース・記事: 画面右下 -->
    <div
      v-if="latestNews.length || latestArticles.length"
      class="hero__feeds"
    >
      <div v-if="latestNews.length" class="hero__news">
        <NuxtLink to="/news" class="hero__news-heading"
          >News <span aria-hidden="true">→</span></NuxtLink
        >
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
      <div v-if="latestArticles.length" class="hero__news hero__news--articles">
        <NuxtLink to="/articles" class="hero__news-heading"
          >Articles <span aria-hidden="true">→</span></NuxtLink
        >
        <ul class="hero__news-list">
          <li
            v-for="item in latestArticles"
            :key="item.url"
            class="hero__news-item"
          >
            <a
              :href="item.url"
              class="hero__news-link"
              target="_blank"
              rel="noopener"
            >
              <time class="hero__news-date">{{ formatDate(item.date) }}</time>
              <span class="hero__news-title">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- 下部バー -->
    <div class="hero__bar" aria-hidden="true">
      <span class="hero__scroll">Scroll<span class="hero__scroll-line" /></span>
      <span class="hero__hint">Drag to rotate</span>
      <span class="hero__counter">001 / 006</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";

type IntroPhase = "center" | "slide" | "reveal" | "done";

// 見出しは 3 行に組む（h1 の読み上げは HEADLINE 全体）
const HEADLINE_LINES = ["新時代の", "コミュニケーション", "をつくる"];
const HEADLINE = HEADLINE_LINES.join("");

// CourseScrolly がアクティブな間はヒーローのコピーをフェードアウト
const courseFocus = useState<
  "media" | "knowledge" | "design" | "all" | null
>("heroFocusDomain", () => null);

// 画面右下に出す最新ニュース・記事 各2件（スクロールすると隠す。SP はニュース 1 件のみ）
const HERO_FEED_COUNT = 2;
const { articles: news } = useNews();
const { articles: noteArticles } = useArticles();
const latestNews = computed(() => news.value.slice(0, HERO_FEED_COUNT));
const latestArticles = computed(() =>
  noteArticles.value.slice(0, HERO_FEED_COUNT),
);
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
  background-color: var(--color-bg-base);
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
  opacity: 0;
  transition: opacity 0.7s ease;
}

.hero--intro-reveal .hero__diagram,
.hero--intro-done .hero__diagram {
  opacity: 1;
}

/* 左下の見出しを読ませるため、左下だけを暗くする */
.hero__bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background:
    linear-gradient(to top, var(--color-bg-base) 0%, transparent 34%),
    radial-gradient(
      ellipse 70% 60% at 0% 100%,
      rgba(11, 13, 14, 0.9) 0%,
      rgba(11, 13, 14, 0.55) 45%,
      transparent 75%
    );
  opacity: 0;
  transition: opacity 0.6s ease 0.2s;
}

.hero--intro-reveal .hero__bg-overlay,
.hero--intro-done .hero__bg-overlay {
  opacity: 1;
}

/* 12 カラムの細罫線 */
.hero__grid {
  position: absolute;
  inset: 0 var(--layout-margin);
  z-index: 1;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to right,
    var(--color-line-subtle) 0 1px,
    transparent 1px calc(100% / 12)
  );
  border-right: 1px solid var(--color-line-subtle);
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

/* 上部メタ */
.hero__meta {
  position: absolute;
  top: calc(72px + 1.75rem);
  left: var(--layout-margin);
  right: var(--layout-margin);
  z-index: 9;
  display: flex;
  justify-content: space-between;
  gap: var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  pointer-events: none;
  transition: opacity 0.5s ease;
}

.hero__meta-right {
  display: flex;
  gap: var(--space-md);
}

.hero__fig {
  color: var(--color-accent);
}

/* 見出しブロック: 画面左下 */
.hero__copy {
  position: absolute;
  left: var(--layout-margin);
  right: var(--layout-margin);
  bottom: calc(72px + clamp(1.5rem, 4vh, 2.5rem));
  z-index: 9;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.25rem, 3vh, 2rem);
  /* ドラッグ操作を背面の 3D（HeroFoamBg）へ透過させる */
  pointer-events: none;
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
}

/* CourseScrolly 進行中はヒーローの前景を退避 */
.hero--course-mode .hero__copy,
.hero--course-mode .hero__feeds,
.hero--course-mode .hero__bar,
.hero--course-mode .hero__meta {
  opacity: 0;
  pointer-events: none;
}

.hero--course-mode .hero__copy {
  transform: translateY(1.5rem);
}

.hero__label {
  opacity: 0;
  transform: translateY(0.5rem);
  transition:
    opacity 0.9s ease,
    transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
}

.hero__label.is-in {
  opacity: 1;
  transform: none;
}

.hero__headline {
  display: flex;
  flex-direction: column;
  margin: 0 0 0 -0.04em;
  font-family: var(--font-jp);
  font-size: clamp(2.5rem, 7.6vw, 7rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.06em;
  color: var(--color-text-primary);
}

/* 行ごとに下からせり上がる */
.hero__line {
  display: block;
  overflow: hidden;
  padding: 0.04em 0.08em 0.06em 0;
}

.hero__line-inner {
  display: inline-flex;
  align-items: center;
  transform: translateY(105%);
  transition: transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: calc(var(--i) * 110ms);
}

.hero__headline.is-in .hero__line-inner {
  transform: none;
}

.hero__cursor {
  display: inline-block;
  width: 0.11em;
  height: 0.8em;
  margin-left: 0.14em;
  background-color: var(--color-accent);
}

.hero--intro-done .hero__cursor {
  animation: hero-cursor 1.1s steps(1, end) 1.2s infinite;
}

@keyframes hero-cursor {
  50% {
    opacity: 0;
  }
}

.hero__sub {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 34rem;
  opacity: 0;
  transition: opacity 1s ease 0.45s;
}

.hero__sub.is-in {
  opacity: 1;
}

.hero__lead {
  font-family: var(--font-jp);
  font-size: clamp(0.9375rem, 1.3vw, 1.0625rem);
  line-height: 1.9;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
}

.hero__lead-en {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}

/* 最新ニュース・記事: 画面右下 */
.hero__feeds {
  position: absolute;
  right: var(--layout-margin);
  bottom: calc(72px + clamp(1.5rem, 4vh, 2.5rem));
  z-index: 9;
  width: min(24rem, 30vw);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem 1.25rem 0.25rem;
  background-color: rgba(11, 13, 14, 0.72);
  border: 1px solid var(--color-line-subtle);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  pointer-events: auto;
  opacity: 0;
  transform: translateY(0.75rem);
  transition:
    opacity 0.7s ease,
    transform 0.7s ease;
}

.hero--intro-reveal .hero__feeds,
.hero--intro-done .hero__feeds {
  opacity: 1;
  transform: translateY(0);
}

/* スクロールしたらニュースは消す */
.hero--scrolled .hero__feeds {
  opacity: 0;
  transform: translateY(0.75rem);
  pointer-events: none;
}

.hero__news {
  display: flex;
  flex-direction: column;
}

.hero__news-heading {
  align-self: flex-start;
  margin-bottom: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 150ms ease;
}

.hero__news-heading span {
  color: var(--color-accent);
}

.hero__news-heading:hover {
  color: var(--color-text-primary);
}

.hero__news-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.hero__news-item {
  margin: 0;
  border-top: 1px solid var(--color-line);
}

.hero__news-link {
  display: grid;
  grid-template-columns: 5.75rem 1fr;
  gap: 0.75rem;
  padding: 0.55rem 0;
  text-decoration: none;
  color: var(--color-text-primary);
  transition: color 150ms ease;
}

.hero__news-link:hover {
  color: var(--color-accent-bright);
}

.hero__news-date {
  padding-top: 0.15em;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
}

.hero__news-title {
  font-family: var(--font-jp);
  font-size: 0.8125rem;
  line-height: 1.55;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 下部バー */
.hero__bar {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9;
  height: 72px;
  padding: 0 var(--layout-margin);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--color-line-subtle);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.hero--intro-done .hero__bar {
  opacity: 1;
  transition-delay: 0.6s;
}

.hero--intro-done.hero--course-mode .hero__bar {
  opacity: 0;
  transition-delay: 0s;
}

.hero__scroll {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  color: var(--color-text-secondary);
}

.hero__scroll-line {
  position: relative;
  width: 4rem;
  height: 1px;
  overflow: hidden;
  background-color: var(--color-line);
}

.hero__scroll-line::after {
  content: "";
  position: absolute;
  inset: 0;
  background-color: var(--color-accent);
  transform: translateX(-100%);
}

.hero--intro-done .hero__scroll-line::after {
  animation: hero-scroll-line 2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes hero-scroll-line {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 狭い画面: 最新ニュース 1 件だけを下部バーの直上に 1 行で出す */
@media (max-width: 1099px) {
  .hero__feeds {
    left: var(--layout-margin);
    width: auto;
    bottom: calc(72px + 0.75rem);
    padding: 0;
    background: none;
    border: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }

  .hero__news--articles,
  .hero__news-item:nth-child(n + 2) {
    display: none;
  }

  .hero__news {
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    border-top: 1px solid var(--color-line);
  }

  .hero__news-heading {
    margin: 0;
  }

  .hero__news-list {
    flex: 1;
    min-width: 0;
  }

  .hero__news-item {
    border-top: none;
  }

  .hero__news-title {
    -webkit-line-clamp: 1;
    line-clamp: 1;
  }

  .hero:has(.hero__feeds) .hero__copy {
    bottom: calc(72px + 5.25rem);
  }
}

@media (max-width: 767px) {
  .hero__meta {
    top: calc(72px + 1rem);
  }

  .hero__fig,
  .hero__coord,
  .hero__hint {
    display: none;
  }

  .hero__headline {
    font-size: clamp(2.25rem, 10.4vw, 3.25rem);
  }

  .hero__copy {
    bottom: calc(64px + 1.5rem);
  }

  .hero__feeds {
    bottom: calc(64px + 0.5rem);
  }

  .hero:has(.hero__feeds) .hero__copy {
    bottom: calc(64px + 4.75rem);
  }

  .hero__news-link {
    grid-template-columns: 1fr;
    gap: 0.15rem;
  }

  .hero__bar {
    height: 64px;
  }
}

@media (pointer: coarse) {
  .hero__hint {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__diagram,
  .hero__bg-overlay {
    opacity: 1;
    transition: none;
  }

  .hero__intro-curtain {
    display: none;
  }

  .hero__copy,
  .hero__feeds {
    transition: opacity 0.2s linear;
  }

  .hero--course-mode .hero__copy {
    transform: none;
  }

  .hero__label,
  .hero__sub,
  .hero__line-inner {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .hero__bar {
    opacity: 1;
  }

  .hero__cursor,
  .hero__scroll-line::after {
    animation: none;
  }
}
</style>
