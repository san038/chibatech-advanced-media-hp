<template>
  <footer class="footer bg-dark">
    <div class="footer__inner container">
      <!-- Top row -->
      <div class="footer__top">
        <div class="footer__brand">
          <div class="footer__logo-ja">知能メディア工学科</div>
          <div class="footer__logo-en">Department of Intelligent Media Engineering</div>
          <p class="footer__univ">千葉工業大学 情報科学部</p>
        </div>

        <nav class="footer__nav" aria-label="フッターナビゲーション">
          <div class="footer__nav-group">
            <p class="footer__nav-title">学科について</p>
            <ul class="footer__nav-list">
              <li v-for="link in learnLinks" :key="link.href">
                <NuxtLink :to="link.href" class="footer__nav-link">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="footer__nav-group">
            <p class="footer__nav-title">情報</p>
            <ul class="footer__nav-list">
              <li v-for="link in infoLinks" :key="link.href">
                <NuxtLink :to="link.href" class="footer__nav-link">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Pillar accent -->
      <div class="footer__pillars" aria-hidden="true">
        <div class="footer__pillar footer__pillar--media" />
        <div class="footer__pillar footer__pillar--knowledge" />
        <div class="footer__pillar footer__pillar--design" />
      </div>

      <!-- Bottom row -->
      <div class="footer__bottom">
        <p class="footer__copyright">
          &copy; {{ currentYear }} 千葉工業大学 知能メディア工学科. All rights reserved.
        </p>
        <p class="footer__address">
          〒275-0016 千葉県習志野市津田沼2丁目17-1
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear()

const learnLinks = [
  { href: '/about', label: '学びの特徴' },
  { href: '/curriculum', label: 'カリキュラム' },
  { href: '/skills', label: '身につく力' },
  { href: '/laboratories', label: '研究室一覧' },
]

const infoLinks = [
  { href: '/career', label: 'キャリア・就職' },
  { href: '/news', label: 'ニュース' },
]
</script>

<style scoped>
.footer {
  padding-top: var(--space-xl);
  padding-bottom: var(--space-lg);
}

.footer__inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.footer__top {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

@media (min-width: 768px) {
  .footer__top {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

/* Brand */
.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer__logo-ja {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: #fcf9f8;
  letter-spacing: -0.01em;
}

.footer__logo-en {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  letter-spacing: 0.03em;
  color: rgba(252, 249, 248, 0.4);
}

.footer__univ {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: rgba(252, 249, 248, 0.45);
  margin-top: var(--space-xs);
}

/* Nav */
.footer__nav {
  display: flex;
  gap: var(--space-xl);
}

.footer__nav-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer__nav-title {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(252, 249, 248, 0.3);
}

.footer__nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.footer__nav-link {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  color: rgba(252, 249, 248, 0.6);
  text-decoration: none;
  transition: color 200ms ease;
}

.footer__nav-link:hover {
  color: #fcf9f8;
}

/* Pillar accent line */
.footer__pillars {
  display: flex;
  gap: 4px;
  height: 2px;
}

.footer__pillar {
  height: 100%;
}

.footer__pillar--media {
  width: 33.333%;
  background-color: var(--color-media);
  opacity: 0.6;
}

.footer__pillar--knowledge {
  width: 33.333%;
  background-color: var(--color-knowledge);
  opacity: 0.6;
}

.footer__pillar--design {
  width: 33.333%;
  background-color: var(--color-design);
  opacity: 0.6;
}

/* Bottom */
.footer__bottom {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .footer__bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.footer__copyright {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: rgba(252, 249, 248, 0.3);
}

.footer__address {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  color: rgba(252, 249, 248, 0.25);
}
</style>
