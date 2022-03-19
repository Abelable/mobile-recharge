<template>
  <div class="order-item">
    <div class="header">
      <img class="shop-icon" :src="item.shop_logo" />
      <div class="shop-name">{{ item.shop_name }}</div>
      <div class="status">{{ status }}</div>
    </div>
    <div class="content" @click="navToOrderDetail">
      <GoodsItem
        v-for="(goodsItem, index) in item.order_goods"
        :key="index"
        :item="goodsItem"
      />
    </div>
    <div class="footer">
      <div class="total-info">
        <span style="margin-right: 0.2rem"
          >共{{ item.order_goods_num }}件商品</span
        >
        <span>合计:</span>
        <span class="total-fee">{{ item.total_amount_formated }}</span>
      </div>
      <div class="pending-tips" v-if="item.order_status_to == 1">
        <img class="horn-icon" src="https://img.ubo.vip/mp/horn.png" />
        <span>订单在下单15分钟后关闭，请尽快完成支付~</span>
      </div>
      <div class="btn-wrap">
        <div
          class="btn"
          v-if="item.order_status_to == 2 && item.invoice_no"
          @click="navToShipping"
        >
          查看物流
        </div>
        <div
          class="btn"
          v-if="item.order_status_to == 3"
          @click="handleOrder(Method.delete)"
        >
          删除订单
        </div>
        <div class="btn" @click="navToOrderDetail">查看详情</div>
        <div
          class="btn"
          v-if="item.order_status_to == 1"
          @click="handleOrder(Method.cancel)"
        >
          取消订单
        </div>
        <div
          class="btn warn"
          v-if="item.order_status_to == 2"
          @click="handleOrder(Method.confirm)"
        >
          确认收货
        </div>
        <div
          class="btn warn"
          v-if="item.order_status_to == 1"
          @click="emit('pay')"
        >
          去付款
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import GoodsItem from "./GoodsItem.vue";

import { computed, toRefs } from "vue";
import { useRouter } from "vue-router";
import { deleteOrder, cancelOrder, confirmOrder } from "../utils/api";
import { OrderInfo } from "@/types";

enum Method {
  delete,
  cancel,
  confirm,
}

const router = useRouter();

const props = defineProps<{ item: OrderInfo }>();
const emit = defineEmits(["refresh", "pay"]);

const status = computed(() => {
  const { order_status_to, shipping_id } = toRefs(props.item);
  const statusArr = shipping_id.value
    ? ["未付款", "待收货", "已取消", "售后中", "已完成", "待发货"]
    : ["未付款", "待发货", "已取消", "售后中", "已完成", "待发货"];
  return statusArr[order_status_to.value - 1];
});

const navToOrderDetail = () =>
  router.push({
    path: "/mine/order_list/order_detail",
    query: {
      id: props.item.order_id,
    },
  });

const navToShipping = () =>
  router.push({
    path: "/mine/order_list/shipping",
    query: {
      id: props.item.order_id,
    },
  });

const handleOrder = (method: Method) => {
  switch (method) {
    case Method.delete:
      deleteOrder(props.item.order_id);
      break;

    case Method.cancel:
      cancelOrder(props.item.order_id);
      break;

    case Method.confirm:
      confirmOrder(props.item.order_id);
      break;
  }
  emit("refresh");
};
</script>

<style lang="stylus" scoped>
.order-item
  margin-bottom .20rem
  padding .20rem .30rem
  background-color #fff
  border-radius .16rem
  .header
    display flex
    align-items center
    font-size .28rem
    .shop-icon
      margin-right .15rem
      width .32rem
      height .32rem
    .shop-name
      flex 1
      color #333
      font-weight 500
    .status
      color #000
  .footer
    .total-info
      font-size .24rem
      color #333
      text-align right
      .total-fee
        font-size .30rem
        font-weight 500
        color #000
    .pending-tips
      display flex
      align-items center
      justify-content flex-end
      color #B87900
      font-size .24rem
      .horn-icon
        margin-right .10rem
        width .30rem
        height .30rem
    .btn-wrap
      margin-top .10rem
      display flex
      justify-content flex-end
      .btn
        margin-right .16rem
        width 1.60rem
        height .56rem
        line-height .56rem
        text-align center
        font-size .28rem
        color #666
        border-radius .28rem
        border .01rem solid #D8D8D8
        &:last-child
          margin-right 0
        &.warn
          color #B87900
          border .01rem solid #B87900
</style>
