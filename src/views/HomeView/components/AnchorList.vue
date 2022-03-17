<template>
  <div class="anchor-list">
    <div class="avatar-wrap">
      <img class="avatar" :src="item?.avatar" />
      <div class="live-icon" v-if="item?.is_live == 1">
        <img
          style="width: 0.18rem; height: 0.24rem"
          src="https://img.ubo.vip/mp/i-media-list/live_status.gif"
        />
      </div>
    </div>
    <div class="name">{{ item?.username }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

defineProps({
  item: Object,
});
</script>

<style lang="stylus" scoped>
.anchor-list
  display flex
  flex-direction column
  margin-right .28rem
  height 1.60rem
  .avatar-wrap
    position relative
    width 1.10rem
    height 1.10rem
    .avatar
      width 1.10rem
      height 1.10rem
      border-radius .55rem
      background-image url('https://img.ubo.vip/mp/default-ubo-icon.png')
      background-repeat no-repeat
      background-size 100% 100%
    .live-icon
      position absolute
      right 0
      bottom 0
      display flex
      align-items center
      justify-content center
      width .34rem
      height .34rem
      border-radius .18rem
      background linear-gradient(121deg, #FF7F6B 0%, #E63D1C 100%)
  .name
    width 1.10rem
    color #333
    font-size .25rem
    text-align center
    overflow hidden
    text-overflow ellipsis
    white-space nowrap
</style>
