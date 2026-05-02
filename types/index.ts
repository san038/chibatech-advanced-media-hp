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
  theme: string
  pillar: 'media' | 'knowledge' | 'design'
  keywords: string[]
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
