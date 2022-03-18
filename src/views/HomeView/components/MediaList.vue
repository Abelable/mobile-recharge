<template>
  <LiveList v-if="item?.media_type === 1" :item="item" />
  <VideoList v-else-if="item?.media_type === 2" :item="item" />
  <GoodsList v-else :item="item" />
</template>

<script setup lang="ts">
import LiveList from "@/components/LiveList.vue";
import VideoList from "@/components/VideoList.vue";
import GoodsList from "@/components/GoodsList/index.vue";

import { defineProps } from "vue";
import { MediaInfo } from "../utils/api";

defineProps<{ item: MediaInfo }>();
</script>
