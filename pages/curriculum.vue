<template>
  <div class="curriculum-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Curriculum</p>
        <h1 class="page-hero__title">カリキュラム</h1>
        <p class="page-hero__subtitle">
          4年間の学びのステップ。<br />
          専門基礎・専門基幹・専門展開の3つの科目群が、年次とともに織りなす学びの地図。
        </p>
      </div>
    </section>

    <!-- Overview -->
    <section class="curriculum-overview section-padding bg-surface">
      <div class="container">
        <div class="curriculum-overview__grid">
          <div class="curriculum-overview__text">
            <p class="section-label">Overview</p>
            <h2
              class="curriculum-overview__title text-display-md"
              style="margin-top: var(--space-md)"
            >
              4年間の学びのステップ
            </h2>
            <p class="curriculum-overview__body">
              1年次は学びの土台と体験的演習、2年次はメディア工学・知識工学・情報デザインの3領域の基礎、3年次は発展科目で専門の方向性を見定めて研究室配属へつなげ、4年次はそれらを卒業研究へ統合します。科目名はカリキュラムマップに基づき、年次ごとの科目群ごとに示しています。
            </p>
          </div>
          <div class="curriculum-overview__legend">
            <p class="curriculum-overview__legend-title text-label">凡例</p>
            <div class="curriculum-legend__items">
              <div class="curriculum-legend__item">
                <span
                  class="curriculum-legend__mark curriculum-legend__mark--req"
                  aria-hidden="true"
                  >■</span
                >
                必修科目
              </div>
              <div class="curriculum-legend__item">
                <span
                  class="curriculum-legend__mark curriculum-legend__mark--el"
                  aria-hidden="true"
                />
                選択科目（■なし）
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline -->
    <section class="curriculum-timeline section-padding bg-surface-low">
      <div class="container">
        <div class="timeline">
          <div
            v-for="(year, yearIndex) in curriculumData"
            :key="year.year"
            class="timeline__year"
          >
            <div class="timeline__year-marker">
              <div class="timeline__year-num">
                <span class="timeline__year-label">{{ year.label }}</span>
                <span class="timeline__year-en">Year {{ year.year }}</span>
              </div>
              <div class="timeline__year-theme">
                <span class="timeline__year-theme-text">{{ year.theme }}</span>
              </div>
            </div>

            <div class="timeline__body">
              <div class="timeline__tracks">
                <div
                  v-for="track in year.tracks"
                  :key="track.id"
                  class="timeline__track"
                >
                  <h3 class="timeline__track-title">{{ track.title }}</h3>
                  <template v-if="track.courses.length === 0">
                    <p class="timeline__track-empty">該当科目なし</p>
                  </template>
                  <ul v-else class="timeline__course-list">
                    <li
                      v-for="(course, ci) in track.courses"
                      :key="`${track.id}-${ci}-${course.name}`"
                      class="timeline__course"
                      :class="{ 'timeline__course--required': course.required }"
                    >
                      <span class="timeline__course-marker" aria-hidden="true">
                        {{ course.required ? "■" : "" }}
                      </span>
                      <span class="timeline__course-name">{{
                        course.name
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
              <p v-if="year.footnote" class="timeline__footnote">
                {{ year.footnote }}
              </p>
            </div>

            <div
              v-if="yearIndex < curriculumData.length - 1"
              class="timeline__connector"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Feature callout -->
    <section class="curriculum-features section-padding bg-surface">
      <div class="container">
        <p class="section-label">Highlights</p>
        <h2
          class="text-display-md"
          style="margin-top: var(--space-md); margin-bottom: var(--space-xl)"
        >
          学びの特色
        </h2>
        <div class="curriculum-features__grid">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="curriculum-feature"
          >
            <span class="curriculum-feature__icon" aria-hidden="true">{{
              feature.icon
            }}</span>
            <h3 class="curriculum-feature__title">{{ feature.title }}</h3>
            <p class="curriculum-feature__desc">{{ feature.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<script setup lang="ts">
import {
  curriculumData,
  curriculumResearchHighlights,
} from "~/data/curriculum";

useSeoMeta({
  title: "カリキュラム | 知能メディア工学科 | 千葉工業大学",
  description:
    "4年間の学びのステップ。専門基礎・専門基幹・専門展開科目を、年次ごとにご紹介します。",
});

const features = [
  {
    icon: "◼",
    title: "知能メディアプロジェクト",
    desc: "2年次の「知能メディアプロジェクト1・2」で、3領域にまたがる課題にチームで取り組み、設計から実装までの一連の経験を積みます。",
  },
  {
    icon: "◼",
    title: "3領域からなる専門教育",
    desc: "メディア工学・知識工学・情報デザインの基礎から発展までを段階的に学び、高年次で興味に応じた科目を選択できます。",
  },
  {
    icon: "◼",
    title: "実験・演習とゼミナール",
    desc: "メディア工学実験やネットワーク・データ工学実験などの実践科目に加え、ゼミナールで研究室の研究に触れます。",
  },
  {
    icon: "◼",
    title: "卒業研究への統合",
    desc: "4年次はゼミナールと卒業研究で、これまでの知識・技術を一つの課題解決へまとめ上げます。",
  },
];
</script>

<style scoped>
/* Overview */
.curriculum-overview__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

@media (min-width: 1024px) {
  .curriculum-overview__grid {
    grid-template-columns: 2fr 1fr;
    align-items: start;
  }
}

.curriculum-overview__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.curriculum-overview__body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
  max-width: 60ch;
}

.curriculum-overview__legend {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.curriculum-overview__legend-title {
  color: var(--color-on-surface-muted);
  margin-bottom: 0.5rem;
}

.curriculum-legend__items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.curriculum-legend__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
}

.curriculum-legend__mark {
  flex-shrink: 0;
  width: 1.25rem;
  display: inline-flex;
  justify-content: center;
  font-size: var(--text-xs);
}

.curriculum-legend__mark--req {
  color: var(--color-department);
  font-size: var(--text-sm);
  line-height: 1;
}

.curriculum-legend__mark--el {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 1px solid var(--color-on-surface-faint);
  background: transparent;
}

/* Timeline */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.timeline__year {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  padding-bottom: var(--space-xl);
  position: relative;
}

@media (min-width: 768px) {
  .timeline__year {
    grid-template-columns: minmax(11rem, 13rem) 1fr;
    gap: var(--space-lg);
  }
}

.timeline__year-marker {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.timeline__year-num {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.timeline__year-label {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-on-surface);
  letter-spacing: -0.02em;
}

.timeline__year-en {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--color-on-surface-faint);
  text-transform: uppercase;
}

.timeline__year-theme-text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 500;
  color: var(--color-on-surface-muted);
  letter-spacing: -0.01em;
  line-height: 1.5;
}

.timeline__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-width: 0;
}

.timeline__tracks {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 960px) {
  .timeline__tracks {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--space-sm);
  }
}

