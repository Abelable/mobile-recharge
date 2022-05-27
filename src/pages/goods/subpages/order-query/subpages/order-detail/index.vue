<template>
  <NavBar title="订单查询详情" />
  <div class="container">
    <div class="order-item" v-for="(item, index) in orderList" :key="index">
      <div class="header">订单：{{ item.order_no }}</div>
      <div class="content">
        <div class="info">
          <div class="label">收件人：</div>
          <div class="detail">{{ item.buyer }}</div>
        </div>
        <div class="info">
          <div class="label">所选套餐：</div>
          <div class="detail">{{ item.goods_name }}</div>
        </div>
        <div class="info">
          <div class="label">订单状态：</div>
          <div
            class="detail"
            :style="{ color: item.status === 3 ? 'red' : 'green' }"
          >
            {{ item.status_desc }}
          </div>
        </div>
        <div class="info">
          <div class="label">商家备注：</div>
          <div class="detail">
            {{ item.remark || "暂无备注" }}
          </div>
        </div>
        <div class="info">
          <div class="label">物流单号：</div>
          <div class="detail">{{ item.express_no || "暂无数据" }}</div>
        </div>
        <div class="info">
          <div class="label">物流公司：</div>
          <div class="detail">{{ item.express_name || "暂无数据" }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getOrderInfo } from "../../../../utils/api";
import type { OrderInfo } from "@/types";
import { Toast } from "vant";

const route = useRoute();

const orderList = ref<OrderInfo[]>([]);

onMounted(async () => {
  Toast.loading("加载中...");
  orderList.value = await getOrderInfo(route.query.phone as string);
  Toast.clear();
});
</script>

<style lang="stylus" scoped>
.container
  padding .88rem .24rem
  min-height 100vh
  background #f6f6f6
  .order-item
    margin-top .24rem
    background #fff
    border-radius .2rem
    .header
      display flex
      align-items center
      padding 0 .24rem
      height .8rem
      color #333
      font-size .28rem
      font-weight bold
      border-bottom 1px solid #f5f5f5
    .content
      padding .24rem
      .info
        display flex
        margin-bottom .24rem
        &:last-child
          margin-bottom 0
        .label
          width 1.4rem
          color #3976ff
          font-size .26rem
          text-align right
          font-weight 500
        .detail
          flex 1
          color #333
          font-size .26rem
</style>
