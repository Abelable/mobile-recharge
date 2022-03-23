import { http } from "@/utils/http";
import { GoodsInfo } from "@/types";

export interface MenuInfo {
  id: number;
  name: string;
  url: string;
}

export interface CategoryInfo {
  id: number;
  name: string;
  get_parent_id: MenuInfo[];
}

export const getCategoryList = async (): Promise<CategoryInfo[]> =>
  await http("/api/v4/category", { method: "POST" });

export interface SelectionInfo {
  id: number;
  cate_name: string;
}

export const getSeletionTab = async (): Promise<{ list: SelectionInfo[] }> =>
  await http("/api/v4/lvbo/get-yx-category");

export interface BannerInfo {
  ad_id: number;
  ad_code: string;
  ad_link: string;
  is_belong: string;
}

export const getSeletionList = async (
  page: number,
  cate_id: number
): Promise<{ banner: BannerInfo[]; product: GoodsInfo[] }> =>
  await http("/api/v4/goods/youxuan", { data: { page, cate_id } });

export const getSecgoodsList = async (
  cate_id: number,
  page: number,
  size: number
): Promise<{ product: GoodsInfo[] }> =>
  await http("/api/v4/lvbo/get_goods", {
    method: "POST",
    data: { cate_id, size, page },
  });

// async getCategoryGoodsList(cat_id, page = 1, page_size = 5) {
//   return await this.post({ url: `${this.mmsUrl}/api/v4/category/goods_list`, data: { cat_id, page, page_size } })
// }
