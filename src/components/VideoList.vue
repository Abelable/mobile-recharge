<template>
  <div
    class="video-list"
    :style="{ backgroundImage: `url(${item.cover_url})` }"
    @click="navToShortVideoDetail"
  >
    <div class="audience-count">
      <img
        class="watch-icon"
        src="https://img.ubo.vip/mp/i-media-list/short-video-img.png"
      />
      <span>{{ audienceNum }}</span>
    </div>

    <div class="praise-count">
      <img
        class="praice-icon"
        src="https://img.ubo.vip/mp/i-media-list/video-praise-icon.png"
      />
      <span>{{ praiseNum }}</span>
    </div>

    <div class="info-wrap">
      <div class="author-info">
        <img class="avatar" :src="item.head_img" />
        <span class="name">{{ item.nickname }}</span>
        <div class="location-wrap" v-if="item.distance">
          <img
            class="location-icon"
            src="https://img.ubo.vip/mp/i-media-list/location-icon.png"
          />
          <span>距离{{ formattedDistance }}</span>
        </div>
      </div>
      <div class="title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { useRouter } from "vue-router";
import { VideoInfo } from "../views/HomeView/utils/api";

const props = defineProps<{ item: VideoInfo }>();

const router = useRouter();

const audienceNum = computed(() =>
  props.item.view_num > 100000
    ? `${(props.item.view_num / 10000).toFixed(1)}w`
    : props.item.view_num
);
const praiseNum = computed(() =>
  props.item.like_num > 100000
    ? `${(props.item.like_num / 10000).toFixed(1)}w`
    : props.item.like_num
);
const formattedDistance = computed(() =>
  props.item.distance < 0.1
    ? "<100m"
    : props.item.distance < 1
    ? `${(props.item.distance * 1000).toFixed(0)}m`
    : `${props.item.distance.toFixed(1)}km`
);

const navToShortVideoDetail = () =>
  router.push({ path: "/video", query: { id: props.item.id } });
</script>

<style lang="stylus" scoped>
.video-list
  position relative
  margin-bottom .18rem
  width 3.42rem
  height 4.72rem
  font-size 0
  border-radius .12rem
  overflow hidden
  box-shadow 0 0 .02rem 0 rgba(0, 0, 0, 0.1)
  background-size cover
  background-position center
  background-repeat no-repeat
  .audience-count, .praise-count
    position absolute
    top .16rem
    display flex
    align-items center
    padding 0 .10rem
    height .34rem
    color #fff
    font-size .20rem
    line-height 1
    border-radius .17rem
    background rgba(0, 0, 0, 0.3)
  .audience-count
    left .16rem
    .watch-icon
      margin-right .08rem
      width .16rem
      height .18rem
  .praise-count
    right .16rem
    .praice-icon
      margin-right .08rem
      width .22rem
      height .20rem
  .info-wrap
    position absolute
    left 0
    bottom 0
    padding .16rem
    width 100%
    border-radius 0 0 .12rem .12rem
    background linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)
    .author-info
      display flex
      align-items center
      .avatar
        margin-right .05rem
        width .34rem
        height .34rem
        border-radius 50%
        background-image url('https://img.ubo.vip/mp/default-ubo-icon.png')
        background-repeat no-repeat
        background-size 100% 100%
      .name
        flex 1
        color #fff
        font-size .24rem
        font-weight 500
        line-height 1
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
      .location-wrap
        display flex
        align-items center
        color #fff
        font-size .18rem
        line-height 1
        .location-icon
          margin-right .03rem
          width .18rem
          height .18rem
    .title
      margin-top .08rem
      color #fff
      font-size .20rem
      font-weight 500
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
</style>
