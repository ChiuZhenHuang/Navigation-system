import { UserOutlined, RobotOutlined, RobotFilled } from "@ant-design/icons";
import { message, Drawer, Flex, type GetProp } from "antd";
import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bubble, Sender, useXAgent, useXChat } from "@ant-design/x";
import Button from "@/components/ui/button";
import { useStore } from "react-redux";
import { RootState } from "@/store";
// import { useAppSelector } from "@/stores/reduxHook";
// import Avatar from "@/components/ui/avatar";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_API_GOOGLE_GENERATIVE_AI_KEY
);

const roles: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    placement: "start",
    avatar: { icon: <RobotOutlined />, style: { background: "#f5c6a5" } },
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
  },
  local: {
    placement: "end",
    avatar: {
      icon: <UserOutlined />,
      style: { background: "#87d068" },
    },
  },
};

const AiChat = () => {
  // const firsrName = useAppSelector((state) => state.user.firstName);

  // const roles: GetProp<typeof Bubble.List, "roles"> = {
  //   ai: {
  //     placement: "start",
  //     avatar: { icon: <RobotOutlined />, style: { background: "#f5c6a5" } },
  //     typing: { step: 5, interval: 20 },
  //     style: {
  //       maxWidth: 600,
  //     },
  //   },
  //   local: {
  //     placement: "end",
  //     avatar: {
  //       icon: <Avatar>{firsrName}</Avatar>,
  //       style: { background: "#d3d3d3" },
  //     },
  //   },
  // };

  const store = useStore<RootState>();

  const [messageApi, contextHolder] = message.useMessage();
  const [content, setContent] = useState("");
  const [visible, setVisible] = useState(false); // 控制 Drawer 顯示與隱藏
  const [isHovered, setIsHovered] = useState(false);

  const [agent] = useXAgent({
    request: async ({ message }, { onSuccess, onError }) => {
      try {
        const model = genAI.getGenerativeModel({
          model: "gemini-2.0-flash",
        });
        // 重新取得所有資料
        const state = store.getState();
        const latestTotalData = state.user.userTotalData;
        const latestUserData = state.record.totalRecord;
        const latestUserName = state.user.userName;
        const latestUserEmail = state.user.email;
        const latestCarTypes = state.carTypes.carTypes;

        const isDataReady =
          latestTotalData &&
          latestUserData &&
          latestUserName &&
          latestUserEmail &&
          latestCarTypes;

        if (!isDataReady) {
          onError(new Error("AI尚未取得資料，請稍後再試"));
          messageApi.error("AI尚未取得資料，請稍後再試");
          return;
        }

        // 將 所有使用者資料 和 當前使用者資料 和 所有車款資料 轉為字串
        const totalDataString = JSON.stringify(latestTotalData, null, 2);
        const userDataString = JSON.stringify(latestUserData, null, 2);
        const carTypesString = JSON.stringify(latestCarTypes, null, 2);

        const prompt = `
          以下是當前使用者的資訊：
          - 使用者名稱: ${latestUserName || "未知"}
          - 電子郵件: ${latestUserEmail || "未知"}
          - 使用者駕駛記錄: \n${userDataString || "無記錄"}\n
          以下是所有使用者的資料（僅在問題需要時參考）：\n${totalDataString}\n
          以下是所有車輛類型資料（僅在問題需要時參考）：\n${carTypesString}\n
          請根據當前使用者的資料回答我的問題：${message}
          如果問題中提到其他使用者，再參考所有使用者的資料。
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        onSuccess(text); // 回傳 AI 的回答
      } catch (error) {
        console.error("AI 回覆發生錯誤:", error);
        onError(new Error("Gemini API 發生錯誤，請稍後再試"));
        messageApi.error("AI 回覆發生錯誤，請稍後再試");
      }
    },
  });

  const { onRequest, messages } = useXChat({
    agent,
    requestPlaceholder: "請輸入訊息...",
    requestFallback: "發送失敗，請稍後再試。",
  });

  return (
    <div>
      {contextHolder}
      <Button
        className="fixed bottom-4 right-4 z-[1000] w-[50px] h-[50px] rounded-full bg-slate-50"
        icon={isHovered ? <RobotFilled /> : <RobotOutlined />}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setVisible(true)}
      />
      <Drawer
        title="AI聊天機器人"
        placement="right"
        closable={true}
        onClose={() => setVisible(false)}
        open={visible}
        width={350}
        styles={{ body: { padding: 0 } }} // 移除 Drawer 內部的預設 padding
      >
        <Flex vertical className="h-full">
          <div className="flex-1 overflow-y-auto p-4">
            <Bubble.List
              roles={roles}
              className="h-full"
              items={messages.map(({ id, message, status }) => ({
                key: id,
                loading: status === "loading",
                role: status === "local" ? "local" : "ai",
                content: message,
              }))}
            />
          </div>

          {/* 輸入框區域 */}
          <div className="p-2 border-t border-gray-200">
            <Sender
              loading={agent.isRequesting()}
              value={content}
              onChange={setContent}
              onSubmit={(nextContent) => {
                onRequest(nextContent);
                setContent("");
              }}
            />
          </div>
        </Flex>
      </Drawer>
    </div>
  );
};

export default AiChat;
