<template>
  <div class="goods-list" @click="navToGoodsDetail">
    <img style="width: 3.42rem; height: 3.42rem;" :src="item.goods_thumb || item.original_img">
    <img class="spike-icon" v-if="item.is_seckill" src="./images/spike-icon.png">
    <div class="title">{{item.goods_name}}</div>
    <div class="price-wrap">
      <div class="price">
        <span v-if="item.is_seckill">秒杀价 </span>
        <span>¥ </span>
        <span style="font-size: .36rem">{{item.shop_price}}</span>
      </div>
      <div class="sales" v-if="item.sales_volume || item.ghost_count">销量{{(item.sales_volume || item.ghost_count) | formatCount}}</div>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['routerRefresh'],

  props: {
    item: Object
  },

  filters: {
    formatCount(count) {
      return count > 100000 ? `${(count / 10000).toFixed(1)}w` : count
    }
  },

  methods: {
    navToGoodsDetail() {
      this.$router.push({ 
        path: '/mall/goods',
        query: {
          id: this.item.id || this.item.goods_id
        }
      })
      if (this.$route.path === '/mall/goods') this.routerRefresh()
    }
  }
}
</script>

<style lang="stylus" scoped>
.goods-list
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