<template>
  <div class="spec-popup" :class="{ 'is-iphoneX': isIphoneX }">
    <div class="goods-info-wrap">
      <img class="img" :src="specImg || goodsImg" />
      <div class="goods-info">
        <div class="name" v-if="goodsName">{{ goodsName }}</div>
        <div class="price">￥{{ specPrice || basePrice }}</div>
        <div class="stock">库存{{ specStock || stock }}</div>
        <p class="tips">请选择规格</p>
      </div>
    </div>
    <ul class="spec-lists">
      <li
        class="spec-list"
        v-for="(item, index) in specInfo.specification"
        :key="index"
      >
        <div class="split-line">{{ item.name }}</div>
        <ul class="options">
          <li
            class="option"
            :class="{ selected: specIdArr[index] === spec.id }"
            v-for="(spec, specIdx) in item.values"
            :key="specIdx"
            @click="selectSpec(spec, index)"
          >
            {{ spec.label }}
          </li>
        </ul>
      </li>
      <li
        class="spec-list"
        v-if="actionType === 0 || actionType === 1 || actionType === 2"
      >
        <div class="split-line">数量</div>
        <div class="stepper-wrap">
          <Stepper v-model="count" min="1" :max="specStock || stock" integer />
        </div>
      </li>
    </ul>
    <div class="btns-wrap" v-if="actionType === 0">
      <div class="btn add-cart" @click="addCart">加入购物车</div>
      <div class="btn direct-buy" @click="directBuy">立即购买</div>
    </div>
    <div
      class="finish-btn"
      :class="{
        'in-cart': actionType === 3,
        'apply-free-sample': actionType === 4,
      }"
      v-else
      @click="finish"
    >
      {{ actionType === 4 ? "报名支付" : "完成" }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Stepper, Toast } from "vant";

import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { isIphoneX } from "@/utils/envJudgment";
import * as api from "@/api/common";

interface SpecDetailInfo {
  id: number;
  label: string;
  goods_attr_thumb: string;
  format_price: string;
}
interface SpecInfo {
  specification: { name: string; values: SpecDetailInfo[] }[];
  attr_num: { [key in string]: number };
}
interface PropsType {
  actionType: number;
  recId: number;
  goodsId: string;
  goodsImg: string;
  goodsName: string;
  basePrice: string;
  stock: number;
  specInfo: SpecInfo;
}

const router = useRouter();

const props = defineProps<PropsType>();
const emit = defineEmits(["commitSelectedSpec", "hideSpecPopup"]);

const specLabelArr: string[] = [];
const specPriceArr: string[] = [];

const specImg = ref("");
const specPrice = ref(0);
const specStock = ref(0);
const specIdArr = reactive<(number | undefined)[]>([]);
const count = ref(1);

const selectSpec = (info: SpecDetailInfo, index: number) => {
  const { id, label, goods_attr_thumb, format_price } = info;
  specIdArr[index] = id;
  specImg.value = goods_attr_thumb;
  specPriceArr[index] = format_price;
  specLabelArr[index] = label;
  if (
    specIdArr.length === props.specInfo.specification.length &&
    !specIdArr.includes(undefined)
  ) {
    // 计算价格
    specPrice.value = Number(props.basePrice);
    specPriceArr.forEach((price) => (specPrice.value += Number(price)));
    // 取库存
    specStock.value = props.specInfo.attr_num[specLabelArr.join("")];
    // 向父组件传递所选规格描述
    emit("commitSelectedSpec", specLabelArr.join(""));
  }
};

const finish = () => {
  switch (props.actionType) {
    case 1:
      addCart();
      break;
    case 2:
      directBuy();
      break;
    case 3:
      editCartSpec();
      break;
  }
};

