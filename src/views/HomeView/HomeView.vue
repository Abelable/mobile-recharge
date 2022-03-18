<template>
  <div class="navigation-bar">
    <div class="menu-tabs-wrap">
      <img
        class="sign-img"
        src="https://img.ubo.vip/mp/index/index-sign.png"
        @click="signIn"
      />
      <ul class="menu-tabs">
        <li
          v-for="(item, index) in ['关注', '精选', '附近']"
          :key="index"
          class="menu-tab"
          :class="{ active: activeMenuIdx === index }"
          @click="switchMenu(index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="search-wrap">
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
  </div>
  <PullRefresh class="container" v-model="refreshing" @refresh="onRefresh">
    <List
      class="content-wrap"
      v-model="loading"
      :finished="finished"
      :finished-text="
        activeMenuIdx === 0 && emptyIllusVisible ? '' : '没有更多了'
      "
      @load="onLoadMore"
    >
      <div class="foucs-list-wrap" v-show="activeMenuIdx === 0">
        <div class="anchor-list-wrap">
          <p class="desc">大家都在看</p>
          <div class="anchor-list">
            <AnchorList
              v-for="(item, index) in anchorList"
              :key="index"
              :item="item"
            />
          </div>
        </div>
        <EmptyIllus
          style="margin-top: 1rem"
          v-if="emptyIllusVisible"
          :isInLogin="isInLogin"
        />
        <template v-else>
          <FallFlow :list="followedMediaList" />
        </template>
      </div>
      <div class="selected-list-wrap" v-show="activeMenuIdx === 1">
        <img class="ad-illus" v-if="adIllus" :src="adIllus" />
        <FallFlow :list="recommendMediaList">
          <template v-slot:banner v-if="banner.length">
            <Swipe class="banner" :autoplay="3000" indicator-color="white">
              <SwipeItem v-for="(item, index) in banner" :key="index">
                <img
                  class="banner-img"
                  @click="adLink(item.is_belong, item.ad_link)"
                  :src="item.ad_code"
                />
              </SwipeItem>
            </Swipe>
          </template>
          <template v-slot:tiles>
            <img
              class="tiles"
              v-for="(item, index) in tilesLists"
              :key="index"
              :src="item.ad_code"
              @click="adLink(item.is_belong, item.ad_link)"
            />
          </template>
        </FallFlow>
      </div>
      <div class="nearby-list-wrap" v-show="activeMenuIdx === 2">
        <FallFlow v-if="locationInfo" :list="nearbyMediaList" />
        <template v-else>
          <LocationIllus @setLocationInfo="setLocationInfo" />
          <SplitLine title="好物推荐" />
          <FallFlow :list="recommendGoodsList" />
        </template>
      </div>
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
// 引入组件
import { PullRefresh, List, Swipe, SwipeItem } from "vant";
import EmptyIllus from "@/components/EmptyIllus.vue";
import SplitLine from "@/components/SplitLine.vue";
import FallFlow from "./components/FallFlow.vue";
import LocationIllus from "./components/LocationIllus.vue";
import AnchorList from "./components/AnchorList.vue";

// 引入方法
import { onMounted, ref, watchEffect, computed } from "vue";
import { useRouter } from "vue-router";
import _ from "lodash";
import { useAdLink, webviewUrl } from "@/utils/index";
import {
  useLocationInfo,
  useAdInfo,
  useAnchorList,
  useFollowedMediaList,
  useRecommendMediaList,
  useNearbyMediaList,
  useRecommendGoodsList,
} from "./utils/api";

// ts
enum State {
  switch_menu,
  refresh,
  loadmore,
}

// 普通常量
const isInLogin = !!localStorage.getItem("token");

// 响应式数据
const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const activeMenuIdx = ref(1);

// composition API
const router = useRouter();
const adLink = useAdLink();
const { locationInfo, setLocationInfo } = useLocationInfo();
const { anchorList, setAnchorList } = useAnchorList();
const {
  followedMediaList,
  setFollowedMediaList,
  isLoading: loadingOfFollowedMediaList,
  isFinished: finishedOfFollowedMediaList,
  isRefreshing: refreshingOfFollowedMediaList,
} = useFollowedMediaList();
const { adIllus, banner, tilesLists, setAdInfo } = useAdInfo();
const {
  recommendMediaList,
  setRecommendMediaList,
  isLoading: loadingOfRecommendMediaList,
  isFinished: finishedOfRecommendMediaList,
  isRefreshing: refreshingOfRecommendMediaList,
} = useRecommendMediaList();
const {
  nearbyMediaList,
  setNearbyMediaList,
  isLoading: loadingOfNearbyMediaList,
  isFinished: finishedOfNearbyMediaList,
  isRefreshing: refreshingOfNearbyMediaList,
} = useNearbyMediaList();
const {
  recommendGoodsList,
  setRecommendGoodsList,
  isLoading: loadingOfRecommendGoodsList,
} = useRecommendGoodsList();

// 计算属性
const emptyIllusVisible = computed(
  () => !isInLogin || (isInLogin && !followedMediaList.value.length)
);

