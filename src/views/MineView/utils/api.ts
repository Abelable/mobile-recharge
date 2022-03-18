import { http } from "@/utils/http";
import { reactive, ref } from "vue";

export interface UserInfo {
  user_id: number;
  avatar: string;
  nickname: string;
  mobile: string;
}
export interface MineInfo extends UserInfo {
  pay_count: number;
  wait_send_order: number;
  already_send_order: number;
  return_count: number;
  fans_count: number;
  follow_count: number;
}

export const useMineInfo = () => {
  const userInfo = ref<UserInfo | null>(null);
  const fansCount = ref(0);
  const followCount = ref(0);
  const orderCountList = reactive([0, 0, 0, 0, 0]);

  const setMineInfo = async () => {
    const {
      user_id = 0,
      avatar = "",
      nickname = "",
      mobile = "",
      pay_count = 0,
      wait_send_order = 0,
      already_send_order = 0,
      return_count = 0,
    }: Partial<MineInfo> = await http("/api/v4/user/profile");
    userInfo.value = { user_id, avatar, nickname, mobile };
    orderCountList[0] = pay_count;
    orderCountList[1] = wait_send_order;
    orderCountList[2] = already_send_order;
    orderCountList[4] = return_count;

    const { fans_count = 0, follow_count = 0 }: Partial<MineInfo> = await http(
      "?r=lv/room/get-anchor-card-info",
      { method: "POST", data: { anchor_id: user_id || "" } }
    );
    fansCount.value = fans_count;
    followCount.value = follow_count;
  };

  return { userInfo, fansCount, followCount, orderCountList, setMineInfo };
};