const addCart = async () => {
  if (check()) {
    await api.addCart(props.goodsId, specIdArr, count.value, 0);
    // updateCartCount();
    emit("hideSpecPopup");
    Toast("添加成功");
  }
};
const directBuy = async () => {
  if (check()) {
    await api.addCart(props.goodsId, specIdArr, count.value);
    router.push("/mall/goods/create-order");
    emit("hideSpecPopup");
  }
};
const editCartSpec = async () => {
  if (check()) {
    await api.updateCartGoods({
      rec_id: props.recId,
      num: count.value,
      spec: specIdArr.join(),
    });
  }
};

const check = () => {
  let showToastTitle = "";
  const specification = props.specInfo.specification;
  if (specification.length) {
    if (specIdArr.length < specification.length) {
      showToastTitle = `请选择${specification[specIdArr.length].name}`;
    } else {
      const unselectedIdx = specIdArr.findIndex((item) => item === undefined);
      if (unselectedIdx !== -1) {
        showToastTitle = `请选择${specification[unselectedIdx].name}`;
      }
    }
  }
  if (showToastTitle) Toast(showToastTitle);
  return !showToastTitle;
};

// import { mapActions } from "vuex";
//     ...mapActions(["updateCartCount"]),
</script>

<style lang="stylus" scoped>
.spec-popup
  padding 12px
  &.is-iphoneX
    padding-bottom 20px
  .goods-info-wrap
    display flex
    margin-bottom .24rem
    .img
      width 2rem
      height 2rem
      border-radius .12rem
      background-image url('https://img.ubo.vip/mp/default-ubo-icon.png')
      background-repeat no-repeat
      background-size 100% 100%
      background-color #f4f4f4
    .goods-info
      display flex
      flex-direction column
      justify-content space-around
      margin-left .28rem
      height 2rem
      line-height 1.45
      .name
        padding-right .6rem
        color #333
        font-size .30rem
        font-weight 500
        overflow hidden
        text-overflow ellipsis
        display -webkit-box
        -webkit-line-clamp 2
        -webkit-box-orient vertical
      .price
        color #E82631
        font-size .34rem
      .stock
        color #999
        font-size .24rem
      .tips
        color #333
        font-size .24rem
  .spec-lists
    height 5rem
    overflow-x hidden
    overflow-y scroll
    .spec-list
      .split-line
        position relative
        padding-right .2rem
        width fit-content
        color #333
        font-size .30rem
        font-weight 500
        background-color #fff
        &::after
          position absolute
          top 50%
          right calc(-100vw + 24px + 100%)
          transform translateY(-50%)
          content ''
          height .01rem
          width calc(100vw - 24px - 100%)
          background #D9D9D9
      .options
        display flex
        flex-wrap wrap
        margin-top .24rem
        .option
          margin-right .24rem
          margin-bottom  .24rem
          padding 0 .20rem
          height .64rem
          color #333
          font-size .24rem
          line-height .62rem
          white-space nowrap
          border-radius .08rem
          border .02rem solid #F6F6F6
          background #F6F6F6
          &.selected
            border .02rem solid #E1C7AA
            background rgb(254, 244, 245)
      .stepper-wrap
        display: flex;
        justify-content: flex-end;
        margin-top .24rem
  .btns-wrap
    margin-top .3rem
    display flex
    justify-content space-between
    .btn
      width 3.40rem
      height .80rem
      font-size .32rem
      font-weight 500
      line-height .8rem
      text-align center
      border-radius .40rem
      &.add-cart
        color #FFE5BD
        background linear-gradient(90deg, #404A5C 0%, #0F131A 100%)
      &.direct-buy
        color #0F131A
        background linear-gradient(270deg, #FFD699 0%, #FFE5BD 100%)
  .finish-btn
    margin-top .3rem auto 0
    height .80rem
    width 6.80rem
    color #fff
    font-size .32rem
    font-weight 500
    text-align center
    line-height .80rem
    background #000
    border-radius .40rem
    &.in-cart
      background #FD0B0A
    &.apply-free-sample
      color #0F131A
      background linear-gradient(270deg, #FFD699 0%, #FFE5BD 100%)
      border-radius 12rpx
</style>
