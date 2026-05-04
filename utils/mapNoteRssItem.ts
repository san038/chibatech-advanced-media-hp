import type { NoteArticle } from '~/types'

/** RSS の `media:thumbnail` や `#text` 入りオブジェクトから URL を取り出す */
function textFromRssValue(val: unknown): string | undefined {
  if (typeof val === 'string' && val.trim()) return val.trim()
  if (val && typeof val === 'object') {
    const o = val as Record<string, unknown>
    if (typeof o['#text'] === 'string' && o['#text'].trim()) return o['#text'].trim()
    if (typeof o['@_url'] === 'string' && o['@_url'].trim()) return o['@_url'].trim()
  }
  return undefined
}

/**
 * note RSS の item から表示用画像 URL を推定する。
 * 優先: media:thumbnail（アイキャッチ）→ description 内の最初の img → note:creatorImage
 */
export function pickNoteArticleImage(item: Record<string, unknown>): string | undefined {
  const thumb = textFromRssValue(item['media:thumbnail'])
  if (thumb) return thumb

  const desc = String(item.description ?? '')
  const imgMatch = desc.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imgMatch?.[1]?.trim()) return imgMatch[1].trim()

  const creator = textFromRssValue(item['note:creatorImage'])
  if (creator) return creator

  return undefined
}

export function mapRssItemToNoteArticle(item: unknown): NoteArticle {
  const raw = item as Record<string, unknown>
  return {
    title: String(raw.title ?? ''),
    link: String(raw.link ?? ''),
    pubDate: String(raw.pubDate ?? ''),
    description: raw.description
      ? String(raw.description).replace(/<[^>]*>/g, '').slice(0, 160)
      : undefined,
    imageUrl: pickNoteArticleImage(raw),
  }
}
