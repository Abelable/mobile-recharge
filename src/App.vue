<template>
  <router-view />
  <Tabbar v-model="active">
    <TabbarItem icon="home-o" to="/">标签</TabbarItem>
    <TabbarItem icon="search" to="/about">标签</TabbarItem>
  </Tabbar>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Tabbar, TabbarItem } from "vant";

const active = ref(0);
</script>

<style lang="stylus">
@import './assets/style/index.styl'
</style>
