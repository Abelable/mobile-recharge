import { ref } from "vue";
import { CouponInfo, getCouponList } from "./api";

export const useCouponList = () => {
  const couponList = ref<CouponInfo[]>([]);
  const setCouponList = async (type: number, page: number, size = 10) =>
    (couponList.value = await getCouponList(type, page, size));
  return { couponList, setCouponList };
};
