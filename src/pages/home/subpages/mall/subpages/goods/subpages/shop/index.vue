<template>
  <div class="container">
    <NavBar title="店铺" />

    <div class="info-wrap">
      <div class="avatar-wrap">
        <img class="avatar" :src="avatar">
        <img class="firm-icon" v-if="isFirm" src="https://img.ubo.vip/mp/selection/goods-detail/firm-icon.png">
      </div>
      <div class="name-wrap">
        <div class="name">{{name}}</div>
        <div class="firm-tips" v-if="isFirm">有播企业店铺认证</div>
      </div>
    </div>

    <SplitLine title="店铺商品" />
    <div class="goods-lists" v-if="goodsLists.length">
      <FallFlow :lists="goodsLists"/>
    </div>
  </div>
</template>

<script>
import NavBar from '@/components/NavBar'
import SplitLine from '@/components/SplitLine'
import FallFlow from '../../components/FallFlow'

import ShopService from './utils/shopService'

export default {
  components: { NavBar, SplitLine, FallFlow },

  data() {
    return {
      avatar: '',
      name: '',
      isFirm: false,
      goodsLists: []
    }
  },

  created() {
    this.setSupplierInfo(this.$route.query.id)
  },

  methods: {
    async setSupplierInfo(id) {
      const { supplier_img, supplier_name, is_enterprise, top_goods } = await new ShopService().getSupplierInfo(id)
      this.avatar = supplier_img
      this.name = supplier_name
      this.isFirm = is_enterprise
      this.goodsLists = top_goods
    }
  }
}
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
