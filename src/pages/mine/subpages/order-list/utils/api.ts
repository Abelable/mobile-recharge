import { ref } from "vue";
import { http } from "@/utils/http";
import { OrderInfo } from "@/types";

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

export const useOrderInfo = () => {
  const orderInfo = ref<OrderInfo>();

  const setOrderInfo = async (order_id: string) => {
    const res: OrderInfo = await http("/api/v4/order/detail", {
      method: "POST",
      data: { order_id },
    });
    orderInfo.value = res;
  };
  return { orderInfo, setOrderInfo };
};
