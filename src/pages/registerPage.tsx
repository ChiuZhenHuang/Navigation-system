import { Row, Col, Form, message, Spin } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useGetRegister } from "../hooks/useGetRegister";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import type { RegisterData } from "@/types/userType";

const RegisterPage = () => {
  const [form] = Form.useForm();

  const navigate = useNavigate();

  const onFinishFailed = async (errorInfo: any) => {
    console.log("表單驗證失敗:", errorInfo);
    message.error("請檢查資料是否輸入完整");
  };

  const { register, loading } = useGetRegister();
  const onFinish = async (values: RegisterData) => {
    register(values);
  };

  return (
    <div className="bg-orange-100">
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
            className="border border-slate-300 rounded-md bg-orange-200 p-6 max-w-md"
          >
            <div className="flex justify-center font-bold text-2xl my-2">
              會員註冊
            </div>

            <Form.Item
              label="使用者名稱"
              name="name"
              rules={[
                { required: true, message: "請輸入使用者名稱" },
                { min: 3, message: "使用者名稱至少需要3個字元！" },
                { max: 20, message: "使用者名稱最多20個字元！" },
              ]}
            >
              <Input
                placeholder="請輸入使用者名稱"
                prefix={<UserOutlined />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "請輸入Email" },
                { type: "email", message: "Email格式要正確！" },
              ]}
            >
              <Input
                placeholder="請輸入Email"
                prefix={<MailOutlined />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item
              label="密碼"
              name="password"
              rules={[
                { required: true, message: "請輸入密碼" },
                { min: 8, message: "密碼至少需要8個字元！" },
              ]}
            >
              <Input.Password
                placeholder="請輸入密碼"
                prefix={<LockOutlined />}
                className="rounded-full"
              />
            </Form.Item>

            <Form.Item className="mt-14">
              <Button type="primary" htmlType="submit">
                {loading && (
                  <Spin
                    indicator={<LoadingOutlined spin className="text-white" />}
                    size="small"
                  />
                )}
                確定註冊
              </Button>
            </Form.Item>

            <Button onClick={() => navigate("/login")}>返回登入頁面</Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default RegisterPage;
