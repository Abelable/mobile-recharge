<template>
  <div class="container">
    <NavBar :title="addressId ? '修改地址' : '新增地址'" />

    <div class="intelligent-address">
      <div class="title">智能地址填写</div>
      <textarea
        class="filling-area"
        v-model="intelligentAddress"
        rows="5"
        cols="40"
        placeholder="粘贴整段地址自动识别姓名、电话和地址"
      />
      <div class="intelligent-btns-wrap">
        <Uploader v-model="picList" :preview-image="false">
          <div class="recognize-pic-btn">
            <img
              style="width: 0.4rem; height: 0.38rem"
              src="https://img.ubo.vip/mp/mine/address/add-address/camera.png"
            />
            <span style="margin-left: 0.1rem">上传图片</span>
          </div>
        </Uploader>
        <div class="text-btns">
          <div class="clear-btn" @click="intelligentAddress = ''">清空</div>
          <div class="submit-btn" @click="recognizeText">提交</div>
        </div>
      </div>
    </div>

    <ul class="address-info-wrap">
      <li class="info-list">
        <label class="title">收货人: </label>
        <input
          class="content"
          v-model="consignee"
          maxlength="8"
          placeholder="收货人姓名"
        />
      </li>
      <li class="info-list">
        <label class="title">手机号: </label>
        <input
          class="content"
          v-model="mobile"
          name="mobile"
          type="number"
          placeholder="请输入手机号"
        />
      </li>
      <li class="info-list" @click="regionPickerVisible = true">
        <label class="title">市 / 区: </label>
        <span class="content" :class="{ placeholder: !regionArr.length }">{{
          regionArr.length
            ? regionArr[0] + " " + regionArr[1] + " " + regionArr[2]
            : "请选择地区"
        }}</span>
      </li>
      <li class="info-list">
        <label class="title">详细地址: </label>
        <input
          class="content"
          v-model="addressDetail"
          placeholder="如街道，楼层、门牌号"
        />
      </li>
    </ul>

    <div class="address-default">
      <label class="title">设为默认</label>
      <VantSwitch v-model="isDefault" size="20px" active-color="#B87900" />
    </div>

    <div class="btns-wrap" :class="{ 'is-iphoneX': isIphoneX }">
      <div class="delete-btn" v-if="addressId" @click="deleteCurAddress">
        删除
      </div>
      <div class="save-btn" @click="save">保存</div>
    </div>

    <Popup v-model="regionPickerVisible" position="bottom" round>
      <RegionPicker
        :regionArr="regionArr"
        @confirm="onRegionPickerComfirm"
        @cancel="regionPickerVisible = false"
      />
    </Popup>
  </div>
</template>

<script setup lang="ts">
import { Switch as VantSwitch, Toast, Uploader, Popup } from "vant";
import NavBar from "@/components/NavBar.vue";
import RegionPicker from "./components/RegionPicker.vue";

