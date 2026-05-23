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
const LABEL_R = 6.05;

// アニメーションタイミング（SVG版と同じ値）
const HIGHLIGHT_DRAW_MS = 1200;
const HIGHLIGHT_MERGE_MS = 1500;
const COIN_POP_MS = 450;
const COIN_HOLD_MS = 1100;
const COIN_FADE_MS = 800;
const HIGHLIGHT_SHRINK_MS = 600;
const HIGHLIGHT_PAUSE_MS = 250;
const BURST_MS = 420;

// ── Keyword data ───────────────────────────────────────────────────────────────
interface Keyword3D {
  id: string;
  label: string;
  angleDeg: number;
  domain: Domain;
}

function equalArcDots(fromDeg: number, toDeg: number, count: number): number[] {
  const span = toDeg - fromDeg;
  const gap = span / (count + 1);
  return Array.from({ length: count }, (_, i) => fromDeg + gap * (i + 1));
}
const angDesignToKnowledge = equalArcDots(30, 150, 16);
const angKnowledgeToMedia = equalArcDots(150, 270, 14);
const angMediaToDesign = equalArcDots(-90, 30, 15);

const keywords: Keyword3D[] = [
  // MEDIA
  { id: "m1", label: "３D音響", angleDeg: angKnowledgeToMedia[5]!, domain: "media" },
  { id: "m2", label: "音場シミュレーション", angleDeg: angKnowledgeToMedia[6]!, domain: "media" },
  { id: "m3", label: "音声伝達", angleDeg: angKnowledgeToMedia[7]!, domain: "media" },
  { id: "m4", label: "話者認識", angleDeg: angKnowledgeToMedia[8]!, domain: "media" },
  { id: "m5", label: "歌声合成", angleDeg: angKnowledgeToMedia[9]!, domain: "media" },
  { id: "m6", label: "画像/映像処理", angleDeg: angKnowledgeToMedia[10]!, domain: "media" },
  { id: "m7", label: "画像/映像合成", angleDeg: angKnowledgeToMedia[11]!, domain: "media" },
  { id: "m8", label: "画像/映像符号化と伝送", angleDeg: angKnowledgeToMedia[12]!, domain: "media" },
  { id: "m9", label: "バーチャルリアリティ", angleDeg: angKnowledgeToMedia[13]!, domain: "media" },
  // KNOWLEDGE
  { id: "k1", label: "ユビキタスコンピューティング", angleDeg: angDesignToKnowledge[5]!, domain: "knowledge" },
  { id: "k2", label: "ITS（Intelligent Transport Systems）", angleDeg: angDesignToKnowledge[6]!, domain: "knowledge" },
  { id: "k3", label: "テキストマイニング", angleDeg: angDesignToKnowledge[7]!, domain: "knowledge" },
  { id: "k4", label: "環境認識", angleDeg: angDesignToKnowledge[8]!, domain: "knowledge" },
  { id: "k5", label: "コンピュータネットワーク", angleDeg: angDesignToKnowledge[9]!, domain: "knowledge" },
  { id: "k6", label: "データマイニング", angleDeg: angDesignToKnowledge[10]!, domain: "knowledge" },
  { id: "k7", label: "マルチエージェントシステム", angleDeg: angDesignToKnowledge[11]!, domain: "knowledge" },
  { id: "k8", label: "ビッグデータ", angleDeg: angDesignToKnowledge[12]!, domain: "knowledge" },
  { id: "k9", label: "人工知能", angleDeg: angDesignToKnowledge[13]!, domain: "knowledge" },
  { id: "k10", label: "機械学習", angleDeg: angDesignToKnowledge[14]!, domain: "knowledge" },
  { id: "k11", label: "ディープラーニング", angleDeg: angDesignToKnowledge[15]!, domain: "knowledge" },
  // DESIGN
  { id: "d1", label: "テクノロジーアート", angleDeg: angMediaToDesign[5]!, domain: "design" },
  { id: "d2", label: "ソーシャルデザイン", angleDeg: angMediaToDesign[6]!, domain: "design" },
  { id: "d3", label: "サービスデザイン", angleDeg: angMediaToDesign[7]!, domain: "design" },
  { id: "d4", label: "ユーザエクスペリエンスデザイン/人間中心設計", angleDeg: angMediaToDesign[8]!, domain: "design" },
  { id: "d5", label: "映像・CG・アニメーションデザイン", angleDeg: angMediaToDesign[9]!, domain: "design" },
  { id: "d6", label: "Webデザイン/アプリケーションデザイン", angleDeg: angMediaToDesign[10]!, domain: "design" },
  { id: "d7", label: "ユーザインタフェースデザイン", angleDeg: angMediaToDesign[11]!, domain: "design" },
  { id: "d8", label: "プロダクトデザイン/デジタルファブリケーション", angleDeg: angMediaToDesign[12]!, domain: "design" },
  { id: "d9", label: "ビジュアライゼーション", angleDeg: angMediaToDesign[13]!, domain: "design" },
  { id: "d10", label: "コミュニケーションデザイン", angleDeg: angMediaToDesign[14]!, domain: "design" },
  // MEDIA × KNOWLEDGE
  { id: "mk1", label: "AR（拡張現実）", angleDeg: angKnowledgeToMedia[0]!, domain: "media-knowledge" },
  { id: "mk2", label: "音声認識", angleDeg: angKnowledgeToMedia[1]!, domain: "media-knowledge" },
  { id: "mk3", label: "画像認識", angleDeg: angKnowledgeToMedia[2]!, domain: "media-knowledge" },
  { id: "mk4", label: "インテリジェント拡声システム", angleDeg: angKnowledgeToMedia[3]!, domain: "media-knowledge" },
  { id: "mk5", label: "音の情景分析", angleDeg: angKnowledgeToMedia[4]!, domain: "media-knowledge" },
  // MEDIA × DESIGN
  { id: "md1", label: "マルチモーダルインタフェース", angleDeg: angMediaToDesign[0]!, domain: "media-design" },
  { id: "md2", label: "サウンドデザイン", angleDeg: angMediaToDesign[1]!, domain: "media-design" },
  { id: "md3", label: "音環境デザイン", angleDeg: angMediaToDesign[2]!, domain: "media-design" },
  { id: "md4", label: "メディアデザイン", angleDeg: angMediaToDesign[3]!, domain: "media-design" },
  { id: "md5", label: "サイエンティフィック・ビジュアライゼーション", angleDeg: angMediaToDesign[4]!, domain: "media-design" },
  // ALL
  { id: "all1", label: "データ可視化", angleDeg: angDesignToKnowledge[0]!, domain: "all" },
  { id: "all2", label: "IoT（Internet of Things）", angleDeg: angDesignToKnowledge[1]!, domain: "all" },
  { id: "all3", label: "インテリジェントプロダクトデザイン", angleDeg: angDesignToKnowledge[2]!, domain: "all" },
  { id: "all4", label: "インテリジェントインタフェースデザイン", angleDeg: angDesignToKnowledge[3]!, domain: "all" },
  { id: "all5", label: "インタフェースエージェント", angleDeg: angDesignToKnowledge[4]!, domain: "all" },
];

