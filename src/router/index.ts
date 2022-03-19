import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomePage from "@/pages/home/index.vue";
import SocialPage from "@/pages/social/index.vue";
import MessagePage from "@/pages/message/index.vue";
import MinePage from "@/pages/mine/index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
  {
    path: "/social",
    name: "social",
    component: SocialPage,
  },
  {
    path: "/message",
    name: "message",
    component: MessagePage,
  },
  {
    path: "/mine",
    name: "mine",
    component: MinePage,
  },
  {
    path: "/webview",
    name: "webview",
    meta: { requireAuth: true },
    component: () => import("@/pages/common/webview.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/pages/common/login/index.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth && !localStorage.getItem("token")) {
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
