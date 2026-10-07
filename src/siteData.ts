import type {
  CareerItem,
  CourseKeywords,
  CurriculumYear,
  HeroKeyword,
  Laboratory,
} from "~/types";

/** WP テーマが編集したコンテンツ（未設定のキーは SPA 側のデフォルトにフォールバック） */
export interface SiteContent {
  labs?: Laboratory[];
  curriculum?: CurriculumYear[];
  careerPaths?: CareerItem[];
  industryStats?: { label: string; percentage: number }[];
  keyStats?: { value: string; label: string }[];
  /** ヒーロー背景の浮遊キーワード */
  heroKeywords?: HeroKeyword[];
  /** コース紹介の領域別キーワード */
  courseKeywords?: CourseKeywords;
}

/** functions.php が window.__SITE_DATA__ に流し込むデータ */
export interface SiteData {
  assetsBase?: string;
  routerBase?: string;
  newsEndpoint?: string;
  restBase?: string;
  restNonce?: string;
  /** 記事として取り込む note マガジンの URL（未設定なら null） */
  noteMagazineUrl?: string | null;
  content?: SiteContent;
}

export function siteData(): SiteData {
  if (typeof window === "undefined") return {};
  return (
    (window as unknown as { __SITE_DATA__?: SiteData }).__SITE_DATA__ ?? {}
  );
}
