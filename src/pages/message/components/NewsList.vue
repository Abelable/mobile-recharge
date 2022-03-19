<template>
  <div class="news-list">
    <img class="icon" :src="item.icon" />
    <div class="main">
      <div class="title-wrap">
        <div class="title">{{ item.title }}</div>
        <div class="time">{{ item.time }}</div>
      </div>
      <div class="content-wrap">
        <div class="content">{{ item.content }}</div>
        <div class="news-count">{{ item.newsCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MessageInfo } from "../utils/api";

defineProps<{ item: MessageInfo }>();
</script>

<style lang="stylus" scoped>
.news-list
  display flex
  align-items center
  padding .24rem
  background #fff
  border-bottom .01rem solid #eee
  .icon
    margin-right .18rem
    width .96rem
    height .96rem
    border-radius 50%
    background-image url('https://img.ubo.vip/mp/default-ubo-icon.png')
    background-repeat no-repeat
    background-size 100% 100%
  .main
    display flex
    flex-direction column
    justify-content space-between
    flex 1
    height .96rem
    .title-wrap
      display flex
      align-items center
      justify-content space-between
      .title
        color #333
        font-size .32rem
      .time
        color #999
        font-size .24rem
    .content-wrap
      display flex
      align-items center
      justify-content space-between
      .content
        color #999
        font-size .28rem
      .news-count
        padding 0 .10rem
        height .34rem
        color #fff
        font-size .24rem
        line-height .34rem
        background #FE4019
        border-radius .17rem
</style>
