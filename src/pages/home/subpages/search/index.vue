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
        <input
          class="search-input"
          v-model="keyword"
          confirm-type="search"
          bindconfirm="search"
        />
        <div class="cancel-btn" @click="cancelSearch" v-if="keyword">
          <img
            style="width: 0.32rem; height: 0.32rem"
            src="https://img.ubo.vip/mp/search/clear-search.png"
          />
        </div>
        <div class="search-btn" @click="search">搜索</div>
      </div>
    </div>
    <div v-if="!showHistory">
      <div class="tabs-wrap">
        <div
          class="tabs-list"
          :class="{ active: searchType === index }"
          v-for="(item, index) in tabList"
          :key="index"
          @click="changeTab(index)"
        >
          <div>{{ item }}</div>
          <div class="tabs-line-active" v-if="searchType === index"></div>
        </div>
      </div>

      <div class="classify-wrap">
        <div class="all-sort" data-index="0" @click="allSortClassify">
          <div :class="{'sort-active': sortIndex === 0 }}">
            {{ allSortText }}
          </div>
          <img
            :class="{ 'down-icon': isAllSort, 'up-icon': !isAllSort }"
            src="{{isAllSort ? 'https://img.ubo.vip/mp/search/sort-down.png' : 'https://img.ubo.vip/mp/search/sort-up.png'}}"
          />
        </div>
        <div class="all-sort" data-index="1" @click="allSortClassify">
          <div :class="{ 'sort-active': sortIndex === 1 }">
            {{ typeSortText }}
          </div>
          <img
            :class="{ 'down-icon': isAllSort, 'up-icon': !isAllSort }"
            :src="
              isTypeSort
                ? 'https://img.ubo.vip/mp/search/sort-down.png'
                : 'https://img.ubo.vip/mp/search/sort-up.png'
            "
          />
        </div>
      </div>

      <div class="all-down-wrap" v-if="!isAllSort">
        <div
          class="all-down-list"
          :class="{ 'select-down-active': selectAllIndex === index }"
          v-for="(item, index) in allMenuList"
          :key="index"
          @click="selectAllItem(item, index)"
        >
          {{ item }}
        </div>
      </div>

      <div class="all-down-wrap type-down-wrap" v-if="!isTypeSort">
        <div
          class="type-down-list"
          :class="{ 'select-down-active': selectTypeIndex === index }"
          v-for="(item, index) in typeMenuList"
          :key="index"
          wx:for="{{typeMenuList}}"
          wx:key="index"
          item="item"
          @click="selectTypeItem(item, index)"
        >
          {{ item.name || item.cate_name || item.tag_name }}
        </div>
      </div>
    </div>
  </div>

  <div class="keywords-wrap" v-if="showHistory">
    <div class="history-keywords-wrap">
      <div class="title-wrap" v-if="historyKeywords.length">
        <span class="title">最近搜索</span>
        <img
          class="delete-icon"
          src="https://img.ubo.vip/mp/selection/search/del-history.png"
          bindtap="deleteHistory"
        />
      </div>
      <div class="keywords-list-wrap">
        <div
          class="keywords-list"
          v-for="(item, index) in historyKeywords"
          :key="index"
          @click="keywordSelect(item.word)"
        >
          {{ item.word }}
        </div>
      </div>
    </div>
    <Swipe class="banner" :autoplay="3000" indicator-color="white">
      <SwipeItem v-for="(item, index) in banner" :key="index">
        <img
          class="banner-img"
          @click="adLink(item.is_belong, item.ad_link)"
          :src="item.ad_code"
        />
      </SwipeItem>
    </Swipe>
    <div class="hot-keywords-wrap">
      <div class="title-wrap">
        <span class="title">热搜</span>
      </div>
      <div class="keywords-list-wrap">
        <div
          class="keywords-list"
          v-for="(item, index) in hotKeywords"
          :key="index"
          @click="keywordSelect(item.word)"
        >
          {{ item.word }}
        </div>
      </div>
    </div>
  </div>
  <div>
    <div class="media-list-wrap" v-if="!showHistory && searchType === 0">
      <LiveItem
        v-for="(item, index) in liveList"
        :key="index"
        item="{{item}}"
      />
      <div class="no-data" v-if="!liveList.length">没有找到相关直播</div>
    </div>

    <div class="goods-list-wrap" v-if="!showHistory && searchType === 1">
      <GoodsList list="goodsList" />
      <div class="no-data" v-if="!goodsList.length">没有找到相关的商品</div>
    </div>

    <div class="media-list-wrap" v-if="!showHistory && searchType === 2">
      <VideoItem v-for="(item, index) in videoList" :key="index" :item="item" />
      <div class="no-data" v-if="!videoList.length">没有找到相关的短视频</div>
    </div>

    <div class="shadow" v-if="!isAllSort || !isTypeSort"></div>
  </div>
