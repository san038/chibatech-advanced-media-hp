import type { CareerItem } from '~/types'

export const careerData: CareerItem[] = [
  {
    category: 'メディア・エンターテインメント',
    items: [
      '映像・音響エンジニア',
      'ゲーム開発者',
      'XR/VRコンテンツ開発',
      'デジタルアーティスト',
      '放送技術エンジニア',
    ],
  },
  {
    category: 'AI・データサイエンス',
    items: [
      'AI研究開発エンジニア',
      'データサイエンティスト',
      '機械学習エンジニア',
      '自然言語処理エンジニア',
      'AIプロダクトマネージャー',
    ],
  },
  {
    category: 'デザイン・クリエイティブ',
    items: [
      'UX/UIデザイナー',
      'インタラクションデザイナー',
      '情報アーキテクト',
      'サービスデザイナー',
      'クリエイティブディレクター',
    ],
  },
  {
    category: 'IT・システム開発',
    items: [
      'ソフトウェアエンジニア',
      'フロントエンドエンジニア',
      'バックエンドエンジニア',
      'クラウドエンジニア',
      'セキュリティエンジニア',
    ],
  },
  {
    category: '研究・アカデミア',
    items: [
      '大学院進学（修士・博士）',
      '研究機関・シンクタンク',
      '企業内研究所',
      '国立研究開発法人',
    ],
  },
]

export const industryStats = [
  { label: 'IT・通信', percentage: 38 },
  { label: 'メディア・クリエイティブ', percentage: 22 },
  { label: '製造・エレクトロニクス', percentage: 18 },
  { label: 'コンサルティング', percentage: 12 },
  { label: 'その他', percentage: 10 },
]

export const keyStats = [
  { value: '94%', label: '就職・進学率' },
  { value: '42%', label: 'IT業界就職率' },
  { value: '18%', label: '大学院進学率' },
  { value: '85+', label: '主要採用企業数' },
]
