<template>
  <section class="projects section-padding bg-surface-low">
    <div class="projects__inner container">
      <div class="projects__header">
        <p class="section-label">学びの現場</p>
        <h2 class="projects__title text-display-md">
          授業では、常に<br />
          つくり、試し、発表する。
        </h2>
      </div>

      <!-- Two independent columns on tablet+ (masonry-like pack); mobile order via order + contents -->
      <div class="projects__grid">
        <div class="projects__column projects__column--primary">
          <article class="projects__item projects__item--large projects__order--large">
            <div class="img-placeholder img-placeholder--media projects__img">
              <div class="projects__img-overlay">
                <span class="projects__img-label">音響インスタレーション制作</span>
              </div>
            </div>
            <div class="projects__caption">
              <span class="tag tag-media">メディア工学</span>
              <p class="projects__caption-text">
                3Dサウンドと空間知覚の研究。体験型音響展示の設計・実装プロジェクト。
              </p>
            </div>
          </article>

          <article class="projects__item projects__item--wide projects__order--wide">
            <div class="img-placeholder img-placeholder--dark projects__img projects__img--wide">
              <div class="projects__img-overlay">
                <span class="projects__img-label" style="color: rgba(252,249,248,0.7)">XRプロトタイプ展示会</span>
              </div>
            </div>
            <div class="projects__caption">
              <span class="tag tag-media">メディア工学</span>
              <p class="projects__caption-text">
                学期末成果発表。学生が開発したVRコンテンツを学内外に公開するデモイベント。
              </p>
            </div>
          </article>

          <article class="projects__item projects__item--sq projects__order--dataviz">
            <div class="img-placeholder img-placeholder--knowledge projects__img projects__img--sq">
              <div class="projects__img-overlay">
                <span class="projects__img-label">データ可視化演習</span>
              </div>
            </div>
            <div class="projects__caption">
              <span class="tag tag-design">情報デザイン</span>
              <p class="projects__caption-text">
                Webインタラクティブ可視化。D3.js相当の手法を独自実装。
              </p>
            </div>
          </article>
        </div>

        <div class="projects__column projects__column--secondary">
          <article class="projects__item projects__order--ai">
            <div class="img-placeholder img-placeholder--knowledge projects__img projects__img--sm">
              <div class="projects__img-overlay">
                <span class="projects__img-label">AIモデル構築演習</span>
              </div>
            </div>
            <div class="projects__caption">
              <span class="tag tag-knowledge">知識工学</span>
              <p class="projects__caption-text">
                感情認識AIの開発と精度改善。データセット設計から評価まで。
              </p>
            </div>
          </article>

          <article class="projects__item projects__order--design-ws">
            <div class="img-placeholder img-placeholder--design projects__img projects__img--sm">
              <div class="projects__img-overlay">
                <span class="projects__img-label">情報デザインワークショップ</span>
              </div>
            </div>
            <div class="projects__caption">
              <span class="tag tag-design">情報デザイン</span>
              <p class="projects__caption-text">
                複雑なデータを1枚のインフォグラフィックで伝えるデザイン思考演習。
              </p>
            </div>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
</script>

<style scoped>
.projects__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.projects__header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 560px;
}

.projects__title {
  color: var(--color-on-surface);
}

/* Masonry-like: two independent stacks — avoids one row stretching to max(left,right) height */
.projects__grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.projects__column {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  min-width: 0;
}

/* Mobile: flatten columns; order で large → AI → 情報WS → wide → データ可視化 */
@media (max-width: 639px) {
  .projects__column--primary,
  .projects__column--secondary {
    display: contents;
  }

  .projects__order--large {
    order: 1;
  }
  .projects__order--ai {
    order: 2;
  }
  .projects__order--design-ws {
    order: 3;
  }
  .projects__order--wide {
    order: 4;
  }
  .projects__order--dataviz {
    order: 5;
  }
}

@media (min-width: 640px) {
  .projects__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--space-md);
    align-items: start;
  }
}

@media (min-width: 1024px) {
  .projects__grid {
    /* 旧12列グリッドの 7:6 に近い左主軸 */
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  }
}

/* Images */
.projects__img {
  position: relative;
  overflow: hidden;
}

.img-placeholder {
  position: relative;
}

.img-placeholder--dark {
  background-color: #1c1b1b;
}

.projects__img--sm {
  aspect-ratio: 4 / 3;
}

.projects__img--wide {
  aspect-ratio: 21 / 9;
}

.projects__img--sq {
  aspect-ratio: 1 / 1;
}

.projects__img-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  padding: var(--space-sm);
  background: linear-gradient(to top, rgba(28, 27, 27, 0.3) 0%, transparent 60%);
}

.projects__img-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  color: rgba(28, 27, 27, 0.6);
  letter-spacing: 0.03em;
}

/* Caption */
.projects__caption {
  padding-top: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.projects__caption-text {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  line-height: 1.6;
}
</style>
