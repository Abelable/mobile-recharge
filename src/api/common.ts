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

export const addCart = async (
  goods_id: string,
  spec: (number | undefined)[],
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

export const getGoodsInfo = async (goods_id: string) =>
  await http("?r=tbb/goods-detail/index", {
    method: " POST",
    data: { goods_id },
  });
