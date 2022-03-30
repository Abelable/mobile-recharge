<template>
  <div class="coin-item" @click="link">
    <img class="coin-bg" src="https://img.ubo.vip/mp/mine/coin/coin.png" />
    <div class="content">
      <div class="price-wrap" :class="{ overdue }">
        <div class="price">
          <span style="font-size: 0.3rem">¥</span>
          <span>{{ item.tb_money }}</span>
        </div>
      </div>
      <div class="coin-detail">
        <div class="coin-name" :class="{ overdue }">现自营商品</div>
        <div class="coin-time" :class="{ overdue }">
          {{ item.end_time }}到期
        </div>
      </div>
    </div>
    <img
      class="ineffective-icon"
      wx:if="{{overdue}}"
      src="https://img.ubo.vip/mp/mine/coupon/i-coupon-list/used.png"
    />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { webviewUrl } from "@/utils";
import { CoinInfo } from "../utils/api";

const router = useRouter();

const props = defineProps<{ item: CoinInfo; overdue?: boolean }>();

const link = () => {
  !props.overdue &&
    router.push({
      path: "/webview",
      query: {
        title: "签到",
        url: `${webviewUrl}/webview/dist/#/activity/new_user_welfare`,
      },
    });
};
</script>

<style lang="stylus" scoped>
.coin-item
  position: relative
  display: flex
  align-items: center
  margin-bottom: .24rem
  padding: 0 .20rem
  height: 2.10rem
  border-radius: .10rem
  background-color: #fff
  &::before, &::after
    position: absolute
    top: .90rem
    content: ''
    width: .30rem
    height: .30rem
    border-radius: 50%
    background-color: #f4f4f4
  &::before
    left: -0.15rem
  &::after
    right: -0.15rem
  .coin-bg
    position: absolute
    left: 0
    bottom: 0
    width: 1.50rem
    height: 1.80rem
  .content
    display: flex
    align-items: center
    height: 1.15rem
    z-index: 1
    .price-wrap
      display: flex
      align-items: center
      justify-content: center
      padding-right: .10rem
      width: 2.30rem
      height: 1.20rem
      color: #E42D00
      border-right: .01rem solid #f4f4f4
      &.overdue
        color: #c7c7c7
      .price
        font-size: .58rem
        font-weight: 600
    .coin-detail
      display: flex
      flex-direction: column
      justify-content: space-between
      padding-left: .34rem
      height: 1.20rem
      .coin-name
        color: #333
        font-size: .34rem
        font-weight: 500
        line-height: .48rem
        &.overdue
          color: #c7c7c7
      .coin-time
        color: #E42D00
        font-size: .28rem
        line-height: 1
        &.overdue
          color: #c7c7c7
  .ineffective-icon
    position: absolute
    top: 0
    right: 0
    width: 1.50rem
    height: 1.32rem
</style>
