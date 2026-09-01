<template>
  <div
    ref="rootEl"
    class="hero-foam"
    :class="{
      'hero-foam--interactive': interactive && focusDomain !== 'all',
      'is-dragging': dragging,
    }"
    aria-hidden="true"
    @pointerdown="onPointerDown"
  >
    <canvas ref="canvasEl" class="hero-foam__canvas" />
    <div class="hero-foam__labels">
      <span
        v-for="(b, i) in bodies"
        :key="i"
        :ref="(el: unknown) => setLabelEl(el, i)"
        class="hero-foam__label"
        :class="`hero-foam__label--${b.kind}`"
        :style="{ color: b.labelColor }"
        >{{ b.text }}</span
      >
      <span ref="enclosureLabelEl" class="hero-foam__enclosure-label"
        >知能メディア工学科</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";
import type { HeroKeyword } from "~/types";

// ── 領域定義 ─────────────────────────────────────────────────────────────────
type DomainKey = "media" | "knowledge" | "design";
// "all" = 3領域を重ねて「重なった学科」を表現する収束状態
type FocusKey = DomainKey | "all";
type Vec3 = { x: number; y: number; z: number };

// スクロール連動フォーカス（CourseScrolly から更新される共有状態）
const focusDomain = useState<FocusKey | null>("heroFocusDomain", () => null);

const DOMAIN_RGB: Record<DomainKey, string> = {
  media: "232, 88, 154",
  knowledge: "64, 217, 142",
  design: "90, 171, 240",
};
// コースカラー（--color-primary #3bbac6）。収束状態では全サークルをこの水色へ寄せる
const DEPT_RGB = "59, 186, 198";
const DOMAIN_LABEL: Record<DomainKey, string> = {
  media: "#f3a9cd",
  knowledge: "#8fe9bd",
  design: "#a9d4f8",
};
const CORE_LABEL: Record<DomainKey, string> = {
  media: "メディア工学",
  knowledge: "知識工学",
  design: "情報デザイン",
};

// 3領域の核を 3D 空間に配置（原点中心。CLUSTER 倍して使う）
const CORE_POS3: Record<DomainKey, Vec3> = {
  media: { x: -0.62, y: 0.12, z: -0.22 },
  knowledge: { x: 0.62, y: 0.12, z: -0.22 },
  design: { x: 0.0, y: -0.2, z: 0.46 },
};
// 核リングの向き（少し傾いたディスク）
const CORE_NRM: Record<DomainKey, Vec3> = {
  media: { x: 0.25, y: 0.05, z: 0.97 },
  knowledge: { x: -0.25, y: 0.05, z: 0.97 },
  design: { x: 0.0, y: -0.3, z: 0.95 },
};

// 既定のキーワード群（学科パンフレット「領域キーワード」の図に準拠）。
// WP「サイトコンテンツ」で上書き可（inc/site-content-admin.php の
// cimd_hero_keywords_default() と一致させること）。
const DEFAULT_KEYWORDS: HeroKeyword[] = [
  { text: "3D音響", domains: ["media"] },
  { text: "音場シミュレーション", domains: ["media"] },
  { text: "音声伝送", domains: ["media"] },
  { text: "音声合成", domains: ["media"] },
  { text: "話者認識", domains: ["media"] },
  { text: "歌声合成", domains: ["media"] },
  { text: "画像／映像処理", domains: ["media"] },
  { text: "画像／映像合成", domains: ["media"] },
  { text: "画像／映像符号化と伝送", domains: ["media"] },
  { text: "バーチャルリアリティ", domains: ["media"] },
  { text: "知能情報処理", domains: ["knowledge"] },
  { text: "環境認識", domains: ["knowledge"] },
  { text: "コンピュータネットワーク", domains: ["knowledge"] },
  { text: "データマイニング", domains: ["knowledge"] },
  { text: "マルチエージェントシステム", domains: ["knowledge"] },
  { text: "ビッグデータ", domains: ["knowledge"] },
  { text: "人工知能", domains: ["knowledge"] },
  { text: "機械学習", domains: ["knowledge"] },
  { text: "テキストマイニング", domains: ["knowledge"] },
  { text: "ITS（Intelligent Transport Systems）", domains: ["knowledge"] },
  { text: "ディープラーニング", domains: ["knowledge"] },
  { text: "ユビキタスコンピューティング", domains: ["knowledge"] },
  { text: "コミュニケーションデザイン", domains: ["design"] },
  { text: "ビジュアライゼーション", domains: ["design"] },
  { text: "プロダクトデザイン／デジタルファブリケーション", domains: ["design"] },
  { text: "ユーザインタフェースデザイン", domains: ["design"] },
  { text: "Webデザイン／アプリケーションデザイン", domains: ["design"] },
  { text: "映像・CG・アニメーションデザイン", domains: ["design"] },
  { text: "ユーザエクスペリエンスデザイン／人間中心設計", domains: ["design"] },
  { text: "ソーシャルデザイン", domains: ["design"] },
  { text: "サービスデザイン", domains: ["design"] },
  { text: "テクノロジーアート", domains: ["design"] },
  { text: "音声認識", domains: ["media", "knowledge"] },
  { text: "インテリジェント拡声システム", domains: ["media", "knowledge"] },
  { text: "画像認識", domains: ["media", "knowledge"] },
  { text: "音の情景分析", domains: ["media", "knowledge"] },
  { text: "AR（拡張現実）", domains: ["media", "knowledge"] },
  { text: "サウンドデザイン", domains: ["media", "design"] },
  { text: "音環境デザイン", domains: ["media", "design"] },
  { text: "マルチモーダルインタフェース", domains: ["media", "design"] },
  { text: "メディアデザイン", domains: ["media", "design"] },
  { text: "サイエンティフィック・ビジュアライゼーション", domains: ["media", "design"] },
  { text: "データ可視化", domains: ["knowledge", "design"] },
  { text: "IoT（Internet of Things）", domains: ["knowledge", "design"] },
  { text: "インテリジェントプロダクトデザイン", domains: ["knowledge", "design"] },
  { text: "インテリジェントインタフェースデザイン", domains: ["knowledge", "design"] },
  { text: "インタフェースエージェント", domains: ["knowledge", "design"] },
];
const KEYWORDS: HeroKeyword[] = useContent().heroKeywords ?? DEFAULT_KEYWORDS;

