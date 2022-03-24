<template>
  <div class="container" :class="{ 'is-iphoneX': isIphoneX }">
    <div class="nav-bar" :class="{ show: showNavBar }">
      <div class="back-icon" @click="navBack"></div>
      <div class="menu-wrap" :class="{ show: showNavBar }">
        <div
          class="menu-tips"
          :class="{ show: !detailActive }"
          @click="scrollToTop"
        >
          宝贝
        </div>
        <div class="menu-split">|</div>
        <div
          class="menu-tips"
          :class="{ show: detailActive }"
          @click="scrollToDetail"
        >
          详情
        </div>
      </div>
    </div>

    <div class="banner-wrap">
      <Swipe
        class="banner"
        :autoplay="5000"
        :show-indicators="false"
        @change="bannerChange"
      >
        <SwipeItem
          v-for="(item, index) in goodsInfo?.img"
          :key="index"
          @click="previewBanner(index)"
        >
          <img class="banner-img" :src="item.thumb_url" />
        </SwipeItem>
      </Swipe>
      <div class="dots">
        <span class="cur-idx">{{ curBannerIdx + 1 }}</span>
        <span> / {{ goodsInfo?.img.length }}</span>
      </div>
      <div class="hot-tips" v-if="goodsInfo?.goods_type === '1'">
        <img
          class="icon"
          src="https://img.ubo.vip/mp/selection/goods-detail/hot-icon.png"
        />
        <div>热销{{ goodsInfo.ghost_count }}件</div>
      </div>
      <div class="sale-amount-tips" v-if="goodsInfo?.goods_type === '2'">
        销售{{ goodsInfo.ghost_count }}件
      </div>
    </div>

    <div class="goods-info-wrap">
      <PriceBar
        :goodsType="goodsInfo?.goods_type || ''"
        :shopPrice="shopPrice || '0'"
        :marketPrice="goodsInfo?.market_price || '0'"
        :salesVolume="goodsInfo?.ghost_count || 0"
        :stock="goodsInfo?.goods_number || 0"
        :progressInfo="progressInfo"
        :spikeInfo="goodsInfo?.seckill || null"
        :countDown="countDown"
        :unStart="unStart"
      />
      <div class="bonus-bar" v-if="goodsInfo?.bonus_info.length">
        <ul class="bonus-tips">
          <li
            class="tip"
            v-for="(item, index) in goodsInfo?.bonus_info.slice(0, 3)"
            :key="index"
          >
            {{ item.limit_tip }}
          </li>
        </ul>
        <div class="btn" @click="bonusPopupVisible = true">
          <p>领券</p>
          <img
            style="width: 0.32rem; height: 0.32rem"
            src="./images/right-arrow.png"
            alt=""
          />
        </div>
      </div>
      <div class="goods-name">
        <span
          v-if="goodsInfo?.goods_type === '1' || goodsInfo?.goods_type === '2'"
          class="goods-tag"
          :class="{ sale: goodsInfo?.goods_type === '1' }"
          >{{ goodsInfo?.goods_type === "1" ? "特卖" : "品质优选" }}</span
        >
        <span>{{ goodsInfo?.goods_name }}</span>
      </div>
      <div class="labels" v-if="goodsInfo?.keywords">
        {{ goodsInfo?.keywords }}
      </div>
      <div class="alarm-tip" v-if="goodsInfo?.noti_info">
        <img
          class="icon"
          src="https://img.ubo.vip/mp/selection/goods-detail/alarm-icon.png"
        />
        <span>{{ goodsInfo?.noti_info }}</span>
      </div>
    </div>

    <div class="promotion-bar" v-if="goodsInfo?.manjian.length">
      <ul class="tips">
        <li
          class="tip"
          v-for="(item, index) in goodsInfo?.manjian.slice(0, 2)"
          :key="index"
        >
          <div class="icon">{{ item.tip_content }}</div>
          <div>{{ item.show_name }}</div>
        </li>
      </ul>
      <img
        style="width: 0.44rem; height: 0.44rem"
        @click="promotionPopupVisible = true"
        src="https://img.ubo.vip/mp/selection/goods-detail/i-menu-list/more-icon.png"
      />
    </div>

    <div class="service-bar" v-if="goodsInfo?.goods_service.length">
      <ul class="tips">
        <li
          class="tip"
          v-for="(item, index) in goodsInfo?.goods_service.slice(0, 3)"
          :key="index"
        >
          <img
            class="icon"
            src="https://img.ubo.vip/mp/selection/goods-detail/service-icon.png"
          />
          <div>{{ item.name }}</div>
        </li>
      </ul>
      <img
        style="width: 0.44rem; height: 0.44rem"
        @click="servicePopupVisible = true"
        src="https://img.ubo.vip/mp/selection/goods-detail/i-menu-list/more-icon.png"
      />
    </div>

    <div class="spec-bar" v-if="goodsInfo?.goods_type !== '6'">
      <p class="name">规格</p>
      <div class="btn" @click="showSpecPopup(0)">
        <p class="desc">{{ specTips || "请选择" }}</p>
        <img
          style="width: 0.16rem; height: 0.16rem"
          src="https://img.ubo.vip/mp/selection/goods-detail/to-icon.png"
        />
      </div>
    </div>

    <Swipe
      class="mid-banner"
      v-if="goodsInfo?.mid_banner.length"
      :autoplay="3000"
      indicator-color="white"
    >
      <SwipeItem v-for="(item, index) in goodsInfo?.mid_banner" :key="index">
        <img class="banner-img" :src="item.ad_code" />
      </SwipeItem>
    </Swipe>

    <div class="shop-info-bar" v-if="goodsInfo?.supplier_info">
      <div class="shop-info">
        <div class="shop">
          <div class="img-wrap">
            <img
              class="img"
              :src="goodsInfo?.supplier_info.supplier_img"
              alt=""
            />
            <img
              class="firm-icon"
              v-if="goodsInfo?.supplier_info.is_enterprise"
              src="https://img.ubo.vip/mp/selection/goods-detail/firm-icon.png"
              alt=""
            />
          </div>
          <p class="name">{{ goodsInfo?.supplier_info.supplier_name }}</p>
          <img
            style="width: 0.48rem; height: 0.48rem"
            src="./images/shop-icon.png"
            alt=""
          />
        </div>
        <div class="btn" @click="navToShop">
          <p>进入店铺</p>
          <img
            style="width: 0.16rem; height: 0.16rem"
            src="https://img.ubo.vip/mp/selection/goods-detail/to-icon.png"
          />
        </div>
      </div>
      <div class="show-case">
        <GoodItem
          v-for="(item, index) in goodsInfo?.supplier_info.top_goods"
          :key="index"
          :item="item"
        />
      </div>
    </div>

    <SplitLine
      v-show="goodsInfo?.goods_desc_array.length"
      ref="detailRef"
      title="宝贝详情"
    />
    <div class="goods-detail" v-if="goodsInfo?.goods_desc_array.length">
      <div class="spec-info" v-if="goodsInfo?.product_specification.length">
        <h3 class="title">产品规格</h3>
        <ul
          class="lists"
          v-for="(item, index) in goodsInfo?.product_specification"
          :key="index"
        >
          <li class="list">
            <p class="label">{{ item.label }}</p>
            <p class="detail">{{ item.price }}</p>
          </li>
        </ul>
      </div>
      <div class="imgs">
        <img
          v-for="(item, index) in goodsInfo?.goods_desc_array"
          :key="index"
          @click="previewDetailImgs(index)"
          style="width: 100%"
          :src="item.url"
        />
      </div>
    </div>

    <SplitLine title="为您推荐" v-if="goodsInfo?.recommend_goods.length" />
    <div class="recommend-goods" v-if="goodsInfo?.recommend_goods.length">
      <GoodsList :list="goodsInfo?.recommend_goods" />
    </div>

    <div class="nomore-tip">到底啦~</div>

    <div class="bottom-bar" :class="{ 'is-iphoneX': isIphoneX }">
      <div class="cart-icon" @click="navToCart">
        <img class="icon" src="./images/cart-icon.png" alt="" />
        <p class="desc">购物车</p>
        <div class="count">{{ cartCount }}</div>
      </div>
      <div class="customer-icon">
        <img class="icon" src="./images/customer-icon.png" alt="" />
        <p class="desc">客服</p>
      </div>
      <div class="add-cart-btn" @click="showSpecPopup(1)">加入购物车</div>
      <div class="direct-buy-btn" @click="showSpecPopup(2)">立即购买</div>
    </div>

    <Popup v-model="specPopupVisible" position="bottom" closeable round>
      <SpecPopup
        :actionType="actionType"
        :goodsId="goodsId"
        :goodsImg="goodsInfo?.default_attr_img || ''"
        :goodsName="goodsInfo?.goods_name || ''"
        :basePrice="shopPrice || ''"
        :stock="goodsInfo?.goods_number || 0"
        :specInfo="goodsInfo?.attr_goods_info"
        @commitSelectedSpec="setSpecTips"
        @hideSpecPopup="specPopupVisible = false"
      />
    </Popup>
    <Popup v-model="bonusPopupVisible" position="bottom" closeable round>
      <div class="bonus-list" :class="{ 'is-iphoneX': isIphoneX }">
        <BonusItem
          v-for="(item, index) in goodsInfo?.bonus_info"
          :key="index"
          :item="item"
        />
      </div>
    </Popup>
    <Popup v-model="promotionPopupVisible" position="bottom" closeable round>
      <div class="promotion-list" :class="{ 'is-iphoneX': isIphoneX }">
        <PromotionItem
          v-for="(item, index) in goodsInfo?.manjian"
          :key="index"
          :item="item"
        />
      </div>
    </Popup>
    <Popup v-model="servicePopupVisible" position="bottom" closeable round>
      <div class="service-list" :class="{ 'is-iphoneX': isIphoneX }">
        <ServiceItem
          v-for="(item, index) in goodsInfo?.goods_service"
          :key="index"
          :item="item"
        />
      </div>
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { Swipe, SwipeItem, ImagePreview, Popup } from "vant";
import SplitLine from "@/components/SplitLine.vue";
import SpecPopup from "@/components/SpecPopup.vue";
import GoodsList from "@/components/GoodsList.vue";
import PriceBar from "./components/PriceBar.vue";
import GoodItem from "./components/GoodItem.vue";
import BonusItem from "./components/BonusItem.vue";
import PromotionItem from "./components/PromotionItem.vue";
import ServiceItem from "./components/ServiceItem.vue";

