<template>
  <div class="social-list" @click="navToSocialDetail">
    <img class="cover" :src="item.img[0]" />
    <div class="title">{{ item.title }}</div>
    <div class="info-wrap">
      <img class="avatar" :src="item.head_img" />
      <div class="name">{{ item.nickname }}</div>
      <div class="praise-btn" @click.stop="toggleStatus">
        <img
          class="praise-icon"
          v-if="praiseStatus"
          src="./images/praise-active.png"
        />
        <img class="praise-icon" v-else src="./images/praise.png" />
        <div class="praise-count">{{ praiseCount || "点赞" }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { useCheckLogin } from "@/utils";
import { togglePraiseStatus } from "@/api/common";
import { SocialInfo } from "../../utils/api";

const router = useRouter();
const checkLogin = useCheckLogin();

const props = defineProps<{ item: SocialInfo }>();

const praiseStatus = ref(false);
const praiseCount = ref(0);

watchEffect(() => {
  praiseStatus.value = !!props.item.is_like;
  praiseCount.value = props.item.like_num;
});

const navToSocialDetail = () => {
  router.push({
    path: "/social/detail",
    query: {
      id: props.item.id,
    },
  });
};

const toggleStatus = () => {
  checkLogin(() => {
    togglePraiseStatus(props.item.id);
    praiseCount.value = praiseStatus.value
      ? praiseCount.value > 0
        ? --praiseCount.value
        : 0
      : ++praiseCount.value;
    praiseStatus.value = !praiseStatus.value;
  });
};
</script>

<style lang="stylus" scoped>
.social-list
  margin-bottom .40rem
  width 3.40rem
  .cover
    width 100%
    max-height 6.00rem
    border-radius .12rem
  .title
    margin-top .10rem
    max-height .78rem
    color #333
    font-size .28rem
    font-weight bold
    line-height .36rem
    overflow hidden
    white-space normal
    text-overflow ellipsis
    display -webkit-box
    -webkit-line-clamp 2
    -webkit-box-orient vertical
  .info-wrap
    display flex
    align-items center
    margin-top .18rem
    .avatar
      margin-right .10rem
      width .40rem
      height .40rem
      border-radius 50%
      background-image url('https://img.ubo.vip/mp/default-ubo-icon.png')
      background-size 100% 100%
    .name
      flex 1
      color #999
      font-size .24rem
      overflow hidden
      text-overflow ellipsis
      white-space nowrap
    .praise-btn
      display flex
      align-items center
      padding 0 .13rem
      height .46rem
      border-radius .24rem
      border .01rem solid #ccc
      .praise-icon
        margin-right .10rem
        width .28rem
        height .28rem
      .praise-count
        color #999
        font-size .24rem
</style>
