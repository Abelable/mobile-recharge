import { http } from "@/utils/http";

export const toggleSubscribeAnchor = async (status: number, roomId: string) =>
  await http("?r=lv/live/preview-destine", {
    method: "POST",
    data: { switch: status, roomId },
  });

export const togglePraiseStatus = async (video_id: string) =>
  await http("?r=lv/short-video/video-like", {
    method: "POST",
    data: { video_id },
  });
