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
  const isLoading = ref(false);

  const setRecommendGoodsList = async (module = 1) => {
    isLoading.value = true;
    const { recommend_goods_list }: { recommend_goods_list: GoodsInfo[] } =
      await http("?r=lv/live-front/recommend-goods", {
        method: "POST",
        data: { module },
      });
    isLoading.value = false;
    recommendGoodsList.value = recommend_goods_list;
  };
  return { recommendGoodsList, setRecommendGoodsList, isLoading };
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
