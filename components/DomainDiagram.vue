<template>
  <div class="domain-diagram">
    <svg
      viewBox="0 0 1000 590"
      xmlns="http://www.w3.org/2000/svg"
      class="domain-diagram__svg"
      @mouseleave="hoveredDomain = null"
    >
      <!-- Circle boundary -->
      <!-- Three domain points at 120° intervals: Media(top), Knowledge(bottom-left), Design(bottom-right) -->
      <!-- Center(500,285) r=210 → Media(500,75), Knowledge(318,390), Design(682,390) -->
      <defs>
        <linearGradient
          :id="highlightGradientId"
          gradientUnits="userSpaceOnUse"
          x1="220"
          y1="55"
          x2="840"
          y2="535"
        >
          <stop offset="0%" stop-color="#d94a55" />
          <stop offset="48%" stop-color="#3d6eb8" />
          <stop offset="100%" stop-color="#2a9d5f" />
        </linearGradient>
      </defs>
      <circle
        cx="500"
        cy="285"
        r="210"
        fill="none"
        stroke="#ccc8c6"
        stroke-width="1"
      />

      <!-- グレー接続: 初回のみ生成・シャッフルなし（アニメなし） -->
      <g class="domain-diagram__links" pointer-events="none" aria-hidden="true">
        <path
          v-for="seg in grayLinkPaths"
          :key="seg.key"
          :d="seg.d"
          class="domain-diagram__link-path"
        />
      </g>

      <!-- ランダム10ノード: 伸びる → 少し待つ → 縮む → 再選択（グレーと同じ太さ） -->
      <g
        v-if="highlightLinkPaths.length"
        class="domain-diagram__highlight-links"
        :class="highlightPhaseClass"
        pointer-events="none"
        aria-hidden="true"
        :style="highlightTimingCssVars"
      >
        <path
          v-for="seg in highlightLinkPaths"
          :key="`${seg.key}@${highlightAnimEpoch}`"
          pathLength="1"
          :d="seg.d"
          class="domain-diagram__highlight-link-path"
          :stroke="`url(#${highlightGradientId})`"
        />
      </g>

      <!-- 3ドメイン: ドットなし・円内の専用位置にラベルのみ -->
      <g
        v-for="dl in domainLabels"
        :key="dl.id"
        class="kw-group"
        :style="{ opacity: kwOpacity(dl.domain) }"
        @mouseenter="hoveredDomain = dl.domain"
        @mouseleave="hoveredDomain = null"
      >
        <text
          :x="dl.x"
          :y="dl.y"
          :text-anchor="dl.textAnchor"
          :fill="domainColor(dl.domain)"
          class="domain-label-text domain-diagram__domain-label"
        >
          {{ dl.label }}
        </text>
      </g>

      <!-- キーワード: 円周上のドット + 扇ルールのラベル -->
      <g
        v-for="kw in keywords"
        :key="kw.id"
        class="kw-group"
        :style="{ opacity: keywordGroupOpacity(kw) }"
        @mouseenter="hoveredDomain = kw.domain"
        @mouseleave="hoveredDomain = null"
      >
        <circle
          :cx="kwXY(kw).x"
          :cy="kwXY(kw).y"
          :r="2.5"
          :fill="domainColor(kw.domain)"
        />
        <text
          :x="labelXY(kw).x"
          :y="labelXY(kw).y"
          :text-anchor="labelAnchor(kw)"
          :fill="domainColor(kw.domain)"
          class="kw-label"
        >
          {{ kw.label }}
        </text>
      </g>

      <!-- Center label -->
      <text
        x="500"
        y="290"
        text-anchor="middle"
        fill="#1c1b1b"
        class="center-label"
      >
        知能メディア工学科
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId } from "vue";

type Domain =
  | "media"
  | "knowledge"
  | "design"
  | "media-knowledge"
  | "media-design"
  | "all";

