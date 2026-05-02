import type { CurriculumYear } from '~/types'

export const curriculumData: CurriculumYear[] = [
  {
    year: 1,
    label: '1年次',
    theme: '基礎を広く、深く。',
    subjects: [
      { name: 'メディア工学概論', type: 'lecture' },
      { name: '知識工学概論', type: 'lecture' },
      { name: '情報デザイン概論', type: 'lecture' },
      { name: 'プログラミング基礎', type: 'workshop' },
      { name: '線形代数学', type: 'lecture' },
      { name: '確率・統計', type: 'lecture' },
      { name: 'デザイン思考入門', type: 'workshop' },
      { name: '情報リテラシー', type: 'lecture' },
    ],
  },
  {
    year: 2,
    label: '2年次',
    theme: '3つの柱を探索する。',
    subjects: [
      { name: '音響信号処理', type: 'lecture' },
      { name: '映像メディア工学', type: 'lecture' },
      { name: '機械学習基礎', type: 'lecture' },
      { name: 'データ構造とアルゴリズム', type: 'lecture' },
      { name: 'インタラクションデザイン', type: 'workshop' },
      { name: 'タイポグラフィ・レイアウト', type: 'workshop' },
      { name: 'ネットワーク基礎', type: 'lecture' },
      { name: 'メディア制作実習 I', type: 'project' },
    ],
  },
  {
    year: 3,
    label: '3年次',
    theme: '専門を深め、統合する。',
    subjects: [
      { name: '深層学習応用', type: 'lecture' },
      { name: '自然言語処理', type: 'lecture' },
      { name: 'XR技術演習', type: 'workshop' },
      { name: '知識グラフ工学', type: 'lecture' },
      { name: 'UXリサーチ手法', type: 'workshop' },
      { name: 'データビジュアライゼーション', type: 'workshop' },
      { name: 'メディア制作実習 II', type: 'project' },
      { name: '研究室配属セミナー', type: 'seminar' },
    ],
  },
  {
    year: 4,
    label: '4年次',
    theme: '創造し、社会へ問う。',
    subjects: [
      { name: '卒業研究', type: 'project' },
      { name: '研究発表演習', type: 'seminar' },
      { name: '産学連携プロジェクト', type: 'project' },
      { name: '特別講義（業界招聘）', type: 'lecture' },
      { name: 'インターンシップ（選択）', type: 'project' },
    ],
  },
]
