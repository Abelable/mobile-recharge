<template>
  <div class="container">
    <NavBar title="购物车">
      <template v-slot:custom-btn>
        <div
          class="edit-icon"
          v-if="cartList.length"
          @click="deleteBtnVisible = !deleteBtnVisible"
        >
          {{ deleteBtnVisible ? "完成" : "管理" }}
        </div>
      </template>
    </NavBar>

    <CartItem
      v-for="(item, index) in cartList"
      :key="index"
      :item="item"
      :cartIndex="index"
      @toggleCartChecked="toggleCartChecked"
    >
      <GoodsItem
        v-for="(goodsItem, goodsItemIndex) in item.goods"
        :key="goodsItemIndex"
        :item="goodsItem"
        :cartIdx="index"
        :goodsIdx="goodsItemIndex"
        :deleteBtnVisible="deleteBtnVisible"
        @toggleGoodsChecked="toggleGoodsChecked"
        @editCount="editCount"
        @editSpec="showSpecPopup"
        @deleteGoods="deleteGoods"
      />
    </CartItem>

    <div class="invalid-goods-lists-wrap" v-if="invalidGoodsList.length">
      <div class="header">
        <div>失效宝贝{{ invalidGoodsList.length }}件</div>
        <div class="delete-btn" @click="emptyInvalidGoods">清空失效宝贝</div>
      </div>
      <div class="content">
        <InvalidGoodsItem
          v-for="(item, index) in invalidGoodsList"
          :key="index"
          :item="item"
          :index="index"
          :deleteBtnVisible="deleteBtnVisible"
          @deleteInvalidGoods="deleteInvalidGoods"
          @toggleInvalidGoodsChecked="acount"
        />
      </div>
    </div>

    <div
      class="empty-illus"
      v-if="!cartList.length && !invalidGoodsList.length"
    >
      <div class="empty-desc">还没有宝贝哦，快去挑选喜欢的宝贝吧～</div>
      <div class="visit-btn" @click="navToMall">去逛逛</div>
    </div>

    <div class="bottom-bar" v-if="cartList.length">
      <div class="select-all" @click="toggleAllChecked">
        <Checkbox v-model="isSelectAll" checked-color="#ee0a24" />
        <span class="tip">全选</span>
      </div>
      <div class="bar-main" v-if="!deleteBtnVisible">
        <div class="total-price" v-if="!isCalculating">
          <span style="color: #333; font-weight: 400">合计：</span>
          <span>¥</span>
          <span style="font-size: 0.36rem">{{ totalPrice }}</span>
        </div>
        <Loading v-if="isCalculating" size="20" color="#ee0a24"
          >价格计算中...</Loading
        >
        <div class="submit" :class="{ active: selectedCount }" @click="submit">
          <span>结算</span>
          <span v-if="selectedCount">({{ selectedCount }})</span>
        </div>
      </div>
      <div
        class="delete-btn"
        :class="{ active: selectedCount }"
        v-if="deleteBtnVisible"
        @click="deleteGoodsList"
      >
        删除
      </div>
    </div>

    <Popup v-model="specPopupVisible" position="bottom" closeable round>
      <SpecPopup
        :actionType="goodsInfo?.actionType || 0"
        :recId="goodsInfo?.recId"
        :goodsId="goodsInfo?.id || ''"
        :goodsImg="goodsInfo?.img || ''"
        :goodsName="goodsInfo?.name || ''"
        :basePrice="goodsInfo?.basePrice || ''"
        :stock="goodsInfo?.stock || 0"
        :specInfo="goodsInfo?.specInfo"
        @hideSpecPopup="hideSpecPopup"
      />
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { Popup, Checkbox, Loading, Dialog } from "vant";
import NavBar from "@/components/NavBar.vue";
import SpecPopup from "@/components/SpecPopup.vue";
import CartItem from "./components/CartItem.vue";
import GoodsItem from "./components/GoodsItem.vue";
import InvalidGoodsItem from "./components/InvalidGoodsItem.vue";

