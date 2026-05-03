import type { Laboratory } from '~/types'

export const laboratories: Laboratory[] = [
  {
    id: 'concept-design',
    name: 'コンセプトデザイン研究室',
    professor: '安藤 昌也 教授',
    focus: 'コンセプトデザインと評価',
    theme:
      'コンセプトデザインと評価に関する研究。体験やサービスの価値を言語化・可視化し、設計プロセスと評価の枠組みを構築する。',
    pillar: 'design',
    keywords: ['コンセプトデザイン', '評価', '体験設計'],
  },
  {
    id: 'spatial-audio',
    name: '空間音響研究室',
    professor: '飯田 一博 教授',
    focus: '空間音響・3D音響',
    theme:
      '空間音響および3D音響に関する研究。聴取空間の再現・計測と、没入型音響環境の構築を通じたメディア表現の拡張。',
    pillar: 'media',
    keywords: ['空間音響', '3D音響', '聴覚ディスプレイ'],
  },
  {
    id: 'codesign-social',
    name: '共同デザイン・社会的デザイン研究室',
    professor: '小早川 真衣子 教授',
    focus: '共同デザイン・社会的デザイン',
    theme:
      'ステークホルダーと協働する共同デザイン、および社会課題に向き合う社会的デザインの理論と実践的研究。',
    pillar: 'design',
    keywords: ['共同デザイン', '社会的デザイン', '参加型設計'],
  },
  {
    id: 'applied-intelligence',
    name: '応用知能システム研究室',
    professor: '今野 将 教授',
    focus: '応用知能システム',
    theme:
      '知能アルゴリズムの実社会への適用に関する研究。認識・推論・学習を統合したシステム設計と評価。',
    pillar: 'knowledge',
    keywords: ['知能システム', '機械学習', '応用AI'],
  },
  {
    id: 'voice-acoustic-simulation',
    name: '音声・音響シミュレーション研究室',
    professor: '竹本 浩典 教授',
    focus: '音声生成・音響シミュレーション',
    theme:
      '音声生成技術と音響シミュレーションに関する研究。物理モデルと信号処理を融合した音の合成と空間再現。',
    pillar: 'media',
    keywords: ['音声生成', '音響シミュレーション', '信号処理'],
  },
  {
    id: 'communication-design',
    name: 'コミュニケーションデザイン研究室',
    professor: '田邉 里奈 教授',
    focus: 'コミュニケーションデザイン',
    theme:
      '人と人、組織、社会をつなぐコミュニケーションの設計に関する研究。対話・可視化・メディアを横断したデザイン。',
    pillar: 'design',
    keywords: ['コミュニケーション', '情報デザイン', '対話'],
  },
  {
    id: 'multimodal-interface',
    name: 'マルチモーダルインタフェース研究室',
    professor: '苣木 禎史 教授',
    focus: 'マルチモーダルインタフェース',
    theme:
      '視覚・聴覚・触覚など複数モダリティを統合したインタフェースに関する研究。自然な人間—計算機対話の実現。',
    pillar: 'media',
    keywords: ['マルチモーダル', 'インタフェース', 'ヒューマンインタラクション'],
  },
  {
    id: 'screen-structure-viz',
    name: '画面設計・構造可視化研究室',
    professor: '中本 和宏 准教授',
    focus: '画面設計・構造の可視化',
    theme:
      'ユーザーインタフェースの画面設計と、ソフトウェア構造の可視化に関する研究。理解しやすい表現と設計支援。',
    pillar: 'design',
    keywords: ['画面設計', '可視化', 'UI'],
  },
  {
    id: 'behavior-recognition',
    name: '行動認識研究室',
    professor: '細田 真道 教授',
    focus: '行動認識・フィードバック',
    theme:
      '人間行動の認識と、それに基づくフィードバック生成に関する研究。センシングとインタラクションの閉ループ設計。',
    pillar: 'media',
    keywords: ['行動認識', 'フィードバック', 'センシング'],
  },
  {
    id: 'image-video-processing',
    name: '画像・映像処理研究室',
    professor: '宮田 高道 教授',
    focus: '画像・映像の処理と伝送',
    theme:
      '画像・映像の処理アルゴリズムと伝送技術に関する研究。圧縮、品質向上、リアルタイム配信を含むメディア基盤。',
    pillar: 'media',
    keywords: ['画像処理', '映像伝送', '符号化'],
  },
  {
    id: 'human-centered-information',
    name: '人間中心情報処理研究室',
    professor: '森 信一郎 教授',
    focus: '人を中心とした情報処理技術',
    theme:
      '人間の認知・行動特性を踏まえた情報処理技術に関する研究。使いやすさと信頼性を両立するシステム設計。',
    pillar: 'knowledge',
    keywords: ['人間中心設計', '情報処理', 'HCI'],
  },
]
