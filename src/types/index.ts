export interface GoodsInfo {
  detail: string;
  name: string;
  product: { is_required_idcard: number; is_required_idphoto: number };
}
export interface reginInfo {
  id: number;
  name: string;
}

export interface OrderInfo {
  id: number;
  order_no: string;
  buyer: string;
  goods_name: string;
  status: number;
  status_desc: string;
  remark: string;
  express_no: string;
  express_name: string;
}
