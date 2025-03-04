import type { Action } from "@/types/recordType";
import { useSaveUserRecordMutation } from "@/services/firebaseApi";

export const useSaveRecord = () => {
  const [saveUserRecord, { isLoading }] = useSaveUserRecordMutation();

  const handleSave = async (userId: string, action: Action) => {
    try {
      const timestamp = Date.now();
      await saveUserRecord({
        userId,
        action,
        timestamp,
      }).unwrap();
      return { success: true };
    } catch (error) {
      console.error("Error saving record:", error);
      return { success: false, error };
    }
  };

  return { handleSave, isLoading };
};
