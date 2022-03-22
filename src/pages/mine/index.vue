<template>
  <div class="container">
    <div class="user-info" v-if="isInLogin">
      <Image round width="1rem" height="1rem" :src="userInfo?.avatar" />
      <div class="main">
        <div class="name">{{ userInfo?.nickname }}</div>
        <div class="phone">{{ formatMobile(userInfo?.mobile || "") }}</div>
      </div>
    </div>
    <div class="login-btn" v-else @click="login">登录</div>

    <div class="user-relationship-info">
      <div class="follow-count">
        <span class="desc">关注</span>
        <span class="count">{{ followCount }}</span>
      </div>
      <div class="fans-count">
        <span class="desc">粉丝</span>
        <span class="count">{{ fansCount }}</span>
      </div>
    </div>

    <div class="order-info-wrap">
      <div class="slogan-wrap">
        <img
          style="width: 0.4rem; height: 0.4rem"
          src="https://img.ubo.vip/mp/mine/new-icon/crown-icon.png"
        />
        <div class="slogan">直播带货，自买省钱，分享赚钱</div>
      </div>
      <div class="header">
        <div class="title">我的订单</div>
        <div class="arrow" @click="navToOrderList(0)">
          <span>查看全部</span>
          <img
            class="arrow-icon"
            src="https://img.ubo.vip/mp/mine/right-arrow.png"
          />
        </div>
      </div>
      <ul class="order-lists">
        <li
          class="order-list"
          v-for="(item, index) in orderInfoList"
          :key="index"
          @click="navToOrderList(item.status)"
        >
          <img
            style="width: 0.46rem; height: 0.46rem"
            :src="`https://img.ubo.vip/mp/mine/new-icon/${item.icon}-icon.png`"
          />
          <p class="desc">{{ item.desc }}</p>
          <div class="count" v-if="orderCountList[index]">
            {{ formatCount(orderCountList[index]) }}
          </div>
        </li>
      </ul>
    </div>

    <div class="tools-wrap">
      <div class="title">我的钱包</div>
      <ul class="tool-lists">
        <li
          class="tool-list"
          v-for="(item, index) in wealthToolList"
          :key="index"
          @click="navTo(item.name)"
        >
          <img
            style="width: 0.48rem; height: 0.48rem"
            :src="`https://img.ubo.vip/mp/mine/${item.name}-mine.png`"
          />
          <p class="desc">{{ item.desc }}</p>
        </li>
      </ul>
    </div>

    <div class="tools-wrap">
      <div class="title">我的工具</div>
      <ul class="tool-lists">
        <li
          class="tool-list"
          v-for="(item, index) in otherToolList"
          :key="index"
          @click="navTo(item.name)"
        >
          <img
            style="width: 0.48rem; height: 0.48rem"
            :src="`https://img.ubo.vip/mp/mine/new-icon/${item.name}-icon.png`"
          />
          <p class="desc">{{ item.desc }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Image } from "vant";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useMineInfo } from "./utils";

const router = useRouter();
const { userInfo, fansCount, followCount, orderCountList, setMineInfo } =
  useMineInfo();

const orderInfoList = [
  { icon: "payment", desc: "待付款", status: 1 },
  { icon: "shipment", desc: "待发货", status: 5 },
  { icon: "receive", desc: "待收货", status: 2 },
  { icon: "finish", desc: "已完成", status: 3 },
  { icon: "refund", desc: "退换货", status: 6 },
];
const wealthToolList = [
  { name: "coin", desc: "YO币" },
  { name: "coupon", desc: "优惠券" },
  { name: "gift", desc: "打赏" },
];
const otherToolList = [
  { name: "customer", desc: "联系客服" },
  { name: "identify", desc: "实名认证" },
  { name: "address", desc: "收货地址" },
  { name: "track", desc: "浏览足迹" },
];
const isInLogin = ref(false);

onMounted(() => {
  isInLogin.value = !!localStorage.getItem("token");
  if (isInLogin.value) setMineInfo();
});

const formatCount = (count: number) => (count > 99 ? "99+" : count);
const formatMobile = (mobile: string) =>
  mobile.slice(0, 3) + "****" + mobile.slice(-4);

const login = () => router.push("/login");
const navToOrderList = (status: number) => {
  if (status === 6) router.push("/mine/refund");
  else router.push({ path: "/mine/order_list", query: { status } });
};
const navTo = (name: string) => router.push(`/mine/${name}`);
</script>

<style lang="stylus" scoped>
.container
  overflow hidden
  background-image url('https://img.ubo.vip/mp/mine/new-icon/mine-bg.png')
  background-repeat no-repeat
  background-size 100% 5.27rem
  .user-info
    display flex
    align-items center
    margin-top 1rem
    margin-left .28rem
    .main
      margin-left .20rem
      color #fff
      .name
        font-size .36rem
        font-weight 600
        white-space nowrap
      .phone
        margin-top .05rem
        font-size .20rem
  .login-btn
    margin-top 1rem
    margin-left .28rem
    width .97rem
    height .97rem
    background-color #fff
    text-align center
    font-size .30rem
    color #F7CC9C
    line-height .97rem
    border-radius 50%
  .user-relationship-info
    display flex
    align-items center
    margin .28rem
    .follow-count, .fans-count
      display flex
      align-items baseline
      margin-right .6rem
      color #ccc
      .desc
        margin-right .1rem
        font-size .28rem
      .count
        font-size .32rem
        font-weight 600
  .order-info-wrap
    margin .20rem
    background-color #fff
    border-radius .12rem
    .slogan-wrap
      display flex
      align-items center
      padding 0 .24rem
      height .76rem
      background-image url('https://img.ubo.vip/mp/mine/new-icon/anchor-bg.png')
      background-size 100% 100%
      background-repeat no-repeat
      .slogan
        margin-left .16rem
        flex 1
        color #583C34
        font-size .28rem
    .header
      display flex
      align-items center
      justify-content space-between
      padding .2rem .2rem 0 .24rem
      .title
        color #111
        font-size .28rem
        font-weight 500
      .arrow
        display flex
        align-items center
        color #A6A6A6
        font-size .24rem
        .arrow-icon
          margin-left .1rem
          width .22rem
          height .24rem
    .order-lists
      display flex
      padding .36rem .24rem
      .order-list
        position relative
        flex 1
        text-align center
        font-size 0
        &::after
          position absolute
          right 0
          top 50%
          width .01rem
          height .43rem
          content ''
          transform translateY(-50%)
          background #DFDFDF
        &:last-child::after
          width 0
        .desc
          margin-top .2rem
          color #111
          font-size .24rem
        .count
          position absolute
          right .20rem
          top -0.22rem
          min-width .35rem
          height .35rem
          color #fff
          font-size .20rem
          text-align center
          line-height .35rem
          border-radius 50%
          background-color red
  .tools-wrap
    margin .20rem
    padding .24rem .24rem .12rem
    background #fff
    border-radius .12rem
    .title
      margin-bottom .05rem
      color #111
      font-size .28rem
      font-weight 500
    .tool-lists
      display flex
      flex-wrap wrap
      font-size 0
      .tool-list
        margin .24rem .3rem
        width 1.05rem
        height .94rem
        text-align center
        .desc
          margin-top .1rem
          color #111
          font-size .24rem
</style>
