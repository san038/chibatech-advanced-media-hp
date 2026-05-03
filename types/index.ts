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

/** カリキュラム表の1科目（■＝必修） */
export type CurriculumCourse = {
  name: string
  /** 必修科目（履修の手引・カリキュラムマップの■） */
  required: boolean
}

/** 専門基礎・専門基幹・専門展開のいずれかの列 */
export type CurriculumTrack = {
  id: 'basic' | 'core' | 'advanced'
  title: string
  /** 当該年次・科目群に属する科目（表の並び順を維持） */
  courses: CurriculumCourse[]
}

export type CurriculumYear = {
  year: 1 | 2 | 3 | 4
  label: string
  theme: string
  tracks: CurriculumTrack[]
  /** 年次ブロック下に表示する注記（任意） */
  footnote?: string
}
