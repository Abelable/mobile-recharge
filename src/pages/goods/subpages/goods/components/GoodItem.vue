<template>
  <div class="goods-item" @click="navToGoods">
    <div class="img-wrap">
      <img class="img" :src="item.original_img" />
      <div class="active-tip">{{ item.active_info }}</div>
    </div>
    <div class="title">{{ item.goods_name }}</div>
    <div class="price-wrap">
      <div class="shop-price">
        <span>￥</span>
        <span class="int">{{ item.shop_price.split(".")[0] }}</span>
        <span>.{{ item.shop_price.split(".")[1] }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";
import { useRouter } from "vue-router";
import { GoodsInfo } from "@/types/index";

const router = useRouter();
const props = defineProps<{ item: GoodsInfo }>();

const routerRefresh = inject<() => void>("routerRefresh");
const navToGoods = () => {
  router.push({ path: "/mall/goods", query: { id: props.item.goods_id } });
  routerRefresh && routerRefresh();
};
</script>

<style lang="stylus" scoped>
.goods-item
  display flex
  flex-direction column
  justify-content space-between
  margin-right .16rem
  width 2.06rem
  height 3.5rem
  border-radius .08rem
  .img-wrap
    position relative
    width 2.06rem
    height 2.06rem
    border-radius .08rem
    overflow hidden
    .img
      width 100%
      height 100%
      fit-content cover
    .active-tip
      position absolute
      left 0
      bottom 0
      width .64rem
      height .32rem
      color #B5732D
      font-size .2rem
      font-weight 500
      text-align center
      line-height .32rem
      border-radius 0 .08rem 0 .08rem
      background linear-gradient(270deg, #FFD699 0%, #FFE5BD 100%)
  .title
    color #111
    font-size .28rem
    line-height .4rem
    font-weight 500
    overflow hidden
    white-space normal
    text-overflow ellipsis
    display -webkit-box
    -webkit-line-clamp 2
    -webkit-box-orient vertical
  .price-wrap
    margin .10rem 0
    display flex
    align-items baseline
    font-weight 500
    letter-spacing -0.01rem
    line-height .34rem
    .shop-price
      margin-right .10rem
      font-size .20rem
      color #D0132B
      .int
        font-size .34rem
</style>