interface Keyword {
  id: string;
  label: string;
  /** 円周上の位置（度）。0°=右、90°=下、180°=左、270°/-90°=上（center 500,285, r=210 と整合） */
  angleDeg: number;
  domain: Domain;
  /** ラベル座標の微調整（labelXY の基準点に加算） */
  offsetX?: number;
  offsetY?: number;
}

interface LinkSeg {
  key: string;
  d: string;
}

/** 円内に置くドメイン名（ドットなし） */
interface DomainLabelSpec {
  id: string;
  label: string;
  domain: Extract<Domain, "media" | "knowledge" | "design">;
  x: number;
  y: number;
  textAnchor: "start" | "middle" | "end";
}

const hoveredDomain = ref<Domain | null>(null);

const COLORS: Record<Domain, string> = {
  media: "#a14e58",
  knowledge: "#3d6b4a",
  design: "#4a6fa3",
  "media-knowledge": "#7a7574",
  "media-design": "#7a7574",
  all: "#7a7574",
};

const RELATED: Partial<Record<Domain, Domain[]>> = {
  media: ["media-knowledge", "media-design", "all"],
  knowledge: ["media-knowledge", "all"],
  design: ["media-design", "all"],
  "media-knowledge": ["media", "knowledge", "all"],
  "media-design": ["media", "design", "all"],
  all: ["media", "knowledge", "design", "media-knowledge", "media-design"],
};

function domainColor(domain: Domain): string {
  return COLORS[domain];
}

function kwOpacity(domain: Domain): number {
  if (!hoveredDomain.value) return 1;
  const hd = hoveredDomain.value;
  if (domain === hd) return 1;
  if (RELATED[hd]?.includes(domain)) return 0.45;
  return 0.08;
}

const highlightGradientId = `domain-diagram-hl-${useId()}`.replace(
  /[^a-zA-Z0-9-]/g,
  "",
);
const spotlightActive = ref(false);
const highlightSelectedIds = ref(new Set<string>());
const highlightLinkPaths = ref<LinkSeg[]>([]);
const highlightAnimEpoch = ref(0);

/** グレー線ホールド中のスポットライト: 非選択キーワードのみ薄く */
function keywordGroupOpacity(kw: Keyword): number {
  const base = kwOpacity(kw.domain);
  if (!spotlightActive.value) return base;
  if (highlightSelectedIds.value.has(kw.id)) return base;
  return base * 0.42;
}

const CX = 500;
const CY = 285;
const R = 210;

