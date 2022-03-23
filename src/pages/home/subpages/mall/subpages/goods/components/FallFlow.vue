<template>
  <div class="fall-flow">
    <ul>
      <li>
        <slot name="banner" />
      </li>
      <li v-for="(item, index) in lists" :key="index">
        <GoodsList v-if="index % 2 === 0" :item="item" />
      </li>
    </ul>
    <ul>
      <li>
        <slot name="tiles" />
      </li>
      <li v-for="(item, index) in lists" :key="index">
        <GoodsList v-if="index % 2 === 1" :item="item" />
      </li>
    </ul>
  </div>
</template>

<script>
import GoodsList from '@/components/GoodsList'

export default {
  components: { GoodsList },

  props: {
    lists: Array
  }
}
</script>

<style lang="stylus" scoped>
.fall-flow
  display flex
  justify-content space-between
  align-items flex-start
</style>