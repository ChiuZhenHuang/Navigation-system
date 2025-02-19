import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useSaveRedcord } from "@/hooks/useSaveRecord";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import { useEffect, useState } from "react";
import { getCookie } from "@/utils/getCookie";
import Maps from "@/components/layout/maps";

const Home = () => {
  const userName = useSelector((state: RootState) => state.user.userName);
  // const userId = useSelector((state: RootState) => state.user.userId);
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const retrievedUid = getCookie("uid") ?? "";
    setUserId(retrievedUid);
  }, []);

  const [selectCarType, setSelectCarType] = useState("BMW X5");

  const carTypes = [
    { value: "Toyota Corolla", label: "Toyota Corolla", oil: "6.5" },
    { value: "Honda Civic", label: "Honda Civic", oil: "6.8" },
    { value: "BMW X5", label: "BMW X5", oil: "9.8" },
    { value: "Mercedes-Benz C300", label: "Mercedes-Benz C300", oil: "8.5" },
    { value: "Ferrari 488", label: "Ferrari 488", oil: "12.4 " },
    { value: "Lamborghini Huracan", label: "Lamborghini Huracan", oil: "13.8" },
    { value: "Nissan Altima", label: "Nissan Altima", oil: " 7.5" },
    { value: "破二手車", label: "破二手車", oil: "15" },
  ];

  const { handSave, contextHolder } = useSaveRedcord();

  return (
    <div className="p-4">
      {contextHolder}
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
      <Maps />
      <Button
        type="primary"
        ghost
        className="m-1"
        onClick={() => {
          const selectedCar = carTypes.find(
            (car) => car.value === selectCarType
          );
          handSave(userId, {
            place: "台北",
            distance: "105",
            carType: selectedCar?.value ?? "未知車款",
            oil: selectedCar?.oil ?? "未知",
          });
        }}
      >
        沒用的home導航按鈕
      </Button>
    </div>
  );
};

export default Home;
