<template>
  <NavBar title="我的售后" />

  <PullRefresh v-model="isRefreshing" @refresh="onRefresh">
    <List
      class="container"
      v-model="isLoading"
      :finished="isFinished"
      finished-text="没有更多了"
      @load="onLoadMore"
    >
      <OrderItem
        v-for="(item, index) in refundOrderList"
        :key="index"
        :item="item"
      />
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { PullRefresh, List } from "vant";
import NavBar from "@/components/NavBar.vue";
import OrderItem from "./components/OrderItem.vue";
import { useRefundOrderList } from "./utils/api";

const {
  refundOrderList,
  setRefundOrderList,
  isLoading,
  isFinished,
  isRefreshing,
} = useRefundOrderList();

const onLoadMore = () => setRefundOrderList();
const onRefresh = () => setRefundOrderList(true);
</script>

<style lang="stylus" scoped>
.container
  margin-top 0.88rem
  padding .24rem
  min-height: 100vh
</style>
