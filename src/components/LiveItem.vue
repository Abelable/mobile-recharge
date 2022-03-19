<template>
  <div
    class="live-item"
    :style="{ backgroundImage: `url(${item.cover})` }"
    @click="navToLiveRoom"
  >
    <div class="status-wrap">
      <div class="status" :class="liveStatus">
        <img
          v-if="liveStatus === 'live'"
          style="width: 0.18rem; height: 0.24rem"
          src="https://img.ubo.vip/mp/i-media-list/live_status.gif"
        />
        <span v-else>{{ liveStatus === "video" ? "回放" : "预告" }}</span>
      </div>
      <div class="start-time" v-if="liveStatus === 'notice'">
        {{ dayjs(item?.start_time).format("MM月DD日HH:mm开始") }}
      </div>
      <div class="audience-num" v-else>{{ audienceNum }}观看</div>
    </div>

    <div class="info-wrap">
      <div class="title">{{ item?.title }}</div>
      <div class="info">
        <img class="anchor-avatar" :src="item?.userPortrait" />
        <div class="anchor-name-wrap">
          <div class="anchor-name">{{ item?.userName }}</div>
          <div class="location-wrap" v-if="item?.distance">
            <img
              class="location-icon"
              src="https://img.ubo.vip/mp/i-media-list/location-icon.png"
            />
            <span>距离{{ formattedDistance }}</span>
          </div>
        </div>
        <div class="praise-wrap" v-if="liveStatus !== 'notice'">
          <img
            class="praise-icon"
            src="https://img.ubo.vip/mp/i-media-list/live-like.png"
          />
          <span>{{ praiseNum }}</span>
        </div>
        <div
          class="notice-btn"
          :class="{ active: previewDestine === '0' }"
          v-if="liveStatus === 'notice'"
          @click.stop="toggleSubscribe"
        >
          {{ previewDestine === "0" ? "点击预约" : "取消预约" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed, toRef } from "vue";
import dayjs from "dayjs";
import { useRouter } from "vue-router";
import { toggleSubscribeAnchor } from "@/api/common";
import { LiveInfo } from "../views/HomeView/utils/api";

const router = useRouter();

const props = defineProps<{ item: LiveInfo }>();

const previewDestine = toRef(props.item, "previewDestine");

const liveStatus = computed(() =>
  props.item.is_stopped === "1"
    ? "video"
    : props.item.start_time === "0"
    ? "live"
    : "notice"
);
const audienceNum = computed(() =>
  Number(props.item.memberNum) > 100000
    ? `${(Number(props.item.memberNum) / 10000).toFixed(1)}w`
    : props.item.memberNum
);
const praiseNum = computed(() =>
  Number(props.item.praise) > 100000
    ? `${(Number(props.item.praise) / 10000).toFixed(1)}w`
    : props.item.praise
);
const formattedDistance = computed(() =>
  Number(props.item.distance) < 0.1
    ? "<100m"
    : Number(props.item.distance) < 1
    ? `${(Number(props.item.distance) * 1000).toFixed(0)}m`
    : `${Number(props.item.distance).toFixed(1)}km`
);

const navToLiveRoom = () =>
  router.push({ path: "/live", query: { id: props.item.id } });

const toggleSubscribe = () => {
  toggleSubscribeAnchor(previewDestine.value === "0" ? 1 : 0, props.item.id);
  previewDestine.value = previewDestine.value === "0" ? "1" : "0";
};
</script>

<style lang="stylus" scoped>
.live-item
  position relative
  margin-bottom .18rem
  width 3.42rem
  height 5.20rem
  font-size 0
  border-radius .12rem
  overflow hidden
  box-shadow 0 0 .02rem 0 rgba(0, 0, 0, 0.1)
  background-size cover
  background-position center
  background-repeat no-repeat
  .status-wrap
    position absolute
    top .16rem
    left .16rem
    display flex
    align-items center
    color #fff
    font-size .20rem
    line-height 1
    border-radius .17rem
    background rgba(0, 0, 0, 0.3)
    .status
      display flex
      align-items center
      justify-content center
      height .34rem
      border-radius .18rem
      &.live
        width .34rem
        background linear-gradient(121deg, #FF7F6B 0%, #E63D1C 100%)
      &.video
        width .60rem
        background linear-gradient(90deg, #849CB8 0%, #6C80A8 100%)
      &.notice
        width .60rem
        background linear-gradient(90deg, #1895F5 0%, #097FE6 100%)
    .audience-num, .start-time
      padding 0 .10rem
  .info-wrap
    position absolute
    bottom 0
    padding .16rem
    width 100%
    border-radius 0 0 .12rem .12rem
    background linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.6) 100%)
    .title
      color #fff
      font-size .28rem
      font-weight 500
      overflow hidden
      span-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 1
      -webkit-box-orient vertical
    .info
      display  flex
      align-items  center
      margin-top .08rem
      .anchor-avatar
        margin-right .12rem
        width .44rem
        height .44rem
        border-radius 50%
        background-image url('https://img.ubo.vip/mp/default-ubo-icon.png')
        background-repeat no-repeat
        background-size 100% 100%
      .anchor-name-wrap
        flex 1
        overflow hidden
        .anchor-name
          color #fff
          font-size .20rem
          font-weight 500
          line-height 1
          white-space nowrap
          overflow hidden
          span-overflow ellipsis
        .location-wrap
          display flex
          align-items center
          margin-top .04rem
          color #fff
          font-size .18rem
          line-height 1
        .location-icon
          margin-right .03rem
          width .18rem
          height .18rem
      .praise-wrap
        display flex
        align-items center
        margin-left .12rem
        color #fff
        font-size .18rem
        font-weight 500
        line-height 1
        .praise-icon
          margin-right .06rem
          width .25rem
          height .25rem
          border-radius .13rem
      .notice-btn
        margin-left .06rem
        padding 0 .15rem
        height .44rem
        color #666
        font-size .20rem
        line-height .44rem
        border-radius .12rem
        background #E6E6E6
        &.active
          color #0F131A
          background linear-gradient(270deg, #FFD699 0%, #FFE5BD 100%)
</style>