// ── パラメータ ───────────────────────────────────────────────────────────────
const KW_ATTRACT = 0.0018;
const CORE_ATTRACT = 0.022;
const DAMPING = 0.86;
const BROWNIAN = 0.04;
const CONTAIN_F = 0.52; // 原点からこの距離(minDim比)を超えたら引き戻す
const POINTER_RADIUS_F = 0.24;
const POINTER_FORCE = 1.4;
const COLLISION_PASSES = 2;
const SETTLE_STEPS = 320;
const START_DELAY_MS = 1600;

const CORE_RBASE = 0.18; // 核サークルの半径係数(minDim比)

// 浮遊ラベルの不透明度の基準（大きいほど読みやすい）
const LABEL_BASE_CORE = 0.62;
const LABEL_BASE_KW = 0.58;

// コースフォーカス時、対象領域のキーワードを核サークルの周囲へ点在させる
// 半径係数（核サークル半径に対する倍率）
const RING_SCATTER_MIN = 1.14;
const RING_SCATTER_SPAN = 0.6;

const CLUSTER_F = 0.34; // 星団の広がり(minDim比)
const CAM_DIST_F = 1.7; // カメラ距離(minDim比)
const FOCAL_F = 1.7; // 焦点距離(minDim比)
const NEAR = 40;
const CA_MAX = 2.6; // 色収差の最大ズレ(px)
const SEG_FINE = 46; // リングのポリゴン分割
const SEG_LOW = 32;

const AUTO_YAW_SPEED = 0.12; // 放置時の自動回転(rad/s)
const IDLE_PITCH = 0.16;
const IDLE_RESUME_MS = 2600;
const DRAG_SENS = 0.0065; // rad / px
const PITCH_LIMIT = 1.45;
const INERTIA_DECAY = 0.94;

interface Body {
  text: string;
  kind: "core" | "kw";
  domains: DomainKey[];
  pos: Vec3;
  vel: Vec3;
  dir: Vec3; // 核中心からのオフセット方向(単位)
  nrm: Vec3; // リングの法線(単位・現在値)
  nrm0: Vec3; // リングの法線(単位・初期値。収束時に前面へ補間する基準)
  u: Vec3;
  v: Vec3; // リング平面の基底
  r: number; // 半径(px)
  rBase: number; // 半径係数(minDim比)
  spread: number; // オフセット距離(minDim比)
  ringAngle: number; // コースフォーカス時: 核サークル周囲の配置角
  ringRad: number; // コースフォーカス時: 核サークル半径に対する配置半径倍率
  // 投影キャッシュ
  sx: number;
  sy: number;
  sr: number;
  zc: number;
  labelColor: string;
}

const rootEl = ref<HTMLElement | null>(null);
const canvasEl = ref<HTMLCanvasElement | null>(null);
const enclosureLabelEl = ref<HTMLElement | null>(null);
const bodies = ref<Body[]>([]);
const interactive = ref(false);
const dragging = ref(false);
const labelEls: (HTMLElement | null)[] = [];
function setLabelEl(el: unknown, i: number) {
  labelEls[i] = el as HTMLElement | null;
}

const TAU = Math.PI * 2;

let ctx: CanvasRenderingContext2D | null = null;
let dpr = 1;
let cssW = 0;
let cssH = 0;
let minDim = 0;
let cluster = 0;
let camDist = 0;
let camDistEff = 0; // フォーカス時のズームを反映した実効カメラ距離
let focal = 0;
let seg = SEG_FINE;
let lowFx = false;
let reduceMotion = false;
let rafId = 0;
let startTimer: ReturnType<typeof setTimeout> | null = null;
let resizeObserver: ResizeObserver | null = null;
let running = false;
let lastFrameT = 0;

const cam = { yaw: 0.5, pitch: IDLE_PITCH, yawVel: 0, pitchVel: 0 };
let lastInteract = -1e9;
const drag = { x: 0, y: 0, t: 0 };
const pointer = { x: 0, y: 0, active: false };

// 領域ごとの表示強度（1 = 通常、フォーカス時は非対象を大きく減光）
const NONFOCUS_DIM = 0.03;
const domainFocus: Record<DomainKey, number> = {
  media: 1,
  knowledge: 1,
  design: 1,
};
let focusZoom = 1;
// 投影の水平中心（0.5 = 中央、フォーカス時はダイアグラムを左へ寄せる）
let viewCenterX = 0.5;
// 収束度（0 = 通常配置、1 = 3領域を前面で重ねた状態）
let convergence = 0;
// コースフォーカスの度合い（0 = 通常、1 = 対象領域のキーワードを核サークル周囲へ点在）
let ringFocus = 0;
let ringFocusKey: DomainKey | null = null;

