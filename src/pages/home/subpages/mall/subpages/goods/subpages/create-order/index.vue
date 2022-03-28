<template>
  <div class="container">
    <NavBar title="确认订单" />

    <div class="user-info-wrap" @click="chooseAddress">
      <img
        style="width: 0.42rem; height: 0.42rem"
        src="https://img.ubo.vip/mp/selection/goods-detail/order-check/address-icon.png"
      />
      <div class="user-info">
        <p class="name" v-if="consigneeInfo">
          <span style="margin-right: 0.2rem">{{
            consigneeInfo?.consignee
          }}</span>
          <span>{{ consigneeInfo.mobile }}</span>
        </p>
        <p class="address">
          {{
            consigneeInfo
              ? consigneeInfo.province_name +
                consigneeInfo.city_name +
                consigneeInfo.district_name +
                consigneeInfo.address
              : "请选择合适的寄件地址"
          }}
        </p>
      </div>
      <img
        style="width: 0.32rem; height: 0.32rem"
        src="https://img.ubo.vip/mp/selection/goods-detail/order-check/to-icon.png"
      />
    </div>

    <ul class="order-lists">
      <li
        class="order-list"
        v-for="(orderItem, index) in orderList"
        :key="index"
      >
        <div class="shop-info" v-if="orderItem.shop_name">
          <img
            style="width: 0.32rem; height: 0.32rem"
            src="https://img2.ubo.vip/images/detail/20190322/1553232402868510.png"
          />
          <p class="name">{{ orderItem.shop_name }}</p>
        </div>
        <ul class="goods-lists">
          <li
            class="goods-list"
            v-for="(goodsItem, goodsItemIdx) in orderItem.goods"
            :key="goodsItemIdx"
          >
            <GoodsItem :item="goodsItem" />
            <p class="notes" v-if="goodsItem.shipping_enable === 0">
              <img
                class="icon"
                src="https://img.ubo.vip/mp/selection/goods-detail/order-check/alarm.png"
              />
              <span>此地址暂不支持发货，请更换收货地址</span>
            </p>
          </li>
        </ul>
        <div class="shipping-fee" v-if="orderItem.shipping_amount !== '0.00'">
          <h3 class="title">运费</h3>
          <p class="content">¥{{ orderItem.shipping_amount }}</p>
        </div>
        <div class="order-subtotal">
          <h3 class="title">小计</h3>
          <p class="content">
            ¥{{
              (
                Number(orderItem.goods_amount) +
                Number(orderItem.shipping_amount)
              ).toFixed(2)
            }}
          </p>
        </div>
        <div class="order-remark">
          <h3 class="title">订单备注</h3>
          <textarea
            class="remark"
            v-model="remarkArr[index]"
            placeholder="选填，请先和商家协商一致"
          ></textarea>
        </div>
      </li>
    </ul>

    <div class="balance-wrap">
      <h3 class="title">可用余额</h3>
      <div class="content">
        <p class="desc" :class="{ active: isUsingBalance }">
          {{
            isUsingBalance
              ? `使用余额：¥${amountStructure?.user_money || "0.00"}`
              : `我的余额：¥${balance}`
          }}
        </p>
        <VantSwitch
          v-model="isUsingBalance"
          size="20px"
          active-color="#B87900"
        />
      </div>
    </div>

    <div class="bottom-bar">
      <div class="total-amount-wrap">
        <span>您需要支付：</span>
        <span class="total-amount"
          >¥{{ amountStructure && amountStructure.end_amount }}</span
        >
      </div>
      <div class="submit-btn" @click="submit">提交订单</div>
    </div>

    <div
      class="alipay-prompt"
      v-if="alipayPromptVisible"
      @click="alipayPromptVisible = false"
    >
      <img class="arrow" src="./images/arrow.png" />
      <div class="tip">
        <p>请在菜单中选择在浏览器中打开</p>
        <p>以完成支付</p>
      </div>
    </div>

    <Popup v-model:show="paymentPopupVisible" position="bottom" closeable round>
      <PaymentPopup @pay="generate" />
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { Switch as VantSwitch, Toast, Popup } from "vant";
import NavBar from "@/components/NavBar.vue";
import PaymentPopup from "@/components/PaymentPopup/index.vue";
import GoodsItem from "./components/GoodsItem.vue";

