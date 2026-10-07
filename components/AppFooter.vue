<template>
  <footer class="footer">
    <div class="footer__inner container">
      <!-- Top row -->
      <div class="footer__top">
        <div class="footer__brand">
          <div class="footer__logo-ja">知能メディア工学科</div>
          <div class="footer__logo-en">
            Dept. of Intelligent Media Engineering — Chiba Institute of
            Technology
          </div>
        </div>

        <nav class="footer__nav" aria-label="フッターナビゲーション">
          <div class="footer__nav-group">
            <p class="footer__nav-title">About</p>
            <ul class="footer__nav-list">
              <li v-for="link in learnLinks" :key="link.href">
                <NuxtLink :to="link.href" class="footer__nav-link">{{
                  link.label
                }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="footer__nav-group">
            <p class="footer__nav-title">Info</p>
            <ul class="footer__nav-list">
              <li v-for="link in infoLinks" :key="link.href">
                <NuxtLink :to="link.href" class="footer__nav-link">{{
                  link.label
                }}</NuxtLink>
              </li>
            </ul>
          </div>
          <div class="footer__nav-group">
            <p class="footer__nav-title">Links</p>
            <ul class="footer__nav-list">
              <li v-for="link in externalLinks" :key="link.href">
                <a
                  :href="link.href"
                  class="footer__nav-link"
                  target="_blank"
                  rel="noopener noreferrer"
                  >{{ link.label
                  }}<span class="footer__ext" aria-hidden="true">↗</span></a
                >
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
          &copy; {{ currentYear }} Chiba Institute of Technology — IME
        </p>
        <p class="footer__address">〒275-0016 千葉県習志野市津田沼2丁目17-1</p>
        <button type="button" class="footer__top-btn" @click="scrollToTop">
          Back to top <span aria-hidden="true">↑</span>
        </button>
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
  { href: '/laboratories', label: '研究室' },
]

const infoLinks = [
  { href: '/career', label: 'キャリア・就職' },
  { href: '/news', label: 'ニュース' },
  { href: '/articles', label: '記事' },
]

const externalLinks = [
  { href: 'https://www.it-chiba.ac.jp/', label: '千葉工業大学' },
  {
    href: 'https://www.it-chiba.ac.jp/admissions/opencampus/',
    label: 'オープンキャンパス',
  },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
.footer {
  position: relative;
  z-index: 1;
  padding: var(--space-lg) 0 var(--space-md);
  background-color: var(--color-bg-base);
  border-top: 1px solid var(--color-line-subtle);
  color: var(--color-text-primary);
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

@media (min-width: 900px) {
  .footer__top {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__logo-ja {
  font-family: var(--font-jp);
  font-size: clamp(1.625rem, 3vw, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  line-height: 1.2;
}

.footer__logo-en {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  max-width: 34em;
}

.footer__nav {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-md) clamp(2.5rem, 6vw, 5rem);
}

.footer__nav-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__nav-title {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
}

.footer__nav-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__nav-link {
  font-family: var(--font-jp);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color 200ms ease;
}

.footer__nav-link:hover {
  color: var(--color-text-primary);
}

.footer__ext {
  margin-left: 0.35em;
  font-family: var(--font-mono);
  color: var(--color-accent);
}

/* 3領域カラーの細いバー */
.footer__pillars {
  display: flex;
  gap: 4px;
}

.footer__pillar {
  flex: 1;
  height: 2px;
}

.footer__pillar--media {
  background-color: var(--color-media);
}
.footer__pillar--knowledge {
  background-color: var(--color-knowledge);
}
.footer__pillar--design {
  background-color: var(--color-design);
}

.footer__bottom {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 900px) {
  .footer__bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.footer__copyright,
.footer__top-btn {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.footer__copyright {
  color: var(--color-text-tertiary);
}

.footer__address {
  font-family: var(--font-jp);
  font-size: 0.8125rem;
  color: var(--color-text-tertiary);
}

.footer__top-btn {
  align-self: flex-start;
  padding: 0;
  color: var(--color-text-primary);
  transition: color 200ms ease;
}

.footer__top-btn:hover {
  color: var(--color-accent);
}
</style>
