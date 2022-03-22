<template>
  <NavBar title="足迹">
    <template v-slot:custom-menu>
      <div class="menu-wrap" ontap="selectMenu">
        <div
          class="menu-item"
          :class="{ selected: selectedIdx === index }"
          v-for="(item, index) in ['商品', '直播']"
          :key="index"
          @click="selectMenu(index)"
        >
          {{ item }}
        </div>
      </div>
    </template>
  </NavBar>

  <PullRefresh v-model="refreshing" @refresh="onRefresh">
    <List
      class="container"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadMore"
    >
      <div class="goods-track-lists" v-show="selectedIdx === 0">
        <TrackItem
          v-for="(item, index) in goodsTrackList"
          :key="index"
          :time="item.time"
        >
          <GoodsItem
            v-for="(goodsItem, goodsIndex) in item.list"
            :key="goodsIndex"
            :item="goodsItem"
          />
        </TrackItem>
      </div>
      <div class="live-track-lists" v-show="selectedIdx === 1">
        <TrackItem
          v-for="(item, index) in liveTrackList"
          :key="index"
          :time="item.date"
        >
          <LiveItem
            v-for="(liveItem, liveIndex) in item.list"
            :key="liveIndex"
            :item="liveItem"
          />
        </TrackItem>
      </div>
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { PullRefresh, List } from "vant";
import NavBar from "@/components/NavBar.vue";
import TrackItem from "./components/TrackItem.vue";
import GoodsItem from "./components/GoodsItem.vue";
import LiveItem from "./components/LiveItem.vue";

import { ref } from "vue";
import _ from "lodash";
import {
  GoodsItemInfo,
  LiveItemInfo,
  getGoodsTrackList,
  getLiveTrackList,
} from "./utils/api";

type GoodsTrackList = { time: string; list: GoodsItemInfo[] }[];
type LiveTrackList = { date: string; list: LiveItemInfo[] }[];

let goodsPage = 0;
let livePage = 0;

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const selectedIdx = ref(0);
const goodsTrackList = ref<GoodsTrackList>([]);
const liveTrackList = ref<LiveTrackList>([]);

const onLoadMore = _.debounce(() => setList(), 200);
const onRefresh = () => setList(true);
const selectMenu = (index: number) => {
  if (index !== selectedIdx.value) {
    selectedIdx.value = index;
    if (
      (index === 0 && !goodsTrackList.value?.length) ||
      (index === 1 && !liveTrackList.value?.length)
    ) {
      setList(true);
    }
  }
};

const setList = async (init = false) => {
  if (selectedIdx.value === 0) await setGoodsTrackList(init);
  else await setLiveTrackList(init);
  loading.value = false;
  refreshing.value = false;
};

const setGoodsTrackList = async (init: boolean) => {
  if (init) goodsPage = 0;
  const list: GoodsItemInfo[] = await getGoodsTrackList(++goodsPage, 10);
  if (list.length) {
    const trackList = init ? [] : goodsTrackList.value;
    list.forEach((item) => {
      const index = trackList.findIndex((_item) => _item.time === item.time);
      if (index !== -1) {
        trackList[index].list.push(item);
      } else {
        trackList.push({
          time: item.time,
          list: [item],
        });
      }
    });
    goodsTrackList.value = trackList;
  } else finished.value = true;
};
const setLiveTrackList = async (init: boolean) => {
  if (init) livePage = 0;
  const list: LiveItemInfo[] = await getLiveTrackList(++livePage, 10);
  if (list.length) {
    const trackList = init ? [] : liveTrackList.value;
    list.forEach((item) => {
      const index = trackList.findIndex((_item) => _item.date === item.date);
      if (index !== -1) {
        trackList[index].list.push(item);
      } else {
        trackList.push({
          date: item.date,
          list: [item],
        });
      }
    });
    liveTrackList.value = trackList;
  } else finished.value = true;
};
</script>

<style lang="stylus" scoped>
.menu-wrap
  display: flex
  align-items: center
  width: 100%
  background-color: #fff
  box-shadow: 0 .02rem .10rem 0 rgba(231,231,235,0.5)
  .menu-item
    position: relative
    flex: 1
    height: .90rem
    line-height: .90rem
    font-size: .32rem
    color: #666
    text-align: center
    &.selected
      color: #333
      &::after
        position: absolute
        left: 50%
        bottom: 0
        transform: translateX(-50%)
        width: .64rem
        height: .08rem
        content: ''
        background-color: #FAD07D
.container
  padding 2.08rem .3rem 0
</style>
