import { XMLParser } from 'fast-xml-parser'
import type { NoteArticle } from '~/types'

// Replace with actual note.com RSS URL for your organization
const NOTE_RSS_URL = 'https://note.com/chitechime/rss'

// Simple in-memory cache
let cachedArticles: NoteArticle[] | null = null
let cacheTimestamp = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export default defineEventHandler(async (): Promise<NoteArticle[]> => {
  const now = Date.now()

  // Return cached result if still valid
  if (cachedArticles && now - cacheTimestamp < CACHE_TTL) {
    return cachedArticles
  }

  try {
    const xml = await $fetch<string>(NOTE_RSS_URL, {
      responseType: 'text',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ChitechIME/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
    })

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
    })

    const parsed = parser.parse(xml) as {
      rss?: {
        channel?: {
          item?: Array<{
            title?: string
            link?: string
            pubDate?: string
            description?: string
          }>
        }
      }
    }

    const items = parsed?.rss?.channel?.item ?? []

    const articles: NoteArticle[] = items.slice(0, 20).map((item) => ({
      title: String(item.title ?? ''),
      link: String(item.link ?? ''),
      pubDate: String(item.pubDate ?? ''),
      description: item.description ? String(item.description).replace(/<[^>]*>/g, '').slice(0, 160) : undefined,
    }))

    // Update cache
    cachedArticles = articles
    cacheTimestamp = now

    return articles
  } catch (error) {
    console.error('[note.ts] Failed to fetch RSS feed:', error)

    // Return cached data even if expired, better than nothing
    if (cachedArticles) {
      return cachedArticles
    }

    return []
  }
})
