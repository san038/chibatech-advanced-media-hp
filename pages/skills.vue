<template>
  <div class="skills-page">
    <!-- Hero -->
    <section class="page-hero">
      <div class="container">
        <p class="page-hero__label">Skills</p>
        <h1 class="page-hero__title">身につく力</h1>
        <p class="page-hero__subtitle">
          卒業時に、あなたは何者になっているか。<br />
          6つの力の視点から考える。
        </p>
      </div>
    </section>

    <!-- Skills overview -->
    <section class="skills-intro section-padding bg-surface">
      <div class="container">
        <div class="skills-intro__inner">
          <p class="section-label">Competencies</p>
          <p class="skills-intro__text text-display-sm" style="margin-top: var(--space-md)">
            技術だけを学ぶ場所ではない。<br />
            知能メディア工学科が育てるのは、<br />
            テクノロジーで世界を変える人間の力だ。
          </p>
        </div>
      </div>
    </section>

    <!-- Six skills -->
    <section class="skills-list section-padding bg-surface-low">
      <div class="container">
        <div class="skills-grid">
          <div
            v-for="(skill, index) in skills"
            :key="skill.id"
            class="skill-card"
          >
            <div class="skill-card__header">
              <span class="skill-card__num text-label">{{ String(index + 1).padStart(2, '0') }}</span>
              <div class="skill-card__accent" :style="{ backgroundColor: skill.color }" />
            </div>
            <h2 class="skill-card__name">{{ skill.name }}</h2>
            <p class="skill-card__name-en">{{ skill.nameEn }}</p>
            <p class="skill-card__desc">{{ skill.description }}</p>
            <div class="skill-card__activities">
              <p class="skill-card__activities-label text-label">関連する学び</p>
              <ul class="skill-card__activities-list">
                <li v-for="activity in skill.activities" :key="activity" class="skill-card__activity">
                  {{ activity }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Skills integration -->
    <section class="skills-integration section-padding bg-surface">
      <div class="container">
        <div class="skills-integration__inner">
          <p class="section-label">Integration</p>
          <h2 class="text-display-md" style="margin-top: var(--space-md); margin-bottom: var(--space-md)">
            6つの力は、分離していない。
          </h2>
          <p class="skills-integration__body">
            創造力は技術力があってこそ発揮され、技術力は問題解決力があって方向を持ちます。探究力が深まることで表現力が増し、協働力の中で創造力が触発される。6つの力は互いに絡み合い、一人の学生のなかで統合されていきます。
          </p>
          <p class="skills-integration__body">
            卒業研究は、この統合の最終試験です。自分だけのテーマを設定し、技術・知識・デザインのすべてを動員して、世界に問いかける作品・論文・システムを生み出します。
          </p>
        </div>
      </div>
    </section>

    <CtaSection />
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '身につく力 | 知能メディア工学科 | 千葉工業大学',
  description: '知能メディア工学科で身につく6つの力。創造力・探究力・技術力・表現力・協働力・問題解決力。',
})

const skills = [
  {
    id: 'creativity',
    name: '創造力',
    nameEn: 'Creativity',
    color: '#a14e58',
    description:
      '存在しないものを構想し、形にする力。メディア工学の技術と情報デザインの感性を組み合わせることで、誰も見たことのない体験や表現を生み出す能力を育てます。',
    activities: [
      '音響インスタレーション制作',
      'メディアアート制作実習',
      '卒業制作',
      'プロダクトデザインワークショップ',
    ],
  },
  {
    id: 'inquiry',
    name: '探究力',
    nameEn: 'Inquiry',
    color: '#3d6b4a',
    description:
      '問いを立て、仮説を検証し続ける力。知識工学の研究手法を通じて、物事の本質を掘り下げる粘り強さと方法論を身につけます。',
    activities: [
      '機械学習実験設計',
      '卒業研究',
      '研究室ゼミ',
      'データ分析プロジェクト',
    ],
  },
  {
    id: 'technical',
    name: '技術力',
    nameEn: 'Technical Skills',
    color: '#9a9594',
    description:
      'アイデアを実装に変える力。プログラミング・数学・信号処理・AI開発の技術的基礎を体系的に習得し、自分のアイデアを自分の手で動かすことができるようになります。',
    activities: [
      'プログラミング演習（1〜3年）',
      '深層学習実装',
      'XR技術演習',
      'システム開発プロジェクト',
    ],
  },
  {
    id: 'expression',
    name: '表現力',
    nameEn: 'Expression',
    color: '#4a6fa3',
    description:
      '考えを的確に、美しく伝える力。タイポグラフィ・レイアウト・データ可視化を通じて、複雑な情報を誰にでも伝わる形に翻訳するスキルを磨きます。',
    activities: [
      'タイポグラフィ・レイアウト演習',
      'データビジュアライゼーション',
      'プレゼンテーション実習',
      'ポートフォリオ制作',
    ],
  },
  {
    id: 'collaboration',
    name: '協働力',
    nameEn: 'Collaboration',
    color: '#10b981',
    description:
      '異なる専門性を持つ人と一緒に作り上げる力。学際的なチームプロジェクトで、役割分担・意見の統合・フィードバックの受け渡しを繰り返すことで鍛えられます。',
    activities: [
      'チームプロジェクト型授業',
      '産学連携プログラム',
      '合同ゼミ発表会',
      '学外インターンシップ',
    ],
  },
  {
    id: 'problem-solving',
    name: '問題解決力',
    nameEn: 'Problem Solving',
    color: '#f59e0b',
    description:
      '曖昧な状況から課題を発見し、解決策を設計・実行する力。デザイン思考とエンジニアリングの視点を組み合わせ、現実の複雑な問題に立ち向かう能力を養います。',
    activities: [
      'デザイン思考入門',
      'PBL（課題解決型学習）',
      'UXリサーチ手法',
      '地域・社会連携プロジェクト',
    ],
  },
]
</script>

<style scoped>
.skills-intro__inner {
  max-width: 720px;
}

.skills-intro__text {
  color: var(--color-on-surface);
  line-height: 1.5;
}

/* Skills grid */
.skills-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

@media (min-width: 640px) {
  .skills-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .skills-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.skill-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-lg);
  background-color: var(--color-surface);
}

.skill-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-xs);
}

.skill-card__num {
  color: var(--color-on-surface-faint);
}

.skill-card__accent {
  width: 24px;
  height: 3px;
}

.skill-card__name {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  color: var(--color-on-surface);
  letter-spacing: -0.02em;
  line-height: 1;
}

.skill-card__name-en {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--color-on-surface-faint);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.skill-card__desc {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: var(--color-on-surface-muted);
  line-height: 1.7;
  margin-top: var(--space-xs);
}

.skill-card__activities {
  margin-top: var(--space-sm);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: var(--space-sm);
  border-top: 1px solid var(--color-surface-low);
}

.skill-card__activities-label {
  color: var(--color-on-surface-faint);
}

.skill-card__activities-list {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.skill-card__activity {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: var(--color-on-surface-muted);
  padding-left: 1rem;
  position: relative;
}

.skill-card__activity::before {
  content: '·';
  position: absolute;
  left: 0.25rem;
  color: var(--color-on-surface-faint);
}

/* Integration */
.skills-integration__inner {
  max-width: 720px;
}

.skills-integration__body {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.8;
  color: var(--color-on-surface-muted);
  margin-bottom: var(--space-md);
}
</style>
