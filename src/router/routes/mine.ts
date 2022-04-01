import { RouteRecordRaw } from "vue-router";
import MinePage from "@/pages/mine/index.vue";

const mine: Array<RouteRecordRaw> = [
  {
    path: "/mine",
    name: "mine",
    meta: { keepAlive: true },
    component: MinePage,
  },
  {
    path: "/mine/order_list",
    name: "order_list",
    meta: { requireAuth: true },
    component: () => import("@/pages/mine/subpages/order-list/index.vue"),
  },
  {
    path: "/mine/order_list/order_detail",
    name: "order_detail",
    component: () =>
      import("@/pages/mine/subpages/order-list/subpages/order-detail.vue"),
  },
  {
    path: "/mine/order_list/shipping",
    name: "order_shipping",
    component: () =>
      import("@/pages/mine/subpages/order-list/subpages/shipping.vue"),
  },
  {
    path: "/mine/refund",
    name: "order_refund",
    component: () => import("@/pages/mine/subpages/refund/index.vue"),
  },
  {
    path: "/mine/coin",
    name: "coin",
    meta: { requireAuth: true },
    component: () => import("@/pages/mine/subpages/coin/index.vue"),
  },
  {
    name: "coupon",
    path: "/mine/coupon",
    meta: { requireAuth: true },
    component: () => import("@/pages/mine/subpages/coupon/index.vue"),
  },
  {
    name: "gift",
    path: "/mine/gift",
    meta: { requireAuth: true },
    component: () => import("@/pages/mine/subpages/gift-record/index.vue"),
  },
  {
    name: "identify",
    path: "/mine/identify",
    meta: { requireAuth: true },
    component: () => import("@/pages/mine/subpages/identify/index.vue"),
  },
  {
    name: "indentity_editor",
    path: "/mine/identify/identity_editor",
    component: () =>
      import("@/pages/mine/subpages/identify/subpages/identity-editor.vue"),
  },
  {
    path: "/mine/address",
    name: "address",
    meta: { keepAlive: true, requireAuth: true },
    component: () => import("@/pages/mine/subpages/address/index.vue"),
  },
  {
    path: "/mine/address/editor",
    name: "address_editor",
    component: () =>
      import("@/pages/mine/subpages/address/subpages/address-editor/index.vue"),
  },
  {
    name: "track",
    path: "/mine/track",
    meta: { requireAuth: true },
    component: () => import("@/pages/mine/subpages/track/index.vue"),
  },
];

export default mine;
