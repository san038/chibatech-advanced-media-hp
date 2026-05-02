<template>
  <section class="vision section-padding bg-surface">
    <div class="vision__inner container">
      <div class="vision__content">
        <p class="vision__label section-label">Vision</p>

        <div class="vision__text">
          <p class="vision__line vision__line--1">
            音楽が感情を動かすように。<br />
            AIが答えを超えるように。<br />
            デザインが世界を変えるように。
          </p>
          <p class="vision__line vision__line--2">
            知能メディア工学科は、メディア・知識・デザインの<br class="br-desktop" />
            3つの力を統合し、まだ存在しない表現と<br class="br-desktop" />
            コミュニケーションを生み出す人材を育てる。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.vision__inner {
  display: flex;
  justify-content: flex-end;
}

.vision__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 680px;
  width: 100%;
}

@media (min-width: 1024px) {
  .vision__content {
    width: 66.666%;
  }
}

.vision__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.vision__line--1 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
}

.vision__line--2 {
  font-family: var(--font-body);
  font-size: var(--text-md);
  font-weight: 400;
  line-height: 1.8;
  color: var(--color-on-surface-muted);
}

@media (max-width: 767px) {
  .br-desktop {
    display: none;
  }
}
</style>
