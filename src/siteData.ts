import type { CareerItem, CurriculumYear, Laboratory } from "~/types";

/** WP テーマが編集したコンテンツ（未設定のキーは SPA 側のデフォルトにフォールバック） */
export interface SiteContent {
  labs?: Laboratory[];
  curriculum?: CurriculumYear[];
  careerPaths?: CareerItem[];
  industryStats?: { label: string; percentage: number }[];
  keyStats?: { value: string; label: string }[];
}

/** functions.php が window.__SITE_DATA__ に流し込むデータ */
export interface SiteData {
  assetsBase?: string;
  routerBase?: string;
  newsEndpoint?: string;
  restBase?: string;
  restNonce?: string;
  content?: SiteContent;
}

export function siteData(): SiteData {
  if (typeof window === "undefined") return {};
  return (
    (window as unknown as { __SITE_DATA__?: SiteData }).__SITE_DATA__ ?? {}
  );
}
