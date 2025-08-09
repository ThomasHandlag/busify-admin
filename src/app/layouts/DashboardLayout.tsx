import { Layout } from "antd";
import Sidebar from "../../components/Sidebar";
import DashboardHeader from "../../components/DashboardHeader";
import { useState } from "react";
import { Outlet } from "react-router";

const { Content } = Layout;

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar collapsed={collapsed} />
      <Layout style={{
        marginLeft: collapsed ? 80 : 280,
        transition: 'margin-left 0.2s ease-in-out',
        minHeight: '100vh'
      }}>
        <DashboardHeader collapsed={collapsed} onCollapse={handleCollapse} />
        <Content style={{ 
          padding: '24px',
          backgroundColor: '#f5f5f5',
          overflow: 'auto',
          minHeight: 'calc(100vh - 64px)' // Account for header height
        }}>
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;
