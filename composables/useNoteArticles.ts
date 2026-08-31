import { computed, onMounted, ref } from "vue";
import type { NoteArticle } from "~/types";

/**
 * ニュース記事の取得。
 * - 既定: `<base>data/note-articles.json`（ビルド前に scripts/build-note-data.mjs が生成）
 * - WP テーマ時: window.__SITE_DATA__.newsEndpoint（WP REST）を優先
 */
function resolveEndpoint(): string {
  const injected =
    typeof window !== "undefined"
      ? (window as unknown as { __SITE_DATA__?: { newsEndpoint?: string } })
          .__SITE_DATA__?.newsEndpoint
      : undefined;
  if (injected) return injected;
  const base = import.meta.env.BASE_URL || "/";
  return `${base.endsWith("/") ? base : `${base}/`}data/note-articles.json`;
}

export const useNoteArticles = () => {
  const articles = ref<NoteArticle[]>([]);
  const pending = ref(true);
  const error = ref<unknown>(null);

  const refresh = async () => {
    pending.value = true;
    error.value = null;
    try {
      const res = await fetch(resolveEndpoint());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as NoteArticle[];
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
    articles: computed<NoteArticle[]>(() => articles.value),
    pending,
    error,
    refresh,
  };
};
