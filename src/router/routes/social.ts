import { RouteRecordRaw } from "vue-router";
import SocialPage from "@/pages/social/index.vue";

const social: Array<RouteRecordRaw> = [
  {
    path: "/social",
    name: "social",
    meta: { keepAlive: true },
    component: SocialPage,
  },
];

export default social;
