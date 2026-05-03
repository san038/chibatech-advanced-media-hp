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
      <circle cx="500" cy="285" r="210" fill="none" stroke="#ccc8c6" stroke-width="1" />

      <!-- Keywords: dot on circle; label position by sector (top / left / bottom) -->
      <g
        v-for="kw in keywords"
        :key="kw.id"
        class="kw-group"
        :style="{ opacity: kwOpacity(kw.domain) }"
        @mouseenter="hoveredDomain = kw.domain"
        @mouseleave="hoveredDomain = null"
      >
        <circle
          :cx="kwXY(kw).x"
          :cy="kwXY(kw).y"
          :r="kw.isDomain ? 4.5 : 2.5"
          :fill="domainColor(kw.domain)"
        />
        <text
          :x="labelXY(kw).x"
          :y="labelXY(kw).y"
          :text-anchor="labelAnchor(kw)"
          :fill="domainColor(kw.domain)"
          :class="kw.isDomain ? 'domain-label-text' : 'kw-label'"
        >{{ kw.label }}</text>
      </g>

      <!-- Center label -->
      <text x="500" y="258" text-anchor="middle" fill="#1c1b1b" class="center-label">知能メディア工学科</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Domain = 'media' | 'knowledge' | 'design' | 'media-knowledge' | 'media-design' | 'all'

interface Keyword {
  id: string
  label: string
  /** 円周上の位置（度）。0°=右、90°=下、180°=左、270°/-90°=上（center 500,285, r=210 と整合） */
  angleDeg: number
  domain: Domain
  isDomain?: true
}

const hoveredDomain = ref<Domain | null>(null)

const COLORS: Record<Domain, string> = {
  media: '#a14e58',
  knowledge: '#3d6b4a',
  design: '#4a6fa3',
  'media-knowledge': '#7a7574',
  'media-design': '#7a7574',
  all: '#7a7574',
}

const RELATED: Partial<Record<Domain, Domain[]>> = {
  media: ['media-knowledge', 'media-design', 'all'],
  knowledge: ['media-knowledge', 'all'],
  design: ['media-design', 'all'],
  'media-knowledge': ['media', 'knowledge', 'all'],
  'media-design': ['media', 'design', 'all'],
  all: ['media', 'knowledge', 'design', 'media-knowledge', 'media-design'],
}

function domainColor(domain: Domain): string {
  return COLORS[domain]
}

function kwOpacity(domain: Domain): number {
  if (!hoveredDomain.value) return 1
  const hd = hoveredDomain.value
  if (domain === hd) return 1
  if (RELATED[hd]?.includes(domain)) return 0.45
  return 0.08
}

const CX = 500
const CY = 285
const R = 210

function polarToXY(angleDeg: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) }
}

/**
 * 2頂点間の弧（from→to を短い方、ここでは各120°）に count 個のドットを置く。
 * 頂点↔ドット↔…↔ドット↔頂点の弧長がすべて等しい（弧を count+1 等分）。
 */
function equalArcDots(fromDeg: number, toDeg: number, count: number): number[] {
  const span = toDeg - fromDeg
  const gap = span / (count + 1)
  return Array.from({ length: count }, (_, i) => fromDeg + gap * (i + 1))
}

// ドメイン頂点 30° / 150° / −90° の各120°弧上で、隣り合うドット間の円弧距離を一定にする
const angDesignToKnowledge = equalArcDots(30, 150, 16) // all×5 + k×11
const angKnowledgeToMedia = equalArcDots(150, 270, 14) // mk×5 + m×9
const angMediaToDesign = equalArcDots(-90, 30, 15) // md×5 + d×10

/** 円周の位置に応じたラベル配置: 上=真上・左寄せ、左=左・右寄せ、下=下・左寄せ */
function labelSideFromAngleDeg(angleDeg: number): 'top' | 'left' | 'bottom' {
  const d = ((angleDeg % 360) + 360) % 360
  if (d >= 200 && d <= 340) return 'top'
  if (d >= 82 && d <= 198) return 'left'
  return 'bottom'
}

