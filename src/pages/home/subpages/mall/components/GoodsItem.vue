<template>
  <div class="goods-item" @click="navToGoods">
    <img class="goods-img" :src="item.goods_thumb" />
    <div class="content">
      <div class="content-top">
        <div class="goods-title">{{ item.goods_name }}</div>
        <div class="goods-sales">{{ item.ghost_count }}人已买</div>
      </div>
      <div class="goods-price-wrap">
        <div class="goods-price">
          <div class="price">
            ￥<span style="font-size: 0.4rem">{{ item.shop_price }}</span>
          </div>
        </div>
      </div>
      <div class="buy-btn">
        {{ item.split_money !== "0" ? "分享购买" : "立即购买" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { GoodsInfo } from "../utils/api";
const router = useRouter();
const props = defineProps<{ item: GoodsInfo }>();

const navToGoods = () =>
  router.push({ path: "/mall/goods", query: { id: props.item.id } });
</script>

<style lang="stylus" scoped>
.goods-item
  display flex
  align-items center
  margin-bottom .24rem
  padding .16rem
  border-radius .12rem
  background #fff
  .goods-img
    margin-right .32rem
    width 2.70rem
    height 2.70rem
    border-radius .12rem
  .content
    display flex
    flex-direction column
    justify-content space-between
    flex 1
    height 2.70rem
    box-sizing initial
    .goods-title
      color #333
      font-size .28rem
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
    .goods-sales
      margin-top .13rem
      width fit-content
      height .30rem
      color #999999
      font-size .22rem
      text-align center
      line-height .30rem
      border-radius .05rem
    .goods-price-wrap
      display flex
      align-items center
      justify-content space-between
      align-items flex-end
      line-height .30rem
      .price
        font-weight 500
        font-size .30rem
        color #D0132B
    .buy-btn
      margin-right .10rem
      width 1.70rem
      height .66rem
      text-align center
      line-height .64rem
      font-size .24rem
      color #B5732D
      font-weight 500
      background #ffffff
      border .01rem solid #B5732D
      border-radius .12rem
</style>
