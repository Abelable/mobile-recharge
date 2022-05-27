import { http } from "@/utils/http";
import type { GoodsInfo, OrderInfo } from "@/types";

export const getGoodsInfo = async (id: number): Promise<GoodsInfo> =>
  await http(`/api/v1/h5/goods/show/${id}`);

export const submitInfo = async (
  goods_id: number,
  agent_id: number,
  buyer: string,
  idcard: string,
  phone: string,
  province_id: number,
  city_id: number,
  area_id: number,
  detail_address: string,
  idcard_front_photo: string,
  idcard_back_photo: string,
  bareheaded_photo: string
) =>
  await http("/api/v1/h5/order/store", {
    method: "POST",
    data: {
      goods_id,
      agent_id,
      buyer,
      idcard,
      phone,
      province_id,
      city_id,
      area_id,
      detail_address,
      idcard_front_photo,
      idcard_back_photo,
      bareheaded_photo,
    },
  });

export const getOrderInfo = async (phone: string): Promise<OrderInfo[]> =>
  await http("/api/v1/h5/order/index", {
    data: {
      "filter[phone]": phone,
    },
  });
