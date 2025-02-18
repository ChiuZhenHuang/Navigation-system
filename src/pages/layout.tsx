// import { useState } from "react";
import UserImage from "../assets/images/frog.jpg";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../components/layout/breadCrumb";
import { Layout, Menu, message, Dropdown } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { clearToken } from "../stores/userSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import Button from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useGetUserRecord } from "@/hooks/useGetUserRecord";
import { getCookie } from "@/utils/getCookie";

const { Header, Sider, Content } = Layout;

const LayoutComponent = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();

  const [userId, setUserId] = useState("");
  const { fetchUserRecord, isLoading } = useGetUserRecord();

  useEffect(() => {
    const retrievedUid = getCookie("uid") ?? "";
    const retrievedToken = getCookie("token") ?? "";
    setUserId(retrievedUid);

    if (!retrievedToken) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserRecord(userId);
  }, [userId]);

  const logOutHandler = () => {
    document.cookie = "token=; max-age=0; path=/;";
    document.cookie = "uid=; max-age=0; path=/;";
    dispatch(clearToken());
    navigate("/login");
    messageApi.success("登出成功");
  };

  const items = {
    siderItems: [
      {
        key: "1",
        icon: <UserOutlined />,
        label: "導航",
        onClick: () => navigate("/layout/home"),
      },
      {
        key: "2",
        icon: <VideoCameraOutlined />,
        label: "每周任務",
        onClick: () => navigate("/layout/user-info"),
      },
      {
        key: "3",
        icon: <UploadOutlined />,
        label: "排行榜",
        onClick: () => navigate("/layout/rank"),
      },
      {
        key: "4",
        icon: <LogoutOutlined />,
        label: "LogOut",
        onClick: logOutHandler,
      },
    ],
    navItems: [
      {
        key: "1",
        label: "導航",
        onClick: () => navigate("/layout/home"),
      },
      {
        key: "2",
        label: "每周任務",
        onClick: () => navigate("/layout/user-info"),
      },
      {
        key: "3",
        label: "排行榜",
        onClick: () => navigate("/layout/rank"),
      },
    ],
    userItems: [
      // {
      //   key: "1",
      //   label: "首頁",
      //   onClick: () => navigate("/layout/home"),
      // },
      {
        key: "1",
        label: "個人資訊",
        onClick: () => navigate("/layout/user-info"),
      },
      {
        key: "2",
        label: "登出",
        onClick: logOutHandler,
      },
    ],
  };

  return (
    <Layout className="h-screen">
      {contextHolder}
      <Sider
        trigger={null}
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
      >
        {/* <div className="demo-logo-vertical" /> */}
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          onClick={(e) => {
            if (e.key === "4") {
              logOutHandler();
            }
          }}
          items={items.siderItems}
        />
      </Sider>

      <Layout>
        <Header className="flex items-center justify-between px-0 bg-orange-50 font-bold border-b border-gray-300">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="flex sm:hidden"
          />

          <Menu
            mode="horizontal"
            theme="light"
            defaultSelectedKeys={["1"]}
            className="flex-1 mx-4 justify-end bg-transparent sticky hidden border-0 sm:flex"
            items={items.navItems}
          />

          <Dropdown
            menu={{ items: items.userItems }}
            trigger={["click"]}
            arrow
            placement="bottomRight"
            className="mx-3 cursor-pointer sm:block"
          >
            <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={UserImage}
                alt="UserImage"
                className="object-cover w-full h-full"
              />
            </div>
          </Dropdown>
        </Header>

        <Content className="bg-orange-50 flex-1 overflow-hidden">
          <div className="w-full h-full overflow-hidden">
            <div className="max-w-full h-full whitespace-normal p-4 overflow-hidden">
              <div className="flex flex-col h-full bg-white p-4 shadow-lg rounded-md overflow-hidden">
                <BreadCrumb />
                {isLoading ? (
                  <div>loding...</div>
                ) : (
                  <div className="flex-1 overflow-auto">
                    <Outlet />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default LayoutComponent;
