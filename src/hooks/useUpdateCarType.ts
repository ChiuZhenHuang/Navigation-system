import { useUpdateCarTypesMutation } from "@/services/firebaseApi";

export const useUpdateCarType = () => {
  const [updateCarType, { isLoading }] = useUpdateCarTypesMutation();

  const handleUpdateCarType = async (carType: string, oil: string) => {
    try {
      await updateCarType({ carType, oil }).unwrap();
      return { success: true };
    } catch (error) {
      console.error("更新車款失敗:", error);
      return { success: false, error };
    }
  };

  return { handleUpdateCarType, isLoading };
};
