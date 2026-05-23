<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">About</p>
        <h1 class="page-hero__title">学びの特徴</h1>
        <p class="page-hero__subtitle">
          3つの専門領域を横断し、<br />
          テクノロジーとデザインの交差点を探索する。
        </p>
      </div>
    </section>

    <!-- Philosophy -->
    <section class="about-philosophy section-padding bg-surface">
      <div class="container">
        <div class="about-philosophy__inner">
          <p class="section-label">Philosophy</p>
          <div class="about-philosophy__content">
            <h2 class="about-philosophy__title text-display-md">
              先端のメディア工学・知識工学・情報デザインで、
              新時代のコミュニケーションを創る。
            </h2>
            <div class="about-philosophy__text">
              <p>
                知能メディア工学科は、メディア工学・知識工学・情報デザインの力を統合し、次世代のコミュニケーションを設計・実装できる人材を育てます。音や画像の最先端技術やバーチャルリアリティ、AIとビッグデータに基づく知識の創出、そして製品やシステムを使いやすく楽しいものにする情報デザイン——それぞれの学びが、ひとつのメディア工学としてつながります。
              </p>
              <p>
                教育・研究の中心を「メディア工学分野」と定め、メディア情報処理の基礎的な知識と技術を確かな土台として修得させます。そのうえで音響・画像・人工知能・情報デザインなどの基礎と応用を深め、生活の利便性を高め、メディア工学の先進的な領域を切り拓く素養と実践力を養います。社会と産業に貢献できる人材としての成長を、ここから支えていきます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Three Pillars -->
    <section id="pillars" class="about-pillars section-padding bg-surface-low">
      <div class="container">
        <p class="section-label">Three Pillars</p>
        <h2
          class="about-pillars__title text-display-md"
          style="margin-top: var(--space-md); margin-bottom: var(--space-xl)"
        >
          3つの専門領域
        </h2>

        <!-- Pillar: Media Engineering -->
        <div id="media" class="about-pillar about-pillar--media">
          <div class="about-pillar__accent about-pillar__accent--media" />
          <div class="about-pillar__body">
            <div class="about-pillar__header">
              <span class="tag tag-media">メディア工学</span>
              <span class="about-pillar__en">Media Engineering</span>
            </div>
            <h3 class="about-pillar__name">音・映像・インタラクション</h3>
            <p class="about-pillar__desc">
              人間の五感信号処理・映像符号化・XR技術・センサーシステムといった領域を通じて、新しい体験の形を追求します。
            </p>
            <div class="about-pillar__topics">
              <div
                v-for="topic in mediaTopic"
                :key="topic.name"
                class="about-pillar__topic"
              >
                <h4 class="about-pillar__topic-name">{{ topic.name }}</h4>
                <p class="about-pillar__topic-desc">{{ topic.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pillar: Knowledge Engineering -->
        <div id="knowledge" class="about-pillar about-pillar--knowledge">
          <div class="about-pillar__accent about-pillar__accent--knowledge" />
          <div class="about-pillar__body">
            <div class="about-pillar__header">
              <span class="tag tag-knowledge">知識工学</span>
              <span class="about-pillar__en">Knowledge Engineering</span>
            </div>
            <h3 class="about-pillar__name">AI・データ・知識</h3>
            <p class="about-pillar__desc">
              機械学習・深層学習・自然言語処理・知識グラフなど、AIと知識処理の中核技術を学びます。データから意味を抽出し、世界の仕組みを数学的に記述する能力を養います。
            </p>
            <div class="about-pillar__topics">
              <div
                v-for="topic in knowledgeTopic"
                :key="topic.name"
                class="about-pillar__topic"
              >
                <h4 class="about-pillar__topic-name">{{ topic.name }}</h4>
                <p class="about-pillar__topic-desc">{{ topic.desc }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Pillar: Information Design -->
        <div id="design" class="about-pillar about-pillar--design">
          <div class="about-pillar__accent about-pillar__accent--design" />
          <div class="about-pillar__body">
            <div class="about-pillar__header">
              <span class="tag tag-design">情報デザイン</span>
              <span class="about-pillar__en">Information Design</span>
            </div>
            <h3 class="about-pillar__name">UX・可視化・コミュニケーション</h3>
            <p class="about-pillar__desc">
              情報を人に届けるための設計を学びます。ユーザー体験設計・データ可視化・タイポグラフィ・コミュニケーションデザインを通じ、技術と人間の橋渡し役になる力を磨きます。
            </p>
            <div class="about-pillar__topics">
              <div
                v-for="topic in designTopic"
                :key="topic.name"
                class="about-pillar__topic"
              >
                <h4 class="about-pillar__topic-name">{{ topic.name }}</h4>
                <p class="about-pillar__topic-desc">{{ topic.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pillar Relationship Diagram (CSS only) -->
    <section class="about-diagram section-padding bg-surface">
      <div class="container">
        <p class="section-label">Integration</p>
        <h2
          class="about-diagram__title text-display-md"
          style="margin-top: var(--space-md); margin-bottom: 0"
        >
          3つの領域の先にある<br />知能メディア工学という挑戦
        </h2>

        <div class="about-diagram__visual">
          <DomainDiagram3D />
        </div>

        <div class="about-diagram__caption">
          <p>
            3つの専門領域は独立して学ぶのではなく、プロジェクト型授業・合同ゼミ・卒業研究を通じて統合的に組み合わさります。この融合こそが、他学科にはない知能メディア工学科の最大の特色です。
          </p>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <CtaSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: "学びの特徴 | 知能メディア工学科 | 千葉工業大学",
  description:
    "メディア工学・知識工学・情報デザインの3つの柱を横断する知能メディア工学科の学びの特徴をご紹介します。",
});

const mediaTopic = [
  {
    name: "音響信号処理",
    desc: "人間の聴覚特性に基づく音声・音楽の分析・生成・変換技術を習得します。",
  },
  {
    name: "映像メディア工学",
    desc: "動画圧縮、映像認識、ディープラーニングによるコンテンツ生成まで幅広く学びます。",
  },
  {
    name: "XR・インタラクション",
    desc: "VR/AR/MRを用いた没入体験の設計と実装。身体拡張技術の最前線に触れます。",
  },
];

const knowledgeTopic = [
  {
    name: "機械学習・深層学習",
    desc: "ニューラルネットワークから最新の大規模言語モデルまで、理論と実装の両面から学びます。",
  },
  {
    name: "自然言語処理",
    desc: "テキストデータの解析・生成・理解。感情分析、翻訳、対話システムなどを実装します。",
  },
  {
    name: "知識グラフ・推薦システム",
    desc: "知識の構造化と推論。大規模グラフデータの活用と推薦アルゴリズムの設計。",
  },
];

const designTopic = [
  {
    name: "UXデザイン",
    desc: "ユーザー調査・プロトタイピング・ユーザビリティ評価の体系的なプロセスを身につけます。",
  },
  {
    name: "データビジュアライゼーション",
    desc: "複雑なデータを直感的に理解できるインタラクティブな可視化表現を設計・実装します。",
  },
  {
    name: "タイポグラフィ・レイアウト",
    desc: "文字・グリッド・余白の理論。情報の階層と視覚的なリズムを設計する基礎力。",
  },
];
</script>

<style scoped>
/* Philosophy */
.about-philosophy__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.about-philosophy__content {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

@media (min-width: 1024px) {
  .about-philosophy__content {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
}

.about-philosophy__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.about-philosophy__text p {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
}

/* Pillars */
.about-pillar {
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-xl) 0;
  border-top: 1px solid var(--color-surface);
}

@media (max-width: 767px) {
  .about-pillar {
    gap: var(--space-sm);
  }
}

.about-pillar:last-of-type {
  border-bottom: 1px solid var(--color-surface);
}

.about-pillar__accent {
  width: 3px;
  flex-shrink: 0;
  align-self: stretch;
}

.about-pillar__accent--media {
  background-color: var(--color-media);
}
.about-pillar__accent--knowledge {
  background-color: var(--color-knowledge);
}
.about-pillar__accent--design {
  background-color: var(--color-design);
}

.about-pillar__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  flex: 1;
}

.about-pillar__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.about-pillar__en {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--color-on-surface-faint);
  letter-spacing: 0.04em;
}

.about-pillar__name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3vw, var(--text-3xl));
  font-weight: 600;
  color: var(--color-on-surface);
  letter-spacing: -0.02em;
}

