import { RouteRecordRaw } from "vue-router";
import HomePage from "@/pages/home/index.vue";

const home: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    meta: { keepAlive: true },
    component: HomePage,
  },
  {
    path: "/mall",
    name: "mall",
    component: () => import("@/pages/home/subpages/mall/index.vue"),
  },
  {
    path: "/mall/goods",
    name: "goods",
    component: () =>
      import("@/pages/home/subpages/mall/subpages/goods/index.vue"),
  },
  {
    path: "/mall/category_detail",
    name: "category_detail",
    component: () =>
      import("@/pages/home/subpages/mall/subpages/category-detail.vue"),
  },
];

export default home;
