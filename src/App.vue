<template>
  <router-view
    v-if="route.meta.keepAlive && routerAlive"
    v-slot="{ Component }"
  >
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-if="!route.meta.keepAlive && routerAlive" />
  <TabBar v-show="tabBarVisible" />
</template>

<script setup lang="ts">
import TabBar from "@/components/TabBar.vue";

import { ref, watchEffect, onMounted, nextTick, provide } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();

const tabBarVisible = ref(false);
const routerAlive = ref(true);

watchEffect(() => {
  tabBarVisible.value = ["/", "/social", "/message", "/mine"].includes(
    route.path
  );
});

onMounted(() => store.dispatch("updateCartCount"));

const routerRefresh = () => {
  routerAlive.value = false;
  nextTick(() => (routerAlive.value = true));
};
provide("routerRefresh", routerRefresh);
</script>

<style lang="stylus">
@import './assets/style/index.styl'
</style>
