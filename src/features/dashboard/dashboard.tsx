import { Button, Card, Space, Typography } from "antd";
import { useAuthStore } from "../../stores/authStore";

const { Title, Text } = Typography;

const Dashboard = () => {

  const auth = useAuthStore();
  
  return (
    <div style={{ padding: "20px" }}>
      <Card style={{ marginBottom: "20px" }}>
        <Title level={2}>Dashboard</Title>

        {auth.loggedInUser ? (
          <Space direction="vertical" size="middle">
            <div>
              <Text strong>Welcome, {auth.loggedInUser.userName}!</Text>
              <br />
              <Text>Email: {auth.loggedInUser.userMail}</Text>
              <br />
              <Text>Roles: {auth.loggedInUser.role?.join(", ")}</Text>
            </div>

            <Button onClick={auth.logOut} danger>
              Logout
            </Button>
          </Space>
        ) : (
          <Text>Please log in to access the dashboard.</Text>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
