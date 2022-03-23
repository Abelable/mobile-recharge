<template>
  <div class="list" @click="navToGoods">
    <img class="cover" :src="item.goods_thumb">
    <div class="info">
      <p class="name">{{item.goods_name}}</p>
      <div class="price-wrap">
        <div class="price">
          <span class="shop-price">{{item.goods_price_format}}</span>
          <span class="market-price">{{item.market_price_format}}</span>
        </div>
        <div class="count">x {{item.goods_number}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    item: Object
  },

  methods: {
    navToGoods() {
      this.$router.push({
        path: '/mall/goods',
        query: { id: this.item.goods_id }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.list
  display flex
  .cover
    width 1.60rem
    height 1.60rem
    fit-content cover
    border-radius .08rem
  .info
    display flex
    flex-direction column
    justify-content space-between
    margin-left .2rem
    flex 1
    height 1.6rem
    .name
      color #333
      font-size .28rem
    .price-wrap
      display flex
      justify-content space-between
      .price
        font-size .28rem
        .shop-price
          margin-right .2rem
          color #B87900
        .market-price
          color #999
          text-decoration line-through
      .count
        color #666
        font-size .28rem
</style>