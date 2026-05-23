<template>
  <header
    class="header"
    :class="{
      'header--scrolled': isScrolled,
      'header--transparent': !isScrolled,
      'header--menu-open': menuOpen,
    }"
  >
    <div class="header__inner container">
      <!-- Logo -->
      <NuxtLink to="/" class="header__logo" @click="menuOpen = false">
        <span class="header__logo-ja">知能メディア工学科</span>
        <span class="header__logo-en">Intelligent Media Engineering</span>
      </NuxtLink>

      <!-- Desktop Navigation -->
      <nav class="header__nav" aria-label="メインナビゲーション">
        <ul class="header__nav-list">
          <li v-for="link in navLinks" :key="link.href">
            <NuxtLink
              :to="link.href"
              class="header__nav-link"
              active-class="header__nav-link--active"
            >
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
        aria-label="メニューを開く"
        @click="toggleMenu"
      >
        <span class="header__hamburger-line" :class="{ open: menuOpen }" />
        <span class="header__hamburger-line" :class="{ open: menuOpen }" />
        <span class="header__hamburger-line" :class="{ open: menuOpen }" />
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
                <span class="header__mobile-link-num">0{{ i + 1 }}</span>
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>
        <div class="header__mobile-footer">
          <span class="text-label" style="color: rgba(252, 249, 248, 0.35)"
            >千葉工業大学</span
          >
        </div>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const route = useRoute();
const menuOpen = ref(false);
const isScrolled = ref(false);
const isTopPage = computed(() => route.path === "/");

const navLinks = [
  { href: "/about", label: "学びの特徴" },
  { href: "/curriculum", label: "カリキュラム" },
  { href: "/skills", label: "身につく力" },
  { href: "/laboratories", label: "研究室" },
  { href: "/career", label: "キャリア" },
  { href: "/news", label: "ニュース" },
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
  transition:
    background-color 300ms ease,
    box-shadow 300ms ease;
}

.header--scrolled {
  background-color: rgba(252, 249, 248, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: var(--shadow-sticky);
}

.header--menu-open {
  background-color: transparent;
}

/* トップページ以外の未スクロール時: 透明背景＋白文字 */
.header--transparent .header__logo-ja {
  color: #fcf9f8;
}

.header--transparent .header__logo-en {
  color: #fcf9f8;
}

.header--transparent .header__nav-link {
  color: rgba(252, 249, 248, 0.7);
}

.header--transparent .header__nav-link:hover,
.header--transparent .header__nav-link--active {
  color: #fcf9f8;
}

.header--transparent .header__cta {
  background-color: rgba(252, 249, 248, 0.15);
  color: #fcf9f8;
  border-color: transparent;
}

.header--transparent .header__cta:hover {
  background-color: rgba(252, 249, 248, 0.25);
}

.header--transparent .header__hamburger-line {
  background-color: #fcf9f8;
}

.header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  gap: var(--space-md);
}

/* Logo */
.header__logo {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-decoration: none;
  flex-shrink: 0;
}

.header__logo-ja {
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-on-surface);
  letter-spacing: -0.01em;
  line-height: 1.2;
  transition: color 300ms ease;
}

.header--scrolled .header__logo-ja,
.header--menu-open .header__logo-ja {
  color: var(--color-on-surface);
}

.header__logo-en {
  font-family: var(--font-body);
  font-size: 0.65rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  opacity: 0.55;
  line-height: 1;
  transition: color 300ms ease;
}

/* Desktop Nav */
.header__nav {
  display: none;
}

@media (min-width: 1024px) {
  .header__nav {
    display: block;
  }
}

.header__nav-list {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.header__nav-link {
  display: block;
  padding: 0.5rem 0.875rem;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 400;
  color: rgba(28, 27, 27, 0.65);
  transition: color 200ms ease;
  text-decoration: none;
}

.header__nav-link:hover,
.header__nav-link--active {
  color: var(--color-on-surface);
}

/* CTA */
.header__cta {
  display: none;
  font-size: var(--text-xs);
  padding: 0.5rem 1rem;
}

@media (min-width: 1024px) {
  .header__cta {
    display: inline-flex;
  }
}

/* Hamburger */
.header__hamburger {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  width: 36px;
  height: 36px;
  padding: 6px;
  cursor: pointer;
  background: transparent;
  border: none;
  flex-shrink: 0;
}

@media (min-width: 1024px) {
  .header__hamburger {
    display: none;
  }
}

.header__hamburger-line {
  display: block;
  width: 100%;
  height: 1.5px;
  background-color: var(--color-on-surface);
  transition:
    transform 250ms ease,
    opacity 250ms ease;
  transform-origin: center;
}

.header__hamburger-line:nth-child(1).open {
  transform: translateY(6.5px) rotate(45deg);
}

.header__hamburger-line:nth-child(2).open {
  opacity: 0;
  transform: scaleX(0);
}

.header__hamburger-line:nth-child(3).open {
  transform: translateY(-6.5px) rotate(-45deg);
}

/* Mobile Menu */
.header__mobile-menu {
  position: fixed;
  inset: 0;
  z-index: 999;
  background-color: rgba(28, 27, 27, 0.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: var(--space-xl) var(--space-md);
}

.header__mobile-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.header__mobile-link {
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
  padding: 1.25rem 0;
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 600;
  color: rgba(252, 249, 248, 0.75);
  letter-spacing: -0.02em;
  text-decoration: none;
  transition: color 200ms ease;
  animation: menu-item-in 400ms ease both;
  animation-delay: var(--delay, 0ms);
}

.header__mobile-link:hover,
.header__mobile-link--active {
  color: #fcf9f8;
}

.header__mobile-link-num {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  letter-spacing: 0.05em;
  color: rgba(252, 249, 248, 0.3);
  flex-shrink: 0;
}

.header__mobile-footer {
  margin-top: auto;
  padding-top: var(--space-lg);
}

/* Animations */
@keyframes menu-item-in {
  from {
    opacity: 0;
    transform: translateX(-16px);
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
