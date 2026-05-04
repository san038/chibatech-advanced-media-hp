<template>
  <section class="hero">
    <!-- Background visual element -->
    <div class="hero__bg" aria-hidden="true">
      <HeroKeywordsBg />
      <div class="hero__bg-overlay" />
    </div>

    <!-- Main content - asymmetric, starts at col 4 -->
    <div class="hero__content container">
      <div class="hero__text-area">
        <p class="hero__label text-label">千葉工業大学 知能メディア工学科</p>

        <h1 class="hero__headline">
          あたらしい<br />コミュニケーションを<br />つくろう。
        </h1>

        <div class="hero__actions">
          <NuxtLink to="/about" class="btn btn-light">
            学科を理解する
          </NuxtLink>
          <NuxtLink to="/curriculum" class="btn btn-ghost-light">
            カリキュラムを見る
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <!-- <div class="hero__scroll-indicator" aria-hidden="true">
      <div class="scroll-indicator">
        <div class="scroll-indicator__line" />
      </div>
    </div> -->
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  align-items: center;
  background-color: var(--color-dark);
  overflow: hidden;
}

/* Background */
.hero__bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* キーワードレイヤー */
.hero__bg :deep(.hero-kw-bg) {
  z-index: 0;
}

/* グラデーションオーバーレイ: 左=完全な黒、右=透明
   キーワードの上、コンテンツの下に配置 */
.hero__bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
}

/* Content */
.hero__content {
  position: relative;
  z-index: 3;
  width: 100%;
  padding-top: 80px; /* header height */
}

.hero__text-area {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 940px;
}

@media (min-width: 1024px) {
  .hero__text-area {
    margin-left: 5%; /* col 4 of 12 ≈ 33%, slightly less */
  }
}

.hero__label {
  color: rgba(252, 249, 248, 0.45);
  letter-spacing: 0.06em;
}

.hero__headline {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, var(--text-7xl));
  font-weight: 700;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fcf9f8;
}

.hero__sub {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 300;
  color: rgba(252, 249, 248, 0.6);
  letter-spacing: 0.02em;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

/* Pillar tags */
.hero__pillars-label {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.hero__pillar-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: rgba(252, 249, 248, 0.55);
  letter-spacing: 0.02em;
}

/* ヒーローは暗背景のため、main の pillar ドットより明るい色を上書き */
.hero :deep(.pillar-dot--media) {
  background-color: var(--color-media-on-dark);
}
.hero :deep(.pillar-dot--knowledge) {
  background-color: var(--color-knowledge-on-dark);
}
.hero :deep(.pillar-dot--design) {
  background-color: var(--color-design-on-dark);
}

/* Scroll indicator */
.hero__scroll-indicator {
  position: absolute;
  bottom: var(--space-lg);
  left: 50%;
  transform: translateX(-50%);
}

@media (min-width: 1024px) {
  .hero__scroll-indicator {
    left: calc(25% + var(--space-xl));
    transform: none;
  }
}
</style>
