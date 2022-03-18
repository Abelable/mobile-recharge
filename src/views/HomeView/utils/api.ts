import { ref } from "vue";
import { http } from "@/utils/http";

export interface LocationInfo {
  lng?: string;
  lat?: string;
}

export const useLocationInfo = () => {
  const locationInfo = ref<LocationInfo | null>(null);
  const setLocationInfo = () => {
    const geolocation = new window.qq.maps.Geolocation(
      "BGCBZ-UFHWX-MBQ4O-TANN2-7WTZ3-CLBIP",
      "youbo"
    );
    geolocation.getLocation(
      (info: LocationInfo) => (locationInfo.value = info || null)
    );
  };
  return { locationInfo, setLocationInfo };
};

export interface AnchorInfo {
  id: string;
  user_id: string;
  username: string;
  avatar: string;
  shop_id: string;
  is_live: 0 | 1;
  sort: string;
}

export const useAnchorList = () => {
  const anchorList = ref<AnchorInfo[]>([]);
  const setAnchorList = async () => {
    const { recommend_anchor_list }: { recommend_anchor_list: AnchorInfo[] } =
      await http("?r=lv/live-front/recommend-anchor", { method: "POST" });
    anchorList.value = recommend_anchor_list;
  };
  return { anchorList, setAnchorList };
};

export interface LiveInfo {
  id: string;
  title: string;
  cover: string;
  url: string;
  group_id: string;
  direction: string;
  is_stopped: string;
  start_time: string;
  position: string;
  memberNum: string;
  praise: string;
  owner_id: string;
  userName: string;
  userPortrait: string;
  previewDestine: string;
  distance: string;
}
export interface VideoInfo {
  id: string;
  title: string;
  cover_url: string;
  play_url: string;
  like_num: number;
  view_num: number;
  user_id: string;
  nickname: string;
  head_img: string;
  province: string;
  city: string;
  distance: string;
}

export interface MediaInfo extends LiveInfo, VideoInfo {
  media_type: number;
  last_id: number;
  live_offset: number;
  search_type: number;
}

export const useFollowedMediaList = () => {
  const followedMediaList = ref<MediaInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  const setFollowedMediaList = async (init = false) => {
    if (init) {
      page = 0;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    isLoading.value = true;
    const { list = [] }: { list: MediaInfo[] } = await http(
      "?r=lv/live-front/follow-live",
      {
        data: { page: ++page },
        method: "POST",
      }
    );
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
    const { list }: { list: MediaInfo[] } = await http(
      "?r=lv/live-front/waterfall",
      {
        data: { last_id, live_offset, search_type, page },
        method: "POST",
      }
    );
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
    const { list }: { list: MediaInfo[] } = await http(
      "?r=lv/live-front/nearby",
      {
        data: { live_offset, search_type, page, ...locationInfo },
        method: "POST",
      }
    );
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

export interface AdInfo {
  ad_id: string;
  ad_name: string;
  ad_code: string;
  ad_link: string;
  is_belong: string;
  extra: string;
}

export const useAdInfo = () => {
  const adIllus = ref("");
  const banner = ref<AdInfo[]>([]);
  const tilesLists = ref<AdInfo[]>([]);

  const setAdInfo = async () => {
    const {
      carouselList,
      porcelainList,
      topPorcelainList,
    }: { [key in string]: AdInfo[] } = await http("?r=lv/live-front/carousel", {
      method: "POST",
    });
    adIllus.value = topPorcelainList[0]?.ad_code || "";
    banner.value = carouselList;
    tilesLists.value = porcelainList;
  };

  return { adIllus, banner, tilesLists, setAdInfo };
};
