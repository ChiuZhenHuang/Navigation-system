import { getCarTypes } from "@/firebaseConfig";
import { setCarTypes } from "@/stores/carTypesSlice";
import { useDispatch } from "react-redux";
import type { CarTypes } from "@/types/carTypes";
import { useState } from "react";

export const useGetCarTypes = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handGetCarTypes = async () => {
    try {
      setIsLoading(true);
      const res = await getCarTypes();
      if (res.data) {
        // console.log("取得所有車款資料", res.data);
        const transformData = res.data.map((item: CarTypes) => {
          return {
            label: item.carType,
            value: item.carType,
            oil: item.oil,
          };
        });
        dispatch(setCarTypes(transformData));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };
  return { handGetCarTypes, isLoading };
};
