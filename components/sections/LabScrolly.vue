<template>
  <section class="lab-scrolly" aria-label="研究室紹介">
    <div class="lab-scrolly__stage">
      <LabFieldBg />
      <div class="lab-scrolly__scrim" aria-hidden="true" />
    </div>

    <div class="lab-scrolly__list">
      <p class="lab-scrolly__eyebrow text-label">Laboratories</p>

      <article
        v-for="(lab, i) in laboratories"
        :key="lab.id"
        class="lab-block"
        :class="[`is-${lab.pillar}`, `is-stagger-${i % 3}`]"
      >
        <p class="lab-block__index">
          {{ String(i + 1).padStart(3, "0") }}
          <span aria-hidden="true"
            >/ {{ String(laboratories.length).padStart(3, "0") }}</span
          >
        </p>
        <p class="lab-block__prof">{{ lab.professor }}</p>
        <h3 class="lab-block__name">{{ lab.focus }}</h3>
        <p class="lab-block__theme">{{ lab.theme }}</p>
        <ul class="lab-block__keywords">
          <li v-for="k in lab.keywords" :key="k">{{ k }}</li>
        </ul>
      </article>

      <div class="lab-scrolly__footer">
        <NuxtLink to="/laboratories" class="link-arrow">
          すべての研究室を見る
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { laboratories } from "~/data/laboratories";
</script>

<style scoped>
.lab-scrolly {
  position: relative;
  background: #161514;
}

.lab-scrolly__stage {
  position: sticky;
  top: 0;
  height: 100svh;
  overflow: hidden;
  z-index: 0;
}

.lab-scrolly__scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  /* 左側を暗くしてテキストを読ませ、右側はフィールドを見せる */
  background: linear-gradient(
    100deg,
    rgba(20, 19, 19, 0.92) 0%,
    rgba(20, 19, 19, 0.78) 38%,
    rgba(20, 19, 19, 0.34) 66%,
    rgba(20, 19, 19, 0.06) 86%,
    transparent 96%
  );
}

.lab-scrolly__list {
  position: relative;
  z-index: 1;
  /* 固定ステージの上へ引き上げ、最初のブロックから重ねて流す */
  margin-top: -100svh;
  width: min(58rem, 88vw);
  padding: 16vh var(--space-md) 20vh;
  color: #fcf9f8;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .lab-scrolly__list {
    width: min(60rem, 76vw);
    padding-left: clamp(var(--space-md), 6vw, var(--space-xl));
  }
}

.lab-scrolly__eyebrow {
  color: rgba(252, 249, 248, 0.55);
  margin-bottom: var(--space-sm);
}

.lab-block {
  width: 100%;
  max-width: 32rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-2xs, 0.35rem);
}

/* 3つごとに右へずらしてリズムをつくる（グループ内 0 / 1 / 2 段） */
.lab-block.is-stagger-1 {
  margin-left: clamp(0rem, 6vw, 7rem);
}
.lab-block.is-stagger-2 {
  margin-left: clamp(0rem, 12vw, 14rem);
}

@media (max-width: 767px) {
  .lab-block.is-stagger-1 {
    margin-left: 1.25rem;
  }
  .lab-block.is-stagger-2 {
    margin-left: 2.5rem;
  }
}

.lab-block__index {
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  color: rgba(252, 249, 248, 0.42);
}

.lab-block__prof {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  color: rgba(252, 249, 248, 0.6);
}

.lab-block__name {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.4vw, 2.4rem);
  font-weight: 700;
  line-height: 1.12;
  letter-spacing: -0.02em;
  margin-top: 0.1em;
}

.lab-block__theme {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  line-height: 1.9;
  color: rgba(252, 249, 248, 0.78);
  margin-top: 0.35em;
}

.lab-block__keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem 0.85rem;
  margin-top: 0.6em;
}

.lab-block__keywords li {
  position: relative;
  padding-left: 0.8rem;
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: rgba(252, 249, 248, 0.55);
}

.lab-block__keywords li::before {
  content: "—";
  position: absolute;
  left: 0;
  opacity: 0.5;
}

.is-media .lab-block__prof {
  color: var(--color-media-on-dark);
}
.is-knowledge .lab-block__prof {
  color: var(--color-knowledge-on-dark);
}
.is-design .lab-block__prof {
  color: var(--color-design-on-dark);
}

.is-media .lab-block__keywords li::before {
  color: var(--color-media-on-dark);
}
.is-knowledge .lab-block__keywords li::before {
  color: var(--color-knowledge-on-dark);
}
.is-design .lab-block__keywords li::before {
  color: var(--color-design-on-dark);
}

.lab-scrolly__footer {
  margin-top: var(--space-md);
}

.lab-scrolly__footer .link-arrow {
  color: #fcf9f8;
}
</style>
