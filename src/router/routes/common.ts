import { RouteRecordRaw } from "vue-router";

const common: Array<RouteRecordRaw> = [
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

export default common;
