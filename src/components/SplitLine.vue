<template>
  <div class="split-line">{{ title }}</div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{ title: string }>();
</script>

<style lang="stylus" scoped>
.split-line
  position relative
  margin .24rem auto
  width fit-content
  color #333
  font-size .28rem
  &::before, &::after
    position: absolute
    top: 50%
    transform: translateY(-50%)
    content: ''
    width: .48rem
    height: .01rem
    background: #dbdbdb
  &::before
    left: -0.68rem
  &::after
    right: -0.68rem
</style>
