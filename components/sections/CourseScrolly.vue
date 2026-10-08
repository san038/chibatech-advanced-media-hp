<template>
  <section class="course-scrolly" aria-label="コース紹介とビジョン">
    <article
      v-for="(course, i) in COURSES"
      :key="course.key"
      :ref="(el: unknown) => setPanel(el, i)"
      class="course-scrolly__panel"
      :class="[`is-${course.key}`, { 'is-active': activeIndex === i }]"
    >
      <div class="course-scrolly__scrim" aria-hidden="true" />
      <div class="course-scrolly__inner">
        <div class="course-scrolly__meta">
          <p class="course-scrolly__index">
            {{ String(i + 1).padStart(2, "0") }}
            <span aria-hidden="true">/ 03</span>
          </p>
          <p class="course-scrolly__count">Labs {{ labCount(course.key) }}</p>
        </div>
        <p class="course-scrolly__label">{{ course.en }}</p>
        <h2 class="course-scrolly__name">{{ course.name }}</h2>
        <p class="course-scrolly__tagline">
          <template v-for="(line, li) in course.tagline" :key="li"
            >{{ line }}</template
          >
        </p>
        <p class="course-scrolly__desc">{{ course.desc }}</p>
        <ul class="course-scrolly__keywords">
          <li
            v-for="kw in course.keywords"
            :key="kw"
            class="tag"
            :class="`tag-${course.key}`"
          >
            {{ kw }}
          </li>
        </ul>
        <NuxtLink :to="course.to" class="link-arrow course-scrolly__link">
          詳しく見る
        </NuxtLink>
      </div>
    </article>

    <!-- 3領域が重なる学科 ＝ ビジョン -->
    <article
      :ref="(el: unknown) => setPanel(el, 3)"
      class="course-scrolly__panel is-vision"
      :class="{ 'is-active': activeIndex === 3 }"
    >
      <div class="course-scrolly__scrim" aria-hidden="true" />
      <div class="course-scrolly__inner">
        <div class="course-scrolly__meta">
          <p class="course-scrolly__index">◎ <span aria-hidden="true">/ 03</span></p>
          <p class="course-scrolly__count">Media × Knowledge × Design</p>
        </div>
        <p class="course-scrolly__label">Vision</p>
        <p class="course-scrolly__tagline course-scrolly__tagline--vision">
          この世界に存在しないものを新しくつくる。<br />そのワクワクを味わってください。
        </p>
        <p class="course-scrolly__desc">
          例えばサッカー中継で、ゴールキーパーから見たシュートシーンの音や映像が流れたら、臨場感に溢れ、大いに盛り上がるでしょう。その実現に向けて研究を進めるのが、本学科で取り組む学びのひとつである「メディア工学」と呼ばれる分野です。しかしこれは未来のコミュニケーションの一例に過ぎません。他にもミリオンヒット曲を作曲する人工知能、使うだけで楽しくなるツールのデザインなど、知能メディア工学科の研究には、ワクワクするような未来が詰まっています。一緒に未来が求めるコミュニケーションを創出しましょう。
        </p>
      </div>
    </article>

    <!-- 進行インジケータ（コース紹介の間だけ画面下部に固定表示） -->
    <div
      class="course-scrolly__progress"
      :class="{ 'is-shown': activeIndex >= 0 }"
      aria-hidden="true"
    >
      <span class="course-scrolly__progress-label">Domains</span>
      <ol class="course-scrolly__steps">
        <li
          v-for="(step, i) in STEPS"
          :key="step"
          class="course-scrolly__step"
          :class="[
            `is-step-${PANEL_KEYS[i]}`,
            { 'is-current': activeIndex === i, 'is-past': activeIndex > i },
          ]"
        >
          {{ step }}
        </li>
      </ol>
      <span class="course-scrolly__progress-count">002 / 006</span>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type DomainKey = "media" | "knowledge" | "design";
type FocusKey = DomainKey | "all";

interface Course {
  key: DomainKey;
  en: string;
  name: string;
  tagline: string[];
  desc: string;
  keywords: string[];
  to: string;
}

