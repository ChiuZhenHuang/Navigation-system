import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../firebaseConfig";

interface FormData {
  name: string;
  email: string;
  password: string;
}

export const useGetRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: FormData) => {
    try {
      setLoading(true);

      const { name, email, password } = data;
      const res = await registerUser(name, email, password);
      if (res.success && res.user) {
        console.log("註冊成功資料", res);
        message.success("註冊成功");
        navigate("/login");
      } else {
        message.error("註冊失敗");
        setError("註冊失敗");
      }
    } catch (e: any) {
      console.error(e);
      message.error("註冊失敗");
      setError("註冊失敗");
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
