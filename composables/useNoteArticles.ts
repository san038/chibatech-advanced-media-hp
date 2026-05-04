import { joinURL } from 'ufo'
import type { NoteArticle } from '~/types'

export const useNoteArticles = () => {
  const config = useRuntimeConfig()
  // 開発: Nitro の /api/note。本番静的: ビルド前に生成した JSON（GitHub Pages では API ルートが無い）
  const url = import.meta.dev
    ? joinURL(config.app.baseURL, 'api/note')
    : joinURL(config.app.baseURL, 'data/note-articles.json')

  const { data, pending, error, refresh } = useFetch<NoteArticle[]>(url, {
    default: () => [] as NoteArticle[],
  })

  const articles = computed<NoteArticle[]>(() => data.value ?? [])

  return {
    articles,
    pending,
    error,
    refresh,
  }
}
