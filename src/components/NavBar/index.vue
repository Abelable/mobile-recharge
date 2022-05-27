<template>
  <div class="nav-bar-wrap">
    <div class="nav-bar">
      <div class="back-arrow">
        <img
          v-if="backIconVisible"
          style="width: 20px; height: 20px"
          @click="navBack"
          src="./images/back.png"
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
withDefaults(defineProps<{ backIconVisible: boolean; title: string }>(), {
  backIconVisible: true,
});
const navBack = () => history.back();
</script>

<style lang="stylus" scoped>
.nav-bar-wrap
  position fixed
  top 0
  left 0
  width 100%
  z-index 100
  box-shadow 0 0 .02rem 0 rgba(0, 0, 0, 0.1)
  .nav-bar
    display flex
    align-items center
    padding 0 .2rem
    height .88rem
    background #fff
    .back-arrow
      display flex
      align-items center
      flex 1
      height .88rem
    .title
      width fit-content
      color #333
      font-size .3rem
      font-weight 500
    .custom-btn-wrap
      display flex
      align-items center
      justify-content flex-end
      flex 1
      height .88rem
</style>
