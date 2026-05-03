<template>
  <section class="vision section-padding bg-surface">
    <div class="vision__inner container">
      <div class="vision__content">
        <p class="vision__label section-label">Vision</p>

        <div class="vision__text">
          <p class="vision__line vision__line--1">
            この世界に存在しないものを新しくつくる。<br />そのワクワクを味わってください。
          </p>
          <p class="vision__line vision__line--2">
            例えばサッカー中継で、ゴールキーパーから見たシュートシーンの音や映像が流れたら、臨場感に溢れ、大いに盛り上がるでしょう。その実現に向けて研究を進めるのが、本学科で取り組む学びのひとつである「メディア工学」と呼ばれる分野です。しかしこれは未来のコミュニケーションの一例に過ぎません。他にもミリオンヒット曲を作曲する人工知能、使うだけで楽しくなるツールのデザインなど、知能メディア工学科の研究には、ワクワクするような未来が詰まっています。一緒に未来が求めるコミュニケーションを創出しましょう。
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts"></script>

<style scoped>
.vision__inner {
  display: flex;
  justify-content: flex-end;
}

.vision__content {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  max-width: 720px;
  width: 100%;
}

@media (min-width: 1024px) {
  .vision__content {
    width: 66.666%;
  }
}

.vision__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.vision__line--1 {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 3.5vw, 2.25rem);
  font-weight: 600;
  line-height: 1.5;
  letter-spacing: -0.02em;
  color: var(--color-on-surface);
}

.vision__line--2 {
  font-family: var(--font-body);
  font-size: var(--text-md);
  font-weight: 400;
  line-height: 1.8;
  color: var(--color-on-surface-muted);
}

@media (max-width: 767px) {
  .br-desktop {
    display: none;
  }
}
</style>
