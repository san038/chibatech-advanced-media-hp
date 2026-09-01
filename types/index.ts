/** ヒーロー背景（HeroFoamBg）の浮遊キーワード 1 語 */
export type HeroKeyword = {
  text: string
  /** どの領域の核に集まるか（1つ以上） */
  domains: ('media' | 'knowledge' | 'design')[]
}

/** コース紹介スクロリー（CourseScrolly）の領域別キーワード */
export type CourseKeywords = Partial<
  Record<'media' | 'knowledge' | 'design', string[]>
>

/** ニュース一覧の 1 件（WP 投稿）。REST: GET /wp-json/cimd/v1/news */
export type NewsItem = {
  slug: string
  title: string
  /** ISO 8601（公開日） */
  date: string
  excerpt?: string
  /** アイキャッチ画像 URL（未設定なら undefined/null） */
  imageUrl?: string | null
}

/** ニュース詳細（本文 HTML 込み）。REST: GET /wp-json/cimd/v1/news/{slug} */
export type NewsArticle = NewsItem & {
  /** the_content フィルタ適用済みの HTML */
  content: string
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

/** 研究室ページ下部「研究紹介」に並べるトピック（1件＝小カード） */
export type LabTopic = {
  title: string
  desc: string
  /** 詳細・外部リンク（任意） */
  url?: string
  /** サムネイル画像URL（未設定時は領域色プレースホルダー） */
  imageSrc?: string | null
}

export type Laboratory = {
  id: string
  name: string
  professor: string
  /** 研究室名の下に添える専門・テーマの一行 */
  focus: string
  theme: string
  pillar: 'media' | 'knowledge' | 'design'
  keywords: string[]
  /** ゼミ公式サイト等（プレースホルダー可） */
  seminarUrl: string
  /** 一覧カード左の画像URL（未設定時は領域色のプレースホルダー） */
  imageSrc?: string | null
  /** 「研究紹介」トピック（後から追加。未設定時はセクション非表示） */
  topics?: LabTopic[]
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
