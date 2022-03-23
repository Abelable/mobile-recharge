<template>
  <div class="cart-list">
    <div class="header">
      <Checkbox v-model="item.checked" checked-color="#ee0a24" />
      <div class="shop-info" @click="navToShop">
        <img style="width: .30rem; height: .30rem;" :src="item.store_logo">
        <div class="shop-name">{{item.store_name}}</div>
        <img style="width: .20rem; height: .20rem;" src="https://img.ubo.vip/mp/to-icon.png">
      </div>
    </div>
    <div class="goods-lists-wrap">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { Checkbox } from 'vant'

export default {
  components: { Checkbox },

  props: {
    item: Object,
    cartIndex: Number
  },

  watch: {
    'item.checked'(truthy) {
      this.$emit('toggleCartChecked', { val: truthy, idx: this.cartIndex })
    }
  },

  methods: {
    navToShop() {
      this.$router.push({
        path: '/mall/goods/shop',
        query: { id: this.item.supplier_id }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
.cart-list
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
  .goods-lists-wrap
    margin-top .32rem
</style>
