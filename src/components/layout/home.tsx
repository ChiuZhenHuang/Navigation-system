import { useSelector } from "react-redux";
import { RootState } from "@/store";
import Select from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/method";
import Maps from "@/components/layout/maps";
import { carTypes } from "@/utils/carTypeConfig";

const Home = () => {
  const userName = useSelector((state: RootState) => state.user.userName);
  // const userId = useSelector((state: RootState) => state.user.userId);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const retrievedUid = getCookie("uid") ?? "";
    setUserId(retrievedUid);
  }, []);

  const [selectCarType, setSelectCarType] = useState("BMW X5");

  return (
    <div className="p-4">
      <h5 className="mb-4">
        歡迎 <span className="font-bold">{userName}</span> 回來！
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
