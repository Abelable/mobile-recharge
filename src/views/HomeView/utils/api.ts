import { http } from "@/utils/http";
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
  nickname: string;
  head_img: string;
  previewDestine: string;
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
  distance: number;
}
export interface GoodsInfo {
  goods_id: string;
  goods_name: string;
  goods_thumb: string;
  market_price: string;
  shop_price: string;
  sales_count: string;
  sales_volume: number;
  ghost_count: string;
}
export interface MediaInfo extends LiveInfo, VideoInfo, GoodsInfo {
  media_type: number;
  last_id: number;
  live_offset: number;
  search_type: number;
}

export const useFollowedMediaList = () => {
  const followedMediaList = ref<MediaInfo[]>([]);
  const isFinished = ref(false);
  const isLoading = ref(false);

  let page = 0;
  const setFollowedMediaList = async (init = false) => {
    if (init) {
      page = 0;
      isFinished.value = false;
    }
    isLoading.value = true;
    const { list }: { list: MediaInfo[] } = await http(
      "?r=lv/live-front/follow-live",
      {
        data: { page: ++page },
        method: "POST",
      }
    );
    isLoading.value = false;
    if (list.length) {
      followedMediaList.value = init
        ? list
        : [...followedMediaList.value, ...list];
    } else isFinished.value = true;
  };

  return { followedMediaList, setFollowedMediaList, isLoading, isFinished };
};

export const useRecommendMediaList = () => {
  const recommendMediaList = ref<MediaInfo[]>([]);
  const isFinished = ref(false);
  const isLoading = ref(false);

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

  return { recommendMediaList, setRecommendMediaList, isLoading, isFinished };
};

export const useNearbyMediaList = () => {
  const nearbyMediaList = ref<MediaInfo[]>([]);
  const isFinished = ref(false);
  const isLoading = ref(false);

  let page = 0;
  let live_offset = 0;
  let search_type = 1;
  const setNearbyMediaList = async (
    init = false,
    locationInfo: LocationInfo
  ) => {
    isLoading.value = true;
    if (init) {
      page = 0;
      live_offset = 0;
      search_type = 1;
      isFinished.value = false;
    }
    ++page;
    const { list }: { list: MediaInfo[] } = await http(
      "?r=lv/live-front/waterfall",
      {
        data: { live_offset, search_type, page, ...locationInfo },
        method: "POST",
      }
    );
    isLoading.value = false;
    if (list.length) {
      nearbyMediaList.value = init ? list : [...nearbyMediaList.value, ...list];
      const lastItem = list[list.length - 1];
      live_offset = lastItem.live_offset;
      search_type = lastItem.search_type;
    } else isFinished.value = true;
  };

  return { nearbyMediaList, setNearbyMediaList, isLoading, isFinished };
};

export const useRecommendGoodsList = () => {
  const recommendGoodsList = ref<MediaInfo[]>([]);
  const setRecommendGoodsList = async () => {
    const { recommend_goods_list }: { recommend_goods_list: MediaInfo[] } =
      await http("?r=lv/live-front/recommend-goods", {
        method: "POST",
        data: { module: 1 },
      });
    recommendGoodsList.value = recommend_goods_list;
  };
  return { recommendGoodsList, setRecommendGoodsList };
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
