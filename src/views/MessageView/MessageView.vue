<template>
  <div>
    <div class="news-bar-wrap">
      <div class="news-bar">
        <img
          class="icon"
          src="https://img.ubo.vip/mp/news/order-notice-icon.png"
        />
        <p class="desc">订单交易</p>
        <div class="news-count">2</div>
      </div>
      <div class="news-bar">
        <img
          class="icon"
          src="https://img.ubo.vip/mp/news/team-notice-icon.png"
        />
        <p class="desc">团队消息</p>
        <div class="news-count">2</div>
      </div>
      <div class="news-bar">
        <img
          class="icon"
          src="https://img.ubo.vip/mp/news/interact-notice-icon.png"
        />
        <p class="desc">互动消息</p>
        <div class="news-count">2</div>
      </div>
    </div>

    <div class="system-news-part">
      <NewsList
        v-for="(item, index) in systermNewsLists"
        :key="index"
        :item="item"
      />
    </div>

    <div class="private-chat-part">
      <NewsList
        v-for="(item, index) in contactList"
        :key="index"
        :item="item"
      />
    </div>

    <SplitLine title="好物推荐" />
    <div class="recommend-goods-wrap">
      <RecommendGoodsList :list="recommendGoodsList" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SplitLine from "@/components/SplitLine.vue";
import RecommendGoodsList from "@/components/RecommendGoodsList.vue";
import NewsList from "./components/NewsList.vue";

import { ref, onMounted } from "vue";
import { useRecommendGoodsList } from "@/api/common";
import { MessageInfo } from "./utils/api";

const { recommendGoodsList, setRecommendGoodsList } = useRecommendGoodsList();

const systermNewsLists = ref<MessageInfo[]>([]);
const contactList = ref<MessageInfo[]>([]);

onMounted(() => {
  systermNewsLists.value = [
    {
      icon: "https://img.ubo.vip/mp/news/public-notice-icon.png",
      title: "公告",
      time: "2021-02-12 21:00:02",
      content: "睡觉睡觉山山水水",
      newsCount: 2,
    },
    {
      icon: "https://img.ubo.vip/mp/news/organization-notice-icon.png",
      title: "站内信",
      time: "2021-02-12 21:00:02",
      content: "睡觉睡觉山山水水",
      newsCount: 2,
    },
    {
      icon: "https://img.ubo.vip/mp/news/customer-notice-icon.png",
      title: "官方客服",
      time: "2021-02-12 21:00:02",
      content: "睡觉睡觉山山水水",
      newsCount: 2,
    },
  ];
  setRecommendGoodsList(2);
});
</script>

<style lang="stylus" scoped>
.news-bar-wrap
  display flex
  align-items center
  justify-content space-around
  padding .44rem 0 .36rem
  background #fff
  .news-bar
    text-align center
    font-size 0
    .icon
      width .96rem
      height .96rem
    .desc
      color #333
      font-size .28rem
    .news-count
      position absolute
      top 0
      right 0
      padding 0 .10rem
      height .34rem
      color #fff
      font-size .24rem
      line-height .34rem
      background #FE4019
      border-radius .17rem
.system-news-part, .private-chat-part
  margin-top .18rem
.recommend-goods-wrap
  padding 0 .24rem 1.04rem
</style>
