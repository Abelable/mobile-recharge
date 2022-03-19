import { RouteRecordRaw } from "vue-router";
import MessagePage from "@/pages/message/index.vue";

const message: Array<RouteRecordRaw> = [
  {
    path: "/message",
    name: "message",
    component: MessagePage,
  },
];

export default message;
