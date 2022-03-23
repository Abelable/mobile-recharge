import BaseService from '@/service/baseService'

class CartService extends BaseService {
  async getCartList() {
    return await this.post({ url: `${this.mmsUrl}/api/v4/cart/goodslistnew`, loadingTitle: '加载中...' })
  }

  async getCartAmount(rec_id) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/cart/checked`, data: { rec_id, type: 1 }})
  }

  async deleteCartList(rec_id) {
    await this.post({ url: `${this.mmsUrl}/api/v4/cart/deletecart`, data: { rec_id, type: 1 } })
  }

  async getGoodsSpec(goods_id) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/cart/goods_spec`, data: { goods_id } })
  }

  async cartCheck(rec_id) {
    await this.post({ url: `${this.mmsUrl}/api/v4/cart/checked`, data: { rec_id, type: 1 }, loadingTitle: '订单生成中...' })
  }
}

export default CartService