// ── ベクトル ─────────────────────────────────────────────────────────────────
function v3(x: number, y: number, z: number): Vec3 {
  return { x, y, z };
}
function len(a: Vec3): number {
  return Math.hypot(a.x, a.y, a.z);
}
function norm(a: Vec3): Vec3 {
  const l = len(a) || 1;
  return v3(a.x / l, a.y / l, a.z / l);
}
function cross(a: Vec3, b: Vec3): Vec3 {
  return v3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x,
  );
}
function basisOf(n: Vec3): { u: Vec3; v: Vec3 } {
  const ref = Math.abs(n.y) < 0.9 ? v3(0, 1, 0) : v3(1, 0, 0);
  const u = norm(cross(ref, n));
  const v = norm(cross(n, u));
  return { u, v };
}
// "r, g, b" 文字列どうしを t で補間
function mixRgb(a: string, b: string, t: number): string {
  const pa = a.split(",").map((s) => parseFloat(s));
  const pb = b.split(",").map((s) => parseFloat(s));
  return `${Math.round(pa[0] + (pb[0] - pa[0]) * t)}, ${Math.round(
    pa[1] + (pb[1] - pa[1]) * t,
  )}, ${Math.round(pa[2] + (pb[2] - pa[2]) * t)}`;
}
function clamp(x: number, lo: number, hi: number): number {
  return x < lo ? lo : x > hi ? hi : x;
}
function rand(seed: number): number {
  const s = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function randUnit(seed: number): Vec3 {
  const a = rand(seed) * TAU;
  const z = rand(seed + 1.3) * 2 - 1;
  const r = Math.sqrt(Math.max(0, 1 - z * z));
  return v3(r * Math.cos(a), r * Math.sin(a), z);
}

// ── カメラ変換 ───────────────────────────────────────────────────────────────
function worldToCam(p: Vec3): Vec3 {
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  const x1 = p.x * cy + p.z * sy;
  const z1 = -p.x * sy + p.z * cy;
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  return v3(x1, p.y * cp - z1 * sp, p.y * sp + z1 * cp);
}
function camToWorld(vv: Vec3): Vec3 {
  const cp = Math.cos(cam.pitch);
  const sp = Math.sin(cam.pitch);
  const y1 = vv.y * cp + vv.z * sp;
  const z1 = -vv.y * sp + vv.z * cp;
  const cy = Math.cos(cam.yaw);
  const sy = Math.sin(cam.yaw);
  return v3(vv.x * cy - z1 * sy, y1, vv.x * sy + z1 * cy);
}
interface Proj {
  sx: number;
  sy: number;
  scale: number;
  zc: number;
}
function projectCam(c: Vec3): Proj | null {
  const zc = c.z + camDistEff;
  if (zc <= NEAR) return null;
  const scale = focal / zc;
  return {
    sx: cssW * viewCenterX + c.x * scale,
    sy: cssH / 2 - c.y * scale,
    scale,
    zc,
  };
}

// フォーカス対象の核が画面中央・正面に来るカメラ角
function faceTarget(key: DomainKey): { yaw: number; pitch: number } {
  const c = CORE_POS3[key];
  const cx = c.x * cluster;
  const cy = c.y * cluster;
  const cz = c.z * cluster;
  const mag = Math.hypot(cx, cz) || 1;
  return {
    yaw: Math.atan2(-cx, cz),
    pitch: clamp(Math.atan2(cy, mag), -PITCH_LIMIT, PITCH_LIMIT),
  };
}
function angDiff(a: number, b: number): number {
  return (((b - a + Math.PI) % TAU) + TAU) % TAU - Math.PI;
}
function updateFocus(dt: number) {
  const fd = focusDomain.value;
  const rate = Math.min(1, dt * 3.5);
  const all = fd === "all";
  (["media", "knowledge", "design"] as DomainKey[]).forEach((k) => {
    const tgt = fd == null || all ? 1 : k === fd ? 1 : NONFOCUS_DIM;
    domainFocus[k] += (tgt - domainFocus[k]) * rate;
  });
  focusZoom += ((fd == null ? 1 : all ? 0.98 : 0.9) - focusZoom) * rate;
  camDistEff = camDist * focusZoom;
  // 単一領域フォーカス時のみ、キーワードを核サークルの周囲へ点在させる
  const single = fd != null && !all;
  if (single) ringFocusKey = fd as DomainKey;
  ringFocus += ((single ? 1 : 0) - ringFocus) * rate;
  // 横長画面ではフォーカス時にダイアグラムを左 30% 付近へ寄せ、右半分をテキスト用に空ける
  const wide = cssW > cssH * 1.1;
  const cxTarget = fd == null ? 0.5 : wide ? 0.3 : 0.5;
  viewCenterX += (cxTarget - viewCenterX) * rate;
  // "all": 3領域を前面で重ねる収束状態へ
  convergence += ((all ? 1 : 0) - convergence) * rate;
}

// 収束時、全リング（核＋キーワード）の法線を前面（カメラ方向）へ補間し、
// すべての円が同じ角度でこちらを向いて重なるようにする
function alignRings() {
  const faceN = camToWorld(v3(0, 0, 1));
  const t = convergence;
  for (const b of bodies.value) {
    b.nrm = norm(
      v3(
        b.nrm0.x + (faceN.x - b.nrm0.x) * t,
        b.nrm0.y + (faceN.y - b.nrm0.y) * t,
        b.nrm0.z + (faceN.z - b.nrm0.z) * t,
      ),
    );
    const bs = basisOf(b.nrm);
    b.u = bs.u;
    b.v = bs.v;
  }
}

// ── 初期化 ───────────────────────────────────────────────────────────────────
function buildBodies(): Body[] {
  const list: Body[] = [];

  (Object.keys(CORE_POS3) as DomainKey[]).forEach((key) => {
    const nrm = norm(CORE_NRM[key]);
    const { u, v } = basisOf(nrm);
    list.push({
      text: CORE_LABEL[key],
      kind: "core",
      domains: [key],
      pos: v3(0, 0, 0),
      vel: v3(0, 0, 0),
      dir: v3(0, 0, 0),
      nrm,
      nrm0: nrm,
      u,
      v,
      r: 0,
      rBase: CORE_RBASE,
      spread: 0,
      ringAngle: 0,
      ringRad: 0,
      sx: 0,
      sy: 0,
      sr: 0,
      zc: camDist,
      labelColor: DOMAIN_LABEL[key],
    });
  });

  KEYWORDS.forEach((kw, i) => {
    const multi = kw.domains.length > 1;
    const nrm = randUnit(i + 3.1);
    const { u, v } = basisOf(nrm);
    list.push({
      text: kw.text,
      kind: "kw",
      domains: kw.domains,
      pos: v3(0, 0, 0),
      vel: v3(0, 0, 0),
      dir: randUnit(i + 11.7),
      nrm,
      nrm0: nrm,
      u,
      v,
      r: 0,
      rBase: multi ? 0.05 : 0.042 + rand(i + 5) * 0.028,
      spread: multi ? 0.05 : 0.12 + rand(i + 9) * 0.09,
      // 黄金角ベース + ジッタで 360° を偏りなく点在させる
      ringAngle: (i * 2.399963 + rand(i + 4.2) * 0.9) % TAU,
      ringRad: RING_SCATTER_MIN + rand(i + 31.7) * RING_SCATTER_SPAN,
      sx: 0,
      sy: 0,
      sr: 0,
      zc: camDist,
      labelColor: multi ? "#efecea" : DOMAIN_LABEL[kw.domains[0]],
    });
  });

  return list;
}

function targetOf(b: Body): Vec3 {
  let tx = 0;
  let ty = 0;
  let tz = 0;
  for (const d of b.domains) {
    tx += CORE_POS3[d].x;
    ty += CORE_POS3[d].y;
    tz += CORE_POS3[d].z;
  }
  const n = b.domains.length;
  const s = b.spread * minDim;
  const cv = convergence;
  const posK = cluster * (1 - cv); // 収束時は核を完全に重ねる（間隔 0）
  const zK = posK * (1 - cv); // z を平面化して正面へ
  const sK = s * (1 - cv * 0.45);
  const base = v3(
    (tx / n) * posK + b.dir.x * sK,
    (ty / n) * posK + b.dir.y * sK,
    (tz / n) * zK + b.dir.z * sK * (1 - cv * 0.7),
  );

  // コースフォーカス: 対象領域のキーワードを核サークルの周囲 360° へ点在
  if (
    ringFocus > 0.001 &&
    cv < 0.5 &&
    b.kind === "kw" &&
    ringFocusKey &&
    b.domains.includes(ringFocusKey)
  ) {
    const core = CORE_POS3[ringFocusKey];
    const cn = basisOf(norm(CORE_NRM[ringFocusKey]));
    const rr = CORE_RBASE * minDim * b.ringRad;
    const ca = Math.cos(b.ringAngle);
    const sa = Math.sin(b.ringAngle);
    const ring = v3(
      core.x * cluster + rr * (ca * cn.u.x + sa * cn.v.x),
      core.y * cluster + rr * (ca * cn.u.y + sa * cn.v.y),
      core.z * cluster + rr * (ca * cn.u.z + sa * cn.v.z),
    );
    const t = ringFocus;
    return v3(
      base.x + (ring.x - base.x) * t,
      base.y + (ring.y - base.y) * t,
      base.z + (ring.z - base.z) * t,
    );
  }

  return base;
}

function placeInitial() {
  for (const b of bodies.value) {
    const t = targetOf(b);
    b.pos = v3(t.x, t.y, t.z);
    b.vel = v3(0, 0, 0);
  }
}

// ── 3D 物理（1 ステップ）────────────────────────────────────────────────────
function step(withForces: boolean) {
  const arr = bodies.value;
  const contain = CONTAIN_F * minDim;
  const brown = BROWNIAN * (minDim / 600);

  for (const b of arr) {
    const t = targetOf(b);
    const k = b.kind === "core" ? CORE_ATTRACT : KW_ATTRACT;
    b.vel.x += (t.x - b.pos.x) * k;
    b.vel.y += (t.y - b.pos.y) * k;
    b.vel.z += (t.z - b.pos.z) * k;

    if (withForces) {
      b.vel.x += (Math.random() - 0.5) * brown;
      b.vel.y += (Math.random() - 0.5) * brown;
      b.vel.z += (Math.random() - 0.5) * brown;

      const d = len(b.pos);
      if (d > contain) {
        const pull = (d - contain) * 0.02;
        b.vel.x -= (b.pos.x / d) * pull;
        b.vel.y -= (b.pos.y / d) * pull;
        b.vel.z -= (b.pos.z / d) * pull;
      }

      if (pointer.active && !dragging.value && b.sr > 0) {
        const ex = b.sx - pointer.x;
        const ey = b.sy - pointer.y;
        const ed = Math.hypot(ex, ey) || 1;
        const R = POINTER_RADIUS_F * minDim;
        if (ed < R) {
          const f =
            (1 - ed / R) * POINTER_FORCE * (b.kind === "core" ? 0.3 : 1);
          const cr = camToWorld(v3(1, 0, 0));
          const cu = camToWorld(v3(0, 1, 0));
          const wx = (cr.x * ex - cu.x * ey) / ed;
          const wy = (cr.y * ex - cu.y * ey) / ed;
          const wz = (cr.z * ex - cu.z * ey) / ed;
          b.vel.x += wx * f;
          b.vel.y += wy * f;
          b.vel.z += wz * f;
        }
      }
    }

    b.vel.x *= DAMPING;
    b.vel.y *= DAMPING;
    b.vel.z *= DAMPING;
    b.pos.x += b.vel.x;
    b.pos.y += b.vel.y;
    b.pos.z += b.vel.z;
  }

  // 3D 衝突分離（円が重ならないように）= 立体的なパッキング
  for (let pass = 0; pass < COLLISION_PASSES; pass++) {
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      for (let j = i + 1; j < arr.length; j++) {
        const b = arr[j];
        if (a.kind === "core" && b.kind === "core") continue;
        const ar = a.kind === "core" ? a.r * 0.5 : a.r;
        const br = b.kind === "core" ? b.r * 0.5 : b.r;
        const dx = b.pos.x - a.pos.x;
        const dy = b.pos.y - a.pos.y;
        const dz = b.pos.z - a.pos.z;
        const dist = Math.hypot(dx, dy, dz) || 1;
        const overlap = ar + br - dist;
        if (overlap > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;
          const aMove = a.kind === "core" ? 0 : b.kind === "core" ? 1 : 0.5;
          const bMove = b.kind === "core" ? 0 : a.kind === "core" ? 1 : 0.5;
          a.pos.x -= nx * overlap * aMove;
          a.pos.y -= ny * overlap * aMove;
          a.pos.z -= nz * overlap * aMove;
          b.pos.x += nx * overlap * bMove;
          b.pos.y += ny * overlap * bMove;
          b.pos.z += nz * overlap * bMove;
        }
      }
    }
  }
}

