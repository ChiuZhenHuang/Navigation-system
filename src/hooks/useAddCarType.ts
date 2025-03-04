import { useAddCarTypesMutation } from "@/services/firebaseApi";

export const useAddCarType = () => {
  const [addCarType, { isLoading }] = useAddCarTypesMutation();

  const handleAddCarType = async (carType: string, oil: string) => {
    try {
      await addCarType({ carType, oil }).unwrap();
      return { success: true };
    } catch (error: any) {
      console.error("新增車款失敗:", error);
      return { success: false, error: error.message || "新增失敗" };
    }
  };

  return { handleAddCarType, isLoading };
};
