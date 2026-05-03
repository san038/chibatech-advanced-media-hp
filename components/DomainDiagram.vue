<template>
  <div class="domain-diagram">
    <svg
      viewBox="0 0 1200 800"
      xmlns="http://www.w3.org/2000/svg"
      class="domain-diagram__svg"
      @mouseleave="hoveredDomain = null"
    >
      <!-- Triangle edges (faint structural guide) -->
      <line x1="600" y1="210" x2="320" y2="630" stroke="#1c1b1b" stroke-width="0.8" opacity="0.1" />
      <line x1="600" y1="210" x2="880" y2="630" stroke="#1c1b1b" stroke-width="0.8" opacity="0.1" />
      <line x1="320" y1="630" x2="880" y2="630" stroke="#1c1b1b" stroke-width="0.8" opacity="0.1" />

      <!-- Keywords -->
      <g
        v-for="kw in keywords"
        :key="kw.id"
        class="kw-group"
        :style="{ opacity: kwOpacity(kw.domain) }"
        @mouseenter="hoveredDomain = kw.domain"
        @mouseleave="hoveredDomain = null"
      >
        <circle :cx="kw.x" :cy="kw.y" r="2.5" :fill="domainColor(kw.domain)" />
        <text
          :x="textX(kw)"
          :y="textY(kw)"
          :text-anchor="textAnchor(kw)"
          :fill="domainColor(kw.domain)"
          class="kw-label"
        >{{ kw.label }}</text>
      </g>

      <!-- Center label -->
      <rect x="523" y="467" width="154" height="46" fill="#1c1b1b" />
      <text x="600" y="495" text-anchor="middle" fill="#fcf9f8" class="center-label">知能メディア工学科</text>

      <!-- Main nodes -->
      <g
        v-for="node in mainNodes"
        :key="node.key"
        class="main-node"
        @mouseenter="hoveredDomain = (node.key as Domain)"
        @mouseleave="hoveredDomain = null"
      >
        <rect :x="node.x - node.w / 2" :y="node.y - 20" :width="node.w" height="40" :fill="node.color" />
        <text :x="node.x" :y="node.y + 6" text-anchor="middle" fill="white" class="node-label">{{ node.label }}</text>
      </g>
    </svg>

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
  anchor: 'start' | 'end' | 'middle'
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

function textAnchor(kw: Keyword): 'start' | 'end' | 'middle' {
  return kw.anchor
}

function textX(kw: Keyword): number {
  if (kw.anchor === 'start') return kw.x + 7
  if (kw.anchor === 'end') return kw.x - 7
  return kw.x
}

function textY(kw: Keyword): number {
  return kw.anchor === 'middle' ? kw.y + 15 : kw.y + 4
}

// ─────────────────────────────────────────────────────────────────────────────
// Triangle: Media M(600,210)  Knowledge K(320,630)  Design D(880,630)
//
// Media keywords:
//   Left wing  — along DM line extended past M, going upper-left  dir(-0.554,-0.832)
//   Right wing — along KM line extended past M, going upper-right dir( 0.554,-0.832)
//   Step spacing: ~48px
//
// Knowledge keywords:
//   Diagonal — parallel to left edge KM, offset 60px outward (dir -0.832,-0.554)
//   Bottom   — extend below K vertex toward lower-left
//
// Design keywords:
//   Diagonal — parallel to right edge MD, offset 60px outward (dir +0.832,-0.554)
//   Bottom   — extend below D vertex toward lower-right
// ─────────────────────────────────────────────────────────────────────────────

const mainNodes: MainNode[] = [
  { key: 'media',     label: 'メディア工学',  x: 600, y: 210, color: COLORS.media,     w: 118 },
  { key: 'knowledge', label: '知能工学',      x: 320, y: 630, color: COLORS.knowledge, w: 94  },
  { key: 'design',    label: '情報デザイン',  x: 880, y: 630, color: COLORS.design,    w: 106 },
]

