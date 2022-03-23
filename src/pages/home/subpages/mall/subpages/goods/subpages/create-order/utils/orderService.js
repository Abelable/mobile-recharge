import BaseService from '@/service/baseService'

class OrderService extends BaseService {
  async getOrderInfo(rec_type = 0, address_id = '', fail) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/trade/orderinfo`, data: { rec_type, type_id: 0, address_id }, fail, loadingTitle: '加载中...' })
  }

  async cartCheck(rec_id, type = 1) {
    await this.post({ url: `${this.mmsUrl}/api/v4/cart/checked`, data: { rec_id, type } })
  }

  async generateOrder(flow_type, cart_value, pay_id, is_balance, remarkArr) {
    let postscriptObj = {}
    for (let i in remarkArr) postscriptObj[`postscript[${i}]`] = remarkArr[i]
    return await this.post({ url: `${this.mmsUrl}/api/v4/trade/done`, data: { flow_type, cart_value, pay_id, is_balance, referer: 'Applets', ...postscriptObj } })
  }

  async getRedirectUrl() {
    return await this.get({ url: `${this.mmsUrl}/api/v4/wechat/getRedirectUrl?current_url=${encodeURIComponent(window.location.href)}` })
  }

  async getOpenid(code) {
    return await this.get({ url: `${this.mmsUrl}/api/v4/wechat/getWechatUserOpenid?code=${code}` })
  }

  async useBalance(is_balance, rec_type, total) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/trade/changesurplus`, data: { is_balance, rec_type, total }})
  }

  async useBonus(total, bonus_id) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/trade/changebon`, data: { total, bonus_id } })
  }

  async recordCount(room_id, order_id, goods_ids) {
    return await this.post({ url: `${this.liveUrl}lv/goods/live-product-order-save`, data: { room_id, order_id, goods_ids } })
  }
}

export default OrderService