function polarToXY(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

/**
 * 2頂点間の弧（from→to を短い方、ここでは各120°）に count 個のドットを置く。
 * 頂点↔ドット↔…↔ドット↔頂点の弧長がすべて等しい（弧を count+1 等分）。
 */
function equalArcDots(fromDeg: number, toDeg: number, count: number): number[] {
  const span = toDeg - fromDeg;
  const gap = span / (count + 1);
  return Array.from({ length: count }, (_, i) => fromDeg + gap * (i + 1));
}

// ドメイン頂点 30° / 150° / −90° の各120°弧上で、隣り合うドット間の円弧距離を一定にする
const angDesignToKnowledge = equalArcDots(30, 150, 16); // all×5 + k×11
const angKnowledgeToMedia = equalArcDots(150, 270, 14); // mk×5 + m×9
const angMediaToDesign = equalArcDots(-90, 30, 15); // md×5 + d×10

/** 円周の位置に応じたラベル配置: 上=真上・左寄せ、左=左・右寄せ、下=下・左寄せ */
function labelSideFromAngleDeg(angleDeg: number): "top" | "left" | "bottom" {
  const d = ((angleDeg % 360) + 360) % 360;
  if (d >= 200 && d <= 340) return "top";
  if (d >= 82 && d <= 198) return "left";
  return "bottom";
}

/** 音場シミュレーション〜バーチャルリアリティ: ドット左・右寄せ */
const IDS_LABEL_LEFT_MEDIA = new Set([
  "m2",
  "m3",
  "m4",
  "m5",
  "m6",
  "m7",
  "m8",
  "m9",
]);
/** 映像・CG…〜インタフェースエージェント: ドットの右側にラベル */
const IDS_LABEL_RIGHT_CLUSTER = new Set([
  "d5",
  "d6",
  "d7",
  "d8",
  "d9",
  "d10",
  "all1",
  "all2",
  "all3",
  "all4",
  "all5",
]);
/** マルチエージェントシステム〜テキストマイニング: ドット左下・右寄せ（重なりは各 keyword の offsetX/Y で調整） */
const IDS_LABEL_BL_KNOWLEDGE = new Set(["k5", "k4", "k3"]);

type LabelOverride = "mediaArcLeft" | "rightOfDot" | "knowledgeBL";

function labelOverride(kw: Keyword): LabelOverride | null {
  if (IDS_LABEL_LEFT_MEDIA.has(kw.id)) return "mediaArcLeft";
  if (IDS_LABEL_RIGHT_CLUSTER.has(kw.id)) return "rightOfDot";
  if (IDS_LABEL_BL_KNOWLEDGE.has(kw.id)) return "knowledgeBL";
  return null;
}

function labelAnchor(kw: Keyword): "start" | "end" {
  const o = labelOverride(kw);
  if (o === "mediaArcLeft" || o === "knowledgeBL") return "end";
  if (o === "rightOfDot") return "start";
  return labelSideFromAngleDeg(kw.angleDeg) === "left" ? "end" : "start";
}

function labelXY(kw: Keyword): { x: number; y: number } {
  const { x, y } = polarToXY(kw.angleDeg);
  const gap = 9;
  const dy = 4;
  const o = labelOverride(kw);
  let pt: { x: number; y: number };
  if (o === "mediaArcLeft") {
    pt = { x: x - gap - 3, y: y + dy };
  } else if (o === "rightOfDot") {
    pt = { x: x + gap + 3, y: y + dy };
  } else if (o === "knowledgeBL") {
    const hPad = 5;
    const vBase = 5;
    pt = { x: x - hPad, y: y + vBase };
  } else {
    const side = labelSideFromAngleDeg(kw.angleDeg);
    switch (side) {
      case "top":
        pt = { x, y: y - gap };
        break;
      case "left":
        pt = { x: x - gap, y: y + dy };
        break;
      default:
        pt = { x, y: y + gap + dy };
    }
  }
  return {
    x: pt.x + (kw.offsetX ?? 0),
    y: pt.y + (kw.offsetY ?? 0),
  };
}

/** 円内の点（中心から angleDeg・半径 rIn） */
function innerPolar(angleDeg: number, rIn: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: CX + rIn * Math.cos(rad), y: CY + rIn * Math.sin(rad) };
}

// メディア弧（angKnowledgeToMedia の赤クラスタ）の角度レンジ中央 ≈ 210° 付近の内側
const mediaArcMidDeg =
  (angKnowledgeToMedia[0] +
    angKnowledgeToMedia[angKnowledgeToMedia.length - 1]) /
  2;

const domainLabels: DomainLabelSpec[] = [
  {
    id: "dl-media",
    label: "メディア工学",
    domain: "media",
    ...(() => {
      const p = innerPolar(mediaArcMidDeg + 20, 158);
      return { x: p.x, y: p.y + 5, textAnchor: "middle" as const };
    })(),
  },
  {
    id: "dl-design",
    label: "情報デザイン",
    domain: "design",
    ...(() => {
      const p = innerPolar(-20, 148);
      return { x: p.x, y: p.y + 5, textAnchor: "middle" as const };
    })(),
  },
  {
    id: "dl-knowledge",
    label: "知能工学",
    domain: "knowledge",
    ...(() => {
      const p = innerPolar(122, 150);
      return { x: p.x, y: p.y + 5, textAnchor: "middle" as const };
    })(),
  },
];

function kwXY(kw: Keyword): { x: number; y: number } {
  return polarToXY(kw.angleDeg);
}

