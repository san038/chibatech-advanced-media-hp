<template>
  <div class="about-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">About</p>
        <h1 class="page-hero__title">学びの特徴</h1>
        <p class="page-hero__subtitle">
          3つの専門領域を横断し、テクノロジーとデザインの交差点を探索する。
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
        <header class="about-pillars__head">
          <p class="section-label">Three Pillars</p>
          <h2 class="about-pillars__title text-display-md">3つの専門領域</h2>
          <p class="about-pillars__lead">
            メディア工学を土台に、知識工学と情報デザインが交わる。それぞれが独立した専門でありながら、ひとつの学びとしてつながります。
          </p>
        </header>

        <div class="about-pillars__list">
          <!-- Pillar: Media Engineering -->
          <article id="media" class="about-pillar about-pillar--media">
            <figure class="about-pillar__figure">
              <img
                :src="publicPath('images/course1.jpg')"
                alt="メディア工学領域"
                class="about-pillar__photo"
                width="1280"
                height="960"
                loading="lazy"
                decoding="async"
              >
            </figure>
            <div class="about-pillar__body">
              <div class="about-pillar__head">
                <p class="about-pillar__num">01</p>
                <div class="about-pillar__names">
                  <h3 class="about-pillar__name">メディア工学</h3>
                  <p class="about-pillar__en">Media Engineering</p>
                </div>
              </div>
              <p class="about-pillar__tagline">音・映像・インタラクション</p>
              <p class="about-pillar__desc">
                本学科の目指す「リアル」を超えるコミュニケーションを創りだすために、現在の水準をはるかに超える音響・映像の３次元再生技術とその伝送技術、ロボットと人間の高度なコミュニケーションを支える音響・映像の認識技術が必要不可欠です。そのための本領域では、音響・映像の物理的特性や視聴覚を中心とした人間の知覚のメカニズム、高度な信号処理技術を理解することを目的とした「音響工学基礎／応用」、「音声工学」、「画像処理基礎／応用」などの科目が開設されています。さらにこれらの複数の講義を通して身につけた知識・技術の高度な応用を学ぶ「バーチャルリアリティ」や、実体験を通じて学びを深化させる「メディア工学実験」などの魅力的な科目が揃っています。
              </p>
              <ul class="about-pillar__tags">
                <li v-for="topic in mediaTopic" :key="topic.name">
                  {{ topic.name }}
                </li>
              </ul>
            </div>
          </article>

          <!-- Pillar: Knowledge Engineering -->
          <article id="knowledge" class="about-pillar about-pillar--knowledge">
            <figure class="about-pillar__figure">
              <img
                :src="publicPath('images/course2.jpg')"
                alt="知識工学領域"
                class="about-pillar__photo"
                width="1280"
                height="960"
                loading="lazy"
                decoding="async"
              >
            </figure>
            <div class="about-pillar__body">
              <div class="about-pillar__head">
                <p class="about-pillar__num">02</p>
                <div class="about-pillar__names">
                  <h3 class="about-pillar__name">知識工学</h3>
                  <p class="about-pillar__en">Knowledge Engineering</p>
                </div>
              </div>
              <p class="about-pillar__tagline">AI・データ・知識</p>
              <p class="about-pillar__desc">
                人間のように思考することができる人工知能を応用しビックデータを解析することで、今までは知り得なかった新しい知見・知識を得ることができるようになってきています。そのため本領域では、データや情報から知識をどのように表現し創出するのかを学ぶ「人工知能基礎」、「知識工学」、「機械学習」、「データマイニング」や、データ・情報・知識をどのように流通・蓄積させるかを学ぶ「コンピュータネットワーク」、「データベース工学」などの科目が開設されています。さらには、これらの講義を通して身につけた知識・技術の応用例を学び体験する「ネットワーク・データ工学実験」、「ネットワーク・データ工学応用」などの科目がそろっています。
              </p>
              <ul class="about-pillar__tags">
                <li v-for="topic in knowledgeTopic" :key="topic.name">
                  {{ topic.name }}
                </li>
              </ul>
            </div>
          </article>

          <!-- Pillar: Information Design -->
          <article id="design" class="about-pillar about-pillar--design">
            <figure class="about-pillar__figure">
              <img
                :src="publicPath('images/course3.jpg')"
                alt="情報デザイン領域"
                class="about-pillar__photo"
                width="1280"
                height="960"
                loading="lazy"
                decoding="async"
              >
            </figure>
            <div class="about-pillar__body">
              <div class="about-pillar__head">
                <p class="about-pillar__num">03</p>
                <div class="about-pillar__names">
                  <h3 class="about-pillar__name">情報デザイン</h3>
                  <p class="about-pillar__en">Information Design</p>
                </div>
              </div>
              <p class="about-pillar__tagline">
                UX・可視化・コミュニケーション
              </p>
              <p class="about-pillar__desc">
                これからの社会やユーザーに「使いやすく魅力的なモノやシステム」を提供できるデザイン能力を持つ人材が求められています。そのためには、先進的な技術と情報デザインの学びが不可欠です。ユーザーを理解し、大胆な発想でアイデアを具体的なカタチにし、先進的なデザインを作り出します。そのため本領域では、デザインの基礎知識を体験的に学びます。次に、総合的なデザインスキルを身につけるために「情報デザイン基礎／応用」、「人間中心設計」、「デジタルファブリケーション」などの科目が開設されています。さらには、先進的なデザインの学びを体験する「テクノロジーアート」、「フィジカルインターフェース」、「ユーザエクスペリエンスデザイン」などの応用科目もそろっています。
              </p>
              <ul class="about-pillar__tags">
                <li v-for="topic in designTopic" :key="topic.name">
                  {{ topic.name }}
                </li>
              </ul>
            </div>
          </article>
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

