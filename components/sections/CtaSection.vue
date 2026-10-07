<template>
  <section class="cta">
    <div class="cta__marquee" aria-hidden="true">
      <div class="cta__marquee-inner">
        <div v-for="seg in 2" :key="seg" class="cta__marquee-segment">
          <span v-for="i in 8" :key="`${seg}-${i}`" class="cta__marquee-text">
            Advanced Media —
          </span>
        </div>
      </div>
    </div>

    <div class="cta__inner container">
      <div class="cta__content">
        <p class="section-label">
          <span class="section-label__index">[ 04 ]</span>Next Step
        </p>
        <h2 class="cta__headline">体験して、確かめる。</h2>
        <p class="cta__body">
          知能メディア工学科の学びを、体験型イベントで確かめてください。<br
            class="br-desktop"
          />
          オープンキャンパスでは研究室公開と在学生との対話の場を設けています。
        </p>
        <div class="cta__actions">
          <a
            :href="OPEN_CAMPUS_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            オープンキャンパスへ
          </a>
          <NuxtLink to="/about" class="btn btn-ghost">学科を理解する</NuxtLink>
        </div>
      </div>

      <div class="cta__card">
        <span class="cta__corner cta__corner--tl" aria-hidden="true" />
        <span class="cta__corner cta__corner--tr" aria-hidden="true" />
        <span class="cta__corner cta__corner--bl" aria-hidden="true" />
        <span class="cta__corner cta__corner--br" aria-hidden="true" />
        <p class="cta__card-eyebrow">Open Campus</p>
        <p class="cta__card-title">Visit the Lab.</p>
        <p class="cta__card-meta">Tsudanuma Campus — Chiba</p>
        <ol class="cta__card-list">
          <li><span>01</span>研究室公開</li>
          <li><span>02</span>在学生との対話</li>
        </ol>
        <a
          :href="OPEN_CAMPUS_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="cta__card-link"
          >開催日程を見る <span aria-hidden="true">↗</span></a
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const OPEN_CAMPUS_URL = "https://www.it-chiba.ac.jp/admissions/opencampus/";
</script>

<style scoped>
.cta {
  position: relative;
  z-index: 1;
  overflow: hidden;
  padding: clamp(5rem, 11vw, 10rem) 0 clamp(9rem, 16vw, 14rem);
  background-color: var(--color-bg-base);
  border-top: 1px solid var(--color-line-subtle);
}

/* Background marquee — right to left, seamless loop（輪郭文字） */
.cta__marquee {
  position: absolute;
  left: 0;
  right: 0;
  bottom: -0.12em;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  font-size: clamp(4rem, 14vw, 12.5rem);
}

.cta__marquee-inner {
  display: flex;
  width: max-content;
  animation: cta-marquee-scroll 120s linear infinite;
  will-change: transform;
}

.cta__marquee-segment {
  display: flex;
  flex-shrink: 0;
  gap: 0.25em;
  padding-right: 0.25em;
}

.cta__marquee-text {
  font-family: var(--font-en);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.04em;
  text-transform: uppercase;
  white-space: nowrap;
  color: transparent;
  -webkit-text-stroke: 1px var(--color-line);
}

@keyframes cta-marquee-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .cta__marquee-inner {
    animation: none;
  }
}

.cta__inner {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-lg);
}

.cta__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2rem;
  max-width: 40rem;
}

.cta__headline {
  font-family: var(--font-jp);
  font-size: clamp(2.25rem, 4.6vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.cta__body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-text-secondary);
  line-height: 1.9;
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

/* イベント案内カード（四隅に角マーク） */
.cta__card {
  position: relative;
  width: min(100%, 30rem);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2.5rem;
  background-color: var(--color-bg-raised);
}

.cta__corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-color: var(--color-line-accent);
  border-style: solid;
  border-width: 0;
}

.cta__corner--tl {
  top: 0;
  left: 0;
  border-top-width: 1px;
  border-left-width: 1px;
}
.cta__corner--tr {
  top: 0;
  right: 0;
  border-top-width: 1px;
  border-right-width: 1px;
}
.cta__corner--bl {
  bottom: 0;
  left: 0;
  border-bottom-width: 1px;
  border-left-width: 1px;
}
.cta__corner--br {
  bottom: 0;
  right: 0;
  border-bottom-width: 1px;
  border-right-width: 1px;
}

.cta__card-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.cta__card-title {
  font-family: var(--font-en);
  font-size: clamp(2.25rem, 4vw, 3.5rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.03em;
}

.cta__card-meta {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.cta__card-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--color-line);
}

.cta__card-list li {
  display: flex;
  gap: 1rem;
  font-family: var(--font-jp);
  font-size: var(--text-sm);
  font-weight: 500;
}

.cta__card-list span {
  font-family: var(--font-mono);
  font-weight: 500;
  color: var(--color-text-tertiary);
}

.cta__card-link {
  align-self: flex-start;
  margin-top: 0.5rem;
  font-family: var(--font-jp);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 200ms ease;
}

.cta__card-link span {
  font-family: var(--font-mono);
  color: var(--color-accent);
}

.cta__card-link:hover {
  color: var(--color-accent-bright);
}

@media (max-width: 767px) {
  .br-desktop {
    display: none;
  }

  .cta__actions {
    flex-direction: column;
    width: 100%;
  }

  .cta__actions .btn {
    width: 100%;
  }

  .cta__card {
    padding: 1.75rem;
  }
}
</style>
