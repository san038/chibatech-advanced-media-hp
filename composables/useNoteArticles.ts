import type { NoteArticle } from '~/types'

export const useNoteArticles = () => {
  const { data, pending, error, refresh } = useFetch<NoteArticle[]>('/api/note', {
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