// ─────────────────────────────────────────────────────────────────────────────
// Circle: center(500,285), r=210。各120°弧で頂点間を等分し、ドット間の円弧距離を揃える。
// ─────────────────────────────────────────────────────────────────────────────
const keywords: Keyword[] = [
  // ── MEDIA（Knowledge→Media 弧の後半、等間隔）────────────────────────────
  {
    id: "m1",
    label: "３D音響",
    angleDeg: angKnowledgeToMedia[5],
    domain: "media",
  },
  {
    id: "m2",
    label: "音場シミュレーション",
    angleDeg: angKnowledgeToMedia[6],
    domain: "media",
  },
  {
    id: "m3",
    label: "音声伝達",
    angleDeg: angKnowledgeToMedia[7],
    domain: "media",
  },
  {
    id: "m4",
    label: "話者認識",
    angleDeg: angKnowledgeToMedia[8],
    domain: "media",
  },
  {
    id: "m5",
    label: "歌声合成",
    angleDeg: angKnowledgeToMedia[9],
    domain: "media",
  },
  {
    id: "m6",
    label: "画像/映像処理",
    angleDeg: angKnowledgeToMedia[10],
    domain: "media",
  },
  {
    id: "m7",
    label: "画像/映像合成",
    angleDeg: angKnowledgeToMedia[11],
    domain: "media",
  },
  {
    id: "m8",
    label: "画像/映像符号化と伝送",
    angleDeg: angKnowledgeToMedia[12],
    domain: "media",
    offsetY: -4,
    offsetX: 4,
  },
  {
    id: "m9",
    label: "バーチャルリアリティ",
    angleDeg: angKnowledgeToMedia[13],
    domain: "media",
    offsetY: -12,
    offsetX: 10,
  },

  // ── KNOWLEDGE（Design→Knowledge 弧の後半、等間隔）────────────────────────
  {
    id: "k1",
    label: "ユビキタスコンピューティング",
    angleDeg: angDesignToKnowledge[5],
    domain: "knowledge",
    offsetY: -4,
    offsetX: 4,
  },
  {
    id: "k2",
    label: "ITS（Intelligent Transport Systems）",
    angleDeg: angDesignToKnowledge[6],
    domain: "knowledge",
  },
  {
    id: "k3",
    label: "テキストマイニング",
    angleDeg: angDesignToKnowledge[7],
    domain: "knowledge",
    offsetY: 15,
    offsetX: 90,
  },
  {
    id: "k4",
    label: "環境認識",
    angleDeg: angDesignToKnowledge[8],
    domain: "knowledge",
    offsetY: 13,
    offsetX: 10,
  },
  {
    id: "k5",
    label: "コンピュータネットワーク",
    angleDeg: angDesignToKnowledge[9],
    domain: "knowledge",
    offsetY: 6,
    offsetX: 4,
  },
  {
    id: "k6",
    label: "データマイニング",
    angleDeg: angDesignToKnowledge[10],
    domain: "knowledge",
    offsetY: 3,
    offsetX: 4,
  },
  {
    id: "k7",
    label: "マルチエージェントシステム",
    angleDeg: angDesignToKnowledge[11],
    domain: "knowledge",
  },
  {
    id: "k8",
    label: "ビッグデータ",
    angleDeg: angDesignToKnowledge[12],
    domain: "knowledge",
  },
  {
    id: "k9",
    label: "人工知能",
    angleDeg: angDesignToKnowledge[13],
    domain: "knowledge",
  },
  {
    id: "k10",
    label: "機械学習",
    angleDeg: angDesignToKnowledge[14],
    domain: "knowledge",
  },
  {
    id: "k11",
    label: "ディープラーニング",
    angleDeg: angDesignToKnowledge[15],
    domain: "knowledge",
  },

  // ── DESIGN（Media→Design 弧の後半、等間隔）──────────────────────────────
  {
    id: "d1",
    label: "テクノロジーアート",
    angleDeg: angMediaToDesign[5],
    domain: "design",
  },
  {
    id: "d2",
    label: "ソーシャルデザイン",
    angleDeg: angMediaToDesign[6],
    domain: "design",
  },
  {
    id: "d3",
    label: "サービスデザイン",
    angleDeg: angMediaToDesign[7],
    domain: "design",
  },
  {
    id: "d4",
    label: "ユーザエクスペリエンスデザイン/人間中心設計",
    angleDeg: angMediaToDesign[8],
    domain: "design",
  },
  {
    id: "d5",
    label: "映像・CG・アニメーションデザイン",
    angleDeg: angMediaToDesign[9],
    domain: "design",
  },
  {
    id: "d6",
    label: "Webデザイン/アプリケーションデザイン",
    angleDeg: angMediaToDesign[10],
    domain: "design",
  },
  {
    id: "d7",
    label: "ユーザインタフェースデザイン",
    angleDeg: angMediaToDesign[11],
    domain: "design",
  },
  {
    id: "d8",
    label: "プロダクトデザイン/デジタルファブリケーション",
    angleDeg: angMediaToDesign[12],
    domain: "design",
  },
  {
    id: "d9",
    label: "ビジュアライゼーション",
    angleDeg: angMediaToDesign[13],
    domain: "design",
  },
  {
    id: "d10",
    label: "コミュニケーションデザイン",
    angleDeg: angMediaToDesign[14],
    domain: "design",
  },

  // ── MEDIA × KNOWLEDGE（Knowledge→Media 弧の前半、等間隔）────────────────
  {
    id: "mk1",
    label: "AR（拡張現実）",
    angleDeg: angKnowledgeToMedia[0],
    domain: "media-knowledge",
  },
  {
    id: "mk2",
    label: "音声認識",
    angleDeg: angKnowledgeToMedia[1],
    domain: "media-knowledge",
  },
  {
    id: "mk3",
    label: "画像認識",
    angleDeg: angKnowledgeToMedia[2],
    domain: "media-knowledge",
  },
  {
    id: "mk4",
    label: "インテリジェント拡声システム",
    angleDeg: angKnowledgeToMedia[3],
    domain: "media-knowledge",
  },
  {
    id: "mk5",
    label: "音の情景分析",
    angleDeg: angKnowledgeToMedia[4],
    domain: "media-knowledge",
  },

  // ── MEDIA × DESIGN（Media→Design 弧の前半、等間隔）──────────────────────
  {
    id: "md1",
    label: "マルチモーダルインタフェース",
    angleDeg: angMediaToDesign[0],
    domain: "media-design",
    offsetY: -8,
    offsetX: -4,
  },
  {
    id: "md2",
    label: "サウンドデザイン",
    angleDeg: angMediaToDesign[1],
    domain: "media-design",
    offsetY: -2,
  },
  {
    id: "md3",
    label: "音環境デザイン",
    angleDeg: angMediaToDesign[2],
    domain: "media-design",
  },
  {
    id: "md4",
    label: "メディアデザイン",
    angleDeg: angMediaToDesign[3],
    domain: "media-design",
  },
  {
    id: "md5",
    label: "サイエンティフィック・ビジュアライゼーション",
    angleDeg: angMediaToDesign[4],
    domain: "media-design",
  },

  // ── 三領域（Design→Knowledge 弧の前半、等間隔）──────────────────────────
  {
    id: "all1",
    label: "データ可視化",
    angleDeg: angDesignToKnowledge[0],
    domain: "all",
  },
  {
    id: "all2",
    label: "IoT（Internet of Things）",
    angleDeg: angDesignToKnowledge[1],
    domain: "all",
  },
  {
    id: "all3",
    label: "インテリジェントプロダクトデザイン",
    angleDeg: angDesignToKnowledge[2],
    domain: "all",
  },
  {
    id: "all4",
    label: "インテリジェントインタフェースデザイン",
    angleDeg: angDesignToKnowledge[3],
    domain: "all",
  },
  {
    id: "all5",
    label: "インタフェースエージェント",
    angleDeg: angDesignToKnowledge[4],
    domain: "all",
    offsetX: -4,
  },
];

