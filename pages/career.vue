<template>
  <div class="career-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Career</p>
        <h1 class="page-hero__title">キャリア・就職</h1>
        <p class="page-hero__subtitle">
          知能メディア工学科の学びは、<br />
          多様なキャリアへの道を開く。
        </p>
      </div>
    </section>

    <!-- Stats -->
    <section class="career-stats section-padding bg-surface">
      <div class="container">
        <p class="section-label">Numbers</p>
        <div class="career-stats__grid" style="margin-top: var(--space-xl)">
          <div v-for="stat in keyStats" :key="stat.label" class="career-stat">
            <span class="career-stat__value">{{ stat.value }}</span>
            <span class="career-stat__label">{{ stat.label }}</span>
          </div>
        </div>
        <p class="career-stats__note text-body-sm text-muted" style="margin-top: var(--space-lg)">
          ※ 数値は過去3年間の平均値です（ダミーデータ）
        </p>
      </div>
    </section>

    <!-- Industry breakdown -->
    <section class="career-industry section-padding bg-surface-low">
      <div class="container">
        <div class="career-industry__inner">
          <div class="career-industry__text">
            <p class="section-label">Industries</p>
            <h2 class="text-display-md" style="margin-top: var(--space-md); margin-bottom: var(--space-md)">
              就職先の<br />業界分布
            </h2>
            <p class="career-industry__body">
              卒業生の約40%がIT・通信業界へ、約22%がメディア・クリエイティブ業界へ進みます。多様な業界で知能メディア工学科の学びが活かされています。
            </p>
          </div>
          <div class="career-industry__bars">
            <div
              v-for="stat in industryStats"
              :key="stat.label"
              class="career-bar"
            >
              <div class="career-bar__header">
                <span class="career-bar__label">{{ stat.label }}</span>
                <span class="career-bar__pct">{{ stat.percentage }}%</span>
              </div>
              <div class="career-bar__track">
                <div
                  class="career-bar__fill"
                  :style="{ width: `${stat.percentage}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Career paths -->
    <section class="career-paths section-padding bg-surface">
      <div class="container">
        <p class="section-label">Career Paths</p>
        <h2 class="text-display-md" style="margin-top: var(--space-md); margin-bottom: var(--space-xl)">
          卒業後のキャリアパス
        </h2>

        <div class="career-paths__grid">
          <div
            v-for="category in careerData"
            :key="category.category"
            class="career-path"
          >
            <h3 class="career-path__category">{{ category.category }}</h3>
            <ul class="career-path__items">
              <li
                v-for="item in category.items"
                :key="item"
                class="career-path__item"
              >
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Graduate school -->
    <section class="career-grad section-padding bg-surface-low">
      <div class="container">
        <div class="career-grad__inner">
          <div class="career-grad__text">
            <p class="section-label">Graduate School</p>
            <h2 class="text-display-md" style="margin-top: var(--space-md)">
              大学院という選択肢
            </h2>
            <p class="career-grad__body">
              約18%の学生が大学院に進学します。本学の情報科学研究科への進学はもちろん、東京大学・東京工業大学・早稲田大学などへの外部進学実績も多数あります。研究者・高度専門職への道を目指す学生を全面的にサポートします。
            </p>
            <div class="career-grad__schools">
              <p class="text-label" style="color: var(--color-on-surface-muted); margin-bottom: var(--space-sm)">
                主な進学先（過去3年）
              </p>
              <ul class="career-grad__school-list">
                <li v-for="school in gradSchools" :key="school">{{ school }}</li>
              </ul>
            </div>
          </div>
          <div class="career-grad__stat">
            <span class="career-grad__stat-value">18%</span>
            <span class="career-grad__stat-label">大学院進学率</span>
          </div>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<script setup lang="ts">
import { careerData, industryStats, keyStats } from '~/data/career'

useSeoMeta({
  title: 'キャリア・就職 | 知能メディア工学科 | 千葉工業大学',
  description: '知能メディア工学科卒業生のキャリアパス・就職先・大学院進学実績をご紹介します。',
})

const gradSchools = [
  '千葉工業大学大学院 情報科学研究科',
  '東京大学大学院 情報理工学系研究科',
  '東京工業大学大学院 情報理工学院',
  '早稲田大学大学院 基幹理工学研究科',
  '筑波大学大学院 システム情報工学研究科',
  '国立情報学研究所（NII）',
]
</script>

<style scoped>
/* Stats */
.career-stats__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .career-stats__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.career-stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--space-lg);
  background-color: var(--color-surface-low);
}

.career-stat__value {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 700;
  color: var(--color-on-surface);
  letter-spacing: -0.03em;
  line-height: 1;
}

.career-stat__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-on-surface-muted);
  letter-spacing: 0.03em;
}

/* Industry */
.career-industry__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

@media (min-width: 1024px) {
  .career-industry__inner {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.career-industry__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.career-industry__body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-on-surface-muted);
  line-height: 1.8;
}

.career-industry__bars {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.career-bar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.career-bar__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.career-bar__label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-on-surface);
}

.career-bar__pct {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-on-surface);
  letter-spacing: -0.01em;
}

.career-bar__track {
  height: 4px;
  background-color: var(--color-surface);
  overflow: hidden;
}

.career-bar__fill {
  height: 100%;
  background-color: var(--color-on-surface);
  transition: width 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Career paths */
.career-paths__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

.career-path {
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-surface-low);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

.career-path:last-child {
  border-bottom: 1px solid var(--color-surface-low);
}

@media (min-width: 768px) {
  .career-path {
    grid-template-columns: 260px 1fr;
    align-items: start;
  }
}

.career-path__category {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--color-on-surface);
  letter-spacing: -0.01em;
}

.career-path__items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.career-path__item {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  background-color: var(--color-surface-low);
  padding: 0.375rem 0.75rem;
}

/* Graduate */
.career-grad__inner {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

@media (min-width: 1024px) {
  .career-grad__inner {
    grid-template-columns: 1fr auto;
    align-items: start;
  }
}

.career-grad__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.career-grad__body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-on-surface-muted);
  line-height: 1.8;
  max-width: 60ch;
}

.career-grad__schools {
  padding-top: var(--space-md);
}

.career-grad__school-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.career-grad__school-list li {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  padding-left: 1rem;
  position: relative;
}

.career-grad__school-list li::before {
  content: '—';
  position: absolute;
  left: 0;
  color: var(--color-on-surface-faint);
  opacity: 0.5;
}

.career-grad__stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--space-lg);
  background-color: var(--color-surface);
  min-width: 160px;
  text-align: left;
}

.career-grad__stat-value {
  font-family: var(--font-display);
  font-size: var(--text-6xl);
  font-weight: 700;
  color: var(--color-on-surface);
  letter-spacing: -0.04em;
  line-height: 1;
}

.career-grad__stat-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: var(--color-on-surface-muted);
}
</style>
