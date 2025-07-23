import Rive from "@rive-app/react-canvas";
import { Form, Button, Input } from "antd";
import { useAuth, useAuthActions } from "../../app/hooks";
import { useEffect } from "react";

const LoginPage = () => {
  const auth = useAuth(); // This will automatically load from localStorage!
  const { login } = useAuthActions();

  // Example: Check if already authenticated
  useEffect(() => {
    if (auth.isAuthenticated) {
      console.log("User is already logged in:", auth.userName);
      // Could redirect to dashboard here
    }
  }, [auth.isAuthenticated, auth.userName]);

  const handleLogin = (values: { username: string; password: string }) => {
    // Simulate login API call
    const mockAuthData = {
      role: ["admin"],
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token", 
      userId: 1,
      userName: values.username,
      userMail: `${values.username}@example.com`,
    };
    
    login(mockAuthData);
  };

  return (
    <div className="flex">
      <div className="mt-4">
        <p>Welcome to the Busify Admin Panel</p>
        {auth.isAuthenticated && (
          <p>Welcome back, {auth.userName}!</p>
        )}
        <Rive
          src="/rive/busify-logo.riv"
          stateMachines="busify"
        />
      </div>
      <div>
        <Form onFinish={handleLogin}>
          <Form.Item 
            label="Username" 
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item 
            label="Password" 
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
