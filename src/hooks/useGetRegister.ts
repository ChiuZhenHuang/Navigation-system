import { message } from "antd";
import { useNavigate } from "react-router-dom";
import type { RegisterData } from "@/types/userType";
import { useRegisterUserMutation } from "@/services/firebaseApi";
import { FirebaseError } from "firebase/app";

export const useGetRegister = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const register = async (data: RegisterData) => {
    try {
      const { name, email, password } = data;
      const result = await registerUser({ name, email, password }).unwrap();

      if (result?.success) {
        navigate("/login", {
          state: { message: "註冊成功，請登入" },
          replace: true,
        });
      }
    } catch (error: unknown) {
      console.error("註冊錯誤:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/email-already-in-use":
            messageApi.error("此信箱已被註冊");
            break;
          case "auth/invalid-email":
            messageApi.error("無效的信箱格式");
            break;
          case "auth/weak-password":
            messageApi.error("密碼強度不足");
            break;
          default:
            messageApi.error("註冊失敗，請稍後再試");
        }
      }
    }
  };

  return { register, isLoading, contextHolder };
};