.timeline__track {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-md);
  background-color: var(--color-surface);
  border: 1px solid
    color-mix(in srgb, var(--color-on-surface-faint) 25%, transparent);
  min-height: 4rem;
}

.timeline__track-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-on-surface);
  margin: 0;
  padding-bottom: 0.35rem;
  border-bottom: 1px solid
    color-mix(in srgb, var(--color-on-surface-faint) 35%, transparent);
}

.timeline__track-empty {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-faint);
  font-style: italic;
}

.timeline__course-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.timeline__course {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: 1.45;
  color: var(--color-on-surface);
}

@media (min-width: 1100px) {
  .timeline__course {
    font-size: var(--text-sm);
  }
}

.timeline__course-marker {
  flex-shrink: 0;
  width: 0.85rem;
  text-align: center;
  font-size: 0.55rem;
  line-height: 1.6;
  color: transparent;
}

.timeline__course--required .timeline__course-marker {
  color: var(--color-department);
  font-size: var(--text-xs);
}

.timeline__course-name {
  flex: 1;
  min-width: 0;
}

.timeline__footnote {
  margin: 0;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-muted);
}

.timeline__research-callout {
  margin-top: var(--space-sm);
  padding: var(--space-md);
  background: var(--color-department-bg);
  border-left: 3px solid var(--color-department);
}

.timeline__research-title {
  margin: 0 0 var(--space-sm);
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-on-surface);
}

.timeline__research-list {
  margin: 0;
  padding-left: 1.1rem;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: 1.65;
  color: var(--color-on-surface-muted);
}

@media (min-width: 1100px) {
  .timeline__research-list {
    font-size: var(--text-sm);
  }
}

.timeline__connector {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1px;
  height: var(--space-xl);
  background: linear-gradient(
    to bottom,
    var(--color-on-surface-faint),
    transparent
  );
  opacity: 0.3;
}

/* Features */
.curriculum-features__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 640px) {
  .curriculum-features__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.curriculum-feature {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background-color: var(--color-surface-low);
}

.curriculum-feature__icon {
  font-size: var(--text-xs);
  color: var(--color-on-surface-faint);
}

.curriculum-feature__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-on-surface);
  letter-spacing: -0.01em;
}

.curriculum-feature__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  line-height: 1.7;
}
</style>
