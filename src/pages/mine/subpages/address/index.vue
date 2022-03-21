<template>
  <NavBar title="收货地址" />

  <SwipeCell
    class="address-list"
    v-for="(item, index) in addressList"
    :key="index"
    right-width="80"
  >
    <div class="inner" @click="chooseAddress(item.id)">
      <div class="content">
        <div class="user-info">
          <div class="name">{{ item.name }}</div>
          <div>{{ item.mobile }}</div>
          <div class="default-icon" v-if="item.is_checked">默认</div>
        </div>
        <div class="detail">
          {{ item.city_name + item.district_name + item.address }}
        </div>
      </div>
      <img
        @click.stop="editAddress(item.id)"
        style="width: 0.38rem; height: 0.38rem"
        src="https://img.ubo.vip/mp/mine/address/edit.png"
      />
    </div>
    <template #right>
      <div class="delete-btn" @click="deleteAddress(item.id)">删除</div>
    </template>
  </SwipeCell>

  <div class="add-address-btn" @click="addAddress">添加地址</div>
</template>

<script setup lang="ts">
import { SwipeCell } from "vant";
import NavBar from "@/components/NavBar.vue";

import { ref, onActivated } from "vue";
import { useRouter, useRoute } from "vue-router";
import * as api from "./utils/api";

const isSelectAddress = ref(false);
const router = useRouter();
const route = useRoute();
const { addressList, setAddressList } = api.useAddressList();

onActivated(() => {
  isSelectAddress.value = route.query.isSelectAddress === "true";
  setAddressList();
});

const chooseAddress = (id: number) => {
  if (isSelectAddress.value) {
    router.push({
      path: "/mall/goods/create-order",
      query: {
        addressId: id,
      },
    });
  } else {
    router.push({
      path: "/mine/address/editor",
      query: { id },
    });
  }
};
const editAddress = (id: number) =>
  router.push({
    path: "/mine/address/editor",
    query: { id },
  });
const addAddress = () => router.push({ path: "/mine/address/editor" });
const deleteAddress = (id: number) => {
  api.deleteAddress(id);
  addressList.value = addressList.value.filter((item) => item.id != id);
};
</script>

<style lang="stylus" scoped>
.address-list
    margin-top .88rem
    margin-bottom .01rem
    .inner
      display flex
      align-items center
      height 1.50rem
      padding 0 .24rem
      background #fff
      .content
        flex 1
        color #999
        font-size .26rem
        .user-info
          display flex
          align-items center
          color #333
          font-size .28rem
          .name
            margin-right .2rem
          .default-icon
            margin-left .36rem
            padding .02rem .06rem
            font-size .20rem
            color #B87900
            border-radius .08rem
            border .02rem solid #000
        .detail
          margin-top .16rem
    .delete-btn
      display flex
      align-items center
      justify-content center
      width 80px
      height 100%
      color #333
      font-size .28rem
      background #F7CC9C
.add-address-btn
  position fixed
  left 50%
  bottom .50rem
  transform translateX(-50%)
  width 5.80rem
  height .88rem
  border-radius .44rem
  color #000
  font-size .34rem
  font-weight bold
  text-align center
  line-height .84rem
  border .02rem solid #000
</style>
