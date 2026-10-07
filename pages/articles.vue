<template>
  <div class="articles-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Articles</p>
        <h1 class="page-hero__title">記事</h1>
        <p class="page-hero__subtitle">
          教員・学生へのインタビューや研究紹介など、知能メディア工学科の「人」と「学び」をお届けします。
        </p>
      </div>
    </section>

    <section class="articles-content section-padding bg-surface">
      <div class="container">
        <!-- Loading state -->
        <div
          v-if="pending"
          class="articles-grid"
          aria-live="polite"
          aria-busy="true"
        >
          <div v-for="i in 6" :key="i" class="articles-skeleton" />
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="articles-error">
          <p class="articles-error__title">記事を取得できませんでした</p>
          <p class="articles-error__body">
            しばらく時間をおいてから再度お試しください。
          </p>
          <button
            class="btn btn-primary"
            style="margin-top: var(--space-md)"
            @click="() => refresh()"
          >
            再読み込み
          </button>
        </div>

        <!-- Empty state -->
        <p v-else-if="articles.length === 0" class="articles-empty">
          現在、掲載中の記事はありません。
        </p>

        <template v-else>
          <p class="articles-meta text-label">{{ articles.length }} 件の記事</p>
          <div class="articles-grid">
            <ArticleCard
              v-for="article in articles"
              :key="article.url"
              :article="article"
              show-excerpt
            />
          </div>
        </template>

        <div v-if="magazineUrl" class="articles-footer">
          <a
            :href="magazineUrl"
            class="link-arrow"
            target="_blank"
            rel="noopener"
          >
            note のマガジンで見る
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "記事 | 知能メディア工学科 | 千葉工業大学",
  description:
    "知能メディア工学科の教員・学生へのインタビューや研究紹介の記事をお届けします。",
});

const { articles, pending, error, refresh } = useArticles();
const magazineUrl = noteMagazineUrl();
</script>

<style scoped>
.articles-meta {
  color: var(--color-on-surface-muted);
  margin-bottom: var(--space-lg);
}

.articles-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg) var(--space-md);
}

@media (min-width: 640px) {
  .articles-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .articles-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.articles-skeleton {
  aspect-ratio: 1.2 / 1;
  background: linear-gradient(
    90deg,
    var(--color-surface-low) 0%,
    var(--color-surface) 50%,
    var(--color-surface-low) 100%
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

.articles-error {
  padding: var(--space-xl) 0;
  max-width: 480px;
}

.articles-error__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-on-surface);
  margin-bottom: var(--space-sm);
}

.articles-error__body,
.articles-empty {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-on-surface-muted);
  line-height: 1.7;
}

.articles-empty {
  padding: var(--space-xl) 0;
}

.articles-footer {
  margin-top: var(--space-lg);
}
</style>
