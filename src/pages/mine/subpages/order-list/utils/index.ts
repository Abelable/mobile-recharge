import { ref } from "vue";
import { OrderInfo } from "@/types";
import {
  getOrderInfo,
  getOrderList,
  getShippingInfo,
  ShippingInfo,
} from "./api";

export const useOrderList = () => {
  const orderList = ref<OrderInfo[]>([]);

  const setOrderList = async (status: number, page: number, size = 10) =>
    (orderList.value = await getOrderList(status, page, size));

  return { orderList, setOrderList };
};

export const useOrderInfo = () => {
  const orderInfo = ref<OrderInfo>();
  const setOrderInfo = async (order_id: string) =>
    (orderInfo.value = await getOrderInfo(order_id));
  return { orderInfo, setOrderInfo };
};

export const useShippingInfo = () => {
  const shippingInfo = ref<ShippingInfo>();

  const setShippingInfo = async (order_id: string) =>
    (shippingInfo.value = await getShippingInfo(order_id));

  return { shippingInfo, setShippingInfo };
};
