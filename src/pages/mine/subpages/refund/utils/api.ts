import { ref } from "vue";
import { http } from "@/utils/http";

export interface RefundOrderInfo {
  ret_id: number;
  return_sn: string;
  goods_thumb: string;
  goods_name: string;
  goods_attr: string;
  get_return_goods: { return_number: number };
  should_return: string;
  addressee: string;
  phone: string;
  apply_time: string;
  agree_apply: number;
}

export const useRefundOrderList = () => {
  const refundOrderList = ref<RefundOrderInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  const setRefundOrderList = async (init = false) => {
    isLoading.value = true;
    if (init) {
      page = 0;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    ++page;
    const list: RefundOrderInfo[] = await http("/api/v4/refound", {
      method: "POST",
      data: { page, size: 10 },
    });
    isLoading.value = false;
    isRefreshing.value = false;
    if (list.length)
      refundOrderList.value = init ? list : [...refundOrderList.value, ...list];
    else isFinished.value = true;
  };

  return {
    refundOrderList,
    setRefundOrderList,
    isLoading,
    isFinished,
    isRefreshing,
  };
};
