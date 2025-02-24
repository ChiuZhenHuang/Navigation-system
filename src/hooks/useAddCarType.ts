import { addCarTypes } from "@/firebaseConfig";
import { message } from "antd";

export const useAddCarTypes = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const handAddCarType = async (carType: string, oil: string) => {
    try {
      const res = await addCarTypes(carType, oil);
      if (res) {
        console.log({ res });
        messageApi.success("新增成功！");
      }
    } catch (e) {
      console.error(e);
      messageApi.error("新增失敗！請重新再試");
    }
  };
  return { handAddCarType, contextHolder };
};
