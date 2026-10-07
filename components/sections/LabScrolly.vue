<template>
  <!-- 研究室一覧（データシート風の表）。領域タブで絞り込み -->
  <section class="lab-list" aria-label="研究室紹介">
    <div class="lab-list__inner container">
      <div class="lab-list__head">
        <div class="lab-list__title">
          <p class="section-label">
            <span class="section-label__index">[ 02 ]</span>Laboratories
          </p>
          <h2 class="lab-list__h">
            {{ laboratories.length }}つの研究室が、<br />最前線を拓く。
          </h2>
        </div>
        <ul class="lab-list__stats" aria-label="領域ごとの研究室数">
          <li v-for="s in stats" :key="s.key" class="lab-list__stat">
            <span class="lab-list__stat-num">{{ s.count }}</span>
            <span class="lab-list__stat-label">
              <span class="pillar-dot" :class="s.dot" aria-hidden="true" />
              {{ s.label }}
            </span>
          </li>
        </ul>
      </div>

      <div class="lab-list__tabs" role="tablist" aria-label="領域で絞り込み">
        <button
          v-for="t in tabs"
          :key="t.key"
          type="button"
          role="tab"
          class="lab-list__tab"
          :class="{ 'is-active': filter === t.key }"
          :aria-selected="filter === t.key"
          @click="filter = t.key"
        >
          {{ t.label }} — {{ t.count }}
        </button>
      </div>

      <div class="lab-list__table">
        <div class="lab-list__row lab-list__row--head" aria-hidden="true">
          <span>No.</span>
          <span>Domain</span>
          <span>Laboratory / Professor</span>
          <span>Keywords</span>
          <span />
        </div>
        <NuxtLink
          v-for="lab in visibleLabs"
          :key="lab.id"
          :to="`/laboratories#${lab.id}`"
          class="lab-list__row"
          :class="`is-${lab.pillar}`"
        >
          <span class="lab-list__no">{{ lab.no }}</span>
          <span class="lab-list__domain">
            <span
              class="pillar-dot"
              :class="`pillar-dot--${lab.pillar}`"
              aria-hidden="true"
            />
            {{ PILLAR_LABEL[lab.pillar] }}
          </span>
          <span class="lab-list__name-block">
            <span class="lab-list__name">{{ lab.name }}</span>
            <span class="lab-list__prof">{{ lab.professor }}</span>
          </span>
          <span class="lab-list__kw">{{ lab.keywords.slice(0, 3).join(" / ") }}</span>
          <span class="lab-list__arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </div>

      <div class="lab-list__footer">
        <NuxtLink to="/laboratories" class="btn btn-ghost">
          研究室をくわしく見る
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import type { Laboratory } from "~/types";

type Pillar = Laboratory["pillar"];
type FilterKey = Pillar | "all";

const PILLAR_LABEL: Record<Pillar, string> = {
  media: "Media Eng.",
  knowledge: "Knowledge Eng.",
  design: "Information Design",
};

const laboratories = useContent().labs;
const pad2 = (n: number): string => String(n).padStart(2, "0");
const countOf = (p: Pillar): number =>
  laboratories.filter((l) => l.pillar === p).length;

const stats = computed(() => [
  { key: "all", count: pad2(laboratories.length), label: "All Labs", dot: "lab-list__dot--all" },
  { key: "media", count: pad2(countOf("media")), label: "Media", dot: "pillar-dot--media" },
  { key: "knowledge", count: pad2(countOf("knowledge")), label: "Knowledge", dot: "pillar-dot--knowledge" },
  { key: "design", count: pad2(countOf("design")), label: "Design", dot: "pillar-dot--design" },
]);

const tabs = computed<{ key: FilterKey; label: string; count: string }[]>(() => [
  { key: "all", label: "All", count: pad2(laboratories.length) },
  { key: "media", label: "Media", count: pad2(countOf("media")) },
  { key: "knowledge", label: "Knowledge", count: pad2(countOf("knowledge")) },
  { key: "design", label: "Design", count: pad2(countOf("design")) },
]);

const filter = ref<FilterKey>("all");

