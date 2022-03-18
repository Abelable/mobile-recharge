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
          <EmptyIllus
            v-if="!isInLogin || (isInLogin && !followedList.length)"
            :isInLogin="isInLogin"
            :noFocusLists="!followedList.length"
          />
          <FallFlow v-else :lists="followedList" />
        </div>
        <div class="recommend-lists-wrap" v-show="activeMenuIdx === 1">
          <div
            class="recommend-lists"
            v-for="(lists, index) in recommendLists"
            :key="index"
          >
            <FallFlow v-show="activeTagIdx === index" :lists="lists" />
          </div>
        </div>
      </List>
    </PullRefresh>
  </div>
</template>

<script setup lang="ts">
import { PullRefresh, List } from "vant";
import EmptyIllus from "@/components/EmptyIllus.vue";
import FallFlow from "./components/FallFlow.vue";

import { ref, reactive } from "vue";
import _ from "lodash";
import {
  SocialInfo,
  useTagList,
  useFollowedList,
  useRecommendList,
} from "./utils/api";

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
const activeTagIdx = ref(1);
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

// export default {

//   data() {
//     return {
//       isInLogin: false,
//       loading: false,
//       refreshing: false,
//       finished: false,
//       activeMenuIdx: 1,
//       cateLists: [],
//       activeCateIdx: 0,
//       focusLists: [],
//       recommendLists: [],
//     };
//   },

//   created() {
//     this.isInLogin = !!localStorage.getItem("token");
//   },

//   methods: {
//     selectMenu(index) {
//       document.documentElement.scrollTop = 0;
//       this.activeMenuIdx = index;
//       this.setLists(STATE_SWITCH_TAB);
//     },

//     selectCate(index) {
//       document.documentElement.scrollTop = 0;
//       this.activeCateIdx = index;
//       this.setLists(STATE_SWITCH_TAB);
//     },

//     onLoadMore() {
//       this.setLists(STATE_LOADMORE);
//     },

//     onRefresh() {
//       this.setLists(STATE_REFRESH);
//     },

//     async setLists(state) {
//       switch (state) {
//         case STATE_SWITCH_TAB:
//           if (this.activeMenuIdx === 0) {
//             if (!this.focusLists.length) this.setFocusLists(true);
//           } else {
//             if (!this.recommendLists[this.activeCateIdx].length)
//               this.setRecommendLists(true);
//           }
//           break;

//         case STATE_LOADMORE:
//           if (this.activeMenuIdx === 0) this.setFocusLists();
//           else {
//             if (!this.cateLists.length) {
//               await this.setCateLists();
//               this.setRecommendLists(true);
//             } else this.setRecommendLists();
//           }
//           break;

//         case STATE_REFRESH:
//           if (this.activeMenuIdx === 0) this.setFocusLists(true);
//           else this.setRecommendLists(true);
//           break;
//       }
//     },

//     async setCateLists() {
//       const { tag_list } = await socialService.getCateLists();
//       let recommendLists = new Array(tag_list.length + 1);
//       this.cateLists = [{ id: -1, tag_name: "全部" }, ...tag_list];
//       this.recommendLists = recommendLists.fill([]);
//     },

//     async setFocusLists(init = false) {
//       if (init) this.focusPage = 0;
//       let { list } =
//         (await socialService.getFocusSocialLists(++this.focusPage)) || {};
//       if (list) {
//         list.map((item) => {
//           item.is_follow = true;
//         });
//         this.focusLists = init ? list : [...this.focusLists, ...list];
//       }
//       if (this.loading) this.loading = false;
//       if (this.refreshing) this.refreshing = false;
//     },

//     async setRecommendLists(init = false) {
//       const cateId = this.cateLists[this.activeCateIdx].id;
//       if (init) {
//         this.recommendPage = 0;
//         this.rand = -1;
//       }
//       const { list, rand } = await socialService.getRecommendSocialLists(
//         ++this.recommendPage,
//         this.rand,
//         cateId
//       );
//       this.rand = rand;
//       this.$set(
//         this.recommendLists,
//         this.activeCateIdx,
//         init ? list : [...this.recommendLists[this.activeCateIdx], ...list]
//       );
//       if (this.loading) this.loading = false;
//       if (this.refreshing) this.refreshing = false;
//     },
//   },
// };
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
