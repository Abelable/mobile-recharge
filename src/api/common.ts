import { http } from "@/utils/http";

export const toggleSubscribeAnchor = async (status: number, roomId: string) => {
  return await http("?r=lv/live/preview-destine", {
    method: "POST",
    data: { switch: status, roomId },
  });
};
