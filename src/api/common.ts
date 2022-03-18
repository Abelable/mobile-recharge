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

export interface GoodsInfo {
  goods_id: string;
  goods_name: string;
  goods_thumb: string;
  market_price: string;
  shop_price: string;
  sales_count: string;
  sales_volume: number;
  ghost_count: string;
  is_seckill: boolean;
}

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
