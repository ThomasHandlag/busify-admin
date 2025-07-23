import { useAuth, useAuthActions } from "../../app/hooks";
import { Button, Card, Space, Typography } from "antd";

const { Title, Text } = Typography;

const Dashboard = () => {
  const auth = useAuth();
  const { logout } = useAuthActions();

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ marginBottom: '20px' }}>
        <Title level={2}>Dashboard</Title>
        
        {auth.isAuthenticated ? (
          <Space direction="vertical" size="middle">
            <div>
              <Text strong>Welcome, {auth.userName}!</Text>
              <br />
              <Text>Email: {auth.userMail}</Text>
              <br />
              <Text>Roles: {auth.role.join(', ')}</Text>
            </div>
            
            <Button onClick={logout} danger>
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