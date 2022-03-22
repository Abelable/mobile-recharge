import { reactive, ref } from "vue";
import { getMineInfo, UserInfo } from "./api";

export const useMineInfo = () => {
  const userInfo = ref<UserInfo | null>(null);
  const fansCount = ref(0);
  const followCount = ref(0);
  const orderCountList = reactive([0, 0, 0, 0, 0]);

  const setMineInfo = async () => {
    const {
      user_id,
      avatar,
      nickname,
      mobile,
      pay_count,
      wait_send_order,
      already_send_order,
      return_count,
      fans_count,
      follow_count,
    } = await getMineInfo();
    userInfo.value = { user_id, avatar, nickname, mobile };
    orderCountList[0] = pay_count;
    orderCountList[1] = wait_send_order;
    orderCountList[2] = already_send_order;
    orderCountList[4] = return_count;
    fansCount.value = fans_count;
    followCount.value = follow_count;
  };

  return { userInfo, fansCount, followCount, orderCountList, setMineInfo };
};
