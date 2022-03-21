import { http } from "@/utils/http";
import { LiveInfo, VideoInfo } from "@/types";

export interface LocationInfo {
  lng: string;
  lat: string;
}

export const getLocationInfo = async (): Promise<LocationInfo> =>
  new Promise((resolve) => {
    const geolocation = new window.qq.maps.Geolocation(
      "BGCBZ-UFHWX-MBQ4O-TANN2-7WTZ3-CLBIP",
      "youbo"
    );
    geolocation.getLocation(
      (info: ({ [key in string]: unknown } & LocationInfo) | undefined) => {
        if (info) resolve({ lng: info.lng, lat: info.lat });
      }
    );
  });

export interface AnchorInfo {
  id: string;
  user_id: string;
  username: string;
  avatar: string;
  shop_id: string;
  is_live: 0 | 1;
  sort: string;
}

export const getAnchorList = async (): Promise<AnchorInfo[]> => {
  const {
    recommend_anchor_list = [],
  }: { recommend_anchor_list: AnchorInfo[] } =
    (await http("?r=lv/live-front/recommend-anchor", { method: "POST" })) || {};
  return recommend_anchor_list || [];
};

export interface AdInfo {
  ad_id: string;
  ad_name: string;
  ad_code: string;
  ad_link: string;
  is_belong: string;
  extra: string;
}

export interface AdInfoResult {
  carouselList: AdInfo[];
  porcelainList: AdInfo[];
  topPorcelainList: AdInfo[];
}

export const getAdInfo = async (): Promise<AdInfoResult> => {
  const result: AdInfoResult = await http("?r=lv/live-front/carousel", {
    method: "POST",
  });
  return result;
};

export interface MediaInfo extends LiveInfo, VideoInfo {
  media_type: number;
  last_id: number;
  live_offset: number;
  search_type: number;
}

export const getFollowedMediaList = async (
  page: number
): Promise<MediaInfo[]> => {
  const { list = [] }: { list: MediaInfo[] } =
    (await http("?r=lv/live-front/follow-live", {
      method: "POST",
      data: { page },
    })) || {};
  return list || [];
};

export const getRecommendMediaList = async (
  last_id: number,
  live_offset: number,
  search_type: number,
  page: number
): Promise<MediaInfo[]> => {
  const { list = [] }: { list: MediaInfo[] } =
    (await http("?r=lv/live-front/waterfall", {
      method: "POST",
      data: { last_id, live_offset, search_type, page },
    })) || {};
  return list || [];
};

export const getNearbyMediaList = async ({
  live_offset,
  search_type,
  page,
  lng,
  lat,
}: {
  live_offset: number;
  search_type: number;
  page: number;
  lng: string;
  lat: string;
}): Promise<MediaInfo[]> => {
  const { list }: { list: MediaInfo[] } =
    (await http("?r=lv/live-front/nearby", {
      method: "POST",
      data: { live_offset, search_type, page, lng, lat },
    })) || {};
  return list || [];
};
