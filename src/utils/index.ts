import { useRouter } from "vue-router";

/**
 * @param {number} type 0-首页，1-商品详情，3-h5网页，10-直播间，11-有选
 * @param {string} param
 */
export const adLink = (type: string, param: string) => {
  const router = useRouter();
  switch (Number(type)) {
    case 0:
      router.push("/");
      break;
    case 1:
      router.push({
        path: "goods",
        query: {
          id: param,
        },
      });
      break;
    case 3:
      router.push({
        path: "/webview",
        query: {
          url: param.replace("http:", "https:"),
        },
      });
      break;
    case 10:
      router.push({
        path: "/live",
        query: {
          id: param,
        },
      });
      break;
    case 11:
      router.push("/mall");
      break;
  }
};
