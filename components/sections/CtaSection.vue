<template>
  <section class="cta bg-dark">
    <div class="cta__inner container">
      <div class="cta__content">
        <p class="cta__label text-label" style="color: rgba(252,249,248,0.3)">
          Next Step
        </p>
        <h2 class="cta__headline">
          まずは、実際に見て<br />
          感じてほしい。
        </h2>
        <p class="cta__body">
          知能メディア工学科の学びを、体験型イベントで確かめてください。<br class="br-desktop" />
          オープンキャンパスでは研究室公開と在学生との対話の場を設けています。
        </p>
        <div class="cta__actions">
          <a
            href="https://www.it-chiba.ac.jp/admissions/opencampus/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-light"
          >
            オープンキャンパスへ
          </a>
          <NuxtLink to="/about" class="btn btn-ghost-light">
            学科を理解する
          </NuxtLink>
        </div>
      </div>

      <!-- Decorative accent -->
      <div class="cta__accent" aria-hidden="true">
        <div class="cta__accent-line cta__accent-line--media" />
        <div class="cta__accent-line cta__accent-line--knowledge" />
        <div class="cta__accent-line cta__accent-line--design" />
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

.cta__inner {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
}

.cta__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 640px;
  width: 100%;
}

@media (min-width: 1024px) {
  .cta__content {
    width: 66.666%;
  }
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
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

/* Accent lines */
.cta__accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  display: flex;
  flex-direction: column;
}

.cta__accent-line {
  flex: 1;
  opacity: 0.5;
}

.cta__accent-line--media { background-color: var(--color-media); }
.cta__accent-line--knowledge { background-color: var(--color-knowledge); }
.cta__accent-line--design { background-color: var(--color-design); }

@media (max-width: 767px) {
  .br-desktop { display: none; }
}
</style>
