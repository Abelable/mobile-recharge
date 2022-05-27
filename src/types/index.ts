export interface GoodsInfo {
  main_picture: string;
  name: string;
  product: { is_required_idcard: number; is_required_idphoto: number };
}
export interface reginInfo {
  id: number;
  name: string;
}

export interface OrderInfo {
  id: number;
  name: string;
}
