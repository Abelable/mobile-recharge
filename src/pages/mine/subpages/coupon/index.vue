<template>
  <NavBar title="我的优惠券">
    <template v-slot:custom-menu>
      <ul class="menu-tabs">
        <li
          class="menu-tab"
          :class="{ active: currentType === index }"
          v-for="(item, index) in ['未使用', '已使用']"
          :key="index"
          @click="selectTap(index)"
        >
          {{ item }}
        </li>
      </ul>
    </template>
  </NavBar>

  <Swipe
    class="exchange-wrap"
    ref="swipeRef"
    :show-indicators="false"
    :initial-swipe="1"
    :loop="false"
  >
    <SwipeItem class="exchange">
      <input
        class="exchange-input"
        type="text"
        placeholder="请输入优惠券兑换码"
        v-model="couponCode"
      />
      <div class="exchange-btn" @click="exchange">兑换</div>
    </SwipeItem>
    <SwipeItem class="show-btn-wrap">
      <div class="show-btn" @click="showExchange">
        <img
          class="exchange-icon"
          src="https://img.ubo.vip/mp/mine/coupon/exchange.png"
        />
        <span>兑换优惠券</span>
      </div>
      <div class="rule">
        <img
          style="width: 0.32rem; height: 0.32rem"
          src="https://img.ubo.vip/mp/mine/coupon/rule-icon.png"
        />
        <span @click="rulePopupVisible = true">规则</span>
      </div>
    </SwipeItem>
  </Swipe>

  <PullRefresh v-model="refreshing" @refresh="onRefresh">
    <List
      class="coupon-lists-wrap"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadMore"
    >
      <div class="coupon-lists" v-show="currentType === 0">
        <CouponItem
          v-for="(item, index) in effectiveCouponList"
          :key="index"
          :item="item"
        />
        <div class="ineffective-title" v-if="ineffectiveCouponList.length">
          即将生效
        </div>
        <CouponItem
          v-for="(item, index) in ineffectiveCouponList"
          :key="index"
          :item="item"
        />
      </div>
      <div class="coupon-lists" v-show="currentType === 1">
        <CouponItem
          v-for="(item, index) in overdueCouponList"
          :key="index"
          :item="item"
          :overdue="true"
        />
      </div>
    </List>
  </PullRefresh>

  <Popup v-model="rulePopupVisible" position="bottom" closeable round>
    <RulePop />
  </Popup>
</template>

<script setup lang="ts">
import {
  SwipeInstance,
  PullRefresh,
  List,
  Swipe,
  SwipeItem,
  Popup,
  Toast,
} from "vant";
import NavBar from "@/components/NavBar.vue";
import RulePop from "./components/RulePop.vue";
import CouponItem from "./components/CouponItem.vue";

import { ref } from "vue";
import _ from "lodash";
import { CouponInfo, exchangeCoupon } from "./utils/api";
import { useCouponList } from "./utils";

const { couponList, setCouponList } = useCouponList();

let pageArr = [0, 0];

const swipeRef = ref<SwipeInstance>();
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const currentType = ref(0);
const effectiveCouponList = ref<CouponInfo[]>([]);
const ineffectiveCouponList = ref<CouponInfo[]>([]);
const overdueCouponList = ref<CouponInfo[]>([]);
const couponCode = ref("");
const rulePopupVisible = ref(false);

const onLoadMore = _.debounce(() => setCouponLists());
const onRefresh = () => setCouponLists(true);
const selectTap = (index: number) => {
  if (index !== currentType.value) {
    currentType.value = index;
    if (
      (index === 0 &&
        !(
          effectiveCouponList.value.length + ineffectiveCouponList.value.length
        )) ||
      (index === 1 && !overdueCouponList.value.length)
    ) {
      setCouponLists(true);
    }
  }
};

const setCouponLists = async (init = false) => {
  if (init) pageArr[currentType.value] = 0;
  await setCouponList(currentType.value + 1, ++pageArr[currentType.value]);
  loading.value = false;
  refreshing.value = false;
  if (couponList.value.length) {
    if (currentType.value === 0) {
      let effectiveList: CouponInfo[] = [];
      let ineffectiveList: CouponInfo[] = [];
      couponList.value.forEach((item) => {
        if (item.use_start_date_time) ineffectiveList.push(item);
        else effectiveList.push(item);
      });
      effectiveCouponList.value = init
        ? effectiveList
        : [...effectiveCouponList.value, ...effectiveList];
      ineffectiveCouponList.value = init
        ? ineffectiveList
        : [...ineffectiveCouponList.value, ...ineffectiveList];
    } else
      overdueCouponList.value = init
        ? couponList.value
        : [...overdueCouponList.value, ...couponList.value];
  } else finished.value = true;
};

const exchange = () => {
  if (!couponCode.value) {
    Toast("请输入兑换码");
    return;
  }
  exchangeCoupon(couponCode.value);
};

const showExchange = () => swipeRef.value?.prev();
</script>

<style lang="stylus" scoped>
.menu-tabs
  display: flex
  justify-content: center
  align-items: center
  height: .8rem
  background: #000
  .menu-tab
    position: relative
    width: 3.00rem
    text-align: center
    font-size: .30rem
    color: #fff
    &.active
      font-size: .34rem
      font-weight: 500
      &::after
        position: absolute
        left: 50%
        bottom: -0.02rem
        transform: translateX(-50%)
        content: ''
        width: 1.00rem
        height: .06rem
        background: #fff
        border-radius: .05rem
.exchange-wrap
  margin-top 1.68rem
  .exchange
    display flex
    padding .24rem
    .exchange-input
      flex 1
      height: .68rem
      font-size .26rem
      text-align: center
      border-radius: .08rem
      background: #fff
    .exchange-btn
      margin-left .24rem
      width: 1.36rem
      height: .68rem
      color: #F7CC9C
      font-size: .30rem
      font-weight: 500
      text-align: center
      line-height: .68rem
      background: #000
      border-radius: .34rem
  .show-btn-wrap
    display: flex
    justify-content: space-between
    align-items: center
    padding .24rem 0
    .show-btn
      display: flex
      align-items: center
      width: 2.36rem
      height: .68rem
      color: #F7CC9C
      font-size: .28rem
      font-weight: 500
      background: #000
      border-radius: 0 .90rem .90rem 0
      .exchange-icon
        padding: 0 .08rem
        width: .63rem
        height: .48rem
    .rule
      display: flex
      align-items: center
      justify-content: space-between
      margin-right: .20rem
      width: 1.05rem
      color: #000
      font-size: .32rem
      font-weight: 500
.coupon-lists-wrap
  padding 0 .24rem
</style>
