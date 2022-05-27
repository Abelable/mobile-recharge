import qs from "qs";

const apiUrl = process.env.VUE_APP_API_URL;

interface Config extends RequestInit {
  data?: object;
  formData?: FormData;
}

export const http = async (
  endpoint: string,
  { data, formData, headers, ...customConfig }: Config = {}
) => {
  const config = {
    method: "GET",
    headers: {
      timestamp: initTimestamp(),
      nonce: initNonce(),
      ...headers,
    } as any,
    ...customConfig,
  };

  if (config.method.toUpperCase() === "GET") {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    if (formData) {
      config.body = formData;
    } else {
      config.headers["Content-Type"] = "application/json";
      config.body = qs.stringify(data || {});
    }
  }

  return window.fetch(`${apiUrl}${endpoint}`, config).then(async (response) => {
    const result = await response.json();
    if ([200, 201, 204].includes(result.code)) return result.data;
    else return Promise.reject(result);
  });
};

export const initTimestamp = () =>
  Math.round(new Date().getTime() / 1000).toString();

export const initNonce = () => {
  const chars = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
  ];
  let nonce = "";
  for (let i = 0; i < 16; i++) {
    const id = parseInt(`${Math.random() * 61}`);
    nonce += chars[id];
  }
  return nonce;
};
