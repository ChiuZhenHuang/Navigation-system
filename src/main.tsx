import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.ts";
import App from "./App.tsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        token: {
          colorPrimaryTextHover: "#FFE3BA",
        },
        components: {
          Layout: {
            siderBg: "rgb(255 ,247 ,237 )",
          },
          Progress: {
            circleTextFontSize: "24", // 文字大小
          },
          Button: {
            defaultHoverBg: "transparent",
          },
          Menu: {
            // light主题配置（主要配置）
            itemBg: "rgb(255, 247, 237)", // 一般背景色
            itemColor: "#000000", // 一般文字颜色

            // hover状态
            itemHoverBg: "#D49C66", // hover时背景色用深色
            itemHoverColor: "#ffffff", // hover时文字颜色用白色
            horizontalItemHoverBg: "#D49C66", // 水平菜单hover背景色
            horizontalItemHoverColor: "#ffffff", // 水平菜单hover文字颜色
            activeBarBorderWidth: 0,
            // selected状态
            itemSelectedBg: "#A1754D", // 选中时背景色用更深色
            itemSelectedColor: "#ffffff", // 选中时文字颜色用白色
            horizontalItemSelectedBg: "#A1754D", // 水平菜单选中背景色
            horizontalItemSelectedColor: "#ffffff", // 水平菜单选中文字颜色

            // dark主题配置（次要配置）
            darkItemBg: "rgb(255, 247, 237)",
            darkItemColor: "#000000",
            darkItemHoverBg: "#D49C66",
            darkItemHoverColor: "#ffffff",
            darkItemSelectedBg: "#A1754D",
            darkItemSelectedColor: "#ffffff",
          },
          Card: {
            headerBg: "#FFE3BA",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);
