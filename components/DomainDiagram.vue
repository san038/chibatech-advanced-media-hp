<template>
  <div
    class="domain-diagram"
    :class="{ 'domain-diagram--hero': variant === 'hero' }"
  >
    <svg
      viewBox="0 0 1000 590"
      xmlns="http://www.w3.org/2000/svg"
      class="domain-diagram__svg"
      @mouseleave="setHovered(null)"
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
        <linearGradient
          :id="highlightFillGradientId"
          gradientUnits="userSpaceOnUse"
          x1="220"
          y1="55"
          x2="840"
          y2="535"
        >
          <stop offset="0%" stop-color="#d94a55" stop-opacity="0.38" />
          <stop offset="48%" stop-color="#3d6eb8" stop-opacity="0.32" />
          <stop offset="100%" stop-color="#2a9d5f" stop-opacity="0.38" />
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

      <!-- ランダム3ノード: 線で結ぶ → 塗る → 中央へ合体 → 縮む → 再選択 -->
      <g
        v-if="highlightRingPathD"
        class="domain-diagram__highlight-links"
        :class="highlightPhaseClass"
        pointer-events="none"
        aria-hidden="true"
        :style="highlightTimingCssVars"
      >
        <path
          v-if="highlightFillPathD"
          :key="`fill-${highlightAnimEpoch}`"
          :d="highlightFillPathD"
          class="domain-diagram__highlight-fill-path"
          :fill="`url(#${highlightFillGradientId})`"
        />
        <path
          :key="highlightAnimEpoch"
          pathLength="1"
          :d="highlightRingPathD"
          class="domain-diagram__highlight-link-path"
          :stroke="`url(#${highlightGradientId})`"
        />
      </g>

      <!-- 合体の瞬間: 中央で広がるパルス -->
      <g
        v-if="mergeBurstVisible"
        :transform="`translate(${CX} ${CY})`"
        pointer-events="none"
        aria-hidden="true"
      >
        <g class="domain-diagram__merge-burst">
          <circle
            cx="0"
            cy="0"
            r="14"
            :fill="`url(#${highlightGradientId})`"
          />
        </g>
      </g>

      <!-- 3語から生成した造語: ぽんっと表示 → ふわっと消える -->
      <g
        v-if="coinedWordVisible"
        :transform="`translate(${CX} ${CY})`"
        pointer-events="none"
        aria-hidden="true"
      >
        <g
          class="domain-diagram__coined-word"
          :class="`domain-diagram__coined-word--${coinedWordPhase}`"
        >
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="central"
            class="domain-diagram__coined-word-text"
            :font-size="coinedWordFontSize"
            :fill="`url(#${highlightGradientId})`"
          >
            {{ coinedWord }}
          </text>
        </g>
      </g>

      <!-- 3ドメイン: ドットなし・円内の専用位置にラベルのみ -->
      <g
        v-for="dl in domainLabels"
        :key="dl.id"
        class="kw-group"
        :style="{ opacity: kwOpacity(dl.domain) }"
        @mouseenter="setHovered(dl.domain)"
        @mouseleave="setHovered(null)"
      >
        <rect
          v-bind="domainLabelPillRect(dl)"
          :fill="domainColor(dl.domain)"
          class="domain-label-pill"
        />
        <text
          :x="dl.x"
          :y="dl.y"
          :text-anchor="dl.textAnchor"
          fill="#fff"
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
        :class="keywordGroupClasses(kw)"
        :transform="keywordGroupTransform(kw)"
        :style="keywordGroupStyle(kw)"
        @mouseenter="setHovered(kw.domain)"
        @mouseleave="setHovered(null)"
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
      <!-- <g class="center-label-group">
        <rect
          v-bind="centerLabelPillRect"
          fill="#000000"
          class="center-label-pill"
        />
        <text
          x="500"
          y="290"
          text-anchor="middle"
          fill="#fff"
          class="center-label"
        >
          {{ CENTER_LABEL_TEXT }}
        </text>
      </g> -->
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useId } from "vue";

const props = withDefaults(
  defineProps<{
    /** default: about 等のコンテンツ幅 / hero: ヒーロー背景用の大型表示 */
    variant?: "default" | "hero";
  }>(),
  { variant: "default" },
);

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