import { ref, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import _ from "lodash";
import {
  cartCheck,
  CartInfo,
  deleteCartList,
  getCartList,
  InvalidCartGoodsInfo,
} from "./utils/api";
import { SpecInfo, updateCartGoods } from "@/api/common";

interface GoodsInfo {
  actionType: number;
  recId: number;
  id: string;
  img: string;
  name: string;
  basePrice: string;
  stock: number;
  specInfo: SpecInfo;
}

const store = useStore();
const router = useRouter();

let totalCount = 0;
let selectedRecIdArr: number[] = [];
const cartList = ref<CartInfo[]>([]);
const invalidGoodsList = ref<InvalidCartGoodsInfo[]>([]);
const deleteBtnVisible = ref(false);
const selectedCount = ref(0);
const isSelectAll = ref(false);
const isCalculating = ref(false);
const totalPrice = ref("0.00");
const specPopupVisible = ref(false);
const goodsInfo = ref<GoodsInfo>();

onMounted(() => setCartList());

watch(deleteBtnVisible, () => acount());

const updateCartCount = () => store.dispatch("updateCartCount");

const setCartList = async () => {
  const { cart_list = [], not_on_sale = [] } = (await getCartList()) || {};
  cartList.value = cart_list;
  invalidGoodsList.value = not_on_sale;
  acount();
};

const editCount = async ({
  recId,
  count,
}: {
  recId: number;
  count: number;
}) => {
  isCalculating.value = true;
  const { goods_amount_formated, cart_number } = await updateCartGoods({
    rec_id: recId,
    num: count,
  });
  totalPrice.value = goods_amount_formated;
  selectedCount.value = cart_number;
  isCalculating.value = false;
  updateCartCount();
};

const deleteGoodsList = () => {
  if (selectedCount.value) {
    Dialog.confirm({ title: "提示", message: "确定删除商品吗？" }).then(
      async () => {
        await deleteCartList(selectedRecIdArr.join());
        setCartList();
      }
    );
  }
};

const deleteGoods = ({
  id,
  cartIdx,
  goodsIdx,
}: {
  id: string;
  cartIdx: number;
  goodsIdx: number;
}) => {
  cartList.value[cartIdx].goods.splice(goodsIdx, 1);
  if (!cartList.value[cartIdx].goods.length) cartList.value.splice(cartIdx, 1);
  deleteCartList(id);
};

const emptyInvalidGoods = () => {
  const recIdArr = invalidGoodsList.value.map((item) => item.rec_id);
  deleteCartList(recIdArr.join());
  invalidGoodsList.value = [];
};

const deleteInvalidGoods = ({ id, index }: { id: string; index: number }) => {
  invalidGoodsList.value.splice(index, 1);
  deleteCartList(id);
};

const showSpecPopup = (info: GoodsInfo) => {
  specPopupVisible.value = true;
  goodsInfo.value = info;
};

const hideSpecPopup = () => {
  specPopupVisible.value = false;
  setCartList();
};

const toggleCartChecked = ({ val, idx }: { val: boolean; idx: number }) => {
  cartList.value[idx].checked = val;
  cartList.value[idx].goods.map((item) => {
    if (
      deleteBtnVisible.value ||
      (!deleteBtnVisible.value && item.product_number)
    )
      item.is_checked_goods = val;
  });
  debouncedAcount();
};

const toggleGoodsChecked = ({
  val,
  cartIdx,
  goodsIdx,
}: {
  val: boolean;
  cartIdx: number;
  goodsIdx: number;
}) => {
  cartList.value[cartIdx].goods[goodsIdx].is_checked_goods = val;
  const unCheckedIndex = cartList.value[cartIdx].goods.findIndex((item) => {
    if (
      deleteBtnVisible.value ||
      (!deleteBtnVisible.value && item.product_number)
    )
      return item.is_checked_goods === false;
  });
  cartList.value[cartIdx].checked = unCheckedIndex === -1;
  debouncedAcount();
};

const toggleAllChecked = () => {
  isSelectAll.value = !isSelectAll.value;
  if (deleteBtnVisible.value) {
    cartList.value.map((item) => {
      item.checked = isSelectAll.value;
      item.goods.map((_item) => (_item.is_checked_goods = isSelectAll.value));
    });
    invalidGoodsList.value.map((item) => {
      item.is_checked = isSelectAll.value ? 1 : 0;
    });
  } else {
    cartList.value.map((item) => {
      item.checked = isSelectAll.value;
      item.goods.map((_item) => {
        if (_item.product_number) _item.is_checked_goods = isSelectAll.value;
      });
    });
  }
  debouncedAcount();
};

const debouncedAcount = _.debounce(() => acount(), 200);

const acount = async () => {
  totalCount = 0;
  selectedRecIdArr = [];
  let _selectedCount = 0;
  if (deleteBtnVisible.value) {
    cartList.value.forEach((item) => {
      item.goods.forEach((_item) => {
        if (_item.is_checked_goods) {
          selectedRecIdArr.push(_item.rec_id);
          _selectedCount += _item.goods_number;
        }
        totalCount += _item.goods_number;
      });
    });
    invalidGoodsList.value.forEach((item) => {
      if (item.is_checked) {
        selectedRecIdArr.push(item.rec_id);
        _selectedCount += 1;
      }
      totalCount += 1;
    });
    selectedCount.value = _selectedCount;
    isSelectAll.value =
      _selectedCount && _selectedCount === totalCount ? true : false;
  } else {
    cartList.value.forEach((item) => {
      item.goods.forEach((_item) => {
        if (_item.product_number && _item.is_checked_goods) {
          selectedRecIdArr.push(_item.rec_id);
          _selectedCount += _item.goods_number;
        }
        totalCount += _item.goods_number;
      });
    });

    selectedCount.value = _selectedCount;
    isSelectAll.value =
      _selectedCount && _selectedCount === totalCount ? true : false;

    isCalculating.value = true;
    const { goods_amount_formated } = await cartCheck(selectedRecIdArr.join());
    totalPrice.value = goods_amount_formated.slice(1);
    isCalculating.value = false;
    updateCartCount();
  }
};

const submit = async () => {
  await cartCheck(selectedRecIdArr.join());
  router.push({
    path: "/mall/goods/create-order",
    query: { isFromCart: "true" },
  });
};
const navToMall = () => router.push("/mall");
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
