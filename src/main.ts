import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { isIphoneX } from "./utils/envJudgment";
import "./utils/initialRem";

const app = createApp(App).use(store).use(router);
app.config.globalProperties.isIphoneX = isIphoneX;
app.mount("#app");
