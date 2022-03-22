<template>
  <div class="live-item" @click="navToLive">
    <img class="room-cover" :src="item.lv_cover" />
    <div class="content">
      <div class="room-title">{{ item.lv_title }}</div>
      <div class="anchor-name">{{ item.user_name }}</div>
      <div class="room-data">
        <div class="audience-num">
          <img
            class="audience-num-icon"
            src="https://img.ubo.vip/mp/mine/track/audience-num-icon.png"
          />
          <span>{{ item.member_num }}</span>
        </div>
        <div class="praise-num">
          <img
            class="praise-icon"
            src="https://img.ubo.vip/mp/mine/track/praise-icon.png"
          />
          <span>{{ item.member_num }}</span>
        </div>
      </div>
      <div
        class="follow-btn"
        :class="{ active: !isFollow }"
        @click.stop="followAnchor"
      >
        {{ isFollow ? "已关注" : "+关注" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { LiveItemInfo } from "../utils/api";
import { useRouter } from "vue-router";
import { toRef } from "vue";

const router = useRouter();
const props = defineProps<{ item: LiveItemInfo }>();

const isFollow = toRef(props.item, "is_follow");

const navToLive = () =>
  router.push({
    path: "/live",
    query: { id: props.item.lv_room_id },
  });

const followAnchor = () => {
  if (!isFollow.value) isFollow.value = 1;
};
</script>

<style lang="stylus" scoped>
.live-item
  display: flex
  align-items: center
  padding: .30rem 0
  border-bottom: .01rem solid #CECECE
  &:last-child
    border-bottom: none
  .room-cover
    margin-right: .20rem
    width: 1.68rem
    height: 1.68rem
  .content
    position: relative
    display: flex
    flex-direction: column
    justify-content: space-between
    flex: 1
    height: 1.68rem
    .room-title
      font-size: .32rem
      color: #333
      font-weight: 500
    .anchor-name
      font-size: .28rem
      color: #999
    .room-data
      display: flex
      align-items: center
      font-size: .28rem
      color: #333
      .audience-num, .praise-num
        display: flex
        align-items: center
      .audience-num
        margin-right: .56rem
      .audience-num-icon
        margin-right: .12rem
        width: .22rem
        height: .28rem
      .praise-icon
        margin-right: .12rem
        width: .28rem
        height: .28rem
    .follow-btn
      position: absolute
      right: 0
      bottom: 0
      padding: 0 .20rem
      height: .36rem
      font-size: .20rem
      line-height: .34rem
      color: #999
      border-radius: .18rem
      border: .01rem solid #999
      &.active
        color: #ECC498
        border: .01rem solid #ECC498
</style>
