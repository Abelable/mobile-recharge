<template>
  <NavBar
    :title="title || '有播'"
    safe-area-inset-top
    left-arrow
    @click-left="onClickLeft"
  />
  <iframe style="width: 100vw; height: 100vh" :title="title" :src="url" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { NavBar } from "vant";

const route = useRoute();
const title = route.query.title as string;
let url = route.query.url as string;
url =
  url.indexOf("token") === -1
    ? `${url}${url.indexOf("?") === -1 ? "?" : "&"}token=${localStorage.getItem(
        "token"
      )}`
    : url;

const onClickLeft = () => history.back();
</script>
