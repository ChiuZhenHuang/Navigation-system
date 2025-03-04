import { useGetCarTypesQuery } from "@/services/firebaseApi";

export const useSearchCarType = (select: string) => {
  const { data: carTypes } = useGetCarTypesQuery();
  const selectedCar = carTypes?.find((car) => car.carType === select);

  return { selectedCar };
};
