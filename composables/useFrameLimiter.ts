/**
 * requestAnimationFrame ループ用の適応フレームレート制限。
 *
 * - 目標 fps を段階（既定 60 → 30 → 20）で持ち、rAF のたびに `shouldRender` で
 *   「今回描画するか」を判定する（高リフレッシュレート環境でも上限は先頭の段）。
 * - 負荷は次の指標で測り、重い状態が続けば段を下げ、余裕が続けば段を戻す（ヒステリシス付き）:
 *   1. 取りこぼし: 描画した直後の rAF が画面更新間隔（vsync）の 1.5 倍以上遅れた割合。
 *      JS だけでなく、スタイル計算・描画・合成などブラウザ側のコストも含めて捉えられる
 *      （画面共有中に重くなるのは主にこちら）
 *   2. 遅延: 描画間隔が目標間隔を大きく超えた割合（ブラウザ全体が詰まっている）
 *   3. 描画処理の所要時間（`reportWork` で報告。JS 側の重さ）
 */

export interface FrameLimiterOptions {
  /** 目標 fps の段（降順）。先頭が上限 */
  tiers?: readonly number[];
}

export interface FrameLimiter {
  /**
   * rAF コールバックの先頭で呼ぶ。描画するなら前回描画からの経過 ms、
   * 間引くなら null を返す。
   */
  shouldRender(now: number): number | null;
  /** 描画処理にかかった時間（ms）を報告する */
  reportWork(ms: number): void;
  /** ループ再開時に呼ぶ（停止中の経過時間を負荷とみなさないため） */
  resetClock(): void;
  /** 現在の目標 fps */
  readonly fps: number;
}

const DEFAULT_TIERS = [60, 30, 20] as const;

/** 評価窓（ms）。この間の集計で段の上げ下げを判断する */
const WINDOW_MS = 1000;
/** 段を戻すのに必要な「余裕あり」窓の連続数 */
const UPGRADE_WINDOWS = 3;
/** 描画処理がフレーム予算のこの割合を超えたら重いとみなす */
const WORK_HIGH = 0.75;
/** 1 つ上の段の予算に対してこの割合未満なら余裕ありとみなす（WORK_HIGH との差がヒステリシス） */
const WORK_LOW = 0.5;
/** 描画直後の rAF 間隔が vsync のこの倍率を超えたら「取りこぼし」 */
const DROP_FACTOR = 1.5;
/** 描画間隔が目標間隔のこの倍率を超えたら「遅延」 */
const LATE_FACTOR = 1.6;
/** 取りこぼし／遅延がこの割合を超えたら重いとみなす */
const BAD_RATIO_HIGH = 0.25;
/** 段を戻すには取りこぼし／遅延がこの割合未満であること */
const BAD_RATIO_LOW = 0.05;
/** 目標間隔に対するタイミングの許容誤差（ms）。vsync の揺らぎで間引きすぎないように */
const TOLERANCE_MS = 1.5;
/** vsync 推定の初期値と下限（ms） */
const DEFAULT_VSYNC_MS = 1000 / 60;
const MIN_VSYNC_MS = 4;

export function createFrameLimiter(
  options: FrameLimiterOptions = {},
): FrameLimiter {
  const tiers = options.tiers?.length ? options.tiers : DEFAULT_TIERS;
  let tier = 0;
  let lastRender = -1;
  let lastRaf = -1;
  let renderedLast = false;
  // 画面更新間隔の推定（観測した最小の rAF 間隔）
  let vsync = DEFAULT_VSYNC_MS;

  // 評価窓の集計
  let windowStart = -1;
  let frames = 0;
  let lateFrames = 0;
  let postRenders = 0;
  let droppedFrames = 0;
  let workSum = 0;
  let goodWindows = 0;

  const intervalOf = (i: number): number => 1000 / tiers[i];

  function resetWindow(now: number) {
    windowStart = now;
    frames = 0;
    lateFrames = 0;
    postRenders = 0;
    droppedFrames = 0;
    workSum = 0;
  }

  function evaluate(now: number) {
    if (frames === 0) {
      resetWindow(now);
      return;
    }
    const interval = intervalOf(tier);
    const avgWork = workSum / frames;
    const lateRatio = lateFrames / frames;
    const dropRatio = postRenders ? droppedFrames / postRenders : 0;
    const badRatio = Math.max(lateRatio, dropRatio);

    const heavy = avgWork > interval * WORK_HIGH || badRatio > BAD_RATIO_HIGH;
    if (heavy) {
      if (tier < tiers.length - 1) tier += 1;
      goodWindows = 0;
    } else if (tier > 0) {
      const roomy =
        avgWork < intervalOf(tier - 1) * WORK_LOW && badRatio < BAD_RATIO_LOW;
      goodWindows = roomy ? goodWindows + 1 : 0;
      if (goodWindows >= UPGRADE_WINDOWS) {
        tier -= 1;
        goodWindows = 0;
      }
    }
    resetWindow(now);
  }

  return {
    shouldRender(now: number): number | null {
      if (lastRaf >= 0) {
        const delta = now - lastRaf;
        if (delta >= MIN_VSYNC_MS && delta < vsync) vsync = delta;
        if (renderedLast) {
          postRenders += 1;
          if (delta > vsync * DROP_FACTOR) droppedFrames += 1;
        }
      }
      lastRaf = now;
      renderedLast = false;

      const interval = Math.max(intervalOf(tier), vsync);
      if (lastRender < 0) {
        lastRender = now;
        if (windowStart < 0) resetWindow(now);
        renderedLast = true;
        return interval;
      }

      const elapsed = now - lastRender;
      if (elapsed + TOLERANCE_MS < interval) return null;

      if (elapsed > interval * LATE_FACTOR) lateFrames += 1;
      frames += 1;
      // 目標間隔を超過した分だけ持ち越して、平均間隔を目標に揃える
      // （許容誤差内で早めに描いた場合や、大きく遅れた場合は持ち越さない）
      const over = elapsed - interval;
      lastRender = over > 0 && over < interval ? now - over : now;
      renderedLast = true;

      if (now - windowStart >= WINDOW_MS) evaluate(now);
      return elapsed;
    },

    reportWork(ms: number) {
      workSum += ms;
    },

    resetClock() {
      lastRender = -1;
      lastRaf = -1;
      renderedLast = false;
      windowStart = -1;
      frames = 0;
      lateFrames = 0;
      postRenders = 0;
      droppedFrames = 0;
      workSum = 0;
    },

    get fps() {
      return tiers[tier];
    },
  };
}
