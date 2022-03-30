import { http } from "@/utils/http";

export interface CoinInfo {
  id: number;
  tb_money: string;
  end_time: string;
}

export const getCoinList = async (tb_state: number): Promise<CoinInfo[]> =>
  await http("/api/v4/user/my-yb", { data: { tb_state } });
