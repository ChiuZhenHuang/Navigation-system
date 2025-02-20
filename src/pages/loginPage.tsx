import { Row, Col, Form, message, Spin } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetLogin } from "../hooks/useGetLogin";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import type { LoginData } from "@/types/userType";
import NavigateImg from "@/assets/images/navigate.png";

const LoginPage = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const { login, loading, contextHolder } = useGetLogin();
  const onFinish = (values: LoginData) => {
    const { email, password } = values;
    login({ email, password });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("表單驗證失敗:", errorInfo);
    message.error("請檢查是否輸入完整");
  };

  return (
    <div className="bg-orange-50">
      {contextHolder}
      <Row justify="center" align="middle" className="h-screen">
        <Col xs={20} sm={16} md={12} xl={8}>
          <Form
            form={form}
            name="login_form"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            requiredMark={false}
            className="border border-slate-300 rounded-3xl bg-slate-50 shadow-lg p-6 max-w-md"
          >
            <div className="flex flex-col justify-center items-center">
              <div className="h-[80px] w-[80px] flex justify-center items-center">
                <img
                  src={NavigateImg}
                  alt={NavigateImg}
                  className="w-full h-full"
                />
              </div>
              <div className="flex justify-center font-bold text-2xl my-2 text-orange-600">
                歡迎使用導航紀錄系統
              </div>
              <div className="flex justify-center text-slate-400 my-2 mb-4">
                請登入開始您的旅程
              </div>
            </div>
            <Form.Item
              // label="Email"
              name="email"
              rules={[
                { required: true, message: "請輸入Email" },
                { type: "email", message: "Email格式要正確！" },
              ]}
            >
              <Input
                placeholder="使用者Email"
                prefix={<UserOutlined />}
                className="rounded-xl p-2 hover:border-orange-500 border"
              />
            </Form.Item>

            <Form.Item
              // label="密碼"
              name="password"
              rules={[
                { required: true, message: "請輸入密碼" },
                { min: 8, message: "密碼至少需要8個字元！" },
              ]}
            >
              <Input.Password
                placeholder="密碼"
                prefix={<LockOutlined />}
                className="rounded-xl p-2 hover:border-orange-500 border"
              />
            </Form.Item>

            <Form.Item className="mt-14">
              <Button
                type="primary"
                htmlType="submit"
                className="p-4 bg-orange-400 transition-colors hover:bg-orange-500/100"
              >
                {loading && (
                  <Spin
                    indicator={<LoadingOutlined spin className="text-white" />}
                    size="small"
                  />
                )}
                Sign In
              </Button>
            </Form.Item>

            <Button
              onClick={() => navigate("/register")}
              className="p-4 bg-white transition-colors !hover:text-orange-100"
            >
              還不是會員? 前往註冊
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
