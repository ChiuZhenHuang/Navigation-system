import { Row, Col } from "antd";
import Progress from "@/components/ui/progress";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import CrownIcon from "@/assets/images/crown.png";
import CupIcon from "@/assets/images/cup.png";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect, useState } from "react";
import type { ActionResponse } from "@/types/recordType";

interface TaskOptions {
  title: string;
  target: string;
  point: string;
}

interface TotalRecord {
  totalDistance: string;
  totalOil: string;
  frequency: number;
}

const Task = () => {
  const taskOptions = [
    { title: "週累積里程", target: "1000", point: "1000" },
    { title: "週導航次數", target: "5", point: "500" },
    { title: "週油耗總計", target: "2000", point: "700" },
  ];

  const userRecords = useSelector(
    (state: RootState) => state.record.totalRecord
  );

  const [finalPercent, setFinalPercent] = useState(0); // 總進度百分比
  const [overachievedCount, setOverachievedCount] = useState(0); // 幾個達到目標
  const [totalPoints, setTotalPoints] = useState(0); // 總積分
  const [totalRecord, setTotalRecord] = useState<TotalRecord | null>(null); // 所有里程/油耗/次數

  useEffect(() => {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000; // 一週前的時間戳記
    const filerWeek = userRecords.filter(
      (item: ActionResponse) => item.timestamp >= oneWeekAgo
    );

    const transformedRecords = filerWeek.map((item: ActionResponse) => {
      const totalDistance = Number(item.action.distance.split(" 公里")[0]);
      const totalOil = Number(totalDistance) * Number(item.action.oil);

      return {
        totalDistance,
        frequency: userRecords.length,
        totalOil,
      };
    });

    // 計算加總
    const totalSummary = transformedRecords.reduce(
      (acc, record: any) => {
        acc.totalDistance += record.totalDistance;
        acc.totalOil += record.totalOil;
        return acc;
      },
      { totalDistance: 0, totalOil: 0 }
    );

    // 將加總數據放入 transformedRecords
    const finalRecords = {
      totalDistance: totalSummary.totalDistance.toFixed(1),
      totalOil: totalSummary.totalOil.toFixed(0), // 總油耗
      frequency: userRecords.length, // 頻率維持不變
    };
    console.log({ finalRecords });
    setTotalRecord(finalRecords);
  }, [userRecords]);

  // 用於計算 總進度百分比
  useEffect(() => {
    if (!totalRecord) return;

    // 取得對應的數值
    const totalDistance = Math.min(
      Number(totalRecord.totalDistance),
      Number(taskOptions[0].target)
    );
    const totalFrequency = Math.min(
      Number(totalRecord.frequency),
      Number(taskOptions[1].target)
    );
    const totalOil = Math.min(
      Number(totalRecord.totalOil),
      Number(taskOptions[2].target)
    );

    // 計算百分比
    const percentDistance =
      (totalDistance / Number(taskOptions[0].target)) * 100;
    const percentFrequency =
      (totalFrequency / Number(taskOptions[1].target)) * 100;
    const percentOil = (totalOil / Number(taskOptions[2].target)) * 100;

    // 計算有幾個超過 100%
    const overachievedCount = [
      percentDistance,
      percentFrequency,
      percentOil,
    ].filter((percent) => percent >= 100).length;

    // 計算總任務積分
    const totalPoints =
      (percentDistance >= 100 ? Number(taskOptions[0].point) : 0) +
      (percentFrequency >= 100 ? Number(taskOptions[1].point) : 0) +
      (percentOil >= 100 ? Number(taskOptions[2].point) : 0);

    // 計算最終平均百分比
    const averagePercent = Math.floor(
      (percentDistance + percentFrequency + percentOil) / 3
    );
    setTotalPoints(totalPoints);
    setOverachievedCount(overachievedCount);
    setFinalPercent(averagePercent);
  }, [totalRecord]);

  return (
    <div>
      <Row>
        <Col xs={24} className="flex justify-center h-32 w-full">
          <Progress
            percent={finalPercent}
            type="dashboard"
            strokeColor="#FFE3BA"
            format={(percent) => {
              return (
                <>
                  <div>{`${percent}%`}</div>
                  <div>完成進度</div>
                </>
              );
            }}
          >
            進度
          </Progress>
        </Col>

        {taskOptions.map((task: TaskOptions, index) => {
          const taskValues = {
            週累積里程: Number(totalRecord?.totalDistance) || 0,
            週導航次數: Number(totalRecord?.frequency) || 0,
            週油耗總計: Number(totalRecord?.totalOil) || 0,
          } as const; // 讓 TypeScript 知道這些 key 是固定字串

          const currentValue =
            taskValues[task.title as keyof typeof taskValues] ?? 0;
          const targetValue = Number(task.target) || 1;
          const displayValue = Math.min(currentValue, targetValue);
          const percent = Number((displayValue / targetValue) * 100).toFixed(0);

          return (
            <Col xs={24} className="p-4" key={index}>
              <Card className="w-full bg-orange-100 border-2 border-[#FFE3BA] cursor-pointer hover:shadow-md">
                <div className="flex justify-between">
                  <div className="font-bold my-2">{task.title}</div>
                  <div className="text-orange-400 font-bold my-2">
                    {displayValue}/{task.target}
                    {task.title === "週累積里程"
                      ? "km"
                      : task.title === "週導航次數"
                      ? "次"
                      : "元"}
                  </div>
                </div>
                <Progress
                  percent={Number(percent)}
                  type="line"
                  strokeColor="#A1754D"
                ></Progress>
                <Button className="!w-[100px] mt-2 !bg-orange-600 text-white text-xs rounded-none transition-colors hover:!bg-none">
                  <img src={CupIcon} alt="CupIcon" className="w-4 h-4" />
                  {task.point} 積分
                </Button>
              </Card>
            </Col>
          );
        })}

        <Col className="w-full">
          <Card className="m-4 text-center flex flex-col bg-orange-100">
            <div className="text-slate-600 font-bold text-lg flex justify-center items-center">
              <img src={CrownIcon} alt="CrownIcon" className="w-5 h-5" />
              本週成就
            </div>
            <div className="flex flex-row items-center">
              <div className="flex justify-center flex-1 p-2">
                <div>
                  <div className="text-slate-500">完成任務</div>
                  <div className="text-orange-300 font-bold text-xl">
                    {overachievedCount}/3
                  </div>
                </div>
              </div>
              <div className="flex justify-center flex-1 p-2">
                <div>
                  <div className="text-slate-500">累計里程</div>
                  <div className="text-orange-300 font-bold text-xl">
                    {totalRecord?.totalDistance} km
                  </div>
                </div>
              </div>
              <div className="flex justify-center flex-1 p-2">
                <div>
                  <div className="text-slate-500">總任務積分</div>
                  <div className="text-orange-300 font-bold text-xl flex justify-center items-center">
                    <img src={CupIcon} alt="CupIcon" className="w-4 h-4 mr-1" />
                    {totalPoints}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Task;
