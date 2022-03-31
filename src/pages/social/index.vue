<template>
  <div class="container">
    <div class="nav-bar">
      <ul class="menu-wrap">
        <li
          v-for="(item, index) in ['关注', '推荐']"
          :key="index"
          class="menu-item"
          :class="{ active: activeMenuIdx === index }"
          @click="selectMenu(index)"
        >
          {{ item }}
        </li>
      </ul>
      <ul class="cate-lists" v-show="activeMenuIdx === 1">
        <li
          v-for="(item, index) in tagList"
          :key="index"
          class="cate-list"
          :class="{ active: activeTagIdx === index }"
          @click="selectTag(index)"
        >
          {{ item.tag_name }}
        </li>
      </ul>
    </div>

    <PullRefresh class="lists-wrap" v-model="refreshing" @refresh="onRefresh">
      <List v-model="loading" :finished="finished" @load="onLoadMore">
        <div class="focus-lists" v-show="activeMenuIdx === 0">
          <FollowEmptyIllus
            v-if="!isInLogin || (isInLogin && !followedList.length)"
            :isInLogin="isInLogin"
            :noFocusLists="!followedList.length"
          />
          <FallFlow v-else :list="followedList" />
        </div>
        <div class="recommend-lists-wrap" v-show="activeMenuIdx === 1">
          <div
            class="recommend-lists"
            v-for="(lists, index) in recommendLists"
            :key="index"
          >
            <FallFlow v-show="activeTagIdx === index" :list="lists" />
          </div>
        </div>
      </List>
    </PullRefresh>
  </div>
</template>

<script setup lang="ts">
import { PullRefresh, List } from "vant";
import FollowEmptyIllus from "@/components/FollowEmptyIllus.vue";
import FallFlow from "./components/FallFlow.vue";

import { ref, reactive, watchEffect } from "vue";
import _ from "lodash";
import { SocialInfo } from "./utils/api";
import { useFollowedList, useTagList, useRecommendList } from "./utils";

enum State {
  select_menu,
  refresh,
  loadmore,
}

const isInLogin = !!localStorage.getItem("token");

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const activeMenuIdx = ref(1);
const activeTagIdx = ref(0);
const recommendLists = reactive<SocialInfo[][]>([]);

const { tagList, setTagList } = useTagList();
const {
  followedList,
  setFollowedList,
  isLoading: loadingOfFollowedList,
  isFinished: finishedOfFollowedList,
  isRefreshing: refreshingOfFollowedList,
} = useFollowedList();
const {
  recommendList,
  setRecommendList,
  isLoading: loadingOfRecommendList,
  isFinished: finishedOfRecommendList,
  isRefreshing: refreshingOfRecommendList,
} = useRecommendList();

watchEffect(() => {
  switch (activeMenuIdx.value) {
    case 0:
      loading.value = loadingOfFollowedList.value;
      finished.value = finishedOfFollowedList.value;
      refreshing.value = refreshingOfFollowedList.value;
      break;

    case 1:
      loading.value = loadingOfRecommendList.value;
      finished.value = finishedOfRecommendList.value;
      refreshing.value = refreshingOfRecommendList.value;
      break;
  }
});

const selectMenu = (index: number) => {
  if (activeMenuIdx.value !== index) {
    document.documentElement.scrollTop = 0;
    activeMenuIdx.value = index;
    setList(State.select_menu);
  }
};
const selectTag = (index: number) => {
  if (activeTagIdx.value !== index) {
    document.documentElement.scrollTop = 0;
    activeTagIdx.value = index;
    setList(State.select_menu);
  }
};
const onLoadMore = _.debounce(() => setList(State.loadmore), 200);
const onRefresh = () => setList(State.refresh);

const setList = async (state: State) => {
  switch (state) {
    case State.select_menu:
      if (activeMenuIdx.value === 0) {
        if (!followedList.value.length) setFollowedList(true);
      } else {
        if (!recommendLists[activeTagIdx.value].length) setRecommendLists(true);
      }
      break;

    case State.loadmore:
      if (activeMenuIdx.value === 0) setFollowedList();
      else {
        if (!tagList.value.length) {
          await setTagList();
          for (let i = 0; i < tagList.value.length; i++) {
            recommendLists.push([]);
          }
          setRecommendLists(true);
        } else setRecommendLists();
      }
      break;

    case State.refresh:
      if (activeMenuIdx.value === 0) setFollowedList(true);
      else setRecommendLists(true);
      break;
  }
};

const setRecommendLists = async (init = false) => {
  const tagId = tagList.value[activeTagIdx.value].id;
  await setRecommendList(tagId, init);
  recommendLists[activeTagIdx.value] = init
    ? recommendList.value
    : [...recommendLists[activeTagIdx.value], ...recommendList.value];
};
</script>

<style lang="stylus" scoped>
.container
  background #fff
  .nav-bar
    position fixed
    top 0
    width 100%
    background #fff
    z-index 100
    .menu-wrap
      display flex
      align-items center
      justify-content center
      height .88rem
      .menu-item
        margin-right .26rem
        height .46rem
        color #999
        font-size .28rem
        line-height .46rem
        &.active
          position relative
          color #333
          font-size .32rem
          font-weight bold
          &::after
            position absolute
            bottom -0.1rem
            left 50%
            transform translateX(-50%)
            width .24rem
            height .08rem
            content ''
            background #DAB174
            border-radius .04rem
    .cate-lists
      display flex
      white-space nowrap
      padding 0 .24rem
      height .5rem
      overflow-x scroll
      .cate-list
        margin-right .44rem
        color #999
        font-size .28rem
        &.active
          color #111
  .lists-wrap
    padding 1rem .24rem
    min-height 100vh
    .recommend-lists-wrap
      padding-top .5rem
</style>
