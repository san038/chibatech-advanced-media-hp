<template>
  <section class="lab-preview section-padding bg-surface">
    <div class="lab-preview__inner container">
      <header class="lab-preview__header">
        <p class="section-label">Laboratories</p>
        <h2 class="sr-only">研究室</h2>
      </header>

      <ul class="lab-preview__grid">
        <li v-for="lab in previewLabs" :key="lab.id" class="lab-preview__cell">
          <NuxtLink :to="`/laboratories#${lab.id}`" class="lab-preview__link">
            <div class="lab-preview__body">
              <span class="lab-preview__num">{{ lab.professor }}</span>
              <span class="lab-preview__name">{{ lab.focus }}</span>
            </div>
            <span class="lab-preview__icon" aria-hidden="true">
              <svg
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.748 3.001h7.554l.1.014.099.028.06.026a.72.72 0 0 1 .219.15l.04.044.061.082.037.065.04.09.018.064.014.064.01.093v7.534a.75.75 0 0 1-1.493.102l-.007-.102V5.559L4.28 20.784a.75.75 0 0 1-.977.073l-.084-.073a.75.75 0 0 1-.073-.976l.073-.084L18.439 4.5l-5.69.001a.75.75 0 0 1-.744-.648l-.007-.102a.75.75 0 0 1 .648-.743L12.748 3Z"
                  fill="#212121"
                />
              </svg>
            </span>
          </NuxtLink>
        </li>
      </ul>

      <div class="lab-preview__footer">
        <NuxtLink to="/laboratories" class="link-arrow">
          すべての研究室を見る
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Laboratory } from "~/types";
import { laboratories } from "~/data/laboratories";

const previewLabs: Laboratory[] = laboratories;
</script>

<style scoped>
.lab-preview__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.lab-preview__header {
  max-width: 560px;
}

/* Two-column link list (reference: minimal rows + rule lines) */
.lab-preview__grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
}

@media (min-width: 640px) {
  .lab-preview__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.lab-preview__cell {
  margin: 0;
}

.lab-preview__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  padding-right: var(--space-xs);
  border-top: 1px solid var(--color-surface-low);
  text-decoration: none;
  color: inherit;
  transition:
    color 150ms ease,
    background-color 150ms ease;
}

.lab-preview__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  min-width: 0;
  flex: 1;
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .lab-preview__link {
    padding-left: var(--space-md);
    padding-right: var(--space-md);
    margin-left: calc(-1 * var(--space-xs));
    margin-right: calc(-1 * var(--space-xs));
    border-radius: 2px;
  }

  /* 2カラム時は列の境で負マージンが向かい合いセル同士が重なるため、内側だけ打ち消す */
  .lab-preview__cell:nth-child(odd) .lab-preview__link {
    margin-right: 0;
  }

  .lab-preview__cell:nth-child(even) .lab-preview__link {
    margin-left: 0;
  }
}

.lab-preview__link:hover {
  background-color: var(--color-department-bg);
}

@media (max-width: 639px) {
  .lab-preview__cell:last-child .lab-preview__link {
    border-bottom: 1px solid var(--color-surface-low);
  }
}

@media (min-width: 640px) {
  .lab-preview__cell:nth-last-child(-n + 2) .lab-preview__link {
    border-bottom: 1px solid var(--color-surface-low);
  }
}

.lab-preview__num {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.06em;
  color: var(--color-on-surface-faint);
}

.lab-preview__name {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
  line-height: 1.3;
}

.lab-preview__link:hover .lab-preview__name {
  color: var(--color-on-surface);
}

.lab-preview__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-on-surface-muted);
}

.lab-preview__icon-svg {
  display: block;
}

.lab-preview__link:hover .lab-preview__icon {
  color: var(--color-on-surface);
}

.lab-preview__footer {
  padding-top: var(--space-sm);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
