/**
 * `public/`（ビルド後は配信ルート）以下のパスにベースURLを付与。
 * - 既定: import.meta.env.BASE_URL
 * - WP テーマ時: window.__SITE_DATA__.assetsBase（テーマの dist ディレクトリ等）
 */
export function usePublicPath() {
  const injected =
    typeof window !== "undefined"
      ? (window as unknown as { __SITE_DATA__?: { assetsBase?: string } })
          .__SITE_DATA__?.assetsBase
      : undefined;
  const base = injected || import.meta.env.BASE_URL || "/";
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return (path: string) => normalized + path.replace(/^\//, "");
}