// ── リング描画 ───────────────────────────────────────────────────────────────
type Pt = { sx: number; sy: number } | null;

function ringPts(
  center: Vec3,
  u: Vec3,
  vv: Vec3,
  rr: number,
  count: number,
  a0 = 0,
  a1 = TAU,
): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= count; i++) {
    const th = a0 + (a1 - a0) * (i / count);
    const c = Math.cos(th);
    const s = Math.sin(th);
    const w = v3(
      center.x + rr * (c * u.x + s * vv.x),
      center.y + rr * (c * u.y + s * vv.y),
      center.z + rr * (c * u.z + s * vv.z),
    );
    const p = projectCam(worldToCam(w));
    out.push(p ? { sx: p.sx, sy: p.sy } : null);
  }
  return out;
}

function strokePoly(
  c: CanvasRenderingContext2D,
  pts: Pt[],
  ox: number,
  oy: number,
  rgb: string,
  a: number,
  lw: number,
) {
  c.lineWidth = lw;
  c.strokeStyle = `rgba(${rgb}, ${a})`;
  c.beginPath();
  let pen = false;
  for (const p of pts) {
    if (!p) {
      pen = false;
      continue;
    }
    if (!pen) {
      c.moveTo(p.sx + ox, p.sy + oy);
      pen = true;
    } else {
      c.lineTo(p.sx + ox, p.sy + oy);
    }
  }
  c.stroke();
}

