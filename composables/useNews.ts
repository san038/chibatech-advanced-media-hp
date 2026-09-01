import {
  computed,
  onMounted,
  ref,
  toValue,
  watch,
  type MaybeRefOrGetter,
} from "vue";
import type { NewsArticle, NewsItem } from "~/types";

/**
 * ニュース（WordPress 投稿）の取得。
 * - WP テーマ配信時: window.__SITE_DATA__.restBase（cimd/v1/）を優先
 * - それ以外（npm run dev）: 同一オリジンの /wp-json/cimd/v1/ を叩く
 */
function restBase(): string {
  const injected =
    typeof window !== "undefined"
      ? (window as unknown as { __SITE_DATA__?: { restBase?: string } })
          .__SITE_DATA__?.restBase
      : undefined;
  const base = injected || "/wp-json/cimd/v1/";
  return base.endsWith("/") ? base : `${base}/`;
}

/** 一覧 */
export const useNews = () => {
  const articles = ref<NewsItem[]>([]);
  const pending = ref(true);
  const error = ref<unknown>(null);

  const refresh = async () => {
    pending.value = true;
    error.value = null;
    try {
      const res = await fetch(`${restBase()}news`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as NewsItem[];
      articles.value = Array.isArray(data) ? data : [];
    } catch (e) {
      error.value = e;
      articles.value = [];
    } finally {
      pending.value = false;
    }
  };

  onMounted(refresh);

  return {
    articles: computed<NewsItem[]>(() => articles.value),
    pending,
    error,
    refresh,
  };
};

/** 詳細（slug は Ref / getter を渡すとルート変更に追従する） */
export const useNewsArticle = (slug: MaybeRefOrGetter<string>) => {
  const article = ref<NewsArticle | null>(null);
  const pending = ref(true);
  const error = ref<unknown>(null);
  const notFound = ref(false);

  const refresh = async () => {
    pending.value = true;
    error.value = null;
    notFound.value = false;
    article.value = null;
    const current = toValue(slug);
    try {
      const res = await fetch(`${restBase()}news/${encodeURIComponent(current)}`);
      if (res.status === 404) {
        notFound.value = true;
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      article.value = (await res.json()) as NewsArticle;
    } catch (e) {
      error.value = e;
    } finally {
      pending.value = false;
    }
  };

  onMounted(refresh);
  watch(() => toValue(slug), refresh);

  return {
    article: computed<NewsArticle | null>(() => article.value),
    pending,
    error,
    notFound,
    refresh,
  };
};
