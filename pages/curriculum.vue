<template>
  <div class="curriculum-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Curriculum</p>
        <h1 class="page-hero__title">カリキュラム</h1>
        <p class="page-hero__subtitle">
          4年間の学びのステップ。専門基礎・専門基幹・専門展開の3つの科目群が、年次とともに織りなす学びの地図。
        </p>
      </div>
    </section>

    <!-- Overview -->
    <section class="curriculum-overview section-padding bg-surface">
      <div class="container">
        <div class="curriculum-overview__grid">
          <div class="curriculum-overview__text">
            <p class="section-label">Overview</p>
            <h2 class="curriculum-overview__title text-display-md">
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
                  >○</span
                >
                選択科目
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
            v-for="year in curriculumData"
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
                        {{ course.required ? "■" : "○" }}
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
          </div>
        </div>
      </div>
    </section>

    <!-- Feature callout -->
    <section class="curriculum-features section-padding bg-surface">
      <div class="container">
        <p class="section-label">Highlights</p>
        <h2 class="curriculum-heading text-display-md">学びの特色</h2>
        <div class="curriculum-features__grid">
          <div
            v-for="(feature, i) in features"
            :key="feature.title"
            class="curriculum-feature"
          >
            <span class="curriculum-feature__num" aria-hidden="true">
              {{ String(i + 1).padStart(2, "0") }}
            </span>
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
const curriculumData = useContent().curriculum;

useSeoMeta({
  title: "カリキュラム | 知能メディア工学科 | 千葉工業大学",
  description:
    "4年間の学びのステップ。専門基礎・専門基幹・専門展開科目を、年次ごとにご紹介します。",
});

const features = [
  {
    title: "知能メディアプロジェクト",
    desc: "2年次の「知能メディアプロジェクト1・2」で、3領域にまたがる課題にチームで取り組み、設計から実装までの一連の経験を積みます。",
  },
  {
    title: "3領域からなる専門教育",
    desc: "メディア工学・知識工学・情報デザインの基礎から発展までを段階的に学び、高年次で興味に応じた科目を選択できます。",
  },
  {
    title: "実験・演習とゼミナール",
    desc: "メディア工学実験やネットワーク・データ工学実験などの実践科目に加え、ゼミナールで研究室の研究に触れます。",
  },
  {
    title: "卒業研究への統合",
    desc: "4年次はゼミナールと卒業研究で、これまでの知識・技術を一つの課題解決へまとめ上げます。",
  },
];
</script>

<style scoped>
.curriculum-page {
  --curriculum-hairline: color-mix(
    in srgb,
    var(--color-on-surface) 13%,
    transparent
  );
}

.curriculum-heading.text-display-md {
  margin-top: var(--space-sm);
  margin-bottom: var(--space-lg);
  color: var(--color-on-surface);
}

/* Overview */
.curriculum-overview__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
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
  align-items: center;
  justify-content: center;
  font-size: var(--text-sm);
  line-height: 1;
}

.curriculum-legend__mark--req {
  color: var(--color-department);
}

.curriculum-legend__mark--el {
  color: var(--color-on-surface-faint);
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
  padding-top: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-top: 2px solid var(--color-on-surface);
}

.timeline__year:first-child {
  padding-top: 0;
  border-top: none;
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
}

.timeline__track-title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: 0.04em;
  color: var(--color-on-surface);
  margin: 0;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--curriculum-hairline);
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
  width: 0.9rem;
  text-align: center;
  font-size: var(--text-xs);
  line-height: 1.6;
  color: var(--color-on-surface-faint);
}

.timeline__course--required .timeline__course-marker {
  color: var(--color-department);
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

/* Features */
.curriculum-features__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  border-top: 1px solid var(--curriculum-hairline);
}

@media (min-width: 700px) {
  .curriculum-features__grid {
    grid-template-columns: repeat(2, 1fr);
    column-gap: clamp(var(--space-lg), 6vw, 5rem);
  }
}

.curriculum-feature {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--space-md) 0;
  border-bottom: 1px solid var(--curriculum-hairline);
}

.curriculum-feature__num {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--color-primary);
}

.curriculum-feature__title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
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
