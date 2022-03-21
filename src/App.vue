<template>
  <router-view v-if="route.meta.keepAlive" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view v-if="!route.meta.keepAlive" />
  <TabBar v-show="tabBarVisible" />
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import { useRoute } from "vue-router";
import TabBar from "@/components/TabBar.vue";

const route = useRoute();
const tabBarVisible = ref(false);

watchEffect(() => {
  tabBarVisible.value = ["/", "/social", "/message", "/mine"].includes(
    route.path
  );
});
</script>

<style lang="stylus">
@import './assets/style/index.styl'
</style>
