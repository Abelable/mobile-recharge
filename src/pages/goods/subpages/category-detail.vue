<template>
  <NavBar :title="name" />
  <PullRefresh class="container" v-model="refreshing" @refresh="onRefresh">
    <List v-model="loading" :finished="finished" @load="onLoadMore">
      <GoodsList :list="goodslist" />
    </List>
  </PullRefresh>
</template>

<script setup lang="ts">
import { PullRefresh, List } from "vant";
import NavBar from "@/components/NavBar.vue";
import GoodsList from "@/components/GoodsList.vue";

import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import _ from "lodash";
import { getCategoryGoodsList } from "../utils/api";
import { GoodsInfo } from "@/types/index";

const route = useRoute();

let page = 0;

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const id = ref(0);
const name = ref("");
const goodslist = ref<GoodsInfo[]>([]);

onMounted(() => {
  id.value = Number(route.query.id);
  name.value = route.query.name as string;
});

const onLoadMore = _.debounce(() => setGoodsList(), 200);
const onRefresh = () => setGoodsList(true);

const setGoodsList = async (init = false) => {
  if (init) page = 0;
  const list = await getCategoryGoodsList(id.value, ++page, 10);
  if (list.length) {
    goodslist.value = init ? list : [...goodslist.value, ...list];
  } else finished.value = true;
  loading.value = false;
  refreshing.value = false;
};
</script>

<style lang="stylus" scoped>
.container
  margin-top: .88rem
  padding: .24rem
</style>
