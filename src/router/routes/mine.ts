import { RouteRecordRaw } from "vue-router";
import MinePage from "@/pages/mine/index.vue";

const mine: Array<RouteRecordRaw> = [
  {
    path: "/mine",
    name: "mine",
    component: MinePage,
  },
  {
    path: "/mine/order_list",
    name: "order_list",
    component: () => import("@/pages/mine/subpages/order-list/index.vue"),
  },
  {
    path: "/mine/order_list/order_detail",
    name: "order_detail",
    component: () =>
      import(
        "@/pages/mine/subpages/order-list/subpages/order-detail/index.vue"
      ),
  },
];

export default mine;
