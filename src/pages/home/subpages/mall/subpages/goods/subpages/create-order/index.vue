<template>
  <div class="container">
    <NavBar title="确认订单" />

    <div class="user-info-wrap" @click="chooseAddress">
      <img style="width: .42rem; height: .42rem;" src="https://img.ubo.vip/mp/selection/goods-detail/order-check/address-icon.png">
      <div class="user-info">
        <p class="name" v-if="userInfo">
          <span style="margin-right: .20rem;">{{userInfo.consignee}}</span>
          <span>{{userInfo.mobile}}</span>
        </p>
        <p class="address">{{userInfo ? (userInfo.province_name + userInfo.city_name + userInfo.district_name + userInfo.address) : '请选择合适的寄件地址'}}</p>
      </div>
      <img style="width: .32rem; height: .32rem;" src="https://img.ubo.vip/mp/selection/goods-detail/order-check/to-icon.png">
    </div>

    <ul class="order-lists">
      <li class="order-list" v-for="(orderList, index) in orderLists" :key="index">
        <div class="shop-info" v-if="orderList.shop_name">
          <img style="width: .32rem; height: .32rem;" :src="orderList.cart_type_name_img">
          <p class="name">{{orderList.shop_name}}</p>
        </div>
        <ul class="goods-lists">
          <li class="goods-list" v-for="(goodsList, goodsListIdx) in orderList.goods" :key="goodsListIdx">
            <GoodsList :item="goodsList" />
            <p class="notes" v-if="goodsList.shipping_enable === 0">
              <img class="icon" src="https://img.ubo.vip/mp/selection/goods-detail/order-check/alarm.png">
              <span>此地址暂不支持发货，请更换收货地址</span>
            </p>
          </li>
        </ul>
        <div class="shipping-fee" v-if="orderList.shipping_amount">
          <h3 class="title">运费</h3>
          <p class="content">¥{{orderList.shipping_amount}}</p>
        </div>
        <div class="order-subtotal">
          <h3 class="title">小计</h3>
          <p class="content">¥{{(Number(orderList.goods_amount) + Number(orderList.shipping_amount)).toFixed(2)}}</p>
        </div>
        <div class="order-remark">
          <h3 class="title">订单备注</h3>
          <textarea class="remark" v-model="remarkArr[index]" placeholder="选填，请先和商家协商一致"></textarea>
        </div>
      </li>
    </ul>

    <div class="balance-wrap">
      <h3 class="title">可用余额</h3>
      <div class="content">
        <p class="desc" :class="{active: isUsingBalance}">{{isUsingBalance ? `使用余额：¥${amountStructure.user_money || '0.00'}` : `我的余额：¥${balance}`}}</p>
        <VantSwitch v-model="isUsingBalance" size="20px" active-color="#B87900" />
      </div>
    </div>

    <div class="bottom-bar">
      <div class="total-amount-wrap">
        <span>您需要支付：</span>
        <span class="total-amount">¥{{amountStructure && amountStructure.end_amount}}</span>
      </div>
      <div class="submit-btn" @click="submit">提交订单</div>
    </div>

    <div class="alipay-prompt" v-if="alipayPromptVisible" @click="alipayPromptVisible = false">
      <img class="arrow" src="./images/arrow.png">
      <div class="tip">
        <p>请在菜单中选择在浏览器中打开</p>
        <p>以完成支付</p>
      </div>
    </div>

    <Popup v-model="paymentPopupVisible" position="bottom" closeable round>
      <PaymentPopup @pay="generateOrder"/>
    </Popup>
  </div>
</template>

<script>
import { Switch as VantSwitch, Toast, Popup } from 'vant'
import NavBar from '@/components/NavBar'
import PaymentPopup from '@/components/PaymentPopup'
import GoodsList from './components/GoodsList'

import getUrlParam from '@/utils/getUrlParam'
import OrderService from './utils/orderService'
import payment from '@/mixins/payment'

let orderService = new OrderService()

