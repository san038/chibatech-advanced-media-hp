import type { CurriculumCourse, CurriculumYear } from '~/types'

const rq = (name: string): CurriculumCourse => ({ name, required: true })
const el = (name: string): CurriculumCourse => ({ name, required: false })

export const curriculumData: CurriculumYear[] = [
  {
    year: 1,
    label: '1年次',
    theme: '学びの土台を築き、体験的演習を通して仕組みを理解する。',
    tracks: [
      {
        id: 'basic',
        title: '専門基礎科目',
        courses: [
          rq('数学基礎'),
          rq('物理学基礎'),
          rq('確率統計'),
          rq('物理学実験'),
          rq('知能メディア基礎数学'),
          rq('線形代数'),
        ],
      },
      {
        id: 'core',
        title: '専門基幹科目',
        courses: [
          rq('知能メディア体験演習'),
          rq('視覚造形基礎'),
          rq('プログラミング言語基礎'),
          el('メディア史'),
        ],
      },
      {
        id: 'advanced',
        title: '専門展開科目',
        courses: [],
      },
    ],
  },
  {
    year: 2,
    label: '2年次',
    theme: 'メディア工学・知識工学・情報デザインの3領域の基礎科目に触れる。',
    tracks: [
      {
        id: 'basic',
        title: '専門基礎科目',
        courses: [el('離散数学'), el('統計解析')],
      },
      {
        id: 'core',
        title: '専門基幹科目',
        courses: [
          el('コンピュータ工学'),
          el('デジタルデザイン基礎演習'),
          el('ネットワーク基礎'),
          el('ヒューマンインタフェース論'),
          rq('情報理論'),
          rq('コミュニケーションデザイン演習'),
          rq('知能メディアプロジェクト1'),
          el('プログラミング言語応用'),
          el('デジタルファブリケーション'),
          el('メディアデザイン論'),
          rq('メディア基礎'),
          rq('知能メディアプロジェクト2'),
        ],
      },
      {
        id: 'advanced',
        title: '専門展開科目',
        courses: [rq('人工知能基礎'), rq('情報デザイン基礎')],
      },
    ],
  },
  {
    year: 3,
    label: '3年次',
    theme: '3領域の発展科目を通じて専門の興味関心を見定め、研究室配属へつなげる。',
    tracks: [
      {
        id: 'basic',
        title: '専門基礎科目',
        courses: [],
      },
      {
        id: 'core',
        title: '専門基幹科目',
        courses: [rq('人間中心設計'), el('技術者倫理')],
      },
      {
        id: 'advanced',
        title: '専門展開科目',
        courses: [
          rq('メディア工学実験'),
          el('音響工学基礎'),
          el('画像処理基礎'),
          el('音声工学'),
          el('知識工学'),
          el('機械学習'),
          el('情報デザイン概論及び演習'),
          el('テクノロジーアート'),
          el('マルチエージェントシステム'),
          el('音響工学応用'),
          el('画像処理応用'),
          rq('ネットワーク・データ工学実験'),
          el('データマイニング'),
          el('データベース工学'),
          el('デザインプロジェクト設計'),
          el('情報デザイン応用理論及び演習'),
          el('フィジカルインタフェース'),
          el('知能メディアチャレンジ'),
          rq('ゼミナール1'),
        ],
      },
    ],
  },
  {
    year: 4,
    label: '4年次',
    theme: '3領域の知識・技術を卒業研究で統合する。',
    footnote: '※卒業研究は通年で履修します。',
    tracks: [
      {
        id: 'basic',
        title: '専門基礎科目',
        courses: [],
      },
      {
        id: 'core',
        title: '専門基幹科目',
        courses: [],
      },
      {
        id: 'advanced',
        title: '専門展開科目',
        courses: [
          el('バーチャルリアリティ'),
          el('知能工学応用'),
          el('ユーザエクスペリエンスデザイン'),
          rq('ゼミナール2'),
          rq('卒業研究'),
          rq('ゼミナール3'),
        ],
      },
    ],
  },
]

/** パンフレット「注目の研究」に掲載のテーマ例（卒業研究周辺の補足） */
export const curriculumResearchHighlights: string[] = [
  '製品コンセプト開発・ユーザエクスペリエンスデザイン',
  '音響工学',
  '応用無線システムを活用した新たな知的サービス',
  '音声生成・音響シミュレーション',
  '静止画・動画像の処理・符号化・生成',
  '人間とICTの創造的協働',
  'インタフェースデザイン・Webデザイン・可視化',
  'コミュニケーションデザイン・学習デザイン など',
]
