import { http } from "@/utils/http";
import { ref } from "vue";

export interface CouponInfo {
  bonus_id: number;
  type_name: string;
  category: number;
  bonus_type_name: string;
  type_money: string;
  min_goods_amount: string;
  use_end_date: string;
  use_start_date_time: number;
  is_belong: string;
  ad_link: string;
}

export const useCouponList = () => {
  const couponList = ref<CouponInfo[]>([]);
  const setCouponList = async (type: number, page: number, size = 10) =>
    (couponList.value = await getCouponList(type, page, size));
  return { couponList, setCouponList };
};

export const getCouponList = async (
  type: number,
  page: number,
  size: number
): Promise<CouponInfo[]> => {
  const { bonus = [] }: { bonus: CouponInfo[] } =
    (await http("/api/v4/coupon/bonus", {
      data: { type, page, size },
    })) || {};
  return bonus || [];
};

export const exchangeCoupon = async (coupon: string) =>
  await http("/api/v4/coupon/exchange-coupon", {
    method: "POST",
    data: { coupon },
  });
