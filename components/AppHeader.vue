<template>
  <header
    class="header"
    :class="{
      'header--scrolled': isScrolled,
      'header--menu-open': menuOpen,
    }"
  >
    <div class="header__inner">
      <!-- Logo -->
      <NuxtLink to="/" class="header__logo" @click="closeMenu">
        <span class="header__logo-ja">知能メディア工学科</span>
        <span class="header__logo-en">Intelligent Media Eng. / CIT</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="header__nav" aria-label="メインナビゲーション">
        <ul class="header__nav-list">
          <li v-for="(link, i) in navLinks" :key="link.href">
            <NuxtLink
              :to="link.href"
              class="header__nav-link"
              active-class="header__nav-link--active"
            >
              <span class="header__nav-num" aria-hidden="true">{{
                String(i + 1).padStart(2, "0")
              }}</span>
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <!-- CTA Button (desktop) -->
      <NuxtLink to="/about" class="header__cta btn btn-primary">
        学科について
      </NuxtLink>

      <!-- Hamburger (mobile) -->
      <button
        class="header__hamburger"
        :aria-expanded="menuOpen"
        :aria-label="menuOpen ? 'メニューを閉じる' : 'メニューを開く'"
        @click="toggleMenu"
      >
        <span class="header__hamburger-text">{{
          menuOpen ? "Close" : "Menu"
        }}</span>
        <span class="header__hamburger-lines" :class="{ open: menuOpen }">
          <span class="header__hamburger-line" />
          <span class="header__hamburger-line" />
        </span>
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <Transition name="mobile-menu">
      <div
        v-if="menuOpen"
        class="header__mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="モバイルメニュー"
      >
        <nav aria-label="モバイルナビゲーション">
          <ul class="header__mobile-list">
            <li
              v-for="(link, i) in navLinks"
              :key="link.href"
              :style="{ '--delay': `${i * 60}ms` }"
            >
              <NuxtLink
                :to="link.href"
                class="header__mobile-link"
                active-class="header__mobile-link--active"
                @click="closeMenu"
              >
                <span class="header__mobile-link-num">{{
                  String(i + 1).padStart(2, "0")
                }}</span>
                {{ link.label }}
                <span class="header__mobile-link-arrow" aria-hidden="true"
                  >→</span
                >
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <NuxtLink
          to="/about"
          class="btn btn-primary header__mobile-cta"
          @click="closeMenu"
        >
          学科について
        </NuxtLink>
        <div class="header__mobile-footer">
          <span class="text-label">Chiba Institute of Technology</span>
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const menuOpen = ref(false);
const isScrolled = ref(false);

const navLinks = [
  { href: "/about", label: "学びの特徴" },
  { href: "/curriculum", label: "カリキュラム" },
  { href: "/skills", label: "身につく力" },
  { href: "/laboratories", label: "研究室" },
  { href: "/career", label: "キャリア" },
  { href: "/news", label: "ニュース" },
  { href: "/articles", label: "記事" },
];

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value;
  document.body.style.overflow = menuOpen.value ? "hidden" : "";
};

const closeMenu = () => {
  menuOpen.value = false;
  document.body.style.overflow = "";
};

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
  document.body.style.overflow = "";
});
</script>

<style scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  border-bottom: 1px solid var(--color-line-subtle);
  transition:
    background-color 300ms ease,
    border-color 300ms ease;
}

.header--scrolled {
  background-color: rgba(11, 13, 14, 0.78);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: var(--color-line);
}

.header--menu-open {
  background-color: var(--color-bg-base);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 var(--layout-margin);
  gap: var(--space-md);
}

/* Logo */
.header__logo {
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-decoration: none;
  flex-shrink: 0;
}

.header__logo-ja {
  font-family: var(--font-jp);
  font-size: 0.9375rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: 0.02em;
  line-height: 1.2;
}

.header__logo-en {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  font-weight: 400;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-tertiary);
  line-height: 1;
}

/* Desktop Nav */
.header__nav {
  display: none;
}

@media (min-width: 1100px) {
  .header__nav {
    display: block;
  }
}

.header__nav-list {
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.2vw, 2.25rem);
}

.header__nav-link {
  position: relative;
  display: flex;
  align-items: baseline;
  gap: 0.375rem;
  padding: 0.5rem 0;
  font-family: var(--font-jp);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color 200ms ease;
  text-decoration: none;
}

.header__nav-num {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
  transition: color 200ms ease;
}

.header__nav-link::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 1px;
  background-color: var(--color-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 250ms ease;
}

.header__nav-link:hover,
.header__nav-link--active {
  color: var(--color-text-primary);
}

.header__nav-link:hover .header__nav-num,
.header__nav-link--active .header__nav-num {
  color: var(--color-accent);
}

.header__nav-link--active::after {
  transform: scaleX(1);
}

/* CTA */
.header__cta {
  display: none;
  padding: 0.875rem 1rem 0.875rem 1.25rem;
  font-size: 0.8125rem;
}

@media (min-width: 1100px) {
  .header__cta {
    display: inline-flex;
  }
}

/* Hamburger */
.header__hamburger {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  height: 40px;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: none;
  flex-shrink: 0;
}

@media (min-width: 1100px) {
  .header__hamburger {
    display: none;
  }
}

.header__hamburger-text {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}

.header__hamburger-lines {
  position: relative;
  display: block;
  width: 24px;
  height: 7px;
}

.header__hamburger-line {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--color-text-primary);
  transition: transform 250ms ease;
}

.header__hamburger-line:nth-child(1) {
  top: 0;
}

.header__hamburger-line:nth-child(2) {
  bottom: 0;
}

.header__hamburger-lines.open .header__hamburger-line:nth-child(1) {
  transform: translateY(3px) rotate(30deg);
}

.header__hamburger-lines.open .header__hamburger-line:nth-child(2) {
  transform: translateY(-3px) rotate(-30deg);
}

/* Mobile Menu */
.header__mobile-menu {
  position: fixed;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  overflow-y: auto;
  background-color: var(--color-bg-base);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-md) var(--layout-margin)
    max(var(--space-md), env(safe-area-inset-bottom, 0px));
}

.header__mobile-list {
  display: flex;
  flex-direction: column;
}

.header__mobile-link {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: 1.1rem 0;
  border-top: 1px solid var(--color-line-subtle);
  font-family: var(--font-jp);
  font-size: clamp(1.375rem, 5vw, 1.75rem);
  font-weight: 700;
  color: var(--color-text-primary);
  text-decoration: none;
  transition: color 200ms ease;
  animation: menu-item-in 400ms ease both;
  animation-delay: var(--delay, 0ms);
}

.header__mobile-link--active {
  color: var(--color-accent);
}

.header__mobile-link-num {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  width: 2rem;
}

.header__mobile-link-arrow {
  margin-left: auto;
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 400;
  color: var(--color-accent);
}

.header__mobile-cta {
  align-self: stretch;
}

.header__mobile-footer {
  margin-top: auto;
  color: var(--color-text-tertiary);
}

/* Animations */
@keyframes menu-item-in {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.mobile-menu-enter-active {
  transition: opacity 300ms ease;
}

.mobile-menu-leave-active {
  transition: opacity 200ms ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>
