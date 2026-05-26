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

      <div class="projects__grid">
        <article
          v-for="(project, index) in previewProjects"
          :key="index"
          class="projects__card"
          :class="`projects__card--${project.size}`"
        >
          <div
            class="img-placeholder projects__card-media"
            :class="`img-placeholder--${project.theme}`"
            :style="{
              backgroundImage: projectImageUrl(index + 1),
            }"
          >
            <div class="projects__card-overlay">
              <span class="projects__card-tag">{{ project.tag }}</span>
              <h3 class="projects__card-title">{{ project.title }}</h3>
              <p class="projects__card-lead">{{ project.lead }}</p>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const publicPath = usePublicPath();

const projectImageUrl = (index: number) =>
  `url(${publicPath(`images/img${index}.jpg`)})`;

type PreviewProject = {
  tag: string;
  title: string;
  lead: string;
  theme: "media" | "knowledge" | "design" | "dark";
  size: "wide" | "narrow";
};

const previewProjects: PreviewProject[] = [
  {
    tag: "メディア工学",
    title: "音響インスタレーション制作",
    lead: "3Dサウンドと空間知覚の研究。体験型音響展示の設計・実装プロジェクト。",
    theme: "media",
    size: "wide",
  },
  {
    tag: "知識工学",
    title: "AIモデル構築演習",
    lead: "感情認識AIの開発と精度改善。データセット設計から評価まで。",
    theme: "knowledge",
    size: "narrow",
  },
  {
    tag: "情報デザイン",
    title: "データ可視化演習",
    lead: "Webインタラクティブ可視化。探索的なデータ表現を実装します。",
    theme: "design",
    size: "narrow",
  },
  {
    tag: "メディア工学",
    title: "XRプロトタイプ展示会",
    lead: "学期末成果発表。学生が開発したVRコンテンツを学内外に公開するデモイベント。",
    theme: "dark",
    size: "wide",
  },
];
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
  max-width: 800px;
}

.projects__title {
  color: var(--color-on-surface);
}

/* 3列: 1行目 2+1 / 2行目 1+2。行内・全カードで高さを揃える */
.projects__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  align-items: stretch;
}

.projects__card {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
}

.projects__card--wide {
  grid-column: span 1;
}

.projects__card--narrow {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .projects__grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .projects__card {
    height: 100%;
  }

  .projects__card--wide {
    grid-column: span 2;
  }

  .projects__card--narrow {
    grid-column: span 1;
  }
}

/* main.css の .img-placeholder の aspect-ratio を外し、グリッド行の高さに合わせて伸縮 */
.projects__card-media.img-placeholder {
  width: 100%;
  margin: 0;
  flex: 1 1 auto;
  min-height: clamp(220px, 36vw, 380px);
  height: 100%;
  aspect-ratio: unset;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.projects__card-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  gap: 0.375rem;
  padding: var(--space-md);
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.72) 0%,
    rgba(0, 0, 0, 0.2) 45%,
    transparent 72%
  );
}

.projects__card-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(252, 249, 248, 0.85);
}

.projects__card-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  line-height: 1.25;
  color: #fcf9f8;
}

.projects__card-lead {
  margin: 0;
  max-width: 42ch;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  line-height: 1.55;
  color: rgba(252, 249, 248, 0.82);
}

@media (min-width: 768px) {
  .projects__card--wide .projects__card-title {
    font-size: var(--text-xl);
  }
}
</style>
