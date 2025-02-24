import { useState } from "react";
import { message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginUser } from "@/firebaseConfig";
import type { LoginData } from "@/types/userType";
import { setUserId, setToken } from "@/stores/userSlice";
import { useDispatch } from "react-redux";

export const useGetLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const login = async (data: LoginData) => {
    try {
      setLoading(true);
      const { email, password } = data;
      const res = await loginUser(email, password);
      if (res?.success && res?.user) {
        const token = await res.user.getIdToken();
        const uid = res.user.uid;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.cookie = `token=${token};expires=${tomorrow.toUTCString()}`;
        document.cookie = `uid=${uid};expires=${tomorrow.toUTCString()}`;

        dispatch(setUserId(res.user.uid));
        dispatch(setToken(token));

        messageApi.success("登入成功");
        navigate("/layout");
      } else {
        messageApi.error("登入失敗");
      }
    } catch (e) {
      messageApi.error("登入失敗");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, contextHolder };
};
