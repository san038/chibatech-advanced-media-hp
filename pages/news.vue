<template>
  <div class="news-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">News</p>
        <h1 class="page-hero__title">ニュース</h1>
        <p class="page-hero__subtitle">
          知能メディア工学科の活動・研究・イベント情報をお届けします。
        </p>
      </div>
    </section>

    <!-- Articles -->
    <section class="news-content section-padding bg-surface">
      <div class="container">
        <!-- Loading state -->
        <div
          v-if="pending"
          class="news-loading"
          aria-live="polite"
          aria-busy="true"
        >
          <div v-for="i in 6" :key="i" class="news-skeleton">
            <div class="skeleton-line skeleton-line--date" />
            <div class="skeleton-line skeleton-line--title" />
            <div
              class="skeleton-line skeleton-line--title skeleton-line--short"
            />
            <div class="skeleton-line skeleton-line--desc" />
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="news-error">
          <p class="news-error__title">記事を取得できませんでした</p>
          <p class="news-error__body">
            しばらく時間をおいてから再度お試しください。また、
            <a
              href="https://note.com/chitechime"
              target="_blank"
              rel="noopener noreferrer"
              class="news-error__link"
            >
              note.com のページ
            </a>
            から直接記事をご覧いただけます。
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
        <div v-else-if="articles.length === 0 && !pending" class="news-empty">
          <p class="news-empty__text">記事がありません。</p>
          <a
            href="https://note.com/chitechime"
            target="_blank"
            rel="noopener noreferrer"
            class="link-arrow"
            style="margin-top: var(--space-md)"
          >
            note.com で見る
          </a>
        </div>

        <!-- Articles list -->
        <div v-else class="news-articles">
          <div class="news-articles__meta">
            <p class="text-label" style="color: var(--color-on-surface-muted)">
              {{ articles.length }} 件の記事
            </p>
          </div>
          <div class="news-articles__list">
            <a
              v-for="article in articles"
              :key="article.link"
              :href="article.link"
              target="_blank"
              rel="noopener noreferrer"
              class="news-article"
            >
              <div class="news-article__inner">
                <time
                  class="news-article__date"
                  :datetime="formatDateIso(article.pubDate)"
                >
                  {{ formatDate(article.pubDate) }}
                </time>
                <h2 class="news-article__title">{{ article.title }}</h2>
                <p v-if="article.description" class="news-article__desc">
                  {{ article.description }}
                </p>
                <div class="news-article__footer">
                  <span class="news-article__source">note.com</span>
                  <span class="news-article__arrow" aria-hidden="true">→</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- note.com attribution -->
    <section class="news-attribution section-padding bg-surface-low">
      <div class="container">
        <p class="news-attribution__text">
          記事は
          <a
            href="https://note.com/chitechime"
            target="_blank"
            rel="noopener noreferrer"
            class="news-attribution__link"
          >
            note.com/chitechime
          </a>
          にて掲載されています。
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "ニュース | 知能メディア工学科 | 千葉工業大学",
  description:
    "知能メディア工学科の最新情報・活動報告・イベント情報をお届けします。",
});

const { articles, pending, error, refresh } = useNoteArticles();

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
/* Loading */
.news-loading {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.news-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--color-surface-low);
}

.skeleton-line {
  height: 1rem;
  background: linear-gradient(
    90deg,
    var(--color-surface-low) 0%,
    var(--color-surface) 50%,
    var(--color-surface-low) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-line--date {
  width: 120px;
  height: 0.75rem;
}
.skeleton-line--title {
  width: 100%;
  height: 1.25rem;
}
.skeleton-line--short {
  width: 70%;
}
.skeleton-line--desc {
  width: 85%;
  height: 0.875rem;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Error */
.news-error {
  padding: var(--space-xl) 0;
  max-width: 480px;
}

.news-error__title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-on-surface);
  margin-bottom: var(--space-sm);
}

.news-error__body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-on-surface-muted);
  line-height: 1.7;
}

.news-error__link {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Empty */
.news-empty {
  padding: var(--space-xl) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.news-empty__text {
  font-family: var(--font-body);
  font-size: var(--text-md);
  color: var(--color-on-surface-muted);
}

/* Articles */
.news-articles__meta {
  margin-bottom: var(--space-lg);
}

.news-articles__list {
  display: flex;
  flex-direction: column;
}

.news-article {
  display: block;
  text-decoration: none;
  border-top: 1px solid var(--color-surface-low);
  transition: background-color 200ms ease;
}

.news-article:last-child {
  border-bottom: 1px solid var(--color-surface-low);
}

.news-article:hover {
  background-color: var(--color-surface-low);
  margin: 0 calc(-1 * var(--space-sm));
  padding: 0 var(--space-sm);
}

.news-article__inner {
  padding: var(--space-lg) 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.news-article__date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-faint);
  letter-spacing: 0.04em;
}

.news-article__title {
  font-family: var(--font-display);
  font-size: clamp(1rem, 2vw, var(--text-xl));
  font-weight: 600;
  color: var(--color-on-surface);
  line-height: 1.4;
  letter-spacing: -0.01em;
  transition: color 200ms ease;
}

.news-article:hover .news-article__title {
  color: var(--color-primary);
}

.news-article__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  line-height: 1.7;
  max-width: 80ch;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-article__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: var(--space-xs);
}

.news-article__source {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-faint);
  letter-spacing: 0.04em;
}

.news-article__arrow {
  font-size: var(--text-sm);
  color: var(--color-on-surface-faint);
  transition:
    transform 200ms ease,
    color 200ms ease;
}

.news-article:hover .news-article__arrow {
  transform: translateX(4px);
  color: var(--color-primary);
}

/* Attribution */
.news-attribution__text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-faint);
}

.news-attribution__link {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 3px;
}
</style>
