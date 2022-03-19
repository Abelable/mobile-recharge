<template>
  <div class="container">
    <NavBar title="订单详情" />
    <div class="order-status">{{ status }}</div>

    <div class="info-wrap">
      <div class="consignee-info">
        <div class="user-info">
          <img
            style="width: 0.36rem; height: 0.36rem"
            src="https://img.ubo.vip/mp/mine/order-detail/user-info-icon.png"
          />
          <div class="name">{{ orderInfo?.consignee }}</div>
          <div>{{ orderInfo?.mobile }}</div>
        </div>
        <div class="address-info">{{ orderInfo?.address }}</div>
        <div
          class="shipping-info"
          v-if="orderInfo?.order_status_to === 2 && orderInfo?.invoice_no"
          @click="navToShipping"
        >
          <img
            style="width: 0.38rem; height: 0.38rem"
            src="https://img.ubo.vip/mp/mine/order-detail/shipping-icon.png"
          />
          <div class="shipping-tips">{{ orderInfo?.shipping_status }}</div>
          <img
            style="width: 0.3rem; height: 0.3rem"
            src="https://img.ubo.vip/mp/to-icon.png"
          />
        </div>
      </div>

      <div class="order-info">
        <GoodsItem
          v-if="orderInfo?.goods"
          @click="navToGoods"
          :item="orderInfo.goods[0]"
          :isDetail="true"
          :orderStatus="orderInfo.order_status_to"
          :orderId="orderInfo.order_id"
        />
        <ul class="price-lists">
          <li class="price-list">
            <span>商品合计</span>
            <span>{{ orderInfo?.goods_amount_formated }}</span>
          </li>
          <li class="price-list">
            <span>运费</span>
            <span>+{{ orderInfo?.shipping_fee_formated }}</span>
          </li>
          <li class="price-list">
            <span>余额</span>
            <span>-{{ orderInfo?.surplus_formated }}</span>
          </li>
          <li class="price-list">
            <span>优惠券折扣</span>
            <span>-{{ orderInfo?.bonus }}</span>
          </li>
          <li class="price-list total">
            <span class="total-tips">{{
              orderInfo?.order_status_to == 1 || orderInfo?.order_status_to == 3
                ? "应付金额"
                : "实付金额"
            }}</span>
            <span>{{
              orderInfo?.order_status_to == 1 || orderInfo?.order_status_to == 3
                ? orderInfo.order_amount_formated
                : orderInfo?.money_paid_formated
            }}</span>
          </li>
        </ul>
      </div>

      <div class="order-notes" v-if="orderInfo?.postscript">
        <h3 class="title">订单备注：</h3>
        <p class="notes">{{ orderInfo.postscript }}</p>
      </div>

      <div class="other-info">
        <div class="info-list">
          <span>订单编号：{{ orderInfo?.order_sn }}</span>
          <span style="color: #b87900; font-size: 0.28rem" @click="copyOrderSn"
            >复制</span
          >
        </div>
        <div class="info-list">创建时间：{{ orderInfo?.add_time }}</div>
        <div class="info-list" v-if="orderInfo?.pay_time">
          支付时间：{{ orderInfo.pay_time }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Toast } from "vant";
import NavBar from "@/components/NavBar.vue";
import GoodsItem from "../components/GoodsItem.vue";

import { onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useOrderInfo } from "../utils/api";

const route = useRoute();
const router = useRouter();
const { orderInfo, setOrderInfo } = useOrderInfo();

let orderId = "";

const status = computed(() => {
  const statusArr =
    orderInfo.value && orderInfo.value.shipping_id
      ? ["未付款", "待收货", "已取消", "售后中", "已完成", "待发货"]
      : ["未付款", "待发货", "已取消", "售后中", "已完成", "待发货"];
  return orderInfo.value && statusArr[orderInfo.value.order_status_to - 1];
});

onMounted(() => {
  orderId = route.query.id as string;
  setOrderInfo(orderId);
});

const navToGoods = () =>
  router.push({
    path: "/mall/goods",
    query: { id: orderInfo.value?.goods[0].goods_id },
  });

const navToShipping = () =>
  router.push({
    path: "/mine/order_list/shipping",
    query: { id: orderId },
  });

const copyOrderSn = () => {
  const aux = document.createElement("input");
  aux.setAttribute("value", orderInfo.value ? orderInfo.value.order_sn : "");
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  Toast.success("复制成功");
};
</script>

<style lang="stylus" scoped>
.container
  padding-top .88rem
  .order-status
    display flex
    align-items center
    padding-left .5rem
    height 1.68rem
    color #fff
    font-size .3rem
    background-image url('https://img.ubo.vip/mp/mine/order-detail/order-detail-bg.png')
    background-size 100% 100%
    background-repeat no-repeat
  .info-wrap
    padding .24rem
    .consignee-info
      padding .30rem
      background #fff
      border-radius .20rem
      .user-info
        display flex
        align-items center
        color #333
        font-size .28rem
        font-weight 500
        .name
          margin 0 .2rem
      .address-info
        margin-top .1rem
        margin-left .58rem
        color #999
        font-size .28rem
      .shipping-info
        display flex
        align-items center
        margin-top .30rem
        padding-top .20rem
        height 1.20rem
        border-top .01rem solid #f0f0f0
        .shipping-tips
          margin-left .20rem
          flex 1
          color #B87900
          font-size .28rem
    .order-info
      margin-top .24rem
      padding .1rem .30rem .3rem
      background #fff
      border-radius .20rem
      .price-lists
        border-top 1px solid #f0f0f0
        .price-list
          display flex
          justify-content space-between
          align-items center
          padding-top .3rem
          color #666
          font-size .24rem
          &.total
            color #B87900
            font-size .24rem
          .total-tips
            color #333
            font-size .28rem
            font-weight 500
    .order-notes
      margin-top .24rem
      padding .3rem
      background #fff
      border-radius .20rem
      .title
        color #333
        font-size .26rem
        font-weight 500
      .notes
        margin-top .1rem
        color #666
        font-size .24rem
    .other-info
      margin-top .24rem
      padding .2rem .3rem
      background #fff
      border-radius .20rem
      .info-list
        display flex
        justify-content space-between
        align-items center
        height .60rem
        color #666
        font-size .24rem
</style>
