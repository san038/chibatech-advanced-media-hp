<template>
  <section class="hero">
    <!-- Background visual element -->
    <div class="hero__bg" aria-hidden="true">
      <div class="hero__bg-grid" />
      <div class="hero__bg-gradient" />
    </div>

    <!-- Pillar accent lines (decorative) -->
    <div class="hero__pillars" aria-hidden="true">
      <div class="hero__pillar hero__pillar--media" />
      <div class="hero__pillar hero__pillar--knowledge" />
      <div class="hero__pillar hero__pillar--design" />
    </div>

    <!-- Main content - asymmetric, starts at col 4 -->
    <div class="hero__content container">
      <div class="hero__text-area">
        <p class="hero__label text-label">
          千葉工業大学 知能メディア工学科
        </p>

        <h1 class="hero__headline">
          まだない<br />コミュニケーションを、<br />つくる。
        </h1>

        <p class="hero__sub">
          音・AI・デザインで未来をひらく
        </p>

        <div class="hero__actions">
          <NuxtLink to="/about" class="btn btn-light">
            学科を理解する
          </NuxtLink>
          <NuxtLink to="/curriculum" class="btn btn-ghost-light">
            カリキュラムを見る
          </NuxtLink>
        </div>

        <!-- Three pillar tags -->
        <div class="hero__pillars-label" aria-label="3つの専門領域">
          <div class="hero__pillar-tag hero__pillar-tag--media">
            <span class="pillar-dot pillar-dot--media" aria-hidden="true" />
            メディア工学
          </div>
          <div class="hero__pillar-tag hero__pillar-tag--knowledge">
            <span class="pillar-dot pillar-dot--knowledge" aria-hidden="true" />
            知識工学
          </div>
          <div class="hero__pillar-tag hero__pillar-tag--design">
            <span class="pillar-dot pillar-dot--design" aria-hidden="true" />
            情報デザイン
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="hero__scroll-indicator" aria-hidden="true">
      <div class="scroll-indicator">
        <div class="scroll-indicator__line" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

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

.hero__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(252, 249, 248, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(252, 249, 248, 0.03) 1px, transparent 1px);
  background-size: 80px 80px;
}

.hero__bg-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 80% 60% at 20% 50%,
    rgba(106, 77, 255, 0.08) 0%,
    transparent 60%
  ),
  radial-gradient(
    ellipse 60% 80% at 80% 20%,
    rgba(59, 130, 246, 0.06) 0%,
    transparent 60%
  );
}

/* Pillar accent lines (vertical, right side) */
.hero__pillars {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  gap: 3px;
  width: 12px;
}

.hero__pillar {
  flex: 1;
  opacity: 0.4;
}

.hero__pillar--media { background-color: var(--color-media); }
.hero__pillar--knowledge { background-color: var(--color-knowledge); }
.hero__pillar--design { background-color: var(--color-design); }

/* Content */
.hero__content {
  position: relative;
  z-index: 1;
  width: 100%;
  padding-top: 80px; /* header height */
}

.hero__text-area {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 720px;
}

@media (min-width: 1024px) {
  .hero__text-area {
    margin-left: 25%; /* col 4 of 12 ≈ 33%, slightly less */
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
