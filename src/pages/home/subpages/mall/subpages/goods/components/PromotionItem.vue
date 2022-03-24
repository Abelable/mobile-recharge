<template>
  <div class="promotion-item">
    <div class="promotion-item-main">
      <div class="promotion-info">
        <div class="promotion-title">
          <div class="promotion-icon">{{ item.tip_content }}</div>
          <div>{{ item.show_name }}</div>
        </div>
        <div class="promotion-time">活动时间：{{ item.limit_time }}</div>
      </div>
      <div class="promotion-detail-btn" wx:if="{{item.rules}}" @click="toggle">
        <div>详情</div>
        <img
          class="icon"
          :class="{ show: showDetail }"
          :src="`https://img.ubo.vip/mp/selection/goods-detail/i-promotion-list/${
            showDetail ? 'opened' : 'open'
          }-icon.png`"
          alt=""
        />
      </div>
    </div>
    <div class="promotion-item-detail" wx:if="{{showDetail}}">
      <div class="detail-title">活动规则</div>
      <div class="detail-content">{{ item.rules }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PromotionInfo } from "@/api/common";
import { toRef } from "vue";

const props = defineProps<{ item: PromotionInfo }>();
const showDetail = toRef(props.item, "show_detail");

const toggle = () => (showDetail.value = !showDetail.value);
</script>

<style lang="stylus" scoped>
.promotion-item
  padding: .20rem 0
  border-bottom: .02rem solid #F2F2F2
  .promotion-item-main
    display: flex
    align-content: center
    justify-content: space-between
  .promotion-title
    display: flex
    align-items: center
    font-size: .30rem
    font-weight: 500
    color: #333
    .promotion-icon
      margin-right: .08rem
      padding: 0 .15rem
      height: .36rem
      line-height: .36rem
      text-align: center
      color: #F32D59
      font-size: .24rem
      font-weight: 500
      border: .02rem solid #F32D59
      border-radius: .24rem .24rem .04rem .24rem
  .promotion-time
    margin-top: .06rem
    font-size: .24rem
    font-weight: 500
    color: #666
  .promotion-detail-btn
    display: flex
    align-items: center
    font-size: .24rem
    font-weight: 500
    color: #999
    .icon
      margin: 0 0.08rem
      width: 0.12rem
      height: 0.24rem
      &.show
        margin-left: 0.04rem
        width: 0.24rem
        height: 0.12rem
  .promotion-item-detail
    font-weight: 500
    .detail-title
      margin: .20rem 0 .15rem
      font-size: .26rem
      color: #333
    .detail-content
      color: #666
      font-size: .24rem
      line-height: .40rem
</style>
