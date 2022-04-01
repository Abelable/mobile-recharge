<template>
  <SwipeCell right-width="80">
    <div class="inner" @click="editIdentity">
      <div class="auth-info">
        <span>{{ item.name }}</span>
        <span style="margin-left: 0.3rem">{{ idNumber }}</span>
      </div>
      <div class="edit-btn">
        <div v-if="item.is_set === 1">默认</div>
        <img
          class="arrow-icon"
          src="https://img.ubo.vip/mp/mine/auth/arrow.png"
        />
      </div>
    </div>
    <template #right>
      <div class="delete-btn" @click="deleteIdentity">删除</div>
    </template>
  </SwipeCell>
</template>

<script setup lang="ts">
import { SwipeCell } from "vant";

import { computed } from "vue";
import { useRouter } from "vue-router";
import { IdentityInfo, deleteIdentityItem } from "../utils/api";

const router = useRouter();
const props = defineProps<{ item: IdentityInfo }>();
const emit = defineEmits(["delete"]);

const idNumber = computed(() => {
  const target = props.item.id_number.split("");
  target.splice(6, 8, "********");
  return target.join("");
});

const editIdentity = () =>
  router.push({
    path: "/mine/identify/identity_editor",
    query: { id: props.item.card_id },
  });
const deleteIdentity = async () => {
  await deleteIdentityItem(props.item.card_id);
  emit("delete");
};
</script>

<style lang="stylus" scoped>
.inner
  display: flex
  justify-content: space-between
  align-items: center
  padding: 0 .24rem
  height: 1.28rem
  background #fff
  .auth-info
    flex: 1
    padding-left: .10rem
    font-size: .32rem
  .edit-btn
    display: flex
    align-items: center
    justify-content: flex-end
    width: 1.00rem
    height: 1.28rem
    color: #666
    font-size: .28rem
    .arrow-icon
      margin-left: .16rem
      width: .16rem
      height: .28rem
.delete-btn
  display flex
  align-items center
  justify-content center
  width 80px
  height 100%
  color #333
  font-size .28rem
  background #F7CC9C
</style>