import { computed, onMounted, onUnmounted, ref } from "vue";
import { isIphoneX } from "@/utils/envJudgment";
import { useRoute, useRouter } from "vue-router";
import { getGoodsInfo, GoodsDetailInfo } from "@/api/common";

const route = useRoute();
const router = useRouter();

let scrollTop = 0;
let detailTop = 0;
let countDownInterval = 0;

const detailRef = ref();
const goodsId = ref("");
const goodsInfo = ref<GoodsDetailInfo>();
const curBannerIdx = ref(0);
const showNavBar = ref(false);
const detailActive = ref(false);
const countDown = ref(0);
const unStart = ref(false);
const specTips = ref("");
const actionType = ref(0);
const specPopupVisible = ref(false);
const bonusPopupVisible = ref(false);
const promotionPopupVisible = ref(false);
const servicePopupVisible = ref(false);

const shopPrice = computed(() =>
  goodsInfo.value?.seckill
    ? goodsInfo.value?.seckill.sec_price
    : goodsInfo.value?.promote_price !== "0"
    ? goodsInfo.value?.promote_price
    : goodsInfo.value?.shop_price
);
const progressInfo = computed(() => {
  const saleCount = goodsInfo.value?.special_buy_status?.sale_count || 0;
  const totalCount = goodsInfo.value?.special_buy_status?.total_count || 0;
  return {
    percent: saleCount / totalCount,
    stock: totalCount - saleCount,
  };
});

