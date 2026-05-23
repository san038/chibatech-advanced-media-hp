<template>
  <div ref="containerRef" class="diagram-3d" />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

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

const DOMAIN_CSS: Record<Domain, string> = {
  media: "#a14e58",
  knowledge: "#3d6b4a",
  design: "#4a6fa3",
  "media-knowledge": "#7a7574",
  "media-design": "#7a7574",
  all: "#7a7574",
};
const DOMAIN_HEX: Record<Domain, number> = {
  media: 0xa14e58,
  knowledge: 0x3d6b4a,
  design: 0x4a6fa3,
  "media-knowledge": 0x7a7574,
  "media-design": 0x7a7574,
  all: 0x7a7574,
};

const RING_R = 5.2;
const DOT_R = 0.1;
const CENTER_LABEL_TEXT = "知能メディア工学科";
const CENTER_HUB_R = 0.78;
const DOMAIN_HUB_R = 2.15;
const DOMAIN_HUB_DOT_R = 0.13;
/** DomainDiagram の .domain-diagram__link-path に合わせる */
const GRAY_LINK_COLOR = 0xb8b3b0;
const GRAY_LINK_OPACITY = 0.32;
const DIAGRAM_WHITE_HEX = 0xffffff;
const DIAGRAM_WHITE_CSS = "#ffffff";
const DIAGRAM_BG_HEX = 0x1c1b1b;
/** SVG gap=9, R=210 を 3D 円周に換算したラベルとドット間距離 */
const LABEL_GAP = (9 / 210) * RING_R * 0.85;
/** Y 階層: キーワード < 領域ハブ < 中心 */
const TIER_KEYWORD_Y = 0;
const TIER_KEYWORD_LABEL_Y = 0.04;
const TIER_HUB_Y = 0.42;
const TIER_HUB_LABEL_Y = 0.48;
const TIER_CENTER_DISK_Y = TIER_KEYWORD_Y + 0.1;
/** 中心リング外周に沿った学科ラベルの半径（ワールド単位） */
const CENTER_LABEL_ARC_R = CENTER_HUB_R * 0.8;
/** 弧の中心角（度）— 0°=+X */
const CENTER_LABEL_ARC_CENTER_DEG = 0;
/** 反対側ラベルの中心角オフセット（度） */
const CENTER_LABEL_ARC_OPPOSITE_OFFSET_DEG = 180;
const CENTER_LABEL_FONT_PX = 22;
const CENTER_LABEL_CHAR_PLANE_H = 0.28;
/** 学科ラベルより合成ワードをどれだけ上（ワールド Y）に置くか */
const COIN_LABEL_OFFSET_ABOVE_TITLE = 0.4;
/** ラベル平面の高さ（ワールド単位） */
const LABEL_PLANE_H = 0.62;
const HUB_LABEL_PLANE_H = 0.72;
const HUB_LABEL_FONT_PX = 64;
/** ラベル Canvas のフォントサイズ（px）— 平面サイズに合わせて調整 */
const LABEL_FONT_PX = 36;
/** リングを手前に寝かせる傾き（rad・負で上端が手前に） */
const RING_TILT_X = 0.2;
const CAMERA_FOV = 46;
/** キーワードリングの回転速度（rad/s）— 約90秒で1周 */
const RING_ROTATION_RAD_PER_S = (2 * Math.PI) / 90;
const DOT_OPACITY_DIM = 0.42;
const DOT_OPACITY_ACTIVE = 1;
const LABEL_OPACITY_DIM = 0.58;
const LABEL_OPACITY_ACTIVE = 1;

// アニメーションタイミング（SVG版と同じ値）
const HIGHLIGHT_DRAW_MS = 1200;
const HIGHLIGHT_MERGE_MS = 1500;
const COIN_POP_MS = 450;
const COIN_HOLD_MS = 2000;
const COIN_FADE_MS = 800;
const HIGHLIGHT_SHRINK_MS = 600;
const HIGHLIGHT_PAUSE_MS = 250;
const CENTER_SPHERE_R = 0.38;
/** ハイライト曲線の終点: 中心サークル下端から何 px 下か */
const HIGHLIGHT_LINE_END_PX_BELOW_CIRCLE = 1;
const TRAVEL_DOT_R = 0.11;
const TRAVEL_DOT_COLOR = 0xffd54f;

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

