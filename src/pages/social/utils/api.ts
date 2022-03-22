import { http } from "@/utils/http";

export interface TagInfo {
  id: string;
  tag_name: string;
}

export const getTagList = async () => {
  const { tag_list = [] }: { tag_list: TagInfo[] } =
    (await http("?r=lv/short-video/tag-list", {
      method: "POST",
      data: { type: 2 },
    })) || {};
  return [{ id: "-1", tag_name: "全部" }, ...(tag_list || [])];
};

export interface SocialInfo {
  id: string;
  title: string;
  img: string[];
  tag_id: string;
  tag_names: string[];
  user_id: string;
  nickname: string;
  head_img: string;
  province: string;
  city: string;
  created_at: string;
  forward_num: string;
  comment_num: string;
  like_num: number;
  view_num: number;
  is_follow: 0 | 1;
  is_like: 0 | 1;
}

export const getFollowedList = async (page: number): Promise<SocialInfo[]> => {
  const { list = [] }: { list: SocialInfo[] } =
    (await http("?r=lv/short-video/short-follow", {
      data: { page },
      method: "POST",
    })) || {};
  return list || [];
};

export const getRecommendList = async (
  tag_id: string,
  rand: number,
  page: number
): Promise<{ list: SocialInfo[]; rand: number }> => {
  const res: { list: SocialInfo[]; rand: number } = await http(
    "?r=lv/short-video/short-recommend",
    {
      data: { tag_id, rand, page },
      method: "POST",
    }
  );
  return res;
};
