import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { InputNumber, message } from "antd";
import { useUpdateCarTypes } from "@/hooks/useUpdateCarType";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import type { CarTypesData, CarTypes } from "@/types/carTypes";
import { useEffect, useState } from "react";
import { useGetCarTypes } from "@/hooks/useGetCarTypes";
import { useAddCarTypes } from "@/hooks/useAddCarType";

interface ModifiedData {
  carType: string;
  originalOil: string;
  newOil: string;
}

const CarTypeSetting = () => {
  const [carTypeData, setCarTypeData] = useState<CarTypes[]>([]);
  const [isUpdating, setIsUpdating] = useState(false); // 儲存中
  const [modifiedData, setModifiedData] = useState<ModifiedData | null>(null); // 當前有改油耗的車款
  const [isAdding, setIsAdding] = useState(false); // 新增中
  const [addCar, setAddCar] = useState<CarTypes | null>(null); // 欲新增車款資料

  const totalCarTypes = useSelector(
    (state: RootState) => state.carTypes.carTypes
  ) as CarTypesData[];

  const [messageApi, contextHolder] = message.useMessage();
  const { handGetCarTypes } = useGetCarTypes();
  const { handUpdateCarType } = useUpdateCarTypes();
  const { handAddCarType } = useAddCarTypes();

  useEffect(() => {
    handGetCarTypes();
  }, []);

  useEffect(() => {
    const newCarData = totalCarTypes.map((car: CarTypesData) => {
      return {
        carType: car.value,
        oil: car.oil,
      };
    });
    setCarTypeData(newCarData);
  }, [totalCarTypes]);

  // 處理油耗改變
  const handleOilChange = (
    index: number,
    value: string,
    carType: string,
    originalOil: string
  ) => {
    // 如果有其他已修改尚未保存，先擋住
    if (modifiedData && modifiedData.carType !== carType) {
      message.warning("請先儲存當前修改的數據");
      return;
    }

    const newValue = value || "0";

    // 更新顯示的資料
    const newData = [...carTypeData];
    newData[index].oil = newValue;
    setCarTypeData(newData);

    // 判斷和是否有修改油耗
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
      setIsUpdating(true);
      await handUpdateCarType(
        modifiedData.carType,
        String(modifiedData.newOil)
      );
      // 保存成功后重置當前追蹤資料
      setModifiedData(null);

      await handGetCarTypes();
      messageApi.success("儲存成功");
    } catch (error) {
      console.error("保存失败:", error);
      messageApi.error("儲存失敗");
    } finally {
      setIsUpdating(false);
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
        carType: "",
        oil: "",
      });
    } else {
      // 第二次點擊：檢查並提交資料
      if (!addCar.carType || !addCar.oil) {
        messageApi.error("請完整輸入新增車款");
        return;
      }

      setIsAdding(true);
      const result = await handAddCarType(addCar.carType, addCar.oil);
      if (result.success) {
        messageApi.success("新增成功");
        await handGetCarTypes();
        setAddCar(null);
      } else {
        messageApi.error(result.error);
      }
      setIsAdding(false);
    }
  };
  return (
    <div className="m-2">
      {contextHolder}

      {/* 儲存 / 新增 / 取消 */}
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

      {/* 新增 */}
      {addCar && (
        <div className="w-full flex flex-col border-b p-2 justify-center items-center sm:flex-row">
          <div className="py-1 w-full flex justify-center items-center sm:p-1">
            <div className="min-w-[45px]">車款：</div>
            <Input
              value={addCar.carType}
              className="flex-1"
              onChange={(e) =>
                setAddCar((prev) => ({
                  ...prev,
                  oil: prev?.oil ?? "",
                  carType: e.target.value,
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
                  ...prev,
                  oil: String(e),
                  carType: prev?.carType ?? "",
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