onMounted(async () => {
  goodsId.value = route.query.id as string;
  await setGoodsInfo();
  detailTop = detailRef.value.$el.getBoundingClientRect().top;
  window.addEventListener("scroll", handleScroll, true);
});

onUnmounted(() => {
  if (countDownInterval) clearInterval(countDownInterval);
  window.removeEventListener("scroll", handleScroll);
});

const setGoodsInfo = async () => {
  goodsInfo.value = await getGoodsInfo(goodsId.value);
  if (
    goodsInfo.value.special_buy_status &&
    goodsInfo.value.special_buy_status.end_time
  ) {
    setCountDown(
      Number(goodsInfo.value.special_buy_status.allow_buy_time),
      Number(goodsInfo.value.special_buy_status.end_time)
    );
  }
};

const setCountDown = (startTime: number, endTime: number) => {
  const nowTime = Date.now() / 1000;
  unStart.value = startTime > nowTime;
  let time = unStart.value ? startTime - nowTime : endTime - nowTime;
  countDownInterval = setInterval(() => {
    countDown.value = --time;
    if (time <= 1) clearInterval(countDownInterval);
  }, 1000);
};

const bannerChange = (index: number) => (curBannerIdx.value = index);
const previewBanner = (startPosition: number) => {
  const images = goodsInfo.value?.img.map((item) => item.thumb_url) || [];
  ImagePreview({ images, startPosition });
};
const previewDetailImgs = (startPosition: number) => {
  const images =
    goodsInfo.value?.goods_desc_array.map((item) => item.url) || [];
  ImagePreview({ images, startPosition });
};
const showSpecPopup = (type: number) => {
  actionType.value = type;
  specPopupVisible.value = true;
};
const setSpecTips = (tips: string) => (specTips.value = tips);

