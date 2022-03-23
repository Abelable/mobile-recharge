<template>
  <div class="container">
    <NavBar title="购物车">
      <template v-slot:custom-btn>
        <div class="edit-icon" v-if="cartList.length" @click="deleteBtnVision = !deleteBtnVision">{{deleteBtnVision ? '完成' : '管理'}}</div>
      </template>
    </NavBar>

    <CartList v-for="(item, index) in cartList" :key="index" :item="item" :cartIndex="index" @toggleCartChecked="toggleCartChecked">
      <GoodsList 
        v-for="(goodsItem, goodsItemIndex) in item.goods" :key="goodsItemIndex" 
        :item="goodsItem" :cartIdx="index" :goodsIdx="goodsItemIndex" :deleteBtnVision="deleteBtnVision" 
        @toggleGoodsChecked="toggleGoodsChecked" @editCount="editCount" @editSpec="showSpecPopup" @deleteGoods="deleteGoods"/>
    </CartList>

    <div class="invalid-goods-lists-wrap" v-if="invalidGoodsList.length">
      <div class="header">
        <div>失效宝贝{{invalidGoodsList.length}}件</div>
        <div class="delete-btn" @click="emptyInvalidGoods">清空失效宝贝</div>
      </div>
      <div class="content">
        <InvalidGoodsList 
          v-for="(item, index) in invalidGoodsList" :key="index" 
          :item="item" :index="index" :deleteBtnVision="deleteBtnVision" 
          @deleteInvalidGoods="deleteInvalidGoods" @toggleInvalidGoodsChecked="acount"/>
      </div>
    </div>

    <div class="empty-illus" v-if="!cartList.length && !invalidGoodsList.length">
      <div class="empty-desc">还没有宝贝哦，快去挑选喜欢的宝贝吧～</div>
      <div class="visit-btn" @click="navToMall">去逛逛</div>
    </div>

    <div class="bottom-bar" v-if="cartList.length">
      <div class="select-all" @click="toggleAllChecked">
        <Checkbox v-model="isSelectAll" checked-color="#ee0a24" />
        <span class="tip">全选</span>
      </div>
      <div class="bar-main" v-if="!deleteBtnVision">
        <div class="total-price" v-if="!isCalculating">
          <span style="color: #333; font-weight: 400;">合计：</span>
          <span>¥</span>
          <span style="font-size: .36rem;">{{totalPrice}}</span>
        </div>
        <Loading v-if="isCalculating" size="20" color="#ee0a24">价格计算中...</Loading>
        <div class="submit" :class="{ active: selectedCount }" @click="submit">
          <span>结算</span>
          <span v-if="selectedCount">({{selectedCount}})</span>
        </div>
      </div>
      <div class="delete-btn" :class="{ active: selectedCount }" v-if="deleteBtnVision" @click="deleteGoodsList">删除</div>
    </div>

    <Popup v-model="specPopupVisible" position="bottom" closeable round>
      <SpecPopup :actionType="goodsInfo.actionType" :recId="goodsInfo.recId" :goodsId="goodsInfo.id" :goodsImg="goodsInfo.img" :goodsName="goodsInfo.name" :basePrice="goodsInfo.basePrice" :stock="goodsInfo.stock" :specInfo="goodsInfo.specInfo" @hideSpecPopup="hideSpecPopup" />
    </Popup>
  </div>
</template>

<script>
import { Popup, Checkbox, Loading, Dialog } from 'vant'
import NavBar from '@/components/NavBar'
import SpecPopup from '@/components/SpecPopup'
import CartList from './components/CartList'
import GoodsList from './components/GoodsList'
import InvalidGoodsList from './components/InvalidGoodsList'

import _ from 'lodash'
import { mapActions } from 'vuex'
import CartService from './utils/cartService'

let cartService = new CartService()

