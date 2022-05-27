import { http } from "@/utils/http";
import type { reginInfo } from "@/types";

export const getRegion = async (id = 0): Promise<reginInfo[]> => {
  const res = await http(`/api/v1/h5/province-city-area/pluck/${id}`);
  return Object.keys(res).map((key) => ({
    id: Number(key),
    name: res[key],
  }));
};

export const uploadImg = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await http("/api/v1/h5/upload/image", {
    method: "POST",
    formData,
  });
  console.log(res);
};