const navBack = () => router.go(-1);
const navToCart = () => router.push("/mall/cart");
const navToShop = () => router.push("/mall/goods/shop");

const handleScroll = () => {
  scrollTop =
    window.pageYOffset ||
    document.documentElement.scrollTop ||
    document.body.scrollTop;
  if (scrollTop >= 100 && !showNavBar.value) showNavBar.value = true;
  else if (scrollTop < 100 && showNavBar.value) showNavBar.value = false;
  if (scrollTop >= detailTop && !detailActive.value) detailActive.value = true;
  else if (scrollTop < detailTop && detailActive.value)
    detailActive.value = false;
};
const scrollToTop = () =>
  window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
const scrollToDetail = () =>
  window.scrollTo({ top: detailTop + 1, left: 0, behavior: "smooth" });

// import { mapState } from "vuex";
//   computed: {
//     ...mapState({
//       cartCount: (state) => state.cartCount,
//     }),
//   },
</script>

<style lang="stylus" scoped>
.nav-bar
  position fixed
  top 0
  left 0
  display flex
  align-items center
  padding-left .16rem
  width 100%
  height .96rem
  box-sizing initial
  z-index 100
  &.show
    background-color #000
    box-shadow 0 .02rem .02rem rgba(0,0,0,0.05)
  .back-icon
    width .64rem
    height .64rem
    border-radius 50%
    background-color rgba(0, 0, 0, 0.3)
    border .01rem solid rgba(255,255,255,0.3)
    background-image url('https://img.ubo.vip/mp/i-back-icon/back-icon.png')
    background-size .4rem .4rem
    background-repeat no-repeat
    background-position 40% 50%
  .menu-wrap
    position absolute
    left 50%
    bottom .12rem
    transform translateX(-50%)
    display flex
    justify-content space-between
    padding 0 .34rem
    height .64rem
    color #fff
    background-color rgba(0, 0, 0, 0.3)
    border-radius .34rem
    .menu-tips
      position relative
      line-height .64rem
      font-size .3rem
      font-weight 500
    &.show .menu-tips.show::after
      position absolute
      left 0
      bottom .06rem
      width .6rem
      height .06rem
      content ''
      background-color #F7CC9C
      border-radius .04rem 0 .04rem 0
    .menu-split
      margin 0 .2rem
      line-height .68rem
      color #EFEFEF
      font-size .24rem
      font-weight 500
