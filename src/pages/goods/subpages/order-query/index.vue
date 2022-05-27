<template>
  <NavBar title="订单查询" />
  <div class="container">
    <img class="illus" src="./images/order.svg" alt="" />
    <input
      class="input"
      v-model="phone"
      type="number"
      placeholder="请输入您的收货联系手机号"
    />
    <div class="btn" @click="orderQuery">查询</div>
    <div class="tips">
      <p style="font-weight: bold">以下情况会导致无法发货：</p>
      <p>1. 上传证件不清晰或不符合要求（可重新上传）</p>
      <p>2. 用户进入运营商黑名单或名下号卡超过5张</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import { ref } from "vue";
import { Toast } from "vant";
import { useRouter } from "vue-router";

const router = useRouter();

const phone = ref("");
const orderQuery = () => {
  if (!phone.value) {
    Toast("请输入联系手机号");
    return;
  }
  router.push({ path: "/order_detail", query: { phone: phone.value } });
};
</script>

<style lang="stylus" scoped>
.container
  padding .88rem .24rem 0
  .illus
    display block
    margin 1rem auto 0
    width 4rem
    height 4rem
  .input
    width calc(100vw - 0.48rem)
    height .88rem
    text-align center
    font-size .28rem
    border 1px solid #e6e6e6
    border-radius .1rem
  .btn
    display flex
    align-items center
    justify-content center
    margin-top .5rem
    height .88rem
    color #fff
    font-size .3rem
    font-weight bold
    background #3976ff
    border-radius .1rem
  .tips
    margin-top .5rem
    background #f5f5f5
    padding .24rem
    color #999
    font-size .24rem
    line-height 2
    border-radius .2rem
</style>