// ── グレー接続: マウント時に1回だけ生成（シャッフル・再生成なし）────────────────
const grayLinkPaths = ref<LinkSeg[]>([]);

function buildGrayLinks(): LinkSeg[] {
  const seen = new Set<string>();
  const segs: LinkSeg[] = [];
  const order = [...keywords];
  shuffleInPlace(order);

  for (const kw of order) {
    const peers = keywords.filter((k) => k.id !== kw.id);
    shuffleInPlace(peers);
    let n = 0;
    for (const t of peers) {
      if (n >= 3) break;
      const k = edgeKey(kw.id, t.id);
      if (seen.has(k)) continue;
      seen.add(k);
      n++;
      segs.push({ key: k, d: bezierTowardCenter(kw, t) });
    }
  }
  return segs;
}

// ── ハイライト10ノード: 伸びる → 少し待つ → 縮む → 再選択を繰り返し ─────────────
const highlightPhase = ref<"draw" | "hold" | "shrink">("draw");
const HIGHLIGHT_DRAW_MS = 700;
const HIGHLIGHT_WAIT_MS = 900;
const HIGHLIGHT_SHRINK_MS = 700;

const highlightPhaseClass = computed(() => ({
  "domain-diagram__highlight-links--draw": highlightPhase.value === "draw",
  "domain-diagram__highlight-links--hold": highlightPhase.value === "hold",
  "domain-diagram__highlight-links--shrink": highlightPhase.value === "shrink",
}));

