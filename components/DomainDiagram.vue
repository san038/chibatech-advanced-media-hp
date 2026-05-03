<template>
  <div class="domain-diagram">
    <svg
      viewBox="0 0 1200 900"
      xmlns="http://www.w3.org/2000/svg"
      class="domain-diagram__svg"
      @mouseleave="hoveredDomain = null"
    >
      <!-- Triangle edges -->
      <line
        v-for="e in edges"
        :key="e.id"
        :x1="e.x1"
        :y1="e.y1"
        :x2="e.x2"
        :y2="e.y2"
        class="tri-edge"
      />

      <!-- Keywords -->
      <g
        v-for="kw in keywords"
        :key="kw.id"
        class="kw-group"
        @mouseenter="hoveredDomain = kw.domain"
        @mouseleave="hoveredDomain = null"
      >
        <circle
          :cx="kw.x"
          :cy="kw.y"
          r="2.5"
          :fill="COLORS[kw.domain]"
          :opacity="kwOpacity(kw.domain)"
          class="kw-dot"
        />
        <text
          :x="kwTextPos(kw).x"
          :y="kwTextPos(kw).y"
          :text-anchor="kwAnchor(kw.x)"
          :fill="COLORS[kw.domain]"
          :opacity="kwOpacity(kw.domain)"
          class="kw-label"
        >{{ kw.label }}</text>
      </g>

      <!-- Main nodes (rendered on top) -->
      <g
        v-for="node in mainNodes"
        :key="node.key"
        class="main-node"
        @mouseenter="hoveredDomain = node.key as Domain"
        @mouseleave="hoveredDomain = null"
      >
        <rect
          :x="node.x - node.w / 2"
          :y="node.y - 20"
          :width="node.w"
          height="40"
          :fill="node.color"
        />
        <text
          :x="node.x"
          :y="node.y + 6"
          text-anchor="middle"
          fill="white"
          class="node-label"
        >{{ node.label }}</text>
      </g>
    </svg>

    <!-- Legend -->
    <div class="diagram-legend">
      <div
        v-for="item in legendItems"
        :key="item.domain"
        class="diagram-legend__item"
        :class="{ 'is-active': hoveredDomain === item.domain }"
        @mouseenter="hoveredDomain = item.domain"
        @mouseleave="hoveredDomain = null"
      >
        <span class="diagram-legend__dot" :style="{ background: COLORS[item.domain] }" />
        <span class="diagram-legend__label">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

type Domain = 'media' | 'knowledge' | 'design' | 'media-knowledge' | 'media-design' | 'all'

interface Keyword {
  id: string
  label: string
  x: number
  y: number
  domain: Domain
}

interface MainNode {
  key: string
  label: string
  x: number
  y: number
  color: string
  w: number
}

const hoveredDomain = ref<Domain | null>(null)

const COLORS: Record<Domain, string> = {
  media: '#a14e58',
  knowledge: '#3d6b4a',
  design: '#4a6fa3',
  'media-knowledge': '#7a5b51',
  'media-design': '#7a5f80',
  all: '#5a5756',
}

function kwOpacity(domain: Domain): number {
  if (!hoveredDomain.value) return 1
  const hd = hoveredDomain.value
  if (domain === hd) return 1
  if (domain === 'all') return 0.65
  if (
    (hd === 'media' && (domain === 'media-knowledge' || domain === 'media-design')) ||
    (hd === 'knowledge' && domain === 'media-knowledge') ||
    (hd === 'design' && domain === 'media-design') ||
    (hd === 'media-knowledge' && (domain === 'media' || domain === 'knowledge')) ||
    (hd === 'media-design' && (domain === 'media' || domain === 'design')) ||
    (hd === 'all')
  ) return 0.45
  return 0.1
}

function kwAnchor(x: number): 'start' | 'end' | 'middle' {
  if (x < 550) return 'start'
  if (x > 750) return 'end'
  return 'middle'
}

