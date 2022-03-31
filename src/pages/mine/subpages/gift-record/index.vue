<template>
  <NavBar title="我的YO币">
    <template v-slot:custom-menu>
      <div class="menu-tabs" ontap="selectMenu">
        <div
          class="menu-tab"
          :class="{ active: selectedIdx === index }"
          v-for="(item, index) in ['全部', '充值', '消费']"
          :key="index"
          @click="selectMenu(index)"
        >
          {{ item }}
        </div>
      </div>
    </template>
  </NavBar>

  <PullRefresh class="content" v-model="refreshing" @refresh="onRefresh">
    <List
      class="coupon-lists-wrap"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadMore"
    >
      <div v-if="selectedIdx === 0">
        <CoinItem
          v-for="(item, index) in effectiveCoinList"
          :key="index"
          :item="item"
        />
      </div>
      <div v-if="selectedIdx === 1">
        <CoinItem
          v-for="(item, index) in overdueCoinList"
          :key="index"
          :item="item"
          overdue
        />
      </div>
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { PullRefresh, List } from "vant";
import NavBar from "@/components/NavBar.vue";
import CoinItem from "./components/CoinItem.vue";

import { ref } from "vue";
import { CoinInfo, getCoinList } from "./utils/api";

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const selectedIdx = ref(0);
const effectiveCoinList = ref<CoinInfo[]>([]);
const overdueCoinList = ref<CoinInfo[]>([]);

const onLoadMore = () => setCoinList();
const onRefresh = () => setCoinList();

const selectMenu = (index: number) => {
  if (index !== selectedIdx.value) {
    selectedIdx.value = index;
    if (
      (index === 0 && !effectiveCoinList.value.length) ||
      (index === 1 && !overdueCoinList.value.length)
    )
      setCoinList();
  }
};

const setCoinList = async () => {
  const list = await getCoinList(selectedIdx.value === 0 ? 1 : -1);
  if (selectedIdx.value === 0) effectiveCoinList.value = list;
  else overdueCoinList.value = list;
  refreshing.value = false;
};
</script>

<style lang="stylus" scoped>
.menu-tabs
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  height: .80rem
  background: #000
  .menu-tab
    width: 3rem
    text-align: center
    font-size: .30rem
    color: #fff
    &.active
      position: relative
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
        background-color: #fff
        border-radius: .05rem
.content
  padding: 2rem .24rem 0
  min-height: 100vh
</style>
