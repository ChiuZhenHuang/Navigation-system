// 千分位
export const formatToThousand = (num: number | string) => {
  if (typeof num === "string") num = Number(num);
  return num.toLocaleString("en-US");
};
