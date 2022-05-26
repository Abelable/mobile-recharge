import { RouteRecordRaw } from "vue-router";
import HomePage from "@/pages/home/index.vue";

const home: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "goods",
    component: HomePage,
  },
  {
    path: "/success",
    name: "success",
    component: () => import("@/pages/home/subpages/mall/index.vue"),
  },
  {
    path: "/order_query",
    name: "order_query",
    component: () => import("@/pages/home/subpages/mall/index.vue"),
  },
  {
    path: "/order_detail",
    name: "order_detail",
    component: () => import("@/pages/home/subpages/search/index.vue"),
  },
];

export default home;
