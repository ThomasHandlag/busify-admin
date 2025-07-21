import { Button } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import type { ReactNode } from "react";
import { useGNotify } from "../hooks";

const AppLayout = ({ children } : { children: ReactNode}) => {
  const { notify } = useGNotify();
  return (
    <div className="app-layout">
      <Header>
        <h1 className="app-title">Busify Admin Panel</h1>
        <Button type="primary" onClick={() => notify?.info(
          {
            type: "success",
            message: "Notification",
            description: "This is a sample notification.",
            placement: "bottomRight",
          }
        )}>Show notification</Button>
      </Header>
      {/* <Sidebar /> */}
      <main className="app-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;