<template>
  <a
    :href="article.url"
    class="article-card"
    target="_blank"
    rel="noopener"
  >
    <div class="article-card__thumb-wrap" aria-hidden="true">
      <img
        v-if="article.imageUrl"
        class="article-card__thumb"
        :src="article.imageUrl"
        alt=""
        width="400"
        height="210"
        loading="lazy"
        decoding="async"
      >
      <span v-else class="article-card__thumb-fallback">note</span>
    </div>
    <div class="article-card__body">
      <time class="article-card__date" :datetime="dateIso">{{ dateLabel }}</time>
      <h3 class="article-card__title">{{ article.title }}</h3>
      <p v-if="showExcerpt && article.excerpt" class="article-card__desc">
        {{ article.excerpt }}
      </p>
      <p class="article-card__meta">
        <span v-if="article.author" class="article-card__author">{{ article.author }}</span>
        <span class="article-card__source">note で読む ↗</span>
      </p>
    </div>
  </a>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { ArticleItem } from "~/types";

const props = withDefaults(
  defineProps<{ article: ArticleItem; showExcerpt?: boolean }>(),
  { showExcerpt: false },
);

const parsed = computed(() => {
  const d = new Date(props.article.date);
  return Number.isNaN(d.getTime()) ? null : d;
});

// ニュースと揃えて YYYY.MM.DD
const dateLabel = computed(() => {
  const d = parsed.value;
  if (!d) return "";
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}.${m}.${day}`;
});

const dateIso = computed(() =>
  parsed.value ? parsed.value.toISOString().split("T")[0] : "",
);
</script>

<style scoped>
.article-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  text-decoration: none;
  color: inherit;
}

.article-card__thumb-wrap {
  position: relative;
  /* note の見出し画像は 1280x670（≒1.91:1） */
  aspect-ratio: 1.91 / 1;
  overflow: hidden;
  background: var(--color-surface-low);
  outline: 1px solid var(--color-line-subtle);
  outline-offset: -1px;
}

.article-card__thumb {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 400ms ease;
}

.article-card:hover .article-card__thumb {
  transform: scale(1.03);
}

.article-card__thumb-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-on-surface-faint);
  background: var(--color-surface-low);
}

.article-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 0;
}

.article-card__date {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-on-surface-faint);
  letter-spacing: 0.06em;
}

.article-card__title {
  font-family: var(--font-jp);
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-on-surface);
  line-height: 1.45;
  letter-spacing: -0.01em;
  transition: color 200ms ease;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card:hover .article-card__title {
  color: var(--color-link);
}

.article-card__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  line-height: 1.7;

  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-card__meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 0.25rem var(--space-sm);
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--color-on-surface-faint);
  letter-spacing: 0.06em;
}

.article-card__source {
  color: var(--color-accent);
}

.article-card:hover .article-card__source {
  color: var(--color-link);
}
</style>
