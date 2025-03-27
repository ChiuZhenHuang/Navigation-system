import Select from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/method";
import Maps from "@/components/layout/maps";
import { useGetCarTypes } from "@/hooks/useGetCarTypes";
import { useAppSelector } from "@/stores/reduxHook";

const Home = () => {
  const userName = useAppSelector((state) => state.user.userName);

  const { carTypes, isLoading } = useGetCarTypes();

  const [userId, setUserId] = useState("");
  const [selectCarType, setSelectCarType] = useState("");

  useEffect(() => {
    const retrievedUid = getCookie("uid") ?? "";
    setUserId(retrievedUid);
  }, []);

  // 當車型數據載入後，預設選擇車款
  useEffect(() => {
    if (carTypes && carTypes.length > 0 && !selectCarType) {
      setSelectCarType(carTypes[0].value);
    }
  }, [carTypes, selectCarType]);

  if (isLoading) {
    return <div>載入中...</div>;
  }

  return (
    <div className="sm:p-4">
      <h5 className="my-2 sm:mb-4">
        歡迎
        <span className="font-bold text-base underline mx-1">{userName}</span>
        回來！
      </h5>
      <div className="flex items-center mb-4">
        <span className="min-w-[100px]">選擇您的車款：</span>
        <Select
          className="w-full"
          options={carTypes || []}
          value={selectCarType}
          onChange={(value) => setSelectCarType(value)}
          disabled={isLoading}
          placeholder={isLoading ? "載入中..." : "請選擇車款"}
        />
      </div>

      {/* 導航 */}
      <Maps userId={userId} selectCarType={selectCarType} />
    </div>
  );
};

export default Home;