import { ref, onMounted, reactive, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { isInWechatEnv } from "@/utils/envJudgment";
import { usePayment } from "@/utils/payment";
import { PayType } from "@/api/common";
import {
  AmountStructure,
  ConsigneeInfo,
  generateOrder,
  getOrderInfo,
  OrderInfo,
  useBalance,
} from "./utils/api";

const route = useRoute();
const router = useRouter();
const { pay } = usePayment();

let type: 0 | 10;
let addressId: string;
let payId: number;

const consigneeInfo = ref<ConsigneeInfo | null>();
const orderList = ref<OrderInfo[]>([]);
const remarkArr = reactive<string[]>([]);
const balance = ref("");
const amountStructure = ref<AmountStructure>();
const isUsingBalance = ref(false);
const paymentPopupVisible = ref(false);
const alipayPromptVisible = ref(false);

watchEffect(
  () => toggleUseBalanceStatus && toggleUseBalanceStatus(isUsingBalance.value)
);

onMounted(() => {
  type = route.query.isFromCart === "true" ? 0 : 10;
  addressId = route.query.addressId as string;
  setOrderInfo();
});

const setOrderInfo = async () => {
  const { consignee, goods_list, user_money, total, payment_list } =
    (await getOrderInfo(type, addressId)) || {};
  consigneeInfo.value = consignee;
  orderList.value = goods_list;
  balance.value = user_money;
  amountStructure.value = total;
  payId = payment_list[0].pay_id;
};

const chooseAddress = () =>
  router.push({ path: "/mine/address", query: { isSelectAddress: "true" } });

const toggleUseBalanceStatus = (truthy: boolean) =>
  useBalance(truthy ? 1 : 0, type, JSON.stringify(amountStructure.value));

const submit = () => {
  if (!consigneeInfo.value) {
    Toast("请先填写收货地址");
    return;
  }

  if (!isUsingBalance.value) paymentPopupVisible.value = true;
  else generate();
};

const generate = async (payType?: PayType) => {
  if (payType) paymentPopupVisible.value = false;
  if (payType === PayType.alipay && isInWechatEnv) {
    alipayPromptVisible.value = true;
    return;
  }
  const ruIdArr: number[] = [];
  orderList.value.forEach((item) => {
    item.goods.forEach((_item) => {
      ruIdArr.push(_item.rec_id);
    });
  });
  const orderSn = await generateOrder(
    type,
    ruIdArr.join(),
    payId,
    isUsingBalance.value ? 1 : 0,
    remarkArr
  );
  if (orderSn && typeof orderSn === "string") {
    if (isUsingBalance.value) router.push("/mine/order");
    else payType && pay(orderSn, payType);
  }
};
</script>

<style lang="stylus" scoped>
.container
  padding 1.12rem .24rem 1.24rem
  .user-info-wrap
    display flex
    align-items center
    padding .3rem .2rem
    background #fff
    border-radius .16rem
    .user-info
      padding 0 .24rem
      flex 1
      font-size .28rem
      .name
        color #333
      .address
        margin-top .1rem
        color #999
  .order-lists
    margin-top .24rem
    .order-list
      padding .24rem
      background #fff
      border-radius .16rem
      .shop-info
        display flex
        align-items center
        .name
          margin-left .2rem
          color #333
          font-size .28rem
          font-weight 500
      .goods-lists
        .goods-list
          padding .24rem 0
          border-bottom .01rem solid #d8d8d8
          .notes
            display flex
            align-items center
            padding-top .1rem
            color #B87900
            font-size .24rem
            .icon
              margin-right .12rem
              width .3rem
              height .3rem
      .shipping-fee, .order-subtotal
        display flex
        justify-content space-between
        padding-top .2rem
        font-size .28rem
        .title
          color #333
        .content
          color #B87900
      .order-remark
        position relative
        padding-top .2rem
        font-size 0
        .title
          font-size .28rem
          color #333
        .remark
          margin-top .12rem
          padding .15rem
          width 6.2rem
          height 1.3rem
          font-size .28rem
          background #f4f4f4
          border none
          border-radius .1rem
  .balance-wrap
    display flex
    align-items center
    justify-content space-between
    margin-top .24rem
    padding .24rem
    background #fff
    border-radius .16rem
    .title
      color #333
      font-size .28rem
    .content
      display flex
      align-items center
      .desc
        margin-right .2rem
        color #333
        font-size .28rem
        &.active
          color #B87900
.bottom-bar
  position fixed
  left 0
  bottom 0
  display flex
  align-items center
  justify-content space-between
  padding .1rem .2rem
  width 100%
  background #fff
  .total-amount-wrap
    color #333
    font-size .3rem
    .total-amount
      color #B87900
  .submit-btn
    height .80rem
    width 2.20rem
    color #fff
    font-size .32rem
    font-weight 500
    text-align center
    line-height .80rem
    border-radius .40rem
    background #000
.alipay-prompt
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background rgba(0, 0, 0, 0.8)
  z-index 200
  .arrow
    position fixed
    right .6rem
    top .2rem
    width 1rem
    height 1rem
  .tip
    margin-top 1.5rem
    padding-right 1rem
    color #fff
    font-size .4rem
    text-align right
</style>
