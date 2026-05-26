<template>
  <div ref="containerRef" class="diagram-3d" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /** false になるまでキーワードハイライト循環を開始しない */
    deferHighlight?: boolean;
  }>(),
  { deferHighlight: false },
);

const containerRef = ref<HTMLDivElement | null>(null);
let disposeFn: (() => void) | null = null;

// ── Types & constants ─────────────────────────────────────────────────────────
type Domain =
  | "media"
  | "knowledge"
  | "design"
  | "media-knowledge"
  | "media-design"
  | "all";

const DEPARTMENT_CSS = "#3bbac6";
const DEPARTMENT_HEX = 0x3bbac6;

const DOMAIN_CSS: Record<Domain, string> = {
  media: "#a30a61",
  knowledge: "#007d3b",
  design: "#00549f",
  "media-knowledge": "#7a7574",
  "media-design": "#7a7574",
  all: DEPARTMENT_CSS,
};
const DOMAIN_HEX: Record<Domain, number> = {
  media: 0xa30a61,
  knowledge: 0x007d3b,
  design: 0x00549f,
  "media-knowledge": 0x7a7574,
  "media-design": 0x7a7574,
  all: DEPARTMENT_HEX,
};

const CENTER_LABEL_TEXT = "知能メディア工学科";
const CENTER_HUB_R = 0.78;
/** 周辺リングの半径（XZ・360° ランダム配置） */
const KEYWORD_RING_R_MIN = 2.7;
const KEYWORD_RING_R_MAX = 3.95;
/** ハイライト合体点（画面中央 XZ） */
const MERGE_POINT_Y = 0.42;
/** 周辺キーワードの見た目（奥行きばらつき） */
const LABEL_SCALE_BASE = 0.72;
const LABEL_SCALE_VAR = 0.28;
const LABEL_OPACITY_BASE = 0.42;
const LABEL_OPACITY_VAR = 0.38;
const LABEL_OPACITY_PEAK = 0.88;
/** ふよふよ漂い */
const FLOAT_AMP = 0.14;
const FLOAT_AMP_Y = 0.05;
const FLOAT_SPEED = 0.28;
const DIAGRAM_WHITE_CSS = "#ffffff";
/** Y 階層: キーワード < 領域ラベル < 中心 */
const TIER_KEYWORD_LABEL_Y = 0.06;
const TIER_CENTER_DISK_Y = 0.1;
const CENTER_HUB_WALL_H = 0.14;
const CENTER_LABEL_FONT_PX = 22;
const CENTER_LABEL_CHAR_PLANE_H = 0.28;
/** 学科ラベルより合成ワードをどれだけ上（ワールド Y）に置くか */
const COIN_LABEL_OFFSET_ABOVE_TITLE = 0.9;
/** ラベル平面の高さ（ワールド単位） */
const LABEL_PLANE_H = 0.62;
/** ラベル Canvas のフォントサイズ（px）— 平面サイズに合わせて調整 */
const LABEL_FONT_PX = 42;
/** ラベル平面の高さ（ワールド単位） */
const LABEL_PLANE_H_KW = 0.76;
/** 真上投影（Orthographic）の表示範囲（ワールド単位・高さ） */
const ORTHO_VIEW_HEIGHT = 9.5;
const LABEL_OPACITY_ACTIVE = 1;
/** ハイライト時の手前スケール */
const LABEL_SCALE_HIGHLIGHT = 1.22;

// アニメーションタイミング
/** 周辺 → 中央へ一直線で合体する時間 */
const HIGHLIGHT_TO_CENTER_MS = 1100;
const HIGHLIGHT_PATH_MS = HIGHLIGHT_TO_CENTER_MS;
const COIN_POP_MS = 450;
/** 合成ワード表示直後のワンショット・グリッチ時間 */
const COIN_GLITCH_MS = 220;
/** 合成ワードを不透明度100%で表示し続ける時間（読み取り用） */
const COIN_HOLD_MS = 5000;
const COIN_FADE_MS = 1200;
/** 合成ワードの下からスライドイン距離（px） */
const COIN_SLIDE_IN_PX = 28;
/** 合成ワード消去後、周辺の元位置でキーワードをフェードインする時間 */
const HIGHLIGHT_KEYWORD_FADE_IN_MS = 700;
const HIGHLIGHT_PAUSE_MS = 250;

// ── Keyword data ───────────────────────────────────────────────────────────────
interface KeywordSegment {
  text: string;
  role: string;
}

interface Keyword3D {
  id: string;
  label: string;
  angleDeg: number;
  domain: Domain;
  segments: KeywordSegment[];
}

function equalArcDots(fromDeg: number, toDeg: number, count: number): number[] {
  const span = toDeg - fromDeg;
  const gap = span / (count + 1);
  return Array.from({ length: count }, (_, i) => fromDeg + gap * (i + 1));
}
const angDesignToKnowledge = equalArcDots(30, 150, 16);
const angKnowledgeToMedia = equalArcDots(150, 270, 14);
const angMediaToDesign = equalArcDots(-90, 30, 15);

type HubKey = "design" | "knowledge" | "media";

/** 3領域の120°扇形（DomainDiagram の angMediaToDesign / angDesignToKnowledge / angKnowledgeToMedia） */
const DOMAIN_SECTORS: {
  key: HubKey;
  label: string;
  startDeg: number;
  endDeg: number;
  arcCenterDeg: number;
  hex: number;
  css: string;
}[] = [
  {
    key: "design",
    label: "情報デザイン",
    startDeg: -90,
    endDeg: 30,
    arcCenterDeg: -30,
    hex: DOMAIN_HEX.design,
    css: DOMAIN_CSS.design,
  },
  {
    key: "knowledge",
    label: "知能工学",
    startDeg: 30,
    endDeg: 150,
    arcCenterDeg: 90,
    hex: DOMAIN_HEX.knowledge,
    css: DOMAIN_CSS.knowledge,
  },
  {
    key: "media",
    label: "メディア工学",
    startDeg: 150,
    endDeg: 270,
    arcCenterDeg: 210,
    hex: DOMAIN_HEX.media,
    css: DOMAIN_CSS.media,
  },
];

