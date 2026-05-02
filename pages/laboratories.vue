<template>
  <div class="labs-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Laboratories</p>
        <h1 class="page-hero__title">研究室</h1>
        <p class="page-hero__subtitle">
          8つの研究室が、それぞれの最前線を開拓する。<br />
          あなたの興味はどこにある？
        </p>
      </div>
    </section>

    <!-- Filter -->
    <section class="labs-filter bg-surface section-padding-sm">
      <div class="container">
        <div class="labs-filter__inner">
          <p class="text-label" style="color: var(--color-on-surface-muted)">絞り込み</p>
          <div class="labs-filter__buttons" role="group" aria-label="専門領域で絞り込み">
            <button
              class="labs-filter__btn"
              :class="{ active: activeFilter === null }"
              @click="activeFilter = null"
            >
              すべて
            </button>
            <button
              class="labs-filter__btn labs-filter__btn--media"
              :class="{ active: activeFilter === 'media' }"
              @click="activeFilter = 'media'"
            >
              メディア工学
            </button>
            <button
              class="labs-filter__btn labs-filter__btn--knowledge"
              :class="{ active: activeFilter === 'knowledge' }"
              @click="activeFilter = 'knowledge'"
            >
              知識工学
            </button>
            <button
              class="labs-filter__btn labs-filter__btn--design"
              :class="{ active: activeFilter === 'design' }"
              @click="activeFilter = 'design'"
            >
              情報デザイン
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Laboratory list -->
    <section class="labs-list section-padding bg-surface-low">
      <div class="container">
        <div class="labs-list__header">
          <p class="labs-list__count text-label" style="color: var(--color-on-surface-muted)">
            {{ filteredLabs.length }} 研究室
          </p>
        </div>

        <TransitionGroup name="lab-list" tag="div" class="labs-list__items">
          <div
            v-for="lab in filteredLabs"
            :key="lab.id"
            :id="lab.id"
            class="lab-item"
          >
            <div class="lab-item__header">
              <span class="tag" :class="pillarTagClass(lab.pillar)">
                {{ pillarLabel(lab.pillar) }}
              </span>
              <span class="lab-item__professor">{{ lab.professor }}</span>
            </div>

            <h2 class="lab-item__name">{{ lab.name }}</h2>

            <p class="lab-item__theme">{{ lab.theme }}</p>

            <div class="lab-item__keywords">
              <ul class="lab-item__keywords-list">
                <li
                  v-for="kw in lab.keywords"
                  :key="kw"
                  class="tag tag-neutral"
                >
                  {{ kw }}
                </li>
              </ul>
            </div>
          </div>
        </TransitionGroup>

        <!-- Empty state -->
        <div v-if="filteredLabs.length === 0" class="labs-empty">
          <p class="labs-empty__text">該当する研究室がありません。</p>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<script setup lang="ts">
import type { Laboratory } from '~/types'
import { laboratories } from '~/data/laboratories'

useSeoMeta({
  title: '研究室 | 知能メディア工学科 | 千葉工業大学',
  description: '知能メディア工学科の8つの研究室を紹介します。メディア工学・知識工学・情報デザインの最先端研究。',
})

const activeFilter = ref<'media' | 'knowledge' | 'design' | null>(null)

const filteredLabs = computed<Laboratory[]>(() => {
  if (activeFilter.value === null) return laboratories
  return laboratories.filter((lab) => lab.pillar === activeFilter.value)
})

const pillarTagClass = (pillar: Laboratory['pillar']): string => {
  return {
    media: 'tag-media',
    knowledge: 'tag-knowledge',
    design: 'tag-design',
  }[pillar]
}

const pillarLabel = (pillar: Laboratory['pillar']): string => {
  return {
    media: 'メディア工学',
    knowledge: '知識工学',
    design: '情報デザイン',
  }[pillar]
}
</script>

<style scoped>
.section-padding-sm {
  padding-top: var(--space-lg);
  padding-bottom: var(--space-lg);
}

/* Filter */
.labs-filter__inner {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.labs-filter__buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.labs-filter__btn {
  padding: 0.5rem 1rem;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-on-surface-muted);
  background-color: var(--color-surface-low);
  border: none;
  cursor: pointer;
  transition: background-color 200ms ease, color 200ms ease;
  border-radius: 0;
}

.labs-filter__btn:hover {
  background-color: var(--color-surface);
  color: var(--color-on-surface);
}

.labs-filter__btn.active {
  background-color: var(--color-on-surface);
  color: #fcf9f8;
}

.labs-filter__btn--media.active {
  background-color: var(--color-media);
  color: #fff;
}

.labs-filter__btn--knowledge.active {
  background-color: var(--color-knowledge);
  color: #fff;
}

.labs-filter__btn--design.active {
  background-color: var(--color-design);
  color: #fff;
}

/* List */
.labs-list__header {
  margin-bottom: var(--space-lg);
}

.labs-list__items {
  display: flex;
  flex-direction: column;
}

.lab-item {
  scroll-margin-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-xl) 0;
  border-top: 1px solid var(--color-surface);
}

.lab-item:last-child {
  border-bottom: 1px solid var(--color-surface);
}

.lab-item__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
}

.lab-item__professor {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-faint);
  margin-left: auto;
}

.lab-item__name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, var(--text-3xl));
  font-weight: 600;
  color: var(--color-on-surface);
  letter-spacing: -0.02em;
}

.lab-item__theme {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
  max-width: 70ch;
}

.lab-item__keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

/* Empty state */
.labs-empty {
  padding: var(--space-xl) 0;
}

.labs-empty__text {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-on-surface-muted);
}

/* Transition */
.lab-list-enter-active,
.lab-list-leave-active {
  transition: opacity 250ms ease, transform 250ms ease;
}

.lab-list-enter-from,
.lab-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
