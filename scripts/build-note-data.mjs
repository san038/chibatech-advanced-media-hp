/**
 * 静的ホスティング用: note RSS を取得して public/data/note-articles.json を書き出す。
 * server/api/note.ts と同じ URL・同じ形の JSON（NoteArticle[]）に揃える。
 */
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { XMLParser } from 'fast-xml-parser'

const NOTE_RSS_URL = 'https://note.com/sannnomiya/rss'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outFile = join(root, 'public', 'data', 'note-articles.json')

async function main() {
  const xml = await fetch(NOTE_RSS_URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; ChitechIME/1.0)',
      Accept: 'application/rss+xml, application/xml, text/xml',
    },
  }).then((r) => {
    if (!r.ok) throw new Error(`RSS HTTP ${r.status}`)
    return r.text()
  })

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '@_',
  })

  const parsed = parser.parse(xml)
  const items = parsed?.rss?.channel?.item ?? []
  const list = Array.isArray(items) ? items : [items]

  const articles = list.slice(0, 20).map((item) => ({
    title: String(item.title ?? ''),
    link: String(item.link ?? ''),
    pubDate: String(item.pubDate ?? ''),
    description: item.description
      ? String(item.description).replace(/<[^>]*>/g, '').slice(0, 160)
      : undefined,
  }))

  await mkdir(dirname(outFile), { recursive: true })
  await writeFile(outFile, JSON.stringify(articles), 'utf8')
  console.log(`[build-note-data] wrote ${articles.length} articles → ${outFile}`)
}

main().catch((e) => {
  console.error('[build-note-data]', e)
  process.exit(1)
})
