export type NoteArticle = {
  title: string
  link: string
  pubDate: string
  description?: string
}

export type Course = {
  id: 'media' | 'knowledge' | 'design'
  name: string
  nameEn: string
  tagline: string
  description: string
  color: string
  bgClass: string
}

export type Laboratory = {
  id: string
  name: string
  professor: string
  /** 一覧プレビュー等で教授名の下に表示する専門・テーマの一行 */
  focus: string
  theme: string
  pillar: 'media' | 'knowledge' | 'design'
  keywords: string[]
  /** ゼミ公式サイト等（プレースホルダー可） */
  seminarUrl: string
  /** 一覧カード左の画像URL（未設定時は領域色のプレースホルダー） */
  imageSrc?: string | null
}

export type CareerItem = {
  category: string
  items: string[]
}

export type CurriculumSubject = {
  name: string
  type: 'lecture' | 'workshop' | 'project' | 'seminar'
}

export type CurriculumYear = {
  year: 1 | 2 | 3 | 4
  label: string
  theme: string
  subjects: CurriculumSubject[]
}
