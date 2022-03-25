<template>
  <div class="goods-item">
    <SwipeCell right-width="80">
      <div class="inner">
        <Checkbox
          v-model="is_checked_goods"
          :disabled="
            !deleteBtnVisible && (item.is_seckill || !item.product_number)
          "
          checked-color="#ee0a24"
        />
        <img class="goods-img" :src="item.goods_thumb" @click="navToGoods" />
        <div class="goods-content">
          <div class="goods-name" :class="{ invalid: !item.product_number }">
            {{ item.goods_name }}
          </div>
          <template v-if="item.product_number && !item.is_seckill">
            <div
              class="goods-sku-wrap"
              v-if="item.goods_attr"
              @click="editSpec"
            >
              <span class="goods-sku">{{ item.goods_attr }}</span>
              <img
                class="sku-edit-icon"
                src="https://img.ubo.vip/mp/to-icon.png"
              />
            </div>
            <div class="goods-price-wrap">
              <div class="goods-price">
                <div class="price-shop">
                  <span>¥</span>
                  <span style="font-size: 0.36rem">{{ item.goods_price }}</span>
                </div>
                <div class="price-market">¥{{ item.market_price }}</div>
              </div>
              <Stepper
                v-model="goods_number"
                min="1"
                :max="item.product_number"
                integer
              />
            </div>
          </template>
          <div class="invalid-tips-wrap" v-if="!item.product_number">
            <div class="invalid-tips">请重新选择规格</div>
            <div class="reset-spec-btn" @click="editSpec">重选</div>
          </div>
          <div class="invalid-tips-wrap" v-if="item.is_seckill">
            <div class="invalid-tips" @click="navToGoods">
              秒杀中，请点击前往详情页下单>
            </div>
          </div>
        </div>
      </div>
      <template #right>
        <div class="delete-btn" @click="deleteGoods">删除</div>
      </template>
    </SwipeCell>
  </div>
</template>

<script setup lang="ts">
import { SwipeCell, Checkbox, Stepper } from "vant";

import { toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import _ from "lodash";
import { CartGoodsInfo } from "../utils/api";
import { getGoodsInfo } from "@/api/common";

const router = useRouter();

const props = defineProps<{
  item: CartGoodsInfo;
  cartIdx: number;
  goodsIdx: number;
  deleteBtnVisible: boolean;
}>();
const emit = defineEmits([
  "toggleGoodsChecked",
  "editCount",
  "editSpec",
  "deleteGoods",
]);

const { is_checked_goods, goods_number } = toRefs(props.item);

watch(is_checked_goods, () =>
  emit("toggleGoodsChecked", {
    val: is_checked_goods.value,
    cartIdx: props.cartIdx,
    goodsIdx: props.goodsIdx,
  })
);

watch(goods_number, () => debouncedEditCount());

const debouncedEditCount = _.debounce(
  () =>
    emit("editCount", {
      recId: props.item.rec_id,
      count: goods_number.value,
    }),
  300
);

const editSpec = async () => {
  const goodsInfo = await getGoodsInfo(props.item.goods_id);
  emit("editSpec", {
    actionType: 3,
    id: props.item.goods_id,
    recId: props.item.rec_id,
    img: goodsInfo.default_attr_img,
    name: goodsInfo.goods_name,
    basePrice: goodsInfo.shop_price,
    stock: goodsInfo.goods_number,
    specInfo: goodsInfo.attr_goods_info,
  });
};
const deleteGoods = () =>
  emit("deleteGoods", {
    id: props.item.rec_id,
    cartIdx: props.cartIdx,
    goodsIdx: props.goodsIdx,
  });
const navToGoods = () =>
  router.push({
    path: "/mall/goods",
    query: { id: props.item.goods_id },
  });
</script>

<style lang="stylus" scoped>
.goods-item
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
        color #333
        font-size .28rem
        font-weight 500
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
        &.invalid
          color #999
      .goods-sku-wrap
        display flex
        align-items center
        padding 0 .08rem
        height .42rem
        width fit-content
        background #f9f9f9
        border-radius .08rem
        .goods-sku
          flex 1
          color #999
          font-size .28rem
          overflow hidden
          text-overflow ellipsis
          display -webkit-box
          -webkit-line-clamp 1
          -webkit-box-orient vertical
        .sku-edit-icon
          width .12rem
          height .12rem
          transform rotate(90deg)
      .goods-price-wrap
        display flex
        align-items center
        justify-content space-between
        .goods-price
          font-size .24rem
          line-height 1
          .price-shop
            color #FD0B0A
            font-weight 500
          .price-market
            margin-left .10rem
            color #999
            text-decoration line-through
    .invalid-tips-wrap
      display flex
      align-items center
      .invalid-tips
        flex 1
        color #333
        font-size .26rem
        white-space nowrap
      .reset-spec-btn
        width 1.10rem
        height .46rem
        color #FD0807
        font-size .24rem
        text-align center
        line-height .42rem
        border-radius .23rem
        border .02rem solid #FD0807
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
