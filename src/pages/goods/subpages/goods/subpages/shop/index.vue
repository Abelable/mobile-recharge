<template>
  <div class="container">
    <NavBar title="店铺" />

    <div class="info-wrap">
      <div class="avatar-wrap">
        <img class="avatar" :src="supplierInfo?.supplier_img" />
        <img
          class="firm-icon"
          v-if="supplierInfo?.is_enterprise"
          src="https://img.ubo.vip/mp/selection/goods-detail/firm-icon.png"
        />
      </div>
      <div class="name-wrap">
        <div class="name">{{ supplierInfo?.supplier_name }}</div>
        <div class="firm-tips" v-if="supplierInfo?.is_enterprise">
          有播企业店铺认证
        </div>
      </div>
    </div>

    <SplitLine title="店铺商品" />
    <div class="goods-lists" v-if="supplierInfo?.top_goods.length">
      <GoodsLists :list="supplierInfo?.top_goods" />
    </div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import SplitLine from "@/components/SplitLine.vue";
import GoodsLists from "@/components/GoodsList.vue";

import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getSupplierInfo, SupplierInfo } from "./utils/api";

const route = useRoute();

const supplierInfo = ref<SupplierInfo>();

onMounted(async () => {
  const id = route.query.id as string;
  supplierInfo.value = await getSupplierInfo(id);
});
</script>

<style lang="stylus" scoped>
.container
  padding-top .88rem
  .info-wrap
    display: flex
    align-items: center
    padding: .24rem
    .avatar-wrap
      position: relative
      width: .88rem
      height: .88rem
      font-size: 0
      .avatar
        width: 100%
        height: 100%
        border-radius: 50%
        background-image: url('https://img.ubo.vip/mp/default-ubo-icon.png')
        background-repeat: no-repeat
        background-size: 100% 100%
      .firm-icon
        position: absolute
        right: 0
        bottom: 0
        width: .30rem
        height: .30rem
    .name-wrap
      margin-left: .30rem
      .name
        color: #333
        font-size: .32rem
        font-weight: 600
      .firm-tips
        margin-top: .10rem
        width: 1.40rem
        height: .30rem
        color: #FFE5BD
        font-size: .16rem
        line-height: .30rem
        text-align: center
        background: linear-gradient(90deg, #434D5E 0%, #0F131A 100%)
        border-radius: .15rem
  .goods-lists
    padding 0 .24rem
</style>
