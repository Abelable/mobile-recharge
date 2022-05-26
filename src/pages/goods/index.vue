<template>
  <div class="nav-bar">
    <div class="search-wrap">
      <img
        class="back-icon"
        src="https://img.ubo.vip/mp/search/back.png"
        @click="navBack"
      />
      <div class="search" @click="navToSearch">
        <img
          style="width: 14px; height: 14px"
          src="https://img.ubo.vip/mp/index/search/index-search.png"
        />
        <div class="placeholder">搜索直播间、商品、短视频</div>
        <div class="search-btn">搜索</div>
      </div>
      <div class="shop-cart" @click="navToCart">
        <img
          style="width: 27px; height: 27px"
          src="https://img.ubo.vip/mp/index/shop-cart.png"
        />
      </div>
    </div>
    <ul class="cate-tabs">
      <li
        v-for="(item, index) in cateTabs"
        :key="index"
        class="cate-tab"
        :class="{ active: activeTabIdx === index }"
        @click="selectCate(index)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>

  <PullRefresh class="container" v-model="refreshing" @refresh="onRefresh">
    <List v-model="loading" :finished="finished" @load="onLoadMore">
      <div v-if="activeTabIdx === 0">
        <div class="banner-wrap">
          <Swipe class="banner" :autoplay="3000" indicator-color="white">
            <SwipeItem v-for="(item, index) in bannerList" :key="index">
              <img
                class="banner-img"
                @click="adLink(item.is_belong, item.ad_link)"
                :src="item.ad_code"
              />
            </SwipeItem>
          </Swipe>
        </div>
        <ul class="sec-cate-tabs">
          <li
            v-for="(item, index) in secCateTabs"
            :key="index"
            class="sec-cate-tab"
            :class="{ active: secActiveTabIdx === index }"
            @click="selectSecCate(index)"
          >
            {{ item.cate_name }}
          </li>
        </ul>
        <div class="goods-wrap" v-show="secActiveTabIdx == 0">
          <GoodsItem
            v-for="(item, index) in cateLists[0]"
            :key="index"
            :item="item"
          />
        </div>
        <div class="goods-wrap" v-show="secActiveTabIdx !== 0">
          <FallFlow :list="secCateLists[secActiveTabIdx] || []" />
        </div>
      </div>

      <div v-else>
        <ul class="goods-cate">
          <li
            class="cate-item"
            v-for="(item, index) in cateTabs[activeTabIdx].isStretch
              ? cateTabs[activeTabIdx].get_parent_id.slice(0, 9)
              : cateTabs[activeTabIdx].get_parent_id"
            :key="index"
            @click="navToCate(item.id, item.name)"
          >
            <img style="width: 0.76rem; height: 0.76rem" :src="item.url" />
            <div>{{ item.name }}</div>
          </li>
          <li
            class="stretch-btn"
            v-show="cateTabs[activeTabIdx].get_parent_id.length > 10"
            @click="
              cateTabs[activeTabIdx].isStretch =
                !cateTabs[activeTabIdx].isStretch
            "
          >
            <img
              style="width: 0.76rem; height: 0.76rem"
              :src="`https://img.ubo.vip/mp/selection/${
                cateTabs[activeTabIdx].isStretch ? 'stretch' : 'shrinkage'
              }-icon.png`"
            />
            <div>
              {{ cateTabs[activeTabIdx].isStretch ? "展开全部" : "收起" }}
            </div>
          </li>
        </ul>
        <div class="goods-wrap">
          <FallFlow :list="cateLists[activeTabIdx] || []" />
        </div>
      </div>
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { PullRefresh, List, Swipe, SwipeItem } from "vant";
import GoodsItem from "./components/GoodsItem.vue";
import FallFlow from "./components/FallFlow.vue";

import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import _ from "lodash";
import { useAdLink } from "@/utils";
import { GoodsInfo } from "@/types";
import {
  CategoryInfo,
  SelectionInfo,
  BannerInfo,
  getCategoryList,
  getSeletionTab,
  getSeletionList,
  getSecgoodsList,
} from "./utils/api";

const router = useRouter();
const adLink = useAdLink();

interface CateTabInfo extends CategoryInfo {
  isStretch: boolean;
}

let catePageArr: number[];
let secCatePageArr: number[];

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const activeTabIdx = ref(0);
const secActiveTabIdx = ref(0);
const cateTabs: CateTabInfo[] = reactive([]);
const secCateTabs: SelectionInfo[] = reactive([
  { id: -99, cate_name: "今日有选" },
]);
const bannerList = ref<BannerInfo[]>([]);
const cateLists = reactive<GoodsInfo[][]>([]);
const secCateLists = reactive<GoodsInfo[][]>([]);

const onLoadMore = _.debounce(async () => {
  if (activeTabIdx.value === 0 && secActiveTabIdx.value !== 0)
    setSecCateLists();
  else {
    if (!cateTabs.length) {
      await setCateTabs();
      setSecCateTabs();
      setCateLists(true);
    } else setCateLists();
  }
}, 200);
const onRefresh = () => {
  if (activeTabIdx.value === 0 && secActiveTabIdx.value !== 0)
    setSecCateLists(true);
  else setCateLists(true);
};
const selectCate = (index: number) => {
  if (activeTabIdx.value !== index) {
    activeTabIdx.value = index;
    if (!cateLists[index]) setCateLists(true);
  }
};
const selectSecCate = (index: number) => {
  if (secActiveTabIdx.value !== index) {
    secActiveTabIdx.value = index;
    if (index !== 0 && !secCateLists[index]) setSecCateLists(true);
  }
};

const setCateTabs = async () => {
  cateTabs.push({ name: "热门", id: 0, isStretch: true, get_parent_id: [] });
  const list: CategoryInfo[] = await getCategoryList();
  list.forEach((item) => cateTabs.push({ isStretch: true, ...item }));
  catePageArr = Array(cateTabs.length).fill(0);
};
const setSecCateTabs = async () => {
  const { list = [] }: { list: SelectionInfo[] } = await getSeletionTab();
  list.forEach((item) => secCateTabs.push(item));
  secCatePageArr = Array(cateTabs.length).fill(0);
};
const setCateLists = async (init = false) => {
  if (init) catePageArr[activeTabIdx.value] = 0;
  const { banner = [], product = [] } = await getSeletionList(
    ++catePageArr[activeTabIdx.value],
    cateTabs[activeTabIdx.value].id
  );
  if (init && activeTabIdx.value === 0) bannerList.value = banner;
  if (product.length) {
    cateLists[activeTabIdx.value] = init
      ? product
      : [...cateLists[activeTabIdx.value], ...product];
  } else finished.value = true;
  loading.value = false;
  refreshing.value = false;
};
const setSecCateLists = async (init = false) => {
  if (init) secCatePageArr[secActiveTabIdx.value] = 0;
  const { product } = await getSecgoodsList(
    secCateTabs[secActiveTabIdx.value].id,
    ++secCatePageArr[secActiveTabIdx.value],
    10
  );
  if (product.length) {
    secCateLists[secActiveTabIdx.value] = init
      ? product
      : [...secCateLists[secActiveTabIdx.value], ...product];
  } else finished.value = true;
  loading.value = false;
  refreshing.value = false;
};

const navBack = () => router.back();
const navToSearch = () => router.push("/search");
const navToCart = () => router.push("/mall/cart");
const navToCate = (id: number, name: string) =>
  router.push({ path: "/mall/category_detail", query: { id, name } });
</script>

<style lang="stylus" scoped>
.nav-bar
  position fixed
  top 0
  width 100%
  background #fff
  box-shadow -0.3rem .1rem .52rem -0.24rem rgba(198,198,198,0.5)
  z-index 100
  .search-wrap
    display flex
    align-items center
    padding .2rem .24rem 0
    .back-icon
      margin-right .16rem
      width .34rem
      height .34rem
    .search
      position relative
      display flex
      align-items center
      padding-left .2rem
      flex 1
      height .68rem
      border-radius .68rem
      border 1px solid #2B323F
      .placeholder
        margin-left .1rem
        color #999
        font-size .28rem
        overflow hidden
        white-space nowrap
        text-overflow ellipsis
      .search-btn
        position absolute
        right 0
        width 65px
        color #FFE5BD
        font-size .28rem
        text-align center
        line-height .68rem
        background linear-gradient(90deg, #434D5E 0%, #0F131A 100%)
        border-radius .34rem
    .shop-cart
      display flex
      align-items center
      margin-left .16rem
      height .68rem
  .cate-tabs
    display flex
    flex-wrap nowrap
    padding 0 .16rem
    color #999
    overflow-x scroll
    .cate-tab
      position relative
      padding 0 .2rem
      height .8rem
      text-align center
      font-size .32rem
      line-height .9rem
      white-space nowrap
      &.active
        position relative
        color #111111
        font-size .36rem
        font-weight 500
        &::after
          position absolute
          left 50%
          bottom .1rem
          transform translateX(-50%)
          content ''
          width 80%
          height .08rem
          background rgba(255, 229, 189, 0.8)
          border-radius .05rem
.container
  padding-top 1.6rem
  .banner-wrap
    padding .3rem .24rem
    background-color #fff
    .banner
      height 2.4rem
      border-radius .12rem
      .banner-img
        width 100%
        height 100%
        fit-content cover
  .sec-cate-tabs
    display flex
    flex-wrap nowrap
    padding .24rem
    overflow-x scroll
    .sec-cate-tab
      margin-right .24rem
      color #999
      font-size .32rem
      white-space nowrap
      &.active
        color #000
        font-weight 500
  .goods-wrap
    padding 0 .24rem
  .goods-cate
    position relative
    margin-bottom .24rem
    padding .20rem
    background #fff
    .cate-item
      display inline-block
      margin .10rem
      width 1.20rem
      text-align center
      font-size .22rem
      color #666
    .stretch-btn
      position absolute
      right .40rem
      bottom .30rem
      width 1.20rem
      text-align center
      font-size .22rem
      color #666
</style>
