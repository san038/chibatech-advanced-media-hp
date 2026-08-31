// Nuxt の useSeoMeta の最小互換（title / description / og:*）。
// SPA なので setup 実行時に即 document へ反映する。
interface SeoMeta {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
}

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  const selector = `meta[${attr}="${key}"]`;
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

export function useSeoMeta(meta: SeoMeta) {
  if (typeof document === "undefined") return;
  if (meta.title) document.title = meta.title;
  if (meta.description)
    upsertMeta("name", "description", meta.description);
  if (meta.ogTitle) upsertMeta("property", "og:title", meta.ogTitle);
  if (meta.ogDescription)
    upsertMeta("property", "og:description", meta.ogDescription);
  if (meta.ogType) upsertMeta("property", "og:type", meta.ogType);
}