const publicPath = usePublicPath();

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
  gap: var(--space-md);
}

/* 大見出しの下に説明文を素直に積む（横並びだと日本語見出しが折れて読みにくい） */
.about-philosophy__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.about-philosophy__title {
  max-width: 24em;
  word-break: auto-phrase;
}

.about-philosophy__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  max-width: 34em;
}

.about-philosophy__text p {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.85;
  color: var(--color-on-surface-muted);
}

/* Three Pillars */
.about-pillars__head {
  max-width: 62ch;
}

.about-pillars__title {
  margin-top: var(--space-sm);
  color: var(--color-on-surface);
}

.about-pillars__lead {
  margin-top: var(--space-sm);
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.85;
  color: var(--color-on-surface-muted);
}

.about-pillars__list {
  margin-top: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: clamp(var(--space-lg), 8vw, var(--space-xl));
}

.about-pillar {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-lg);
}

@media (min-width: 900px) {
  .about-pillar {
    grid-template-columns: 1.1fr 1fr;
    gap: clamp(var(--space-lg), 6vw, 5rem);
    align-items: stretch;
  }

  /* 知識工学は画像を右にして左右交互のリズムをつくる */
  .about-pillar--knowledge .about-pillar__figure {
    order: 2;
  }
}

/* 画像（このセクションの主役） */
.about-pillar__figure {
  margin: 0;
}

.about-pillar__photo {
  display: block;
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 0;
  background-color: var(--color-surface);
}

@media (min-width: 900px) {
  .about-pillar__figure {
    display: flex;
  }

  .about-pillar__photo {
    height: 100%;
    aspect-ratio: auto;
    min-height: 24rem;
  }
}

/* 本文 */
.about-pillar__body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 54ch;
}

/* 見出し: 数字 ＋ 右にコース名／英語名 */
.about-pillar__head {
  display: flex;
  align-items: center;
  gap: clamp(0.9rem, 2vw, 1.5rem);
}

.about-pillar__names {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  /* 数字の中央をコース名の中央に合わせるための調整（英語名の分だけ上に余白） */
  padding-top: 1rem;
}

.about-pillar__num {
  flex-shrink: 0;
  position: relative;
  top: 0.08em; /* 数字が視覚的に上に見えるぶんを少しだけ下げる */
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 5.4vw, 3.6rem);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.02em;
}

.about-pillar__name {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 2.8vw, 2.25rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.about-pillar__en {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

/* 数字・コース名・英語名すべて領域色に */
.about-pillar--media .about-pillar__num,
.about-pillar--media .about-pillar__name,
.about-pillar--media .about-pillar__en {
  color: var(--color-media);
}
.about-pillar--knowledge .about-pillar__num,
.about-pillar--knowledge .about-pillar__name,
.about-pillar--knowledge .about-pillar__en {
  color: var(--color-knowledge);
}
.about-pillar--design .about-pillar__num,
.about-pillar--design .about-pillar__name,
.about-pillar--design .about-pillar__en {
  color: var(--color-design);
}

.about-pillar__tagline {
  margin-top: var(--space-md);
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.01em;
  color: var(--color-on-surface);
}

.about-pillar__desc {
  margin-top: var(--space-sm);
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
}

.about-pillar__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: var(--space-md) 0 0;
  padding: 0;
}

.about-pillar__tags li {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.02em;
  padding: 0.32rem 0.75rem;
  border-radius: 0;
  border: 1px solid;
}

.about-pillar--media .about-pillar__tags li {
  color: var(--color-media);
  border-color: color-mix(in srgb, var(--color-media) 35%, transparent);
}
.about-pillar--knowledge .about-pillar__tags li {
  color: var(--color-knowledge);
  border-color: color-mix(in srgb, var(--color-knowledge) 35%, transparent);
}
.about-pillar--design .about-pillar__tags li {
  color: var(--color-design);
  border-color: color-mix(in srgb, var(--color-design) 35%, transparent);
}

/* Diagram */
.about-diagram__title {
  color: var(--color-on-surface);
}

.about-diagram__visual {
  width: 100%;
  max-width: 1000px;
  height: clamp(320px, 52vw, 590px);
  margin: var(--space-lg) auto var(--space-md);
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
