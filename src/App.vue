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
import TabBar from "@/components/TabBar.vue";

import { ref, watchEffect, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

const store = useStore();
const route = useRoute();
const tabBarVisible = ref(false);

watchEffect(() => {
  tabBarVisible.value = ["/", "/social", "/message", "/mine"].includes(
    route.path
  );
});

onMounted(() => store.dispatch("updateCartCount"));
</script>

<style lang="stylus">
@import './assets/style/index.styl'
</style>
