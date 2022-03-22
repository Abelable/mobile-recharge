import { ref } from "vue";
import { AddressInfo, getAddressList } from "./api";

export const useAddressList = () => {
  const addressList = ref<AddressInfo[]>([]);

  const setAddressList = async () => {
    const list = await getAddressList();
    addressList.value = list;
  };

  return { addressList, setAddressList };
};
