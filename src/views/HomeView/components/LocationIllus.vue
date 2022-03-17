<template>
  <div class="location-illus">
    <img style="width: 1.04rem; height: 1.04rem;" src="https://img.ubo.vip/mp/index/nearby-address-location.png" >
    <div class="content">
      <div>开启定位服务</div>
      <div>获得更精准的定位服务内容～</div>
    </div>
    <div class="btn" @click="setLocationInfo">立即开启</div>
  </div>
</template>

<script>

export default {
  methods: {
    setLocationInfo() {
      this.$emit('setLocationInfo')
    }
  }
}
</script>

<style lang="stylus" scoped>
.location-illus
  display flex
  align-items center
  padding 0 .22rem
  height 1.20rem
  border-radius .12rem
  background #fff
  .content
    margin-left .18rem
    flex 1
    font-size .26rem
    color #333
  .btn
    width 1.36rem
    height .48rem
    background #FFEBC5
    color #B97900
    font-size .24rem
    border-radius .10rem
    line-height .48rem
    text-align center
</style>