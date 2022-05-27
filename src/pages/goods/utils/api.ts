import { http } from "@/utils/http";
import type { GoodsInfo } from "@/types";

export const getGoodsInfo = async (id: number): Promise<GoodsInfo> =>
  await http(`/api/v1/h5/goods/show/${id}`);
