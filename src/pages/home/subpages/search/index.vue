<template>
  <div class="search-bar-wrap">
    <div class="search-bar">
      <img
        class="back-icon"
        src="https://img.ubo.vip/mp/search/back.png"
        @click="navBack"
      />
      <div class="search-content">
        <img
          class="search-icon"
          src="https://img.ubo.vip/mp/index/search/index-search.png"
        />
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索直播间、商品、短视频"
        />
        <div class="cancel-btn" v-if="keyword" @click="cancelSearch">
          <img
            style="width: 0.32rem; height: 0.32rem"
            src="https://img.ubo.vip/mp/search/clear-search.png"
          />
        </div>
        <div class="search-btn" @click="search">搜索</div>
      </div>
    </div>
    <div v-show="!showHistory">
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
          v-model="sortValue"
          :options="sortOptionsList[searchType]"
        />
        <DropdownItem
          v-model="filterValue"
          :options="filterOptionsList[searchType]"
        />
      </DropdownMenu>
    </div>
  </div>

  <div class="keywords-wrap" v-show="showHistory">
    <div class="keywords-list">
      <div class="title" v-if="historyKeywords.length">
        <div>最近搜索</div>
        <img
          class="delete-icon"
          src="https://img.ubo.vip/mp/selection/search/del-history.png"
          @click="clearHistoryKeywords"
        />
      </div>
      <ul class="keywords">
        <li
          class="keyword"
          v-for="(item, index) in historyKeywords"
          :key="index"
          @click="keywordSelect(item.word)"
        >
          {{ item.word }}
        </li>
      </ul>
    </div>
    <div class="keywords-list">
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
      <LiveList v-show="searchType === 0" :list="liveList" />
      <GoodsList v-show="searchType === 1" :list="goodsList" />
      <VideoList v-show="searchType === 2" :list="videoList" />
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { DropdownMenu, DropdownItem, PullRefresh, List } from "vant";
import LiveList from "@/components/LiveList.vue";
import VideoList from "@/components/VideoList.vue";
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
  recordKeyword,
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
const showHistory = ref(true);
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
  const { recent_record_list } = await getHistoryKeywords();
  historyKeywords.value = recent_record_list;
  const { hot_search_list } = await getHotKeywords();
  hotKeywords.value = hot_search_list;
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
const search = () => {
  setSearchResult(true);
  recordKeyword(keyword.value);
};
const keywordSelect = (word: string) => {
  keyword.value = word;
  showHistory.value = false;
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
    display: flex
    align-items: center
    padding: 0 .10rem
    height: .88rem
    .back-icon
      padding: 0 .15rem
      width: .34rem
      height: .34rem
      box-sizing: initial
    .search-content
      position: relative
      display: flex
      align-items: center
      margin-right: .16rem
      flex: 1
      height: .60rem
      background: #fff
      border-radius: .30rem
      border: .03rem solid #2B323F
      .search-icon
        margin-left: .20rem
        margin-right: .10rem
        width: .30rem
        height: .30rem
      .search-input
        flex: 1
        color: #333
        font-size: .28rem
      .cancel-btn
        display: flex
        align-items: center
        justify-content: center
        width: .60rem
        height: .60rem
      .search-btn
        width: 1.00rem
        height: .58rem
        font-size: .28rem
        color: #FFE5BD
        line-height: .58rem
        text-align: center
        border-radius: .30rem
        background: linear-gradient(90deg, #434D5E 0%, #0F131A 100%)
  .tab-list
    display: flex
    background: #fff
    z-index: 2
    .tab-item
      display: flex
      align-items: center
      justify-content: center
      flex: 1
      height: 1rem
      color: #999999
      font-size: .32rem
      &.active
        position relative
        color: #111111
        &::after
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
  margin-top: 1.2rem
  .keywords-list
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
    .keywords
      display: flex
      flex-wrap: wrap
      .keyword
        margin: 0 .20rem .20rem 0
        padding: 0 .32rem
        height: .6rem
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
