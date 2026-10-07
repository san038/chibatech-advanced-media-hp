<template>
  <!-- トップ「Updates」セクションの左列: ニュース一覧 -->
  <div class="news-preview">
    <div class="news-preview__head">
      <h3 class="news-preview__heading">
        News<template v-if="!pending && articles.length">
          — {{ String(Math.min(articles.length, LIMIT)).padStart(2, "0") }}</template
        >
      </h3>
      <NuxtLink to="/news" class="news-preview__more">
        すべてのニュース <span aria-hidden="true">→</span>
      </NuxtLink>
    </div>

    <!-- Loading state -->
    <div
      v-if="pending"
      class="news-preview__loading"
      aria-live="polite"
      aria-busy="true"
    >
      <div v-for="i in 3" :key="i" class="news-preview__skeleton">
        <div class="skeleton-line skeleton-line--date" />
        <div class="skeleton-line skeleton-line--title" />
      </div>
    </div>

    <!-- Error / fallback state -->
    <p
      v-else-if="error || articles.length === 0"
      class="news-preview__fallback"
    >
      現在、掲載中のニュースはありません。
    </p>

    <!-- Articles list -->
    <ul v-else class="news-preview__list">
      <li v-for="article in articles.slice(0, LIMIT)" :key="article.slug">
        <NuxtLink :to="`/news/${article.slug}`" class="news-preview__item">
          <time
            class="news-preview__date"
            :datetime="formatDateIso(article.date)"
          >
            {{ formatDate(article.date) }}
          </time>
          <span class="news-preview__article-title">{{ article.title }}</span>
          <span class="news-preview__arrow" aria-hidden="true">→</span>
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const LIMIT = 5;
const { articles, pending, error } = useNews();

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}.${m}.${day}`;
};

const formatDateIso = (dateStr: string): string => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().split("T")[0];
};
</script>

<style scoped>
.news-preview {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.news-preview__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-sm);
  padding-bottom: 1rem;
}

.news-preview__heading,
.news-preview__more {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.news-preview__heading {
  color: var(--color-text-secondary);
}

.news-preview__more {
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 200ms ease;
}

.news-preview__more span {
  color: var(--color-accent);
}

.news-preview__more:hover {
  color: var(--color-accent-bright);
}

/* Loading */
.news-preview__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem 0;
  border-top: 1px solid var(--color-line-subtle);
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(
    90deg,
    var(--color-bg-raised) 0%,
    var(--color-bg-elevated) 50%,
    var(--color-bg-raised) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line--date {
  width: 100px;
  height: 0.75rem;
}

.skeleton-line--title {
  width: 80%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Fallback */
.news-preview__fallback {
  padding: var(--space-md) 0;
  border-top: 1px solid var(--color-line-subtle);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  line-height: 1.8;
}

/* List */
.news-preview__item {
  display: grid;
  grid-template-columns: 6.5rem minmax(0, 1fr) 1rem;
  align-items: baseline;
  gap: 1.5rem;
  padding: 1.4rem 0;
  border-top: 1px solid var(--color-line-subtle);
  text-decoration: none;
  color: var(--color-text-primary);
}

.news-preview__date {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
}

.news-preview__article-title {
  font-family: var(--font-jp);
  font-size: 0.9375rem;
  line-height: 1.6;
  transition: color 200ms ease;
}

.news-preview__item:hover .news-preview__article-title {
  color: var(--color-accent-bright);
}

.news-preview__arrow {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-tertiary);
  transition:
    transform 200ms ease,
    color 200ms ease;
}

.news-preview__item:hover .news-preview__arrow {
  transform: translateX(4px);
  color: var(--color-accent);
}

@media (max-width: 767px) {
  .news-preview__item {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.35rem;
    padding: 1.1rem 0;
  }

  .news-preview__arrow {
    display: none;
  }
}
</style>
