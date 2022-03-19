<template>
  <NavBar :title="title || '有播'" />
  <iframe style="width: 100vw; height: 100vh" :title="title" :src="url" />
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
