import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "~/pages/index.vue";

// WP テーマ配信時: functions.php が渡す routerBase（サイトのパス、通常 "/"）
// を history のベースにする。アセットのベース（Vite base）とは別物。
function siteData(): { routerBase?: string } {
  return typeof window !== "undefined"
    ? (window as unknown as { __SITE_DATA__?: { routerBase?: string } })
        .__SITE_DATA__ ?? {}
    : {};
}

const routerBase = siteData().routerBase || "/";

export const router = createRouter({
  history: createWebHistory(routerBase),
  routes: [
    { path: "/", name: "index", component: IndexPage },
    {
      path: "/about",
      name: "about",
      component: () => import("~/pages/about.vue"),
    },
    {
      path: "/curriculum",
      name: "curriculum",
      component: () => import("~/pages/curriculum.vue"),
    },
    {
      path: "/skills",
      name: "skills",
      component: () => import("~/pages/skills.vue"),
    },
    {
      path: "/laboratories",
      name: "laboratories",
      component: () => import("~/pages/laboratories.vue"),
    },
    {
      path: "/career",
      name: "career",
      component: () => import("~/pages/career.vue"),
    },
    { path: "/news", name: "news", component: () => import("~/pages/news.vue") },
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) return { el: to.hash, top: 80 };
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});