function caPoly(
  c: CanvasRenderingContext2D,
  pts: Pt[],
  off: number,
  a: number,
  lw: number,
) {
  strokePoly(c, pts, -off, 0, "255, 60, 70", a, lw);
  strokePoly(c, pts, off, 0, "70, 150, 255", a, lw);
  strokePoly(c, pts, 0, -off * 0.6, "90, 255, 150", a, lw);
}

function drawBody(c: CanvasRenderingContext2D, b: Body) {
  const cs = worldToCam(b.pos);
  const p = projectCam(cs);
  if (!p) {
    b.sr = 0;
    return;
  }
  b.sx = p.sx;
  b.sy = p.sy;
  b.sr = b.r * p.scale;
  b.zc = p.zc;

  const cv = convergence;
  // 収束時、キーワードのサークルは透明化（3領域の円だけ残す）
  const kwVis = b.kind === "kw" ? 1 - cv : 1;
  if (kwVis < 0.02) return;

  const fade = clamp((p.scale - 0.6) / 0.9, 0, 1);
  // スクロール連動フォーカス: 所属領域の強度の最大値（境界語は片側が明るければ残る）
  const ff = Math.max(...b.domains.map((d) => domainFocus[d]));
  const fm = (0.03 + 0.97 * ff) * kwVis;
  const main = ringPts(b.pos, b.u, b.v, b.r, seg);

  // 領域グロー（収束時はコースカラーの水色へ寄せる）
  for (let i = 0; i < b.domains.length; i++) {
    const rgb =
      cv > 0.01 ? mixRgb(DOMAIN_RGB[b.domains[i]], DEPT_RGB, cv) : DOMAIN_RGB[b.domains[i]];
    c.shadowColor = `rgb(${rgb})`;
    c.shadowBlur = b.sr * (0.26 + 0.2 * fade) * (0.1 + 0.9 * ff);
    strokePoly(c, main, 0, 0, rgb, (0.14 + 0.2 * fade) * fm, 1.1);
  }
  c.shadowBlur = 0;

  // 色収差リング（本体）
  const off = (0.5 + CA_MAX * fade) * (b.kind === "core" ? 0.7 : 1);
  caPoly(
    c,
    main,
    off,
    (0.13 + 0.5 * fade) * fm * (1 - 0.45 * cv),
    (0.8 + 1.4 * fade) * (0.25 + 0.75 * ff),
  );

  // 収束時: 水色の実線でくっきり縁取る
  if (cv > 0.01 && b.kind === "core") {
    strokePoly(
      c,
      main,
      0,
      0,
      DEPT_RGB,
      (0.32 + 0.34 * fade) * cv,
      1 + 1.1 * fade,
    );
  }

  if (b.kind === "core") drawInstrument(c, b, fade, off, fm);
}

// 3領域の円を囲う正方形の四隅ブラケット＋ラベル（収束時のみ）
const enclosureBox = { x: 0, y: 0, half: 0, valid: false };

function drawEnclosure(c: CanvasRenderingContext2D) {
  enclosureBox.valid = false;
  if (convergence < 0.02) return;
  const cores = bodies.value.filter((b) => b.kind === "core" && b.sr > 0);
  if (cores.length === 0) return;

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const b of cores) {
    minX = Math.min(minX, b.sx - b.sr);
    minY = Math.min(minY, b.sy - b.sr);
    maxX = Math.max(maxX, b.sx + b.sr);
    maxY = Math.max(maxY, b.sy + b.sr);
  }
  const pad = minDim * 0.055;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const half = Math.max(maxX - minX, maxY - minY) / 2 + pad;
  enclosureBox.x = cx;
  enclosureBox.y = cy;
  enclosureBox.half = half;
  enclosureBox.valid = true;

  const a = convergence;
  const arm = half * 0.3;
  const corners: [number, number, number, number][] = [
    [cx - half, cy - half, 1, 1],
    [cx + half, cy - half, -1, 1],
    [cx - half, cy + half, 1, -1],
    [cx + half, cy + half, -1, -1],
  ];
  // 色収差付きで primary カラーの角線を描く
  const passes: [number, string, number, number][] = [
    [-0.8, "255, 60, 70", 0.16 * a, 1.2],
    [0.8, "70, 150, 255", 0.16 * a, 1.2],
    [0, DEPT_RGB, 0.85 * a, 1.6],
  ];
  for (const [ox, rgb, alpha, lw] of passes) {
    c.strokeStyle = `rgba(${rgb}, ${alpha})`;
    c.lineWidth = lw;
    c.beginPath();
    for (const [x, y, sx, sy] of corners) {
      c.moveTo(x + sx * arm + ox, y);
      c.lineTo(x + ox, y);
      c.lineTo(x + ox, y + sy * arm);
    }
    c.stroke();
  }
}