function setHovered(domain: Domain | null): void {
  if (props.variant === "hero") return;
  hoveredDomain.value = domain;
}

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
const highlightFillGradientId = `domain-diagram-hl-fill-${useId()}`.replace(
  /[^a-zA-Z0-9-]/g,
  "",
);
const spotlightActive = ref(false);
const highlightSelectedIds = ref(new Set<string>());
const highlightPickedKeywords = ref<Keyword[]>([]);
const coinedWord = ref("");
const coinedWordVisible = ref(false);
const coinedWordPhase = ref<"pop" | "fade">("pop");
/** 選択ノードの閉路を一筆の path の d に連結 */
const highlightRingPathD = ref("");
/** 閉路の内側塗り（線と同じベジェ形状） */
const highlightFillPathD = ref("");
const highlightAnimEpoch = ref(0);

/** グレー線ホールド中のスポットライト: 非選択キーワードのみ薄く */
function keywordGroupOpacity(kw: Keyword): number {
  const base = kwOpacity(kw.domain);
  if (!spotlightActive.value) return base;
  if (highlightSelectedIds.value.has(kw.id)) {
    if (
      highlightPhase.value === "shrink" ||
      highlightPhase.value === "coin"
    ) {
      return 0;
    }
    return base;
  }
  return base * 0.42;
}

function keywordGroupClasses(kw: Keyword): Record<string, boolean> {
  const selected =
    spotlightActive.value && highlightSelectedIds.value.has(kw.id);
  return {
    "kw-group--selected": selected,
    "kw-group--merging": selected && highlightPhase.value === "merge",
  };
}

/** 円周ドットを現在位置から円の中心 (CX,CY) へ補間移動 */
function keywordGroupTransform(kw: Keyword): string | undefined {
  if (
    highlightPhase.value !== "merge" ||
    !highlightSelectedIds.value.has(kw.id)
  ) {
    return undefined;
  }
  const { x, y } = kwXY(kw);
  const t = mergeAnimProgress.value;
  const dx = t * (CX - x);
  const dy = t * (CY - y);
  // 中央へ向かうほど拡大（t=1 で約2倍）
  const scale = 1 + t * 1;
  // t=0 で恒等変換、t=1 でドットが (CX,CY) に重なる
  return `translate(${dx} ${dy}) translate(${x} ${y}) scale(${scale}) translate(${-x} ${-y})`;
}