const DOMAIN_HUBS: {
  key: HubKey;
  label: string;
  angleDeg: number;
  hex: number;
  css: string;
}[] = [
  {
    key: "design",
    label: "情報デザイン",
    angleDeg: -30,
    hex: DOMAIN_HEX.design,
    css: DOMAIN_CSS.design,
  },
  {
    key: "knowledge",
    label: "知能工学",
    angleDeg: 90,
    hex: DOMAIN_HEX.knowledge,
    css: DOMAIN_CSS.knowledge,
  },
  {
    key: "media",
    label: "メディア工学",
    angleDeg: 210,
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

// ── 造語生成（各キーワードの segments から1つ選び、文字列をそのまま連結） ───
function normalizeSegmentText(text: string): string {
  return text
    .replace(/[（(][^）)]*[）)]/g, "")
    .split(/[/／]/)[0]!
    .trim();
}

function pickRandomSegment(segments: KeywordSegment[]): KeywordSegment {
  return segments[Math.floor(Math.random() * segments.length)]!;
}

function buildPortmanteauPart(kw: Keyword3D): string {
  if (kw.segments.length === 0) return "";
  return normalizeSegmentText(pickRandomSegment(kw.segments).text);
}

function buildPortmanteau(kws: Keyword3D[]): string {
  return kws.map((kw) => buildPortmanteauPart(kw)).join("");
}

// ── イージング ────────────────────────────────────────────────────────────────
function easeOut(t: number) {
  return 1 - (1 - t) ** 2;
}
function easeIn(t: number) {
  return t * t;
}
/** 爆発的ポップイン（coin フェーズの中央ドット用） */
function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
}
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function shuffled<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

/** DomainDiagram.buildGrayLinks と同じ接続ルール（各ノード最大3本・重複なし） */
function buildGrayLinkPairs(
  nodes: Keyword3D[],
): { key: string; from: Keyword3D; to: Keyword3D }[] {
  const seen = new Set<string>();
  const links: { key: string; from: Keyword3D; to: Keyword3D }[] = [];
  for (const kw of shuffled(nodes)) {
    const peers = shuffled(nodes.filter((k) => k.id !== kw.id));
    let n = 0;
    for (const t of peers) {
      if (n >= 3) break;
      const k = edgeKey(kw.id, t.id);
      if (seen.has(k)) continue;
      seen.add(k);
      n++;
      links.push({ key: k, from: kw, to: t });
    }
  }
  return links;
}

