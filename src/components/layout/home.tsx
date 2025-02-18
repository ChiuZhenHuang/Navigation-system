import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCookie } from "../../utils/getCookie";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const userName = useSelector((state: RootState) => state.user.userName);
  const eamil = useSelector((state: RootState) => state.user.email);

  useEffect(() => {
    const retrievedToken = getCookie("token");
    if (!retrievedToken) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="p-4">
      <div>歡迎 {userName} 回來！</div>
      <div>您的Email：{eamil}</div>
    </div>
  );
};

export default Home;
