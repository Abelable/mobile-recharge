import { ref } from "vue";
import {
  getFollowedList,
  getRecommendList,
  getTagList,
  SocialInfo,
  TagInfo,
} from "./api";

export const useTagList = () => {
  const tagList = ref<TagInfo[]>([]);
  const setTagList = async () => (tagList.value = await getTagList());
  return { tagList, setTagList };
};

export const useFollowedList = () => {
  const followedList = ref<SocialInfo[]>([]);
  const isLoading = ref(false);
  const isFinished = ref(false);
  const isRefreshing = ref(false);

  let page = 0;
  const setFollowedList = async (init = false) => {
    isLoading.value = true;
    if (init) {
      page = 0;
      isFinished.value = false;
      isRefreshing.value = true;
    }
    ++page;
    const list: SocialInfo[] = await getFollowedList(page);
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
    const res = await getRecommendList(tag_id, rand, page);
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
