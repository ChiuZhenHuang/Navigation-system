import {
  ProfileOutlined,
  UserOutlined,
  LogoutOutlined,
  TrophyOutlined,
  RocketOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import BreadCrumb from "../components/layout/breadCrumb";
import { Layout, Menu, message, Dropdown } from "antd";
import { useNavigate, Outlet } from "react-router-dom";
import { clearToken } from "../stores/userSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store";
import Button from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useGetUserRecord } from "@/hooks/useGetUserRecord";
import { getCookie } from "@/utils/method";
import Avatar from "@/components/ui/avatar";
import { useGetUsersData } from "@/hooks/useGetUsersData";
import { useGetCarTypes } from "@/hooks/useGetCarTypes";

const { Header, Sider, Content } = Layout;

const LayoutComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedKey, setSelectedKey] = useState("1"); // 追蹤選中狀態
  const [userId, setUserId] = useState("");
  const { fetchUserRecord, isLoading } = useGetUserRecord();
  const { handGetCarTypes } = useGetCarTypes();

  const firsrName = useSelector((state: RootState) => state.user.firstName);
  const userName = useSelector((state: RootState) => state.user.userName);

  useEffect(() => {
    handGetCarTypes(); // 取所有車款
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

  const { fetchUsersData } = useGetUsersData();

  useEffect(() => {
    fetchUsersData();
  }, []);

  const logOutHandler = () => {
    document.cookie = "token=; max-age=0; path=/;";
    document.cookie = "uid=; max-age=0; path=/;";
    dispatch(clearToken());
    navigate("/login");
    messageApi.success("登出成功");
  };

  // 如果name是(管理員)才可設置車款資料
  const generateUserItems = (userName: string, logOutHandler: () => void) => {
    const baseItems = [
      {
        key: "1",
        label: "登出",
        onClick: logOutHandler,
      },
    ];

    if (userName === "管理員") {
      return [
        {
          key: "2",
          label: "車款設置",
          onClick: () => navigate("/layout/car-type-setting"),
        },
        ...baseItems,
      ];
    }
    return baseItems;
  };

  const items = {
    siderItems: [
      {
        key: "1",
        icon: <RocketOutlined />,
        label: "導航",
        onClick: () => {
          setCollapsed(true), setSelectedKey("1"), navigate("/layout/home");
        },
      },
      {
        key: "2",
        icon: <ProfileOutlined />,
        label: "每週任務",
        onClick: () => {
          setCollapsed(true), setSelectedKey("2"), navigate("/layout/task");
        },
      },
      {
        key: "3",
        icon: <TrophyOutlined />,
        label: "排行榜",
        onClick: () => {
          setCollapsed(true), setSelectedKey("3"), navigate("/layout/rank");
        },
      },
      {
        key: "4",
        icon: <UserOutlined />,
        label: "個人資訊",
        onClick: () => {
          setCollapsed(true),
            setSelectedKey("4"),
            navigate("/layout/user-info");
        },
      },
      {
        key: "5",
        icon: <LogoutOutlined />,
        label: "LogOut",
        onClick: logOutHandler,
      },
    ],
    navItems: [
      {
        key: "1",
        label: <div className="w-[55px] text-center">導航</div>,
        onClick: () => {
          setSelectedKey("1"), navigate("/layout/home");
        },
      },
      {
        key: "2",
        label: <div className="w-[55px] text-center">每週任務</div>,
        onClick: () => {
          setSelectedKey("2"), navigate("/layout/task");
        },
      },
      {
        key: "3",
        label: <div className="w-[55px] text-center">排行榜</div>,
        onClick: () => {
          setSelectedKey("3"), navigate("/layout/rank");
        },
      },
      {
        key: "4",
        label: <div className="w-[55px] text-center">個人資訊</div>,
        onClick: () => {
          setSelectedKey("4"), navigate("/layout/user-info");
        },
      },
    ],
    userItems: generateUserItems(userName, logOutHandler),
  };

  return (
    <Layout className="h-screen">
      {contextHolder}

      <Sider
        trigger={null}
        collapsed={collapsed}
        breakpoint="lg"
        collapsedWidth="0"
        className="fixed h-full z-50 bg-orange-50"
        width="100%"
      >
        <div className="py-2 flex justify-end">
          <Button
            type="text"
            className="flex"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(true)}
          />
        </div>

        <Menu
          theme="light"
          mode="inline"
          defaultSelectedKeys={["1"]}
          selectedKeys={[selectedKey]}
          items={items.siderItems}
        />
      </Sider>

      <Layout>
        <Header className="flex items-center justify-between px-0 bg-orange-50 font-bold border-b border-gray-300">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            className="flex sm:hidden"
          />

          <Menu
            mode="horizontal"
            theme="light"
            defaultSelectedKeys={["1"]}
            selectedKeys={[selectedKey]}
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
            <div className="w-[48px] h-[48px] border-2 border-white rounded-full flex items-center justify-center overflow-hidden">
              <Avatar size={44} className="flex items-center justify-center">
                {firsrName}
              </Avatar>
            </div>
          </Dropdown>
        </Header>

        <Content className="bg-orange-50 flex-1">
          <div className="w-full h-full">
            <div className="max-w-full h-full whitespace-normal sm:p-4">
              <div className="flex flex-col h-full bg-white p-2 shadow-lg sm:rounded-md sm:border">
                <BreadCrumb setSelectedKey={setSelectedKey} />
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
