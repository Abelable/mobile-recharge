<template>
  <NavBar :backIconVisible="false" :title="goodsInfo?.name || ''">
    <template v-slot:custom-btn>
      <img
        style="width: 20px; height: 20px"
        @click="navToOrderQuery"
        src="./images/search.png"
      />
    </template>
  </NavBar>
  <div class="container">
    <div class="cover-wrap" :class="{ open }">
      <img class="cover" :src="goodsInfo?.main_picture" alt="" />
      <div class="toggle-bar" @click="open = !open">
        <img
          class="arrow"
          :class="{ open }"
          :src="
            open ? require('./images/up.png') : require('./images/down.png')
          "
          alt=""
        />
      </div>
    </div>
    <div class="info-wrap">
      <div class="info">
        <div class="label">套餐类型</div>
        <div class="content" style="padding-left: 0.16rem">
          {{ goodsInfo?.name }}
        </div>
      </div>
    </div>
    <div class="info-wrap">
      <div class="tag">实名信息</div>
      <div class="info">
        <div class="label">姓名</div>
        <input class="content" type="text" placeholder="请输入姓名（已加密）" />
      </div>
      <div class="info" v-if="goodsInfo?.product.is_required_idcard">
        <div class="label">身份证号</div>
        <input
          class="content"
          type="text"
          placeholder="请输入身份证号（已加密）"
        />
      </div>
      <div class="info">
        <div class="label">联系电话</div>
        <input
          class="content"
          type="number"
          placeholder="请输入联系电话，并保持畅通"
        />
      </div>
    </div>
    <div class="info-wrap">
      <div class="tag">填写配送地址</div>
      <div class="info">
        <div class="label">所在城市</div>
        <div
          class="content"
          :class="{ placeholder: !regionArr }"
          @click="regionPickerVisible = true"
        >
          {{
            regionArr
              ? regionArr[0] + " " + regionArr[1] + " " + regionArr[2]
              : "请点击选择地区"
          }}
        </div>
      </div>
      <div class="info">
        <div class="label">详细地址</div>
        <input
          class="content"
          type="text"
          placeholder="如街道、道路、小区、门牌号"
        />
      </div>
    </div>
    <div class="info-wrap" v-if="goodsInfo?.product.is_required_idphoto">
      <div class="tag">上传身份证、人像照片</div>
      <div class="tips">
        <p style="font-weight: bold">特别说明</p>
        <p>
          <span>1. 根据有关部门要求，必须上传真实身份证照片。</span>
          <span style="color: #fe3552">未上传照片，订单无效</span>
        </p>
        <p>2. 请填写真实身份信息，未满16周岁、一证五号、信息错误将无法发货</p>
      </div>
      <div class="uploader-wrap">
        <div class="label">身份证正面照片</div>
        <div class="uploader-tips">
          <img
            class="tips-icon"
            src="https://img.ubo.vip/mp/mine/auth/add-auth/tips.png"
            alt=""
          />
          <span>
            证件四角边缘空隙2厘米以上，手机横拍，照片清晰不模糊，无水印，无反光，无PS
          </span>
        </div>
        <div class="content">
          <Uploader max-count="1" :preview-size="[160, 100]" />
          <img class="example-pic" src="./images/face.png" alt="" />
        </div>
      </div>
      <div class="uploader-wrap">
        <div class="label">身份证反面照片</div>
        <div class="uploader-tips">
          <img
            class="tips-icon"
            src="https://img.ubo.vip/mp/mine/auth/add-auth/tips.png"
            alt=""
          />
          <span>
            证件四角边缘空隙2厘米以上，手机横拍，照片清晰不模糊，无水印，无反光，无PS
          </span>
        </div>
        <div class="content">
          <Uploader max-count="1" :preview-size="[160, 100]" />
          <img class="example-pic" src="./images/back.png" alt="" />
        </div>
      </div>
      <div class="uploader-wrap" style="padding-bottom: 0.12rem">
        <div class="label">人像照片</div>
        <div class="uploader-tips">
          <img
            class="tips-icon"
            src="https://img.ubo.vip/mp/mine/auth/add-auth/tips.png"
            alt=""
          />
          <span>
            无需手持身份证，胸部以上，露出双肩，人像面部比例不低于1/3，无水印，无反光，无PS
          </span>
        </div>
        <div class="content">
          <Uploader max-count="1" :preview-size="[160, 100]" />
          <img class="example-pic" src="./images/head.png" alt="" />
        </div>
      </div>
    </div>
  </div>
  <Popup v-model:show="regionPickerVisible" position="bottom" round>
    <RegionPicker
      :regionArr="regionArr"
      @confirm="onRegionPickerComfirm"
      @cancel="regionPickerVisible = false"
    />
  </Popup>
