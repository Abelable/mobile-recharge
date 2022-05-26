<template>
  <NavBar :backIconVisible="false" :title="(goodsInfo?.name as string)">
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
  </div>
</template>

<script setup lang="ts">
import NavBar from "@/components/NavBar/index.vue";
import { GoodsInfo } from "@/types";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getGoodsInfo } from "./utils/api";

const router = useRouter();
const route = useRoute();
const open = ref(false);
const goodsInfo = ref<GoodsInfo>();
const agentId = ref<number>();

onMounted(async () => {
  const { goods_id, agent_id } = route.query;
  goodsInfo.value = await getGoodsInfo(goods_id as string);
  agentId.value = Number(agent_id);
});

const navToOrderQuery = () => router.push("/order_query");
</script>

<style lang="stylus" scoped>
.container
  padding-top .88rem
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
@keyframes shake
  0%
    transform translateY(0.06rem)
  50%
    transform translateY(-0.06rem)
  100%
    transform translateY(0.06rem)
</style>
