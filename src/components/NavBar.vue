<template>
  <div class="nav-bar-wrap">
    <div class="nav-bar">
      <div class="back-arrow">
        <img
          style="width: 20px; height: 20px"
          @click="navBack"
          src="https://img.ubo.vip/mp/i-back-icon/back-icon.png"
        />
      </div>
      <h3 class="title" v-if="title">{{ title }}</h3>
      <div class="custom-btn-wrap">
        <slot name="custom-btn"></slot>
      </div>
    </div>
    <slot name="custom-menu"></slot>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
defineProps<{ title: string }>();
const navBack = () => history.back();
</script>

<style lang="stylus" scoped>
.nav-bar-wrap
  position fixed
  top 0
  left 0
  width 100%
  z-index 100
  .nav-bar
    display flex
    align-items center
    padding 0 .2rem
    height .88rem
    background #000
    .back-arrow
      display flex
      align-items center
      flex 1
      height .88rem
    .title
      width fit-content
      color #fff
      font-size .3rem
      font-weight 500
    .custom-btn-wrap
      display flex
      align-items center
      justify-content flex-end
      flex 1
      height .88rem
</style>
