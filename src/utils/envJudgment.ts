export const isIphoneX =
  /iphone/gi.test(navigator.userAgent) && screen.height >= 812;

export const isInWechatEnv = /MicroMessenger/i.test(navigator.userAgent);
