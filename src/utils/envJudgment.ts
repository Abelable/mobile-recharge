export const isIphoneX =
  /iphone/gi.test(navigator.userAgent) && screen.height >= 812;

const ua = navigator.userAgent.toLowerCase() as any;
export const isInWechatEnv = ua.match(/MicroMessenger/i) === "micromessenger";
