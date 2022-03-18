import { http } from "@/utils/http";
import { ref } from "vue";

export interface TagInfo {
  id: string;
  tag_name: string;
}

export const useTagList = () => {
  const tagList = ref<TagInfo[]>([]);
  const setTagList = async () => {
    const { tag_list = [] }: { tag_list: TagInfo[] } = await http(
      "?r=lv/short-video/tag-list",
      { method: "POST", data: { type: 2 } }
    );
    tagList.value = [{ id: "-1", tag_name: "全部" }, ...tag_list];
  };
  return { tagList, setTagList };
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

export const useFollowedList = () => {
  const followedList = ref<SocialInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  const setFollowedList = async (init = false) => {
    if (init) {
      page = 0;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    isLoading.value = true;
    const { list = [] }: { list: SocialInfo[] } = await http(
      "?r=lv/short-video/short-follow",
      {
        data: { page: ++page },
        method: "POST",
      }
    );
    isLoading.value = false;
    isRefreshing.value = false;
    if (list.length) {
      followedList.value = init ? list : [...followedList.value, ...list];
    } else isFinished.value = true;
  };

  return {
    followedList,
    setFollowedList,
    isLoading,
    isFinished,
    isRefreshing,
  };
};

export const useRecommendList = () => {
  const recommendList = ref<SocialInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let rand = -1;
  let page = 0;
  const setRecommendList = async (tag_id: string, init = false) => {
    isLoading.value = true;
    if (init) {
      rand = -1;
      page = 0;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    ++page;
    const res: { list: SocialInfo[]; rand: number } = await http(
      "?r=lv/short-video/short-recommend",
      {
        data: { tag_id, rand, page },
        method: "POST",
      }
    );
    isLoading.value = false;
    isRefreshing.value = false;
    if (res.list.length) {
      recommendList.value = init
        ? res.list
        : [...recommendList.value, ...res.list];
      rand = res.rand;
    } else isFinished.value = true;
  };

  return {
    recommendList,
    setRecommendList,
    isLoading,
    isFinished,
    isRefreshing,
  };
};
