<template>
  <div class="record-item">
    <img class="icon" :src="item.cover" />
    <div class="content">
      <div class="title-wrap">
        <span class="title">{{ item.title }}</span>
        <span v-if="item.type === '2'">{{
          "(" + item.price + "x" + item.num + ")"
        }}</span>
      </div>
      <div class="detail">
        <div class="anchor-name" v-if="item.type === '2'">
          主播昵称：{{ item.anchor_name }}
        </div>
        <div class="time">
          {{ dayjs(item?.created_at).format("MM-DD HH:mm:ss") }}
        </div>
      </div>
    </div>
    <div class="amount-wrap">
      <span class="amount" :class="{ recharge: item.type === '1' }"
        >{{ item.type === "1" ? "+" + item.amount : item.amount }}
      </span>
      <img
        style="width: 0.16rem; height: 0.16rem"
        src="https://img.ubo.vip/mp/mine/gift-record/diamont.png"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import dayjs from "dayjs";
import { GiftRecordInfo } from "../utils/api";

defineProps<{ item: GiftRecordInfo }>();
</script>

<style lang="stylus" scoped>
.record-item
  display: flex
  height: 1.82rem
  border-bottom: .01rem solid #e6e6e6
  &:last-child
    border-bottom: none
  .icon
    margin-top: .13rem
    margin-right: .21rem
    width: .86rem
    height: .86rem
  .content
    display: flex
    flex-direction: column
    justify-content: space-between
    padding: .32rem 0
    flex: 1
    font-size: .26rem
    color: #999
    .title
      margin-right: .20rem
      color: #333
      font-size: .30rem
      font-weight: 600
  .amount-wrap
    margin-top: .28rem
    .amount
      margin-right: .10rem
      color: #333
      font-size: .36rem
      font-weight: 600
      &.recharge
        color: #E42D00
</style>
