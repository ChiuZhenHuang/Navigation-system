import Tabs from "@/components/ui/tabs";
import { List, Avatar } from "antd";
import { useEffect, useState } from "react";
import type { totalRecords } from "@/types/recordType";
import {
  formatToThousand,
  formatTime,
  calculateTotalPoints,
  calculateOilMoney,
} from "@/utils/method";
import { cn } from "@/utils/cn";
import { useAppSelector } from "@/stores/reduxHook";

const Rank = () => {
  const userTotalData = useAppSelector(
    (state) => state.user.userTotalData
  ) as totalRecords[];

  const [nameData, setNameData] = useState<totalRecords[]>([]);
  const [sortedData, setSortedData] = useState<totalRecords[]>([]);

  const [currentPage, setCurrentPage] = useState("總里程排行");
  const [navigationPage, setNavigationPage] = useState(1);
  const onChange = (key: string) => {
    switch (key) {
      case "1":
        return setCurrentPage("總里程排行");
      case "2":
        return setCurrentPage("總時間排行");
      case "3":
        return setCurrentPage("總油費排行");
      case "4":
        return setCurrentPage("總次數排行");
      case "5":
        return setCurrentPage("積分排行");
      default:
        return setCurrentPage("總里程排行");
    }
  };

  const tabItems = [
    "總里程排行",
    "總時間排行",
    "總油費排行",
    "總次數排行",
    "積分排行",
  ].map((item: string, index: number) => {
    return {
      key: String(index + 1),
      label: <div className="text-[#A1754D]">{item}</div>,
    };
  });

  useEffect(() => {
    const newData = userTotalData.map((item: totalRecords) => {
      // 計算總數據
      let totalDistance = 0;
      let totalTime = 0;
      let totalOil = 0;
      let totalCount = item.records.length;

      item.records.forEach((rec) => {
        const distance =
          parseFloat(rec.action.distance.replace(/\s公里\s/g, "")) || 0;
        totalDistance += distance;

        // 解析時間格式
        let time = rec.action.time;
        const hourMatch = time.match(/(\d+)\s小時/);
        const minuteMatch = time.match(/(\d+)\s分鐘/);
        const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
        const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;
        totalTime += hours * 60 + minutes; // 轉換成總分鐘數

        // 轉換油費數值
        totalOil += calculateOilMoney(distance, rec.action.oil);
      });

      // 另外計算 "每週積分" 過濾近一星期
      const weekAge = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const weekRecords = item.records.filter(
        (rec) => rec.timestamp >= weekAge
      );
      const weekDistance = weekRecords.reduce(
        (sum, rec) =>
          sum + parseFloat(rec.action.distance.replace(/\s公里\s/g, "")),
        0
      );
      const weekCount = weekRecords.length;
      const weekOil = weekRecords.reduce((sum, rec) => {
        const distance =
          parseFloat(rec.action.distance.replace(/\s公里\s/g, "")) || 0;
        return sum + calculateOilMoney(distance, rec.action.oil);
      }, 0);
      const { totalPoints } = calculateTotalPoints(
        weekDistance,
        weekCount,
        weekOil
      );

      return {
        ...item,
        totalDistance, // 總里程
        totalTime, // 總時間（分鐘）
        totalOil, // 總油費
        totalCount, // 總次數
        totalPoints, // 總積分
      };
    });

    // console.log("去除不必要的字串後", newData);
    setNameData(newData); //  設定新資料
  }, [userTotalData]);

  useEffect(() => {
    if (!nameData.length) return;

    const sortedData = [...nameData].sort((a, b) => {
      switch (currentPage) {
        case "總里程排行":
          return b.totalDistance - a.totalDistance;
        case "總時間排行":
          return b.totalTime - a.totalTime;
        case "總油費排行":
          return b.totalOil - a.totalOil;
        case "總次數排行":
          return b.totalCount - a.totalCount;
        case "積分排行":
          return b.totalPoints - a.totalPoints;
        default:
          return 0;
      }
    });

    setSortedData(sortedData);
  }, [currentPage, nameData]);

  return (
    <div className="m-4">
      <Tabs onChange={onChange} type="card" items={tabItems} />

      <List
        itemLayout="horizontal"
        dataSource={sortedData}
        pagination={{
          position: "bottom",
          align: "center",
          pageSize: 10,
          current: navigationPage,
          onChange: (page) => {
            setNavigationPage(page);
          },
        }}
        renderItem={(item: totalRecords, index) => {
          const displayIndex = (navigationPage - 1) * 10 + index + 1;
          return (
            <List.Item>
              <List.Item.Meta
                // avatar={
                //   <Avatar
                //     src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                //   >
                //     {index + 1}
                //   </Avatar>
                // }
                title={
                  <div className="flex items-center space-x-2 font-bold">
                    <Avatar
                      size={20}
                      className={cn(
                        "flex justify-center items-center text-white",
                        displayIndex === 1
                          ? "bg-yellow-500"
                          : displayIndex === 2
                          ? "bg-gray-400"
                          : displayIndex === 3
                          ? "bg-amber-700"
                          : "bg-gray-200 text-black"
                      )}
                    >
                      {displayIndex}
                    </Avatar>
                    <span>{item.name}</span>
                  </div>
                }
                description={
                  currentPage === "總里程排行"
                    ? `總里程：${formatToThousand(
                        item.totalDistance.toFixed(1)
                      )} km`
                    : currentPage === "總時間排行"
                    ? `總時間：${formatTime(item.totalTime)}`
                    : currentPage === "總油費排行"
                    ? `總油費：${formatToThousand(item.totalOil.toFixed(0))} 元`
                    : currentPage === "總次數排行"
                    ? `總次數：${formatToThousand(item.totalCount)} 次`
                    : currentPage === "積分排行"
                    ? `週積分：${formatToThousand(item.totalPoints)} 分`
                    : ""
                }
              />
            </List.Item>
          );
        }}
      />
    </div>
  );
};

export default Rank;
