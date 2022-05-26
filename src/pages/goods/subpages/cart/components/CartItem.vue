<template>
  <div class="cart-item">
    <div class="header">
      <Checkbox v-model="checked" checked-color="#ee0a24" />
      <div class="shop-info" @click="navToShop">
        <img style="width: 0.3rem; height: 0.3rem" :src="item.store_logo" />
        <div class="shop-name">{{ item.store_name }}</div>
        <img
          style="width: 0.2rem; height: 0.2rem"
          src="https://img.ubo.vip/mp/to-icon.png"
        />
      </div>
    </div>
    <div class="goods-list-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Checkbox } from "vant";

import { toRef, watchEffect } from "vue";
import { useRouter } from "vue-router";
import { CartInfo } from "../utils/api";

const router = useRouter();

const props = defineProps<{ item: CartInfo; cartIndex: number }>();
const emit = defineEmits(["toggleCartChecked"]);

const checked = toRef(props.item, "checked");

watchEffect(() =>
  emit("toggleCartChecked", { val: checked.value, idx: props.cartIndex })
);

const navToShop = () =>
  router.push({
    path: "/mall/goods/shop",
    query: { id: props.item.supplier_id },
  });
</script>

<style lang="stylus" scoped>
.cart-item
  margin-bottom .24rem
  padding .32rem 0
  background #fff
  border-radius .12rem
  overflow hidden
  .header
    display flex
    align-items center
    padding-left .18rem
    .shop-info
      display flex
      align-items center
      margin-left .18rem
      .shop-name
        margin-left .16rem
        color #333
        font-size .28rem
        font-weight 500
  .goods-list-wrap
    margin-top .32rem
</style>
