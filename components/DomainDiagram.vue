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

      <!--
        接続線は linkPaths の更新だけで差し替え（:key で毎回 g を作り直すと
        opacity 入場アニメが繰り返され、線が「変わらず点滅」して見える）。
      -->
      <g class="domain-diagram__links" pointer-events="none" aria-hidden="true">
        <path
          v-for="seg in linkPaths"
          :key="seg.key"
          :d="seg.d"
          class="domain-diagram__link-path"
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
        >{{ dl.label }}</text>
      </g>

      <!-- キーワード: 円周上のドット + 扇ルールのラベル -->
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
          :r="2.5"
          :fill="domainColor(kw.domain)"
        />
        <text
          :x="labelXY(kw).x"
          :y="labelXY(kw).y"
          :text-anchor="labelAnchor(kw)"
          :fill="domainColor(kw.domain)"
          class="kw-label"
        >{{ kw.label }}</text>
      </g>

      <!-- Center label -->
      <text x="500" y="258" text-anchor="middle" fill="#1c1b1b" class="center-label">知能メディア工学科</text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

type Domain = 'media' | 'knowledge' | 'design' | 'media-knowledge' | 'media-design' | 'all'

interface Keyword {
  id: string
  label: string
  /** 円周上の位置（度）。0°=右、90°=下、180°=左、270°/-90°=上（center 500,285, r=210 と整合） */
  angleDeg: number
  domain: Domain
}

/** 円内に置くドメイン名（ドットなし） */
interface DomainLabelSpec {
  id: string
  label: string
  domain: Extract<Domain, 'media' | 'knowledge' | 'design'>
  x: number
  y: number
  textAnchor: 'start' | 'middle' | 'end'
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
  const gap = 9
  const dy = 4
  switch (side) {
    case 'top':
      return { x, y: y - gap }
    case 'left':
      return { x: x - gap, y: y + dy }
    default:
      return { x, y: y + gap + dy }
  }
}

/** 円内の点（中心から angleDeg・半径 rIn） */
function innerPolar(angleDeg: number, rIn: number): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180
  return { x: CX + rIn * Math.cos(rad), y: CY + rIn * Math.sin(rad) }
}

// メディア弧（angKnowledgeToMedia の赤クラスタ）の角度レンジ中央 ≈ 210° 付近の内側
const mediaArcMidDeg =
  (angKnowledgeToMedia[0] + angKnowledgeToMedia[angKnowledgeToMedia.length - 1]) / 2

const domainLabels: DomainLabelSpec[] = [
  {
    id: 'dl-media',
    label: 'メディア工学',
    domain: 'media',
    ...(() => {
      const p = innerPolar(mediaArcMidDeg, 118)
      return { x: p.x, y: p.y + 5, textAnchor: 'middle' as const }
    })(),
  },
  {
    id: 'dl-design',
    label: '情報デザイン',
    domain: 'design',
    ...(() => {
      const p = innerPolar(4, 118)
      return { x: p.x, y: p.y + 5, textAnchor: 'middle' as const }
    })(),
  },
  {
    id: 'dl-knowledge',
    label: '知能工学',
    domain: 'knowledge',
    ...(() => {
      const p = innerPolar(142, 100)
      return { x: p.x, y: p.y + 5, textAnchor: 'middle' as const }
    })(),
  },
]

function kwXY(kw: Keyword): { x: number; y: number } {
  return polarToXY(kw.angleDeg)
}

// ── Network links (cubic bezier toward center, reshuffled periodically) ─────
interface LinkSeg {
  key: string
  d: string
}

const linkPaths = ref<LinkSeg[]>([])

const LINK_INTERVAL_MS = 4500

function shuffleInPlace<T>(arr: T[]): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

function edgeKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`
}

/** 端点を中心方向へ引っ張った制御点で C 曲線（わずかにランダムで自然な弧） */
function bezierTowardCenter(from: Keyword, to: Keyword): string {
  const p0 = kwXY(from)
  const p3 = kwXY(to)
  const t1 = 0.4 + Math.random() * 0.16
  const t2 = 0.4 + Math.random() * 0.16
  let c1x = p0.x + t1 * (CX - p0.x)
  let c1y = p0.y + t1 * (CY - p0.y)
  let c2x = p3.x + t2 * (CX - p3.x)
  let c2y = p3.y + t2 * (CY - p3.y)
  const jitter = 2.5 + Math.random() * 3.5
  c1x += (Math.random() - 0.5) * jitter
  c1y += (Math.random() - 0.5) * jitter
  c2x += (Math.random() - 0.5) * jitter
  c2y += (Math.random() - 0.5) * jitter
  return `M ${p0.x} ${p0.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p3.x} ${p3.y}`
}

function regenerateLinks(): void {
  const seen = new Set<string>()
  const segs: LinkSeg[] = []
  const order = [...keywords]
  shuffleInPlace(order)

  for (const kw of order) {
    const peers = keywords.filter((k) => k.id !== kw.id)
    shuffleInPlace(peers)
    let n = 0
    for (const t of peers) {
      if (n >= 3) break
      const k = edgeKey(kw.id, t.id)
      if (seen.has(k)) continue
      seen.add(k)
      n++
      segs.push({ key: k, d: bezierTowardCenter(kw, t) })
    }
  }
  linkPaths.value = segs
}

let linkTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  const reduceMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

  regenerateLinks()
  if (reduceMotion) return

  linkTimer = setInterval(regenerateLinks, LINK_INTERVAL_MS)
})

onUnmounted(() => {
  if (linkTimer != null) clearInterval(linkTimer)
})

// ─────────────────────────────────────────────────────────────────────────────
// Circle: center(500,285), r=210。各120°弧で頂点間を等分し、ドット間の円弧距離を揃える。
// ─────────────────────────────────────────────────────────────────────────────
const keywords: Keyword[] = [
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

.domain-diagram__link-path {
  fill: none;
  stroke: #b8b3b0;
  stroke-width: 0.85;
  stroke-opacity: 0.32;
  stroke-linecap: round;
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
