import { http } from "@/utils/http";

export const getSms = async (mobile: string) =>
  await http("/api/v4/misc/sms/send", {
    method: "POST",
    data: { mobile, client: "h5" },
  });

export const getToken = async (mobile: string, code: string) =>
  await http("/api/v4/user/fast-login", {
    method: "POST",
    data: { mobile, code, client: "h5" },
  });
