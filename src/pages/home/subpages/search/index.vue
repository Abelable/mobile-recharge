<template>
  <div class="search-bar-wrap">
    <div class="search-bar">
      <div class="back-wrap">
        <img
          class="back-icon"
          src="https://img.ubo.vip/mp/search/back.png"
          @click="navBack"
        />
      </div>
      <div class="search-content">
        <img
          class="search-icon"
          src="https://img.ubo.vip/mp/index/search/index-search.png"
        />
        <input class="search-input" v-model="keyword" />
        <div class="cancel-btn" v-if="keyword" @click="cancelSearch">
          <img
            style="width: 0.32rem; height: 0.32rem"
            src="https://img.ubo.vip/mp/search/clear-search.png"
          />
        </div>
        <div class="search-btn" @click="search">搜索</div>
      </div>
    </div>
    <div v-if="!showHistory">
      <div class="tab-list">
        <div
          class="tab-item"
          :class="{ active: searchType === index }"
          v-for="(item, index) in ['直播', '商品', '短视频']"
          :key="index"
          @click="changeTab(index)"
        >
          {{ item }}
        </div>
      </div>
      <DropdownMenu>
        <DropdownItem
          v-modal="sortValue"
          :options="sortOptionsList[searchType]"
        />
        <DropdownItem
          v-model="filterValue"
          :options="filterOptionsList[searchType]"
        />
      </DropdownMenu>
    </div>
  </div>

  <div v-show="showHistory">
    <div class="keywords-wrap">
      <div class="title" v-if="historyKeywords.length">
        <div>最近搜索</div>
        <img
          class="delete-icon"
          src="https://img.ubo.vip/mp/selection/search/del-history.png"
          @click="clearHistoryKeywords"
        />
      </div>
      <div class="keywords">
        <div
          class="keyword"
          v-for="(item, index) in historyKeywords"
          :key="index"
          @click="keywordSelect(item.word)"
        >
          {{ item.word }}
        </div>
      </div>
    </div>
    <div class="keywords-wrap">
      <div class="title">热搜</div>
      <ul class="keywords">
        <li
          class="keyword"
          v-for="(item, index) in hotKeywords"
          :key="index"
          @click="keywordSelect(item.word)"
        >
          {{ item.word }}
        </li>
      </ul>
    </div>
  </div>

  <PullRefresh
    class="list-wrap"
    v-show="!showHistory"
    v-model="refreshing"
    @refresh="onRefresh"
  >
    <List v-model="loading" :finished="finished" @load="onLoadMore">
      <div v-show="searchType === 0">
        <LiveItem v-for="(item, index) in liveList" :key="index" :item="item" />
      </div>
      <GoodsList v-show="searchType === 1" :list="goodsList" />
      <div v-show="searchType === 2">
        <VideoItem
          v-for="(item, index) in videoList"
          :key="index"
          :item="item"
        />
      </div>
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { DropdownMenu, DropdownItem, PullRefresh, List } from "vant";
import LiveItem from "@/components/LiveItem.vue";
import VideoItem from "@/components/VideoItem.vue";
import GoodsList from "@/components/GoodsList.vue";

import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import {
  deleteHistoryKeywords,
  getHistoryKeywords,
  getHotKeywords,
  KeywordItem,
  FilterOption,
  getfilterOptions,
} from "./utils/api";
import { GoodsInfo, LiveInfo, VideoInfo } from "@/types";
import { getSearchResult } from "./utils/api";

const router = useRouter();

interface SortOption {
  text: string;
  value: number | string;
}
const sortOptionsList: SortOption[][] = [
  [
    { text: "综合排序", value: 0 },
    { text: "最新发布", value: 1 },
    { text: "最多点赞", value: 2 },
  ],
  [
    { text: "综合排序", value: 0 },
    { text: "销量", value: 1 },
    { text: "价格降序", value: 2 },
    { text: "价格升序", value: 3 },
  ],
  [
    { text: "综合排序", value: 0 },
    { text: "最新发布", value: 1 },
    { text: "最多点赞", value: 2 },
  ],
];

let page = 0;

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const hotKeywords = ref<KeywordItem[]>([]);
const historyKeywords = ref<KeywordItem[]>([]);
const searchType = ref(0);
const sortValue = ref(0);
const filterOptionsList = ref<FilterOption[][]>([]);
const filterValue = ref("");
const showHistory = ref(false);
const keyword = ref("");
const liveList = ref<LiveInfo[]>([]);
const goodsList = ref<GoodsInfo[]>([]);
const videoList = ref<VideoInfo[]>([]);