.container
  padding-bottom 1.24rem
  &.is-iphoneX
    padding-bottom 1.4rem
  .banner-wrap
    position relative
    .banner
      height 7.5rem
      .banner-img
        width 100%
        height 100%
        fit-content cover
    .dots
      position absolute
      right .24rem
      bottom .26rem
      width .78rem
      height .46rem
      line-height .46rem
      text-align center
      color #fff
      font-size .20rem
      font-weight 500
      background rgba(0, 0, 0, 0.3)
      border-radius .24rem .24rem .04rem .24rem
      .cur-idx
        font-size .24rem
    .hot-tips
      position absolute
      left .24rem
      bottom .24rem
      display flex
      align-items center
      font-size .22rem
      font-weight 500
      color #fff
      background linear-gradient(90deg,rgba(255,54,50,1),rgba(246,178,102,1))
      padding 0 .18rem
      border-radius .05rem
      .icon
        margin-right .10rem
        width .15rem
        height .19rem
    .sale-amount-tips
      position absolute
      left .24rem
      bottom .24rem
      padding 0 .26rem
      height .48rem
      line-height .48rem
      border-radius .24rem
      text-align center
      font-size .26rem
      font-weight 500
      color #fff
      background-color rgba(0, 0, 0, 0.3)
  .goods-info-wrap
    margin .18rem .24rem
    padding-bottom .24rem
    border-radius .12rem
    background #fff
    overflow hidden
    .bonus-bar
      display flex
      align-items center
      justify-content space-between
      padding 0 .24rem
      .bonus-tips
        display flex
        .tips
          margin-right .08rem
          padding 0 .12rem
          height .36rem
          color #D0132B
          font-size .24rem
          line-height .36rem
          background #FFE9E4
          border-radius .08rem
      .btn
        display flex
        align-items center
        color #D0132B
        font-size .24rem
    .goods-name
      padding 0 .24rem
      color #333
      font-size .30rem
      font-weight 500
      line-height .40rem
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 2
      -webkit-box-orient vertical
      .goods-tag
        display inline-block
        margin-right .20rem
        margin-bottom .10rem
        padding 0 .12rem
        height .36rem
        color #fff
        font-size .22rem
        line-height .36rem
        font-weight 500
        text-align center
        vertical-align top
        border-radius .18rem .18rem .04rem .18rem
        background linear-gradient(125deg,rgba(255,0,162,1) 0%,rgba(255,0,57,1) 100%)
        &.special
          background linear-gradient(90deg,rgba(255,54,50,1),rgba(246,178,102,1))
    .labels
      margin-top .14rem
      padding 0 .24rem
      color #999
      font-size .24rem
      font-weight 500
      line-height 1
    .alarm-tip
      margin-top .14rem
      padding 0 .24rem
      display flex
      font-size .24rem
      color #E22A2A
      .icon
        margin-top .04rem
        margin-right .05rem
        width .24rem
        height .26rem
        flex-shrink 0
  .promotion-bar
    display flex
    align-items center
    justify-content space-between
    margin .18rem .24rem
    padding 0 .24rem
    height .9rem
    border-radius .12rem
    background #fff
    .tips
      display flex
      .tip
        display flex
        align-items center
        margin-right .24rem
        color #333
        font-size .22rem
        font-weight 500
        .icon
          margin-right .08rem
          padding 0 .10rem
          height .40rem
          line-height .36rem
          text-align center
          color #F63C80
          font-size .22rem
          font-weight 500
          border .02rem solid #F63C80
  .service-bar
    display flex
    align-items center
    justify-content space-between
    margin .18rem .24rem
    padding 0 .24rem
    height .9rem
    border-radius .12rem
    background #fff
    .tips
      display flex
      .tip
        display flex
        align-items center
        margin-right .24rem
        color #666
        font-size .24rem
        .icon
          margin-right .06rem
          width .28rem
          height .28rem
  .spec-bar
    display flex
    align-items center
    justify-content space-between
    margin .18rem .24rem
    padding 0 .24rem
    height .9rem
    border-radius .12rem
    background #fff
    .name
      color #333
      font-size .28rem
      font-weight 500
    .btn
      display flex
      align-items center
      max-width 5rem
      .desc
        color #999
        font-size .28rem
        white-space nowrap
        overflow hidden
        text-overflow ellipsis
  .mid-banner
    margin .18rem .24rem
    height 2.32rem
    border-radius .12rem
    .banner-img
      width 100%
      height 100%
      fit-content cover
  .shop-info-bar
    margin .18rem .24rem
    padding .24rem
    border-radius .12rem
    background #fff
    .shop-info
      display flex
      align-items center
      justify-content space-between
      .shop
        display flex
        align-items center
        .img-wrap
          position relative
          margin-right .18rem
          width .96rem
          height .96rem
          .img
            width 100%
            height 100%
            border-radius 50%
            fit-content cover
          .firm-icon
            position absolute
            right 0
            bottom 0
            width .30rem
            height .30rem
        .name
          color #111
          font-size .32rem
          font-weight 500
          white-space nowrap
      .btn
        display flex
        align-items center
        color #999
        font-size .28rem
    .show-case
      display flex
      flex-wrap nowrap
      overflow-x scroll
  .goods-detail
    .spec-info
      padding .24rem
      background #fff
      .title
        padding-bottom .20rem
        color #333
        font-size .30rem
        font-weight 500
        border-bottom .02rem solid #939393
      .lists
        .list
          display flex
          margin-top .20rem
          font-size .28rem
          .label
            margin-right .40rem
            width 1.20rem
            color #666
            text-align right
          .detail
            padding .24rem
            background #fff
    .imgs
      padding .24rem
      font-size 0
      background #fff
  .recommend-goods
    padding 0 .24rem
  .nomore-tip
    padding .24rem 0
    color #999
    font-size .28rem
    font-weight 500
    text-align center