export default {
  components: { VantSwitch, Popup, NavBar, GoodsList, PaymentPopup },

  mixins: [payment],

  data() {
    return {
      code: getUrlParam('code') || '',
      addressId: this.$route.query.addressId || '',
      userInfo: null,
      orderLists: [],
      bonusLists: [],
      remarkArr: [],
      amountStructure: null, // 金额结构
      balance: 0,
      isUsingBalance: false,
      orderSn: '',
      paymentPopupVisible: false,
      alipayPromptVisible: false
    }
  },

  computed: {
    type() {
      return this.$route.query.isFromCart ? 0 : 10
    }
  },

  watch: {
    isUsingBalance(truthy) {
      this.toggleUseBalanceStatus(truthy)
    }
  },

  created() {
    this.isInWechatEnv && this.redirect()
    this.setOrderInfo()
  },

  methods: {
    async redirect() {
      if (this.code) {
        const { openid } = await orderService.getOpenid(this.code)
        this.openid = openid
      } else {
        const { redirect_url } = await orderService.getRedirectUrl()
        window.location.href = redirect_url
      }
    },

    async setOrderInfo() {
      const res = await orderService.getOrderInfo(this.type, this.addressId, () => { this.$router.push('/mall') }) || null
      if (res) {
        const { consignee, goods_list, bonus_list, user_money, total, payment_list } = res
        this.userInfo = consignee
        this.orderLists = goods_list
        this.bonusLists = bonus_list
        this.balance = user_money
        this.amountStructure = total

        this.ruIdArr = []
        goods_list.forEach(item => {
          item.goods.forEach(_item => {
            this.ruIdArr.push(_item.rec_id)
          })
        })
        this.payId = payment_list[0].pay_id
      }
    },

    async toggleUseBalanceStatus(truthy) {
      this.amountStructure = await orderService.useBalance(truthy ? 1 : 0, this.type, JSON.stringify(this.amountStructure))
      this.isUsingBalance = truthy
    },

    submit() {
      if (!this.userInfo) {
        Toast('请先填写收货地址')
        return
      }

      if (!this.isUsingBalance) this.paymentPopupVisible = true
      else this.generateOrder()
    },

    async generateOrder(payType) {
      if (payType) this.paymentPopupVisible = false
      if (payType === 'alipay' && this.isInWechatEnv) {
        this.alipayPromptVisible = true
        return
      }
      const orderSn = await orderService.generateOrder(this.type, this.ruIdArr.join(), this.payId, this.isUsingBalance ? 1 : 0, this.remarkArr)
      if (orderSn && typeof(orderSn) === 'string') {
        if (this.isUsingBalance) this.$router.push('/mine/order')
        else this.pay(orderSn, payType)
      }
    },

    chooseAddress() {
      this.$router.push('/mine/address')
    }
  }
}
</script>

<style lang="stylus" scoped>
.container
  padding 1.12rem .24rem 1.24rem
  .user-info-wrap
    display flex
    align-items center
    padding .3rem .2rem
    background #fff
    border-radius .16rem
    .user-info
      padding 0 .24rem
      flex 1
      font-size .28rem
      .name
        color #333
      .address
        margin-top .1rem
        color #999
  .order-lists
    margin-top .24rem
    .order-list
      padding .24rem
      background #fff
      border-radius .16rem
      .shop-info
        display flex
        align-items center
        .name
          margin-left .2rem
          color #333
          font-size .28rem
          font-weight 500
      .goods-lists
        .goods-list
          padding .24rem 0
          border-bottom .01rem solid #d8d8d8
          .notes
            display flex
            align-items center
            padding-top .1rem
            color #B87900
            font-size .24rem
            .icon
              margin-right .12rem
              width .3rem
              height .3rem
      .shipping-fee, .order-subtotal
        display flex
        justify-content space-between
        padding-top .2rem
        font-size .28rem
        .title
          color #333
        .content
          color #B87900
      .order-remark
        position relative
        padding-top .2rem
        font-size 0
        .title
          font-size .28rem
          color #333
        .remark
          margin-top .12rem
          padding .15rem
          width 6.2rem
          height 1.3rem
          font-size .28rem
          background #f4f4f4
          border none
          border-radius .1rem
  .balance-wrap
    display flex
    align-items center
    justify-content space-between
    margin-top .24rem
    padding .24rem
    background #fff
    border-radius .16rem
    .title
      color #333
      font-size .28rem
    .content
      display flex
      align-items center
      .desc
        margin-right .2rem
        color #333
        font-size .28rem
        &.active
          color #B87900
.bottom-bar
  position fixed
  left 0
  bottom 0
  display flex
  align-items center
  justify-content space-between
  padding .1rem .2rem
  width 100%
  background #fff
  .total-amount-wrap
    color #333
    font-size .3rem
    .total-amount
      color #B87900
  .submit-btn
    height .80rem
    width 2.20rem
    color #fff
    font-size .32rem
    font-weight 500
    text-align center
    line-height .80rem
    border-radius .40rem
    background #000
.alipay-prompt
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  background rgba(0, 0, 0, 0.8)
  z-index 200
  .arrow
    position fixed
    right .6rem
    top .2rem
    width 1rem
    height 1rem
  .tip
    margin-top 1.5rem
    padding-right 1rem
    color #fff
    font-size .4rem
    text-align right 
</style>