// ── onMounted: Three.js セットアップ ─────────────────────────────────────────
onMounted(async () => {
  const container = containerRef.value;
  if (!container) return;

  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  const [THREE, { CSS2DRenderer, CSS2DObject }] = await Promise.all([
    import("three"),
    import("three/addons/renderers/CSS2DRenderer.js"),
  ]);

  // Scene
  const scene = new THREE.Scene();

  // Camera（透視 — 寝かせたリングに奥行きをつける）
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 500;
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, w / h, 0.1, 200);
  camera.position.set(0, 5.2, 10.5);
  camera.lookAt(0, 0, 0);

  const outward = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const tangent = new THREE.Vector3();
  const labelBasis = new THREE.Matrix4();

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

  // ── ドット & ラベル（リンググループで常時回転） ───────────────────────────────
  const ringGroup = new THREE.Group();
  ringGroup.rotation.x = RING_TILT_X;
  scene.add(ringGroup);

  const branchGroup = new THREE.Group();
  ringGroup.add(branchGroup);

  /** 中心サークル Y から px 分だけずらした ring ローカル Y（+ が上） */
  function ringLocalYFromCirclePx(pxOffset: number): number {
    const local = new THREE.Vector3(0, TIER_CENTER_DISK_Y, 0);
    const world = ringGroup.localToWorld(local.clone());
    const dist = camera.position.distanceTo(world);
    const vh = Math.max(1, container.clientHeight);
    const worldPerPx =
      (2 * Math.tan((CAMERA_FOV * Math.PI) / 180 / 2) * dist) / vh;
    return TIER_CENTER_DISK_Y + worldPerPx * pxOffset;
  }

  const dotGeo = new THREE.SphereGeometry(DOT_R, 8, 8);
  const dotMeshMap = new Map<string, THREE.Mesh>();
  const labelMeshMap = new Map<string, THREE.Mesh>();
  const dotOrigPos = new Map<string, THREE.Vector3>();

  function posAtAngle(angleDeg: number, r: number, y = 0.006): THREE.Vector3 {
    const rad = (angleDeg * Math.PI) / 180;
    return new THREE.Vector3(r * Math.cos(rad), y, r * Math.sin(rad));
  }

  function kwPos(kw: Keyword3D): THREE.Vector3 {
    return posAtAngle(kw.angleDeg, RING_R, TIER_KEYWORD_Y);
  }

  /** DomainDiagram.bezierTowardCenter 相当（中心方向へ引いた三次ベジェ） */
  function addBezierTowardCenter(from: Keyword3D, to: Keyword3D) {
    const p0 = kwPos(from);
    const p3 = kwPos(to);
    const center = new THREE.Vector3(0, TIER_KEYWORD_Y, 0);
    const t1 = 0.4 + Math.random() * 0.16;
    const t2 = 0.4 + Math.random() * 0.16;
    const c1 = new THREE.Vector3(
      p0.x + t1 * (center.x - p0.x),
      p0.y + t1 * (center.y - p0.y),
      p0.z + t1 * (center.z - p0.z),
    );
    const c2 = new THREE.Vector3(
      p3.x + t2 * (center.x - p3.x),
      p3.y + t2 * (center.y - p3.y),
      p3.z + t2 * (center.z - p3.z),
    );
    const jitter = (2.5 + Math.random() * 3.5) * (RING_R / 210);
    c1.x += (Math.random() - 0.5) * jitter;
    c1.y += (Math.random() - 0.5) * jitter;
    c1.z += (Math.random() - 0.5) * jitter;
    c2.x += (Math.random() - 0.5) * jitter;
    c2.y += (Math.random() - 0.5) * jitter;
    c2.z += (Math.random() - 0.5) * jitter;

    const pts: THREE.Vector3[] = [];
    const SAMPLES = 36;
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const mt = 1 - t;
      pts.push(
        new THREE.Vector3(
          mt * mt * mt * p0.x +
            3 * mt * mt * t * c1.x +
            3 * mt * t * t * c2.x +
            t * t * t * p3.x,
          mt * mt * mt * p0.y +
            3 * mt * mt * t * c1.y +
            3 * mt * t * t * c2.y +
            t * t * t * p3.y,
          mt * mt * mt * p0.z +
            3 * mt * mt * t * c1.z +
            3 * mt * t * t * c2.z +
            t * t * t * p3.z,
        ),
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: GRAY_LINK_COLOR,
        transparent: true,
        opacity: GRAY_LINK_OPACITY,
      }),
    );
    branchGroup.add(line);
  }

  /** 中心円周（半径 R）に沿って 1 文字ずつ弧上に配置 */
  function createArcCenterLabel(
    text: string,
    colorCss: string,
    fontPx: number,
    charPlaneH: number,
    radius: number,
    y: number,
    arcCenterDeg: number,
    opacity: number,
  ): THREE.Group {
    const group = new THREE.Group();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const font = `600 ${fontPx}px var(--font-body, system-ui, sans-serif)`;
    const probe = document.createElement("canvas").getContext("2d")!;
    probe.font = font;

    const chars = [...text];
    const widths = chars.map((ch) => probe.measureText(ch).width);
    const totalPx = widths.reduce((a, b) => a + b, 0);
    const pxToWorld = charPlaneH / fontPx;
    const arcSpan = (totalPx * pxToWorld) / radius;
    const arcCenter = (arcCenterDeg * Math.PI) / 180;
    let angle = arcCenter - arcSpan / 2;

    const charRadial = new THREE.Vector3();
    const charTangent = new THREE.Vector3();
    const charBasis = new THREE.Matrix4();

    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i]!;
      const wPx = widths[i]!;
      const charArc = (wPx * pxToWorld) / radius;
      const midAngle = angle + charArc / 2;
      angle += charArc;

      const padX = 2;
      const padY = 4;
      const logicalW = wPx + padX * 2;
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
      ctx.fillText(ch, logicalW / 2, logicalH / 2);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      const planeW = charPlaneH * (logicalW / logicalH);
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(planeW, charPlaneH),
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      mesh.userData.labelTexture = texture;

      charRadial.set(Math.cos(midAngle), 0, Math.sin(midAngle));
      charTangent.set(-Math.sin(midAngle), 0, Math.cos(midAngle));
      // XZ 平面に寝かせる: 接線=横、半径方向=縦、法線=+Y
      charBasis.makeBasis(charTangent, charRadial, up);
      mesh.quaternion.setFromRotationMatrix(charBasis);
      mesh.position.set(charRadial.x * radius, y, charRadial.z * radius);
      mesh.renderOrder = 10;
      group.add(mesh);
    }
    return group;
  }

  // 中心サークル + タイトル
  const centerDisk = new THREE.Mesh(
    new THREE.CircleGeometry(CENTER_HUB_R * 0.88, 64),
    new THREE.MeshBasicMaterial({
      color: DIAGRAM_BG_HEX,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
    }),
  );
  centerDisk.rotation.x = -Math.PI / 2;
  centerDisk.position.y = TIER_CENTER_DISK_Y;
  ringGroup.add(centerDisk);

  const centerRing = new THREE.Mesh(
    new THREE.RingGeometry(CENTER_HUB_R * 0.88, CENTER_HUB_R, 64),
    new THREE.MeshBasicMaterial({
      color: DIAGRAM_WHITE_HEX,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide,
    }),
  );
  centerRing.rotation.x = -Math.PI / 2;
  centerRing.position.y = TIER_CENTER_DISK_Y + 0.001;
  ringGroup.add(centerRing);

  const centerLabelArcCenters = [
    CENTER_LABEL_ARC_CENTER_DEG,
    CENTER_LABEL_ARC_CENTER_DEG + CENTER_LABEL_ARC_OPPOSITE_OFFSET_DEG,
  ];
  for (const arcCenterDeg of centerLabelArcCenters) {
    const centerLabelGroup = createArcCenterLabel(
      CENTER_LABEL_TEXT,
      DIAGRAM_WHITE_CSS,
      CENTER_LABEL_FONT_PX,
      CENTER_LABEL_CHAR_PLANE_H,
      CENTER_LABEL_ARC_R,
      TIER_CENTER_DISK_Y + 0.002,
      arcCenterDeg,
      0.95,
    );
    ringGroup.add(centerLabelGroup);
  }

  function getCoinLabelY(): number {
    return TIER_CENTER_DISK_Y + COIN_LABEL_OFFSET_ABOVE_TITLE;
  }

  // 中間ドット（3領域）
  for (const hub of DOMAIN_HUBS) {
    const hubPos = posAtAngle(hub.angleDeg, DOMAIN_HUB_R, TIER_HUB_Y);

    const hubDot = new THREE.Mesh(
      new THREE.SphereGeometry(DOMAIN_HUB_DOT_R, 12, 12),
      new THREE.MeshBasicMaterial({ color: hub.hex }),
    );
    hubDot.position.copy(hubPos);
    ringGroup.add(hubDot);

    const hubLabel = createRadialLabelMesh(
      hub.label,
      hub.css,
      hub.angleDeg,
      0.9,
      DOMAIN_HUB_R,
      HUB_LABEL_PLANE_H,
      TIER_HUB_LABEL_Y,
      HUB_LABEL_FONT_PX,
    );
    ringGroup.add(hubLabel);
  }

  /** 円周 XZ 平面にラベルを配置（中心角度に傾け、外側へ左寄せ） */
  function createRadialLabelMesh(
    text: string,
    colorCss: string,
    angleDeg: number,
    opacity: number,
    anchorR = RING_R,
    planeH = LABEL_PLANE_H,
    labelY = TIER_KEYWORD_LABEL_Y,
    fontPx = LABEL_FONT_PX,
  ): THREE.Mesh {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const font = `500 ${fontPx}px var(--font-body, system-ui, sans-serif)`;

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
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(text, padX, logicalH / 2);

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

    const rad = (angleDeg * Math.PI) / 180;
    outward.set(Math.cos(rad), 0, Math.sin(rad));
    tangent.crossVectors(up, outward).normalize();

    const innerR = anchorR + LABEL_GAP;
    mesh.position.set(
      outward.x * (innerR + planeW / 2),
      labelY,
      outward.z * (innerR + planeW / 2),
    );

    // XZ 平面に固定（ビルボードなし）: 法線 +Y、テキストは外側へ左寄せ
    labelBasis.makeBasis(outward, tangent, up);
    mesh.quaternion.setFromRotationMatrix(labelBasis);
    mesh.renderOrder = 2;

    mesh.userData.labelTexture = texture;
    mesh.userData.planeW = planeW;
    mesh.userData.innerR = innerR;
    mesh.userData.angleDeg = angleDeg;
    return mesh;
  }

  function applyKeywordVisibility(pickedIds: Set<string> | null) {
    for (const kw of keywords) {
      const selected = pickedIds?.has(kw.id) ?? false;
      (dotMeshMap.get(kw.id)!.material as THREE.MeshBasicMaterial).opacity =
        selected ? DOT_OPACITY_ACTIVE : DOT_OPACITY_DIM;
      (labelMeshMap.get(kw.id)!.material as THREE.MeshBasicMaterial).opacity =
        selected ? LABEL_OPACITY_ACTIVE : LABEL_OPACITY_DIM;
    }
  }

  for (const kw of keywords) {
    const rad = (kw.angleDeg * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dz = Math.sin(rad);

    // 各ドットは固有のマテリアル（opacity を個別制御するため）
    const mat = new THREE.MeshBasicMaterial({
      color: DIAGRAM_WHITE_HEX,
      transparent: true,
      opacity: DOT_OPACITY_DIM,
    });
    const dot = new THREE.Mesh(dotGeo, mat);
    dot.position.set(RING_R * dx, TIER_KEYWORD_Y, RING_R * dz);
    ringGroup.add(dot);
    dotMeshMap.set(kw.id, dot);
    dotOrigPos.set(kw.id, dot.position.clone());

    // ラベル（Canvas テクスチャ平面 — 円周に沿って角度傾斜）
    const labelMesh = createRadialLabelMesh(
      kw.label,
      DIAGRAM_WHITE_CSS,
      kw.angleDeg,
      LABEL_OPACITY_DIM,
    );
    labelMeshMap.set(kw.id, labelMesh);
    ringGroup.add(labelMesh);
  }

  for (const link of buildGrayLinkPairs(keywords)) {
    addBezierTowardCenter(link.from, link.to);
  }

  // ── ハイライトアニメーション ──────────────────────────────────────────────
  type HLPhase = "idle" | "draw" | "merge" | "coin" | "shrink";
  let hlPhase: HLPhase = "idle";
  let hlStartTime = 0;
  let hlPicked: Keyword3D[] = [];
  let hlPickedIds = new Set<string>();
  let hlLines: THREE.Line[] = [];
  let hlPaths: THREE.Vector3[][] = [];
  let hlTravelDots: THREE.Mesh[] = [];
  let hlCenterSphere: THREE.Mesh | null = null;
  let hlCoinEl: HTMLSpanElement | null = null;
  let hlCoinObj: InstanceType<typeof CSS2DObject> | null = null;
  let hlTimeouts: ReturnType<typeof setTimeout>[] = [];

  function getHighlightCenterTarget(): THREE.Vector3 {
    return new THREE.Vector3(
      0,
      ringLocalYFromCirclePx(-HIGHLIGHT_LINE_END_PX_BELOW_CIRCLE),
      0,
    );
  }

  function disposeHighlightLines() {
    for (const line of hlLines) {
      ringGroup.remove(line);
      line.geometry.dispose();
      (line.material as THREE.LineBasicMaterial).dispose();
    }
    hlLines = [];
  }

  function disposeTravelDots() {
    for (const mesh of hlTravelDots) {
      ringGroup.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
    hlTravelDots = [];
    hlPaths = [];
  }

  function clearHL() {
    for (const t of hlTimeouts) clearTimeout(t);
    hlTimeouts = [];
    disposeCenterSphere();
    disposeHighlightLines();
    disposeTravelDots();
  }
  function after(ms: number, fn: () => void) {
    hlTimeouts.push(setTimeout(fn, ms));
  }

  function disposeCenterSphere() {
    if (!hlCenterSphere) return;
    ringGroup.remove(hlCenterSphere);
    hlCenterSphere.geometry.dispose();
    (hlCenterSphere.material as THREE.Material).dispose();
    hlCenterSphere = null;
  }

  function createCenterSphere() {
    disposeCenterSphere();
    hlCenterSphere = new THREE.Mesh(
      new THREE.SphereGeometry(CENTER_SPHERE_R, 40, 40),
      new THREE.MeshBasicMaterial({
        color: TRAVEL_DOT_COLOR,
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: true,
      }),
    );
    hlCenterSphere.scale.setScalar(0.001);
    hlCenterSphere.position.set(0, TIER_CENTER_DISK_Y, 0);
    // 中心円・枝線より手前、タイトル・造語より奥
    hlCenterSphere.renderOrder = 8;
    ringGroup.add(hlCenterSphere);
  }

  /** キーワード → 中心サークル下端付近への曲線パス */
  function buildPathToCenter(kw: Keyword3D): THREE.Vector3[] {
    const p0 = kwPos(kw);
    const p1 = getHighlightCenterTarget();
    const ctrl = new THREE.Vector3(
      (p0.x + p1.x) * 0.38,
      p0.y + (p1.y - p0.y) * 0.5,
      (p0.z + p1.z) * 0.38,
    );
    const SAMPLES = 56;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const mt = 1 - t;
      pts.push(
        new THREE.Vector3(
          mt * mt * p0.x + 2 * mt * t * ctrl.x + t * t * p1.x,
          mt * mt * p0.y + 2 * mt * t * ctrl.y + t * t * p1.y,
          mt * mt * p0.z + 2 * mt * t * ctrl.z + t * t * p1.z,
        ),
      );
    }
    return pts;
  }

  function createHighlightLine(path: THREE.Vector3[]): THREE.Line {
    const geo = new THREE.BufferGeometry().setFromPoints(path);
    geo.setDrawRange(0, 0);
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: TRAVEL_DOT_COLOR,
        transparent: true,
        opacity: 0.88,
      }),
    );
    return line;
  }

  function samplePath(path: THREE.Vector3[], t: number): THREE.Vector3 {
    const f = Math.max(0, Math.min(1, t)) * (path.length - 1);
    const i = Math.floor(f);
    const u = f - i;
    const a = path[i]!;
    const b = path[Math.min(i + 1, path.length - 1)]!;
    return new THREE.Vector3().lerpVectors(a, b, u);
  }

  function createTravelDot(): THREE.Mesh {
    const dot = new THREE.Mesh(
      new THREE.SphereGeometry(TRAVEL_DOT_R, 12, 12),
      new THREE.MeshBasicMaterial({
        color: TRAVEL_DOT_COLOR,
        transparent: true,
        opacity: 1,
        depthWrite: false,
      }),
    );
    dot.renderOrder = 20;
    return dot;
  }

  // ─── フェーズ: DRAW ──────────────────────────────────────────────────────
  function startCycle() {
    clearHL();

    // 3つ抽選・角度順にソート
    hlPicked = shuffled(keywords)
      .slice(0, 3)
      .sort((a, b) => a.angleDeg - b.angleDeg);
    hlPickedIds = new Set(hlPicked.map((k) => k.id));

    disposeHighlightLines();
    disposeTravelDots();

    for (const kw of hlPicked) {
      const path = buildPathToCenter(kw);
      hlPaths.push(path);
      const line = createHighlightLine(path);
      ringGroup.add(line);
      hlLines.push(line);

      const traveler = createTravelDot();
      traveler.position.copy(path[0]!);
      traveler.visible = false;
      ringGroup.add(traveler);
      hlTravelDots.push(traveler);
    }

    applyKeywordVisibility(hlPickedIds);

    hlPhase = "draw";
    hlStartTime = performance.now();

    after(HIGHLIGHT_DRAW_MS, startMerge);
  }

  // ─── フェーズ: MERGE ─────────────────────────────────────────────────────
  function startMerge() {
    hlPhase = "merge";
    hlStartTime = performance.now();
    for (const traveler of hlTravelDots) {
      traveler.visible = true;
    }
    after(HIGHLIGHT_MERGE_MS, startCoin);
  }

  // ─── フェーズ: COIN ──────────────────────────────────────────────────────
  function startCoin() {
    hlPhase = "coin";
    hlStartTime = performance.now();

    disposeTravelDots();

    // 中央ドット爆発（造語と同タイミング）
    createCenterSphere();

    // ── 造語ラベル ─────────────────────────────────────────────────────────
    const word = buildPortmanteau(hlPicked);
    hlCoinEl = document.createElement("span");
    hlCoinEl.textContent = word;
    Object.assign(hlCoinEl.style, {
      display: "block",
      fontSize: "clamp(16px, 2.2vw, 28px)",
      fontWeight: "700",
      color: DIAGRAM_WHITE_CSS,
      textAlign: "center",
      transform: "translate(-50%, -50%) scale(0)",
      opacity: "0",
      letterSpacing: "-0.02em",
      pointerEvents: "none",
      fontFamily: "var(--font-display, system-ui, sans-serif)",
      zIndex: "10",
      whiteSpace: "nowrap",
    });
    hlCoinObj = new CSS2DObject(hlCoinEl);
    hlCoinObj.position.set(0, getCoinLabelY(), 0);
    scene.add(hlCoinObj);

    after(COIN_POP_MS + COIN_HOLD_MS + COIN_FADE_MS, startShrink);
  }

  // ─── フェーズ: SHRINK ────────────────────────────────────────────────────
  function startShrink() {
    hlPhase = "shrink";
    hlStartTime = performance.now();

    if (hlCoinObj) {
      scene.remove(hlCoinObj);
      hlCoinObj = null;
      hlCoinEl = null;
    }
    disposeCenterSphere();
    disposeTravelDots();
    applyKeywordVisibility(null);

    after(HIGHLIGHT_SHRINK_MS + HIGHLIGHT_PAUSE_MS, startCycle);
  }

  // ── フレームごとの連続アニメーション更新 ─────────────────────────────────
  function updateHighlight(now: number) {
    const elapsed = now - hlStartTime;

    // DRAW: ラインを描画
    if (hlPhase === "draw") {
      const t = easeOut(Math.min(1, elapsed / HIGHLIGHT_DRAW_MS));
      for (const line of hlLines) {
        const cnt = line.geometry.attributes["position"]!.count;
        line.geometry.setDrawRange(0, Math.max(1, Math.floor(t * cnt)));
      }
    }

    // MERGE: 移動用ドットが曲線に沿って中心へ（キーワードのドットはそのまま）
    if (hlPhase === "merge") {
      const t = easeInOutCubic(Math.min(1, elapsed / HIGHLIGHT_MERGE_MS));
      for (let i = 0; i < hlTravelDots.length; i++) {
        const path = hlPaths[i];
        const traveler = hlTravelDots[i];
        if (!path || !traveler) continue;
        traveler.position.copy(samplePath(path, t));
      }
    }

    // COIN: 中央ドット爆発 + 造語ラベル
    if (hlPhase === "coin") {
      const centerMat = hlCenterSphere?.material as
        | THREE.MeshBasicMaterial
        | undefined;
      const fadeStart = COIN_POP_MS + COIN_HOLD_MS;
      const popProgress = Math.min(1, elapsed / COIN_POP_MS);

      if (elapsed <= COIN_POP_MS) {
        const burstScale = easeOutBack(popProgress);
        const burstOpacity = easeOut(Math.min(1, popProgress * 1.35));

        if (hlCenterSphere) {
          hlCenterSphere.scale.setScalar(Math.max(0.001, burstScale));
          hlCenterSphere.position.y = TIER_CENTER_DISK_Y;
        }
        if (centerMat) centerMat.opacity = burstOpacity * 0.92;

        if (hlCoinEl) {
          hlCoinEl.style.opacity = String(burstOpacity);
          hlCoinEl.style.transform = `translate(-50%, -50%) scale(${Math.max(0.001, burstScale)})`;
        }
        if (hlCoinObj) hlCoinObj.position.y = getCoinLabelY();
      } else if (elapsed <= fadeStart) {
        if (hlCenterSphere) {
          hlCenterSphere.scale.setScalar(1);
          hlCenterSphere.position.y = TIER_CENTER_DISK_Y;
        }
        if (centerMat) centerMat.opacity = 0.92;
        if (hlCoinEl) {
          hlCoinEl.style.opacity = "1";
          hlCoinEl.style.transform = "translate(-50%, -50%) scale(1)";
        }
        if (hlCoinObj) hlCoinObj.position.y = getCoinLabelY();
      } else {
        const fadeT = easeOut(
          Math.min(1, (elapsed - fadeStart) / COIN_FADE_MS),
        );
        const remain = 1 - fadeT;

        if (hlCenterSphere) {
          hlCenterSphere.scale.setScalar(1);
          hlCenterSphere.position.y = TIER_CENTER_DISK_Y;
        }
        if (centerMat) centerMat.opacity = remain * 0.92;

        if (hlCoinEl) {
          hlCoinEl.style.opacity = String(remain);
          hlCoinEl.style.transform = "translate(-50%, -50%) scale(1)";
        }
        if (hlCoinObj) hlCoinObj.position.y = getCoinLabelY();
      }
    }

    // SHRINK: ドット側から中心側へ消える
    if (hlPhase === "shrink") {
      const t = easeIn(Math.min(1, elapsed / HIGHLIGHT_SHRINK_MS));
      for (const line of hlLines) {
        const cnt = line.geometry.attributes["position"]!.count;
        const start = Math.floor(t * cnt);
        line.geometry.setDrawRange(start, Math.max(0, cnt - start));
      }
    }
  }

  // ── メインアニメーションループ ────────────────────────────────────────────
  let rafId = 0;
  let lastFrameTime = 0;
  const animate = (now: number) => {
    rafId = requestAnimationFrame(animate);
    if (lastFrameTime > 0) {
      const delta = Math.min(0.05, (now - lastFrameTime) / 1000);
      if (!reduceMotion) {
        ringGroup.rotation.y += RING_ROTATION_RAD_PER_S * delta;
      }
    }
    lastFrameTime = now;
    if (!reduceMotion) {
      updateHighlight(now);
    }
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
  };
  rafId = requestAnimationFrame(animate);

  // アニメーション開始
  if (!reduceMotion) startCycle();

  // リサイズ対応
  const resizeObs = new ResizeObserver(() => {
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    camera.aspect = cw / ch;
    camera.updateProjectionMatrix();
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
