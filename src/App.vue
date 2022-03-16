<template>
  <router-view />
  <nav class="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
</template>

<style lang="stylus">
@import './assets/style/index.styl'

.nav
  position fixed
  left 0
  bottom 0
  display flex
  padding .12rem 0
  width 100%
  background #fff
</style>