function kwTextPos(kw: Keyword): { x: number; y: number } {
  const anchor = kwAnchor(kw.x)
  if (anchor === 'start') return { x: kw.x + 8, y: kw.y + 4 }
  if (anchor === 'end') return { x: kw.x - 8, y: kw.y + 4 }
  return { x: kw.x, y: kw.y + 16 }
}

// Triangle vertices: Media(600,110) Knowledge(165,775) Design(1035,775)

const edges = [
  { id: 'mk', x1: 600, y1: 110, x2: 165, y2: 775 },
  { id: 'md', x1: 600, y1: 110, x2: 1035, y2: 775 },
  { id: 'kd', x1: 165, y1: 775, x2: 1035, y2: 775 },
]

const mainNodes: MainNode[] = [
  { key: 'media', label: 'メディア工学', x: 600, y: 110, color: COLORS.media, w: 118 },
  { key: 'knowledge', label: '知能工学', x: 165, y: 775, color: COLORS.knowledge, w: 94 },
  { key: 'design', label: '情報デザイン', x: 1035, y: 775, color: COLORS.design, w: 106 },
]

const keywords: Keyword[] = [
  // MEDIA — spread above/around top vertex
  { id: 'm1', label: '３D音響', x: 330, y: 32, domain: 'media' },
  { id: 'm2', label: '音場シミュレーション', x: 462, y: 14, domain: 'media' },
  { id: 'm3', label: '音声伝達', x: 600, y: 12, domain: 'media' },
  { id: 'm4', label: '話者認識', x: 748, y: 14, domain: 'media' },
  { id: 'm5', label: '歌声合成', x: 878, y: 32, domain: 'media' },
  { id: 'm6', label: '画像/映像処理', x: 218, y: 68, domain: 'media' },
  { id: 'm7', label: '画像/映像合成', x: 138, y: 140, domain: 'media' },
  { id: 'm8', label: '画像/映像符号化と伝送', x: 108, y: 205, domain: 'media' },
  { id: 'm9', label: 'バーチャルリアリティ', x: 978, y: 90, domain: 'media' },

  // KNOWLEDGE — left side and below bottom-left vertex
  { id: 'k1', label: 'ユビキタスコンピューティング', x: 32, y: 360, domain: 'knowledge' },
  { id: 'k2', label: 'ITS（Intelligent Transport Systems）', x: 32, y: 392, domain: 'knowledge' },
  { id: 'k3', label: 'テキストマイニング', x: 32, y: 424, domain: 'knowledge' },
  { id: 'k4', label: '環境認識', x: 32, y: 456, domain: 'knowledge' },
  { id: 'k5', label: 'コンピュータネットワーク', x: 32, y: 605, domain: 'knowledge' },
  { id: 'k6', label: 'データマイニング', x: 32, y: 637, domain: 'knowledge' },
  { id: 'k7', label: 'マルチエージェントシステム', x: 32, y: 669, domain: 'knowledge' },
  { id: 'k8', label: 'ビッグデータ', x: 32, y: 725, domain: 'knowledge' },
  { id: 'k9', label: '人工知能', x: 32, y: 812, domain: 'knowledge' },
  { id: 'k10', label: '機械学習', x: 175, y: 846, domain: 'knowledge' },
  { id: 'k11', label: 'ディープラーニング', x: 335, y: 872, domain: 'knowledge' },

  // DESIGN — right side and below bottom-right vertex
  { id: 'd1', label: 'テクノロジーアート', x: 1168, y: 360, domain: 'design' },
  { id: 'd2', label: 'ソーシャルデザイン', x: 1168, y: 412, domain: 'design' },
  { id: 'd3', label: 'サービスデザイン', x: 1168, y: 464, domain: 'design' },
  { id: 'd4', label: 'ユーザエクスペリエンスデザイン/人間中心設計', x: 1168, y: 516, domain: 'design' },
  { id: 'd5', label: '映像・CG・アニメーションデザイン', x: 1168, y: 568, domain: 'design' },
  { id: 'd6', label: 'Webデザイン/アプリケーションデザイン', x: 1168, y: 620, domain: 'design' },
  { id: 'd7', label: 'ユーザインタフェースデザイン', x: 1168, y: 672, domain: 'design' },
  { id: 'd8', label: 'プロダクトデザイン/デジタルファブリケーション', x: 1168, y: 724, domain: 'design' },
  { id: 'd9', label: 'ビジュアライゼーション', x: 1065, y: 840, domain: 'design' },
  { id: 'd10', label: 'コミュニケーションデザイン', x: 908, y: 866, domain: 'design' },

  // MEDIA + KNOWLEDGE — along left edge of triangle, inside
  { id: 'mk1', label: 'AR（拡張現実）', x: 492, y: 192, domain: 'media-knowledge' },
  { id: 'mk2', label: '音声認識', x: 432, y: 262, domain: 'media-knowledge' },
  { id: 'mk3', label: '画像認識', x: 390, y: 332, domain: 'media-knowledge' },
  { id: 'mk4', label: 'インテリジェント拡声システム', x: 346, y: 402, domain: 'media-knowledge' },
  { id: 'mk5', label: '音の情景分析', x: 300, y: 472, domain: 'media-knowledge' },

  // MEDIA + DESIGN — along right edge of triangle, inside
  { id: 'md1', label: 'マルチモーダルインタフェース', x: 758, y: 192, domain: 'media-design' },
  { id: 'md2', label: 'サウンドデザイン', x: 800, y: 265, domain: 'media-design' },
  { id: 'md3', label: '音環境デザイン', x: 832, y: 335, domain: 'media-design' },
  { id: 'md4', label: 'メディアデザイン', x: 856, y: 408, domain: 'media-design' },
  { id: 'md5', label: 'サイエンティフィック・ビジュアライゼーション', x: 878, y: 478, domain: 'media-design' },

  // ALL THREE — center of triangle
  { id: 'all1', label: 'データ可視化', x: 510, y: 558, domain: 'all' },
  { id: 'all2', label: 'IoT（Internet of Things）', x: 648, y: 558, domain: 'all' },
  { id: 'all3', label: 'インテリジェントプロダクトデザイン', x: 526, y: 628, domain: 'all' },
  { id: 'all4', label: 'インテリジェントインタフェースデザイン', x: 652, y: 658, domain: 'all' },
  { id: 'all5', label: 'インタフェースエージェント', x: 582, y: 718, domain: 'all' },
]