function drawInstrument(
  c: CanvasRenderingContext2D,
  b: Body,
  fade: number,
  off: number,
  dim: number,
) {
  const a = (0.08 + 0.14 * fade) * dim;
  // 内側の同心円
  caPoly(
    c,
    ringPts(b.pos, b.u, b.v, b.r * 0.6, seg),
    off * 0.6,
    a + 0.05 * dim,
    0.8,
  );
  strokePoly(
    c,
    ringPts(b.pos, b.u, b.v, b.r * 0.78, seg, 0.2 * TAU, 0.95 * TAU),
    0,
    0,
    "255, 255, 255",
    a,
    1,
  );

  // 目盛り
  const ticks = lowFx ? 28 : 44;
  c.strokeStyle = `rgba(255, 255, 255, ${a})`;
  c.lineWidth = 1;
  c.beginPath();
  for (let i = 0; i < ticks; i++) {
    const th = (i / ticks) * TAU;
    const cth = Math.cos(th);
    const sth = Math.sin(th);
    const long = i % 4 === 0;
    const inr = b.r * (long ? 0.86 : 0.92);
    for (const [rr, first] of [
      [inr, true],
      [b.r, false],
    ] as [number, boolean][]) {
      const w = v3(
        b.pos.x + rr * (cth * b.u.x + sth * b.v.x),
        b.pos.y + rr * (cth * b.u.y + sth * b.v.y),
        b.pos.z + rr * (cth * b.u.z + sth * b.v.z),
      );
      const pr = projectCam(worldToCam(w));
      if (!pr) continue;
      if (first) c.moveTo(pr.sx, pr.sy);
      else c.lineTo(pr.sx, pr.sy);
    }
  }
  c.stroke();

  // センターのレティクル
  const rk = b.r * 0.16;
  strokePoly(
    c,
    ringPts(b.pos, b.u, b.v, b.r * 0.05, 16),
    0,
    0,
    "255, 255, 255",
    a + 0.08 * dim,
    1,
  );
  c.strokeStyle = `rgba(255, 255, 255, ${a + 0.08 * dim})`;
  c.lineWidth = 1;
  c.beginPath();
  for (const [d1, d2] of [
    [b.u, -1],
    [b.u, 1],
    [b.v, -1],
    [b.v, 1],
  ] as [Vec3, number][]) {
    const wa = v3(b.pos.x, b.pos.y, b.pos.z);
    const wb = v3(
      b.pos.x + d1.x * rk * d2,
      b.pos.y + d1.y * rk * d2,
      b.pos.z + d1.z * rk * d2,
    );
    const pa = projectCam(worldToCam(wa));
    const pb = projectCam(worldToCam(wb));
    if (!pa || !pb) continue;
    c.moveTo(pa.sx, pa.sy);
    c.lineTo(pb.sx, pb.sy);
  }
  c.stroke();
}

// ── 3D グリッド（カメラと一緒に回転する空間の箱）──────────────────────────
function gridLine(c: CanvasRenderingContext2D, a: Vec3, b: Vec3, alpha: number) {
  const pa = projectCam(worldToCam(a));
  const pb = projectCam(worldToCam(b));
  if (!pa || !pb) return;
  const zc = (pa.zc + pb.zc) / 2;
  const f = clamp((camDistEff * 1.9 - zc) / (camDistEff * 1.4), 0.15, 1);
  c.strokeStyle = `rgba(255, 255, 255, ${alpha * f})`;
  c.beginPath();
  c.moveTo(pa.sx, pa.sy);
  c.lineTo(pb.sx, pb.sy);
  c.stroke();
}

function drawGrid3D(c: CanvasRenderingContext2D) {
  const G = 0.62 * minDim;
  const DIV = 5;
  const stepW = (2 * G) / DIV;
  const dim = 1 - 0.55 * convergence;
  const gA = 0.05 * dim; // 面内グリッド
  const eA = 0.13 * dim; // 箱のエッジ
  c.lineWidth = 1;

  for (let axis = 0; axis < 3; axis++) {
    // その軸の ±G 2面のうち、カメラから遠い面だけを描く（部屋の奥3面）
    const cp = [0, 0, 0];
    cp[axis] = G;
    const cm = [0, 0, 0];
    cm[axis] = -G;
    const sign =
      worldToCam(v3(cp[0], cp[1], cp[2])).z > worldToCam(v3(cm[0], cm[1], cm[2])).z
        ? G
        : -G;
    const a1 = (axis + 1) % 3;
    const a2 = (axis + 2) % 3;
    for (let i = 0; i <= DIV; i++) {
      const t = -G + i * stepW;
      const edge = i === 0 || i === DIV;
      const alpha = edge ? eA : gA;
      const q1 = [0, 0, 0];
      const q2 = [0, 0, 0];
      q1[axis] = sign;
      q2[axis] = sign;
      q1[a1] = t;
      q2[a1] = t;
      q1[a2] = -G;
      q2[a2] = G;
      gridLine(c, v3(q1[0], q1[1], q1[2]), v3(q2[0], q2[1], q2[2]), alpha);
      const r1 = [0, 0, 0];
      const r2 = [0, 0, 0];
      r1[axis] = sign;
      r2[axis] = sign;
      r1[a2] = t;
      r2[a2] = t;
      r1[a1] = -G;
      r2[a1] = G;
      gridLine(c, v3(r1[0], r1[1], r1[2]), v3(r2[0], r2[1], r2[2]), alpha);
    }
  }
}

