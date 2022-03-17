<template>
  <div class="fall-flow">
    <ul>
      <li>
        <slot name="banner" />
      </li>
      <li v-for="(item, index) in lists" :key="index">
        <MediaList v-if="index % 2 === 0" :item="item" />
      </li>
    </ul>
    <ul>
      <li>
        <slot name="tiles" />
      </li>
      <li v-for="(item, index) in lists" :key="index">
        <MediaList v-if="index % 2 === 1" :item="item" />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import MediaList from "./MediaList.vue";

defineProps({
  lists: Array,
});
</script>

<style lang="stylus" scoped>
.fall-flow
  display flex
  justify-content space-between
  align-items flex-start
</style>
