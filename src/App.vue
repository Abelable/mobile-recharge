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
</template>

<script setup lang="ts">
import { ref, nextTick, provide } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const routerAlive = ref(true);

const routerRefresh = () => {
  routerAlive.value = false;
  nextTick(() => (routerAlive.value = true));
};
provide("routerRefresh", routerRefresh);
</script>

<style lang="stylus">
@import './assets/style/index.styl'
</style>
