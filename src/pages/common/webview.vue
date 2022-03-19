<template>
  <NavBar :title="title || '有播'" />
  <iframe class="content-wrap" style="" :title="title" :src="url" />
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const title = route.query.title as string;
let url = route.query.url as string;
url =
  url.indexOf("token") === -1
    ? `${url}${url.indexOf("?") === -1 ? "?" : "&"}token=${localStorage.getItem(
        "token"
      )}`
    : url;
</script>

<style lang="stylus" scoped>
.content-wrap
  margin-top: .88rem
  width: 100vw
  height: calc(100vh - .88rem)
</style>
