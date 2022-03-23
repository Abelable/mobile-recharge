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
];

export default home;
