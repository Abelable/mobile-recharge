declare global {
  interface Window {
    qq: any;
    WeixinJSBridge: any;
    ysf: any;
  }
  interface Document {
    attachEvent: any;
  }
}

export interface LiveInfo {
  id: string;
  title: string;
  cover: string;
  url: string;
  group_id: string;
  direction: string;
  is_stopped: string;
  start_time: string;
  position: string;
  memberNum: string;
  praise: string;
  owner_id: string;
  userName: string;
  userPortrait: string;
  previewDestine: string;
  distance: string;
}
export interface VideoInfo {
  id: string;
  title: string;
  cover_url: string;
  play_url: string;
  like_num: number;
  view_num: number;
  user_id: string;
  nickname: string;
  head_img: string;
  province: string;
  city: string;
  distance: string;
}

export interface GoodsInfo {
  id: number;
  goods_id: string;
  goods_name: string;
  goods_thumb: string;
  original_img: string;
  market_price: string;
  shop_price: string;
  sales_count: string;
  sales_volume: number;
  ghost_count: string;
  is_seckill: boolean;
  split_money: string;
  active_info: string;
}
export interface OrderGoodsInfo extends GoodsInfo {
  goods_number: number;
  goods_sn: string;
  goods_price: string;
  goods_cause: number;
  goods_attr: string;
  rec_id: number;
  ret_id: number;
}

export interface OrderInfo {
  order_id: number;
  order_sn: string;
  invoice_no: string;
  order_status_to: number;
  order_goods: OrderGoodsInfo[];
  goods: OrderGoodsInfo[];
  order_goods_num: number;
  bonus: string;
  shipping_id: number;
  shipping_status: string;
  goods_amount_formated: string;
  shipping_fee_formated: string;
  surplus_formated: string;
  money_paid_formated: string;
  order_amount_formated: string;
  total_amount_formated: string;
  shop_id: number;
  shop_logo: string;
  shop_name: string;
  consignee: string;
  mobile: string;
  address: string;
  add_time: string;
  pay_time: string;
  postscript: string;
}
