import { saveUserRecord } from "@/firebaseConfig";
import type { Action } from "@/types/recordType";
import { message } from "antd";

export const useSaveRedcord = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const handSave = async (id: string, action: Action) => {
    try {
      const getAction = {
        distance: action.distance,
        place: action.place,
        carType: action.carType,
        oil: action.oil,
        time: action.time,
      };
      const timestamp = Date.now();
      await saveUserRecord(id, getAction, timestamp);
      messageApi.success("已儲存資料");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  return { handSave, contextHolder };
};
