import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Select from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/method";
import Maps from "@/components/layout/maps";
// import Ai from "./ai";
// import type { ActionResponse } from "@/types/recordType";

const Home = () => {
  const userName = useSelector((state: RootState) => state.user.userName);
  const carTypes = useSelector((state: RootState) => state.carTypes.carTypes); // 所有車款資料
  // const userRecord = useSelector(
  //   (state: RootState) => state.record.totalRecord
  // ); // 所有車款資料

  // const [transformData, setTransformData] = useState<any[]>([]);
  // useEffect(() => {
  //   const transformTravelData = userRecord.map((record: ActionResponse) => {
  //     return {
  //       date: new Date(record.timestamp).toLocaleDateString(), // 轉換時間戳為可讀日期
  //       carType: record.action.carType,
  //       distance: parseFloat(record.action.distance), // 轉換為數字
  //       oil: parseFloat(record.action.oil), // 轉換為數字
  //       place: record.action.place,
  //       time: record.action.time,
  //     };
  //   });

  //   console.log({ transformTravelData });
  //   setTransformData(transformTravelData);
  // }, [userRecord]);

  const [userId, setUserId] = useState("");
  const [selectCarType, setSelectCarType] = useState("Audi A4");

  useEffect(() => {
    const retrievedUid = getCookie("uid") ?? "";
    setUserId(retrievedUid);
  }, []);

  return (
    <div className="sm:p-4">
      <h5 className="my-2 sm:mb-4">
        歡迎
        <span className="font-bold text-base underline mx-1">{userName}</span>
        回來！
        {/* <Ai travelData={transformData} /> */}
      </h5>
      <div className="flex items-center mb-4">
        <span className="min-w-[100px]">選擇您的車款：</span>
        <Select
          className="w-full"
          options={carTypes}
          value={selectCarType}
          onChange={(value) => setSelectCarType(value)}
        />
      </div>

      {/* 導航 */}
      <Maps userId={userId} selectCarType={selectCarType} />
    </div>
  );
};

export default Home;