const keywords: Keyword3D[] = [
  // MEDIA
  {
    id: "m1",
    label: "３D音響",
    angleDeg: angKnowledgeToMedia[5]!,
    domain: "media",
    segments: [
      { text: "3D", role: "modifier" },
      { text: "音響", role: "subject" },
    ],
  },
  {
    id: "m2",
    label: "音場シミュレーション",
    angleDeg: angKnowledgeToMedia[6]!,
    domain: "media",
    segments: [
      { text: "音場", role: "subject" },
      { text: "シミュレーション", role: "method" },
    ],
  },
  {
    id: "m3",
    label: "音声伝達",
    angleDeg: angKnowledgeToMedia[7]!,
    domain: "media",
    segments: [
      { text: "音声", role: "subject" },
      { text: "伝達", role: "method" },
    ],
  },
  {
    id: "m4",
    label: "話者認識",
    angleDeg: angKnowledgeToMedia[8]!,
    domain: "media",
    segments: [
      { text: "話者", role: "subject" },
      { text: "認識", role: "method" },
    ],
  },
  {
    id: "m5",
    label: "歌声合成",
    angleDeg: angKnowledgeToMedia[9]!,
    domain: "media",
    segments: [
      { text: "歌声", role: "subject" },
      { text: "合成", role: "method" },
    ],
  },
  {
    id: "m6",
    label: "画像/映像処理",
    angleDeg: angKnowledgeToMedia[10]!,
    domain: "media",
    segments: [
      { text: "画像", role: "subject" },
      { text: "映像", role: "subject" },
      { text: "処理", role: "method" },
    ],
  },
  {
    id: "m7",
    label: "画像/映像合成",
    angleDeg: angKnowledgeToMedia[11]!,
    domain: "media",
    segments: [
      { text: "画像", role: "subject" },
      { text: "映像", role: "subject" },
      { text: "合成", role: "method" },
    ],
  },
  {
    id: "m8",
    label: "画像/映像符号化と伝送",
    angleDeg: angKnowledgeToMedia[12]!,
    domain: "media",
    segments: [
      { text: "画像", role: "subject" },
      { text: "映像", role: "subject" },
      { text: "符号化", role: "method" },
      { text: "伝送", role: "method" },
    ],
  },
  {
    id: "m9",
    label: "バーチャルリアリティ",
    angleDeg: angKnowledgeToMedia[13]!,
    domain: "media",
    segments: [
      { text: "バーチャル", role: "modifier" },
      { text: "リアリティ", role: "field" },
    ],
  },

  // KNOWLEDGE
  {
    id: "k1",
    label: "ユビキタスコンピューティング",
    angleDeg: angDesignToKnowledge[5]!,
    domain: "knowledge",
    segments: [
      { text: "ユビキタス", role: "modifier" },
      { text: "コンピューティング", role: "field" },
    ],
  },
  {
    id: "k2",
    label: "ITS（Intelligent Transport Systems）",
    angleDeg: angDesignToKnowledge[6]!,
    domain: "knowledge",
    segments: [
      { text: "インテリジェント", role: "modifier" },
      { text: "交通", role: "subject" },
      { text: "システム", role: "field" },
    ],
  },
  {
    id: "k3",
    label: "テキストマイニング",
    angleDeg: angDesignToKnowledge[7]!,
    domain: "knowledge",
    segments: [
      { text: "テキスト", role: "subject" },
      { text: "マイニング", role: "method" },
    ],
  },
  {
    id: "k4",
    label: "環境認識",
    angleDeg: angDesignToKnowledge[8]!,
    domain: "knowledge",
    segments: [
      { text: "環境", role: "subject" },
      { text: "認識", role: "method" },
    ],
  },
  {
    id: "k5",
    label: "コンピュータネットワーク",
    angleDeg: angDesignToKnowledge[9]!,
    domain: "knowledge",
    segments: [
      { text: "コンピュータ", role: "subject" },
      { text: "ネットワーク", role: "field" },
    ],
  },
  {
    id: "k6",
    label: "データマイニング",
    angleDeg: angDesignToKnowledge[10]!,
    domain: "knowledge",
    segments: [
      { text: "データ", role: "subject" },
      { text: "マイニング", role: "method" },
    ],
  },
  {
    id: "k7",
    label: "マルチエージェントシステム",
    angleDeg: angDesignToKnowledge[11]!,
    domain: "knowledge",
    segments: [
      { text: "マルチ", role: "modifier" },
      { text: "エージェント", role: "subject" },
      { text: "システム", role: "field" },
    ],
  },
  {
    id: "k8",
    label: "ビッグデータ",
    angleDeg: angDesignToKnowledge[12]!,
    domain: "knowledge",
    segments: [
      { text: "ビッグ", role: "modifier" },
      { text: "データ", role: "subject" },
    ],
  },
  {
    id: "k9",
    label: "人工知能",
    angleDeg: angDesignToKnowledge[13]!,
    domain: "knowledge",
    segments: [
      { text: "人工", role: "modifier" },
      { text: "知能", role: "field" },
    ],
  },
  {
    id: "k10",
    label: "機械学習",
    angleDeg: angDesignToKnowledge[14]!,
    domain: "knowledge",
    segments: [
      { text: "機械", role: "subject" },
      { text: "学習", role: "method" },
    ],
  },
  {
    id: "k11",
    label: "ディープラーニング",
    angleDeg: angDesignToKnowledge[15]!,
    domain: "knowledge",
    segments: [
      { text: "ディープ", role: "modifier" },
      { text: "ラーニング", role: "method" },
    ],
  },

  // DESIGN
  {
    id: "d1",
    label: "テクノロジーアート",
    angleDeg: angMediaToDesign[5]!,
    domain: "design",
    segments: [
      { text: "テクノロジー", role: "subject" },
      { text: "アート", role: "field" },
    ],
  },
  {
    id: "d2",
    label: "ソーシャルデザイン",
    angleDeg: angMediaToDesign[6]!,
    domain: "design",
    segments: [
      { text: "ソーシャル", role: "modifier" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "d3",
    label: "サービスデザイン",
    angleDeg: angMediaToDesign[7]!,
    domain: "design",
    segments: [
      { text: "サービス", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "d4",
    label: "ユーザエクスペリエンスデザイン/人間中心設計",
    angleDeg: angMediaToDesign[8]!,
    domain: "design",
    segments: [
      { text: "ユーザエクスペリエンス", role: "field" },
      { text: "デザイン", role: "field" },
      { text: "人間中心", role: "modifier" },
      { text: "設計", role: "method" },
    ],
  },
  {
    id: "d5",
    label: "映像・CG・アニメーションデザイン",
    angleDeg: angMediaToDesign[9]!,
    domain: "design",
    segments: [
      { text: "映像", role: "subject" },
      { text: "CG", role: "subject" },
      { text: "アニメーション", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "d6",
    label: "Webデザイン/アプリケーションデザイン",
    angleDeg: angMediaToDesign[10]!,
    domain: "design",
    segments: [
      { text: "Web", role: "subject" },
      { text: "アプリケーション", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "d7",
    label: "ユーザインタフェースデザイン",
    angleDeg: angMediaToDesign[11]!,
    domain: "design",
    segments: [
      { text: "ユーザ", role: "subject" },
      { text: "インタフェース", role: "field" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "d8",
    label: "プロダクトデザイン/デジタルファブリケーション",
    angleDeg: angMediaToDesign[12]!,
    domain: "design",
    segments: [
      { text: "プロダクト", role: "subject" },
      { text: "デザイン", role: "field" },
      { text: "デジタル", role: "modifier" },
      { text: "ファブリケーション", role: "method" },
    ],
  },
  {
    id: "d9",
    label: "ビジュアライゼーション",
    angleDeg: angMediaToDesign[13]!,
    domain: "design",
    segments: [
      { text: "ビジュアル", role: "subject" },
      { text: "ライゼーション", role: "method" },
    ],
  },
  {
    id: "d10",
    label: "コミュニケーションデザイン",
    angleDeg: angMediaToDesign[14]!,
    domain: "design",
    segments: [
      { text: "コミュニケーション", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },

  // MEDIA × KNOWLEDGE
  {
    id: "mk1",
    label: "AR（拡張現実）",
    angleDeg: angKnowledgeToMedia[0]!,
    domain: "media-knowledge",
    segments: [
      { text: "拡張", role: "modifier" },
      { text: "現実", role: "field" },
    ],
  },
  {
    id: "mk2",
    label: "音声認識",
    angleDeg: angKnowledgeToMedia[1]!,
    domain: "media-knowledge",
    segments: [
      { text: "音声", role: "subject" },
      { text: "認識", role: "method" },
    ],
  },
  {
    id: "mk3",
    label: "画像認識",
    angleDeg: angKnowledgeToMedia[2]!,
    domain: "media-knowledge",
    segments: [
      { text: "画像", role: "subject" },
      { text: "認識", role: "method" },
    ],
  },
  {
    id: "mk4",
    label: "インテリジェント拡声システム",
    angleDeg: angKnowledgeToMedia[3]!,
    domain: "media-knowledge",
    segments: [
      { text: "インテリジェント", role: "modifier" },
      { text: "拡声", role: "subject" },
      { text: "システム", role: "field" },
    ],
  },
  {
    id: "mk5",
    label: "音の情景分析",
    angleDeg: angKnowledgeToMedia[4]!,
    domain: "media-knowledge",
    segments: [
      { text: "音", role: "subject" },
      { text: "情景", role: "subject" },
      { text: "分析", role: "method" },
    ],
  },

  // MEDIA × DESIGN
  {
    id: "md1",
    label: "マルチモーダルインタフェース",
    angleDeg: angMediaToDesign[0]!,
    domain: "media-design",
    segments: [
      { text: "マルチモーダル", role: "modifier" },
      { text: "インタフェース", role: "field" },
    ],
  },
  {
    id: "md2",
    label: "サウンドデザイン",
    angleDeg: angMediaToDesign[1]!,
    domain: "media-design",
    segments: [
      { text: "サウンド", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "md3",
    label: "音環境デザイン",
    angleDeg: angMediaToDesign[2]!,
    domain: "media-design",
    segments: [
      { text: "音環境", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "md4",
    label: "メディアデザイン",
    angleDeg: angMediaToDesign[3]!,
    domain: "media-design",
    segments: [
      { text: "メディア", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "md5",
    label: "サイエンティフィック・ビジュアライゼーション",
    angleDeg: angMediaToDesign[4]!,
    domain: "media-design",
    segments: [
      { text: "サイエンティフィック", role: "modifier" },
      { text: "ビジュアライゼーション", role: "field" },
    ],
  },

  // ALL
  {
    id: "all1",
    label: "データ可視化",
    angleDeg: angDesignToKnowledge[0]!,
    domain: "all",
    segments: [
      { text: "データ", role: "subject" },
      { text: "可視化", role: "method" },
    ],
  },
  {
    id: "all2",
    label: "IoT（Internet of Things）",
    angleDeg: angDesignToKnowledge[1]!,
    domain: "all",
    segments: [
      { text: "IoT", role: "field" },
      { text: "モノ", role: "subject" },
      { text: "インターネット", role: "field" },
    ],
  },
  {
    id: "all3",
    label: "インテリジェントプロダクトデザイン",
    angleDeg: angDesignToKnowledge[2]!,
    domain: "all",
    segments: [
      { text: "インテリジェント", role: "modifier" },
      { text: "プロダクト", role: "subject" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "all4",
    label: "インテリジェントインタフェースデザイン",
    angleDeg: angDesignToKnowledge[3]!,
    domain: "all",
    segments: [
      { text: "インテリジェント", role: "modifier" },
      { text: "インタフェース", role: "field" },
      { text: "デザイン", role: "field" },
    ],
  },
  {
    id: "all5",
    label: "インタフェースエージェント",
    angleDeg: angDesignToKnowledge[4]!,
    domain: "all",
    segments: [
      { text: "インタフェース", role: "field" },
      { text: "エージェント", role: "subject" },
    ],
  },
];

// ── 事前定義の合成ワード（抽選 → 紐づくキーワードで合成演出） ─────────────────
interface CompositeWordDef {
  word: string;
  keywordIds: string[];
  /** 目視確認用（keywordIds と同順・ロジックでは未使用） */
  keywordLabels: string[];
}

const COMPOSITE_WORDS: CompositeWordDef[] = [
  {
    word: "インテリジェント音響空間",
    keywordIds: ["mk4", "m1", "md3"],
    keywordLabels: [
      "インテリジェント拡声システム",
      "３D音響",
      "音環境デザイン",
    ],
  },
  {
    word: "マルチモーダル認識",
    keywordIds: ["md1", "mk3", "k4"],
    keywordLabels: ["マルチモーダルインタフェース", "画像認識", "環境認識"],
  },
  {
    word: "深層メディアアート",
    keywordIds: ["k11", "m7", "d1"],
    keywordLabels: [
      "ディープラーニング",
      "画像/映像合成",
      "テクノロジーアート",
    ],
  },
  {
    word: "VRデータビジュアライゼーション",
    keywordIds: ["m9", "all1", "d9"],
    keywordLabels: [
      "バーチャルリアリティ",
      "データ可視化",
      "ビジュアライゼーション",
    ],
  },
  {
    word: "音声認識デザイン",
    keywordIds: ["mk2", "md2"],
    keywordLabels: ["音声認識", "サウンドデザイン"],
  },
  {
    word: "エージェント型UI",
    keywordIds: ["all5", "d7"],
    keywordLabels: [
      "インタフェースエージェント",
      "ユーザインタフェースデザイン",
    ],
  },
  {
    word: "人工知能IoTプロダクト",
    keywordIds: ["all2", "d8", "k9"],
    keywordLabels: [
      "IoT（Internet of Things）",
      "プロダクトデザイン/デジタルファブリケーション",
      "人工知能",
    ],
  },
  {
    word: "拡張現実エクスペリエンス",
    keywordIds: ["mk1", "d4", "m9"],
    keywordLabels: [
      "AR（拡張現実）",
      "ユーザエクスペリエンスデザイン/人間中心設計",
      "バーチャルリアリティ",
    ],
  },
  {
    word: "ビッグデータ音響分析",
    keywordIds: ["k8", "mk5", "k6"],
    keywordLabels: ["ビッグデータ", "音の情景分析", "データマイニング"],
  },
  {
    word: "歌声合成AI",
    keywordIds: ["m5", "k10", "k9"],
    keywordLabels: ["歌声合成", "機械学習", "人工知能"],
  },
  {
    word: "科学的メディア表現",
    keywordIds: ["md5", "m6", "d10"],
    keywordLabels: [
      "サイエンティフィック・ビジュアライゼーション",
      "画像/映像処理",
      "コミュニケーションデザイン",
    ],
  },
  {
    word: "ユビキタス音響ネットワーク",
    keywordIds: ["k1", "m3", "k5"],
    keywordLabels: [
      "ユビキタスコンピューティング",
      "音声伝達",
      "コンピュータネットワーク",
    ],
  },
  {
    word: "ITSマルチエージェント",
    keywordIds: ["k2", "k7", "k4"],
    keywordLabels: [
      "ITS（Intelligent Transport Systems）",
      "マルチエージェントシステム",
      "環境認識",
    ],
  },
  {
    word: "テキスト音声インタフェース",
    keywordIds: ["k3", "mk2"],
    keywordLabels: ["テキストマイニング", "音声認識"],
  },
  {
    word: "インテリジェント映像デザイン",
    keywordIds: ["all4", "d5", "m6"],
    keywordLabels: [
      "インテリジェントインタフェースデザイン",
      "映像・CG・アニメーションデザイン",
      "画像/映像処理",
    ],
  },
  {
    word: "ソーシャルメディア工学",
    keywordIds: ["d2", "md4", "k9"],
    keywordLabels: ["ソーシャルデザイン", "メディアデザイン", "人工知能"],
  },
  {
    word: "音場AIシミュレーション",
    keywordIds: ["m2", "k10", "m4"],
    keywordLabels: ["音場シミュレーション", "機械学習", "話者認識"],
  },
  {
    word: "3D音響Webデザイン",
    keywordIds: ["d6", "m1"],
    keywordLabels: ["Webデザイン/アプリケーションデザイン", "３D音響"],
  },
  {
    word: "ITSサービスデザイン",
    keywordIds: ["k2", "m8", "d3"],
    keywordLabels: [
      "ITS（Intelligent Transport Systems）",
      "画像/映像符号化と伝送",
      "サービスデザイン",
    ],
  },
  {
    word: "デジタル音響ファブリケーション",
    keywordIds: ["d8", "md2", "m2"],
    keywordLabels: [
      "プロダクトデザイン/デジタルファブリケーション",
      "サウンドデザイン",
      "音場シミュレーション",
    ],
  },
  {
    word: "映像符号化伝送工学",
    keywordIds: ["m8", "k5"],
    keywordLabels: ["画像/映像符号化と伝送", "コンピュータネットワーク"],
  },
  {
    word: "人間中心メディア設計",
    keywordIds: ["d4", "md4", "all3"],
    keywordLabels: [
      "ユーザエクスペリエンスデザイン/人間中心設計",
      "メディアデザイン",
      "インテリジェントプロダクトデザイン",
    ],
  },
  {
    word: "話者適応音声合成",
    keywordIds: ["m4", "m5", "k10"],
    keywordLabels: ["話者認識", "歌声合成", "機械学習"],
  },
  {
    word: "リアルタイム映像認識",
    keywordIds: ["m6", "mk3", "k10"],
    keywordLabels: ["画像/映像処理", "画像認識", "機械学習"],
  },
  {
    word: "機械学習音響解析",
    keywordIds: ["k10", "mk5", "m2"],
    keywordLabels: ["機械学習", "音の情景分析", "音場シミュレーション"],
  },
  {
    word: "バーチャルサウンドスケープ",
    keywordIds: ["m9", "md3", "md2"],
    keywordLabels: [
      "バーチャルリアリティ",
      "音環境デザイン",
      "サウンドデザイン",
    ],
  },
  {
    word: "リアルタイム映像処理",
    keywordIds: ["k11", "m6", "mk3"],
    keywordLabels: ["ディープラーニング", "画像/映像処理", "画像認識"],
  },
  {
    word: "IoTサービスデザイン",
    keywordIds: ["d3", "all2", "k1"],
    keywordLabels: [
      "サービスデザイン",
      "IoT（Internet of Things）",
      "ユビキタスコンピューティング",
    ],
  },
  {
    word: "通信ネットワークメディア",
    keywordIds: ["k5", "m8", "m3"],
    keywordLabels: [
      "コンピュータネットワーク",
      "画像/映像符号化と伝送",
      "音声伝達",
    ],
  },
  {
    word: "CG生成AI",
    keywordIds: ["k9", "d5", "m7"],
    keywordLabels: [
      "人工知能",
      "映像・CG・アニメーションデザイン",
      "画像/映像合成",
    ],
  },
  {
    word: "テキストマイニングデザイン",
    keywordIds: ["k3", "all1", "d9"],
    keywordLabels: [
      "テキストマイニング",
      "データ可視化",
      "ビジュアライゼーション",
    ],
  },
  {
    word: "エージェント協調システム",
    keywordIds: ["k7", "all5", "mk4"],
    keywordLabels: [
      "マルチエージェントシステム",
      "インタフェースエージェント",
      "インテリジェント拡声システム",
    ],
  },
  {
    word: "AR音響ガイダンス",
    keywordIds: ["mk1", "m1", "d7"],
    keywordLabels: [
      "AR（拡張現実）",
      "３D音響",
      "ユーザインタフェースデザイン",
    ],
  },
  {
    word: "3D音場ビジュアライゼーション",
    keywordIds: ["m1", "m2", "d9"],
    keywordLabels: [
      "３D音響",
      "音場シミュレーション",
      "ビジュアライゼーション",
    ],
  },
  {
    word: "スマート拡声工学",
    keywordIds: ["mk4", "k2", "m3"],
    keywordLabels: [
      "インテリジェント拡声システム",
      "ITS（Intelligent Transport Systems）",
      "音声伝達",
    ],
  },
  {
    word: "音声UI/UX",
    keywordIds: ["d4", "mk2", "d7"],
    keywordLabels: [
      "ユーザエクスペリエンスデザイン/人間中心設計",
      "音声認識",
      "ユーザインタフェースデザイン",
    ],
  },
  {
    word: "ジェネラティブテクノロジーアート",
    keywordIds: ["d1", "m7", "k11"],
    keywordLabels: [
      "テクノロジーアート",
      "画像/映像合成",
      "ディープラーニング",
    ],
  },
  {
    word: "AIプロダクトデザイン",
    keywordIds: ["d8", "d3", "k9"],
    keywordLabels: [
      "プロダクトデザイン/デジタルファブリケーション",
      "サービスデザイン",
      "人工知能",
    ],
  },
  {
    word: "音響コミュニケーションデザイン",
    keywordIds: ["d10", "md2", "m3"],
    keywordLabels: [
      "コミュニケーションデザイン",
      "サウンドデザイン",
      "音声伝達",
    ],
  },
  {
    word: "音の情景ビジュアリゼーション",
    keywordIds: ["k6", "mk5", "all1"],
    keywordLabels: ["データマイニング", "音の情景分析", "データ可視化"],
  },
  {
    word: "映像ストリーミング工学",
    keywordIds: ["m8", "k5", "m7"],
    keywordLabels: [
      "画像/映像符号化と伝送",
      "コンピュータネットワーク",
      "画像/映像合成",
    ],
  },
  {
    word: "話者認識インタフェース",
    keywordIds: ["m4", "md1", "all4"],
    keywordLabels: [
      "話者認識",
      "マルチモーダルインタフェース",
      "インテリジェントインタフェースデザイン",
    ],
  },
  {
    word: "歌声メディアアート",
    keywordIds: ["m5", "d1", "md4"],
    keywordLabels: ["歌声合成", "テクノロジーアート", "メディアデザイン"],
  },
  {
    word: "ITS環境認識メディア",
    keywordIds: ["k2", "k4", "m6"],
    keywordLabels: [
      "ITS（Intelligent Transport Systems）",
      "環境認識",
      "画像/映像処理",
    ],
  },
  {
    word: "音声環境UX",
    keywordIds: ["m3", "d4"],
    keywordLabels: ["音声伝達", "ユーザエクスペリエンスデザイン/人間中心設計"],
  },
  {
    word: "符号化映像工学",
    keywordIds: ["m8", "d5"],
    keywordLabels: [
      "画像/映像符号化と伝送",
      "映像・CG・アニメーションデザイン",
    ],
  },
  {
    word: "音響エージェント",
    keywordIds: ["all5", "mk2"],
    keywordLabels: ["インタフェースエージェント", "音声認識"],
  },
  {
    word: "画像生成メディア工学",
    keywordIds: ["m6", "k9", "md4"],
    keywordLabels: ["画像/映像処理", "人工知能", "メディアデザイン"],
  },
  {
    word: "音場シミュレーションWeb",
    keywordIds: ["d6", "m2", "md2"],
    keywordLabels: [
      "Webデザイン/アプリケーションデザイン",
      "音場シミュレーション",
      "サウンドデザイン",
    ],
  },
  {
    word: "ソーシャルIoT",
    keywordIds: ["d2", "all2", "d3"],
    keywordLabels: [
      "ソーシャルデザイン",
      "IoT（Internet of Things）",
      "サービスデザイン",
    ],
  },
  {
    word: "音響マルチエージェント",
    keywordIds: ["k7", "mk5", "md3"],
    keywordLabels: [
      "マルチエージェントシステム",
      "音の情景分析",
      "音環境デザイン",
    ],
  },
  {
    word: "ビッグデータ映像解析",
    keywordIds: ["k8", "m6", "mk3"],
    keywordLabels: ["ビッグデータ", "画像/映像処理", "画像認識"],
  },
  {
    word: "インテリジェント音響",
    keywordIds: ["all3", "md2", "m1"],
    keywordLabels: [
      "インテリジェントプロダクトデザイン",
      "サウンドデザイン",
      "３D音響",
    ],
  },
];

const keywordById = new Map(keywords.map((k) => [k.id, k]));

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface KeywordLayout {
  anchorX: number;
  anchorY: number;
  anchorZ: number;
  baseScale: number;
  baseOpacity: number;
  floatPhase: number;
}

function hash01(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (h * 31 + seed.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 10000) / 10000;
}

function buildKeywordLayouts(): Map<string, KeywordLayout> {
  const layouts = new Map<string, KeywordLayout>();

  keywords.forEach((kw) => {
    const angle = hash01(`${kw.id}-ang`) * Math.PI * 2;
    const radius =
      KEYWORD_RING_R_MIN +
      hash01(`${kw.id}-r`) * (KEYWORD_RING_R_MAX - KEYWORD_RING_R_MIN);
    const depth = hash01(`${kw.id}-depth`);

    layouts.set(kw.id, {
      anchorX: Math.cos(angle) * radius,
      anchorY: TIER_KEYWORD_LABEL_Y + (depth - 0.5) * 0.08,
      anchorZ: Math.sin(angle) * radius,
      baseScale: LABEL_SCALE_BASE + depth * LABEL_SCALE_VAR,
      baseOpacity: LABEL_OPACITY_BASE + depth * LABEL_OPACITY_VAR,
      floatPhase: hash01(`${kw.id}-ph`) * Math.PI * 2,
    });
  });
  return layouts;
}

function anchorPosition(layout: KeywordLayout, target: Vec3): Vec3 {
  return target.set(layout.anchorX, layout.anchorY, layout.anchorZ);
}

const keywordLayouts = buildKeywordLayouts();

function pickCompositeHighlight(): { word: string; keywords: Keyword3D[] } {
  const entry =
    COMPOSITE_WORDS[Math.floor(Math.random() * COMPOSITE_WORDS.length)]!;
  const keywordsForEntry = entry.keywordIds
    .map((id) => keywordById.get(id))
    .filter((k): k is Keyword3D => k != null)
    .sort((a, b) => a.angleDeg - b.angleDeg);
  return { word: entry.word, keywords: keywordsForEntry };
}

function buildSourceKeywordsLine(kws: Keyword3D[]): string {
  return kws.map((kw) => kw.label).join("＋");
}

// ── イージング ────────────────────────────────────────────────────────────────
function easeOut(t: number) {
  return 1 - (1 - t) ** 2;
}
function easeIn(t: number) {
  return t * t;
}

// ── onMounted: Three.js セットアップ ─────────────────────────────────────────
onMounted(async () => {
  const container = containerRef.value;
  if (!container) return;

  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  function createCoinWordEl(displayText: string): HTMLSpanElement {
    const el = document.createElement("span");
    el.textContent = displayText;
    if (reduceMotion) {
      el.className = "diagram-3d-coin-panel__word";
      return el;
    }
    el.className = "diagram-3d-coin-panel__word diagram-3d-coin-glitch";
    el.dataset.text = displayText;
    return el;
  }

  const [THREE, { CSS2DRenderer, CSS2DObject }] = await Promise.all([
    import("three"),
    import("three/addons/renderers/CSS2DRenderer.js"),
  ]);

  // Scene
  const scene = new THREE.Scene();

  const w = container.clientWidth || 800;
  const h = container.clientHeight || 500;

  function fitOrthoCamera(cam: THREE.OrthographicCamera, cw: number, ch: number) {
    const aspect = cw / Math.max(1, ch);
    const halfH = ORTHO_VIEW_HEIGHT / 2;
    const halfW = halfH * aspect;
    cam.left = -halfW;
    cam.right = halfW;
    cam.top = halfH;
    cam.bottom = -halfH;
    cam.updateProjectionMatrix();
  }

  // 真上からの正射投影（Y 軸方向を見下ろす）
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 200);
  camera.position.set(0, 20, 0);
  camera.up.set(0, 0, -1);
  camera.lookAt(0, 0, 0);
  fitOrthoCamera(camera, w, h);

  // WebGL renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  Object.assign(renderer.domElement.style, {
    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",
    zIndex: "0",
  });
  container.appendChild(renderer.domElement);

  // CSS2D renderer（合成ワードのみ）
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(w, h);
  Object.assign(labelRenderer.domElement.style, {
    position: "absolute",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: "1",
  });
  container.appendChild(labelRenderer.domElement);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 1.6));
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
  keyLight.position.set(5, 10, 6);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(0xd8e8ff, 0.4);
  fillLight.position.set(-6, 1, -8);
  scene.add(fillLight);

  // ── キーワードクラウド（領域クラスター + 奥行き） ─────────────────────────────
  const sceneGroup = new THREE.Group();
  scene.add(sceneGroup);

  const mergePoint = new THREE.Vector3(0, MERGE_POINT_Y, 0);

  const labelMeshMap = new Map<string, THREE.Mesh>();
  const restLabelScale = new Map<string, number>();
  const anchorScratch = new THREE.Vector3();
  const baseScratch = new THREE.Vector3();

  // ── ハイライト状態（updateKeywordMotion より先に宣言） ───────────────────────
  type HLPhase = "idle" | "draw" | "coin" | "shrink";
  let hlPhase: HLPhase = "idle";
  let hlStartTime = 0;
  let hlPicked: Keyword3D[] = [];
  let hlCompositeWord = "";
  let hlPickedIds = new Set<string>();
  let hlCoinAnimEl: HTMLDivElement | null = null;
  let hlCoinWordEl: HTMLSpanElement | null = null;
  let hlCoinObj: InstanceType<typeof CSS2DObject> | null = null;
  let hlTimeouts: ReturnType<typeof setTimeout>[] = [];

  /** 周辺固定位置でふよふよ漂う */
  function applyKeywordFloat(
    layout: KeywordLayout,
    timeSec: number,
    label: THREE.Mesh,
  ) {
    const ph = layout.floatPhase;
    const t = timeSec * FLOAT_SPEED;
    const wobbleX =
      Math.sin(t + ph) * 0.5 + Math.sin(t * 0.73 + ph * 1.15) * 0.5;
    const wobbleZ =
      Math.cos(t * 0.81 + ph * 0.9) * 0.5 +
      Math.sin(t * 0.52 + ph * 1.3) * 0.5;
    const wobbleY =
      Math.sin(t * 0.64 + ph * 1.05) * 0.5 +
      Math.cos(t * 0.48 + ph * 0.75) * 0.5;
    label.position.set(
      layout.anchorX + wobbleX * FLOAT_AMP,
      layout.anchorY + wobbleY * FLOAT_AMP_Y,
      layout.anchorZ + wobbleZ * FLOAT_AMP,
    );
    label.scale.setScalar(layout.baseScale);
    const mat = label.material as THREE.MeshBasicMaterial;
    mat.opacity = layout.baseOpacity;
    label.visible = true;
    label.renderOrder = 2;
  }

  /** XZ 平面上のフラットラベル（真上カメラ用・回転固定） */
  function createFlatLabel(
    text: string,
    colorCss: string,
    fontPx: number,
    planeH: number,
    opacity: number,
    fontWeight = 500,
  ): THREE.Mesh {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const font = `${fontWeight} ${fontPx}px var(--font-body, system-ui, sans-serif)`;
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = font;
    const textW = probe.measureText(text).width;
    const padX = 8;
    const padY = 6;
    const logicalW = textW + padX * 2;
    const logicalH = fontPx + padY * 2;

    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(logicalW * dpr);
    canvas.height = Math.ceil(logicalH * dpr);
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);
    ctx.font = font;
    ctx.fillStyle = colorCss;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, logicalW / 2, logicalH / 2);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    const planeW = planeH * (logicalW / logicalH);
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(planeW, planeH),
      new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
      }),
    );
    mesh.userData.labelTexture = texture;
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  // 中心サークル周囲の白い壁（キーワードドットと同高さ）
  const centerHubWall = new THREE.Mesh(
    new THREE.CylinderGeometry(
      CENTER_HUB_R,
      CENTER_HUB_R,
      CENTER_HUB_WALL_H,
      64,
      1,
      true,
    ),
    new THREE.MeshStandardMaterial({
      color: DEPARTMENT_HEX,
      transparent: true,
      opacity: 0.9,
      roughness: 0.5,
      metalness: 0.06,
      side: THREE.DoubleSide,
    }),
  );
  centerHubWall.position.y = TIER_CENTER_DISK_Y;
  centerHubWall.renderOrder = 1;
  sceneGroup.add(centerHubWall);

  // 中心サークル + タイトル
  const centerDisk = new THREE.Mesh(
    new THREE.CircleGeometry(CENTER_HUB_R, 64),
    new THREE.MeshBasicMaterial({
      color: DEPARTMENT_HEX,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
    }),
  );
  centerDisk.rotation.x = -Math.PI / 2;
  centerDisk.position.y = TIER_CENTER_DISK_Y;
  sceneGroup.add(centerDisk);

  const centerTitle = createFlatLabel(
    CENTER_LABEL_TEXT,
    DIAGRAM_WHITE_CSS,
    CENTER_LABEL_FONT_PX,
    CENTER_LABEL_CHAR_PLANE_H,
    0.95,
    600,
  );
  centerTitle.position.set(0, TIER_CENTER_DISK_Y + 0.02, 0);
  centerTitle.renderOrder = 10;
  sceneGroup.add(centerTitle);

  function getCoinLabelY(): number {
    return MERGE_POINT_Y + 0.55;
  }

  function createKeywordLabelMesh(
    text: string,
    layout: KeywordLayout,
  ): THREE.Mesh {
    const mesh = createFlatLabel(
      text,
      DIAGRAM_WHITE_CSS,
      LABEL_FONT_PX,
      LABEL_PLANE_H_KW,
      LABEL_OPACITY_PEAK,
    );
    anchorPosition(layout, mesh.position);
    mesh.scale.setScalar(layout.baseScale);
    mesh.renderOrder = 2;
    return mesh;
  }

  function applyKeywordVisibility(pickedIds: Set<string> | null) {
    if (!pickedIds) return;
    for (const kw of keywords) {
      const selected = pickedIds.has(kw.id);
      const labelMat = labelMeshMap.get(kw.id)!
        .material as THREE.MeshBasicMaterial;
      if (selected) {
        labelMat.opacity = LABEL_OPACITY_ACTIVE;
      } else {
        labelMat.opacity = LABEL_OPACITY_PEAK * 0.2;
      }
    }
  }

  /** 選択キーワードを周辺の元位置へ即座に戻し、不透明度0からフェードイン */
  function snapPickedLabelsToAnchor(timeSec: number) {
    for (const kw of hlPicked) {
      const layout = keywordLayouts.get(kw.id)!;
      const label = labelMeshMap.get(kw.id)!;
      applyKeywordFloat(layout, timeSec, label);
      label.renderOrder = 2;
      (label.material as THREE.MeshBasicMaterial).opacity = 0;
      label.visible = true;
    }
  }

  /** 全キーワードの位置・スケール（漂いは常時、ハイライト時は一直線で中央へ） */
  function updateKeywordMotion(timeSec: number, now: number) {
    let toCenterT = 1;
    if (hlPhase === "draw") {
      const elapsed = now - hlStartTime;
      toCenterT = Math.min(1, elapsed / HIGHLIGHT_TO_CENTER_MS);
    }

    for (const kw of keywords) {
      const layout = keywordLayouts.get(kw.id)!;
      const label = labelMeshMap.get(kw.id)!;
      anchorPosition(layout, anchorScratch);

      const isPicked = hlPickedIds.has(kw.id);
      const inMergeMotion = isPicked && hlPhase === "draw";
      const dimmed =
        hlPickedIds.size > 0 && !isPicked && hlPhase !== "idle";

      if (inMergeMotion) {
        baseScratch.lerpVectors(anchorScratch, mergePoint, toCenterT);
        label.position.copy(baseScratch);
        const baseScale = restLabelScale.get(kw.id)!;
        const scale =
          baseScale + (LABEL_SCALE_HIGHLIGHT - baseScale) * toCenterT;
        label.scale.setScalar(scale);
        const mat = label.material as THREE.MeshBasicMaterial;
        mat.opacity = LABEL_OPACITY_ACTIVE * (1 - Math.max(0, (toCenterT - 0.88) / 0.12));
        label.visible = toCenterT < 0.98;
        label.renderOrder = 20;
      } else if (isPicked && hlPhase === "coin") {
        label.visible = false;
      } else if (isPicked && hlPhase === "shrink") {
        applyKeywordFloat(layout, timeSec, label);
        const fadeT = easeOut(
          Math.min(1, (now - hlStartTime) / HIGHLIGHT_KEYWORD_FADE_IN_MS),
        );
        (label.material as THREE.MeshBasicMaterial).opacity =
          LABEL_OPACITY_ACTIVE * fadeT;
        label.visible = true;
        label.renderOrder = 2;
      } else {
        applyKeywordFloat(layout, timeSec, label);
        if (dimmed) {
          const mat = label.material as THREE.MeshBasicMaterial;
          mat.opacity *= 0.22;
        }
      }
    }
  }

  for (const kw of keywords) {
    const layout = keywordLayouts.get(kw.id)!;
    const labelMesh = createKeywordLabelMesh(kw.label, layout);
    labelMeshMap.set(kw.id, labelMesh);
    restLabelScale.set(kw.id, layout.baseScale);
    sceneGroup.add(labelMesh);
  }
  updateKeywordMotion(0, performance.now());

  function clearHL() {
    for (const t of hlTimeouts) clearTimeout(t);
    hlTimeouts = [];
    if (hlCoinObj) {
      scene.remove(hlCoinObj);
      hlCoinObj = null;
      hlCoinAnimEl = null;
      hlCoinWordEl = null;
    }
  }
  function after(ms: number, fn: () => void) {
    hlTimeouts.push(setTimeout(fn, ms));
  }

  function setPickedLabelsVisible(visible: boolean) {
    for (const kw of hlPicked) {
      labelMeshMap.get(kw.id)!.visible = visible;
    }
  }

  // ─── フェーズ: DRAW ──────────────────────────────────────────────────────
  function startCycle() {
    clearHL();

    const composite = pickCompositeHighlight();
    hlCompositeWord = composite.word;
    hlPicked = composite.keywords;
    hlPickedIds = new Set(hlPicked.map((k) => k.id));

    for (const kw of hlPicked) {
      labelMeshMap.get(kw.id)!.visible = true;
    }

    applyKeywordVisibility(hlPickedIds);

    hlPhase = "draw";
    hlStartTime = performance.now();

    after(HIGHLIGHT_PATH_MS, startCoin);
  }

  // ─── フェーズ: COIN ──────────────────────────────────────────────────────
  function startCoin() {
    hlPhase = "coin";
    hlStartTime = performance.now();

    setPickedLabelsVisible(false);

    // ── 造語ラベル（CSS2DRenderer が外側 div の transform を毎フレーム上書きするため、
    //    スライドは内側 span で行う）
    const word = hlCompositeWord;
    const sourceLine = buildSourceKeywordsLine(hlPicked);
    const coinWrap = document.createElement("div");
    Object.assign(coinWrap.style, {
      pointerEvents: "none",
      textAlign: "center",
    });
    hlCoinAnimEl = document.createElement("div");
    hlCoinAnimEl.className = "diagram-3d-coin-panel";
    Object.assign(hlCoinAnimEl.style, {
      transform: `translateY(${COIN_SLIDE_IN_PX}px)`,
      opacity: "0",
    });
    const coinSourceEl = document.createElement("span");
    coinSourceEl.className = "diagram-3d-coin-panel__source";
    coinSourceEl.textContent = sourceLine;
    hlCoinWordEl = createCoinWordEl(`"${word}"`);
    hlCoinAnimEl.append(coinSourceEl, hlCoinWordEl);
    coinWrap.appendChild(hlCoinAnimEl);
    hlCoinObj = new CSS2DObject(coinWrap);
    hlCoinObj.position.set(0, getCoinLabelY(), 0);
    scene.add(hlCoinObj);

    if (hlCoinWordEl && !reduceMotion) {
      after(COIN_POP_MS, () => {
        hlCoinWordEl?.classList.add("diagram-3d-coin-glitch--active");
      });
      after(COIN_POP_MS + COIN_GLITCH_MS, () => {
        if (!hlCoinWordEl) return;
        hlCoinWordEl.classList.remove("diagram-3d-coin-glitch--active");
        hlCoinWordEl.classList.add("diagram-3d-coin-glitch--settled");
      });
    }

    after(COIN_POP_MS + COIN_HOLD_MS + COIN_FADE_MS, startShrink);
  }

  // ─── フェーズ: SHRINK（元位置でフェードイン、中央からの復帰なし） ─────────
  function startShrink() {
    hlPhase = "shrink";
    hlStartTime = performance.now();
    snapPickedLabelsToAnchor(hlStartTime / 1000);

    if (hlCoinObj) {
      scene.remove(hlCoinObj);
      hlCoinObj = null;
      hlCoinAnimEl = null;
      hlCoinWordEl = null;
    }

    after(HIGHLIGHT_KEYWORD_FADE_IN_MS + HIGHLIGHT_PAUSE_MS, () => {
      applyKeywordVisibility(null);
      hlPhase = "idle";
      startCycle();
    });
  }

  // ── フレームごとの連続アニメーション更新 ─────────────────────────────────
  function updateHighlight(now: number) {
    const elapsed = now - hlStartTime;

    if (hlPhase === "coin") {
      const fadeStart = COIN_POP_MS + COIN_HOLD_MS;
      const popProgress = Math.min(1, elapsed / COIN_POP_MS);

      if (elapsed <= COIN_POP_MS) {
        const burstOpacity = easeOut(Math.min(1, popProgress * 1.35));
        if (hlCoinAnimEl) {
          const slideT = easeOut(popProgress);
          const slideY = (1 - slideT) * COIN_SLIDE_IN_PX;
          hlCoinAnimEl.style.opacity = String(burstOpacity);
          hlCoinAnimEl.style.transform = `translateY(${slideY}px)`;
        }
        if (hlCoinObj) hlCoinObj.position.y = getCoinLabelY();
      } else if (elapsed <= fadeStart) {
        if (hlCoinAnimEl) {
          hlCoinAnimEl.style.opacity = "1";
          hlCoinAnimEl.style.transform = "translateY(0)";
        }
        if (hlCoinObj) hlCoinObj.position.y = getCoinLabelY();
      } else {
        const fadeT = easeOut(
          Math.min(1, (elapsed - fadeStart) / COIN_FADE_MS),
        );
        const remain = 1 - fadeT;
        if (hlCoinAnimEl) {
          hlCoinAnimEl.style.opacity = String(remain);
          hlCoinAnimEl.style.transform = `translateY(${-10 * fadeT}px)`;
        }
        if (hlCoinObj) hlCoinObj.position.y = getCoinLabelY();
      }
    }
  }

  // ── メインアニメーションループ ────────────────────────────────────────────
  let rafId = 0;
  const animate = (now: number) => {
    rafId = requestAnimationFrame(animate);
    const timeSec = now / 1000;
    if (reduceMotion) {
      for (const kw of keywords) {
        const layout = keywordLayouts.get(kw.id)!;
        const label = labelMeshMap.get(kw.id)!;
        anchorPosition(layout, label.position);
        label.scale.setScalar(layout.baseScale);
        (label.material as THREE.MeshBasicMaterial).opacity = layout.baseOpacity;
        label.visible = true;
      }
    } else {
      updateHighlight(now);
      updateKeywordMotion(timeSec, now);
    }
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  };
  rafId = requestAnimationFrame(animate);

  let highlightStarted = false;
  function tryStartHighlight() {
    if (highlightStarted || reduceMotion || props.deferHighlight) return;
    highlightStarted = true;
    startCycle();
  }

  watch(
    () => props.deferHighlight,
    () => tryStartHighlight(),
    { immediate: true },
  );

  // リサイズ対応
  const resizeObs = new ResizeObserver(() => {
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    fitOrthoCamera(camera, cw, ch);
    renderer.setSize(cw, ch);
    labelRenderer.setSize(cw, ch);
    if (hlCoinObj) hlCoinObj.position.y = getCoinLabelY();
  });
  resizeObs.observe(container);

  disposeFn = () => {
    cancelAnimationFrame(rafId);
    clearHL();
    resizeObs.disconnect();
    renderer.dispose();
    container.innerHTML = "";
  };
});

onUnmounted(() => {
  disposeFn?.();
});
</script>

<style scoped>
.diagram-3d {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

<style>
.diagram-3d-coin-panel {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35em;
  font-family: var(--font-display, system-ui, sans-serif);
  white-space: nowrap;
}

.diagram-3d-coin-panel__source,
.diagram-3d-coin-panel__word {
  display: inline-block;
  width: fit-content;
  max-width: 100%;
  background: #000000;
  padding: 0.2em 0.45em;
  color: #ffffff;
}

.diagram-3d-coin-panel__source {
  font-size: clamp(10px, 1.15vw, 13px);
  font-weight: 500;
  opacity: 0.72;
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.diagram-3d-coin-panel__word {
  font-size: clamp(20px, 2.8vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.diagram-3d-coin-glitch {
  position: relative;
}

.diagram-3d-coin-glitch::before,
.diagram-3d-coin-glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000000;
  color: #ffffff;
  pointer-events: none;
  opacity: 0;
}

.diagram-3d-coin-glitch--active::before {
  left: -2px;
  opacity: 1;
  text-shadow: 1px 0 #5eb8ff;
  animation: diagram-3d-glitch-a 0.2s steps(4) 1 forwards;
}

.diagram-3d-coin-glitch--active::after {
  left: 2px;
  opacity: 1;
  text-shadow: -1px 0 #ff6b7a;
  animation: diagram-3d-glitch-b 0.22s steps(4) 1 forwards;
}

.diagram-3d-coin-glitch--settled::before,
.diagram-3d-coin-glitch--settled::after {
  display: none;
}

@keyframes diagram-3d-glitch-a {
  0% {
    clip-path: inset(82% 0 6% 0);
  }
  8% {
    clip-path: inset(12% 0 78% 0);
  }
  16% {
    clip-path: inset(44% 0 38% 0);
  }
  24% {
    clip-path: inset(70% 0 14% 0);
  }
  32% {
    clip-path: inset(22% 0 58% 0);
  }
  40% {
    clip-path: inset(58% 0 28% 0);
  }
  48% {
    clip-path: inset(6% 0 88% 0);
  }
  56% {
    clip-path: inset(36% 0 48% 0);
  }
  64% {
    clip-path: inset(90% 0 4% 0);
  }
  72% {
    clip-path: inset(18% 0 68% 0);
  }
  80% {
    clip-path: inset(62% 0 22% 0);
  }
  88% {
    clip-path: inset(30% 0 52% 0);
  }
  100% {
    clip-path: inset(82% 0 6% 0);
  }
}

@keyframes diagram-3d-glitch-b {
  0% {
    clip-path: inset(8% 0 84% 0);
  }
  10% {
    clip-path: inset(76% 0 10% 0);
  }
  20% {
    clip-path: inset(32% 0 54% 0);
  }
  30% {
    clip-path: inset(64% 0 20% 0);
  }
  40% {
    clip-path: inset(4% 0 92% 0);
  }
  50% {
    clip-path: inset(48% 0 36% 0);
  }
  60% {
    clip-path: inset(88% 0 2% 0);
  }
  70% {
    clip-path: inset(26% 0 60% 0);
  }
  80% {
    clip-path: inset(54% 0 32% 0);
  }
  90% {
    clip-path: inset(14% 0 72% 0);
  }
  100% {
    clip-path: inset(8% 0 84% 0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .diagram-3d-coin-glitch::before,
  .diagram-3d-coin-glitch::after {
    animation: none;
    content: none;
  }
}
</style>
