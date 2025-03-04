import { message } from "antd";
import { useNavigate } from "react-router-dom";
import type { LoginData } from "@/types/userType";
import { setUserId, setToken, setUserEmail } from "@/stores/userSlice";
import { useDispatch } from "react-redux";
import { useLoginUserMutation } from "@/services/firebaseApi";
import { FirebaseError } from "firebase/app";

export const useGetLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const login = async (data: LoginData) => {
    try {
      const { email, password } = data;
      const result = await loginUser({ email, password }).unwrap();
      if (result?.success) {
        const { uid, token, email } = result;

        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        document.cookie = `token=${token};expires=${tomorrow.toUTCString()}`;
        document.cookie = `uid=${uid};expires=${tomorrow.toUTCString()}`;

        dispatch(setUserId(uid));
        dispatch(setToken(token));
        dispatch(setUserEmail(email));

        navigate("/layout", { state: { message: "登入成功" }, replace: true });
      } else {
        message.error("登入失敗");
      }
    } catch (error: unknown) {
      console.error("登入錯誤:", error);
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/invalid-credential":
            message.error("無效的帳號密碼");
            break;
          case "auth/user-not-found":
            message.error("此帳號不存在");
            break;
          case "auth/wrong-password":
            message.error("密碼錯誤");
            break;
          default:
            message.error("登入失敗，請稍後再試");
        }
      }
    }
  };

  return { login, isLoading };
};
