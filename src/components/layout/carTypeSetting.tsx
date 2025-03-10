import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { InputNumber, message } from "antd";
import type { CarTypes } from "@/types/carTypes";
import { useEffect, useState } from "react";
import { useGetCarTypes } from "@/hooks/useGetCarTypes";
import { useUpdateCarType } from "@/hooks/useUpdateCarType";
import { useAddCarType } from "@/hooks/useAddCarType";
import { useAppSelector } from "@/stores/reduxHook";

interface ModifiedData {
  carType: string;
  originalOil: string;
  newOil: string;
}

const CarTypeSetting = () => {
  const [carTypeData, setCarTypeData] = useState<CarTypes[]>([]); // 所有車款資訊
  const [addCar, setAddCar] = useState<CarTypes | null>(null);
  const [modifiedData, setModifiedData] = useState<ModifiedData | null>(null);

  const [messageApi, contextHolder] = message.useMessage();
  const { isLoading: isLoadingCarTypes } = useGetCarTypes();
  const { handleUpdateCarType, isLoading: isUpdating } = useUpdateCarType();
  const { handleAddCarType, isLoading: isAdding } = useAddCarType();

  const totalCarTypes = useAppSelector(
    (state) => state.carTypes.carTypes
  ) as CarTypes[];

  useEffect(() => {
    if (totalCarTypes) {
      const newCarData = totalCarTypes.map((car: CarTypes) => ({
        value: car.value,
        carType: car.value,
        oil: car.oil,
      }));
      setCarTypeData(newCarData);
    }
  }, [totalCarTypes]);

  // 處理油耗改變
  const handleOilChange = (
    index: number,
    value: string,
    carType: string,
    originalOil: string
  ) => {
    if (modifiedData && modifiedData.carType !== carType) {
      messageApi.warning("請先儲存當前修改的數據");
      return;
    }

    const newValue = value || "0";

    const newData = [...carTypeData];
    newData[index].oil = newValue;
    setCarTypeData(newData);

    if (newValue !== originalOil) {
      setModifiedData({
        carType,
        originalOil,
        newOil: newValue,
      });
    } else {
      setModifiedData(null);
    }
  };

  // 保存修改
  const handleSave = async () => {
    if (!modifiedData) {
      messageApi.warning("沒有需要儲存的修改");
      return;
    }
    try {
      const result = await handleUpdateCarType(
        modifiedData.carType,
        modifiedData.newOil
      );

      if (result.success) {
        setModifiedData(null);
        messageApi.success("儲存成功");
      } else {
        messageApi.error("儲存失敗");
      }
    } catch (error) {
      console.error("保存失败:", error);
      messageApi.error("儲存失敗");
    }
  };

  const isInputDisabled = (currentCarType: string): boolean => {
    return (
      isUpdating || (!!modifiedData && modifiedData.carType !== currentCarType)
    );
  };

  // 新增車款設定按鈕
  const handleAddCar = async () => {
    if (modifiedData) {
      messageApi.error("請先將修改車款儲存");
      return;
    }
    if (!addCar) {
      setAddCar({
        value: "",
        carType: "",
        oil: "",
      });
    } else {
      if (!addCar.carType || !addCar.oil) {
        messageApi.error("請完整輸入新增車款");
        return;
      }

      const result = await handleAddCarType(addCar.carType, addCar.oil);
      if (result.success) {
        messageApi.success("新增成功");
        setAddCar(null);
      } else {
        messageApi.error(result.error);
      }
    }
  };

  if (isLoadingCarTypes) {
    return <div>載入中...</div>;
  }

  return (
    <div className="m-2">
      {contextHolder}

      <div className="flex gap-2 my-2">
        <Button
          className="p-1"
          onClick={handleSave}
          disabled={isUpdating || !modifiedData || !!addCar}
        >
          {isUpdating ? "儲存中..." : "儲存"}
        </Button>
        <Button
          className="p-1"
          onClick={handleAddCar}
          disabled={!!modifiedData}
        >
          {isAdding ? "新增中..." : "新增"}
        </Button>
        {!!addCar && (
          <Button className="p-1" onClick={() => setAddCar(null)}>
            取消
          </Button>
        )}
      </div>

      {addCar && (
        <div className="w-full flex flex-col border-b p-2 justify-center items-center sm:flex-row">
          <div className="py-1 w-full flex justify-center items-center sm:p-1">
            <div className="min-w-[45px]">車款：</div>
            <Input
              value={addCar.carType}
              className="flex-1"
              onChange={(e) =>
                setAddCar((prev) => ({
                  ...prev!,
                  value: e.target.value,
                  carType: e.target.value,
                  oil: prev?.oil ?? "",
                }))
              }
            />
          </div>
          <div className="py-1 w-full flex justify-center items-center sm:p-1">
            <div className="min-w-[45px]">油耗：</div>
            <InputNumber
              value={Number(addCar.oil)}
              min={0}
              type="number"
              className="flex-1"
              onChange={(e) =>
                setAddCar((prev) => ({
                  ...prev!,
                  value: prev?.value ?? "",
                  carType: prev?.carType ?? "",
                  oil: String(e),
                }))
              }
            />
          </div>
        </div>
      )}
      {carTypeData.length > 0 ? (
        carTypeData.map((car: CarTypes, index) => {
          const isModified = modifiedData?.carType === car.carType;
          return (
            <div
              className={`w-full flex flex-col border-b p-2 justify-center items-center sm:flex-row ${
                isModified ? "bg-blue-50" : ""
              }`}
              key={index}
            >
              <div className="py-1 w-full flex justify-center items-center sm:p-1">
                <div className="min-w-[45px]">車款：</div>
                <Input value={car.carType} className="flex-1" disabled />
              </div>
              <div className="py-1 w-full flex justify-center items-center sm:p-1">
                <div className="min-w-[45px]">油耗：</div>
                <InputNumber
                  className={`flex-1 ${isModified ? "border-blue-500" : ""}`}
                  value={Number(car.oil)}
                  min={0}
                  onChange={(value) =>
                    handleOilChange(
                      index,
                      String(value),
                      car.carType,
                      totalCarTypes.find((t) => t.value === car.carType)?.oil ||
                        "0"
                    )
                  }
                  type="number"
                  disabled={isInputDisabled(car.carType)}
                />
              </div>
            </div>
          );
        })
      ) : (
        <div>尚無車款資料</div>
      )}
    </div>
  );
};

export default CarTypeSetting;
