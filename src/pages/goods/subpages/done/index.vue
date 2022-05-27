<template>
  <NavBar title="订单提交成功" />
  <div class="container">
    <Icon name="checked" color="#28d928" size="1.6rem" />
    <div class="title">订单提交成功</div>
    <div class="tips">订单审核通过后，我们会尽快安排邮箱</div>
    <div class="tips">查询物流请点击：</div>
    <div class="btn" @click="navToOrderQuery">订单查询</div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "vant";
import NavBar from "@/components/NavBar/index.vue";
import { useRouter } from "vue-router";

const router = useRouter();

const navToOrderQuery = () => router.push("/order_query");
</script>

<style lang="stylus" scoped>
.container
  display flex
  flex-direction column
  align-items center
  padding-top 2rem
  .title
    margin-top .3rem
    color #333
    font-size .36rem
    font-weight bold
  .tips
    margin-top .5rem
    color #333
    font-size .3rem
  .btn
    display flex
    align-items center
    justify-content center
    margin-top .24rem
    width 3.6rem
    height .88rem
    color #fff
    font-size .3rem
    font-weight bold
    background #3976ff
    border-radius .44rem
</style>
