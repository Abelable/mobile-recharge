import { ref } from "vue";
import {
  getAdInfo,
  getAnchorList,
  getFollowedMediaList,
  getLocationInfo,
  getNearbyMediaList,
  getRecommendMediaList,
} from "./api";
import type {
  AdInfo,
  AdInfoResult,
  AnchorInfo,
  LocationInfo,
  MediaInfo,
} from "./api";

export const useLocationInfo = () => {
  const locationInfo = ref<LocationInfo>();
  const setLocationInfo = async () =>
    (locationInfo.value = await getLocationInfo());
  return { locationInfo, setLocationInfo };
};

export const useAnchorList = () => {
  const anchorList = ref<AnchorInfo[]>([]);
  const setAnchorList = async () => (anchorList.value = await getAnchorList());
  return { anchorList, setAnchorList };
};

export const useAdInfo = () => {
  const adIllus = ref("");
  const banner = ref<AdInfo[]>([]);
  const tilesLists = ref<AdInfo[]>([]);

  const setAdInfo = async () => {
    const { carouselList, porcelainList, topPorcelainList }: AdInfoResult =
      await getAdInfo();
    adIllus.value = topPorcelainList[0]?.ad_code || "";
    banner.value = carouselList;
    tilesLists.value = porcelainList;
  };

  return { adIllus, banner, tilesLists, setAdInfo };
};

export const useFollowedMediaList = () => {
  const followedMediaList = ref<MediaInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  const setFollowedMediaList = async (init = false) => {
    isLoading.value = true;
    if (init) {
      page = 0;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    ++page;
    const list: MediaInfo[] = await getFollowedMediaList(page);
    isLoading.value = false;
    isRefreshing.value = false;
    if (list.length) {
      followedMediaList.value = init
        ? list
        : [...followedMediaList.value, ...list];
    } else isFinished.value = true;
  };

  return {
    followedMediaList,
    setFollowedMediaList,
    isLoading,
    isFinished,
    isRefreshing,
  };
};

export const useRecommendMediaList = () => {
  const recommendMediaList = ref<MediaInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  let last_id = 0;
  let live_offset = 0;
  let search_type = 1;
  const setRecommendMediaList = async (init = false) => {
    isLoading.value = true;
    if (init) {
      page = 0;
      last_id = 0;
      live_offset = 0;
      search_type = 1;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    ++page;
    const list: MediaInfo[] = await getRecommendMediaList({
      last_id,
      live_offset,
      search_type,
      page,
    });
    isLoading.value = false;
    isRefreshing.value = false;
    if (list.length) {
      recommendMediaList.value = init
        ? list
        : [...recommendMediaList.value, ...list];
      const lastItem = list[list.length - 1];
      last_id = lastItem.last_id;
      live_offset = lastItem.live_offset;
      search_type = lastItem.search_type;
    } else isFinished.value = true;
  };

  return {
    recommendMediaList,
    setRecommendMediaList,
    isLoading,
    isFinished,
    isRefreshing,
  };
};

export const useNearbyMediaList = () => {
  const nearbyMediaList = ref<MediaInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  let live_offset = 0;
  let search_type = 1;
  const setNearbyMediaList = async (
    locationInfo: LocationInfo,
    init = false
  ) => {
    isLoading.value = true;
    if (init) {
      page = 0;
      live_offset = 0;
      search_type = 1;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    ++page;
    const list: MediaInfo[] = await getNearbyMediaList({
      live_offset,
      search_type,
      page,
      ...locationInfo,
    });
    isLoading.value = false;
    isRefreshing.value = false;
    if (list.length) {
      nearbyMediaList.value = init ? list : [...nearbyMediaList.value, ...list];
      const lastItem = list[list.length - 1];
      live_offset = lastItem.live_offset;
      search_type = lastItem.search_type;
    } else isFinished.value = true;
  };

  return {
    nearbyMediaList,
    setNearbyMediaList,
    isLoading,
    isFinished,
    isRefreshing,
  };
};
