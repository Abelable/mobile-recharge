<template>
  <div class="container">
    <NavBar title="订单物流" />

    <div class="info-wrap">
      <div>物流公司：{{ shippingInfo?.shipping_name }}</div>
      <div>运单编号：{{ shippingInfo?.invoice_no }}</div>
    </div>

    <ul class="shipping-lists">
      <li
        class="shipping-list"
        v-for="(item, index) in shippingInfo?.list"
        :key="index"
      >
        <div class="line"></div>
        <div class="desc-wrap">
          <div class="desc">{{ item.context }}</div>
          <div>{{ item.time }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useShippingInfo } from "../utils/api";

const route = useRoute();
const { shippingInfo, setShippingInfo } = useShippingInfo();

onMounted(() => setShippingInfo(route.query.id as string));
</script>

<style lang="stylus" scoped>
.container
  padding 1.12rem .24rem .24rem
  .info-wrap
    padding .2rem .30rem
    color #333
    font-size .28rem
    line-height 2
    font-weight 500
    background #fff
    border-radius .20rem
  .shipping-lists
    margin-top .24rem
    padding .3rem
    background #fff
    border-radius .20rem
    .shipping-list
      display flex
      padding-left .10rem
      color #b4b4b4
      font-size .24rem
      .line
        margin-right .30rem
        position relative
        width .05rem
        height 1.50rem
        background #b4b4b4
        &::before
          position absolute
          left -0.10rem
          top 0
          content ''
          width .25rem
          height .25rem
          border-radius 50%
          background #b4b4b4
      &:first-child
        color #000
        .line
          background #000
          &::before
            background #000
      &:last-child .line::before
        background #000
      .desc
        margin-bottom .10rem
        line-height 1.1
</style>