// ── HUD（スクリーン空間）────────────────────────────────────────────────────
function drawHud(c: CanvasRenderingContext2D) {
  c.globalCompositeOperation = "source-over";
  drawGrid3D(c);

  c.strokeStyle = "rgba(255, 255, 255, 0.13)";
  c.lineWidth = 1.5;
  const m = 26;
  const arm = 24;
  for (const [cx, cy, sx, sy] of [
    [m, m, 1, 1],
    [cssW - m, m, -1, 1],
    [m, cssH - m, 1, -1],
    [cssW - m, cssH - m, -1, -1],
  ] as [number, number, number, number][]) {
    c.beginPath();
    c.moveTo(cx + sx * arm, cy);
    c.lineTo(cx, cy);
    c.lineTo(cx, cy + sy * arm);
    c.stroke();
  }

  c.strokeStyle = "rgba(255, 255, 255, 0.09)";
  const rx = cssW - 40;
  for (let y = 120; y < cssH - 120; y += 44) {
    const long = Math.round((y - 120) / 44) % 3 === 0;
    c.beginPath();
    c.moveTo(rx, y);
    c.lineTo(rx + (long ? 18 : 10), y);
    c.stroke();
  }
}

// ── フレーム ─────────────────────────────────────────────────────────────────
function updateCamera(now: number, dt: number) {
  if (dragging.value) return;

  // VISION（3領域収束）時のみカメラを正面に固定。単一領域のコースフォーカス時は
  // 通常どおり慣性＋放置回転＋ドラッグで自由に回せる。
  if (focusDomain.value === "all") {
    const rate = Math.min(1, dt * 2.4);
    cam.yaw += angDiff(cam.yaw, 0) * rate;
    cam.pitch += (0.04 - cam.pitch) * rate;
    cam.yawVel = 0;
    cam.pitchVel = 0;
    if (cam.yaw > TAU) cam.yaw -= TAU;
    if (cam.yaw < 0) cam.yaw += TAU;
    return;
  }

  cam.yaw += cam.yawVel * dt;
  cam.pitch = clamp(cam.pitch + cam.pitchVel * dt, -PITCH_LIMIT, PITCH_LIMIT);
  const decay = Math.pow(INERTIA_DECAY, dt * 60);
  cam.yawVel *= decay;
  cam.pitchVel *= decay;
  if (now - lastInteract > IDLE_RESUME_MS) {
    cam.yaw += AUTO_YAW_SPEED * dt;
    cam.pitch += (IDLE_PITCH - cam.pitch) * Math.min(1, dt * 0.5);
  }
  if (cam.yaw > TAU) cam.yaw -= TAU;
  if (cam.yaw < 0) cam.yaw += TAU;
}

function renderScene() {
  if (!ctx) return;
  const c = ctx;
  c.clearRect(0, 0, cssW, cssH);
  drawHud(c);

  const order = bodies.value
    .map((_, i) => i)
    .sort((i, j) => bodies.value[j].zc - bodies.value[i].zc);

  c.globalCompositeOperation = "lighter";
  for (const idx of order) drawBody(c, bodies.value[idx]);
  drawEnclosure(c);
  c.globalCompositeOperation = "source-over";

  positionLabels();
  positionEnclosure();
}

function positionEnclosure() {
  const el = enclosureLabelEl.value;
  if (!el) return;
  if (convergence < 0.05 || !enclosureBox.valid) {
    el.style.opacity = "0";
    return;
  }
  // 重なった円の中央にラベルを置く
  el.style.transform = `translate(-50%, -50%) translate(${enclosureBox.x}px, ${enclosureBox.y}px)`;
  el.style.opacity = (convergence * 0.95).toFixed(3);
}

function positionLabels() {
  for (let i = 0; i < bodies.value.length; i++) {
    const el = labelEls[i];
    const b = bodies.value[i];
    if (!el) continue;
    if (b.sr <= 0) {
      el.style.opacity = "0";
      continue;
    }
    const near = clamp((camDistEff - (b.zc - camDistEff)) / camDistEff, 0.4, 1.4);
    const s = clamp(0.7 + (near - 1) * 0.5, 0.6, 1.3);
    el.style.transform = `translate(-50%, -50%) translate(${b.sx}px, ${
      b.sy
    }px) scale(${s.toFixed(3)})`;
    const ff = Math.max(...b.domains.map((d) => domainFocus[d]));
    const base = b.kind === "core" ? LABEL_BASE_CORE : LABEL_BASE_KW;
    // 収束時はコース／キーワードのラベルをすべて消し、中央の学科ラベルだけ残す
    el.style.opacity = clamp(
      base * near * ff * ff * (1 - convergence),
      0,
      1,
    ).toFixed(3);
    el.style.zIndex = String(Math.round(20000 - b.zc));
  }
}

function frame(now: number) {
  if (!lastFrameT) lastFrameT = now;
  const dt = Math.min(0.05, (now - lastFrameT) / 1000);
  lastFrameT = now;
  step(true);
  updateFocus(dt);
  updateCamera(now, dt);
  alignRings();
  renderScene();
  rafId = requestAnimationFrame(frame);
}

function startLoop() {
  if (running) return;
  running = true;
  lastFrameT = 0;
  rafId = requestAnimationFrame(frame);
}
function stopLoop() {
  running = false;
  cancelAnimationFrame(rafId);
}

