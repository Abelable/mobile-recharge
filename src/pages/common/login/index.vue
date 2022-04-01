<template>
  <div class="container">
    <img class="bg" src="https://img.ubo.vip/mp/login/login-bg.png" />
    <div class="content">
      <div class="title">请登录</div>
      <div class="tips">欢迎来到有播</div>
      <div class="input-wrap">
        <div class="input-list">
          <img
            style="width: 0.38rem; height: 0.38rem"
            src="./images/phone-icon.png"
          />
          <input v-model="mobile" placeholder="请输入手机号" />
        </div>
        <div class="input-list">
          <img
            style="width: 0.38rem; height: 0.38rem"
            src="./images/code-icon.png"
          />
          <input v-model="code" placeholder="请输入验证码" />
          <div class="get-code-btn" @click="sendCode">
            {{ timeStamp ? timeStamp + "s" : "获取验证码" }}
          </div>
        </div>
      </div>
      <div class="protocol">
        注册即代表您同意<a
          href="https://madmin.youboi.com/admin/view_article.php?act=view&article_id=144"
          >《有播用户服务协议》</a
        >
      </div>
      <div class="login-btn" :class="{ active: code }" @click="login">登录</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getSms, getToken } from "./utils/api";

const route = useRoute();
const router = useRouter();

const mobile = ref("");
const code = ref("");
const timeStamp = ref(0);
const countDown = ref(0);

const sendCode = () => {
  if (!countDown.value && mobile.value) {
    getSms(mobile.value);
    setCountDown();
  }
};

const login = async () => {
  if (code.value) {
    const { token = "" } = await getToken(mobile.value, code.value);
    if (token) {
      localStorage.setItem("token", token);
      route.query.redirect
        ? router.push(`${route.query.redirect}`)
        : router.back();
    }
  }
};

const setCountDown = () => {
  timeStamp.value = 60;
  countDown.value = setInterval(() => {
    if (timeStamp.value > 0) {
      --timeStamp.value;
    } else {
      clearInterval(countDown.value);
      countDown.value = 0;
    }
  }, 1000);
};
</script>

<style scoped lang="stylus">
.container
  position relative
  width: 100vw;
  height: 100vh;
  .bg
    position absolute
    top 0
    left 0
    width 100%
    height 100%
    z-index -1
  .content
    padding 1.2rem .6rem
    .title
      color #333
      font-size .68rem
      font-weight bold
    .tips
      margin-left .08rem
      font-size .3rem
      color #333
    .input-wrap
      margin-top .6rem
      padding 0 .5rem
      font-size .26rem
      .input-list
        display flex
        align-items center
        padding .26rem 0
        border-bottom .01rem solid #D8D8D8
        input
          margin-left .15rem
          flex 1
        .get-code-btn
          white-space nowrap
    .protocol
      margin-top 27px
      color #A3A3A3
      font-size 10px
      text-align center
      a
        color #B2372B
        text-decoration none
    .login-btn
      margin .5rem auto
      width 5rem
      height .8rem
      line-height .8rem
      text-align center
      color #fff
      font-weight 500
      font-size .36rem
      border-radius .4rem
      background-color #D8D8D8
      &.active
        background-color #CB9B49
</style>
