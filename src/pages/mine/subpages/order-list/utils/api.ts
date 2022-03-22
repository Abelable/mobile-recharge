import { http } from "@/utils/http";
import { OrderInfo } from "@/types";

export const getOrderList = async (
  status: number,
  page: number,
  size: number
): Promise<OrderInfo[]> => {
  const { list }: { list: OrderInfo[] } = await http("/api/v4/order/list", {
    method: "POST",
    data: { status, page, size, type: "type" },
  });
  return list || [];
};

export const confirmOrder = async (order_id: number) =>
  await http("/api/v4/order/confirm", { method: "POST", data: { order_id } });

export const deleteOrder = async (order_id: number) =>
  await http("/api/v4/order/delete", { method: "POST", data: { order_id } });

export const cancelOrder = async (order_id: number) =>
  await http("/api/v4/order/cancel", { method: "POST", data: { order_id } });

export const getOrderInfo = async (order_id: string): Promise<OrderInfo> =>
  await http("/api/v4/order/detail", {
    method: "POST",
    data: { order_id },
  });

export interface ShippingRecord {
  id: string;
  context: string;
  time: string;
}
export interface ShippingInfo {
  id: string;
  shipping_name: string;
  invoice_no: string;
  list: ShippingRecord[];
}

export const getShippingInfo = async (
  order_id: string
): Promise<ShippingInfo> => {
  const [info]: [ShippingInfo] = await http("/api/v4/order/tracker-order-id", {
    data: { order_id },
  });
  return info;
};
