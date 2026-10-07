<template>
  <!-- トップ「Updates」セクションの右列: note 記事 -->
  <div class="article-preview">
    <div class="article-preview__head">
      <h3 class="article-preview__heading">
        Articles<template v-if="!pending && articles.length">
          — {{ String(Math.min(articles.length, LIMIT)).padStart(2, "0") }}</template
        >
      </h3>
      <NuxtLink to="/articles" class="article-preview__more">
        すべての記事 <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div
      v-if="pending"
      class="article-preview__grid"
      aria-live="polite"
      aria-busy="true"
    >
      <div v-for="i in LIMIT" :key="i" class="article-preview__skeleton" />
    </div>

    <!-- Error / fallback state -->
    <p
      v-else-if="error || articles.length === 0"
      class="article-preview__fallback"
    >
      現在、掲載中の記事はありません。
    </p>

    <div v-else class="article-preview__grid">
      <ArticleCard
        v-for="article in articles.slice(0, LIMIT)"
        :key="article.url"
        :article="article"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const LIMIT = 2;
const { articles, pending, error } = useArticles();
</script>

<style scoped>
.article-preview {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.article-preview__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-line-subtle);
  margin-bottom: 1.5rem;
}

.article-preview__heading,
.article-preview__more {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.article-preview__heading {
  color: var(--color-text-secondary);
}

.article-preview__more {
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 200ms ease;
}

.article-preview__more span {
  color: var(--color-accent);
}

.article-preview__more:hover {
  color: var(--color-accent-bright);
}

.article-preview__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-md) 1.5rem;
}

@media (max-width: 599px) {
  .article-preview__grid {
    grid-template-columns: 1fr;
  }
}

.article-preview__skeleton {
  aspect-ratio: 1.2 / 1;
  background: linear-gradient(
    90deg,
    var(--color-bg-raised) 0%,
    var(--color-bg-elevated) 50%,
    var(--color-bg-raised) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.article-preview__fallback {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  line-height: 1.8;
}
</style>
