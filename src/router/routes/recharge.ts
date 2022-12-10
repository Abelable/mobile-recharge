import { RouteRecordRaw } from "vue-router";
import Recharge from "@/pages/recharge/index.vue";

const recharge: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "recharge",
    component: Recharge,
  },
  {
    path: "/done",
    name: "done",
    component: () => import("@/pages/recharge/subpages/done/index.vue"),
  },
  {
    path: "/common_question",
    name: "common_question",
    component: () =>
      import("@/pages/recharge/subpages/common-question/index.vue"),
  },
];

export default recharge;
