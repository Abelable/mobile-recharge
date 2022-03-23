<template>
  <div>
    <div class="nomal-bar" v-if="goodsType === 0">
      <div class="price">
        <div class="shop-price">
          <span>￥</span>
          <span style="font-size: 0.48rem">{{ shopPrice.split(".")[0] }}</span>
          <span>.{{ shopPrice.split(".")[1] }}</span>
        </div>
        <div class="market-price">原价￥{{ marketPrice }}</div>
      </div>
      <div class="sale-amount">{{ salesVolume }}件已买</div>
    </div>

    <div class="sale-bar" v-if="goodsType === 1">
      <div class="price">
        <div class="shop-price">
          <span>￥</span>
          <span style="font-size: 0.48rem">{{ shopPrice.split(".")[0] }}</span>
          <span>.{{ shopPrice.split(".")[1] }}</span>
        </div>
        <div class="market-price">原价￥{{ marketPrice }}</div>
      </div>
      <div class="sale-slogan">
        <img
          style="width: 2.04rem; height: 0.5rem"
          src="https://img.ubo.vip/mp/selection/goods-detail/sale-slogan.png"
        />
      </div>
      <div class="count-down-wrap">
        <div class="progress-bar">
          <span>仅剩{{ progressInfo.stock }}件</span>
          <div class="inner" :style="{ width: progressInfo.percent / 100 }">
            <p class="tip">仅剩{{ progressInfo.stock }}件</p>
          </div>
        </div>
        <div class="count-down">
          {{
            `${
              unStart ? "距开始剩" : "距结束剩"
            } ${hours}:${minutes}:${seconds}`
          }}
        </div>
      </div>
    </div>

    <div class="promotion-bar" v-if="goodsType === 2">
      <div class="price">
        <div class="shop-price">
          <span>￥</span>
          <span style="font-size: 0.48rem">{{ shopPrice.split(".")[0] }}</span>
          <span>.{{ shopPrice.split(".")[1] }}</span>
        </div>
        <div class="market-price">原价￥{{ marketPrice }}</div>
      </div>
      <div class="stock">库存{{ stock }}件</div>
      <div class="count-down-wrap">
        <div class="tips">距离结束仅剩</div>
        <div class="count-down">
          <div class="time">{{ hours }}</div>
          <div style="margin: 0 0.05rem">:</div>
          <div class="time">{{ minutes }}</div>
          <div style="margin: 0 0.05rem">:</div>
          <div class="time">{{ seconds }}</div>
        </div>
      </div>
    </div>

    <div class="spike-bar" v-if="goodsType === 6">
      <div class="price-wrap">
        <div class="pirce">
          <span class="shop-pirce">
            <span>￥</span>
            <span style="font-size: 0.56rem">{{
              shopPrice.split(".")[0]
            }}</span>
            <span>.{{ shopPrice.split(".")[1] }}</span>
          </span>
          <span class="market-pirce">￥{{ marketPrice }}</span>
        </div>
        <div class="desc">
          {{
            unStart
              ? "限量：" + spikeInfo.sec_limit ||
                spikeInfo.all_order_number + "件"
              : "已抢购：" + spikeInfo.all_order_number + "件"
          }}
        </div>
      </div>
      <div class="count-down-wrap">
        <div class="tips">限时秒杀</div>
        <div class="count-down">
          <span v-if="unStart">即将开抢 </span>
          <span>{{ hours }}:{{ minutes }}:{{ seconds }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { formatNumber } from "@/utils";

interface PropsType {
  goodsType: number;
  shopPrice: string;
  marketPrice: string;
  salesVolume: number;
  stock: number;
  progressInfo: { stock: number; percent: number };
  spikeInfo: { sec_limit: number; all_order_number: number };
  countDown: number;
  unStart: boolean;
}
const props = defineProps<PropsType>();

const hours = computed(() =>
  formatNumber(new Date(props.countDown * 1000).getHours())
);
const minutes = computed(() =>
  formatNumber(new Date(props.countDown * 1000).getMinutes())
);
const seconds = computed(() =>
  formatNumber(new Date(props.countDown * 1000).getSeconds())
);
</script>

<style lang="stylus" scoped>
.nomal-bar
  display flex
  align-items baseline
  justify-content space-between
  padding .24rem .24rem .1rem
  font-size .28rem
  .price
    display flex
    align-items baseline
    .shop-price
      color #D0132B
      font-weight 500
    .market-price
      margin-left .16rem
      color #999
      text-decoration line-through
  .sale-amount
    color #999
.sale-bar
  display flex
  align-items center
  padding 0 .24rem
  height .96rem
  background-image url('https://img.ubo.vip/mp/selection/goods-detail/special-sale-bg.png')
  background-size 100%
  background-repeat no-repeat
  .price
    color #fff
    .shop-price
      font-size .28rem
      font-weight 500
      line-height 1
    .market-price
      font-size .22rem
      text-decoration line-through
  .sale-slogan
    display flex
    align-items center
    justify-content flex-end
    margin-right .2rem
    flex 1
  .count-down-wrap
    display flex
    flex-direction column
    align-items center
    font-weight 500
    .progress-bar
      position relative
      width 1.90rem
      height .24rem
      padding-right .06rem
      border-radius .12rem
      color #B87900
      font-size .20rem
      line-height .24rem
      font-weight 500
      text-align right
      background linear-gradient(90deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.85) 100%)
      .inner
        position absolute
        top 0
        left 0
        height .24rem
        min-width .24rem
        border-radius .12rem
        background linear-gradient(270deg,rgba(243,160,68,1) 0%,rgba(236,197,153,1) 100%)
        overflow hidden
        .tip
          position absolute
          top 0
          left 0
          width 1.90rem
          height .24rem
          padding-right .06rem
          border-radius .12rem
          color #fff
    .count-down
      margin-top .10rem
      width 2.20rem
      color #fff
      font-size .24rem
      line-height 1
      text-align center
      white-space nowrap
.promotion-bar
  display flex
  align-items center
  padding 0 .24rem
  height .96rem
  background-image url('https://img.ubo.vip/mp/selection/goods-detail/sale-bg.png')
  background-size 100%
  background-repeat no-repeat
  .price
    color #fff
    .shop-price
      font-size .28rem
      font-weight 500
      line-height 1
    .market-price
      font-size .22rem
      text-decoration line-through
  .stock
    padding-left .2rem
    flex 1
    color #fff
    font-size .28rem
    font-weight 500
  .count-down-wrap
    display flex
    flex-direction column
    align-items center
    color #fff
    font-weight 500
    .tips
      font-size .24rem
    .count-down
      display flex
      align-items center
      line-height 1
      font-size .22rem
      .time
        width .34rem
        height .34rem
        line-height .34rem
        color #F5163B
        text-align center
        border-radius .04rem
        background-color #fff
.spike-bar
  position relative
  display flex
  align-items center
  justify-content space-between
  padding 0 .23rem
  height 1.10rem
  color #fff
  background-color #FFECEB
  background-image url('https://img.ubo.vip/mp/selection/goods-detail/spike-bg.png')
  background-size 4.30rem 100%
  background-repeat no-repeat
  .price-wrap
    display flex
    flex-direction column
    .pirce
      display flex
      align-items baseline
      line-height 1
      .shop-pirce
        font-size .28rem
        font-weight 500
      .market-pirce
        margin-left .22rem
        font-size .28rem
        text-decoration line-through
    .desc
      font-size .24rem
  .count-down-wrap
    display flex
    flex-direction column
    align-items center
    color #CF4C45
    font-size .32rem
</style>
