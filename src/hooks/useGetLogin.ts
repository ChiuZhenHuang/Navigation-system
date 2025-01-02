import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../firebaseConfig";

interface FormData {
  email: string;
  password: string;
}

export const useGetLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: FormData) => {
    try {
      setLoading(true);
      const { email, password } = data;
      const res = await loginUser(email, password);
      if (res.success && res.user) {
        const token = await res.user.getIdToken();
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.cookie = `token=${token};expires=${tomorrow.toUTCString()}`;
        message.success("登入成功");
        navigate("/layout");
      } else {
        message.error("登入失敗");
        setError("登入失敗");
      }
    } catch (e) {
      console.error(e);
      message.error("登入失敗");
      setError("登入失敗");
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