</template>

<script setup lang="ts">
import { Toast, Popup, Uploader } from "vant";
import NavBar from "@/components/NavBar/index.vue";
import RegionPicker from "@/components/RegionPicker.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getGoodsInfo } from "./utils/api";
import type { GoodsInfo } from "@/types";

let regionIdArr: number[] = [];

const router = useRouter();
const route = useRoute();
const open = ref(false);
const goodsInfo = ref<GoodsInfo>();
const agentId = ref<number>();
const regionArr = ref<string[] | undefined>(undefined);
const regionPickerVisible = ref(false);

onMounted(async () => {
  const { goods_id, agent_id } = route.query;
  agentId.value = Number(agent_id);
  Toast.loading({ message: "加载中..." });
  goodsInfo.value = await getGoodsInfo(goods_id as string);
  Toast.clear();
});

const onRegionPickerComfirm = (
  regionList: string[],
  regionIdList: number[]
) => {
  regionArr.value = regionList;
  regionIdArr = regionIdList;
  regionPickerVisible.value = false;
};
const navToOrderQuery = () => router.push("/order_query");
</script>

<style lang="stylus" scoped>
.container
  padding .88rem 0
  .cover-wrap
    position relative
    font-size 0
    height 100vw
    overflow hidden
    &.open
      height: fit-content
    .cover
      width 100%
    .toggle-bar
      position absolute
      bottom 0
      display flex
      align-items center
      justify-content center
      width 100%
      height 1.1rem
      background linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.4))
      .arrow
        width .4rem
        height .4rem
        animation shake 1.5s infinite
        transform: rotate(45deg)
        &.open
          transform: rotate(90deg)
  .info-wrap
    padding 0 .24rem
    border-bottom 1px solid #f3f3f3
    .tag
      position relative
      margin-top .24rem
      margin-left .24rem
      color #3976ff
      font-size .3rem
      font-weight bold
      &::before
        position absolute
        top 50%
        left -0.2rem
        transform translateY(-50%)
        width .06rem
        height .3rem
        content ""
        background #3976ff
    .tips
      margin-top .24rem
      padding .24rem
      color #999
      font-size .26rem
      border-radius .2rem
      background #f3f3f3
    .info
      display flex
      align-items center
      height .88rem
      .label
        width 1.6rem
        color #333
        font-size .28rem
        font-weight bold
      .content
        width 5.2rem
        color #333
        font-size .28rem
        &.placeholder
          color #888
    .uploader-wrap
      margin-top .24rem
      .label
        color #333
        font-size .28rem
        font-weight bold
      .uploader-tips
        margin-top .1rem
        color #999
        font-size .24rem
        .tips-icon
          height .24rem
          width .24rem
          transform translateY(.03rem)
      .content
        display flex
        justify-content space-between
        margin-top .24rem
        .example-pic
          width 160px
          height 100px
          border 1px solid #f9f9f9
@keyframes shake
  0%
    transform translateY(0.06rem)
  50%
    transform translateY(-0.06rem)
  100%
    transform translateY(0.06rem)
</style>
