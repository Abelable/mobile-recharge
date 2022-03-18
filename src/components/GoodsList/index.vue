<template>
  <div class="goods-item" @click="navToGoodsDetail">
    <img style="width: 3.42rem; height: 3.42rem" :src="item?.goods_thumb" />
    <img
      class="spike-icon"
      v-if="item?.is_seckill"
      src="./images/spike-icon.png"
    />
    <div class="title">{{ item?.goods_name }}</div>
    <div class="price-wrap">
      <div class="price">
        <span v-if="item?.is_seckill">秒杀价 </span>
        <span>¥ </span>
        <span style="font-size: 0.36rem">{{ item?.shop_price }}</span>
      </div>
      <div class="sales" v-if="item?.sales_volume || item?.ghost_count">
        销量{{ salesCount }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, computed } from "vue";
import { useRouter } from "vue-router";
import { GoodsInfo } from "@/api/common";

const props = defineProps<{ item: GoodsInfo }>();

const router = useRouter();

const salesCount = computed(() => {
  const count = props.item.sales_volume || props.item.ghost_count;
  return count > 100000 ? `${(Number(count) / 10000).toFixed(1)}w` : count;
});

const navToGoodsDetail = () =>
  router.push({
    path: "/mall/goods",
    query: {
      id: props.item.goods_id,
    },
  });
</script>

<style lang="stylus" scoped>
.goods-item
  position relative
  margin-bottom .18rem
  width 3.42rem
  border-radius .12rem
  overflow hidden
  background #fff
  box-shadow 0 0 .02rem 0 rgba(0, 0, 0, 0.1)
  .spike-icon
    position absolute
    top 0
    right 0
    width .97rem
    height .80rem
  .title
    padding .08rem .16rem
    max-height .78rem
    color #333
    font-size .28rem
    line-height .36rem
    overflow hidden
    white-space normal
    text-overflow ellipsis
    display -webkit-box
    -webkit-line-clamp 2
    -webkit-box-orient vertical
  .price-wrap
    display flex
    align-items baseline
    justify-content space-between
    padding .08rem .16rem .16rem
    .price
      color #D0132B
      font-size .24rem
      font-weight 500
    .sales
      color #999
      font-size .24rem
</style>