onMounted(() => {
  setKeywords();
  setfilterOptionsList();
});

const onLoadMore = () => setSearchResult();
const onRefresh = () => setSearchResult(true);

const setKeywords = async () => {
  historyKeywords.value = await getHistoryKeywords();
  hotKeywords.value = await getHotKeywords();
};
const setfilterOptionsList = async () =>
  (filterOptionsList.value = await getfilterOptions());

const clearHistoryKeywords = () => {
  deleteHistoryKeywords();
  historyKeywords.value = [];
};

const cancelSearch = () => {
  keyword.value = "";
  showHistory.value = true;
  setKeywords();
};

const changeTab = (index: number) => {
  searchType.value = index;
  setSearchResult(true);
};
const search = () => setSearchResult(true);
const keywordSelect = (word: string) => {
  keyword.value = word;
  setSearchResult(true);
};

const setSearchResult = async (init = false) => {
  if (init) page = 0;
  const { list } = await getSearchResult(
    keyword.value,
    searchType.value + 1,
    sortValue.value + 1,
    filterValue.value,
    ++page
  );
  if (list.length) {
    switch (searchType.value) {
      case 0:
        liveList.value = init
          ? (list as LiveInfo[])
          : [...liveList.value, ...(list as LiveInfo[])];
        break;

      case 1:
        goodsList.value = init
          ? (list as GoodsInfo[])
          : [...goodsList.value, ...(list as GoodsInfo[])];
        break;

      case 2:
        videoList.value = init
          ? (list as VideoInfo[])
          : [...videoList.value, ...(list as VideoInfo[])];
        break;
    }
  } else finished.value = true;
  loading.value = false;
  finished.value = false;
};

const navBack = () => router.back();
</script>

<style lang="stylus" scoped>
.search-bar-wrap
  position: fixed
  top: 0
  left: 0
  width: 100%
  background: #fff
  z-index: 10
  .search-bar
    padding: 0 .10rem
    height: 44px
    display: flex
    align-items: center
    box-sizing: initial
    .back-wrap
      padding: .15rem
      display: flex
      align-items: center
      .back-icon
        width: .34rem
        height: .34rem
    .search-content
      width: 4.60rem
      display: flex
      align-items: center
      margin-right: .30rem
      height: .60rem
      background: #fff
      border-radius: .30rem
      border: .03rem solid #2B323F
      padding-left: .20rem
      position: relative
      .search-icon
        width: .30rem
        height: .30rem
      .search-input
        width: 2.42rem
        overflow: hidden
        span-overflow: ellipsis
        padding-left: .10rem
        height: 100%
        color: #333
        font-size: .28rem
      .cancel-btn
        display: flex
        align-items: center
        justify-content: center
        width: .60rem
        height: .60rem
      .search-btn
        position: absolute
        top: -0.01rem
        right: -0.01rem
        width: 1.00rem
        height: .58rem
        font-size: .28rem
        color: #FFE5BD
        line-height: .58rem
        span-align: center
        border-radius: .30rem
        background: linear-gradient(90deg, #434D5E 0%, #0F131A 100%)
  .tab-list
    display: flex
    background: #fff
    z-index: 2
    .tab-item
      display: flex
      align-items: center
      justify-content: centr
      flex: 1
      height: .5rem
      color: #999999
      font-size: .32rem
      &.active
        position relative
        color: #111111
        ::after
          position: absolute
          bottom: 0
          left: 50%
          transform: translateX(-50%)
          width: .24rem
          height: .08rem
          content: ''
          background: #DAB174
          border-radius: .04rem
.keywords-wrap
  padding: .10rem .30rem
  .title
    display: flex
    align-items: center
    justify-content space-between
    margin-bottom: .20rem
    color: #111111
    font-size: .28rem
    font-weight: 600
    .delete-icon
      width: .30rem
      height: .30rem
  .keyword
    display: inline-block
    margin: 0 .20rem .20rem 0
    padding: 0 .32rem
    height: auto
    color: #666
    font-size: .26rem
    font-weight: 600
    line-height: .60rem
    border-radius: .30rem
    background: #EFEFEF
.list-wrap
  margin-top: 1.20rem
  padding: .30rem .24rem 0
</style>
