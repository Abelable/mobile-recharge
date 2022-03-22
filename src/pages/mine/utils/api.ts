import { http } from "@/utils/http";

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

export const getMineInfo = async (): Promise<MineInfo> => {
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
  const { fans_count = 0, follow_count = 0 }: Partial<MineInfo> = await http(
    "?r=lv/room/get-anchor-card-info",
    { method: "POST", data: { anchor_id: user_id || "" } }
  );
  return {
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
  };
};
