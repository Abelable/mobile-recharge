<template>
  <div class="service-item">
    <img
      style="width: 0.36rem; height: 0.36rem"
      src="https://img.ubo.vip/mp/selection/goods-detail/service-icon.png"
    />
    <div class="service-main">
      <div class="service-name">{{ item.name }}</div>
      <div class="service-content" wx:if="{{item.explains}}">
        {{ item.explains }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoodsServiceInfo } from "@/api/common";
defineProps<{ item: GoodsServiceInfo }>();
</script>

<style lang="stylus" scoped>
.service-item
  margin-bottom: .24rem
  display: flex
  align-items: flex-start
  .service-main
    padding-left: .10rem
    flex: 1
    .service-name
      font-size: .30rem
      font-weight: 500
      color: #333
      line-height: 1.3
    .service-content
      margin-top: .08rem
      font-size: .24rem
      color: #666
      line-height: .40rem
</style>