// WP「サイトコンテンツ」で領域別に上書き可（未設定ならここのデフォルト）。
const cc = useContent().courseKeywords;
const COURSES: Course[] = [
  {
    key: "media",
    en: "Media Engineering",
    name: "メディア工学",
    tagline: ["音・映像・インタラクションの", "最前線"],
    desc: "人間の知覚と感情に直接作用するメディアの技術を探究します。音響処理からXR体験まで、感動を設計する力を身につける。",
    keywords: cc?.media ?? [
      "音響信号処理",
      "映像メディア",
      "XR・仮想現実",
      "センサーシステム",
    ],
    to: "/about#media",
  },
  {
    key: "knowledge",
    en: "Knowledge Engineering",
    name: "知識工学",
    tagline: ["AIと知識で世界を", "解析する"],
    desc: "機械学習・深層学習・自然言語処理を駆使し、データの海から知識を抽出する力を培います。AIが社会を変える現場の最前線へ。",
    keywords: cc?.knowledge ?? [
      "機械学習・深層学習",
      "自然言語処理",
      "知識グラフ",
      "推薦システム",
    ],
    to: "/about#knowledge",
  },
  {
    key: "design",
    en: "Information Design",
    name: "情報デザイン",
    tagline: ["伝わる形を", "設計する"],
    desc: "情報をどう見せ、どう伝えるか。UXデザイン・データ可視化・コミュニケーション設計を通じ、人と情報の橋渡しをする力を磨く。",
    keywords: cc?.design ?? [
      "UX/UIデザイン",
      "データ可視化",
      "タイポグラフィ",
      "コミュニケーション設計",
    ],
    to: "/about#design",
  },
];

// パネルの並び順に対応するフォーカスキー（4枚目 = ビジョン = 3領域収束）
const PANEL_KEYS: FocusKey[] = ["media", "knowledge", "design", "all"];

// HeroFoamBg と共有。中央バンドに入ったパネルの領域をハイライトさせる
const focusDomain = useState<FocusKey | null>("heroFocusDomain", () => null);
const activeIndex = ref(-1);

// 領域ごとの研究室数（WP の研究室データから数える）
const labs = useContent().labs;
const labCount = (key: DomainKey): string =>
  String(labs.filter((l) => l.pillar === key).length).padStart(2, "0");

// 下部の進行インジケータ（01 — 02 — 03 — ◎）
const STEPS = ["01", "02", "03", "◎"];

const panelEls: (HTMLElement | null)[] = [];
function setPanel(el: unknown, i: number) {
  panelEls[i] = el as HTMLElement | null;
}

const ratios = [0, 0, 0, 0];
let io: IntersectionObserver | null = null;

function recompute() {
  let best = 0;
  let bi = -1;
  ratios.forEach((r, i) => {
    if (r > best) {
      best = r;
      bi = i;
    }
  });
  activeIndex.value = bi;
  focusDomain.value = bi >= 0 ? PANEL_KEYS[bi] : null;
}

onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const i = panelEls.indexOf(e.target as HTMLElement);
        if (i >= 0) ratios[i] = e.isIntersecting ? e.intersectionRatio : 0;
      }
      recompute();
    },
    // ビューポート中央 30% のバンドだけを判定領域にする
    { threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin: "-35% 0px -35% 0px" },
  );
  for (const p of panelEls) if (p) io.observe(p);
});

onUnmounted(() => {
  io?.disconnect();
  focusDomain.value = null;
});
</script>

<style scoped>
.course-scrolly {
  position: relative;
  z-index: 1;
  /* 背面の固定ヒーロー（HeroFoamBg canvas）をドラッグ操作できるよう、
     テキスト列以外はポインタイベントを透過させる */
  pointer-events: none;
}

.course-scrolly__panel {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: calc(72px + var(--space-md)) var(--layout-margin) var(--space-xl);
  color: var(--color-text-primary);
}

/* 右側を暗くしてテキストを読ませ、左側はダイアグラムを見せる */
.course-scrolly__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    270deg,
    rgba(11, 13, 14, 0.92) 0%,
    rgba(11, 13, 14, 0.72) 32%,
    rgba(11, 13, 14, 0.2) 56%,
    transparent 76%
  );
}

.course-scrolly__inner {
  position: relative;
  width: 100%;
  max-width: 34rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  opacity: 0.3;
  transform: translateY(1.5rem);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
  /* .course-scrolly の pointer-events:none を打ち消し、リンク・テキスト選択を有効化 */
  pointer-events: auto;
}

