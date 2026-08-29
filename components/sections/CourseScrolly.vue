<template>
  <section class="course-scrolly" aria-label="コース紹介">
    <article
      v-for="(course, i) in COURSES"
      :key="course.key"
      :ref="(el) => setPanel(el, i)"
      class="course-scrolly__panel"
      :class="[`is-${course.key}`, { 'is-active': activeIndex === i }]"
    >
      <div class="course-scrolly__scrim" aria-hidden="true" />
      <div class="course-scrolly__inner">
        <p class="course-scrolly__index">
          {{ String(i + 1).padStart(2, "0") }} <span aria-hidden="true">/ 03</span>
        </p>
        <p class="course-scrolly__label text-label">{{ course.en }}</p>
        <h2 class="course-scrolly__name">{{ course.name }}</h2>
        <p class="course-scrolly__tagline">
          <template v-for="(line, li) in course.tagline" :key="li"
            >{{ line
            }}<br v-if="li < course.tagline.length - 1" ></template>
        </p>
        <p class="course-scrolly__desc">{{ course.desc }}</p>
        <ul class="course-scrolly__keywords">
          <li v-for="kw in course.keywords" :key="kw">{{ kw }}</li>
        </ul>
        <NuxtLink :to="course.to" class="link-arrow course-scrolly__link">
          詳しく見る
        </NuxtLink>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

type DomainKey = "media" | "knowledge" | "design";

interface Course {
  key: DomainKey;
  en: string;
  name: string;
  tagline: string[];
  desc: string;
  keywords: string[];
  to: string;
}

const COURSES: Course[] = [
  {
    key: "media",
    en: "Media Engineering",
    name: "メディア工学",
    tagline: ["音・映像・インタラクションの", "最前線"],
    desc: "人間の知覚と感情に直接作用するメディアの技術を探究します。音響処理からXR体験まで、感動を設計する力を身につける。",
    keywords: ["音響信号処理", "映像メディア", "XR・仮想現実", "センサーシステム"],
    to: "/about#media",
  },
  {
    key: "knowledge",
    en: "Knowledge Engineering",
    name: "知識工学",
    tagline: ["AIと知識で世界を", "解析する"],
    desc: "機械学習・深層学習・自然言語処理を駆使し、データの海から知識を抽出する力を培います。AIが社会を変える現場の最前線へ。",
    keywords: ["機械学習・深層学習", "自然言語処理", "知識グラフ", "推薦システム"],
    to: "/about#knowledge",
  },
  {
    key: "design",
    en: "Information Design",
    name: "情報デザイン",
    tagline: ["伝わる形を", "設計する"],
    desc: "情報をどう見せ、どう伝えるか。UXデザイン・データ可視化・コミュニケーション設計を通じ、人と情報の橋渡しをする力を磨く。",
    keywords: [
      "UX/UIデザイン",
      "データ可視化",
      "タイポグラフィ",
      "コミュニケーション設計",
    ],
    to: "/about#design",
  },
];

// HeroFoamBg と共有。中央バンドに入ったパネルの領域をハイライトさせる
const focusDomain = useState<DomainKey | null>("heroFocusDomain", () => null);
const activeIndex = ref(-1);

const panelEls: (HTMLElement | null)[] = [];
function setPanel(el: unknown, i: number) {
  panelEls[i] = el as HTMLElement | null;
}

const ratios = [0, 0, 0];
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
  focusDomain.value = bi >= 0 ? COURSES[bi].key : null;
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
}

.course-scrolly__panel {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: var(--space-xl) var(--space-md);
  color: #fcf9f8;
}

.course-scrolly__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* 右側を暗くしてテキストを読ませ、左側はダイアグラムを見せる */
  background: linear-gradient(
    260deg,
    rgba(20, 19, 19, 0.9) 0%,
    rgba(20, 19, 19, 0.68) 30%,
    rgba(20, 19, 19, 0.2) 56%,
    transparent 80%
  );
}

.course-scrolly__inner {
  position: relative;
  width: 100%;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  opacity: 0.4;
  transform: translateY(1.5rem);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

@media (min-width: 768px) {
  .course-scrolly__panel {
    padding-right: clamp(var(--space-md), 6vw, var(--space-lg));
  }

  .course-scrolly__inner {
    width: 50%;
    max-width: 34rem;
  }
}

.course-scrolly__panel.is-active .course-scrolly__inner {
  opacity: 1;
  transform: translateY(0);
}

.course-scrolly__index {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  color: rgba(252, 249, 248, 0.5);
}

.course-scrolly__label {
  letter-spacing: 0.14em;
  color: rgba(252, 249, 248, 0.7);
}

.course-scrolly__name {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5.5vw, 3.25rem);
  font-weight: 700;
  line-height: 1.08;
  letter-spacing: -0.03em;
}

.course-scrolly__tagline {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 500;
  line-height: 1.4;
  letter-spacing: -0.01em;
}

.course-scrolly__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.9;
  color: rgba(252, 249, 248, 0.8);
}

.course-scrolly__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  margin-top: var(--space-xs);
}

.course-scrolly__keywords li {
  position: relative;
  padding-left: 0.95rem;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.04em;
  color: rgba(252, 249, 248, 0.74);
}

.course-scrolly__keywords li::before {
  content: "—";
  position: absolute;
  left: 0;
  color: rgba(252, 249, 248, 0.5);
}

.course-scrolly__link {
  margin-top: var(--space-xs);
  color: #fcf9f8;
}

.course-scrolly__link:hover {
  color: rgba(252, 249, 248, 0.75);
}

/* 領域アクセント */
.is-media .course-scrolly__label,
.is-media .course-scrolly__index {
  color: var(--color-media-on-dark);
}
.is-knowledge .course-scrolly__label,
.is-knowledge .course-scrolly__index {
  color: var(--color-knowledge-on-dark);
}
.is-design .course-scrolly__label,
.is-design .course-scrolly__index {
  color: var(--color-design-on-dark);
}

.is-media .course-scrolly__keywords li::before {
  color: var(--color-media-on-dark);
}
.is-knowledge .course-scrolly__keywords li::before {
  color: var(--color-knowledge-on-dark);
}
.is-design .course-scrolly__keywords li::before {
  color: var(--color-design-on-dark);
}

@media (prefers-reduced-motion: reduce) {
  .course-scrolly__inner {
    opacity: 1;
    transform: none;
    transition: none;
  }
}
</style>
