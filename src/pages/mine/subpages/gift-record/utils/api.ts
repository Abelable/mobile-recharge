import { http } from "@/utils/http";

export interface GiftRecordInfo {
  id: number;
  type: string;
  title: string;
  cover: string;
  anchor_name: string;
  price: string;
  num: string;
  amount: string;
  created_at: string;
}

export const getGiftRecordList = async (
  type: number,
  date: string,
  page: number
): Promise<{ list: GiftRecordInfo[]; diamond: number }> =>
  await http("?r=lv/reward/diamond-record", {
    method: "POST",
    data: { type, date, page },
  });
