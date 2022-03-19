import { ref } from "vue";
import { GoodsInfo } from "@/api/common";
import { http } from "@/utils/http";

export interface OrderGoodsInfo extends GoodsInfo {
  goods_number: number;
  goods_sn: string;
  goods_price: string;
  goods_cause: number;
  goods_attr: string;
  rec_id: number;
  ret_id: number;
}

export interface OrderInfo {
  order_id: number;
  order_sn: string;
  invoice_no: string;
  order_status_to: number;
  order_goods: OrderGoodsInfo[];
  goods: OrderGoodsInfo[];
  order_goods_num: number;
  bonus: string;
  shipping_id: number;
  goods_amount_formated: string;
  shipping_fee_formated: string;
  surplus_formated: string;
  money_paid_formated: string;
  order_amount_formated: string;
  total_amount_formated: string;
  shop_id: number;
  shop_logo: string;
  shop_name: string;
  consignee: string;
  mobile: string;
  address: string;
  add_time: string;
  pay_time: string;
  postscript: string;
}

export const useOrderList = () => {
  const orderList = ref<OrderInfo[]>([]);

  const setOrderList = async (status: number, page: number, size = 10) => {
    const { list }: { list: OrderInfo[] } = await http("/api/v4/order/list", {
      method: "POST",
      data: { status, page, size, type: "type" },
    });
    orderList.value = list;
  };

  return { orderList, setOrderList };
};

export const confirmOrder = async (order_id: number) =>
  await http("/api/v4/order/confirm", { method: "POST", data: { order_id } });

export const deleteOrder = async (order_id: number) =>
  await http("/api/v4/order/delete", { method: "POST", data: { order_id } });

export const cancelOrder = async (order_id: number) =>
  await http("/api/v4/order/cancel", { method: "POST", data: { order_id } });