// 数据监听
watchEffect(() => {
  switch (activeMenuIdx.value) {
    case 0:
      loading.value = loadingOfFollowedMediaList.value;
      finished.value = finishedOfFollowedMediaList.value;
      refreshing.value = refreshingOfFollowedMediaList.value;
      break;

    case 1:
      loading.value = loadingOfRecommendMediaList.value;
      finished.value = finishedOfRecommendMediaList.value;
      refreshing.value = refreshingOfRecommendMediaList.value;
      break;

    case 2:
      if (locationInfo.value) {
        loading.value = loadingOfNearbyMediaList.value;
        finished.value = finishedOfNearbyMediaList.value;
        refreshing.value = refreshingOfNearbyMediaList.value;
      } else {
        loading.value = loadingOfRecommendGoodsList.value;
        finished.value = loadingOfRecommendGoodsList.value;
        refreshing.value = loadingOfRecommendGoodsList.value;
      }
      break;
  }
});

// 生命周期
onMounted(() => {
  setLocationInfo();
});

// 用户交互
const switchMenu = (index: number) => {
  if (activeMenuIdx.value !== index) {
    document.documentElement.scrollTop = 0;
    activeMenuIdx.value = index;
    setList(State.switch_menu);
  }
};
const onLoadMore = _.debounce(() => setList(State.loadmore), 200);
const onRefresh = () => setList(State.refresh);

// 具体方法
const setList = async (state: State) => {
  switch (state) {
    case State.switch_menu:
      switch (activeMenuIdx.value) {
        case 0:
          if (!anchorList.value.length) setAnchorList();
          if (!followedMediaList.value.length) setFollowedMediaList(true);
          break;

        case 1:
          if (!banner.value.length) await setAdInfo();
          if (!recommendMediaList.value.length) setRecommendMediaList(true);
          break;

        case 2:
          if (locationInfo.value) {
            if (!nearbyMediaList.value.length)
              setNearbyMediaList(locationInfo.value, true);
          } else {
            if (!recommendGoodsList.value.length) setRecommendGoodsList();
          }
          break;
      }
      break;

    case State.refresh:
      switch (activeMenuIdx.value) {
        case 0:
          setAnchorList();
          setFollowedMediaList(true);
          break;

        case 1:
          await setAdInfo();
          setRecommendMediaList(true);
          break;

        case 2:
          if (locationInfo.value) setNearbyMediaList(locationInfo.value, true);
          else setRecommendGoodsList();
          break;
      }
      break;

    case State.loadmore:
      switch (activeMenuIdx.value) {
        case 0:
          setFollowedMediaList();
          break;

        case 1:
          if (!banner.value.length) await setAdInfo();
          setRecommendMediaList(!recommendMediaList.value.length);
          break;

        case 2:
          if (locationInfo.value)
            setNearbyMediaList(
              locationInfo.value,
              !nearbyMediaList.value.length
            );
          break;
      }
      break;
  }
};

const signIn = () =>
  router.push({
    path: "/webview",
    query: {
      title: "签到",
      url: `${webviewUrl}/sign-in/dist/index.html#/`,
    },
  });
const navToSearch = () => router.push("/search");
const navToCart = () => router.push("/mall/cart");
</script>

<style lang="stylus" scoped>
.navigation-bar
  position fixed
  top 0
  width 100%
  background linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 9%, #F4F5F5 100%)
  z-index 10
  .menu-tabs-wrap
    position relative
    display flex
    align-items center
    justify-content center
    height .88rem
    .sign-img
      position absolute
      top 50%
      left .32rem
      transform translateY(-50%)
      width .48rem
      height .48rem
    .menu-tabs
      display flex
      justify-content space-between
      width 2.8rem
      height .8rem
      .menu-tab
        position relative
        color #999
        font-size .32rem
        line-height .8rem
        -webkit-tap-highlight-color transparent
        &.active
          color #111
          font-size .36rem
          font-weight 500
          &::after
            position absolute
            left 50%
            bottom .1rem
            transform translateX(-50%)
            width .24rem
            height .08rem
            content ''
            border-radius .04rem
            background #DAB174
  .search-wrap
    display flex
    align-items center
    margin-top .1rem
    padding 0 .24rem
    .search
      position relative
      display flex
      align-items center
      padding-left .2rem
      flex 1
      height .68rem
      border-radius .68rem
      border .02rem solid #2B323F
      .placeholder
        margin-left .1rem
        color #999999
        font-size .28rem
      .search-btn
        position absolute
        right 0
        width 1.3rem
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
.container
  padding-top 1.92rem
  padding-bottom 1.04rem
  .content-wrap
    padding 0 .24rem
    min-height calc(100vh - 1.68rem)
    .anchor-list-wrap
      margin-bottom .20rem
      padding .24rem
      height 2.60rem
      border-radius .12rem
      background #fff
      box-shadow 0 0 .20rem 0 rgba(67, 77, 94, 0.1)
      .desc
        color #666
        font-size .28rem
        line-height .40rem
      .anchor-list
        margin-top .2rem
        display flex
        flex-wrap nowrap
        overflow-x scroll
        height 1.60rem
    .ad-illus
      display block
      margin-bottom .18rem
      width 100%
      border-radius .12rem
    .banner
      margin-bottom .18rem
      width 3.42rem
      height 5rem
      border-radius .12rem
      .banner-img
        width 100%
        height 100%
        fit-content cover
    .tiles
      display block
      margin-bottom .18rem
      width 3.42rem
      height 2.6rem
      border-radius .12rem
      fit-content cover
</style>
