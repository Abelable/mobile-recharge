import { ref } from "vue";
import { http } from "@/utils/http";

export interface AddressInfo {
  id: number;
  name: string;
  mobile: string;
  province: number;
  province_name: string;
  city: number;
  city_name: string;
  district: number;
  district_name: string;
  address: string;
  is_checked: 0 | 1;
}

export const useAddressList = () => {
  const addressList = ref<AddressInfo[]>([]);

  const setAddressList = async () => {
    const list = await http("/api/v4/address");
    addressList.value = list;
  };

  return { addressList, setAddressList };
};

export const deleteAddress = async (address_id: number | string) =>
  await http("/api/v4/address/destroy", {
    method: "POST",
    data: { address_id },
  });

export interface AddressDetailInfo extends AddressInfo {
  consignee: string;
  default_address_id: string;
}
export const getAddressInfo = async (
  address_id: string
): Promise<AddressDetailInfo> =>
  await http("/api/v4/address/show", {
    method: "POST",
    data: { address_id },
  });

export interface AddAddressInfo {
  consignee: string;
  mobile: string;
  province: number;
  city: number;
  district: number;
  address: string;
  default: boolean;
}
export const addAddress = async (addressInfo: AddAddressInfo) =>
  await http("/api/v4/address/store", {
    method: "POST",
    data: { ...addressInfo, country: 1 },
  });

export interface EditAddressInfo extends AddAddressInfo {
  address_id: string;
}
export const editAddress = async (addressInfo: EditAddressInfo) =>
  await http("/api/v4/address/update", {
    method: "POST",
    data: { ...addressInfo, country: 1 },
  });

export interface reginInfo {
  id: number;
  level: number;
  name: string;
}
export const getRegion = async (
  region = 1,
  level = 1,
  platform = 1
): Promise<reginInfo[]> =>
  await http("/api/v4/misc/region", { data: { region, level, platform } });

export const recognizeTextInfo = async (address: string) =>
  await http("/api/v4/address/resolve", { method: "POST", data: { address } });

export const recognizePicInfo = async (img: string) =>
  await http("/api/v4/address/ocr", { data: { img } });
