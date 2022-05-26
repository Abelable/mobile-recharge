<template>
  <NavBar :backIconVisible="false" title="商品">
    <template v-slot:custom-btn>
      <img
        style="width: 20px; height: 20px"
        @click="navToOrderQuery"
        src="./images/search.png"
      />
    </template>
  </NavBar>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";

import { useRouter } from "vue-router";
const router = useRouter();

const navToOrderQuery = () => router.push("/goods/order_query");
</script>

<style lang="stylus" scoped></style>
