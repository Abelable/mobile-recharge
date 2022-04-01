<template>
  <NavBar title="实名认证" />
  <div class="identity-list">
    <IdentityItem
      v-for="(item, index) in identityList"
      :key="index"
      :item="item"
      @delete="setIdentityList"
    />
  </div>
  <div class="missing-icon" v-if="!identityList.length">
    <img
      style="width: 2.98rem; height: 2.9rem"
      src="https://img.ubo.vip/mp/mine/auth/missing-icon.png"
    />
    <span class="missing-text">
      您暂时还没有实名认证哦～\n认证后即可实现海外购
    </span>
  </div>
  <div
    class="add-auth"
    :class="{ icon: identityList.length, btn: !identityList.length }"
    @click="addIdentity"
  >
    <img
      v-if="identityList.length"
      style="width: 0.44rem; height: 0.44rem"
      src="https://img.ubo.vip/mp/mine/auth/add-auth-icon.png"
    />
    <div v-else>去实名</div>
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar.vue";
import IdentityItem from "./components/IdentityItem.vue";

import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { getIdentityList, IdentityInfo } from "./utils/api";

const router = useRouter();

const identityList = ref<IdentityInfo[]>([]);

onMounted(() => setIdentityList());

const setIdentityList = async () =>
  (identityList.value = await getIdentityList());
const addIdentity = () => router.push("/mine/identify/identity_editor");
</script>

<style lang="stylus" scoped>
.identity-list
  margin-top: .88rem
  padding-bottom: 2rem
.missing-icon
  margin-top: 35%
  display: flex
  flex-direction: column
  align-items: center
  .missing-text
    margin-top: .60rem
    text-align: center
    color: #999
    font-size: .28rem
.add-auth
  position: fixed
  display: flex
  align-items: center
  justify-content: center
  width: 5.80rem
  height: .88rem
  border-radius: .44rem
  &.btn
    left: 50%
    bottom: 1.00rem
    transform: translateX(-50%)
    width: 5.80rem
    color: #000000
    font-size: .34rem
    font-weight: bold
    border: .02rem solid #000
  &.icon
    right: .45rem
    bottom: .45rem
    width: .88rem
    background-color: rgba(0, 0, 0, 0.6)
</style>
