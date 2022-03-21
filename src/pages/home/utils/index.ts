import { ref } from "vue";
import {
  AnchorInfo,
  getAnchorList,
  getLocationInfo,
  LocationInfo,
} from "./api";

export const useLocationInfo = () => {
  const locationInfo = ref<LocationInfo | null>(null);
  const setLocationInfo = async () =>
    (locationInfo.value = await getLocationInfo());
  return { locationInfo, setLocationInfo };
};

export const useAnchorList = () => {
  const anchorList = ref<AnchorInfo[]>([]);
  const setAnchorList = async () => (anchorList.value = await getAnchorList());
  return { anchorList, setAnchorList };
};