.bottom-bar
  position fixed
  bottom 0
  display flex
  align-items center
  justify-content space-around
  padding .12rem
  width 100%
  background #fff
  &.is-iphoneX
    padding-bottom .3rem
  .cart-icon, .customer-icon
    position relative
    display flex
    flex-direction column
    align-items center
    .icon
      width .64rem
      height .64rem
    .desc
      color #666
      font-size .18rem
      white-space normal
    .count
      position absolute
      top 0
      right 0
      transform translateX(20%)
      padding 0 .1rem
      height .3rem
      color #fff
      font-size .18rem
      line-height .3rem
      border-radius .15rem
      background #FE4019
  .add-cart-btn
    width 2.28rem
    height .80rem
    color #FFE5BD
    font-size .32rem
    font-weight 500
    line-height .8rem
    text-align center
    background linear-gradient(90deg, #404A5C 0%, #0F131A 100%)
    border-radius .12rem
  .direct-buy-btn
    width 2.28rem
    height .80rem
    color #0F131A
    font-size .32rem
    font-weight 500
    line-height .8rem
    text-align center
    background linear-gradient(270deg, #FFD699 0%, #FFE5BD 100%)
    border-radius .12rem
.bonus-list, .promotion-list, .service-list
  padding .24px
  &.is-iphoneX
    padding-bottom .4rem
</style>
