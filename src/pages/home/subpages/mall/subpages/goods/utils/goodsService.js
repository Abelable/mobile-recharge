import BaseService from '@/service/baseService'

class GoodsService extends BaseService {
  async getGoodsPoster(goodsId) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/share/all?goods_id=${goodsId}` })
  }

  async getMaterials(goods_id) {
    return await this.post({ url: `${this.liveUrl}?r=tbb/goods-detail/materials`, data: { goods_id }})
  }

  async checkLiveStatus(goods_id) {
    return await this.post({ url: `${this.liveUrl}lv/live-home/goods-detail-live`, data: { goods_id } })
  }

  async subscribeSpikeNotice(sec_goods_id) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/seckill/notice`, data: { sec_goods_id } })
  }

  async addSpikeToCart(sec_goods_id) {
    return await this.post({ url: `${this.mmsUrl}/api/v4/seckill/buy`, data: { sec_goods_id, number: 1 } })
  }
}

export default GoodsService
