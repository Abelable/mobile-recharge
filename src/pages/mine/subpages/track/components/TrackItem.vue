<template>
  <div class="track-item">
    <div class="time">{{ time }}</div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{ time: string }>();
</script>

<style lang="stylus" scoped>
.track-item
  margin-bottom: .3rem
  padding: 0 .30rem
  background-color: #fff
  border-radius: .12rem
  &:last-child
    margin-bottom: 0
  .time
    padding-top: .20rem
    color: #333
    font-size: .26rem
</style>
