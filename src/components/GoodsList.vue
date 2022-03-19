<template>
  <div class="fall-flow">
    <ul>
      <li v-for="(item, index) in list" :key="item.goods_id">
        <GoodsItem v-if="index % 2 === 0" :item="item" />
      </li>
    </ul>
    <ul>
      <li v-for="(item, index) in list" :key="item.goods_id">
        <GoodsItem v-if="index % 2 === 1" :item="item" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import GoodsItem from "@/components/GoodsItem/index.vue";
import { GoodsInfo } from "@/types";

defineProps<{ list: GoodsInfo[] }>();
</script>

<style lang="stylus" scoped>
.fall-flow
  display flex
  justify-content space-between
  align-items flex-start
</style>
