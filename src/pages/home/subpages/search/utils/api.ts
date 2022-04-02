import { GoodsInfo, LiveInfo, VideoInfo } from "@/types";
import { http } from "@/utils/http";

export interface KeywordItem {
  id: string;
  word: string;
}

export const getHistoryKeywords = async (): Promise<KeywordItem[]> =>
  await http("?r=lv/search-all/recent-record", { method: "POST" });

export const getHotKeywords = async (): Promise<KeywordItem[]> =>
  await http("?r=lv/search-all/hot-list", { method: "POST" });

export const deleteHistoryKeywords = async () =>
  await http("?=lv/search-all/delete-record", { method: "POST" });

export const recordKeyword = async (word: string) =>
  await http("?r=lv/search-all/log-search", { method: "POST", data: { word } });

export interface FilterOption {
  text: string;
  value: string;
}
export const getfilterOptions = async (): Promise<FilterOption[][]> => {
  const liveOptions = await http("?r=lv/live/live-cate-list");
  const liveFilterOptions: FilterOption[] = [{ text: "全部分类", value: "" }];
  liveOptions.forEach((item: { cate_name: string; id: string }) =>
    liveFilterOptions.push({ text: item.cate_name, value: item.id })
  );
  const goodsOptions = await http("/api/v4/category", { method: "POST" });
  const goodsFilterOptions: FilterOption[] = [{ text: "全部分类", value: "" }];
  goodsOptions.forEach((item: { name: string; id: string }) =>
    goodsFilterOptions.push({ text: item.name, value: item.id })
  );
  const { tag_list = [] } = await http("?r=lv/short-video/tag-list", {
    method: "POST",
    data: { type: 1 },
  });
  const videoFilterOptions: FilterOption[] = [{ text: "全部分类", value: "" }];
  tag_list.forEach((item: { tag_name: string; id: string }) =>
    videoFilterOptions.push({ text: item.tag_name, value: item.id })
  );
  return [liveFilterOptions, goodsFilterOptions, videoFilterOptions];
};

export const getSearchResult = async (
  word: string,
  search_type: number,
  synthesis: number,
  category_id: string,
  page: number
): Promise<{ list: LiveInfo[] | GoodsInfo[] | VideoInfo[] }> =>
  await http("?r=lv/search-all/search-for", {
    method: "POST",
    data: { word, search_type, synthesis, category_id, page },
  });
