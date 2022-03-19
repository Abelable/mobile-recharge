<template>
  <div class="goods-item">
    <img class="pic" :src="item.goods_thumb" />
    <div class="info">
      <div class="title">{{ item.goods_name }}</div>
      <div class="attr-wrap">
        <div class="attr">{{ item.goods_attr }}</div>
        <div>x{{ item.goods_number }}</div>
      </div>
      <div class="price-wrap">
        <div class="price">
          <div class="shop-price">{{ item.goods_price }}</div>
          <div class="market-price" v-if="item.market_price">
            ￥{{ item.market_price }}
          </div>
        </div>
        <div
          class="status"
          :class="{
            btn: isDetail,
            tip: !isDetail,
            refunding: item.goods_cause == 2,
          }"
          v-if="
            (item.goods_cause == 1 || item.goods_cause == 2) && orderStatus != 5
          "
          @click.stop="toRefund"
        >
          {{ item.goods_cause == 2 ? "查看售后" : "申请售后" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { webviewUrl } from "@/utils/index";
import { OrderGoodsInfo } from "@/types";

const router = useRouter();

const props = defineProps<{
  item: OrderGoodsInfo;
  isDetail?: boolean;
  orderId?: number;
  orderStatus?: number;
}>();

const toRefund = () => {
  const { goods_cause, rec_id, ret_id } = props.item;
  const url =
    goods_cause == 1
      ? `${webviewUrl}/refund?order_id=${props.orderId}&rec_id=${rec_id}`
      : `${webviewUrl}/refund/detail?ret_id=${ret_id}`;
  router.push({
    path: "/webview",
    query: { url },
  });
};
</script>

<style lang="stylus" scoped>
.goods-item
  display flex
  padding .2rem 0
  border-bottom .01rem solid #f0f0f0
  &:last-child
    border-bottom none
  .pic
    margin-right .20rem
    width 1.76rem
    height 1.76rem
    border-radius .08rem
  .info
    display flex
    flex-direction column
    flex 1
    height 1.76rem
    .title
      color #333
      font-size .24rem
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
    .attr-wrap
      display flex
      flex 1
      color #999
      font-size .24rem
      .attr
        padding-right .20rem
        flex 1
    .price-wrap
      display flex
      justify-content space-between
      align-items center
      .shop-price
        color #333
        font-size .26rem
        font-weight 500
      .market-price
        color #9a9a9a
        font-size .22rem
        line-height 1
        text-decoration line-through
      .status
        font-size .28rem
        &.tip
          display none
          &.refunding
            display block
            color red
        &.btn
          padding 0 .26rem
          height .56rem
          color #666
          line-height .54rem
          text-align center
          border-radius .28rem
          border .01rem solid #D8D8D8
          &.refunding
            color #B87900
            border-color #B87900
</style>
