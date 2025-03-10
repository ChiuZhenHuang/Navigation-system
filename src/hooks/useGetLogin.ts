import { useNavigate } from "react-router-dom";
import type { LoginData } from "@/types/userType";
import { setUserId, setToken, setUserEmail } from "@/stores/userSlice";
import { useAppDispatch } from "@/stores/reduxHook";
import { useLoginUserMutation } from "@/services/firebaseApi";
export const useGetLogin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
        throw new Error("登入失敗");
      }
    } catch (error: unknown) {
      console.error("登入錯誤:", error);
      throw error;
    }
  };

  return { login, isLoading };
};
