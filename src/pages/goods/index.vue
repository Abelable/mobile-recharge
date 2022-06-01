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
      <div v-html="goodsInfo?.detail" />
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
        <input
          class="content"
          v-model="name"
          type="text"
          placeholder="请输入姓名（已加密）"
        />
      </div>
      <div class="info" v-if="goodsInfo?.product.is_required_idcard">
        <div class="label">身份证号</div>
        <input
          class="content"
          v-model="idCode"
          type="text"
          placeholder="请输入身份证号（已加密）"
        />
      </div>
      <div class="info">
        <div class="label">联系电话</div>
        <input
          class="content"
          v-model="phone"
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
          style="padding-left: 0.16rem"
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
          v-model="addressDetail"
          type="text"
          placeholder="如街道、道路、小区、门牌号"
        />
      </div>
    </div>
    <div class="info-wrap" v-if="goodsInfo?.product.is_required_idphoto">
      <div class="tag">上传身份证、人像照片</div>
      <div class="tips">
        <p style="font-weight: bold">特别说明</p>
        <p>1. 根据有关部门要求，必须上传真实身份证照片。未上传照片，订单无效</p>
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
          <Uploader
            v-model="frontPicList"
            max-count="1"
            :preview-size="['3.4rem', '2.2rem']"
          />
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
          <Uploader
            v-model="behindPicList"
            max-count="1"
            :preview-size="['3.4rem', '2.2rem']"
          />
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
          <Uploader
            v-model="facePicList"
            max-count="1"
            :preview-size="['3.4rem', '2.2rem']"
          />
          <img class="example-pic" src="./images/head.png" alt="" />
        </div>
      </div>
    </div>
    <div class="submit-btn" @click="submit">提交信息</div>
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
import { Toast, Popup, Uploader, UploaderFileListItem } from "vant";
import NavBar from "@/components/NavBar/index.vue";
import RegionPicker from "@/components/RegionPicker.vue";
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getGoodsInfo, submitInfo } from "./utils/api";
import type { GoodsInfo } from "@/types";
import { uploadImg } from "@/api/common";

const router = useRouter();
const route = useRoute();

let regionIdArr: number[] = [];
let goodsId: string;
let agentId: string;
let frontPic = "";
let behindPic = "";
let facePic = "";

const open = ref(false);
const goodsInfo = ref<GoodsInfo>();
const name = ref("");
const idCode = ref("");
const phone = ref("");
const addressDetail = ref("");
const regionArr = ref<string[] | undefined>(undefined);
const regionPickerVisible = ref(false);
const frontPicList = ref<UploaderFileListItem[]>([]);
const behindPicList = ref<UploaderFileListItem[]>([]);
const facePicList = ref<UploaderFileListItem[]>([]);

watch(frontPicList, async (fileList: UploaderFileListItem[]) => {
  if (fileList.length) {
    const { relative_url } = await uploadImg(fileList[0].file as Blob);
    frontPic = relative_url;
  }
});
watch(behindPicList, async (fileList: UploaderFileListItem[]) => {
  if (fileList.length) {
    const { relative_url } = await uploadImg(fileList[0].file as Blob);
    behindPic = relative_url;
  }
});
watch(facePicList, async (fileList: UploaderFileListItem[]) => {
  if (fileList.length) {
    const { relative_url } = await uploadImg(fileList[0].file as Blob);
    facePic = relative_url;
  }
});

onMounted(() => {
  const { goods_id, agent_id } = route.query;
  goodsId = goods_id as string;
  agentId = (agent_id as string) || "";
  setGoodsInfo();
});

const setGoodsInfo = async () => {
  Toast.loading({ message: "加载中..." });
  goodsInfo.value = await getGoodsInfo(goodsId);
  Toast.clear();
};

const onRegionPickerComfirm = (
  regionList: string[],
  regionIdList: number[]
) => {
  regionArr.value = regionList;
  regionIdArr = regionIdList;
  regionPickerVisible.value = false;
};

const submit = () => {
  if (!name.value) {
    Toast("请输入姓名");
    return;
  }
  const _IDRe18 =
    /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
  const _IDre15 =
    /^([1-6][1-9]|50)\d{4}\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}$/;
  if (
    goodsInfo.value?.product.is_required_idcard &&
    !_IDRe18.test(idCode.value) &&
    !_IDre15.test(idCode.value)
  ) {
    Toast("请输入正确身份证号");
    return;
  }
  const phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
  if (!phoneReg.test(phone.value)) {
    Toast("请输入正确手机号");
    return;
  }
  if (!regionIdArr.length) {
    Toast("请选择所在城市");
    return;
  }
  if (!addressDetail.value) {
    Toast("请输入详细地址");
    return;
  }
  if (goodsInfo.value?.product.is_required_idphoto) {
    if (!frontPic) {
      Toast("请上传身份证正面照片");
      return;
    }
    if (!behindPic) {
      Toast("请上传身份证反面照片");
      return;
    }
    if (!facePic) {
      Toast("请上传人像照片");
      return;
    }
  }
  submitInfo(
    goodsId,
    agentId,
    name.value,
    idCode.value,
    phone.value,
    regionIdArr[0],
    regionIdArr[1],
    regionIdArr[2],
    addressDetail.value,
    frontPic,
    behindPic,
    facePic
  ).then(() => router.push("/done"));
};

const navToOrderQuery = () => router.push("/order_query");
</script>

<style lang="stylus" scoped>
.container
  padding .88rem 0
  .cover-wrap
    position relative
    height 100vw
    overflow hidden
    &.open
      height: fit-content
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
      color #FE3552
      font-size .26rem
      border-radius .2rem
      background #FFE0E4
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
        font-size .22rem
        .tips-icon
          height .22rem
          width .22rem
          transform translateY(.03rem)
      .content
        display flex
        justify-content space-between
        margin-top .24rem
        .example-pic
          width 3.4rem
          height 2.2rem
          border 1px solid #f9f9f9
  .submit-btn
    display flex
    align-items center
    justify-content center
    margin .5rem .24rem 0
    height .88rem
    color #fff
    font-size .3rem
    font-weight bold
    background #3976ff
    border-radius .1rem
@keyframes shake
  0%
    transform translateY(0.06rem)
  50%
    transform translateY(-0.06rem)
  100%
    transform translateY(0.06rem)
</style>
<style lang="stylus">
.cover-wrap
  font-size 0
  img
    width 100%
  p
    color #333
    font-size .28rem
</style>
