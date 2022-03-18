import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView/HomeView.vue";
import SocialView from "@/views/SocialView/SocialView.vue";
import MessageView from "@/views/MessageView.vue";
import MineView from "@/views/MineView.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/social",
    name: "social",
    component: SocialView,
  },
  {
    path: "/message",
    name: "message",
    component: MessageView,
  },
  {
    path: "/mine",
    name: "mine",
    component: MineView,
  },
  {
    path: "/webview",
    name: "webview",
    meta: { requireAuth: true },
    component: () => import("@/views/WebView.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/LoginView/LoginView.vue"),
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