export default {
  components: { Popup, Checkbox, Loading, NavBar, SpecPopup, CartList, GoodsList, InvalidGoodsList },

  data() {
    return {
      deleteBtnVision: false,
      cartList: [],
      invalidGoodsList: [],
      selectedCount: 0,
      isSelectAll: false,
      totalPrice: '0.00',
      isCalculating: false,
      specPopupVisible: false,
      goodsInfo: {}
    }
  },

  watch: {
    deleteBtnVision() {
      this.acount()
    }
  },

  created() {
    this.setCartList()
  },

  methods: {
    ...mapActions(['updateCartCount']),

    async setCartList() {
      const { cart_list = [], not_on_sale = [] } = await cartService.getCartList() || []
      this.cartList = cart_list
      this.invalidGoodsList = not_on_sale
      this.acount()
    },

    toggleCartChecked({ val, idx }) {
      this.cartList[idx].check = val
      let goodsLists = this.cartList[idx].goods
      goodsLists.map(item => {
        if (this.deleteBtnVision || (!this.deleteBtnVision && item.product_number)) item.is_checked_goods = val
      })
      this.cartList[idx].goods = goodsLists
      this.debouncedAcount()
    },

    toggleGoodsChecked({ val, cartIdx, goodsIdx }) {
      this.cartList[cartIdx].goods[goodsIdx].is_checked_goods = val
      let unCheckedIndex = this.cartList[cartIdx].goods.findIndex(item => {
        if (this.deleteBtnVision || (!this.deleteBtnVision && item.product_number)) return item.is_checked_goods === false
      })
      this.cartList[cartIdx].checked = unCheckedIndex === -1
      this.debouncedAcount()
    },

    toggleAllChecked() {
      this.isSelectAll = !this.isSelectAll
      if (this.deleteBtnVision) {
        this.cartList.map(item => {
          item.checked = this.isSelectAll
          item.goods.map(_item => {
            _item.is_checked_goods = this.isSelectAll
          })
        })
        this.invalidGoodsList.map(item => {
          item.is_checked = this.isSelectAll
        })
        this.debouncedAcount()
      } else {
        this.cartList.map(item => {
          item.checked = this.isSelectAll
          item.goods.map(_item => {
            if (_item.product_number) _item.is_checked_goods = this.isSelectAll
          })
        })
        this.debouncedAcount()
      }
    },

    debouncedAcount: _.debounce(function() {
      this.acount()
    }, 200),

    async acount() {
      this.totalCount = 0
      let selectedCount = 0
      this.selectedRecIdArr = []

      if (this.deleteBtnVision) {
        this.cartList.forEach(item => {
          item.goods.forEach(_item => {
            if (_item.is_checked_goods) {
              this.selectedRecIdArr.push(_item.rec_id)
              selectedCount += _item.goods_number
            }
            this.totalCount += _item.goods_number
          })
        })
        this.invalidGoodsList.forEach(item => {
          if (item.is_checked) {
            this.selectedRecIdArr.push(item.rec_id)
            selectedCount += 1
          }
          this.totalCount += 1
        })
        this.selectedCount = selectedCount
        this.isSelectAll = (selectedCount && selectedCount === this.totalCount) ? true : false
      } else {
        this.cartList.forEach(item => {
          item.goods.forEach(_item => {
            if (_item.product_number && _item.is_checked_goods) {
              this.selectedRecIdArr.push(_item.rec_id)
              selectedCount += _item.goods_number
            }
            this.totalCount += _item.goods_number
          })
        })

        this.selectedCount = selectedCount
        this.isSelectAll = (selectedCount && selectedCount === this.totalCount) ? true : false

        this.isCalculating = true
        const { goods_amount_formated } = await cartService.getCartAmount(this.selectedRecIdArr.join()) || {}
        this.totalPrice = goods_amount_formated.slice(1)
        this.isCalculating = false
        this.updateCartCount()
      }
    },

    async editCount({ recId, count }) {
      this.isCalculating = true
      const { goods_amount_formated, cart_number } = await cartService.updateCartGoods({ recId, count })
      this.totalPrice = goods_amount_formated
      this.selectedCount = cart_number
      this.isCalculating = false
      this.updateCartCount()
    },

    deleteGoodsList() {
      this.selectedCount && Dialog.confirm({ title: '提示', message: '确定删除商品吗？' }).then(async () => {
        await cartService.deleteCartList(this.selectedRecIdArr.join())
        this.setCartList()
      })
    },

    deleteGoods({ id, cartIdx, goodsIdx }) {
      this.cartList[cartIdx].goods.splice(goodsIdx, 1)
      if (!this.cartList[cartIdx].goods.length) this.cartList.splice(cartIdx, 1)
      cartService.deleteCartList(id)
    },

    emptyInvalidGoods() {
      const recIdArr = this.invalidGoodsList.map(item => item.rec_id)
      cartService.deleteCartList(recIdArr.join())
      this.invalidGoodsList = []
    },

    deleteInvalidGoods({ id, index }) {
      this.invalidGoodsList.splice(index, 1)
      cartService.deleteCartList(id)
    },

    showSpecPopup(goodsInfo) {
      this.specPopupVisible = true
      this.goodsInfo = goodsInfo
    },

    hideSpecPopup() {
      this.specPopupVisible = false
      this.setCartList()
    },

    async submit() {
      await cartService.cartCheck(this.selectedRecIdArr.join())
      this.$router.push({
        path: '/mall/goods/create-order',
        query: { isFromCart: true }
      })
    },

    navToMall() {
      this.$router.push('/mall')
    }
  }
}
</script>

<style lang="stylus" scoped>
.edit-icon
  padding 0 .20rem
  height .42rem
  color #fff
  font-size .30rem
  line-height .4rem
  border-radius .21rem
  border .01rem solid rgba(255,255,255,0.3)
.empty-illus
  position fixed
  top 50%
  left 50%
  transform translate(-50%, -50%)
  display flex
  flex-direction column
  align-items center
  .empty-desc
    color #666
    font-size .28rem
    white-space nowrap
  .visit-btn
    margin-top .56rem
    width 1.50rem
    height .60rem
    color #FD0B0A
    font-size .28rem
    text-align center
    line-height .56rem
    border-radius .30rem
    border .02rem solid #FD0B0A
.container
  padding 1.12rem .24rem 1rem
  .invalid-goods-lists-wrap
    margin-bottom .24rem
    padding .32rem 0
    background #fff
    border-radius .12rem
    overflow hidden
    .header
      display flex
      align-items center
      justify-content space-between
      padding 0 .18rem
      color #333
      font-size .28rem
      font-weight 500
      .delete-btn
        color #666
        font-weight 400
    .content
       margin-top .32rem
.bottom-bar
  position fixed
  left 0
  bottom 0
  display flex
  align-items center
  justify-content space-between
  width 100%
  background-color #fff
  box-shadow 0 -0.02rem .02rem 0 rgba(0,0,0,0.05)
  z-index 100
  .select-all
    display flex
    align-items center
    padding-left .2rem
    .tip
      margin-left .2rem
      font-size .24rem
  .bar-main
    display flex
    align-items center
    .total-price
      font-size .24rem
      color #FD0B0A
      font-weight 500
  .submit, .delete-btn
    margin .10rem .20rem
    height .80rem
    width 2.20rem
    color #999
    background #F2F2F2
    font-size .32rem
    font-weight 500
    text-align center
    line-height .80rem
    border-radius .40rem
    &.active
      color #fff
      background #FD0B0A
</style>
