import { http } from "@/utils/http";

export interface KeywordItem {
  id: string;
  word: string;
}

export const getHistoryKeywords = async (): Promise<KeywordItem[]> =>
  await http("?r=lv/search-all/recent-record", { method: "POST" });

export const getHotKeywords = async (): Promise<KeywordItem[]> =>
  await http("?r=lv/search-all/hot-list", { method: "POST" });
