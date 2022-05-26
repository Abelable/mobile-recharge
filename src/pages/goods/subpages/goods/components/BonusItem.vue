<template>
  <div class="bonus-item">
    <div class="bonus-info">
      <div class="bonus-title">{{ item.type_name }}</div>
      <div class="bonus-limit">使用条件：{{ item.limit_tip }}</div>
      <div class="bonus-time">使用时间：{{ item.limit_time }}</div>
    </div>
    <div class="bonus-stub">
      <div class="bonus-quota">
        <span>￥</span>
        <span style="font-size: 0.8rem">{{ item.type_money }}</span>
      </div>
      <div class="bonus-btn" :class="{ invalid: isHave }" @click="receive">
        {{ isHave ? "已领取" : "立即领取" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from "vue";
import { BonusInfo, getNewBonus } from "@/api/common";

const props = defineProps<{ item: BonusInfo }>();
const isHave = toRef(props.item, "is_have");

const receive = () => {
  if (!isHave.value) {
    getNewBonus(props.item.type_id);
    isHave.value = 1;
  }
};
</script>

<style lang="stylus" scoped>
.bonus-item
  position: relative
  display: flex
  align-items: center
  margin-bottom: .24rem
  width: 100%
  height: 1.76rem
  border-radius: .16rem
  background-color: #FFEBF0
  &::before, &::after
    position: absolute
    right: 2rem
    width: .30rem
    height: .15rem
    content: ''
    background-color: #fff
  &::before
    top: 0
    border-radius: 0 0 .15rem .15rem
  &::after
    bottom: 0
    border-radius: .15rem .15rem 0 0
  .bonus-info
    padding-left: .20rem
    width: 4.88rem
    height: 1.25rem
    border-right: 0.02rem dashed #fff
    .bonus-title
      font-size: .30rem
      font-weight: 500
      color: #333
    .bonus-limit, .bonus-time
      font-size: .22rem
      color: #666
      font-family: PingFangSC-Medium
      white-space: nowrap
  .bonus-stub
    display: flex
    flex-direction: column
    align-items: center
    flex: 1
    .bonus-quota
      font-size: .40rem
      font-weight: 500
      color: #FF366B
      line-height: 1.1
      font-family: DIN-Medium
    .bonus-btn
      width: 1.20rem
      height: .46rem
      line-height: .46rem
      text-align: center
      font-size: .22rem
      font-weight: 500
      color: #fff
      border-radius: .23rem
      background: linear-gradient(135deg,rgba(255,67,122,1) 0%,rgba(254,25,77,1) 100%)
      &.invalid
        background: #7C7C7C
</style>
