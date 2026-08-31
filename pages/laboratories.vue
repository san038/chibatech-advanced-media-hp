<template>
  <div class="labs-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Laboratories</p>
        <h1 class="page-hero__title">研究室</h1>
        <p class="page-hero__subtitle">
          9つの研究室が、それぞれの最前線を開拓する。
        </p>
      </div>
    </section>

    <!-- Filter -->
    <section class="labs-filter bg-surface-low section-padding-sm">
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
              すべて（{{ laboratories.length }}）
            </button>
            <button
              v-for="d in DOMAIN_INFO"
              :key="d.key"
              class="labs-filter__btn"
              :class="[`labs-filter__btn--${d.key}`, { active: activeFilter === d.key }]"
              @click="activeFilter = d.key"
            >
              {{ d.short }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Laboratory list -->
    <section class="labs-list section-padding bg-surface-low">
      <div class="container">
        <p
          class="labs-list__count text-label"
          style="color: var(--color-on-surface-muted)"
        >
          {{ filteredLabs.length }} 研究室
        </p>

        <TransitionGroup name="lab-list" tag="div" class="labs-list__items">
          <article
            v-for="lab in filteredLabs"
            :id="lab.id"
            :key="lab.id"
            class="lab"
            :class="`is-${lab.pillar}`"
          >
            <div
              class="lab__media img-placeholder"
              :class="`img-placeholder--${lab.pillar}`"
              aria-hidden="true"
            >
              <span class="img-placeholder__label">Laboratory</span>
            </div>

            <div class="lab__main">
              <div class="lab__head">
                <span class="lab__pillar">{{ pillarLabel(lab.pillar) }}</span>
                <h2 class="lab__name">{{ lab.name }}</h2>
                <p class="lab__prof">{{ lab.professor }}</p>
              </div>

              <p class="lab__theme">{{ lab.theme }}</p>

              <ul class="lab__keywords">
                <li v-for="kw in lab.keywords" :key="kw">{{ kw }}</li>
              </ul>

              <div
                v-if="lab.topics && lab.topics.length"
                class="lab__topics"
              >
                <p class="lab__topics-label text-label">研究紹介</p>
                <ul class="lab__topics-grid">
                  <li
                    v-for="(topic, i) in lab.topics"
                    :key="i"
                    class="lab-topic"
                  >
                    <div
                      class="lab-topic__thumb img-placeholder"
                      :class="`img-placeholder--${lab.pillar}`"
                      aria-hidden="true"
                    />
                    <p class="lab-topic__title">{{ topic.title }}</p>
                    <p class="lab-topic__desc">{{ topic.desc }}</p>
                    <a
                      v-if="topic.url"
                      :href="topic.url"
                      class="lab-topic__link"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      詳しく →
                    </a>
                  </li>
                </ul>
              </div>

              <p class="lab__site">
                <a
                  :href="lab.seminarUrl"
                  class="link-arrow"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  研究室ウェブサイト
                </a>
              </p>
            </div>
          </article>
        </TransitionGroup>

        <div v-if="filteredLabs.length === 0" class="labs-empty">
          <p>該当する研究室がありません。</p>
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
    "知能メディア工学科の9つの研究室を紹介します。メディア工学・知識工学・情報デザインの最先端研究。",
});

type Pillar = Laboratory["pillar"];

const DOMAIN_INFO = [
  { key: "media" as const, short: "メディア工学" },
  { key: "knowledge" as const, short: "知識工学" },
  { key: "design" as const, short: "情報デザイン" },
];

const activeFilter = ref<Pillar | null>(null);

const filteredLabs = computed<Laboratory[]>(() => {
  if (activeFilter.value === null) return laboratories;
  return laboratories.filter((lab) => lab.pillar === activeFilter.value);
});

const pillarLabel = (pillar: Pillar): string =>
  ({
    media: "メディア工学領域",
    knowledge: "知識工学領域",
    design: "情報デザイン領域",
  })[pillar];
</script>

<style scoped>
.section-padding-sm {
  padding-top: clamp(2.5rem, 6vw, 4.5rem);
  padding-bottom: var(--space-sm);
}

