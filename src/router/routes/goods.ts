import { RouteRecordRaw } from "vue-router";
import GoodsPage from "@/pages/goods/index.vue";

const home: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "goods",
    component: GoodsPage,
  },
  {
    path: "/done",
    name: "done",
    component: () => import("@/pages/goods/subpages/done/index.vue"),
  },
  {
    path: "/order_query",
    name: "order_query",
    component: () => import("@/pages/goods/subpages/order-query/index.vue"),
  },
  {
    path: "/order_detail",
    name: "order_detail",
    component: () =>
      import(
        "@/pages/goods/subpages/order-query/subpages/order-detail/index.vue"
      ),
  },
];

export default home;