function keywordGroupStyle(kw: Keyword): Record<string, string> {
  const style: Record<string, string> = {};
  const isMerging =
    highlightPhase.value === "merge" &&
    highlightSelectedIds.value.has(kw.id);
  if (isMerging) {
    style.opacity = String(1 - mergeAnimProgress.value * 0.95);
  } else {
    style.opacity = String(keywordGroupOpacity(kw));
  }
  return style;
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

/** 円内ドメイン名: text の baseline(y)・text-anchor 中央に合わせた角丸矩形 */
function domainLabelPillRect(dl: DomainLabelSpec) {
  const fontPx = 15;
  const padX = 10;
  const padY = 4;
  const ascent = 11;
  const descent = 4;
  const charW = fontPx * 0.92;
  const w = Math.max(dl.label.length * charW + padX * 2, fontPx * 3 + padX * 2);
  const h = ascent + descent + padY * 2;
  const x = dl.x - w / 2;
  const y = dl.y - ascent - padY;
  return { x, y: y - 2, width: w, height: h, rx: 0 };
}

const CENTER_LABEL_TEXT = "知能メディア工学科";

const centerLabelPillRect = (() => {
  const fontPx = 16;
  const cx = 500;
  const baselineY = 290;
  const padX = 12;
  const padY = 6;
  const ascent = 12;
  const descent = 4;
  const charW = fontPx * 0.92;
  const w = Math.max(
    CENTER_LABEL_TEXT.length * charW + padX * 2,
    fontPx * 5 + padX * 2,
  );
  const h = ascent + descent + padY * 2;
  return {
    x: cx - w / 2,
    y: baselineY - ascent - padY - 2,
    width: w,
    height: h,
    rx: 0,
  };
})();

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

// ── ハイライト3ノード: 線 → 塗り → 合体 → 造語 → 縮む → 再選択 ─────────────────
const HIGHLIGHT_NODE_COUNT = 3;
const highlightPhase = ref<"draw" | "hold" | "merge" | "coin" | "shrink">(
  "draw",
);
const mergeBurstVisible = ref(false);
/** 0–1: 合体アニメの進行（円の中心 CX,CY へ） */
const mergeAnimProgress = ref(0);
const HIGHLIGHT_DRAW_MS = 1200;
const HIGHLIGHT_WAIT_MS = 1200;
const HIGHLIGHT_MERGE_MS = 1500;
const COIN_POP_MS = 450;
const COIN_HOLD_MS = 1100;
const COIN_FADE_MS = 800;
const HIGHLIGHT_SHRINK_MS = 600;
/** 縮み終わってから次のシャッフルまで */
const HIGHLIGHT_PAUSE_BEFORE_NEXT_MS = 250;

const coinedWordFontSize = computed(() => {
  const len = [...coinedWord.value].length;
  if (len > 14) return 13;
  if (len > 10) return 16;
  if (len > 7) return 19;
  return 22;
});

const highlightPhaseClass = computed(() => ({
  "domain-diagram__highlight-links--draw": highlightPhase.value === "draw",
  "domain-diagram__highlight-links--hold":
    highlightPhase.value === "hold" ||
    highlightPhase.value === "merge" ||
    highlightPhase.value === "coin",
  "domain-diagram__highlight-links--shrink": highlightPhase.value === "shrink",
}));

const HIGHLIGHT_FILL_IN_MS = 500;
const HIGHLIGHT_FILL_OUT_MS = 400;

const highlightTimingCssVars = computed(() => ({
  "--highlight-draw-ms": `${HIGHLIGHT_DRAW_MS}ms`,
  "--highlight-shrink-ms": `${HIGHLIGHT_SHRINK_MS}ms`,
  "--highlight-fill-in-ms": `${HIGHLIGHT_FILL_IN_MS}ms`,
  "--highlight-fill-out-ms": `${HIGHLIGHT_FILL_OUT_MS}ms`,
  "--highlight-merge-ms": `${HIGHLIGHT_MERGE_MS}ms`,
  "--coin-pop-ms": `${COIN_POP_MS}ms`,
  "--coin-fade-ms": `${COIN_FADE_MS}ms`,
}));

let diagramTimeouts: ReturnType<typeof setTimeout>[] = [];
let mergeAnimRaf = 0;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function cancelMergeAnimation(): void {
  cancelAnimationFrame(mergeAnimRaf);
  mergeAnimRaf = 0;
}

function runMergeAnimation(): void {
  cancelMergeAnimation();
  mergeAnimProgress.value = 0;
  const start = performance.now();

  const tick = (now: number) => {
    const raw = Math.min(1, (now - start) / HIGHLIGHT_MERGE_MS);
    mergeAnimProgress.value = easeInOutCubic(raw);
    if (raw < 1) {
      mergeAnimRaf = requestAnimationFrame(tick);
    }
  };

  mergeAnimRaf = requestAnimationFrame(tick);
}

function clearDiagramTimeouts(): void {
  diagramTimeouts.forEach(clearTimeout);
  diagramTimeouts = [];
}

function afterDiagramDelay(ms: number, fn: () => void): void {
  diagramTimeouts.push(setTimeout(fn, ms));
}

/** 3キーワードの頭・中・尾をつないで造語を作る */
function normalizeKeywordLabel(label: string): string {
  return label
    .replace(/[（(][^）)]*[）)]/g, "")
    .split(/[/／]/)[0]!
    .trim();
}

function blendChunk(label: string, role: "head" | "mid" | "tail"): string {
  const clean = normalizeKeywordLabel(label);
  const chars = [...clean];
  const n = chars.length;
  if (n === 0) return "";
  if (n <= 2) return clean;

  const chunk = Math.max(2, Math.min(4, Math.ceil(n / 3)));
  if (role === "head") return chars.slice(0, chunk).join("");
  if (role === "tail") return chars.slice(n - chunk).join("");
  const midStart = Math.max(0, Math.floor(n / 2) - Math.floor(chunk / 2));
  return chars.slice(midStart, midStart + chunk).join("");
}

