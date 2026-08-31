import { createRouter, createWebHistory } from "vue-router";
import IndexPage from "~/pages/index.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
