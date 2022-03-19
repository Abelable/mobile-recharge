<template>
  <LiveItem v-if="item?.media_type === 1" :item="item" />
  <VideoItem v-else :item="item" />
</template>

<script setup lang="ts">
import LiveItem from "@/components/LiveItem.vue";
import VideoItem from "@/components/VideoItem.vue";

import { defineProps } from "vue";
import { MediaInfo } from "../utils/api";

defineProps<{ item: MediaInfo }>();
</script>