const highlightTimingCssVars = computed(() => ({
  "--highlight-draw-ms": `${HIGHLIGHT_DRAW_MS}ms`,
  "--highlight-shrink-ms": `${HIGHLIGHT_SHRINK_MS}ms`,
}));

let diagramTimeouts: ReturnType<typeof setTimeout>[] = [];

function clearDiagramTimeouts(): void {
  diagramTimeouts.forEach(clearTimeout);
  diagramTimeouts = [];
}

function afterDiagramDelay(ms: number, fn: () => void): void {
  diagramTimeouts.push(setTimeout(fn, ms));
}

function pickRandomHighlightRing(): void {
  const pool = [...keywords];
  shuffleInPlace(pool);
  const n = Math.min(10, pool.length);
  const picked = pool.slice(0, n);
  highlightSelectedIds.value = new Set(picked.map((p) => p.id));
  highlightAnimEpoch.value += 1;
  highlightLinkPaths.value = buildHighlightRing(picked);
}

function startHighlightCycle(): void {
  if (linkMotionReduced.value) return;
  clearDiagramTimeouts();
  spotlightActive.value = true;
  pickRandomHighlightRing();
  highlightPhase.value = "draw";

  afterDiagramDelay(HIGHLIGHT_DRAW_MS, () => {
    highlightPhase.value = "hold";
  });

  afterDiagramDelay(HIGHLIGHT_DRAW_MS + HIGHLIGHT_WAIT_MS, () => {
    highlightPhase.value = "shrink";
  });

  afterDiagramDelay(
    HIGHLIGHT_DRAW_MS + HIGHLIGHT_WAIT_MS + HIGHLIGHT_SHRINK_MS,
    () => {
      startHighlightCycle();
    },
  );
}

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

function sortKeywordsByAngle(nodes: Keyword[]): Keyword[] {
  return [...nodes].sort((a, b) => a.angleDeg - b.angleDeg);
}

/** ハイライト用: 端点を中心へ引く C 曲線（決定的・SSR 安全） */
function bezierTowardCenterDeterministic(from: Keyword, to: Keyword): string {
  const p0 = kwXY(from);
  const p3 = kwXY(to);
  const mix =
    ((((from.angleDeg * 31 + to.angleDeg * 17) % 1000) + 1000) % 1000) / 1000;
  const t1 = 0.38 + mix * 0.2;
  const t2 = 0.38 + (1 - mix) * 0.2;
  const c1x = p0.x + t1 * (CX - p0.x);
  const c1y = p0.y + t1 * (CY - p0.y);
  const c2x = p3.x + t2 * (CX - p3.x);
  const c2y = p3.y + t2 * (CY - p3.y);
  return `M ${p0.x} ${p0.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p3.x} ${p3.y}`;
}

