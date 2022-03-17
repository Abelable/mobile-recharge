import qs from "qs";

const mmsUrl = process.env.VUE_APP_MMS_URL;
const liveUrl = process.env.VUE_APP_LIVE_URL;

export enum BaseUrlType {
  mms,
  live,
}

interface Config extends RequestInit {
  baseUrlType: BaseUrlType;
  data?: object;
}

export const http = async (
  endpoint: string,
  { data, headers, baseUrlType, ...customConfig }: Config
) => {
  const config = {
    method: "GET",
    headers: {
      token: localStorage.getItem("token") || "",
      "Content-Type": data ? "application/json" : "",
      ...headers,
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  return window
    .fetch(
      `${baseUrlType === BaseUrlType.mms ? mmsUrl : liveUrl}/${endpoint}`,
      config
    )
    .then(async (response) => {
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};
