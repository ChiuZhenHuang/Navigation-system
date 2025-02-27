import { TaskOptions } from "@/types/recordType";

// 千分位
export const formatToThousand = (num: number | string) => {
  if (typeof num === "string") num = Number(num);
  return num.toLocaleString("en-US");
};

// 取cookie
export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  // 可能會有很多個cookie，先做切割
  // 再把各個cookie在切割成key,value 比對key
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");
    if (key === name) {
      return value;
    }
  }
  return null;
}

// 轉換時間
export const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return hours > 0
    ? `${hours} 小時 ${remainingMinutes} 分鐘`
    : `${remainingMinutes} 分鐘`;
};

// 設置積分點數
export const taskOptions: TaskOptions[] = [
  { title: "週累積里程", target: "1000", point: "1000" },
  { title: "週導航次數", target: "5", point: "500" },
  { title: "週油費總計", target: "2000", point: "700" },
];

// 計算各項數據
export const calculateTotalPoints = (
  totalDistance: number,
  totalCount: number,
  totalOil: number
) => {
  // 計算總進度百分比
  const percentDistance = (totalDistance / Number(taskOptions[0].target)) * 100;
  const percentCount = (totalCount / Number(taskOptions[1].target)) * 100;
  const percentOil = (totalOil / Number(taskOptions[2].target)) * 100;

  // 計算有幾個超過 100%
  const overachievedCount = [percentDistance, percentCount, percentOil].filter(
    (percent) => percent >= 100
  ).length;

  // 計算總任務積分
  const totalPoints =
    (percentDistance >= 100 ? Number(taskOptions[0].point) : 0) +
    (percentCount >= 100 ? Number(taskOptions[1].point) : 0) +
    (percentOil >= 100 ? Number(taskOptions[2].point) : 0);

  return {
    totalPoints,
    overachievedCount,
    percentDistance,
    percentCount,
    percentOil,
  };
};

// 油費計算(假設1L30元)
export const calculateOilMoney = (
  distance: string | number,
  oil: string | number
): number => (Number(distance) / Number(oil)) * 30;
