import { http } from "@/utils/http";
import { GoodsInfo } from "@/types/index";

export interface SupplierInfo {
  supplier_name: string;
  supplier_img: string;
  is_enterprise: boolean;
  top_goods: GoodsInfo[];
}

export const getSupplierInfo = async (
  supplier_id: string
): Promise<SupplierInfo> =>
  await http("?r=tbb/supplier/index", {
    method: "POST",
    data: { supplier_id },
  });