const legendItems = [
  { domain: 'media' as Domain, label: 'メディア工学' },
  { domain: 'knowledge' as Domain, label: '知能工学' },
  { domain: 'design' as Domain, label: '情報デザイン' },
  { domain: 'media-knowledge' as Domain, label: 'メディア工学 × 知能工学' },
  { domain: 'media-design' as Domain, label: 'メディア工学 × 情報デザイン' },
  { domain: 'all' as Domain, label: '3領域横断' },
]
</script>

<style scoped>
.domain-diagram {
  width: 100%;
  overflow-x: auto;
}

.domain-diagram__svg {
  width: max(100%, 800px);
  height: auto;
  display: block;
}

.tri-edge {
  stroke: var(--color-on-surface);
  stroke-width: 1;
  opacity: 0.12;
}

.kw-group {
  cursor: default;
  transition: opacity var(--transition-fast);
}

.kw-dot {
  transition: opacity var(--transition-fast);
}

.kw-label {
  font-family: var(--font-body);
  font-size: 10px;
  transition: opacity var(--transition-fast);
}

.main-node {
  cursor: default;
}

.node-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Legend */
.diagram-legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs) var(--space-sm);
  margin-top: var(--space-md);
}

.diagram-legend__item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: default;
  opacity: 0.6;
  transition: opacity var(--transition-fast);
}

.diagram-legend__item:hover,
.diagram-legend__item.is-active {
  opacity: 1;
}

.diagram-legend__dot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
}

.diagram-legend__label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-muted);
  white-space: nowrap;
}
</style>
