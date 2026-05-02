<template>
  <div class="curriculum-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Curriculum</p>
        <h1 class="page-hero__title">カリキュラム</h1>
        <p class="page-hero__subtitle">
          4年間で、基礎から応用、そして創造へ。<br />
          理論と実践を螺旋状に繰り返しながら深化する学びの軌跡。
        </p>
      </div>
    </section>

    <!-- Overview -->
    <section class="curriculum-overview section-padding bg-surface">
      <div class="container">
        <div class="curriculum-overview__grid">
          <div class="curriculum-overview__text">
            <p class="section-label">Overview</p>
            <h2 class="curriculum-overview__title text-display-md" style="margin-top: var(--space-md)">
              理論と実践の<br />螺旋構造
            </h2>
            <p class="curriculum-overview__body">
              知能メディア工学科のカリキュラムは、4年間で「広く知る→深く探索する→専門を統合する→社会へ問う」という4段階の深化を設計しています。各年次で理論と実践が交互に出現し、学んだ知識がすぐに手を動かす場所で試されます。
            </p>
          </div>
          <!-- Subject type legend -->
          <div class="curriculum-overview__legend">
            <p class="curriculum-overview__legend-title text-label">科目種別</p>
            <div class="curriculum-legend__items">
              <div v-for="type in subjectTypes" :key="type.id" class="curriculum-legend__item">
                <span class="curriculum-legend__dot" :style="{ backgroundColor: type.color }" />
                {{ type.label }}
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
            <!-- Year marker -->
            <div class="timeline__year-marker">
              <div class="timeline__year-num">
                <span class="timeline__year-label">{{ year.label }}</span>
                <span class="timeline__year-en">Year {{ year.year }}</span>
              </div>
              <div class="timeline__year-theme">
                <span class="timeline__year-theme-text">{{ year.theme }}</span>
              </div>
            </div>

            <!-- Subjects -->
            <div class="timeline__subjects">
              <div
                v-for="subject in year.subjects"
                :key="subject.name"
                class="timeline__subject"
                :class="`timeline__subject--${subject.type}`"
              >
                <span
                  class="timeline__subject-dot"
                  :style="{ backgroundColor: typeColor(subject.type) }"
                />
                <span class="timeline__subject-name">{{ subject.name }}</span>
              </div>
            </div>

            <!-- Connector line (not on last year) -->
            <div v-if="yearIndex < curriculumData.length - 1" class="timeline__connector" />
          </div>
        </div>
      </div>
    </section>

    <!-- Feature callout -->
    <section class="curriculum-features section-padding bg-surface">
      <div class="container">
        <p class="section-label">Highlights</p>
        <h2 class="text-display-md" style="margin-top: var(--space-md); margin-bottom: var(--space-xl)">
          学びの特色
        </h2>
        <div class="curriculum-features__grid">
          <div v-for="feature in features" :key="feature.title" class="curriculum-feature">
            <span class="curriculum-feature__icon" aria-hidden="true">{{ feature.icon }}</span>
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
import { curriculumData } from '~/data/curriculum'

useSeoMeta({
  title: 'カリキュラム | 知能メディア工学科 | 千葉工業大学',
  description:
    '4年間の学びの軌跡。理論と実践を統合した知能メディア工学科のカリキュラムをご紹介します。',
})

const subjectTypes = [
  { id: 'lecture', label: '講義', color: '#9a9594' },
  { id: 'workshop', label: '演習・実習', color: '#6a4dff' },
  { id: 'project', label: 'プロジェクト', color: '#ff7a59' },
  { id: 'seminar', label: 'セミナー', color: '#3b82f6' },
]

const typeColor = (type: string): string => {
  const colors: Record<string, string> = {
    lecture: '#9a9594',
    workshop: '#6a4dff',
    project: '#ff7a59',
    seminar: '#3b82f6',
  }
  return colors[type] ?? '#9a9594'
}

const features = [
  {
    icon: '◼',
    title: 'プロジェクト型学習',
    desc: '毎学期、実際の問題を設定してチームで解決するPBL（Project-Based Learning）を実施。理論の実践的な定着を促します。',
  },
  {
    icon: '◼',
    title: '産学連携プログラム',
    desc: '3・4年次には企業や自治体と連携した実課題プロジェクトに参加できます。在学中から社会との接続を体験します。',
  },
  {
    icon: '◼',
    title: '縦断型ゼミ制度',
    desc: '2年次から研究室の見学・体験が可能。3年次の研究室配属に向けて段階的に専門性を深められます。',
  },
  {
    icon: '◼',
    title: '学際的な演習設計',
    desc: '同一演習にメディア・知識・デザインの3コースの学生が混在。異なる専門知識を持つ学生との協働で視野が広がります。',
  },
]
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

.curriculum-legend__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
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
    grid-template-columns: 240px 1fr;
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
}

.timeline__subjects {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.timeline__subject {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem var(--space-sm);
  background-color: var(--color-surface);
}

.timeline__subject-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.timeline__subject-name {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-on-surface);
}

.timeline__connector {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 1px;
  height: var(--space-xl);
  background: linear-gradient(to bottom, var(--color-on-surface-faint), transparent);
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
