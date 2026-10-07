<template>
  <!-- トップ: ニュース（左）と記事（右）をまとめた「Updates」 -->
  <section class="updates">
    <div class="updates__inner container">
      <div class="updates__head">
        <p class="section-label">
          <span class="section-label__index">[ 03 ]</span>Updates
        </p>
        <h2 class="updates__title">学科の、いまの動き。</h2>
      </div>
      <div class="updates__body">
        <NewsPreviewSection />
        <ArticlePreviewSection />
      </div>
    </div>
  </section>
</template>

<style scoped>
.updates {
  position: relative;
  z-index: 1;
  padding: clamp(5rem, 11vw, 10rem) 0;
  background-color: var(--color-bg-base);
  border-top: 1px solid var(--color-line-subtle);
}

.updates__inner {
  display: flex;
  flex-direction: column;
  gap: clamp(2.5rem, 5vw, 4rem);
}

.updates__head {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.updates__title {
  font-family: var(--font-jp);
  font-size: clamp(2rem, 4.4vw, 4rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.updates__body {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 1024px) {
  .updates__body {
    grid-template-columns: minmax(0, 1fr) minmax(0, 0.95fr);
    gap: clamp(3rem, 5vw, 4rem);
  }
}
</style>
