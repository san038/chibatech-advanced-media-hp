<template>
  <section class="news-preview section-padding bg-surface-low">
    <div class="news-preview__inner container">
      <div class="news-preview__header">
        <p class="section-label">News</p>
        <h2 class="news-preview__title text-display-md">ニュース</h2>
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
          <div
            class="skeleton-line skeleton-line--title skeleton-line--short"
          />
        </div>
      </div>

      <!-- Error / fallback state -->
      <div
        v-else-if="error || articles.length === 0"
        class="news-preview__fallback"
      >
        <p class="news-preview__fallback-text">
          現在、記事を取得できません。<br />
          <a
            href="https://note.com/chitechime"
            target="_blank"
            rel="noopener noreferrer"
            class="link-arrow"
          >
            note.com で記事を読む
          </a>
        </p>
      </div>

      <!-- Articles list -->
      <div v-else class="news-preview__list">
        <a
          v-for="article in articles.slice(0, 3)"
          :key="article.link"
          :href="article.link"
          target="_blank"
          rel="noopener noreferrer"
          class="news-preview__item"
        >
          <div
            v-if="article.imageUrl"
            class="news-preview__thumb-wrap"
            aria-hidden="true"
          >
            <img
              class="news-preview__thumb"
              :src="article.imageUrl"
              alt=""
              width="240"
              height="150"
              loading="lazy"
              decoding="async"
            >
          </div>
          <time
            class="news-preview__date"
            :datetime="formatDateIso(article.pubDate)"
          >
            {{ formatDate(article.pubDate) }}
          </time>
          <h3 class="news-preview__article-title">{{ article.title }}</h3>
          <p v-if="article.description" class="news-preview__desc">
            {{ article.description }}
          </p>
          <span class="news-preview__arrow" aria-hidden="true">→</span>
        </a>
      </div>

      <div class="news-preview__footer">
        <NuxtLink to="/news" class="link-arrow"> すべての記事を見る </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { articles, pending, error } = useNoteArticles();

const formatDate = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatDateIso = (dateStr: string): string => {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  } catch {
    return "";
  }
};
</script>

<style scoped>
.news-preview__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.news-preview__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.news-preview__title {
  color: var(--color-on-surface);
}

/* Loading */
.news-preview__loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.news-preview__skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-surface);
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(
    90deg,
    var(--color-surface) 0%,
    var(--color-surface-lowest) 50%,
    var(--color-surface) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line--date {
  width: 100px;
  height: 0.75rem;
}

.skeleton-line--title {
  width: 100%;
}

.skeleton-line--short {
  width: 65%;
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
  padding: var(--space-lg) 0;
}

.news-preview__fallback-text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  line-height: 1.8;
}

/* List */
.news-preview__list {
  display: flex;
  flex-direction: column;
}

.news-preview__item {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-surface);
  text-decoration: none;
  position: relative;
  transition: background-color 200ms ease;
}

.news-preview__thumb-wrap {
  width: 100%;
  max-height: 140px;
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--color-surface-lowest);
  margin-bottom: 0.25rem;
}

.news-preview__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.news-preview__item:last-child {
  border-bottom: 1px solid var(--color-surface);
}

@media (min-width: 768px) {
  .news-preview__item {
    grid-template-columns: 120px 1fr 24px;
    grid-template-rows: auto auto;
    align-items: start;
    gap: 0.5rem var(--space-md);
  }

  .news-preview__item:not(:has(.news-preview__thumb-wrap)) .news-preview__date {
    grid-column: 1;
    grid-row: 1;
  }

  .news-preview__item:not(:has(.news-preview__thumb-wrap)) .news-preview__article-title {
    grid-column: 2;
    grid-row: 1;
  }

  .news-preview__item:not(:has(.news-preview__thumb-wrap)) .news-preview__desc {
    grid-column: 2;
    grid-row: 2;
  }

  .news-preview__item:not(:has(.news-preview__thumb-wrap)) .news-preview__arrow {
    grid-column: 3;
    grid-row: 1 / span 2;
    align-self: center;
  }

  .news-preview__item:has(.news-preview__thumb-wrap) {
    grid-template-columns: 112px 1fr 24px;
    grid-template-rows: auto auto auto;
    gap: 0.35rem var(--space-md);
  }

  .news-preview__item:has(.news-preview__thumb-wrap) .news-preview__thumb-wrap {
    grid-row: 1 / span 3;
    grid-column: 1;
    max-height: none;
    height: 100%;
    min-height: 5.5rem;
    margin-bottom: 0;
    align-self: stretch;
  }

  .news-preview__item:has(.news-preview__thumb-wrap) .news-preview__date {
    grid-column: 2;
    grid-row: 1;
  }

  .news-preview__item:has(.news-preview__thumb-wrap) .news-preview__article-title {
    grid-column: 2;
    grid-row: 2;
  }

  .news-preview__item:has(.news-preview__thumb-wrap) .news-preview__desc {
    grid-column: 2;
    grid-row: 3;
  }

  .news-preview__item:has(.news-preview__thumb-wrap) .news-preview__arrow {
    grid-column: 3;
    grid-row: 1 / span 3;
    align-self: center;
  }
}

.news-preview__date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-faint);
  letter-spacing: 0.04em;
  padding-top: 0.2rem;
}

.news-preview__article-title {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-on-surface);
  line-height: 1.4;
  letter-spacing: -0.01em;
  transition: color 200ms ease;
}

.news-preview__item:hover .news-preview__article-title {
  color: var(--color-primary);
}

.news-preview__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  line-height: 1.6;

  /* 2-line clamp */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}


.news-preview__arrow {
  font-size: var(--text-sm);
  color: var(--color-on-surface-faint);
  transition:
    transform 200ms ease,
    color 200ms ease;
  align-self: center;
}

.news-preview__item:hover .news-preview__arrow {
  transform: translateX(4px);
  color: var(--color-primary);
}

@media (max-width: 767px) {
  .news-preview__arrow {
    display: none;
  }
}

/* Footer */
.news-preview__footer {
  padding-top: var(--space-md);
}
</style>
