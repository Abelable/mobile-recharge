<template>
  <div class="coupon-item" @click="navTo">
    <div class="content">
      <div class="price-wrap" :class="{ overdue: overdue }">
        <div class="price">
          <span style="font-size: 0.3rem">¥</span>
          <span>{{ item.type_money }}</span>
        </div>
        <div class="price-desc">
          {{
            item.min_goods_amount
              ? "满" + item.min_goods_amount + "元可用"
              : "无门槛"
          }}
        </div>
      </div>
      <div class="coupon-detail" :class="{ overdue: overdue }">
        <div class="coupon-name">{{ item.type_name }}</div>
        <div class="coupon-time">{{ item.use_end_date }}到期</div>
        <div class="effect-time" v-if="item.use_start_date_time">
          {{ item.use_start_date_time }}天后生效
        </div>
      </div>
    </div>
    <img
      class="activity-icon"
      v-if="activityIcon"
      :src="`https://img.ubo.vip/mp/mine/coupon/i-coupon-list/${activityIcon}.png`"
    />
    <img
      class="ineffective-icon"
      v-if="overdue && item.bonus_type_name === '已过期'"
      src="https://img.ubo.vip/mp/mine/coupon/i-coupon-list/overdue.png"
    />
    <img
      class="ineffective-icon"
      v-if="overdue && item.bonus_type_name !== '已过期'"
      src="https://img.ubo.vip/mp/mine/coupon/i-coupon-list/used.png"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CouponInfo } from "../utils/api";
import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps<{ item: CouponInfo; overdue?: boolean }>();

const activityIcon = computed(() => {
  let iconPath = "";
  if (props.item.category === 2)
    iconPath = props.overdue ? "happy-overdue" : "happy";
  if (props.item.category === 3)
    iconPath = props.overdue ? "heart-overdue" : "happy";
  return iconPath;
});

const navTo = () => {
  const { is_belong, ad_link } = props.item;
  if (is_belong === "1")
    router.push({ path: "/mall/goods", query: { id: ad_link } });
  else router.push("/mall");
};
</script>

<style lang="stylus" scoped>
.coupon-item
  position: relative
  display: flex
  align-items: center
  margin-bottom .24rem
  padding: 0 .20rem
  height: 2.10rem
  border-radius: .10rem
  background-color: #fff
  &::before, &::after
    position: absolute
    top: .90rem
    content: ''
    width: .30rem
    height: .30rem
    border-radius: 50%
    background-color: #f4f4f4
  &::before
    left: -0.15rem
  &::after
    right: -0.15rem
  &:last-child
    margin-bottom 0
  .content
    display: flex
    align-items: center
    height: 1.15rem
    .price-wrap
      display: flex
      flex-direction: column
      align-items: center
      padding-right: .10rem
      width: 2.30rem
      height: 1.20rem
      color: #E42D00
      border-right: .01rem solid #f4f4f4
      &.overdue
        color: #c7c7c7
      .price
        font-size: .58rem
        font-weight: 600
      .price-desc
        font-size: .28rem
    .coupon-detail
      display: flex
      flex-direction: column
      justify-content: space-between
      padding-left: .34rem
      height: 1.20rem
      &.overdue
        .coupon-name, .coupon-time, .effect-time
          color: #c7c7c7
      .coupon-name
        color: #333
        font-size: .34rem
        font-weight: 500
        line-height: .48rem
      .coupon-time
        color: #E42D00
        font-size: .28rem
        line-height: 1
      .effect-time
        color: #999
        font-size: .26rem
        line-height: .37rem
  .activity-icon
    position: absolute
    top: 0
    left: 0
    width: 1.45rem
    height: .84rem
  .ineffective-icon
    position: absolute
    top: 0
    right: 0
    width: 1.50rem
    height: 1.32rem
</style>