</template>

<script setup lang="ts">
import { Swipe, SwipeItem } from "vant";
import LiveItem from "@/components/LiveItem.vue";
import VideoItem from "@/components/VideoItem.vue";
import GoodsList from "@/components/GoodsList.vue";

import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAdLink } from "@/utils/index";

const router = useRouter();
const adLink = useAdLink();

const tabList = ["直播", "商品", "短视频"];
let page = 0;
let categoryId = "";

const searchType = ref(0);
const banner = ref([]);
const allMenuList = ref([]);
const typeMenuList = ref([]);
const selectAllIndex = ref(0);
const selectTypeIndex = ref(0);
const allSortText = ref("综合");
const typeSortText = ref("分类");
const hotKeywords = ref([]);
const historyKeywords = ref([]);
const showHistory = ref(false);
const keyword = ref("");
const liveList = ref([]);
const goodsList = ref([]);
const videoList = ref([]);
const isAllSort = ref(false);
const isTypeSort = ref(false);
const sortIndex = ref(0);

const navBack = () => router.back();
const cancelSearch = () => {};
const search = () => {};
const changeTab = (index: number) => {};
const selectAllItem = (item: any, index: number) => {};
const selectTypeItem = (item: any, index: number) => {};
const keywordSelect = (work: string) => {};
const allSortClassify = () => {};
const allSortClassify = () => {};
const allSortClassify = () => {};
const allSortClassify = () => {};
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
  .banner
    height 3.6rem
    .banner-img
      width 100%
      height 100%
      fit-content cover
.hot-keywords-wrap, .history-keywords-wrap
  padding: .10rem .30rem
  .title-wrap
    display: flex
    align-items: center
    .title
      flex: 1
      color: #111111
      font-size: .28rem
      font-weight: 600
      margin-bottom: .20rem
    .delete-icon
      width: .30rem
      height: .30rem
.keywords-list
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
.tabs-wrap
  display: flex
  justify-content: space-between
  padding:.22rem .84rem .20rem .93rem
  font-size: .32rem
  background-color: #fff
  z-index: 2
  .tabs-list
    color:#999999
    .active
      color: #111111
      display: flex
      flex-direction: column
      align-items: center
  .tabs-line-active
    margin-top:. 7rem
    width: .24rem
    height: .08rem
    background: #DAB174
    border-radius: .04rem
.classify-wrap
  display: flex
  justify-content: space-between
  font-size: .32rem
  background-color: #fff
  z-index: 2
  padding: 0 1.24rem .14rem 1.60rem
  color: #999999
  font-size: .28rem
.all-sort
  display: flex
  align-items: center
.down-icon
  margin-left: .05rem
  width: .32rem
  height: .32rem
.up-icon
  margin-left: .05rem
  width: .32rem
  height: .32rem
.sort-active
  color: #111111
.all-down-wrap
  border-top: 1px solid #F5F5F5
.all-down-list
  line-height: .78rem
  font-size: .28rem
  color: #666666
  padding-left: .32rem
.type-down-wrap
  display: flex
  flex-wrap: wrap
  max-height: 4.80rem
  overflow-y: scroll
.type-down-list
  width: 50%
  padding-left: .32rem
  line-height: .78rem
  font-size: .28rem
  color: #666666
  box-sizing: border-box
.all-down-wrap .select-down-active
  background: #F5F5F5
  color: #111111
.media-list-wrap
  margin-top: 1.20rem
  padding-top: .30rem
  padding-left: .24rem
.media-list
  display: inline-block
  margin-right: .20rem
.media-list:nth-child(2n)
  margin-right: 0
.goods-list-wrap
  margin-top: 1.20rem
  padding: .30rem .24rem 0
.no-data
  margin-top: 4.00rem
  color: #666
  font-size: .28rem
  span-align: center
.shadow
  position: fixed
  top: 0
  right: 0
  left: 0
  bottom: 0
  background-color:rgba(0, 0, 0, 0.4)
</style>
