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
  <div class="container">
    <div class="cover-wrap">
      <img class="cover" src="" alt="" />
      <div class="toggle-bar">
        <img class="arrow" src="./images/arrow.png" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";

import { useRouter } from "vue-router";
const router = useRouter();

const navToOrderQuery = () => router.push("/order_query");
</script>

<style lang="stylus" scoped>
.container
  padding-top .88rem
  .cover-wrap
    position relative
    font-size 0
    height 100vw
    overflow hidden
    .cover
      width 100%
    .toggle-bar
      position absolute
      bottom 0
      display flex
      align-items center
      justify-content center
      width 100%
      height 1.1rem
      background linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4))
      .arrow
        width .5rem
        height .5rem
        animation shake 1.5s infinite
@keyframes shake
  0%
    transform translateY(0.06rem)
  50%
    transform translateY(-0.06rem)
  100%
    transform translateY(0.06rem)
</style>