.about-pillar__desc {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
  max-width: 60ch;
}

.about-pillar__topics {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  margin-top: var(--space-sm);
}

@media (min-width: 768px) {
  .about-pillar__topics {
    grid-template-columns: repeat(3, 1fr);
  }
}

.about-pillar__topic {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: var(--space-sm);
}

.about-pillar--media .about-pillar__topic {
  background-color: var(--color-media-bg);
}

.about-pillar--knowledge .about-pillar__topic {
  background-color: var(--color-knowledge-bg);
}

.about-pillar--design .about-pillar__topic {
  background-color: var(--color-design-bg);
}

.about-pillar__topic-name {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-on-surface);
}

.about-pillar--media .about-pillar__topic-name {
  color: var(--color-media);
}

.about-pillar--knowledge .about-pillar__topic-name {
  color: var(--color-knowledge);
}

.about-pillar--design .about-pillar__topic-name {
  color: var(--color-design);
}

.about-pillar__topic-desc {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-muted);
  line-height: 1.7;
}

/* Diagram */
.about-diagram__title {
  color: var(--color-on-surface);
}

.about-diagram__visual {
  width: 100%;
  max-width: 1000px;
  height: clamp(320px, 52vw, 590px);
  margin: var(--space-xl) auto var(--space-lg);
  background-color: #1c1b1b;
  overflow: hidden;
}

.about-diagram__caption {
  max-width: 60ch;
  margin: 0 auto;
}

.about-diagram__caption p {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
}
</style>