// 番号は全体の掲載順で固定（絞り込んでも変えない）
const numbered = laboratories.map((lab, i) => ({
  ...lab,
  no: String(i + 1).padStart(3, "0"),
}));
const visibleLabs = computed(() =>
  filter.value === "all"
    ? numbered
    : numbered.filter((l) => l.pillar === filter.value),
);
</script>

<style scoped>
.lab-list {
  position: relative;
  z-index: 1;
  padding: clamp(5rem, 11vw, 10rem) 0;
  background-color: var(--color-bg-raised);
  border-top: 1px solid var(--color-line-subtle);
}

.lab-list__inner {
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 5vw, 4rem);
}

.lab-list__head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-md);
}

.lab-list__title {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.lab-list__h {
  font-family: var(--font-jp);
  font-size: clamp(2rem, 4.4vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.lab-list__stats {
  display: flex;
  gap: clamp(1.5rem, 3.4vw, 3rem);
}

.lab-list__stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.lab-list__stat-num {
  font-family: var(--font-en);
  font-size: clamp(2.25rem, 4.4vw, 4rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
}

.lab-list__stat-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.lab-list__dot--all {
  background-color: var(--color-accent);
}

/* タブ */
.lab-list__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 2rem;
  margin-bottom: -1rem;
}

.lab-list__tab {
  padding: 0 0 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  border-bottom: 2px solid transparent;
  transition:
    color 200ms ease,
    border-color 200ms ease;
}

.lab-list__tab:hover {
  color: var(--color-text-secondary);
}

.lab-list__tab.is-active {
  color: var(--color-text-primary);
  border-bottom-color: var(--color-accent);
}

/* 表 */
.lab-list__row {
  display: grid;
  grid-template-columns: 3.5rem 11rem minmax(0, 1fr) 21rem 1rem;
  align-items: center;
  gap: 2rem;
  padding: 1.75rem 0;
  border-top: 1px solid var(--color-line-subtle);
  text-decoration: none;
  color: var(--color-text-primary);
  transition: background-color 200ms ease;
}

.lab-list__row--head {
  padding: 0 0 0.75rem;
  border-top: none;
  border-bottom: 1px solid var(--color-line-subtle);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.lab-list__row--head + .lab-list__row {
  border-top: none;
}

a.lab-list__row:hover {
  background-color: rgba(255, 255, 255, 0.02);
}

a.lab-list__row:hover .lab-list__name {
  color: var(--color-accent-bright);
}

a.lab-list__row:hover .lab-list__arrow {
  transform: translateX(4px);
}

.lab-list__no {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
}

.lab-list__domain {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.lab-list__name-block {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  min-width: 0;
}

.lab-list__name {
  font-family: var(--font-jp);
  font-size: clamp(1.125rem, 1.7vw, 1.5rem);
  font-weight: 700;
  line-height: 1.4;
  transition: color 200ms ease;
}

.lab-list__prof {
  font-family: var(--font-jp);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
}

.lab-list__kw {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  line-height: 1.7;
  letter-spacing: 0.04em;
  color: var(--color-text-tertiary);
}

.lab-list__arrow {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-accent);
  transition: transform 200ms ease;
}

.lab-list__footer {
  display: flex;
}

@media (max-width: 1099px) {
  .lab-list__row {
    grid-template-columns: 3rem 10rem minmax(0, 1fr) 1rem;
  }

  .lab-list__row > :nth-child(4) {
    display: none;
  }
}

@media (max-width: 767px) {
  .lab-list__stats {
    width: 100%;
    justify-content: space-between;
  }

  .lab-list__row {
    grid-template-columns: 2.5rem minmax(0, 1fr) 1rem;
    grid-template-areas:
      "no domain arrow"
      "no name arrow";
    align-items: start;
    gap: 0.4rem 1rem;
    padding: 1.1rem 0;
  }

  .lab-list__row--head {
    display: none;
  }

  .lab-list__no {
    grid-area: no;
  }

  .lab-list__domain {
    grid-area: domain;
  }

  .lab-list__name-block {
    grid-area: name;
  }

  .lab-list__arrow {
    grid-area: arrow;
    align-self: center;
  }

  .lab-list__footer .btn {
    width: 100%;
  }
}
</style>
