import { RouteRecordRaw } from "vue-router";
import home from "./home";
import social from "./social";
import message from "./message";
import mine from "./mine";
import common from "./common";

const routes: Array<RouteRecordRaw> = [
  ...home,
  ...social,
  ...message,
  ...mine,
  ...common,
];

export default routes;
