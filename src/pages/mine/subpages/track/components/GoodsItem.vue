import { GoodItemInfo } from '../utils/api';
<template>
  <div class="goods-item" @click="navToGoods">
    <img
      class="img"
      :src="
        item.goods_img.includes('http')
          ? item.goods_img
          : `https://img.ubo.vip/${item.goods_img}`
      "
    />
    <div class="content">
      <div class="title">{{ item.goods_name }}</div>
      <div class="price-wrap">
        <div class="price">
          <span> ¥ </span>
          <span style="font-size: 0.36rem">{{ item.market_price }}</span>
        </div>
        <div class="btn">立即购买</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { GoodsItemInfo } from "../utils/api";
const router = useRouter();

const props = defineProps<{ item: GoodsItemInfo }>();

const navToGoods = () =>
  router.push({
    path: "/mall/goods",
    query: { id: props.item.goods_id },
  });
</script>

<style lang="stylus" scoped>
.goods-item
  display: flex
  align-items: center
  padding: .28rem 0
  border-bottom: .01rem solid #eee
  &:last-child
    border-bottom: none
  .img
    position: relative
    margin-right: .18rem
    width: 1.80rem
    height: 1.80rem
    border-radius: .08rem
    background-color: #eee
  .content
    display: flex
    flex-direction: column
    justify-content: space-between
    flex: 1
    height: 1.80rem
    .title
      display: -webkit-box
      font-size: .28rem
      color: #333
      overflow: hidden
      text-overflow: ellipsis
      -webkit-line-clamp: 2
      -webkit-box-orient: vertical
    .price-wrap
      display: flex
      align-items: flex-end
      justify-content: space-between
      .price
        font-size: .24rem
        color: #CC1421
      .btn
        width: 1.48rem
        height: .52rem
        text-align: center
        line-height: .52rem
        font-size: .24rem
        color: #3D2D1D
        border-radius: .04rem
        background-color: #FFD480
</style>
