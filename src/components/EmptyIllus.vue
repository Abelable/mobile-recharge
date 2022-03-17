<template>
  <div class="empty-illus">
    <img class="img" src="https://img.ubo.vip/mp/index/not-logged-in.png" />
    <div class="btn" v-if="!isInLogin" @click="login">立即登录</div>
    <p class="desc" v-else>哎呀~关注列表空空如也</p>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { useRouter } from "vue-router";

defineProps<{ isInLogin: boolean }>();
const router = useRouter();
const login = () => router.push("/login");
</script>

<style lang="stylus" scoped>
.empty-illus
  position absolute
  top 5rem
  left 50%
  transform translate(-50%, -50%)
  padding .30rem 0
  font-size .30rem
  color #999
  text-align center
  .img
    margin-bottom .30rem
    width 4.00rem
    height 3.10rem
  .btn
    margin 0 auto
    width 1.80rem
    height .60rem
    border-radius .12rem
    font-size .26rem
    color #FFBC7D
    line-height .60rem
    text-align center
    background-color #333
</style>
