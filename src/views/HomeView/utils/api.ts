import { ref } from "vue";

export interface LocationInfo {
  lng?: string;
  lat?: string;
}

export const useLocationInfo = () => {
  const locationInfo = ref<LocationInfo>({});
  const setLocationInfo = () => {
    const geolocation = new window.qq.maps.Geolocation(
      "BGCBZ-UFHWX-MBQ4O-TANN2-7WTZ3-CLBIP",
      "youbo"
    );
    geolocation.getLocation(
      (info: LocationInfo) => (locationInfo.value = info)
    );
  };
  return { locationInfo, setLocationInfo };
};
