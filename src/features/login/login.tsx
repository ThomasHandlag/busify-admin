import { Form, Button, Input } from "antd";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router";
import { useState } from "react";

const LoginPage = () => {
  const auth = useAuthStore();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleLogin = (values: { username: string; password: string }) => {
    setLoading(true);
    auth.login({
      username: values.username,
      password: values.password,
      navigate,
    });
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="w-96 mt-4 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Login to Busify</h1>
        <Form onFinish={handleLogin}>
          <Form.Item
            label="Username"
            labelCol={{ span: 24 }}
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            label="Password"
            labelCol={{ span: 24 }}
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <div className="flex justify-between">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                disabled={loading}
              >
                Login
              </Button>
              <Button
                className="underline"
                type="link"
                onClick={() => navigate("/reset-password")}
                disabled={loading}
              >
                Reset password
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