// ── 入力（ドラッグでカメラ周回）─────────────────────────────────────────────
function onPointerDown(e: PointerEvent) {
  // VISION（収束）時は回転操作を無効化
  if (!interactive.value || focusDomain.value === "all") return;
  dragging.value = true;
  drag.x = e.clientX;
  drag.y = e.clientY;
  drag.t = performance.now();
  lastInteract = drag.t;
  cam.yawVel = 0;
  cam.pitchVel = 0;
  (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
  const root = rootEl.value;
  if (root) {
    const rect = root.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
    pointer.active =
      pointer.x >= -rect.width * 0.15 &&
      pointer.x <= rect.width * 1.15 &&
      pointer.y >= -rect.height * 0.15 &&
      pointer.y <= rect.height * 1.15;
  }
  if (!dragging.value) return;
  const now = performance.now();
  const dt = Math.max(0.001, (now - drag.t) / 1000);
  const dx = e.clientX - drag.x;
  const dy = e.clientY - drag.y;
  cam.yaw += dx * DRAG_SENS;
  cam.pitch = clamp(cam.pitch - dy * DRAG_SENS, -PITCH_LIMIT, PITCH_LIMIT);
  cam.yawVel = (dx * DRAG_SENS) / dt;
  cam.pitchVel = (-dy * DRAG_SENS) / dt;
  drag.x = e.clientX;
  drag.y = e.clientY;
  drag.t = now;
  lastInteract = now;
}

function onPointerUp() {
  if (dragging.value) {
    dragging.value = false;
    lastInteract = performance.now();
  }
}

function onPointerLeave() {
  pointer.active = false;
}

function onVisibility() {
  if (document.hidden) stopLoop();
  else if (interactive.value || running || lastFrameT === 0) startLoop();
}

// ── リサイズ ─────────────────────────────────────────────────────────────────
function resize() {
  const root = rootEl.value;
  const canvas = canvasEl.value;
  if (!root || !canvas) return;
  const rect = root.getBoundingClientRect();
  cssW = Math.max(1, rect.width);
  cssH = Math.max(1, rect.height);
  minDim = Math.min(cssW, cssH);
  cluster = CLUSTER_F * minDim;
  camDist = CAM_DIST_F * minDim;
  camDistEff = camDist * focusZoom;
  focal = FOCAL_F * minDim;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (const b of bodies.value) b.r = b.rBase * minDim;
}

// ── ライフサイクル ───────────────────────────────────────────────────────────
onMounted(() => {
  bodies.value = buildBodies();
  resize();
  placeInitial();

  reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const finePointer = window.matchMedia?.("(pointer: fine)").matches ?? true;
  lowFx = !finePointer;
  seg = lowFx ? SEG_LOW : SEG_FINE;

  resizeObserver = new ResizeObserver(() => {
    resize();
    if (reduceMotion) renderScene();
  });
  resizeObserver.observe(rootEl.value as HTMLElement);

  // reduced-motion 時はアニメせず、フォーカス変化のたびに静止画を描き直す
  watch(focusDomain, (fd) => {
    if (!reduceMotion) return;
    const all = fd === "all";
    (["media", "knowledge", "design"] as DomainKey[]).forEach((k) => {
      domainFocus[k] = fd == null || all ? 1 : k === fd ? 1 : NONFOCUS_DIM;
    });
    focusZoom = fd == null ? 1 : all ? 0.98 : 0.9;
    camDistEff = camDist * focusZoom;
    viewCenterX = fd == null ? 0.5 : cssW > cssH * 1.1 ? 0.3 : 0.5;
    convergence = all ? 1 : 0;
    const single = fd != null && !all;
    if (single) ringFocusKey = fd as DomainKey;
    ringFocus = single ? 1 : 0;
    if (all) {
      cam.yaw = 0;
      cam.pitch = 0.04;
    } else if (fd) {
      const t = faceTarget(fd);
      cam.yaw = t.yaw;
      cam.pitch = t.pitch;
    } else {
      cam.yaw = 0.5;
      cam.pitch = IDLE_PITCH;
    }
    alignRings();
    // 収束の位置変化を静止画へ反映するため数ステップ回す
    for (let i = 0; i < 90; i++) step(false);
    renderScene();
  });

  if (reduceMotion) {
    for (let i = 0; i < SETTLE_STEPS; i++) step(false);
    renderScene();
    return;
  }

  for (let i = 0; i < 140; i++) step(false); // 初期パッキングを収束
  interactive.value = finePointer;
  lastInteract = performance.now() - IDLE_RESUME_MS; // 最初は自動回転

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerup", onPointerUp, { passive: true });
  window.addEventListener("pointercancel", onPointerUp, { passive: true });
  window.addEventListener("pointerleave", onPointerLeave, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);

  startTimer = setTimeout(startLoop, START_DELAY_MS);
});

onUnmounted(() => {
  focusDomain.value = null;
  stopLoop();
  if (startTimer) clearTimeout(startTimer);
  resizeObserver?.disconnect();
  window.removeEventListener("pointermove", onPointerMove);
  window.removeEventListener("pointerup", onPointerUp);
  window.removeEventListener("pointercancel", onPointerUp);
  window.removeEventListener("pointerleave", onPointerLeave);
  document.removeEventListener("visibilitychange", onVisibility);
});
</script>

<style scoped>
.hero-foam {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero-foam--interactive {
  pointer-events: auto;
  cursor: grab;
  touch-action: none;
}

.hero-foam--interactive.is-dragging {
  cursor: grabbing;
}

.hero-foam__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.hero-foam::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  opacity: 0.045;
  mix-blend-mode: screen;
  pointer-events: none;
}

.hero-foam::after {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at 50% 45%,
    transparent 40%,
    rgba(10, 10, 12, 0.55) 100%
  );
  pointer-events: none;
}

.hero-foam__labels {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-foam__label {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  line-height: 1;
  letter-spacing: 0.12em;
  text-shadow:
    0 0 6px rgba(10, 10, 12, 0.9),
    0 0 14px rgba(10, 10, 12, 0.6);
  will-change: transform, opacity;
}

.hero-foam__label--core {
  font-weight: 600;
  font-size: clamp(0.8rem, 1.9vw, 1.2rem);
}

.hero-foam__label--kw {
  font-weight: 400;
  font-size: clamp(0.58rem, 1.15vw, 0.82rem);
}

/* 3領域を囲う正方形エリア上端のラベル（収束状態のみ表示） */
.hero-foam__enclosure-label {
  position: absolute;
  left: 0;
  top: 0;
  white-space: nowrap;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-weight: 600;
  font-size: clamp(0.72rem, 1.6vw, 1.05rem);
  letter-spacing: 0.24em;
  color: var(--color-primary);
  text-shadow:
    0 0 5px rgba(10, 10, 12, 0.95),
    0 0 18px rgba(10, 10, 12, 0.9);
  opacity: 0;
  will-change: transform, opacity;
}

@media (prefers-reduced-motion: reduce) {
  .hero-foam__enclosure-label {
    will-change: auto;
  }
  .hero-foam__label {
    will-change: auto;
  }
  .hero-foam::before {
    display: none;
  }
}
</style>