const keywords: Keyword[] = [
  // ── MEDIA ───────────────────────────────────────────────────────────────────
  // Left wing: M + t·(-0.554,-0.832), t = 48,96,144,192
  { id: 'm2', label: '音場シミュレーション',  x: 573, y: 170, domain: 'media', anchor: 'end'    },
  { id: 'm1', label: '３D音響',              x: 547, y: 130, domain: 'media', anchor: 'end'    },
  { id: 'm6', label: '画像/映像処理',        x: 520, y: 90,  domain: 'media', anchor: 'end'    },
  { id: 'm8', label: '画像/映像符号化と伝送', x: 494, y: 50,  domain: 'media', anchor: 'end'    },
  // Center: directly above M
  { id: 'm3', label: '音声伝達',             x: 600, y: 163, domain: 'media', anchor: 'middle' },
  // Right wing: M + t·(0.554,-0.832), t = 48,96,144,192
  { id: 'm5', label: '歌声合成',             x: 627, y: 170, domain: 'media', anchor: 'start'  },
  { id: 'm4', label: '話者認識',             x: 653, y: 130, domain: 'media', anchor: 'start'  },
  { id: 'm9', label: 'バーチャルリアリティ',  x: 680, y: 90,  domain: 'media', anchor: 'start'  },
  { id: 'm7', label: '画像/映像合成',        x: 706, y: 50,  domain: 'media', anchor: 'start'  },

  // ── KNOWLEDGE ────────────────────────────────────────────────────────────────
  // Diagonal along outer-left edge (60px outward perpendicular):
  // edge_x = 320+(630-y)/420*280; keyword_x = edge_x - 49.9; keyword_y = y - 33.2
  { id: 'k1',  label: 'ユビキタスコンピューティング',          x: 518, y: 225, domain: 'knowledge', anchor: 'end'   },
  { id: 'k2',  label: 'ITS（Intelligent Transport Systems）', x: 482, y: 279, domain: 'knowledge', anchor: 'end'   },
  { id: 'k3',  label: 'テキストマイニング',                   x: 446, y: 333, domain: 'knowledge', anchor: 'end'   },
  { id: 'k4',  label: '環境認識',                            x: 410, y: 387, domain: 'knowledge', anchor: 'end'   },
  { id: 'k5',  label: 'コンピュータネットワーク',              x: 374, y: 441, domain: 'knowledge', anchor: 'end'   },
  { id: 'k6',  label: 'データマイニング',                     x: 338, y: 495, domain: 'knowledge', anchor: 'end'   },
  { id: 'k7',  label: 'マルチエージェントシステム',            x: 302, y: 549, domain: 'knowledge', anchor: 'end'   },
  // Below K vertex, extending lower-left
  { id: 'k8',  label: 'ビッグデータ',         x: 248, y: 642, domain: 'knowledge', anchor: 'start' },
  { id: 'k9',  label: '人工知能',             x: 180, y: 674, domain: 'knowledge', anchor: 'start' },
  { id: 'k10', label: '機械学習',             x: 112, y: 706, domain: 'knowledge', anchor: 'start' },
  { id: 'k11', label: 'ディープラーニング',    x: 48,  y: 738, domain: 'knowledge', anchor: 'start' },

  // ── DESIGN ──────────────────────────────────────────────────────────────────
  // Diagonal along outer-right edge (60px outward perpendicular):
  // edge_x = 600+(y-210)/420*280; keyword_x = edge_x + 49.9; keyword_y = y - 33.2
  { id: 'd1',  label: 'テクノロジーアート',                         x: 682,  y: 225, domain: 'design', anchor: 'start' },
  { id: 'd2',  label: 'ソーシャルデザイン',                         x: 718,  y: 279, domain: 'design', anchor: 'start' },
  { id: 'd3',  label: 'サービスデザイン',                           x: 754,  y: 333, domain: 'design', anchor: 'start' },
  { id: 'd4',  label: 'ユーザエクスペリエンスデザイン/人間中心設計', x: 790,  y: 387, domain: 'design', anchor: 'start' },
  { id: 'd5',  label: '映像・CG・アニメーションデザイン',            x: 826,  y: 441, domain: 'design', anchor: 'start' },
  { id: 'd6',  label: 'Webデザイン/アプリケーションデザイン',        x: 862,  y: 495, domain: 'design', anchor: 'start' },
  { id: 'd7',  label: 'ユーザインタフェースデザイン',                x: 898,  y: 549, domain: 'design', anchor: 'start' },
  // Below D vertex, extending lower-right
  { id: 'd8',  label: 'プロダクトデザイン/デジタルファブリケーション', x: 928,  y: 642, domain: 'design', anchor: 'start' },
  { id: 'd9',  label: 'ビジュアライゼーション',                     x: 1002, y: 674, domain: 'design', anchor: 'start' },
  { id: 'd10', label: 'コミュニケーションデザイン',                  x: 1075, y: 706, domain: 'design', anchor: 'start' },

  // ── MEDIA × KNOWLEDGE ───────────────────────────────────────────────────────
  // Inside triangle, near left edge. Staggered y to avoid collision with MD row.
  // Left edge at y: x = 320+(630-y)/420*280. Dot placed ~25px inside.
  { id: 'mk1', label: 'AR（拡張現実）',              x: 563, y: 295, domain: 'media-knowledge', anchor: 'start' },
  { id: 'mk2', label: '音声認識',                   x: 527, y: 365, domain: 'media-knowledge', anchor: 'start' },
  { id: 'mk3', label: '画像認識',                   x: 491, y: 435, domain: 'media-knowledge', anchor: 'start' },
  { id: 'mk4', label: 'インテリジェント拡声システム', x: 455, y: 505, domain: 'media-knowledge', anchor: 'end'   }, // end: avoids center rect
  { id: 'mk5', label: '音の情景分析',               x: 419, y: 575, domain: 'media-knowledge', anchor: 'start' },

  // ── MEDIA × DESIGN ──────────────────────────────────────────────────────────
  // Inside triangle, near right edge. Staggered y (offset +35 from MK).
  // Right edge at y: x = 600+(y-210)/420*280. Dot placed ~15px inside.
  { id: 'md1', label: 'マルチモーダルインタフェース',                x: 660, y: 330, domain: 'media-design', anchor: 'end' },
  { id: 'md2', label: 'サウンドデザイン',                          x: 706, y: 400, domain: 'media-design', anchor: 'end' },
  { id: 'md3', label: '音環境デザイン',                            x: 753, y: 470, domain: 'media-design', anchor: 'end' },
  { id: 'md4', label: 'メディアデザイン',                          x: 800, y: 540, domain: 'media-design', anchor: 'end' },
  { id: 'md5', label: 'サイエンティフィック・ビジュアライゼーション', x: 847, y: 610, domain: 'media-design', anchor: 'end' },

  // ── ALL THREE ────────────────────────────────────────────────────────────────
  // Surrounding center label rect (x:523-677, y:467-513)
  { id: 'all1', label: 'データ可視化',                        x: 452, y: 448, domain: 'all', anchor: 'start'  },
  { id: 'all2', label: 'IoT（Internet of Things）',           x: 708, y: 448, domain: 'all', anchor: 'end'    },
  { id: 'all3', label: 'インテリジェントプロダクトデザイン',    x: 448, y: 540, domain: 'all', anchor: 'start'  },
  { id: 'all4', label: 'インテリジェントインタフェースデザイン', x: 705, y: 572, domain: 'all', anchor: 'end'    },
  { id: 'all5', label: 'インタフェースエージェント',            x: 578, y: 600, domain: 'all', anchor: 'middle' },
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

.kw-group {
  cursor: default;
  transition: opacity var(--transition-fast);
}

.kw-label {
  font-family: var(--font-body);
  font-size: 10px;
  pointer-events: none;
}

.center-label {
  font-family: var(--font-display);
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.01em;
  pointer-events: none;
}

.main-node {
  cursor: default;
}

.node-label {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.01em;
  pointer-events: none;
}

</style>
