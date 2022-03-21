<template>
  <div class="rule-pop">
    <h2 class="title">优惠券使用规则</h2>
    <div class="content">
      <h3 class="rule-title">一 目前平台有哪些种类的优惠券？</h3>
      <p class="rule-content">
        全场通用类满减券：指平台内除个别商品（具体参考商品说明）外，所有商品都可使用该券；<br />
        指定商品满减券：指只有限定的商品才可使用该券，一般限定的商品会在满减券名称上透出；<br />
        指定类目满减券：指只有限定的类目才可使用该券，一般限定的类目会在满减券名称上透出；<br />
        无门槛通用券：直接抵扣券上数值金额，如果商品价值小于券值，则付款0元即可
      </p>
      <h3 class="rule-title">二 如何判断是否满足优惠券的使用条件？</h3>
      <p class="rule-content">
        优惠券有有效期，使用日期需在有效期范围内；<br />
        订单的商品金额（是指商品金额，不包含运费、
        税费）必须满足优惠券的使用门槛；<br />
        下单渠道符合优惠券的使用渠道。使用渠道目前 只有：有播APP
      </p>
      <h3 class="rule-title">
        三 优惠券可以叠加使用吗？优惠券可与YO币叠加使用吗？
      </h3>
      <p class="rule-content">
        优惠券不可叠加使用，一个订单只能使用一张优惠券。优惠券可与YO币叠加使用。
      </p>
      <h3 class="rule-title">
        四 使用优惠券下单后，若申请售后，优惠券退还给用户吗？
      </h3>
      <p class="rule-content">
        使用优惠券下单并对整个订单申请售后，若平台客服成功受理后，优惠券不会返还账户。
      </p>
      <h3 class="rule-title">
        五 使用优惠券下单后，若超时未支付该订单，优惠券退还给用户吗？
      </h3>
      <p class="rule-content">
        使用优惠券下单生成订单后，但超时未支付该订单，优惠券会原路返还账户。
      </p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="stylus" scoped>
.rule-pop
  padding .3rem
  color #333
  .title
    font-size .32rem
    text-align center
    font-weight 600
  .content
    margin-top .1rem
    height 6.8rem
    overflow-y scroll
    .rule-title
      margin-top .2rem
      font-size .28rem
      font-weight 600
    .rule-content
      margin-top .1rem
      font-size .26rem
</style>
