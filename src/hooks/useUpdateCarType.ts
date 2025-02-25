import { updateCarTypes } from "@/firebaseConfig";

export const useUpdateCarTypes = () => {
  const handUpdateCarType = async (carType: string, oil: string) => {
    try {
      const res = await updateCarTypes(carType, oil);
      if (res) {
        // console.log({ res });
      }
    } catch (e) {
      console.error(e);
    }
  };
  return { handUpdateCarType };
};
