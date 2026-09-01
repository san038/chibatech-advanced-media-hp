<template>
  <div class="news-detail">
    <section class="page-hero">
      <div class="container">
        <NuxtLink to="/news" class="news-detail__back">
          <span aria-hidden="true">←</span> ニュース一覧
        </NuxtLink>
      </div>
    </section>

    <section class="news-detail__content section-padding bg-surface">
      <div class="container">
        <div class="news-detail__wrap">
          <!-- Loading -->
          <div v-if="pending" class="news-detail__state" aria-busy="true">
            <div class="skeleton-line skeleton-line--date" />
            <div class="skeleton-line skeleton-line--title" />
            <div class="skeleton-line skeleton-line--body" />
            <div class="skeleton-line skeleton-line--body" />
            <div class="skeleton-line skeleton-line--body skeleton-line--short" />
          </div>

          <!-- Not found -->
          <div v-else-if="notFound" class="news-detail__state">
            <p class="news-detail__state-title">記事が見つかりませんでした</p>
            <NuxtLink to="/news" class="link-arrow">ニュース一覧へ戻る</NuxtLink>
          </div>

          <!-- Error -->
          <div v-else-if="error" class="news-detail__state">
            <p class="news-detail__state-title">記事を取得できませんでした</p>
            <button
              class="btn btn-primary"
              style="margin-top: var(--space-md)"
              @click="() => refresh()"
            >
              再読み込み
            </button>
          </div>

          <!-- Article -->
          <article v-else-if="article" class="news-detail__article">
            <time class="news-detail__date" :datetime="formatDateIso(article.date)">
              {{ formatDate(article.date) }}
            </time>
            <h1 class="news-detail__title">{{ article.title }}</h1>
            <div
              v-if="article.imageUrl"
              class="news-detail__hero-img"
              aria-hidden="true"
            >
              <img :src="article.imageUrl" alt="" decoding="async" >
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="news-detail__prose" v-html="article.content" />
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { watchEffect } from "vue";

const route = useRoute();
const { article, pending, error, notFound, refresh } = useNewsArticle(
  () => String(route.params.slug ?? ""),
);

watchEffect(() => {
  const base = "ニュース | 知能メディア工学科 | 千葉工業大学";
  useSeoMeta({
    title: article.value ? `${article.value.title} | ${base}` : base,
    description: article.value?.excerpt || undefined,
  });
});

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
.news-detail__back {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  text-decoration: none;
  transition: color 200ms ease;
}

.news-detail__back:hover {
  color: var(--color-link);
}

.news-detail__wrap {
  max-width: 44rem;
  margin: 0 auto;
}

/* States */
.news-detail__state {
  padding: var(--space-lg) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.news-detail__state-title {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  color: var(--color-on-surface);
}

.skeleton-line {
  height: 1rem;
  border-radius: 2px;
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
  width: 80%;
  height: 1.75rem;
  margin-bottom: var(--space-md);
}
.skeleton-line--body {
  width: 100%;
}
.skeleton-line--short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Article */
.news-detail__date {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-faint);
  letter-spacing: 0.04em;
}

.news-detail__title {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, var(--text-3xl, 2rem));
  font-weight: 700;
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--color-on-surface);
  margin: 0.5rem 0 var(--space-lg);
}

.news-detail__hero-img {
  width: 100%;
  margin-bottom: var(--space-lg);
  overflow: hidden;
  background: var(--color-surface-low);
}

.news-detail__hero-img img {
  width: 100%;
  height: auto;
  display: block;
}

/* WP 本文 */
.news-detail__prose {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.9;
  color: var(--color-on-surface);
}

.news-detail__prose :deep(p) {
  margin: 0 0 1.4em;
}

.news-detail__prose :deep(h2) {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 600;
  margin: 2em 0 0.8em;
  color: var(--color-on-surface);
}

.news-detail__prose :deep(h3) {
  font-family: var(--font-display);
  font-size: var(--text-lg, 1.125rem);
  font-weight: 600;
  margin: 1.6em 0 0.6em;
}

.news-detail__prose :deep(ul),
.news-detail__prose :deep(ol) {
  margin: 0 0 1.4em;
  padding-left: 1.4em;
}

.news-detail__prose :deep(li) {
  margin-bottom: 0.4em;
}

.news-detail__prose :deep(a) {
  color: var(--color-link);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.news-detail__prose :deep(img) {
  max-width: 100%;
  height: auto;
}

.news-detail__prose :deep(blockquote) {
  margin: 0 0 1.4em;
  padding-left: 1em;
  border-left: 3px solid var(--color-surface-low);
  color: var(--color-on-surface-muted);
}
</style>
