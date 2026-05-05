<template>
  <div class="labs-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Laboratories</p>
        <h1 class="page-hero__title">研究室</h1>
        <p class="page-hero__subtitle">
          11の研究室が、それぞれの最前線を開拓する。
        </p>
      </div>
    </section>

    <!-- Filter -->
    <section class="labs-filter bg-surface section-padding-sm">
      <div class="container">
        <div class="labs-filter__inner">
          <p class="text-label" style="color: var(--color-on-surface-muted)">
            絞り込み
          </p>
          <div
            class="labs-filter__buttons"
            role="group"
            aria-label="専門領域で絞り込み"
          >
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
          <p
            class="labs-list__count text-label"
            style="color: var(--color-on-surface-muted)"
          >
            {{ filteredLabs.length }} 研究室
          </p>
        </div>

        <TransitionGroup name="lab-list" tag="div" class="labs-list__items">
          <div
            v-for="lab in filteredLabs"
            :id="lab.id"
            :key="lab.id"
            class="lab-item"
          >
            <div class="lab-item__media">
              <img
                v-if="lab.imageSrc"
                :src="lab.imageSrc"
                class="lab-item__img"
                :alt="`${lab.name}の写真`"
                loading="lazy"
                decoding="async"
              />
              <div
                v-else
                class="img-placeholder lab-item__media-placeholder"
                :class="`img-placeholder--${lab.pillar}`"
                aria-hidden="true"
              >
                <span class="img-placeholder__label">Laboratory</span>
              </div>
            </div>

            <div class="lab-item__body">
              <div class="lab-item__header">
                <span class="lab-item__professor">{{ lab.professor }}</span>
                <span class="tag" :class="pillarTagClass(lab.pillar)">
                  {{ pillarLabel(lab.pillar) }}
                </span>
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
                    #{{ kw }}
                  </li>
                </ul>
              </div>

              <p class="lab-item__site">
                <a
                  :href="lab.seminarUrl"
                  class="btn btn-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  研究室ウェブサイト
                </a>
              </p>
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
import type { Laboratory } from "~/types";
import { laboratories } from "~/data/laboratories";

useSeoMeta({
  title: "研究室 | 知能メディア工学科 | 千葉工業大学",
  description:
    "知能メディア工学科の11の研究室を紹介します。メディア工学・知識工学・情報デザインの最先端研究。",
});

const activeFilter = ref<"media" | "knowledge" | "design" | null>(null);

const filteredLabs = computed<Laboratory[]>(() => {
  if (activeFilter.value === null) return laboratories;
  return laboratories.filter((lab) => lab.pillar === activeFilter.value);
});

const pillarTagClass = (pillar: Laboratory["pillar"]): string => {
  return {
    media: "tag-media",
    knowledge: "tag-knowledge",
    design: "tag-design",
  }[pillar];
};

const pillarLabel = (pillar: Laboratory["pillar"]): string => {
  return {
    media: "メディア工学領域",
    knowledge: "知識工学領域",
    design: "情報デザイン領域",
  }[pillar];
};
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
  transition:
    background-color 200ms ease,
    color 200ms ease;
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
  align-items: stretch;
  gap: var(--space-md);
  padding: var(--space-xl) 0;
  border-top: 1px solid var(--color-surface);
}

@media (min-width: 768px) {
  .lab-item {
    flex-direction: row;
    align-items: flex-start;
    gap: var(--space-md);
  }
}

.lab-item__media {
  flex-shrink: 0;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  background-color: var(--color-surface);
}

@media (min-width: 768px) {
  .lab-item__media {
    width: clamp(160px, 22vw, 220px);
    max-width: 220px;
  }
}

.lab-item__img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 4 / 5;
  object-fit: cover;
}

/* main.css の 16:9 を上書きし、左カラム用の縦長比率に */
.lab-item__media-placeholder.img-placeholder {
  aspect-ratio: 4 / 5;
  min-height: 140px;
}

@media (min-width: 768px) {
  .lab-item__media-placeholder.img-placeholder {
    min-height: 0;
  }
}

.lab-item__body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.lab-item:last-child {
  border-bottom: 1px solid var(--color-surface);
}

.lab-item__header {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.lab-item__header .tag {
  margin-left: auto;
}

.lab-item__professor {
  font-family: var(--font-body);
  font-size: var(--text-xl);
  font-weight: 600;
  letter-spacing: 0.02em;
  color: var(--color-on-surface);
  line-height: 1.35;
  margin-bottom: var(--space-sm);
}

.lab-item__name {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-on-surface);
  letter-spacing: -0.02em;
}

.lab-item__theme {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
  max-width: 70ch;
}

.lab-item__keywords {
  margin-top: var(--space-xs);
}

.lab-item__keywords-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.lab-item__site {
  margin: 0;
  margin-top: var(--space-md);
}

.lab-item__site .btn {
  background-color: transparent;
  color: var(--color-on-surface);
  border: 1.5px solid var(--color-on-surface);
  transition: background-color 200ms ease, color 200ms ease;
}

.lab-item__site .btn:hover {
  background-color: var(--color-on-surface);
  color: var(--color-surface);
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
  transition:
    opacity 250ms ease,
    transform 250ms ease;
}

.lab-list-enter-from,
.lab-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
