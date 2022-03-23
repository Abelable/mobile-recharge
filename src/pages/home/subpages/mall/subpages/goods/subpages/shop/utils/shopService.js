import BaseService from '@/service/baseService'

class ShopService extends BaseService {
  async getSupplierInfo(supplier_id) {
    return await this.post({ url: `${this.liveUrl}tbb/supplier/index`, data: { supplier_id } })
  }
}

export default ShopService
