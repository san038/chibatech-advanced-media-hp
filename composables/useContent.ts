import { careerData, industryStats, keyStats } from "~/data/career";
import { curriculumData } from "~/data/curriculum";
import { laboratories } from "~/data/laboratories";
import { siteData } from "~/src/siteData";

// WP 提供のコンテンツ（あれば）を、SPA 同梱のデフォルトに上書きする。
// キーが未設定 or 空配列ならデフォルトのまま = 現状と同じ表示。
function build() {
  const wp = siteData().content ?? {};
  const has = <T>(v: T[] | undefined): v is T[] => Array.isArray(v) && v.length > 0;
  return {
    labs: has(wp.labs) ? wp.labs : laboratories,
    curriculum: has(wp.curriculum) ? wp.curriculum : curriculumData,
    careerPaths: has(wp.careerPaths) ? wp.careerPaths : careerData,
    industryStats: has(wp.industryStats) ? wp.industryStats : industryStats,
    keyStats: has(wp.keyStats) ? wp.keyStats : keyStats,
    // 既定値はコンポーネント側が持つ。null = 各コンポーネントのデフォルトを使う。
    heroKeywords: has(wp.heroKeywords) ? wp.heroKeywords : null,
    courseKeywords: wp.courseKeywords ?? null,
  };
}

let cached: ReturnType<typeof build> | null = null;

export function useContent() {
  if (!cached) cached = build();
  return cached;
}
