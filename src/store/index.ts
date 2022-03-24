import { getCartCount } from "@/api/common";
import { createStore } from "vuex";

export default createStore({
  state: {
    cartCount: 0,
  },
  getters: {},
  mutations: {
    setCartCount(state, count) {
      state.cartCount = count;
    },
  },
  actions: {
    async updateCartCount(context) {
      const { cart_number } = await getCartCount();
      context.commit("setCartCount", Number(cart_number));
    },
  },
  modules: {},
});