function labelAnchor(kw: Keyword): 'start' | 'end' {
  return labelSideFromAngleDeg(kw.angleDeg) === 'left' ? 'end' : 'start'
}

function labelXY(kw: Keyword): { x: number; y: number } {
  const { x, y } = polarToXY(kw.angleDeg)
  const side = labelSideFromAngleDeg(kw.angleDeg)
  const gap = kw.isDomain ? 12 : 9
  const dy = kw.isDomain ? 5 : 4
  switch (side) {
    case 'top':
      return { x, y: y - gap }
    case 'left':
      return { x: x - gap, y: y + dy }
    default:
      return { x, y: y + gap + dy }
  }
}

function kwXY(kw: Keyword): { x: number; y: number } {
  return polarToXY(kw.angleDeg)
}

// ─────────────────────────────────────────────────────────────────────────────
// Circle: center(500,285), r=210。各120°弧で頂点間を等分し、ドット間の円弧距離を揃える。
// ─────────────────────────────────────────────────────────────────────────────
const keywords: Keyword[] = [
  // ── DOMAIN LABELS（円周上）───────────────────────────────────────────────
  { id: 'dl-media',     label: 'メディア工学',  angleDeg: -90, domain: 'media',     isDomain: true },
  { id: 'dl-knowledge', label: '知能工学',      angleDeg: 150, domain: 'knowledge', isDomain: true },
  { id: 'dl-design',    label: '情報デザイン',  angleDeg: 30,  domain: 'design',    isDomain: true },

  // ── MEDIA（Knowledge→Media 弧の後半、等間隔）────────────────────────────
  { id: 'm1', label: '３D音響',               angleDeg: angKnowledgeToMedia[5], domain: 'media' },
  { id: 'm2', label: '音場シミュレーション',   angleDeg: angKnowledgeToMedia[6], domain: 'media' },
  { id: 'm3', label: '音声伝達',              angleDeg: angKnowledgeToMedia[7], domain: 'media' },
  { id: 'm4', label: '話者認識',              angleDeg: angKnowledgeToMedia[8], domain: 'media' },
  { id: 'm5', label: '歌声合成',              angleDeg: angKnowledgeToMedia[9], domain: 'media' },
  { id: 'm6', label: '画像/映像処理',         angleDeg: angKnowledgeToMedia[10], domain: 'media' },
  { id: 'm7', label: '画像/映像合成',         angleDeg: angKnowledgeToMedia[11], domain: 'media' },
  { id: 'm8', label: '画像/映像符号化と伝送',  angleDeg: angKnowledgeToMedia[12], domain: 'media' },
  { id: 'm9', label: 'バーチャルリアリティ',   angleDeg: angKnowledgeToMedia[13], domain: 'media' },

  // ── KNOWLEDGE（Design→Knowledge 弧の後半、等間隔）────────────────────────
  { id: 'k1',  label: 'ユビキタスコンピューティング',          angleDeg: angDesignToKnowledge[5], domain: 'knowledge' },
  { id: 'k2',  label: 'ITS（Intelligent Transport Systems）', angleDeg: angDesignToKnowledge[6], domain: 'knowledge' },
  { id: 'k3',  label: 'テキストマイニング',                   angleDeg: angDesignToKnowledge[7], domain: 'knowledge' },
  { id: 'k4',  label: '環境認識',                            angleDeg: angDesignToKnowledge[8], domain: 'knowledge' },
  { id: 'k5',  label: 'コンピュータネットワーク',              angleDeg: angDesignToKnowledge[9], domain: 'knowledge' },
  { id: 'k6',  label: 'データマイニング',                     angleDeg: angDesignToKnowledge[10], domain: 'knowledge' },
  { id: 'k7',  label: 'マルチエージェントシステム',            angleDeg: angDesignToKnowledge[11], domain: 'knowledge' },
  { id: 'k8',  label: 'ビッグデータ',                        angleDeg: angDesignToKnowledge[12], domain: 'knowledge' },
  { id: 'k9',  label: '人工知能',                            angleDeg: angDesignToKnowledge[13], domain: 'knowledge' },
  { id: 'k10', label: '機械学習',                            angleDeg: angDesignToKnowledge[14], domain: 'knowledge' },
  { id: 'k11', label: 'ディープラーニング',                   angleDeg: angDesignToKnowledge[15], domain: 'knowledge' },

  // ── DESIGN（Media→Design 弧の後半、等間隔）──────────────────────────────
  { id: 'd1',  label: 'テクノロジーアート',                         angleDeg: angMediaToDesign[5], domain: 'design' },
  { id: 'd2',  label: 'ソーシャルデザイン',                         angleDeg: angMediaToDesign[6], domain: 'design' },
  { id: 'd3',  label: 'サービスデザイン',                           angleDeg: angMediaToDesign[7], domain: 'design' },
  { id: 'd4',  label: 'ユーザエクスペリエンスデザイン/人間中心設計', angleDeg: angMediaToDesign[8], domain: 'design' },
  { id: 'd5',  label: '映像・CG・アニメーションデザイン',            angleDeg: angMediaToDesign[9], domain: 'design' },
  { id: 'd6',  label: 'Webデザイン/アプリケーションデザイン',        angleDeg: angMediaToDesign[10], domain: 'design' },
  { id: 'd7',  label: 'ユーザインタフェースデザイン',                angleDeg: angMediaToDesign[11], domain: 'design' },
  { id: 'd8',  label: 'プロダクトデザイン/デジタルファブリケーション', angleDeg: angMediaToDesign[12], domain: 'design' },
  { id: 'd9',  label: 'ビジュアライゼーション',                     angleDeg: angMediaToDesign[13], domain: 'design' },
  { id: 'd10', label: 'コミュニケーションデザイン',                  angleDeg: angMediaToDesign[14], domain: 'design' },

  // ── MEDIA × KNOWLEDGE（Knowledge→Media 弧の前半、等間隔）────────────────
  { id: 'mk1', label: 'AR（拡張現実）',              angleDeg: angKnowledgeToMedia[0], domain: 'media-knowledge' },
  { id: 'mk2', label: '音声認識',                   angleDeg: angKnowledgeToMedia[1], domain: 'media-knowledge' },
  { id: 'mk3', label: '画像認識',                   angleDeg: angKnowledgeToMedia[2], domain: 'media-knowledge' },
  { id: 'mk4', label: 'インテリジェント拡声システム', angleDeg: angKnowledgeToMedia[3], domain: 'media-knowledge' },
  { id: 'mk5', label: '音の情景分析',               angleDeg: angKnowledgeToMedia[4], domain: 'media-knowledge' },

  // ── MEDIA × DESIGN（Media→Design 弧の前半、等間隔）──────────────────────
  { id: 'md1', label: 'マルチモーダルインタフェース',                angleDeg: angMediaToDesign[0], domain: 'media-design' },
  { id: 'md2', label: 'サウンドデザイン',                          angleDeg: angMediaToDesign[1], domain: 'media-design' },
  { id: 'md3', label: '音環境デザイン',                            angleDeg: angMediaToDesign[2], domain: 'media-design' },
  { id: 'md4', label: 'メディアデザイン',                          angleDeg: angMediaToDesign[3], domain: 'media-design' },
  { id: 'md5', label: 'サイエンティフィック・ビジュアライゼーション', angleDeg: angMediaToDesign[4], domain: 'media-design' },

  // ── 三領域（Design→Knowledge 弧の前半、等間隔）──────────────────────────
  { id: 'all1', label: 'データ可視化',                        angleDeg: angDesignToKnowledge[0], domain: 'all' },
  { id: 'all2', label: 'IoT（Internet of Things）',           angleDeg: angDesignToKnowledge[1], domain: 'all' },
  { id: 'all3', label: 'インテリジェントプロダクトデザイン',    angleDeg: angDesignToKnowledge[2], domain: 'all' },
  { id: 'all4', label: 'インテリジェントインタフェースデザイン', angleDeg: angDesignToKnowledge[3], domain: 'all' },
  { id: 'all5', label: 'インタフェースエージェント',            angleDeg: angDesignToKnowledge[4], domain: 'all' },
]
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

.center-label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.02em;
  pointer-events: none;
}
</style>
