import { RouteRecordRaw } from "vue-router";
import HomePage from "@/pages/home/index.vue";

const home: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    component: HomePage,
  },
];

export default home;
