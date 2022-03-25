import { http } from "@/utils/http";
import { GoodsInfo } from "@/types/index";

export interface CartGoodsInfo extends GoodsInfo {
  is_checked_goods: boolean;
  product_number: number;
  goods_attr: string;
  goods_price: string;
  goods_number: number;
  rec_id: number;
}
export interface CartInfo {
  store_id: number;
  store_logo: string;
  store_name: string;
  supplier_id: number;
  checked: boolean;
  goods: CartGoodsInfo[];
}
export interface InvalidCartGoodsInfo extends GoodsInfo {
  is_checked: 0 | 1;
  rec_id: number;
}

export const getCartList = async (): Promise<{
  cart_list: CartInfo[];
  not_on_sale: InvalidCartGoodsInfo[];
}> => await http("/api/v4/cart/goodslistnew", { method: "POST" });

export const cartCheck = async (
  rec_id: string
): Promise<{ goods_amount_formated: string }> =>
  await http("/api/v4/cart/checked", {
    method: "POST",
    data: { rec_id, type: 1 },
  });

export const deleteCartList = async (rec_id: string) =>
  await http("/api/v4/cart/deletecart", {
    method: "POST",
    data: { rec_id, type: 1 },
  });

export const getGoodsSpec = async (goods_id: string) =>
  await http("/api/v4/cart/goods_spec", { method: "POST", data: { goods_id } });
