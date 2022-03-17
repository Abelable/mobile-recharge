import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView/HomeView.vue";
import SocialView from "@/views/SocialView.vue";
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
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
