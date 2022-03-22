import { http } from "@/utils/http";

export interface GoodsItemInfo {
  goods_id: number;
  goods_name: string;
  goods_img: string;
  market_price: string;
  time: string;
}

export interface LiveItemInfo {
  lv_room_id: string;
  lv_cover: string;
  lv_title: string;
  user_name: string;
  member_num: number;
  is_follow: 0 | 1;
  date: string;
}

export const getGoodsTrackList = async (
  page: number,
  size: number
): Promise<GoodsItemInfo[]> =>
  await http("/api/auction/home/history", {
    method: "POST",
    data: { page, size, type: 2, way: 1 },
  });

export const getLiveTrackList = async (
  page: number,
  page_size: number
): Promise<LiveItemInfo[]> =>
  await http("?r=lv/live/my-browse-history", {
    method: "POST",
    data: { page, page_size },
  });
