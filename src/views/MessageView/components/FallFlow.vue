<template>
  <div class="fall-flow">
    <ul>
      <li>
        <slot name="banner" />
      </li>
      <li v-for="(item, index) in list" :key="index">
        <GoodsList v-if="index % 2 === 0" :item="item" />
      </li>
    </ul>
    <ul>
      <li>
        <slot name="tiles" />
      </li>
      <li v-for="(item, index) in list" :key="index">
        <GoodsList v-if="index % 2 === 1" :item="item" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import GoodsList from "@/components/GoodsList/index.vue";
import { defineProps } from "vue";
import { GoodsInfo } from "@/api/common";

defineProps<{ list: GoodsInfo[] }>();
</script>

<style lang="stylus" scoped>
.fall-flow
  display flex
  justify-content space-between
  align-items flex-start
</style>
