<template>
  <NavBar title="订单查询详情" />
  <div class="container"></div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import { getOrderInfo } from "../../../../utils/api";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

onMounted(async () => {
  const res = await getOrderInfo(route.query.phone as string);
  console.log(res);
});
</script>

<style lang="stylus" scoped>
.container
  padding .88rem .24rem
  min-height 100vh
  background #f6f6f6
</style>
