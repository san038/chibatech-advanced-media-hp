<template>
  <section class="lab-preview section-padding bg-surface">
    <div class="lab-preview__inner container">
      <header class="lab-preview__header">
        <p class="section-label">Laboratories</p>
        <h2 class="sr-only">研究室</h2>
      </header>

      <ul class="lab-preview__grid">
        <li
          v-for="(lab, index) in previewLabs"
          :key="lab.id"
          class="lab-preview__cell"
        >
          <NuxtLink
            :to="`/laboratories#${lab.id}`"
            class="lab-preview__link"
          >
            <span class="lab-preview__num">Lab {{ labNum(index) }}</span>
            <span class="lab-preview__name">{{ lab.name }}</span>
            <span class="lab-preview__icon" aria-hidden="true">↗</span>
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
import type { Laboratory } from '~/types'
import { laboratories } from '~/data/laboratories'

const previewLabs: Laboratory[] = laboratories

const labNum = (index: number) => String(index + 1).padStart(2, '0')
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
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: baseline;
  gap: var(--space-md);
  padding: var(--space-md) 0;
  border-top: 1px solid var(--color-surface-low);
  text-decoration: none;
  color: inherit;
  transition: color 150ms ease, background-color 150ms ease;
}

@media (min-width: 640px) {
  .lab-preview__link {
    padding-left: var(--space-xs);
    padding-right: var(--space-xs);
    margin-left: calc(-1 * var(--space-xs));
    margin-right: calc(-1 * var(--space-xs));
    border-radius: 2px;
  }

  .lab-preview__link:hover {
    background-color: var(--color-surface-low);
  }
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
  white-space: nowrap;
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
  font-size: var(--text-sm);
  line-height: 1;
  color: var(--color-on-surface-muted);
  justify-self: end;
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
