import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store.ts";
import App from "./App.tsx";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <ConfigProvider
      theme={{
        // token: { fontSize: 14 },
        components: {
          Layout: {
            siderBg: "#FFE3BA",
          },
          Menu: {
            darkItemBg: "#FFE3BA",
            darkItemHoverBg: "#D49C66",
            darkItemSelectedBg: "#A1754D",
            darkItemColor: "#000000",
          },
        },
      }}
    >
      <App />
    </ConfigProvider>
  </Provider>
);
