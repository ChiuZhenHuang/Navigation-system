import { addCarTypes } from "@/firebaseConfig";

export const useAddCarTypes = () => {
  const handAddCarType = async (carType: string, oil: string) => {
    try {
      const res = await addCarTypes(carType, oil);
      console.log("新增車款res", res);
      if (res.success) {
        return { success: true };
      } else {
        return { success: false, error: res.error as string };
      }
    } catch (e) {
      console.error(e);
      return { success: false, error: "新增失敗！請重新再試" };
    }
  };

  return { handAddCarType };
};
