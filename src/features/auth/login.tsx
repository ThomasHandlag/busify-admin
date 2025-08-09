import { Form, Button, Input, type FormProps } from "antd";
import { useAuthStore } from "../../stores/auth_store";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useGNotify } from "../../app/hooks";

type LoginFormData = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const auth = useAuthStore();

  const navigate = useNavigate();
  const { notify } = useGNotify();

  const [loading, setLoading] = useState(false);

  const handleLogin: FormProps<LoginFormData>["onFinish"] = async (values) => {
    setLoading(false);
    await auth.login({
      username: values.username,
      password: values.password,
      navigate,
    });

    setLoading(auth.loading);
    if (auth.error) {
      notify?.error({
        type: "error",
        message: "Login failed",
        description: "Please check your username and password.",
        placement: "bottomRight",
      });
    } else {
      notify?.success({
        type: "success",
        message: "Login successful",
        description: "Welcome back!",
        placement: "bottomRight",
      });
    }
  };

  const handleFailed: FormProps<LoginFormData>["onFinishFailed"] = (values) => {
    console.error("Login failed:", values);
    notify?.error({
      type: "error",
      message: "Login failed",
      description: "Please check your username and password.",
      placement: "bottomRight",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full">
      <div className="w-96 mt-4 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold">Login to Busify</h1>
        <Form onFinish={handleLogin} onFinishFailed={handleFailed}>
          <Form.Item
            label="Username"
            labelCol={{ span: 24 }}
            name="username"
            hasFeedback
            validateDebounce={300}
            rules={[
              {
                required: true,
                message: "Please input your username!",
                type: "email",
              },
            ]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item
            label="Password"
            labelCol={{ span: 24 }}
            name="password"
            hasFeedback
            validateDebounce={300}
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
            <div className="mt-4 flex justify-end items-center">
              <span>Don't have an account?</span>
              <Button
                className="underline"
                type="link"
                onClick={() => navigate("/signup")}
                disabled={loading}
              >
                Sign up
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
