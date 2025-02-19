import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/loginPage";
import RegisterPage from "@/pages/registerPage";
import Home from "@/components/layout/home";
import UserInfo from "@/components/layout/userInfo";
import Rank from "@/components/layout/rank";
import Task from "@/components/layout/task";
import Layout from "@/pages/layout";
import "antd/dist/reset.css"; // v5版本引入這個就好
import "@/assets/all.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/layout" element={<Layout />}>
          <Route index element={<Navigate to="/layout/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="user-info" element={<UserInfo />} />
          <Route path="rank" element={<Rank />} />
          <Route path="task" element={<Task />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
