<template>
  <div class="payment-popup">
    <div class="title">选择支付方式</div>
    <RadioGroup v-model="type">
      <ul class="options">
        <li class="option">
          <div class="type">
            <img class="icon" src="./images/alipay.png" alt="" />
            <span>支付宝</span>
          </div>
          <Radio name="alipay" checked-color="#B87900" />
        </li>
        <li class="option">
          <div class="type">
            <img class="icon" src="./images/weixin.png" alt="" />
            <span>微信支付</span>
          </div>
          <Radio name="wxpay" checked-color="#B87900" />
        </li>
      </ul>
    </RadioGroup>
    <div class="payment-btn" @click="pay">点击支付</div>
  </div>
</template>

<script setup lang="ts">
import { RadioGroup, Radio } from "vant";
import { ref } from "vue";

const emit = defineEmits(["pay"]);

const type = ref("alipay");
const invalid = ref(false);

const pay = () => {
  !invalid.value && emit("pay", type.value);
};
</script>

<style lang="stylus" scoped>
.payment-popup
  padding .3rem
  .title
    color #333
    font-size .32rem
    font-weight 500
    text-align center
  .options
    margin-top .3rem
    .option
      display flex
      justify-content space-between
      align-items center
      padding .3rem 0
      border-bottom .01rem solid #f6f6f6
      .type
        display flex
        align-items center
        color #333
        font-size .28rem
        .icon
          margin-right .2rem
          width .5rem
          height .5rem
  .payment-btn
    margin-top .3rem
    height .8rem
    color #fff
    font-size .3rem
    font-weight 500
    line-height .8rem
    text-align center
    border-radius .4rem
    background #B87900
</style>
