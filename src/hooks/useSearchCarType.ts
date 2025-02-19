import { carTypes } from "@/utils/carTypeConfig";

export const useSearchCarType = (select: string) => {
  const selectedCar = carTypes.find((car) => car.value === select);
  return selectedCar;
};
