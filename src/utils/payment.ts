import { useRouter } from "vue-router";
import { PayType, getPaymentParams } from "@/api/common";
import { isInWechatEnv } from "./envJudgment";
import { ref } from "vue";

export const usePayment = () => {
  const router = useRouter();
  const wxPayment = ref({});

  const pay = async (orderSn: string, payType: PayType, openid = "") => {
    const res = await getPaymentParams(orderSn, payType, openid);
    if (payType === PayType.alipay)
      window.location.href = res.match(/window.open\('(\S*)'\)/)[1];
    else {
      if (isInWechatEnv) {
        wxPayment.value = JSON.parse(res.payment);
        wxpay();
      } else window.location.href = res.mweb_url;
    }
  };

  const wxpay = () => {
    if (typeof window.WeixinJSBridge == "undefined") {
      if (document.addEventListener)
        document.addEventListener(
          "WeixinJSBridgeReady",
          onWxBridgeReady,
          false
        );
      else if (document?.attachEvent) {
        document.attachEvent("WeixinJSBridgeReady", onWxBridgeReady);
        document.attachEvent("onWeixinJSBridgeReady", onWxBridgeReady);
      }
    } else onWxBridgeReady();
  };

  const onWxBridgeReady = () => {
    window.WeixinJSBridge.invoke(
      "getBrandWCPayRequest",
      wxPayment.value,
      (res: { err_msg: string }) => {
        if (res.err_msg == "get_brand_wcpay_request:ok")
          router.push("/mine/order");
      }
    );
  };

  return { pay };
};
