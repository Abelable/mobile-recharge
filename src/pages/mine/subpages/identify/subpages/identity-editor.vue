<template>
  <NavBar :title="cardId ? '编辑实名认证' : '添加实名认证'" />

  <div class="auth-card">
    <div class="title">请上传清晰有效的身份证正反面照片</div>
    <div class="remind">请确保身份证真实有效，请勿剪裁涂改，保证清晰显示。</div>
    <div class="card-pic-wrap">
      <Uploader v-model="idCardFrontList" :preview-image="false">
        <img
          class="card-pic"
          :class="{ shadow: idCardFrontList.length }"
          :src="
            idCardFrontList[idCardFrontList.length - 1]?.content ||
            'https://img.ubo.vip/mp/mine/auth/add-auth/front.png'
          "
        />
      </Uploader>
      <Uploader v-model="idCardBehindList" :preview-image="false">
        <img
          class="card-pic"
          :class="{ shadow: idCardBehindList.length }"
          :src="
            idCardBehindList[idCardBehindList.length - 1]?.content ||
            'https://img.ubo.vip/mp/mine/auth/add-auth/behind.png'
          "
        />
      </Uploader>
    </div>
    <label class="info-detail">
      <div class="input-title">姓名</div>
      <input v-model="userName" placeholder="请输入真实姓名" />
    </label>
    <label class="info-detail">
      <div class="input-title">身份证号</div>
      <input v-model="idNumber" placeholder="请输入正确的身份证号" />
    </label>
    <label class="info-detail">
      <div class="input-title">设为默认</div>
      <div class="input-title-desc">(每次下单时默认使用)</div>
      <Switch v-model="checked" active-color="#F7CC9C" />
    </label>
  </div>

  <div class="instructions">
    <div class="instructions-title">
      <img
        class="instructions-icon"
        src="https://img.ubo.vip/mp/mine/auth/add-auth/tips.png"
      />
      <span>为什么要实名认证：</span>
    </div>
    <div class="instructions-content">
      根据《网络直播营销行为规范》第三章第二十一条，主播入驻网络直播营销平台应当进行实名认证，您上传的信息只用于有播直播平台的实名认证，平台将对您的个人信息严格保密。
    </div>
  </div>

  <div class="btn-wrap">
    <button class="btn" :class="{ add: !cardId }" @click="submit">保存</button>
    <button class="btn" v-if="cardId" @click="deleteIdentity">删除</button>
  </div>
</template>

<script setup lang="ts">
import { Uploader, Switch, Dialog, UploaderFileListItem, Toast } from "vant";
import NavBar from "@/components/NavBar.vue";

import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { uploadFile } from "@/api/common";
import { addIdentity } from "../utils/api";
import {
  deleteIdentityItem,
  getIdentityInfo,
  editIdentity,
  AddIdentityParams,
} from "../utils/api";

const route = useRoute();
const router = useRouter();

const cardId = ref("");
const idCardFrontList = ref<UploaderFileListItem[]>([]);
const idCardBehindList = ref<UploaderFileListItem[]>([]);
const userName = ref("");
const idNumber = ref("");
const checked = ref(false);

onMounted(() => {
  cardId.value = route.query.id as string;
  if (cardId.value) setIdentityInfo();
});

const setIdentityInfo = async () => {
  const { card_zm, card_fm, name, id_number, is_set } = await getIdentityInfo(
    cardId.value
  );
  idCardFrontList.value = [{ content: card_zm }];
  idCardBehindList.value = [{ content: card_fm }];
  userName.value = name;
  idNumber.value = id_number;
  checked.value = is_set === 2;
};

const submit = async () => {
  if (!idCardFrontList.value?.length) {
    Toast("请上传身份证正面照片");
    return;
  }
  if (!idCardBehindList.value?.length) {
    Toast("请上传身份证反面照片");
    return;
  }
  if (!userName.value?.length) {
    Toast("请输入姓名");
    return;
  }
  if (!idNumber.value?.length) {
    Toast("请输入身份证号");
    return;
  }

  const [idCardFront] = await uploadFile(
    idCardFrontList.value[idCardFrontList.value.length - 1].content || ""
  );
  const [idCardBehind] = await uploadFile(
    idCardBehindList.value[idCardBehindList.value.length - 1].content || ""
  );

  const params: AddIdentityParams = {
    card_zm: idCardFront,
    card_fm: idCardBehind,
    name: userName.value,
    id_number: idNumber.value,
    is_set: checked.value ? 2 : 1,
  };

  if (cardId.value) await editIdentity({ id: cardId.value, ...params });
  else await addIdentity(params);

  router.back();
};

const deleteIdentity = () =>
  Dialog.confirm({ title: "提示", message: "确定删除商品吗？" }).then(
    async () => {
      await deleteIdentityItem(cardId.value);
      router.back();
    }
  );
</script>

<style lang="stylus" scoped>
.auth-card
  margin: 1.18rem .3rem .3rem
  padding: .18rem .30rem
  background-color: #fff
  border-radius: .12rem
  .title
    color: #333
    font-size: .28rem
    font-weight: 500
  .remind
    margin-top: .15rem
    color: #999
    font-size: .24rem
  .card-pic-wrap
    display: flex
    justify-content: space-between
    margin: .50rem 0
    .card-pic
      width: 3.08rem
      height: 2.08rem
      &.shadow
        width: 3.03rem
        height: 2.03rem
        border-radius: .14rem
        box-shadow 0 .04rem .04rem 0 rgba(0, 0, 0, 0.1)
  .info-detail
    display: flex
    align-items: center
    height: .88rem
    line-height: .88rem
    text-indent: .10rem
    font-size: .30rem
    border-bottom: .02rem solid #f0f0f0
    &:last-child
      border-bottom: none
    .input-title
      margin-right: .30rem
      width: 1.30rem
      color: #333
      font-size: .28rem
      font-weight: 500
    .info-detail
      input
        flex: 1
        font-size: .28rem
    .input-title-desc
      flex: 1
      font-size: .24rem
      color: #999
.instructions
  margin: .30rem .54rem
  color: #999
  font-size: .22rem
  .instructions-title
    margin-bottom: .20rem
    display: flex
    align-items: center
    .instructions-icon
      margin-right: .06rem
      width: .24rem
      height: .24rem
  .instructions-content
    padding-left: .30rem
.btn-wrap
  position: fixed
  bottom: .50rem
  display: flex
  align-items: center
  justify-content: space-between
  padding: 0 .30rem
  width: 100%
  .btn
    display flex
    align-items center
    justify-content center
    width: 3.30rem
    height: .88rem
    color: #F7CC9C
    font-size: .34rem
    font-weight: bold
    border-radius: .44rem
    background-color: #000
    &.add
      width: 100%
</style>
