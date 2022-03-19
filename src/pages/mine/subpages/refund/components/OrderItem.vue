<template>
  <div class="order-item">
    <div class="list-header">
      <div class="order-sn">退款编号：{{ item.return_sn }}</div>
      <div class="order-status">{{ orderStatus }}</div>
    </div>
    <div class="list-content" @click="navToRefundDetail">
      <div class="goods-list">
        <img class="goods-pic" :src="item.goods_thumb" />
        <div class="goods-info">
          <div class="goods-title">{{ item.goods_name }}</div>
          <div class="goods-attr-wrap">
            <div class="goods-attr">{{ item.goods_attr }}</div>
            <div>x{{ item.get_return_goods.return_number }}</div>
          </div>
          <div class="goods-price-wrap">
            <div class="back-price">
              退款金额：<span style="color: #b87900">{{
                item.should_return
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="list-footer">
      <div class="user-info">
        <div>收件人：{{ item.addressee }} {{ item.phone }}</div>
        <div style="color: #999">申请时间：{{ item.apply_time }}</div>
      </div>
      <div class="btn" @click="navToRefundDetail">查看详情</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { webviewUrl } from "@/utils";
import { RefundOrderInfo } from "../utils/api";

const router = useRouter();

const props = defineProps<{ item: RefundOrderInfo }>();

const orderStatus = computed(() =>
  props.item.agree_apply === 0
    ? "待同意"
    : props.item.agree_apply === 1
    ? "已同意"
    : "已拒绝"
);

const navToRefundDetail = () =>
  router.push({
    path: "/webview",
    query: {
      url: `${webviewUrl}/refund/detail/?ret_id=${props.item.ret_id}`,
    },
  });
</script>

<style lang="stylus" scoped>
.order-item
  margin-bottom .24rem
  padding .20rem .30rem
  background #fff
  border-radius .16rem
  .list-header
    display flex
    align-items center
    justify-content space-between
    font-size .28rem
    .order-status
      color #B87900
  .list-content
    margin .10rem 0
    .goods-list
      display flex
      align-items center
      .goods-pic
        margin-right .20rem
        flex 0 0 1.76rem
        height 1.76rem
        border-radius .08rem
    .goods-info
      flex 1
      display flex
      flex-direction column
      .goods-title
        font-size .24rem
        color #333
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
      .goods-attr-wrap
        display flex
        justify-content space-between
        flex 1
        font-size .24rem
        color #999
        .goods-attr
          width 3.20rem
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
      .goods-price-wrap
        display flex
        justify-content space-between
        align-items center
        .back-price
          flex 1
          font-size .24rem
          text-align right
  .list-footer
    display flex
    align-items center
    justify-content space-between
    .user-info
      font-size .24rem
    .btn
      width 1.60rem
      height .56rem
      color #666
      font-size .28rem
      line-height .54rem
      text-align center
      border-radius .28rem
      border .01rem solid #D8D8D8
</style>
