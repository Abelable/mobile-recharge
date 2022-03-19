import { RouteRecordRaw } from "vue-router";
import home from "./home";
import social from "./social";
import message from "./message";
import mine from "./mine";

const routes: Array<RouteRecordRaw> = [...home, ...social, ...message, ...mine];

export default routes;
