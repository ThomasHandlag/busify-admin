import useNotification from "antd/es/notification/useNotification";
import "./App.css";
import { GNotifyContext } from "./app/hooks";
import { Outlet } from "react-router-dom";
import AppLayout from "./app/layouts/AppLayout";
import { WebSocketProvider } from "./stores/WebSocketContext";

function App() {
  const [api, contextHolder] = useNotification();

  return (
    <GNotifyContext.Provider value={{ notify: api }}>
      <WebSocketProvider>
        <AppLayout>
          <Outlet />
        </AppLayout>
      </WebSocketProvider>
      {contextHolder}
    </GNotifyContext.Provider>
  );
}

export default App;
