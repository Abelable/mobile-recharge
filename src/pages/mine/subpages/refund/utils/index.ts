import { ref } from "vue";
import { getRefundOrderList, RefundOrderInfo } from "./api";

export const useRefundOrderList = () => {
  const refundOrderList = ref<RefundOrderInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  const setRefundOrderList = async (init = false, size = 10) => {
    isLoading.value = true;
    if (init) {
      page = 0;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    ++page;
    const list: RefundOrderInfo[] = await getRefundOrderList(page, size);
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
