import { http } from "@/utils/http";

export interface IdentityInfo {
  card_id: string;
  name: string;
  id_number: string;
  is_set: string;
}

export const getIdentityList = async (): Promise<IdentityInfo[]> =>
  await http("/api/v4/user/card", { data: { page: 1 } });

export const deleteIdentityItem = async (id: string) =>
  await http(`/api/v4/user/card/destroy/${id}`, { method: "POST" });