@media (min-width: 768px) {
  .course-scrolly__inner {
    width: 46%;
  }

  .is-vision .course-scrolly__inner {
    max-width: 38rem;
  }
}

.course-scrolly__panel.is-active .course-scrolly__inner {
  opacity: 1;
  transform: translateY(0);
}

.course-scrolly__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-sm);
  padding-top: 0.875rem;
  margin-bottom: clamp(0.5rem, 3vh, 2rem);
  border-top: 2px solid var(--pillar, var(--color-accent));
}

.course-scrolly__index {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--pillar, var(--color-accent));
}

.course-scrolly__count {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.course-scrolly__label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--pillar, var(--color-accent));
}

.course-scrolly__name {
  margin-top: -0.5rem;
  font-family: var(--font-jp);
  font-size: clamp(2.25rem, 5.2vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.04em;
}

.course-scrolly__tagline {
  font-family: var(--font-jp);
  font-size: clamp(1.0625rem, 1.6vw, 1.375rem);
  font-weight: 700;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.course-scrolly__tagline--vision {
  font-size: clamp(1.375rem, 2vw, 2rem);
  line-height: 1.45;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.course-scrolly__desc {
  font-family: var(--font-body);
  font-size: 0.9375rem;
  line-height: 1.95;
  letter-spacing: 0.02em;
  color: var(--color-text-secondary);
}

.course-scrolly__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.course-scrolly__link {
  align-self: flex-start;
  margin-top: 0.25rem;
}

/* 領域アクセント */
.is-media {
  --pillar: var(--color-media);
}
.is-knowledge {
  --pillar: var(--color-knowledge);
}
.is-design {
  --pillar: var(--color-design);
}
.is-vision {
  --pillar: var(--color-accent);
}

/* 進行インジケータ */
.course-scrolly__progress {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 5;
  height: 72px;
  padding: 0 var(--layout-margin);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  border-top: 1px solid var(--color-line-subtle);
  background: linear-gradient(to top, rgba(11, 13, 14, 0.9), transparent);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.4s ease,
    visibility 0s linear 0.4s;
}

.course-scrolly__progress.is-shown {
  opacity: 1;
  visibility: visible;
  transition:
    opacity 0.4s ease,
    visibility 0s;
}

.course-scrolly__progress-label {
  color: var(--color-text-secondary);
}

.course-scrolly__steps {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.course-scrolly__step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  transition: color 0.3s ease;
}

.course-scrolly__step + .course-scrolly__step::before {
  content: "";
  width: 1.5rem;
  height: 1px;
  background-color: var(--color-line);
  transition: background-color 0.3s ease;
}

.course-scrolly__step.is-past,
.course-scrolly__step.is-current {
  color: var(--color-text-secondary);
}

.course-scrolly__step.is-current.is-step-media {
  color: var(--color-media);
}
.course-scrolly__step.is-current.is-step-knowledge {
  color: var(--color-knowledge);
}
.course-scrolly__step.is-current.is-step-design {
  color: var(--color-design);
}
.course-scrolly__step.is-current.is-step-all {
  color: var(--color-accent);
}

.course-scrolly__step.is-current::before,
.course-scrolly__step.is-past::before {
  background-color: var(--color-text-tertiary);
}

.course-scrolly__progress-count {
  margin-left: auto;
}

/* 縦長: ダイアグラムを上に見せ、テキストは下寄せ */
@media (max-width: 767px), (max-aspect-ratio: 11/10) {
  .course-scrolly__panel {
    align-items: flex-end;
    padding-bottom: calc(64px + var(--space-md));
  }

  .course-scrolly__scrim {
    background: linear-gradient(
      to top,
      rgba(11, 13, 14, 0.96) 0%,
      rgba(11, 13, 14, 0.82) 45%,
      rgba(11, 13, 14, 0.2) 70%,
      transparent 85%
    );
  }

  .course-scrolly__inner {
    width: 100%;
    max-width: 36rem;
    gap: 1rem;
  }

  .course-scrolly__meta {
    margin-bottom: 0;
  }

  .course-scrolly__desc {
    font-size: 0.875rem;
    line-height: 1.85;
  }

  .course-scrolly__progress {
    height: 64px;
  }

  .course-scrolly__progress-label {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .course-scrolly__inner {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
