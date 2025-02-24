import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useSearchCarType = (select: string) => {
  const carTypes = useSelector((state: RootState) => state.carTypes.carTypes);
  const selectedCar = carTypes.find((car) => car.value === select);

  return { selectedCar };
};