function buildPortmanteau(selected: Keyword[]): string {
  const labels = selected.map((k) => k.label);
  if (labels.length === 0) return "";
  if (labels.length === 1) return normalizeKeywordLabel(labels[0]!);
  if (labels.length === 2) {
    return blendChunk(labels[0]!, "head") + blendChunk(labels[1]!, "tail");
  }
  return (
    blendChunk(labels[0]!, "head") +
    blendChunk(labels[1]!, "mid") +
    blendChunk(labels[2]!, "tail")
  );
}

function showCoinedWord(): void {
  coinedWord.value = buildPortmanteau(highlightPickedKeywords.value);
  coinedWordVisible.value = coinedWord.value.length > 0;
  coinedWordPhase.value = "pop";
}

function hideCoinedWord(): void {
  coinedWordVisible.value = false;
  coinedWordPhase.value = "pop";
}

function pickRandomHighlightRing(): void {
  const pool = [...keywords];
  shuffleInPlace(pool);
  const n = Math.min(HIGHLIGHT_NODE_COUNT, pool.length);
  const picked = pool.slice(0, n);
  highlightPickedKeywords.value = picked;
  highlightSelectedIds.value = new Set(picked.map((p) => p.id));
  highlightAnimEpoch.value += 1;
  mergeBurstVisible.value = false;
  mergeAnimProgress.value = 0;
  hideCoinedWord();
  cancelMergeAnimation();
  highlightRingPathD.value = buildHighlightRingAsSinglePath(picked);
  highlightFillPathD.value = buildHighlightFillPath(picked);
}

