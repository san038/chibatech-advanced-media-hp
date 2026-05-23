<template>
  <section class="hero">
    <!-- Background visual element -->
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__diagram">
        <DomainDiagram3D />
      </div>
      <div class="hero__bg-overlay" />
    </div>

    <!-- Title + scroll: anchored above bottom -->
    <div class="hero__bottom container">
      <!-- <div class="hero__text-area">
        <div class="hero__title-block">
          <p class="hero__label text-label">千葉工業大学 知能メディア工学科</p>
          <h1 class="hero__headline">
            <span class="hero__headline-line">
              <span class="hero__headline-line__bar" aria-hidden="true" />
              <span class="hero__headline-line__text">新時代の</span>
            </span>
            <span class="hero__headline-line hero__headline-line--delay">
              <span class="hero__headline-line__bar" aria-hidden="true" />
              <span class="hero__headline-line__text">創造力を育む</span>
            </span>
          </h1>
        </div>
      </div> -->

      <div class="hero__scroll-indicator" aria-hidden="true">
        <span class="hero__scroll-text">Scroll</span>
        <div class="hero__scroll-line" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  background-color: #ffffff;
  overflow: hidden;
}

/* Background */
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero__diagram {
  position: absolute;
  inset: 0;
  z-index: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding-bottom: 80px;
}

/* 下部タイトル帯の可読性 */
.hero__bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    #ffffff 0%,
    rgba(255, 255, 255, 0.92) 18%,
    rgba(255, 255, 255, 0.45) 42%,
    transparent 68%
  );
}

/* Bottom block: title (left) + scroll (center) */
.hero__bottom {
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-md);
  width: 100%;
  padding-bottom: max(var(--space-sm), env(safe-area-inset-bottom, 0px));
}

.hero__text-area {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: var(--space-md);
  width: 100%;
  max-width: 860px;
}

.hero__title-block {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-sm);
}

.hero__label {
  color: var(--color-on-surface-muted);
  letter-spacing: 0.06em;
  opacity: 0;
  animation: hero-fade-in 0.6s ease 1.3s forwards;
}

.hero__headline {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.35em;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, var(--text-7xl));
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}

.hero__headline-line {
  position: relative;
  display: inline-block;
  padding: 0.08em 0.28em;
}

.hero__headline-line__bar {
  position: absolute;
  inset: 0;
  background-color: #0f0e1a;
  transform: scaleX(0);
  transform-origin: left;
  animation: hero-bar-expand 0.55s cubic-bezier(0.65, 0, 0.35, 1) 0.15s forwards;
}

.hero__headline-line--delay .hero__headline-line__bar {
  animation-delay: 0.4s;
}

.hero__headline-line__text {
  position: relative;
  z-index: 1;
  color: #fcf9f8;
  opacity: 0;
  animation: hero-fade-in 0.3s ease 0.75s forwards;
}

.hero__headline-line--delay .hero__headline-line__text {
  animation-delay: 1s;
}

@keyframes hero-bar-expand {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

@keyframes hero-fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Scroll indicator */
.hero__scroll-indicator {
  align-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  animation: hero-fade-in 0.6s ease 1.6s forwards;
}

.hero__scroll-text {
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  color: rgba(15, 14, 26, 0.4);
  text-transform: uppercase;
}

.hero__scroll-line {
  width: 1px;
  height: 48px;
  background: linear-gradient(to bottom, rgba(15, 14, 26, 0.4), transparent);
  animation: scroll-line 1.6s ease-in-out infinite;
}

@keyframes scroll-line {
  0% {
    transform: scaleY(0);
    transform-origin: top;
    opacity: 1;
  }
  50% {
    transform: scaleY(1);
    transform-origin: top;
    opacity: 1;
  }
  51% {
    transform: scaleY(1);
    transform-origin: bottom;
  }
  100% {
    transform: scaleY(0);
    transform-origin: bottom;
    opacity: 0.3;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero__scroll-line {
    animation: none;
    opacity: 0.4;
  }
}
</style>
