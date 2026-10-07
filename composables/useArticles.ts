import { computed, onMounted, ref } from "vue";
import type { ArticleItem } from "~/types";
import { siteData } from "~/src/siteData";

/**
 * 記事（note マガジンの RSS を WP が中継したもの）の取得。
 * 取得先の決め方は useNews と同じ（WP 配信時は restBase、dev は同一オリジン）。
 */
function articlesEndpoint(): string {
  const base = siteData().restBase || "/wp-json/cimd/v1/";
  return `${base.endsWith("/") ? base : `${base}/`}articles`;
}

/** 一覧（公開日の新しい順） */
export const useArticles = () => {
  const articles = ref<ArticleItem[]>([]);
  const pending = ref(true);
  const error = ref<unknown>(null);

  const refresh = async () => {
    pending.value = true;
    error.value = null;
    try {
      const res = await fetch(articlesEndpoint());
      if (!res.ok) throw new Error(`記事一覧の取得に失敗しました: HTTP ${res.status}`);
      const data = (await res.json()) as ArticleItem[];
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
    articles: computed<ArticleItem[]>(() => articles.value),
    pending,
    error,
    refresh,
  };
};

/** note マガジン本体の URL（「note でもっと見る」リンク用） */
export const noteMagazineUrl = (): string | null =>
  siteData().noteMagazineUrl ?? null;