function startHighlightCycle(): void {
  if (linkMotionReduced.value) return;
  clearDiagramTimeouts();
  spotlightActive.value = true;
  pickRandomHighlightRing();
  highlightPhase.value = "draw";

  const mergeMs = linkMotionReduced.value ? 0 : HIGHLIGHT_MERGE_MS;
  const coinMs = linkMotionReduced.value
    ? 0
    : COIN_POP_MS + COIN_HOLD_MS + COIN_FADE_MS;
  const mergeBurstAt = mergeMs > 0 ? Math.round(mergeMs * 0.72) : 0;
  const mergeEndAt = HIGHLIGHT_DRAW_MS + HIGHLIGHT_WAIT_MS + mergeMs;

  afterDiagramDelay(HIGHLIGHT_DRAW_MS, () => {
    highlightPhase.value = "hold";
  });

  afterDiagramDelay(HIGHLIGHT_DRAW_MS + HIGHLIGHT_WAIT_MS, () => {
    if (mergeMs === 0) {
      highlightPhase.value = "shrink";
      return;
    }
    highlightPhase.value = "merge";
    mergeBurstVisible.value = false;
    runMergeAnimation();
  });

  if (mergeMs > 0) {
    afterDiagramDelay(
      HIGHLIGHT_DRAW_MS + HIGHLIGHT_WAIT_MS + mergeBurstAt,
      () => {
        mergeBurstVisible.value = true;
      },
    );

    afterDiagramDelay(mergeEndAt, () => {
      mergeBurstVisible.value = false;
      highlightPhase.value = "coin";
      showCoinedWord();
    });

    afterDiagramDelay(mergeEndAt + COIN_POP_MS + COIN_HOLD_MS, () => {
      coinedWordPhase.value = "fade";
    });

    afterDiagramDelay(mergeEndAt + coinMs, () => {
      hideCoinedWord();
      highlightPhase.value = "shrink";
    });
  }

  afterDiagramDelay(
    mergeEndAt + coinMs + HIGHLIGHT_SHRINK_MS + HIGHLIGHT_PAUSE_BEFORE_NEXT_MS,
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

/** `M x y C ...` から先頭の moveto を除き、前セグメントの終点から続く C コマンドだけにする */
function stripLeadingMoveTo(d: string): string {
  return d.replace(/^M\s+[\d.-]+\s+[\d.-]+\s+/, "").trim();
}

/** 選択ノードを円周角度順に並べ、閉ループを1本の path に連結（一筆書き風アニメ用） */
function buildHighlightRingAsSinglePath(selected: Keyword[]): string {
  if (selected.length < 2) return "";
  const sorted = sortKeywordsByAngle(selected);
  const parts: string[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const a = sorted[i]!;
    const b = sorted[(i + 1) % sorted.length]!;
    const seg = bezierTowardCenterDeterministic(a, b);
    parts.push(i === 0 ? seg.trim() : stripLeadingMoveTo(seg));
  }
  return parts.join(" ");
}

/** 線で囲まれた内側を塗る閉じた path（ストローク path と同形） */
function buildHighlightFillPath(selected: Keyword[]): string {
  const ring = buildHighlightRingAsSinglePath(selected);
  if (!ring || selected.length < 3) return "";
  return `${ring} Z`;
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
  cancelMergeAnimation();
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

/* Hero background: larger, no horizontal scroll */
.domain-diagram--hero {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

.domain-diagram--hero .domain-diagram__svg {
  width: min(1320px, 118vw);
  max-width: none;
  min-width: unset;
  height: auto;
  display: block;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .domain-diagram--hero .domain-diagram__svg {
    width: min(1500px, 125vw);
  }
}

@media (min-width: 1200px) {
  .domain-diagram--hero .domain-diagram__svg {
    width: min(1680px, 92vw);
  }
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
  --highlight-fill-in-ms: 500ms;
  --highlight-fill-out-ms: 400ms;
}

.domain-diagram__highlight-fill-path {
  stroke: none;
  fill-opacity: 0;
}

.domain-diagram__highlight-links--hold .domain-diagram__highlight-fill-path {
  animation: domain-diagram-highlight-fill-in var(--highlight-fill-in-ms)
    ease-out forwards;
}

.domain-diagram__highlight-links--draw .domain-diagram__highlight-fill-path {
  fill-opacity: 0;
  animation: none;
}

.domain-diagram__highlight-links--shrink .domain-diagram__highlight-fill-path {
  fill-opacity: 1;
  animation: domain-diagram-highlight-fill-out var(--highlight-fill-out-ms)
    ease-in forwards;
}

@keyframes domain-diagram-highlight-fill-in {
  from {
    fill-opacity: 0;
  }
  to {
    fill-opacity: 1;
  }
}

@keyframes domain-diagram-highlight-fill-out {
  from {
    fill-opacity: 1;
  }
  to {
    fill-opacity: 0;
  }
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

  .domain-diagram__highlight-fill-path {
    animation: none !important;
    fill-opacity: 1;
  }

  .domain-diagram__highlight-links--draw .domain-diagram__highlight-fill-path,
  .domain-diagram__highlight-links--shrink
    .domain-diagram__highlight-fill-path {
    fill-opacity: 0;
  }

  .kw-group--merging {
    animation: none !important;
  }

  .domain-diagram__merge-burst {
    animation: none !important;
    opacity: 0;
  }

  .domain-diagram__coined-word {
    animation: none !important;
    opacity: 0;
  }
}

.kw-group {
  cursor: default;
  transition: opacity var(--transition-fast);
}

.domain-diagram__merge-burst {
  animation: domain-diagram-merge-burst 420ms ease-out forwards;
}

@keyframes domain-diagram-merge-burst {
  0% {
    transform: scale(0.15);
    opacity: 0.85;
  }
  100% {
    transform: scale(2.8);
    opacity: 0;
  }
}

.domain-diagram__coined-word-text {
  font-family: var(--font-display);
  font-weight: 700;
  letter-spacing: -0.02em;
  pointer-events: none;
}

.domain-diagram__coined-word--pop {
  animation: domain-diagram-coin-pop var(--coin-pop-ms, 450ms)
    cubic-bezier(0.34, 1.45, 0.64, 1) forwards;
}

.domain-diagram__coined-word--fade {
  animation: domain-diagram-coin-fade var(--coin-fade-ms, 800ms) ease-out
    forwards;
}

@keyframes domain-diagram-coin-pop {
  0% {
    opacity: 0;
    transform: scale(0.25);
  }
  65% {
    opacity: 1;
    transform: scale(1.12);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes domain-diagram-coin-fade {
  0% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  100% {
    opacity: 0;
    transform: scale(1.06) translateY(-10px);
  }
}

.kw-label {
  font-family: var(--font-body);
  font-size: 10px;
  pointer-events: none;
}

.domain-label-pill {
  pointer-events: auto;
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

.center-label-pill {
  pointer-events: none;
}

.center-label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  pointer-events: none;
}
</style>