import { onMounted, ref, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { uploadFile } from "@/api/common";
import { isIphoneX } from "@/utils/envJudgment";
import {
  AddAddressInfo,
  addAddress,
  deleteAddress,
  editAddress,
  getAddressInfo,
  recognizePicInfo,
  recognizeTextInfo,
} from "../../utils/api";

const route = useRoute();
const router = useRouter();

let regionIdArr: number[] = [];

const addressId = ref("");
const intelligentAddress = ref("");
const picList = ref<any[]>([]);
const consignee = ref("");
const mobile = ref("");
const addressDetail = ref("");
const regionArr = ref<string[]>([]);
const isDefault = ref(false);
const regionPickerVisible = ref(false);

watchEffect(() => {
  if (picList.value.length) recognizePic(picList.value[0].content);
});

onMounted(() => {
  const id = route.query.id as string;
  if (id) {
    addressId.value = id;
    setAddressInfo(id);
  }
});

const setAddressInfo = async (id: string) => {
  const addressInfo = await getAddressInfo(id);
  consignee.value = addressInfo.consignee;
  mobile.value = addressInfo.mobile;
  addressDetail.value = addressInfo.address;
  isDefault.value = addressInfo.default_address_id === id;
  regionArr.value = [
    addressInfo.province_name,
    addressInfo.city_name,
    addressInfo.district_name,
  ];
  regionIdArr = [addressInfo.province, addressInfo.city, addressInfo.district];
};

const recognizeText = async () => {
  if (!intelligentAddress.value) {
    Toast("内容不能为空～");
    return;
  }
  const {
    name,
    detail,
    province_name,
    city_name,
    county_name,
    province_id,
    city_id,
    county_id,
    ...restRet
  } = await recognizeTextInfo(intelligentAddress.value);
  consignee.value = name;
  mobile.value = restRet.mobile;
  addressDetail.value = detail;
  regionArr.value = [province_name, city_name, county_name];
  regionIdArr = [province_id, city_id, county_id];
};

const recognizePic = async (content: string) => {
  const [picUrl = ""] = (await uploadFile(content)) || [];
  const res = await recognizePicInfo(picUrl);
  if (res.detail) {
    const {
      address,
      province,
      province_id,
      city,
      city_id,
      district,
      district_id,
    } = res.detail;
    consignee.value = res.name;
    mobile.value = res.mobile;
    addressDetail.value = address;
    regionArr.value = [province, city, district];
    regionIdArr = [province_id, city_id, district_id];
  }
};

const onRegionPickerComfirm = (
  regionList: string[],
  regionIdList: number[]
) => {
  regionArr.value = regionList;
  regionIdArr = regionIdList;
  regionPickerVisible.value = false;
};

const save = async () => {
  const [provinceId, cityId, districtId] = regionIdArr || [0, 0, 0];
  const reg = /^1\d{10}$/;
  const toastTip = !consignee.value
    ? "请输入姓名"
    : !mobile.value || !reg.test(mobile.value)
    ? "请输入正确的手机号码"
    : !provinceId
    ? "请选择收货地址"
    : !addressDetail.value
    ? "请输入详细地址"
    : "";
  if (toastTip) {
    Toast(toastTip);
    return;
  }

  const addressInfo: AddAddressInfo = {
    consignee: consignee.value,
    mobile: mobile.value,
    province: provinceId,
    city: cityId,
    district: districtId,
    address: addressDetail.value,
    default: isDefault.value,
  };
  if (addressId.value)
    await editAddress({ address_id: addressId.value, ...addressInfo });
  else await addAddress(addressInfo);
  router.go(-1);
};

const deleteCurAddress = async () => {
  await deleteAddress(addressId.value);
  router.go(-1);
};
</script>

<style lang="stylus" scoped>
.container
  padding .24rem
  padding-top 1.12rem
  .title
    color #333
    font-size .30rem
    font-weight bold
  .intelligent-address
    padding .24rem
    border-radius .16rem
    background #fff
    .filling-area
      margin-top .16rem
      padding .10rem
      width 100%
      height 2.40rem
      font-size .26rem
      box-sizing border-box
      border .01rem solid #dbdbdb
    .intelligent-btns-wrap
      display flex
      justify-content space-between
      align-items center
      .recognize-pic-btn, .text-btns
        display flex
        align-items center
        font-size .26rem
        .clear-btn
          margin-right .20rem
          color #333
        .submit-btn
          padding .06rem .2rem
          color #F7CC9C
          border-radius .1rem
          background #000
  .address-info-wrap
    margin-top .24rem
    padding 0 .24rem
    border-radius .16rem
    background #fff
    .info-list
      height .90rem
      display flex
      align-items center
      border-bottom .01rem solid #e5e5e5
      &:last-child
        border none
      .content
        margin-left .20rem
        flex 1
        color #333
        font-size .30rem
        &.placeholder
          color #888
  .address-default
    display flex
    align-items center
    justify-content space-between
    margin-top .24rem
    padding 0 .24rem
    height 1.00rem
    background #fff
    border-radius .16rem
  .btns-wrap
    position fixed
    left 0
    bottom 0
    width 100%
    display flex
    justify-content space-between
    align-items center
    &.is-iphoneX
      bottom .2rem
    .delete-btn, .save-btn
      margin .24rem
      flex 1
      height .80rem
      line-height .80rem
      text-align center
      border-radius .40rem
      font-size .34rem
      font-weight bold
      box-sizing border-box
    .delete-btn
      color #000
      background #F7CC9C
    .save-btn
      color #F7CC9C
      background #000
</style>