// ── ラベル方向（SVG版と同じロジック） ────────────────────────────────────────
function labelTransform(angleDeg: number): string {
  const d = ((angleDeg % 360) + 360) % 360;
  if (d >= 200 && d <= 340) return "translate(-50%, calc(-100% - 3px))";
  if (d >= 82 && d <= 198) return "translate(calc(-100% - 5px), -50%)";
  if (d > 10 && d < 80) return "translate(-50%, 3px)";
  return "translate(5px, -50%)";
}

// ── 造語生成（DomainDiagram.vue と同じロジック） ──────────────────────────────
function normalizeLabel(label: string): string {
  return label
    .replace(/[（(][^）)]*[）)]/g, "")
    .split(/[/／]/)[0]!
    .trim();
}
function blendChunk(label: string, role: "head" | "mid" | "tail"): string {
  const clean = normalizeLabel(label);
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
function buildPortmanteau(kws: Keyword3D[]): string {
  const labels = kws.map((k) => k.label);
  if (labels.length === 0) return "";
  if (labels.length === 1) return normalizeLabel(labels[0]!);
  if (labels.length === 2)
    return blendChunk(labels[0]!, "head") + blendChunk(labels[1]!, "tail");
  return (
    blendChunk(labels[0]!, "head") +
    blendChunk(labels[1]!, "mid") +
    blendChunk(labels[2]!, "tail")
  );
}

// ── イージング ────────────────────────────────────────────────────────────────
function easeOut(t: number) { return 1 - (1 - t) ** 2; }
function easeIn(t: number) { return t * t; }
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

  // Camera
  const w = container.clientWidth || 800;
  const h = container.clientHeight || 500;
  const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.set(0, 4.8, 9.2);
  camera.lookAt(0, 0, 0);

  // WebGL renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.setClearColor(0x000000, 0);
  Object.assign(renderer.domElement.style, {
    position: "absolute", inset: "0", width: "100%", height: "100%",
  });
  container.appendChild(renderer.domElement);

  // CSS2D renderer（HTMLラベル用）
  const labelRenderer = new CSS2DRenderer();
  labelRenderer.setSize(w, h);
  Object.assign(labelRenderer.domElement.style, {
    position: "absolute", top: "0", left: "0",
    width: "100%", height: "100%",
    pointerEvents: "none", overflow: "hidden",
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

  // ── ドット & ラベル ──────────────────────────────────────────────────────────
  const dotGeo = new THREE.SphereGeometry(DOT_R, 8, 8);
  const dotMeshMap = new Map<string, THREE.Mesh>();
  const dotOrigPos = new Map<string, THREE.Vector3>();

  for (const kw of keywords) {
    const rad = (kw.angleDeg * Math.PI) / 180;
    const dx = Math.cos(rad);
    const dz = Math.sin(rad);

    // 各ドットは固有のマテリアル（opacity を個別制御するため）
    const mat = new THREE.MeshBasicMaterial({
      color: DOMAIN_HEX[kw.domain],
      transparent: true,
      opacity: 1,
    });
    const dot = new THREE.Mesh(dotGeo, mat);
    dot.position.set(RING_R * dx, 0, RING_R * dz);
    scene.add(dot);
    dotMeshMap.set(kw.id, dot);
    dotOrigPos.set(kw.id, dot.position.clone());

    // ラベル（CSS2DObject）
    const el = document.createElement("span");
    el.textContent = kw.label;
    el.style.cssText = [
      "display:block",
      "font-size:9px",
      "line-height:1.3",
      `color:${DOMAIN_CSS[kw.domain]}`,
      "white-space:nowrap",
      "font-family:var(--font-body,system-ui,sans-serif)",
      "pointer-events:none",
      `transform:${labelTransform(kw.angleDeg)}`,
    ].join(";");
    const labelObj = new CSS2DObject(el);
    labelObj.position.set(LABEL_R * dx, 0, LABEL_R * dz);
    scene.add(labelObj);
  }

  // ── ハイライトアニメーション ──────────────────────────────────────────────
  type HLPhase = "idle" | "draw" | "merge" | "coin" | "shrink";
  let hlPhase: HLPhase = "idle";
  let hlStartTime = 0;
  let hlPicked: Keyword3D[] = [];
  let hlPickedIds = new Set<string>();
  let hlLines: THREE.Line[] = [];
  let hlFillMesh: THREE.Mesh | null = null;
  let hlBurstMesh: THREE.Mesh | null = null;
  let hlBurstStart = 0;
  let hlCoinEl: HTMLSpanElement | null = null;
  let hlCoinObj: InstanceType<typeof CSS2DObject> | null = null;
  let hlTimeouts: ReturnType<typeof setTimeout>[] = [];

  const centerVec = new THREE.Vector3(0, 0, 0);

  function clearHL() {
    for (const t of hlTimeouts) clearTimeout(t);
    hlTimeouts = [];
  }
  function after(ms: number, fn: () => void) {
    hlTimeouts.push(setTimeout(fn, ms));
  }

  // キーワードの3D位置
  function kwPos(kw: Keyword3D): THREE.Vector3 {
    const rad = (kw.angleDeg * Math.PI) / 180;
    return new THREE.Vector3(RING_R * Math.cos(rad), 0, RING_R * Math.sin(rad));
  }

  // ベジェ曲線ライン（制御点を中心方向へ引く）
  function makeBezierLine(fromKw: Keyword3D, toKw: Keyword3D): THREE.Line {
    const p0 = kwPos(fromKw);
    const p1 = kwPos(toKw);
    const SAMPLES = 64;
    const pts: THREE.Vector3[] = [];
    // 2次ベジェ: 制御点は p0・p1 の中点を 0.38 倍引き（中心方向へ）
    const cx = (p0.x + p1.x) * 0.5 * 0.38;
    const cz = (p0.z + p1.z) * 0.5 * 0.38;
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      const mt = 1 - t;
      pts.push(
        new THREE.Vector3(
          mt * mt * p0.x + 2 * mt * t * cx + t * t * p1.x,
          0.01,
          mt * mt * p0.z + 2 * mt * t * cz + t * t * p1.z,
        ),
      );
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geo.setDrawRange(0, 0);
    const mat = new THREE.LineBasicMaterial({
      color: 0x4a6eb8,
      transparent: true,
      opacity: 0.85,
    });
    return new THREE.Line(geo, mat);
  }

  // ─── フェーズ: DRAW ──────────────────────────────────────────────────────
  function startCycle() {
    clearHL();

    // 3つ抽選・角度順にソート
    hlPicked = shuffled(keywords).slice(0, 3).sort((a, b) => a.angleDeg - b.angleDeg);
    hlPickedIds = new Set(hlPicked.map((k) => k.id));

    // 接続ライン生成（閉じたループ）
    for (const line of hlLines) {
      scene.remove(line);
      line.geometry.dispose();
      (line.material as THREE.LineBasicMaterial).dispose();
    }
    hlLines = [];
    for (let i = 0; i < hlPicked.length; i++) {
      const line = makeBezierLine(hlPicked[i]!, hlPicked[(i + 1) % hlPicked.length]!);
      scene.add(line);
      hlLines.push(line);
    }

    // 非選択ドットを薄く
    for (const kw of keywords) {
      (dotMeshMap.get(kw.id)!.material as THREE.MeshBasicMaterial).opacity =
        hlPickedIds.has(kw.id) ? 1 : 0.15;
    }

    hlPhase = "draw";
    hlStartTime = performance.now();

    after(HIGHLIGHT_DRAW_MS, startMerge);
  }

  // ─── フェーズ: MERGE ─────────────────────────────────────────────────────
  function startMerge() {
    hlPhase = "merge";
    hlStartTime = performance.now();

    // 合体バーストのタイミング
    after(Math.round(HIGHLIGHT_MERGE_MS * 0.72), () => {
      const bGeo = new THREE.SphereGeometry(0.22, 12, 12);
      const bMat = new THREE.MeshBasicMaterial({
        color: 0x4a6eb8, transparent: true, opacity: 0.75,
      });
      hlBurstMesh = new THREE.Mesh(bGeo, bMat);
      scene.add(hlBurstMesh);
      hlBurstStart = performance.now();
    });

    after(HIGHLIGHT_MERGE_MS, startCoin);
  }

  // ─── フェーズ: COIN ──────────────────────────────────────────────────────
  function startCoin() {
    hlPhase = "coin";
    hlStartTime = performance.now();

    // 選択ドットを非表示（中央へ到達済み）
    for (const kw of hlPicked) {
      dotMeshMap.get(kw.id)!.visible = false;
    }

    // ── 三角形塗り面 ──────────────────────────────────────────────────────
    const positions: number[] = [];
    const colors: number[] = [];
    for (const kw of hlPicked) {
      const p = kwPos(kw);
      positions.push(p.x, 0.02, p.z);
      const c = new THREE.Color(DOMAIN_HEX[kw.domain]);
      colors.push(c.r, c.g, c.b);
    }
    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    fGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    const fMat = new THREE.MeshBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    hlFillMesh = new THREE.Mesh(fGeo, fMat);
    scene.add(hlFillMesh);

    // ── 造語ラベル ─────────────────────────────────────────────────────────
    const word = buildPortmanteau(hlPicked);
    hlCoinEl = document.createElement("span");
    hlCoinEl.textContent = word;
    Object.assign(hlCoinEl.style, {
      display: "block",
      fontSize: "clamp(14px, 1.8vw, 22px)",
      fontWeight: "700",
      color: "#4a6eb8",
      textAlign: "center",
      transform: "translate(-50%, -50%)",
      opacity: "0",
      letterSpacing: "-0.02em",
      pointerEvents: "none",
      fontFamily: "var(--font-display, system-ui, sans-serif)",
      zIndex: "10",
      whiteSpace: "nowrap",
    });
    hlCoinObj = new CSS2DObject(hlCoinEl);
    hlCoinObj.position.set(0, 0.1, 0);
    scene.add(hlCoinObj);

    after(COIN_POP_MS + COIN_HOLD_MS + COIN_FADE_MS, startShrink);
  }

  // ─── フェーズ: SHRINK ────────────────────────────────────────────────────
  function startShrink() {
    hlPhase = "shrink";
    hlStartTime = performance.now();

    // 塗り面と造語を除去
    if (hlFillMesh) {
      scene.remove(hlFillMesh);
      hlFillMesh.geometry.dispose();
      (hlFillMesh.material as THREE.MeshBasicMaterial).dispose();
      hlFillMesh = null;
    }
    if (hlCoinObj) {
      scene.remove(hlCoinObj);
      hlCoinObj = null;
      hlCoinEl = null;
    }

    // ドットを元の位置・状態に戻す
    for (const kw of hlPicked) {
      const mesh = dotMeshMap.get(kw.id)!;
      mesh.visible = true;
      mesh.position.copy(dotOrigPos.get(kw.id)!);
      mesh.scale.setScalar(1);
      (mesh.material as THREE.MeshBasicMaterial).opacity = 1;
    }
    for (const kw of keywords) {
      (dotMeshMap.get(kw.id)!.material as THREE.MeshBasicMaterial).opacity = 1;
    }

    after(HIGHLIGHT_SHRINK_MS + HIGHLIGHT_PAUSE_MS, startCycle);
  }

  // ── フレームごとの連続アニメーション更新 ─────────────────────────────────
  function updateHighlight(now: number) {
    const elapsed = now - hlStartTime;

    // バースト（フェーズ独立）
    if (hlBurstMesh) {
      const bt = Math.min(1, (now - hlBurstStart) / BURST_MS);
      if (bt >= 1) {
        scene.remove(hlBurstMesh);
        hlBurstMesh.geometry.dispose();
        (hlBurstMesh.material as THREE.MeshBasicMaterial).dispose();
        hlBurstMesh = null;
      } else {
        hlBurstMesh.scale.setScalar(1 + bt * 9);
        (hlBurstMesh.material as THREE.MeshBasicMaterial).opacity =
          0.75 * (1 - bt);
      }
    }

    // DRAW: ラインを描画
    if (hlPhase === "draw") {
      const t = easeOut(Math.min(1, elapsed / HIGHLIGHT_DRAW_MS));
      for (const line of hlLines) {
        const cnt = line.geometry.attributes["position"]!.count;
        line.geometry.setDrawRange(0, Math.max(1, Math.floor(t * cnt)));
      }
    }

    // MERGE: ドットが中央へ収束
    if (hlPhase === "merge") {
      const t = easeInOutCubic(Math.min(1, elapsed / HIGHLIGHT_MERGE_MS));
      for (const kw of hlPicked) {
        const mesh = dotMeshMap.get(kw.id)!;
        mesh.position.lerpVectors(dotOrigPos.get(kw.id)!, centerVec, t);
        mesh.scale.setScalar(1 + t * 0.8);
        (mesh.material as THREE.MeshBasicMaterial).opacity = 1 - t * 0.96;
      }
    }

    // COIN: 塗り面と造語のフェードイン・フェードアウト
    if (hlPhase === "coin" && hlFillMesh) {
      const fMat = hlFillMesh.material as THREE.MeshBasicMaterial;
      const fadeStart = COIN_POP_MS + COIN_HOLD_MS;

      if (elapsed <= COIN_POP_MS) {
        // ぽんっと表示
        const popT = easeOut(elapsed / COIN_POP_MS);
        fMat.opacity = popT * 0.32;
        if (hlCoinEl) hlCoinEl.style.opacity = String(popT);
      } else if (elapsed <= fadeStart) {
        // ホールド
        fMat.opacity = 0.32;
        if (hlCoinEl) hlCoinEl.style.opacity = "1";
      } else {
        // ふわっと消える
        const fadeT = Math.min(1, (elapsed - fadeStart) / COIN_FADE_MS);
        fMat.opacity = (1 - fadeT) * 0.32;
        if (hlCoinEl) hlCoinEl.style.opacity = String(1 - fadeT);
      }
    }

    // SHRINK: ラインを縮小
    if (hlPhase === "shrink") {
      const t = easeIn(Math.min(1, elapsed / HIGHLIGHT_SHRINK_MS));
      for (const line of hlLines) {
        const cnt = line.geometry.attributes["position"]!.count;
        line.geometry.setDrawRange(0, Math.max(0, Math.floor((1 - t) * cnt)));
      }
    }
  }

  // ── メインアニメーションループ ────────────────────────────────────────────
  let rafId = 0;
  const animate = (now: number) => {
    rafId = requestAnimationFrame(animate);
    if (!reduceMotion) updateHighlight(now);
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