/** ランダム10ノードを円周角度順に並べ、閉ループで結ぶ */
function buildHighlightRing(selected: Keyword[]): LinkSeg[] {
  if (selected.length < 2) return [];
  const sorted = sortKeywordsByAngle(selected);
  const segs: LinkSeg[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i]!;
    const b = sorted[(i + 1) % sorted.length]!;
    segs.push({
      key: `hl-${edgeKey(a.id, b.id)}`,
      d: bezierTowardCenterDeterministic(a, b),
    });
  }
  return segs;
}

/** 端点を中心方向へ引っ張った制御点で C 曲線（わずかにランダムで自然な弧） */
function bezierTowardCenter(from: Keyword, to: Keyword): string {
  const p0 = kwXY(from);
  const p3 = kwXY(to);
  const t1 = 0.4 + Math.random() * 0.16;
  const t2 = 0.4 + Math.random() * 0.16;
  let c1x = p0.x + t1 * (CX - p0.x);
  let c1y = p0.y + t1 * (CY - p0.y);
  let c2x = p3.x + t2 * (CX - p3.x);
  let c2y = p3.y + t2 * (CY - p3.y);
  const jitter = 2.5 + Math.random() * 3.5;
  c1x += (Math.random() - 0.5) * jitter;
  c1y += (Math.random() - 0.5) * jitter;
  c2x += (Math.random() - 0.5) * jitter;
  c2y += (Math.random() - 0.5) * jitter;
  return `M ${p0.x} ${p0.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p3.x} ${p3.y}`;
}

const linkMotionReduced = ref(false);

onMounted(() => {
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  linkMotionReduced.value = reduceMotion;
  grayLinkPaths.value = buildGrayLinks();

  if (reduceMotion) return;

  startHighlightCycle();
});

onUnmounted(() => {
  clearDiagramTimeouts();
  spotlightActive.value = false;
});
</script>

<style scoped>
.domain-diagram {
  width: 100%;
  overflow-x: auto;
}

.domain-diagram__svg {
  width: max(100%, 700px);
  height: auto;
  display: block;
}

.domain-diagram__link-path {
  fill: none;
  stroke: #b8b3b0;
  stroke-width: 0.85;
  stroke-opacity: 0.32;
  stroke-linecap: round;
}

.domain-diagram__highlight-links {
  pointer-events: none;
  --highlight-draw-ms: 700ms;
  --highlight-shrink-ms: 700ms;
}

.domain-diagram__highlight-link-path {
  fill: none;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-opacity: 0.8;
  stroke-dasharray: 1;
}

.domain-diagram__highlight-links--hold .domain-diagram__highlight-link-path {
  animation: none;
  stroke-dashoffset: 0;
}

.domain-diagram__highlight-links--draw .domain-diagram__highlight-link-path {
  stroke-dashoffset: 1;
  animation: domain-diagram-highlight-draw var(--highlight-draw-ms) ease-out
    forwards;
}

.domain-diagram__highlight-links--shrink .domain-diagram__highlight-link-path {
  stroke-dashoffset: 0;
  animation: domain-diagram-highlight-shrink var(--highlight-shrink-ms) ease-in
    forwards;
}

@keyframes domain-diagram-highlight-draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes domain-diagram-highlight-shrink {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .domain-diagram__highlight-link-path {
    stroke-dashoffset: 0 !important;
    animation: none !important;
  }
}

.kw-group {
  cursor: default;
  transition: opacity var(--transition-fast);
}

.kw-label {
  font-family: var(--font-body);
  font-size: 10px;
  pointer-events: none;
}

.domain-label-text {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.02em;
  pointer-events: none;
}

/* 円内ドメイン名はホバー判定のためテキストがイベントを受け取る */
.domain-diagram__domain-label {
  pointer-events: auto;
}

.center-label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  pointer-events: none;
}
</style>
