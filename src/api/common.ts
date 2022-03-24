import { GoodsInfo } from "@/types";
import { http } from "@/utils/http";
import { ref } from "vue";

export const toggleSubscribeAnchor = async (status: number, roomId: string) =>
  await http("?r=lv/live/preview-destine", {
    method: "POST",
    data: { switch: status, roomId },
  });

export const togglePraiseStatus = async (video_id: string) =>
  await http("?r=lv/short-video/video-like", {
    method: "POST",
    data: { video_id },
  });

export const useRecommendGoodsList = () => {
  const recommendGoodsList = ref<GoodsInfo[]>([]);

  const setRecommendGoodsList = async (module = 1) => {
    const { recommend_goods_list }: { recommend_goods_list: GoodsInfo[] } =
      await http("?r=lv/live-front/recommend-goods", {
        method: "POST",
        data: { module },
      });
    recommendGoodsList.value = recommend_goods_list;
  };
  return { recommendGoodsList, setRecommendGoodsList };
};

export enum PayType {
  alipay = "alipay",
  wxpay = "wxpay",
}
export const getPaymentParams = async (
  order_sn: string,
  pay_code: PayType,
  openid: string
) =>
  await http("/api/v4/payment/change_payment", {
    data: { order_sn, pay_code, openid },
  });

export const uploadFile = async (content: string): Promise<string[]> =>
  await http("/api/v4/user/material", {
    data: { "file[content]": content },
  });

export const getCartCount = async (): Promise<{ cart_number: string }> =>
  await http("/api/v4/cart/cartNum");

export const addCart = async (
  goods_id: string,
  spec: (string | undefined)[],
  num: number,
  rec_type = 10
) =>
  await http("/api/v4/cart/add", {
    method: "POST",
    data: { goods_id, spec, num, rec_type },
  });

export const updateCartGoods = async ({
  rec_id,
  num,
  spec,
}: {
  rec_id: number;
  num: number;
  spec: string;
}) =>
  await http("/api/v4/cart/update", {
    method: "POST",
    data: { rec_id, num, spec },
  });

export interface BonusInfo {
  type_id: string;
  type_name: string;
  limit_tip: string;
  limit_time: string;
  type_money: string;
  is_have: 0 | 1;
}
export interface PromotionInfo {
  tip_content: string;
  show_name: string;
  limit_time: string;
  rules: string;
  show_detail: boolean;
}
export interface GoodsServiceInfo {
  name: string;
  explains: string;
}
export interface SupplierInfo {
  supplier_id: string;
  supplier_name: string;
  supplier_img: string;
  is_enterprise: 0 | 1;
  top_goods: GoodsInfo[];
}

export interface SpecDetailInfo {
  id: string;
  label: string;
  goods_attr_thumb: string;
  format_price: string;
}
export interface SpecInfo {
  specification: { name: string; values: SpecDetailInfo[] }[];
  attr_num: { [key in string]: number };
}

export interface GoodsSpecialInfo {
  sale_count: number;
  total_count: number;
  allow_buy_time: string;
  end_time: string;
}
export interface GoodsSpikeInfo {
  is_remind: 0 | 1;
  sec_limit: string;
  all_order_number: string;
  begin_time_format: string;
  end_time_format: string;
  sec_price: string;
}
export interface GoodsServiceInfo {
  name: string;
  explains: string;
}

export interface GoodsDetailInfo {
  goods_name: string;
  goods_type: string;
  keywords: string;
  noti_info: string;
  img: { thumb_url: string }[];
  default_attr_img: string;
  mid_banner: { ad_code: string }[];
  goods_desc_array: { url: string }[];
  promote_price: string;
  shop_price: string;
  market_price: string;
  ghost_count: number;
  goods_number: number;
  bonus_info: BonusInfo[];
  manjian: PromotionInfo[];
  goods_service: GoodsServiceInfo[];
  supplier_info: SupplierInfo | null;
  product_specification: { label: string; price: string }[];
  recommend_goods: GoodsInfo[];
  attr_goods_info: SpecInfo;
  special_buy_status: GoodsSpecialInfo | null;
  seckill: GoodsSpikeInfo | null;
}

export const getGoodsInfo = async (
  goods_id: string
): Promise<GoodsDetailInfo> =>
  await http("?r=tbb/goods-detail/index", {
    method: "POST",
    data: { goods_id },
  });

export const getNewBonus = async (type_id: string) =>
  await http("?r=tbb/bonus/get-new-bonus", {
    method: "POST",
    data: { type_id },
  });