.labs-page {
  --labs-hairline: color-mix(in srgb, var(--color-on-surface) 12%, transparent);
}

/* Filter */
.labs-filter__inner {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
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
  color: var(--color-on-surface-muted);
  background-color: var(--color-surface);
  border: 1px solid var(--labs-hairline);
  border-radius: 999px;
  cursor: pointer;
  transition:
    background-color 180ms ease,
    color 180ms ease,
    border-color 180ms ease;
}

.labs-filter__btn:hover {
  color: var(--color-on-surface);
  border-color: var(--color-on-surface-faint);
}

.labs-filter__btn.active {
  background-color: var(--color-on-surface);
  color: var(--color-surface);
  border-color: var(--color-on-surface);
}

.labs-filter__btn--media.active {
  background-color: var(--color-media);
  border-color: var(--color-media);
  color: #fff;
}
.labs-filter__btn--knowledge.active {
  background-color: var(--color-knowledge);
  border-color: var(--color-knowledge);
  color: #fff;
}
.labs-filter__btn--design.active {
  background-color: var(--color-design);
  border-color: var(--color-design);
  color: #fff;
}

/* List */
.labs-list.section-padding {
  padding-top: var(--space-md);
}

@media (min-width: 768px) {
  .labs-list.section-padding {
    padding-top: clamp(var(--space-md), 4vw, 2.75rem);
  }
}

.labs-list__count {
  margin-bottom: var(--space-md);
}

.labs-list__items {
  border-top: 1px solid var(--labs-hairline);
}

.lab {
  scroll-margin-top: 90px;
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--labs-hairline);
}

@media (min-width: 768px) {
  .lab {
    grid-template-columns: clamp(200px, 26vw, 300px) 1fr;
    gap: clamp(var(--space-md), 4vw, var(--space-lg));
    align-items: start;
  }
}

.lab__media.img-placeholder {
  aspect-ratio: 4 / 3;
  border-radius: 3px;
}

.lab__main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  max-width: 68ch;
}

.lab__head {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.lab__pillar {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
}

.lab.is-media .lab__pillar {
  color: var(--color-media);
}
.lab.is-knowledge .lab__pillar {
  color: var(--color-knowledge);
}
.lab.is-design .lab__pillar {
  color: var(--color-design);
}

.lab__name {
  margin-top: 0.15rem;
  font-family: var(--font-display);
  font-size: clamp(1.35rem, 2.6vw, 1.9rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
}

.lab__prof {
  margin-top: 0.35rem;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-on-surface);
}

.lab__theme {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.85;
  color: var(--color-on-surface-muted);
}

.lab__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem 0.5rem;
  list-style: none;
  margin: 0.25rem 0 0;
  padding: 0;
}

.lab__keywords li {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  padding: 0.28rem 0.7rem;
  border-radius: 999px;
  border: 1px solid var(--labs-hairline);
  color: var(--color-on-surface-muted);
}

/* 研究紹介 */
.lab__topics {
  margin-top: var(--space-sm);
  padding-top: var(--space-sm);
  border-top: 1px solid var(--labs-hairline);
}

.lab__topics-label {
  color: var(--color-on-surface-muted);
  margin-bottom: var(--space-sm);
}

.lab__topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (min-width: 640px) {
  .lab__topics-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .lab__topics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.lab-topic {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.lab-topic__thumb.img-placeholder {
  aspect-ratio: 4 / 3;
  border-radius: 2px;
}

.lab-topic__title {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-on-surface);
}

.lab-topic__title::before {
  content: "◆ ";
  color: var(--color-on-surface-faint);
}

.lab-topic__desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  line-height: 1.7;
  color: var(--color-on-surface-muted);
}

.lab-topic__link {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-link);
}

.lab__site {
  margin: var(--space-xs) 0 0;
}

/* Empty state */
.labs-empty {
  padding: var(--space-lg) 0;
}

.labs-empty p {
  font-family: var(--font-body);
  font-size: var(--text-sm);
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
