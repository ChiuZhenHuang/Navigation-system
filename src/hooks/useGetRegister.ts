import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { registerUser } from "@/firebaseConfig";
import type { RegisterData } from "@/types/userType";

export const useGetRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const register = async (data: RegisterData) => {
    try {
      setLoading(true);

      const { name, email, password } = data;
      const res = await registerUser(name, email, password);
      if (res.success && res.user) {
        // console.log("註冊成功資料", res);
        message.success("註冊成功");
        navigate("/login");
      } else {
        message.error("註冊失敗");
      }
    } catch (e) {
      console.error(e);
      message.error("註冊失敗");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading };
};
