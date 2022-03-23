<template>
  <div class="invalid-goods-list">
    <SwipeCell right-width="80">
      <div class="inner">
        <Checkbox v-model="item.is_checked" :disabled="!deleteBtnVision" checked-color="#ee0a24" />
        <img class="goods-img" :src="item.goods_thumb">
        <div class="goods-content">
          <div class="goods-name">{{item.goods_name}}</div>
          <div class="invalid-tips-wrap">
            <div class="invalid-tips">宝贝已不能购买，请联系商家</div>
          </div>
        </div>
      </div>
      <template #right>
        <div class="delete-btn" @click="deleteInvalidGoods">删除</div>
      </template>
    </SwipeCell>
  </div>
</template>

<script>
import { SwipeCell, Checkbox } from 'vant'

export default {
  components: { SwipeCell, Checkbox },

  props: {
    item: Object,
    index: Number,
    deleteBtnVision: Boolean
  },

  watch: {
    'item.is_checked'() {
      this.$emit('toggleInvalidGoodsChecked')
    }
  },

  methods: {
    deleteInvalidGoods() {
      this.$emit('deleteInvalidGoods', { id: this.item.rec_id, index: this.index })
    }
  }
}
</script>

<style lang="stylus" scoped>
.invalid-goods-list
  margin-bottom .28rem
  &:last-child
    margin-bottom 0
  .inner
    display flex
    align-items center
    padding-left .18rem
    height 2rem
    background #fff
    .goods-img
      margin-left .18rem
      margin-right .18rem
      width 2rem
      height 2rem
      border-radius .16rem
    .goods-content
      display flex
      flex-direction column
      justify-content space-between 
      padding-right .18rem
      flex 1 
      height 2rem
      .goods-name
        color #999
        font-size .28rem
        font-weight 500
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
    .invalid-tips-wrap
      display flex
      align-items center
      .invalid-tips
        flex 1
        color #333
        font-size .26rem
        white-space nowrap
  .delete-btn
    display flex
    align-items center
    justify-content center
    width 80px
    height 100%
    color #333
    font-size .28rem
    background #F7CC9C
</style>