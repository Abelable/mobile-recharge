<template>
  <NavBar title="我的YO币">
    <template v-slot:custom-menu>
      <div class="menu-tabs" ontap="selectMenu">
        <div
          class="menu-tab"
          :class="{ active: selectedIdx === index }"
          v-for="(item, index) in ['全部', '充值', '消费']"
          :key="index"
          @click="selectMenu(index)"
        >
          {{ item }}
        </div>
      </div>
    </template>
  </NavBar>

  <div class="diamont-balance-wrap">
    <div class="diamont-balance">当前剩余钻石：{{ diamondBalance }}</div>
    <div class="time-picker" @click="datePickerVisible = true">
      <!-- <span>{{ yearArr[pickerValue[0]] }}-{{ monthArr[pickerValue[1]] }}</span> -->
      <span>{{ currentDate }}</span>
      <img
        class="time-picker-icon"
        src="https://img.ubo.vip/mp/mine/gift-record/down-arrow-icon.png"
      />
    </div>
  </div>

  <PullRefresh v-model="refreshing" @refresh="onRefresh">
    <List
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoadMore"
    >
      <div class="record-list">
        <RecordItem
          v-for="(item, index) in recordList"
          :key="index"
          :item="item"
        />
      </div>
    </List>
  </PullRefresh>

  <EmptyIllus v-if="!recordList.length" desc="暂无记录" />

  <Popup v-model:show="datePickerVisible" position="bottom" closeable round>
    <DatetimePicker
      v-model="currentDate"
      type="year-month"
      title="选择年月"
      :min-date="minDate"
      :max-date="maxDate"
      :formatter="formatter"
    />
  </Popup>
</template>

<script setup lang="ts">
import { PullRefresh, List, Popup, DatetimePicker } from "vant";
import NavBar from "@/components/NavBar.vue";
import EmptyIllus from "@/components/EmptyIllus.vue";
import RecordItem from "./components/RecordItem.vue";

import { ref } from "vue";
import { GiftRecordInfo, getGiftRecordList } from "./utils/api";

let page = 0;
const minDate = new Date(2020, 0, 1);
const maxDate = new Date(2025, 10, 1);

const loading = ref(false);
const finished = ref(false);
const refreshing = ref(false);
const selectedIdx = ref(0);
const diamondBalance = ref(0);
const recordList = ref<GiftRecordInfo[]>([]);
const datePickerVisible = ref(false);
const currentDate = ref(new Date());

const onLoadMore = () => setRecordList();
const onRefresh = () => setRecordList(true);

const selectMenu = (index: number) => {
  if (index !== selectedIdx.value) {
    selectedIdx.value = index;
    setRecordList(true);
  }
};

const formatter = (type: string, val: number) => {
  if (type === "year") {
    return `${val}年`;
  }
  if (type === "month") {
    return `${val}月`;
  }
  return val;
};

const setRecordList = async (init = false) => {
  if (init) page = 0;
  const { list, diamond } = await getGiftRecordList(
    selectedIdx.value,
    "",
    ++page
  );
  if (init) diamondBalance.value = diamond;
  if (list.length)
    recordList.value = init ? list : [...recordList.value, ...list];
  else if (!init) finished.value = true;
  loading.value = false;
  refreshing.value = false;
};
</script>

<style lang="stylus" scoped>
.menu-tabs
  display: flex
  align-items: center
  width: 100%
  background: #fff
  box-shadow: 0 .02rem .10rem 0 rgba(231,231,235,0.5)
  .menu-tab
    flex: 1
    height: .89rem
    text-align: center
    line-height: .88rem
    font-size: .28rem
    &.active
      position: relative
      font-weight: 600
      color: #333
      &::after
        position: absolute
        left: 50%
        bottom: 0
        transform: translateX(-50%)
        content: ''
        width: .56rem
        height: .08rem
        background-color: #FAD07D
.diamont-balance-wrap
  position: relative
  margin-top: 1.76rem
  padding: .20rem .32rem
  background-color: #f4f4f4
  .diamont-balance
    color: #999
    font-size: .26rem
  .time-picker
    color: #333
    font-size: .30rem
    font-weight: bold
    .time-picker-icon
      margin-top: .32rem
      margin-left: .10rem
      width: .16rem
      height: .16rem
.record-list
  margin-top: 2.20rem
  padding: 0 .32rem
  background: #fff
</style>
