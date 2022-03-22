<template>
  <NavBar title="我的订单">
    <template v-slot:custom-menu>
      <ul class="menu-lists">
        <li
          class="menu-list"
          :class="{ active: index === selectedMenuIdx }"
          v-for="(item, index) in menuList"
          :key="index"
          @click="selectMenu(index)"
        >
          {{ item.name }}
        </li>
      </ul>
    </template>
  </NavBar>

  <PullRefresh v-model="refreshing" @refresh="onRefresh">
    <List
      class="order-lists-wrap"
      v-model="loading"
      :finished="finished"
      @load="onLoadMore"
      finished-text="没有更多了"
    >
      <OrderItem
        v-for="(item, index) in orderLists[selectedMenuIdx]"
        :key="index"
        :item="item"
        @refresh="onRefresh"
        @pay="showPaymentPopup"
      />
    </List>
  </PullRefresh>

  <Popup v-model="paymentPopupVisible" position="bottom" closeable round>
    <PaymentPopup @pay="prepay" />
  </Popup>
</template>

<script setup lang="ts">
import { PullRefresh, List, Popup } from "vant";
import NavBar from "@/components/NavBar.vue";
import PaymentPopup from "@/components/PaymentPopup/index.vue";
import OrderItem from "./components/OrderItem.vue";

import { ref, reactive, onMounted } from "vue";
import { useRoute } from "vue-router";
import _ from "lodash";
import { usePayment } from "@/utils/payment";
import { useOrderList } from "./utils";
import { PayType } from "@/api/common";
import { OrderInfo } from "@/types";

const route = useRoute();
const { pay } = usePayment();
const { orderList, setOrderList } = useOrderList();

const menuList = [
  { name: "全部", status: 0 },
  { name: "待付款", status: 1 },
  { name: "待发货", status: 5 },
  { name: "待收货", status: 2 },
  { name: "已完成", status: 3 },
];
const pageList = [0, 0, 0, 0, 0];
let orderSn = "";

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const selectedMenuIdx = ref(0);
const orderLists = reactive<OrderInfo[][]>([[], [], [], [], []]);
const paymentPopupVisible = ref(false);

onMounted(
  () =>
    (selectedMenuIdx.value = menuList.findIndex(
      (item) => item.status === Number(route.query.status)
    ))
);

const selectMenu = (index: number) => {
  if (index !== selectedMenuIdx.value) {
    selectedMenuIdx.value = index;
    if (!orderLists[selectedMenuIdx.value].length) setOrderLists(true);
  }
};
const onLoadMore = _.debounce(() => setOrderLists(), 200);
const onRefresh = () => setOrderLists(true);

const showPaymentPopup = (sn: string) => {
  paymentPopupVisible.value = true;
  orderSn = sn;
};

const prepay = (type: PayType) => {
  paymentPopupVisible.value = false;
  pay(orderSn, type);
};

const setOrderLists = async (init = false) => {
  if (init) {
    pageList[selectedMenuIdx.value] = 0;
  }
  const status = menuList[selectedMenuIdx.value].status;
  const page = ++pageList[selectedMenuIdx.value];
  await setOrderList(status, page);
  loading.value = false;
  refreshing.value = false;
  if (orderList.value.length) {
    orderLists[selectedMenuIdx.value] = init
      ? orderList.value
      : [...orderLists[selectedMenuIdx.value], ...orderList.value];
  } else finished.value = true;
};
</script>

<style lang="stylus" scoped>
.menu-lists
  display flex
  align-items center
  height .8rem
  background #fff
  box-shadow 0 .02rem .02rem 0 rgba(0,0,0,0.05)
  .menu-list
    flex 1
    text-align center
    color #666
    font-size .3rem
    &.active
      color #000
      font-size .34rem
      font-weight 500
.order-lists-wrap
  margin-top 1.92rem
  padding 0 .24rem
  min-height calc(100vh - 1.68rem)
</style>
