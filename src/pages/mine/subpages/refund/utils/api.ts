import { http } from "@/utils/http";

export interface RefundOrderInfo {
  ret_id: number;
  return_sn: string;
  goods_thumb: string;
  goods_name: string;
  goods_attr: string;
  get_return_goods: { return_number: number };
  should_return: string;
  addressee: string;
  phone: string;
  apply_time: string;
  agree_apply: number;
}

export const getRefundOrderList = async (
  page: number,
  size: number
): Promise<RefundOrderInfo[]> =>
  await http("/api/v4/refound", {
    method: "POST",
    data: { page, size },
  });
