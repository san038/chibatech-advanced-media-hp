<template>
  <section class="cta bg-dark">
    <div class="cta__marquee" aria-hidden="true">
      <div class="cta__marquee-inner">
        <div class="cta__marquee-segment">
          <span
            v-for="i in 12"
            :key="`a-${i}`"
            class="cta__marquee-text"
          >
            ADVANCED MEDIA
          </span>
        </div>
        <div class="cta__marquee-segment">
          <span
            v-for="i in 12"
            :key="`b-${i}`"
            class="cta__marquee-text"
          >
            ADVANCED MEDIA
          </span>
        </div>
      </div>
    </div>

    <div class="cta__inner container">
      <div class="cta__content">
        <p class="cta__label text-label" style="color: rgba(252,249,248,0.3)">
          Next Step
        </p>
        <h2 class="cta__headline">
          まずは、実際に見て<br>
          感じてほしい。
        </h2>
        <p class="cta__body">
          知能メディア工学科の学びを、体験型イベントで確かめてください。<br class="br-desktop">
          オープンキャンパスでは研究室公開と在学生との対話の場を設けています。
        </p>
        <div class="cta__actions">
          <a
            href="https://www.it-chiba.ac.jp/admissions/opencampus/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-light cta__btn"
          >
            オープンキャンパスへ
          </a>
          <NuxtLink to="/about" class="btn btn-ghost-light cta__btn cta__btn--outline">
            学科を理解する
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.cta {
  padding-top: var(--space-2xl);
  padding-bottom: var(--space-2xl);
  position: relative;
  overflow: hidden;
}

/* Background marquee — right to left, seamless loop */
.cta__marquee {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  overflow: hidden;
  pointer-events: none;
}

.cta__marquee-inner {
  display: flex;
  width: max-content;
  flex-shrink: 0;
  animation: cta-marquee-scroll 50s linear infinite;
  will-change: transform;
}

.cta__marquee-segment {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: clamp(2rem, 6vw, 5rem);
  padding-right: clamp(2rem, 6vw, 5rem);
}

.cta__marquee-text {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 14vw, 11rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: rgba(252, 249, 248, 0.07);
  white-space: nowrap;
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
  justify-content: center;
  text-align: center;
}

.cta__content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  max-width: 720px;
  width: 100%;
}

.cta__label {
  letter-spacing: 0.1em;
}

.cta__headline {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: #fcf9f8;
}

.cta__body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: rgba(252, 249, 248, 0.6);
  line-height: 1.8;
  max-width: 540px;
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-xs);
}

.cta__btn {
  min-width: min(100%, 200px);
  justify-content: center;
  text-align: center;
}

.cta__btn--outline {
  outline: 1px solid rgba(252, 249, 248, 0.35);
}

.cta__btn--outline:hover {
  outline-color: rgba(252, 249, 248, 0.55);
}

@media (max-width: 767px) {
  .br-desktop {
    display: none;
  }

  .cta__actions {
    flex-direction: column;
    width: 100%;
  }

  .cta__btn {
    width: 100%;
    max-width: 320px;
  }
}
</style>
