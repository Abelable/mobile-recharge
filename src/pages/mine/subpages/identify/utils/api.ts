import { http } from "@/utils/http";

export interface IdentityInfo {
  card_id: string;
  name: string;
  id_number: string;
  card_zm: string;
  card_fm: string;
  is_set: 1 | 2;
}

export const getIdentityList = async (): Promise<
  Pick<IdentityInfo, "card_id" | "name" | "id_number">[]
> => await http("/api/v4/user/card", { data: { page: 1 } });

export const getIdentityInfo = async (
  id: string
): Promise<Omit<IdentityInfo, "card_id">> =>
  await http(`/api/v4/user/card/show/${id}`);

export type AddIdentityParams = Omit<IdentityInfo, "card_id">;
export const addIdentity = async (params: Partial<IdentityInfo>) =>
  await http("/api/v4/user/card/store", { method: "POST", data: params });

interface EditIdentityParams extends AddIdentityParams {
  id: string;
}
export const editIdentity = async ({ id, ...params }: EditIdentityParams) =>
  await http(`/api/v4/user/card/update/${id}`, {
    method: "POST",
    data: params,
  });

export const deleteIdentityItem = async (id: string) =>
  await http(`/api/v4/user/card/destroy/${id}`, { method: "POST" });
