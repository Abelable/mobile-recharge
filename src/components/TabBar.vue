<template>
  <Tabbar
    active-color="#333333"
    inactive-color="#666666"
    route
    safe-area-inset-bottom
  >
    <TabbarItem
      v-for="(item, index) in menuList"
      :key="index"
      :to="item.path"
      replace
    >
      <span>{{ item.name }}</span>
      <template #icon="props">
        <img :src="props.active ? item.activeImg : item.img" />
      </template>
    </TabbarItem>
  </Tabbar>
</template>

<script setup lang="ts">
import { Tabbar, TabbarItem } from "vant";

const menuList = [
  {
    name: "有播",
    path: "/",
    img: require("@/assets/images/tabbar/home.png"),
    activeImg: require("@/assets/images/tabbar/home-active.png"),
  },
  {
    name: "圈子",
    path: "/social",
    img: require("@/assets/images/tabbar/social.png"),
    activeImg: require("@/assets/images/tabbar/social-active.png"),
  },
  {
    name: "消息",
    path: "/message",
    img: require("@/assets/images/tabbar/message.png"),
    activeImg: require("@/assets/images/tabbar/message-active.png"),
  },
  {
    name: "我的",
    path: "/mine",
    img: require("@/assets/images/tabbar/mine.png"),
    activeImg: require("@/assets/images/tabbar/mine-active.png"),
  },
];
</script>
